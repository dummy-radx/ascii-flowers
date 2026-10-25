// Cute Web Audio API Synthesizer for Sreeparna's ASCII Garden

class CuteSoundSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Play a soft bell/music-box chime (Pentatonic scale notes)
  public playBloom(index = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
    const freq = pentatonic[index % pentatonic.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Soft envelope
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.65);
  }

  // Petal pluck sound
  public playPluck(pitch = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = 440 * pitch;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  // Twinkle / Sparkle sound
  public playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [880, 1174.66, 1318.51, 1567.98, 1760];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.05);
      osc.stop(this.ctx.currentTime + i * 0.05 + 0.35);
    });
  }

  // Kitty purr vibration
  public playPurr() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const mainGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(75, this.ctx.currentTime);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(14, this.ctx.currentTime); // Purr flutter rate
    lfoGain.gain.setValueAtTime(25, this.ctx.currentTime);

    lfo.connect(osc.frequency);

    mainGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.2);
    mainGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    osc.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    lfo.start();
    osc.start();
    lfo.stop(this.ctx.currentTime + 0.85);
    osc.stop(this.ctx.currentTime + 0.85);
  }

  // Fanfare for celebration
  public playCelebration() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5]; // C major
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + 1.25);
    });
  }
}

export const soundSynth = new CuteSoundSynth();
