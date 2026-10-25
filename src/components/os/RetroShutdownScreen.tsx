import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { PixelPower } from '../ui/RetroIcons';

interface RetroShutdownScreenProps {
  onPowerOn: () => void;
}

export const RetroShutdownScreen: React.FC<RetroShutdownScreenProps> = ({ onPowerOn }) => {
  const { isEn } = useLanguage();
  const [phase, setPhase] = useState<'collapsing' | 'off'>('collapsing');
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPoweringOnRef = useRef<boolean>(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Play CRT power-off capacitor discharge sound
    sound.playCrtOff();

    // 2. Beam collapse duration: 580ms before screen enters unpowered off state
    const collapseTimer = setTimeout(() => {
      setPhase('off');

      // 3. Play user-provided audio /audio/mus_birdnoise.mp3 scaling from 0 volume
      try {
        const audio = new Audio('/audio/mus_birdnoise.mp3');
        audio.loop = true;
        audio.volume = 0;
        bgAudioRef.current = audio;

        audio.play().then(() => {
          // Smooth volume ramp from 0.0 to 0.75 over ~10 seconds accompanying daylight
          let vol = 0;
          const targetVol = 0.75;
          fadeIntervalRef.current = setInterval(() => {
            if (isPoweringOnRef.current) return;
            vol = Math.min(targetVol, vol + 0.038);
            if (audio) {
              audio.volume = vol;
            }
            if (vol >= targetVol && fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }, 450);
        }).catch((err) => {
          console.warn('mus_birdnoise audio play blocked or deferred:', err);
        });
      } catch (e) {
        console.warn('Audio init error:', e);
      }
    }, 580);

    return () => {
      clearTimeout(collapseTimer);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  const handlePowerOn = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isPoweringOnRef.current) return;
    isPoweringOnRef.current = true;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    // Smoothly fade out background audio
    if (bgAudioRef.current) {
      const audio = bgAudioRef.current;
      let currentVol = audio.volume;
      const fadeOutTimer = setInterval(() => {
        currentVol = Math.max(0, currentVol - 0.15);
        audio.volume = currentVol;
        if (currentVol <= 0) {
          clearInterval(fadeOutTimer);
          audio.pause();
          audio.src = '';
        }
      }, 40);
    }

    // Play tactile mechanical power switch click
    sound.playPowerSwitch();

    setTimeout(() => {
      onPowerOn();
    }, 280);
  };

  return (
    <div 
      className="crt-fullscreen-viewport"
      onClick={handlePowerOn}
      onPointerDown={handlePowerOn}
      style={{ cursor: 'pointer' }}
    >
      {/* Curved CRT Tube Canvas - EXACT SAME TUBE CONTAINER AS BOOT ANIMATION */}
      <div className={`crt-fullscreen-tube crt-off-tube ${phase === 'collapsing' ? 'crt-beam-collapsing' : ''}`}>
        
        {/* Beam collapse flash on shutdown */}
        {phase === 'collapsing' && (
          <div className="crt-beam-collapse-flash" />
        )}

        {/* Realistic Daylight Illumination (fades in slowly alongside audio) */}
        {phase === 'off' && (
          <div className="crt-daylight-illumination-container">
            {/* Real photographic window reflection on curved CRT glass */}
            <img 
              src="/images/crt_daylight_glass.webp" 
              alt=""
              className="crt-daylight-photo-reflection"
            />

            {/* Soft warm daylight sun beam angle */}
            <div className="crt-daylight-sun-beam" />

            {/* Convex glass highlight specular sheen */}
            <div className="crt-daylight-convex-sheen" />
          </div>
        )}

        {/* Subtle dark phosphor tube depth */}
        <div className="crt-off-tube-depth" />

        {/* Small minimalist power button - icon only, no text */}
        <div 
          className="crt-minimal-power-btn-anchor"
          onClick={handlePowerOn}
        >
          <button
            className="crt-minimal-power-button"
            title={isEn ? 'Power On' : 'Encender'}
            aria-label={isEn ? 'Power On' : 'Encender'}
            onClick={handlePowerOn}
          >
            <PixelPower size={18} color="#f59e0b" />
          </button>
        </div>
      </div>
    </div>
  );
};

