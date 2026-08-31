/**
 * Duolingo-like Sound Effects & Speech Synthesis using Web Audio API
 */
class DuoAudioEngine {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Duolingo Victory Chime (Ascending bright harmonic notes: C5 - E5 - G5 - C6)
   */
  playSuccess() {
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.09);

      gain.gain.setValueAtTime(0.001, startTime + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + index * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.09 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime + index * 0.09);
      osc.stop(startTime + index * 0.09 + 0.35);
    });
  }

  /**
   * Gentle incorrect feedback sound (Downward muffled notes)
   */
  playError() {
    this.initContext();
    if (!this.ctx) return;

    const notes = [311.13, 261.63]; // Eb4 down to C4
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.15);

      gain.gain.setValueAtTime(0.001, startTime + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + index * 0.15 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.15 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime + index * 0.15);
      osc.stop(startTime + index * 0.15 + 0.28);
    });
  }

  /**
   * Light tactile tap sound
   */
  playTap() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.05);
  }

  /**
   * Pronounce English text using native Browser SpeechSynthesis
   */
  speak(text, rate = 0.9) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop prior speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Bad'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

// Global instance ready to use
const duoAudio = new DuoAudioEngine();
window.duoAudio = duoAudio;
