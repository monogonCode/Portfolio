class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isSuspended(): boolean {
    if (typeof window === 'undefined') return false;
    const ctx = this.getContext();
    return !ctx || ctx.state === 'suspended';
  }

  public async unlockAudio(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const ctx = this.getContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume rejected:', err);
      }
    }
    return ctx.state === 'running';
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playClick();
    }
    return this.enabled;
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio context might be restricted before first user interaction
    }
  }

  public playWindowOpen() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignored
    }
  }

  public playWindowClose() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignored
    }
  }

  public playError() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Chord like Windows Ding
      const freqs = [440, 554.37, 659.25];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Ignored
    }
  }

  public playSnap() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignored
    }
  }

  public playStartup() {
    if (!this.enabled) return;
    try {
      if (typeof window !== 'undefined') {
        const audio = new Audio('/audio/bootFinish.mp3');
        audio.volume = 0.28;
        audio.play().catch(() => {
          this.playSynthStartupFallback();
        });
        return;
      }
    } catch {
      this.playSynthStartupFallback();
    }
  }

  private playSynthStartupFallback() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Nostalgic retro boot synth chime
      const notes = [
        { freq: 261.63, time: 0.0, dur: 0.8 }, // C4
        { freq: 329.63, time: 0.1, dur: 0.8 }, // E4
        { freq: 392.0, time: 0.2, dur: 0.9 }, // G4
        { freq: 523.25, time: 0.3, dur: 1.2 } // C5
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(0.12, now + n.time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch {
      // Ignored
    }
  }

  public playKeypress() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(950 + Math.random() * 150, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch {
      // Ignored
    }
  }

  /**
   * Heavy mechanical power toggle switch CLACK sound
   */
  public playPowerSwitch() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Low plastic thunk
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.05);

      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // 2. High metallic snap spring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1800, now);
      osc2.frequency.exponentialRampToValueAtTime(400, now + 0.025);

      gain2.gain.setValueAtTime(0.18, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.025);
    } catch {
      // Ignored
    }
  }

  /**
   * Authentic CRT Degauss coil resonant hum + 15kHz flyback transformer whine
   */
  public playDegauss() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Primary 58Hz & 118Hz degaussing resonant coil hum
      [58, 118].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + idx * 2, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, now + 1.2);

        gain.gain.setValueAtTime(0.25 - idx * 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      });

      // Cathode flyback high frequency 15.6 kHz whistle (subtle)
      const flybackOsc = ctx.createOscillator();
      const flybackGain = ctx.createGain();
      flybackOsc.type = 'sine';
      flybackOsc.frequency.setValueAtTime(15400, now);

      flybackGain.gain.setValueAtTime(0.001, now);
      flybackGain.gain.linearRampToValueAtTime(0.015, now + 0.3);
      flybackGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      flybackOsc.connect(flybackGain);
      flybackGain.connect(ctx.destination);
      flybackOsc.start(now);
      flybackOsc.stop(now + 1.8);
    } catch {
      // Ignored
    }
  }

  /**
   * Fast RAM memory test count tick sound
   */
  public playMemoryTick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100 + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.012);
    } catch {
      // Ignored
    }
  }

  /**
   * Vintage 3.5" / 5.25" floppy drive stepper seek sound (trrr-clack)
   */
  public playFloppySeek() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 4 rapid stepper motor pulses
      for (let i = 0; i < 4; i++) {
        const pTime = now + i * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(180 + (i % 2) * 50, pTime);

        gain.gain.setValueAtTime(0.06, pTime);
        gain.gain.exponentialRampToValueAtTime(0.001, pTime + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(pTime);
        osc.stop(pTime + 0.035);
      }
    } catch {
      // Ignored
    }
  }

  /**
   * Classic IBM / Award BIOS single POST beep (896Hz square wave)
   */
  public playBiosBeep() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(896, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.setValueAtTime(0.14, now + 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Ignored
    }
  }

  /**
   * Vintage CRT Monitor power-off capacitor discharge and switch snap
   */
  public playCrtOff() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Mechanical switch click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(140, now);
      clickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.04);
      clickGain.gain.setValueAtTime(0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      // 2. Flyback transformer & yoke magnetic field collapse ("peeee-owww")
      const collapseOsc = ctx.createOscillator();
      const collapseGain = ctx.createGain();
      collapseOsc.type = 'sine';
      collapseOsc.frequency.setValueAtTime(15400, now);
      collapseOsc.frequency.exponentialRampToValueAtTime(80, now + 0.55);
      collapseGain.gain.setValueAtTime(0.12, now);
      collapseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      collapseOsc.connect(collapseGain);
      collapseGain.connect(ctx.destination);
      collapseOsc.start(now);
      collapseOsc.stop(now + 0.6);

      // 3. Phosphor residual spark / hum drop
      const humOsc = ctx.createOscillator();
      const humGain = ctx.createGain();
      humOsc.type = 'sawtooth';
      humOsc.frequency.setValueAtTime(100, now);
      humOsc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
      humGain.gain.setValueAtTime(0.08, now);
      humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      humOsc.connect(humGain);
      humGain.connect(ctx.destination);
      humOsc.start(now);
      humOsc.stop(now + 0.45);
    } catch {
      // Ignored
    }
  }



  // Procedural Nature Soundscape (Soft Wind & Nocturnal Crickets)
  private natureGain: GainNode | null = null;
  private natureCleanup: (() => void) | null = null;
  private natureActive: boolean = false;

  /**
   * Starts procedural nature ambience (wind + crickets) scaling smoothly from 0 volume
   * @param rampSeconds Duration in seconds to ramp from 0 to full ambient level
   */
  public startNatureSounds(rampSeconds: number = 8) {
    if (this.natureActive) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      this.natureActive = true;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      // Ramp smoothly up to target relaxing ambient volume (0.35)
      masterGain.gain.exponentialRampToValueAtTime(0.35, now + Math.max(1, rampSeconds));
      masterGain.connect(ctx.destination);
      this.natureGain = masterGain;

      // --- 1. Soft Forest Breeze / Wind Generation (Filtered Pink Noise Loop) ---
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(420, now);
      windFilter.Q.setValueAtTime(1.4, now);

      // Low-frequency oscillator for breathing wind gust swells
      const windLfo = ctx.createOscillator();
      const windLfoGain = ctx.createGain();
      windLfo.type = 'sine';
      windLfo.frequency.setValueAtTime(0.18, now); // ~5.5 second gentle swell cycle
      windLfoGain.gain.setValueAtTime(220, now);
      windLfo.connect(windFilter.frequency);

      noiseSource.connect(windFilter);
      windFilter.connect(masterGain);

      noiseSource.start(now);
      windLfo.start(now);

      // --- 2. Nocturnal Crickets / Gentle Night Insects ---
      // High-resonant oscillator pair pulsing with AM modulation
      const cricketOsc1 = ctx.createOscillator();
      const cricketOsc2 = ctx.createOscillator();
      cricketOsc1.type = 'sine';
      cricketOsc2.type = 'sine';
      cricketOsc1.frequency.setValueAtTime(4580, now);
      cricketOsc2.frequency.setValueAtTime(4920, now);

      const cricketBand = ctx.createBiquadFilter();
      cricketBand.type = 'bandpass';
      cricketBand.frequency.setValueAtTime(4750, now);
      cricketBand.Q.setValueAtTime(5.0, now);

      // Amplitude modulation for cricket pulse (rhythmic chirp rhythm)
      const chirpMod = ctx.createOscillator();
      const chirpModGain = ctx.createGain();
      chirpMod.type = 'triangle';
      chirpMod.frequency.setValueAtTime(3.8, now); // 3.8 chirps per group

      // Macro envelope: pause between chirp bursts (every 2.2s)
      const burstLfo = ctx.createOscillator();
      const burstGain = ctx.createGain();
      burstLfo.type = 'sine';
      burstLfo.frequency.setValueAtTime(0.45, now);
      burstGain.gain.setValueAtTime(0.04, now);

      const cricketMasterGain = ctx.createGain();
      cricketMasterGain.gain.setValueAtTime(0.05, now);

      cricketOsc1.connect(cricketBand);
      cricketOsc2.connect(cricketBand);
      cricketBand.connect(cricketMasterGain);
      chirpMod.connect(cricketMasterGain.gain);
      cricketMasterGain.connect(masterGain);

      cricketOsc1.start(now);
      cricketOsc2.start(now);
      chirpMod.start(now);
      burstLfo.start(now);

      this.natureCleanup = () => {
        try {
          noiseSource.stop();
          windLfo.stop();
          cricketOsc1.stop();
          cricketOsc2.stop();
          chirpMod.stop();
          burstLfo.stop();
          noiseSource.disconnect();
          windFilter.disconnect();
          cricketMasterGain.disconnect();
          masterGain.disconnect();
        } catch {}
      };
    } catch {
      // Ignored
    }
  }

  /**
   * Stops procedural nature ambience smoothly fading out
   * @param fadeSeconds Duration to fade to 0 volume
   */
  public stopNatureSounds(fadeSeconds: number = 0.5) {
    if (!this.natureActive) return;
    this.natureActive = false;
    try {
      const ctx = this.getContext();
      if (ctx && this.natureGain) {
        const now = ctx.currentTime;
        this.natureGain.gain.cancelScheduledValues(now);
        this.natureGain.gain.setValueAtTime(this.natureGain.gain.value, now);
        this.natureGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds);
      }
    } catch {}

    setTimeout(() => {
      if (this.natureCleanup) {
        this.natureCleanup();
        this.natureCleanup = null;
      }
      this.natureGain = null;
    }, fadeSeconds * 1000 + 50);
  }
}

export const sound = new SoundEngine();

