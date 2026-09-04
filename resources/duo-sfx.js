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
   * Quick smooth whoosh/swipe sound for cards
   */
  playSwipe() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.09);
  }

  /**
   * Selects the highest quality natural/studio voice available for English or Spanish
   */
  getBestVoice(lang = 'en-US') {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Reject old robotic, gravelly, or novelty synthesizers from macOS / system
    const bannedVoices = [
      'bad news', 'good news', 'albert', 'fred', 'ralph', 'junior',
      'deranged', 'whisper', 'zarvox', 'trinoids', 'pipe organ',
      'organ', 'bells', 'boing', 'bubbles', 'cellos', 'hysterical', 'bahh'
    ];

    const isSpanishTarget = lang.toLowerCase().startsWith('es');

    const cleanVoices = voices.filter(v => {
      if (!v.lang) return false;
      const isTargetLang = isSpanishTarget
        ? (v.lang.startsWith('es') || v.lang.includes('es_') || v.lang.includes('es-'))
        : (v.lang.startsWith('en') || v.lang.includes('en_') || v.lang.includes('en-'));
      const isBanned = bannedVoices.some(b => v.name.toLowerCase().includes(b));
      return isTargetLang && !isBanned;
    });

    if (cleanVoices.length === 0) {
      const fallbackVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(isSpanishTarget ? 'es' : 'en'));
      return fallbackVoice || voices[0] || null;
    }

    if (isSpanishTarget) {
      // Prioritize natural Spanish voices (Google Español, Apple Monica/Paulina/Jorge Enhanced)
      const preferredSpanish = [
        'google español',
        'mónica (enhanced)',
        'monica (enhanced)',
        'paulina (enhanced)',
        'jorge (enhanced)',
        'mónica',
        'monica',
        'paulina',
        'jorge',
        'soledad',
        'diego',
        'carlos',
        'angelica',
        'paloma',
        'natural'
      ];
      for (const name of preferredSpanish) {
        const match = cleanVoices.find(v => v.name.toLowerCase().includes(name));
        if (match) return match;
      }
      return cleanVoices.find(v => v.lang === 'es-ES' || v.lang === 'es-MX') || cleanVoices[0];
    }

    // Prioritize ultra-clear, natural modern English voices (Google Neural, Apple Enhanced/Premium)
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
   * Pronounce text using native Browser SpeechSynthesis with studio clarity
   * Supports both English (en-US) and Spanish (es-ES)
   */
  speak(text, langOrRate = 'en-US', rateOpt = 0.92) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop prior speech

    let lang = 'en-US';
    let rate = 0.92;

    if (typeof langOrRate === 'string') {
      lang = langOrRate;
      if (typeof rateOpt === 'number') rate = rateOpt;
    } else if (typeof langOrRate === 'number') {
      rate = langOrRate;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const bestVoice = this.getBestVoice(lang);
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
 * Duolingo-like Speech Recognition with Web Speech API
 * Supports continuous/single-phrase oral production and fallbacks
 */
class DuoSpeechRecognizer {
  constructor() {
    const SpeechAPI = (typeof window !== 'undefined') && (window.SpeechRecognition || window.webkitSpeechRecognition);
    this.isSupported = !!SpeechAPI;
    this.recognition = null;
    this.isListening = false;
    this.currentLang = 'en-US';
    this.onResultCb = null;
    this.onErrorCb = null;
    this.onEndCb = null;
    this.onInterimCb = null;
    this.onStartCb = null;

    if (this.isSupported) {
      try {
        this.recognition = new SpeechAPI();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 4;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.onStartCb) this.onStartCb();
        };

        this.recognition.onresult = (event) => {
          let interimText = '';
          let finalText = '';
          const alternatives = [];

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              if (res[0] && res[0].transcript) {
                finalText = res[0].transcript.trim();
              }
              for (let j = 0; j < res.length; j++) {
                if (res[j] && res[j].transcript) {
                  alternatives.push(res[j].transcript.trim());
                }
              }
            } else {
              if (res[0] && res[0].transcript) {
                interimText += res[0].transcript;
              }
            }
          }

          if (interimText && this.onInterimCb) {
            this.onInterimCb(interimText.trim());
          }

          if (finalText && this.onResultCb) {
            this.onResultCb(finalText, alternatives);
          }
        };

        this.recognition.onerror = (event) => {
          this.isListening = false;
          if (this.onErrorCb) {
            this.onErrorCb(event);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onEndCb) {
            this.onEndCb();
          }
        };
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
        this.isSupported = false;
        this.recognition = null;
      }
    }
  }

  startListening(langCode, onResult, onError, onEnd, onInterim, onStart) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError({ error: 'not_supported' });
      return false;
    }

    if (this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.isListening = false;
    }

    this.currentLang = langCode || 'en-US';
    this.recognition.lang = this.currentLang;
    this.onResultCb = onResult;
    this.onErrorCb = onError;
    this.onEndCb = onEnd;
    this.onInterimCb = onInterim;
    this.onStartCb = onStart;

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Recognition start failed:', err);
      if (onError) onError(err);
      return false;
    }
  }

  stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (e) {}
    this.isListening = false;
  }

  abortListening() {
    if (!this.recognition) return;
    try {
      this.recognition.abort();
    } catch (e) {}
    this.isListening = false;
  }
}

// Global speech recognizer instance ready to use
const duoSpeech = new DuoSpeechRecognizer();
window.duoSpeech = duoSpeech;

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

  const texts = document.querySelectorAll('.themeToggleText');
  texts.forEach(text => {
    text.innerText = (theme === 'dark') ? 'Ativar Modo Claro' : 'Ativar Modo Escuro';
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

