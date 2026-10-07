// Audio & Haptic feedback utilities with iOS mobile unlock and clear audible volume

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// Mobile iOS Safari / Chrome Audio Unlocker: iOS requires playing an initial buffer on first user touch
export function unlockAudioOnFirstInteraction() {
  if (typeof window === 'undefined') return;

  const unlock = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // Play tiny buffer to warm up audio pipeline
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);

      if (audioCtx.state === 'running') {
        removeListeners();
      }
    } catch (e) {}
  };

  const removeListeners = () => {
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('touchend', unlock);
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('click', unlock);
  };

  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('touchend', unlock, { passive: true });
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('click', unlock, { passive: true });
}

// Auto-register touch/click listeners
if (typeof window !== 'undefined') {
  unlockAudioOnFirstInteraction();
}

export function isSoundEnabled() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('j316-sound') !== 'false';
}

export function toggleSound() {
  const current = isSoundEnabled();
  localStorage.setItem('j316-sound', String(!current));
  return !current;
}

// Safe execution helper with asynchronous resume support
function playWithAudio(fn) {
  if (!isSoundEnabled() || typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        try {
          if (ctx.state === 'running') {
            fn(ctx);
          }
        } catch (e) {}
      }).catch(() => {});
    } else {
      fn(ctx);
    }
  } catch (e) {}
}

// Crisp, audible bubble pop for buttons & navigation (audible on mobile speakers)
export function playPopSound() {
  playWithAudio((ctx) => {
    const now = ctx.currentTime;
    
    // Main sine body: sweeps 520Hz to 1050Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(520, now);
    osc1.frequency.exponentialRampToValueAtTime(1050, now + 0.11);
    
    gain1.gain.setValueAtTime(0.6, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // Triangle harmonic for acoustic clarity on phone speakers
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1040, now);
    osc2.frequency.exponentialRampToValueAtTime(1900, now + 0.08);

    gain2.gain.setValueAtTime(0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.12);
    osc2.stop(now + 0.09);
  });
}

// Warm harmonic chime for verse reveal & sound toggle
export function playChimeSound() {
  playWithAudio((ctx) => {
    const now = ctx.currentTime;
    // Harmonic notes (E5, G#5, B5, E6)
    const notes = [659.25, 830.61, 987.77, 1318.51];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      
      const startTime = now + idx * 0.08;
      const duration = 0.55;

      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.45, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  });
}

// Joyful celebration chords for decision "OUI" & confetti
export function playCelebrationSound() {
  playWithAudio((ctx) => {
    const now = ctx.currentTime;
    // Major chord arpeggio: C5, E5, G5, C6, E6
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const startTime = now + idx * 0.08;
      const duration = 0.7;

      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  });
}

// Haptic feedback methods (safe on all platforms)
export function hapticLight() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(12);
    } catch (e) {}
  }
}

export function hapticMedium() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(28);
    } catch (e) {}
  }
}

export function hapticSuccess() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([35, 45, 65]);
    } catch (e) {}
  }
}
