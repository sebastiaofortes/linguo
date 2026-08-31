/**
 * Duolingo-like Sound Effects & Speech Synthesis using Web Audio API
 */
class DuoAudioEngine {
  constructor() {
    this.ctx = null;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Warm up voices when ready (especially on Chrome)
      window.speechSynthesis.onvoiceschanged = () => {
        this.getBestVoice();
      };
    }
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
   * Selects the highest quality natural/studio English voice available
   */
  getBestVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Reject old robotic, gravelly, or novelty synthesizers from macOS / system
    const bannedVoices = [
      'bad news', 'good news', 'albert', 'fred', 'ralph', 'junior',
      'deranged', 'whisper', 'zarvox', 'trinoids', 'pipe organ',
      'organ', 'bells', 'boing', 'bubbles', 'cellos', 'hysterical', 'bahh'
    ];

    const cleanVoices = voices.filter(v => {
      const isEnglish = v.lang && (v.lang.startsWith('en') || v.lang.includes('en_') || v.lang.includes('en-'));
      const isBanned = bannedVoices.some(b => v.name.toLowerCase().includes(b));
      return isEnglish && !isBanned;
    });

    if (cleanVoices.length === 0) return voices[0] || null;

    // Prioritize ultra-clear, natural modern voices (Google Neural, Apple Enhanced/Premium)
    const preferredNames = [
      'google us english',
      'samantha (enhanced)',
      'ava (premium)',
      'ava (enhanced)',
      'allison (enhanced)',
      'tom (enhanced)',
      'samantha',
      'ava',
      'allison',
      'serena',
      'karen',
      'daniel',
      'victoria',
      'zoe',
      'moira',
      'fiona',
      'tessa',
      'natural'
    ];

    for (const name of preferredNames) {
      const match = cleanVoices.find(v => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    // Next preference: clean en-US voice avoiding the gravelly legacy Alex voice
    const nonAlex = cleanVoices.find(v => v.lang === 'en-US' && !v.name.toLowerCase().includes('alex'));
    if (nonAlex) return nonAlex;

    return cleanVoices.find(v => v.lang === 'en-US') || cleanVoices[0];
  }

  /**
   * Pronounce English text using native Browser SpeechSynthesis with studio clarity
   */
  speak(text, rate = 0.92) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop prior speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const bestVoice = this.getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

// Global instance ready to use
const duoAudio = new DuoAudioEngine();
window.duoAudio = duoAudio;

/**
 * Global Theme Manager (Dark / Light Mode) with LocalStorage persistence
 */
function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('linguo-theme', theme);
  } catch (e) {}

  const icons = document.querySelectorAll('.themeToggleIcon');
  icons.forEach(icon => {
    icon.innerText = (theme === 'dark') ? '☀️' : '🌙';
  });
}

function toggleTheme() {
  if (window.duoAudio) duoAudio.playTap();
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = (current === 'dark') ? 'light' : 'dark';
  applyTheme(newTheme);
}

window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;

// Initialize theme on script load to prevent flash
(function() {
  try {
    const saved = localStorage.getItem('linguo-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
  } catch (e) {}
})();

// Update icon when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current);
  });
}

