import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

interface RetroBootScreenProps {
  onFinish: () => void;
}

export const RetroBootScreen: React.FC<RetroBootScreenProps> = ({ onFinish }) => {
  const { isEn } = useLanguage();
  const [bootStage, setBootStage] = useState<number>(1);
  const [ramProgress, setRamProgress] = useState<number>(4.2);
  const [progress, setProgress] = useState<number>(10);
  const [isCollapsing, setIsCollapsing] = useState<boolean>(false);

  const timerRefs = useRef<NodeJS.Timeout[]>([]);
  const hasFinishedRef = useRef<boolean>(false);
  const bootAudioRef = useRef<HTMLAudioElement | null>(null);
  const bootStartTimeRef = useRef<number>(Date.now());

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const addTimer = (fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timerRefs.current.push(t);
    return t;
  };

  // Perform the CRT beam collapse transition into desktop
  const triggerTransition = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    clearAllTimers();

    // Stop hardware animation audio
    if (bootAudioRef.current) {
      try {
        bootAudioRef.current.pause();
        bootAudioRef.current = null;
      } catch {}
    }

    // Play the harmonic startup audio when animation completes
    sound.playStartup();

    setIsCollapsing(true);

    // Give 500ms for the CRT beam collapse animation before unmounting
    setTimeout(() => {
      onFinish();
    }, 480);
  };

  const handleScreenActivation = () => {
    sound.unlockAudio().catch(() => {});
    if (bootAudioRef.current) {
      bootAudioRef.current.muted = false;
      bootAudioRef.current.volume = 1.0;
      if (bootAudioRef.current.paused) {
        const elapsed = (Date.now() - bootStartTimeRef.current) / 1000;
        try {
          if (bootAudioRef.current.readyState >= 1) {
            bootAudioRef.current.currentTime = Math.min(4.8, Math.max(0, elapsed));
          }
        } catch {}
        bootAudioRef.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    bootStartTimeRef.current = Date.now();

    // 1. Initialize master CRT boot audio track (ensuring previous instance is stopped if restarted)
    if (typeof window !== 'undefined') {
      const w = window as unknown as { __crtBootAudio?: HTMLAudioElement | null };
      if (w.__crtBootAudio) {
        w.__crtBootAudio.pause();
        w.__crtBootAudio = null;
      }
    }

    const audio = new Audio('/audio/crt_boot.mp3');
    audio.preload = 'auto';
    audio.muted = false;
    audio.volume = 1.0;
    bootAudioRef.current = audio;
    if (typeof window !== 'undefined') {
      (window as unknown as { __crtBootAudio?: HTMLAudioElement | null }).__crtBootAudio = audio;
    }

    // Prioritize immediate playback unconditionally
    audio.play().catch(() => {
      // Browser blocked autoplay without gesture
    });
    sound.unlockAudio().catch(() => {});

    // Universal listeners: any user gesture (tap, click, keyup/down) immediately starts & syncs audio
    const activateAudio = () => {
      handleScreenActivation();
    };

    const activationEvents = ['pointerdown', 'mousedown', 'keydown', 'keyup', 'touchstart', 'focus', 'click'];
    activationEvents.forEach((evt) => {
      window.addEventListener(evt, activateAudio, { passive: true });
      document.addEventListener(evt, activateAudio, { passive: true });
    });

    // 2. Stage 2: Display Fastfetch info
    addTimer(() => {
      setBootStage(2);
      setProgress(35);
    }, 500);

    // 3. Stage 3: Memory Count Progress
    addTimer(() => {
      setBootStage(3);
      let r = 4.2;
      const targetRam = 18.12;
      const ramInterval = setInterval(() => {
        r += 1.8;
        if (r >= targetRam) {
          r = targetRam;
          clearInterval(ramInterval);
          setRamProgress(targetRam);
        } else {
          setRamProgress(Number(r.toFixed(2)));
        }
      }, 50);
    }, 900);

    // 4. Stage 4: Floppy Seek & Mount modules
    addTimer(() => {
      setBootStage(4);
      setProgress(75);
    }, 1500);

    // 5. Stage 5: BIOS single POST beep
    addTimer(() => {
      setBootStage(5);
      setProgress(100);
    }, 2200);

    // 6. Stage 6: Automatic transition to desktop when animation finishes
    addTimer(() => {
      triggerTransition();
    }, 2450);

    return () => {
      clearAllTimers();
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, activateAudio);
        document.removeEventListener(evt, activateAudio);
      });
      // Do NOT pause the audio here! Allow the startup chime to ring out cleanly and naturally into the desktop.
    };
  }, []);

  const filledBlocks = Math.round(progress / 5);
  const emptyBlocks = 20 - filledBlocks;
  const progressBarStr = '■'.repeat(filledBlocks) + ' '.repeat(Math.max(0, emptyBlocks));

  return (
    <div className="crt-fullscreen-viewport" onClick={handleScreenActivation} onPointerDown={handleScreenActivation}>
      {/* Curved CRT Tube Canvas */}
      <div 
        className={`crt-fullscreen-tube crt-flicker ${isCollapsing ? 'crt-beam-collapse' : 'crt-beam-turn-on'}`}
      >
        {/* Top Glass Reflection Sheen */}
        <div className="crt-glass-sheen" />

        {/* Scanlines & Rolling Hum Bar */}
        <div className="crt-raster-scanlines" />
        <div className="crt-hum-bar" />

        {/* CRT Content Area (Fastfetch & Boot Stream) */}
        <div 
          className="crt-amber-glow" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            justifyContent: 'space-between',
            fontSize: 'clamp(15px, 1.8vw, 21px)',
            lineHeight: '1.25'
          }}
        >
          {/* Top Command Line & Fastfetch System Box */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span>&gt; fastfetch</span>
              {bootStage === 1 && <span className="crt-cursor" />}
            </div>

            {bootStage >= 2 && (
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '2px', 
                  marginLeft: 'clamp(4px, 1.5vw, 16px)',
                  fontFamily: "'VT323', monospace"
                }}
              >
                {/* Fastfetch ASCII Box - Matching the screenshot */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 3vw, 40px)' }}>
                  <div>
                    <div>┌── user ────────────┐ &nbsp;martin</div>
                    <div>│ ⌘ hname &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │ &nbsp;x4n4</div>
                    <div>│ ◷ os age &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;95 days</div>
                    <div>│ ⏱ uptime &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;4 days, 22 hours, 25 mins</div>
                    <div>│ 󰣇 distro &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;Arch Linux x86_64</div>
                    <div>│ ⚙ kernel &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;Linux 7.2.4-arch1-2</div>
                    <div>│ square wm &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;Mutter (Wayland)</div>
                    <div>│ 🖵 desktop &nbsp; &nbsp; &nbsp; &nbsp; │ &nbsp;GNOME 50.4</div>
                    <div>│ &gt;_ term &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;cool-retro-term</div>
                    <div>│ $ shell &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │ &nbsp;zsh 5.9.2</div>
                    <div>│ 🖳 cpu &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │ &nbsp;AMD Ryzen AI 7 445 (12) @ 2.0 GHz</div>
                    <div>├── disk ────────────┤ &nbsp;697.25 GiB / 852.86 GiB (82%) [btrfs]</div>
                    <div>
                      ├── memory ──────────┤ &nbsp;{ramProgress} GiB / 30.49 GiB {bootStage >= 3 ? '(59%)' : '...'}
                    </div>
                    <div>
                      └── colors ──────────┘ &nbsp;● ● ● ● ● ● ● ●
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 4: Mounting Virtual Portfolio Modules */}
            {bootStage >= 4 && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>~ master*</div>
                <div>
                  {isEn
                    ? '> Mounting projects: [DeltaTraz] [Chumbos] [LidiaHelem] [GLaDOS] [TransResAudio] ... [OK]'
                    : '> Montando proyectos: [DeltaTraz] [Chumbos] [LidiaHelem] [GLaDOS] [TransResAudio] ... [OK]'}
                </div>
                <div>
                  {isEn
                    ? '> Initializing Martín OS window manager (React 19 + Astro)... [READY]'
                    : '> Inicializando gestor de ventanas Martín OS (React 19 + Astro)... [LISTO]'}
                </div>
              </div>
            )}

            {/* Stage 5: POST Beep & Ready */}
            {bootStage >= 5 && (
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                {isEn
                  ? '> POST COMPLETED. STARTING DESKTOP ENVIRONMENT...'
                  : '> POST COMPLETADO. INICIANDO ENTORNO DE ESCRITORIO...'}
              </div>
            )}
          </div>

          {/* Bottom Progress Bar & CRT Skip hint */}
          <div style={{ borderTop: '1px dashed currentColor', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>{isEn ? 'LOADING MARTÍN OS RETRO WORKSTATION...' : 'CARGANDO MARTÍN OS RETRO WORKSTATION...'}</span>
              <span style={{ fontWeight: 'bold' }}>{progress}%</span>
            </div>
            
            <div 
              style={{ 
                border: '1px solid currentColor', 
                padding: '4px 10px', 
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                letterSpacing: '2px',
                background: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>[{progressBarStr}]</span>
              <span className="crt-cursor" />
            </div>

            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '8px',
                fontSize: 'clamp(12px, 1.3vw, 15px)',
                opacity: 0.8
              }}
            >
              <span>
                {isEn
                  ? '(C) 2026 Martín Alejandro Garbiso Ortíz \u2022 Almería, Spain'
                  : '(C) 2026 Martín Alejandro Garbiso Ortíz \u2022 Almería, España'}
              </span>
              <span>{isEn ? 'MARTÍN OS WORKSTATION v2.6 [ONLINE]' : 'MARTÍN OS WORKSTATION v2.6 [EN LÍNEA]'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


