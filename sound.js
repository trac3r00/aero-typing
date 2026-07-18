// ── SOUND ENGINE v2 — Web Audio API ──
const SoundEngine = (function() {
  let ctx = null;
  let masterGain = null;
  let bgmPlaying = false;
  let bgmNodes = [];
  let bgmInterval = null;
  let tempo = 130;
  let combo = 0;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(ctx.destination);
  }

  function tone(freq, dur, type, gainVal, delay) {
    if (!ctx) init();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gainVal || 0.15, ctx.currentTime + (delay || 0));
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (delay || 0) + dur);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(ctx.currentTime + (delay || 0));
    osc.stop(ctx.currentTime + (delay || 0) + dur);
  }

  function noise(dur, gainVal) {
    if (!ctx) init();
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 8000;
    g.gain.setValueAtTime(gainVal || 0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(hp);
    hp.connect(g);
    g.connect(masterGain);
    src.start();
  }

  return {
    init,

    keyPress() {
      init();
      noise(0.03, 0.08);
      tone(800 + Math.random() * 400, 0.02, 'square', 0.03);
    },

    correct() {
      init();
      tone(880, 0.08, 'sine', 0.2);
      tone(1100, 0.1, 'sine', 0.15, 0.05);
    },

    incorrect() {
      init();
      tone(200, 0.15, 'sawtooth', 0.1);
      tone(150, 0.2, 'sawtooth', 0.08, 0.05);
    },

    takeoff() {
      init();
      for (let i = 0; i < 8; i++) {
        tone(300 + i * 100, 0.15, 'sine', 0.1, i * 0.06);
      }
      noise(0.5, 0.03);
    },

    landing() {
      init();
      for (let i = 0; i < 5; i++) {
        tone(1200 - i * 150, 0.12, 'sine', 0.12, i * 0.08);
      }
    },

    comboChime(level) {
      init();
      const base = 600 + level * 50;
      tone(base, 0.1, 'sine', 0.2);
      tone(base * 1.25, 0.1, 'sine', 0.15, 0.08);
      tone(base * 1.5, 0.15, 'sine', 0.12, 0.16);
    },

    fanfare() {
      init();
      const notes = [523, 659, 784, 1047, 784, 1047];
      notes.forEach((n, i) => tone(n, 0.2, 'sine', 0.15, i * 0.12));
    },

    boardingChime() {
      init();
      tone(800, 0.15, 'sine', 0.2);
      tone(1000, 0.15, 'sine', 0.15, 0.15);
      tone(1200, 0.2, 'sine', 0.12, 0.3);
    },

    diceRoll() {
      init();
      for (let i = 0; i < 12; i++) {
        noise(0.03, 0.1);
        tone(200 + Math.random() * 600, 0.03, 'square', 0.05, i * 0.04);
      }
    },

    startBgm() {
      if (bgmPlaying) return;
      init();
      bgmPlaying = true;
      combo = 0;
      const playBeat = () => {
        if (!bgmPlaying) return;
        const interval = 60000 / tempo;

        // Kick
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(150, ctx.currentTime);
        kickOsc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        kickGain.gain.setValueAtTime(0.15, ctx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);
        kickOsc.start();
        kickOsc.stop(ctx.currentTime + 0.15);

        // Hi-hat on off-beats
        setTimeout(() => {
          if (!bgmPlaying) return;
          noise(0.04, 0.04);
        }, interval / 2);

        // Arpeggio notes (more layers at higher combo)
        if (combo >= 3) {
          const arpNotes = [330, 392, 494, 587, 659];
          const noteIdx = Math.floor(Math.random() * arpNotes.length);
          tone(arpNotes[noteIdx], 0.08, 'triangle', 0.04, 0.02);
        }

        // Bass synth at higher combos
        if (combo >= 5) {
          const bassNotes = [110, 130.8, 146.8, 164.8];
          tone(bassNotes[Math.floor(Math.random() * bassNotes.length)], 0.1, 'sawtooth', 0.04);
        }

        bgmInterval = setTimeout(playBeat, interval);
      };
      playBeat();
    },

    stopBgm() {
      bgmPlaying = false;
      if (bgmInterval) clearTimeout(bgmInterval);
      bgmInterval = null;
    },

    setCombo(c) {
      combo = c;
      // Speed up tempo with combo
      tempo = Math.min(180, 130 + c * 3);
    }
  };
})();
