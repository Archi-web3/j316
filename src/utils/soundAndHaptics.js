// Audio & Haptic feedback utilities with gentle, organic sound design

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

// Mobile iOS Safari / Chrome Audio Unlocker
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

// Soft organic tap (gentle wood/bubble sound, calm and non-intrusive)
export function playPopSound() {
  playWithAudio((ctx) => {
    const now = ctx.currentTime;
    
    // Warm, muted acoustic tap (low-mid sine dropping smoothly)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Gentle low pitch drop: 260Hz down to 180Hz (subtle wooden tap)
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);
    
    // Smooth, gentle envelope (peak 0.22, rapid smooth decay)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  });
}

// Serene, gentle chime (warm sine harmonic bells, peaceful and inspiring)
export function playChimeSound() {
  playWithAudio((ctx) => {
    const now = ctx.currentTime;
    // Harmonic notes (G4, C5, E5, G5)
    const notes = [392.00, 523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      const startTime = now + idx * 0.09;
      const duration = 0.65;

      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth attack and long peaceful decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  });
}

// Gentle, uplifting celebration harmony (peaceful acoustic swell)
export function playCelebrationSound() {
  playWithAudio((ctx) => {
    const now = ctx.currentTime;
    // Warm harmonic chords: C4, G4, C5, E5
    const chord = [261.63, 392.00, 523.25, 659.25];

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const startTime = now + idx * 0.1;
      const duration = 0.85;

      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
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
      navigator.vibrate(10);
    } catch (e) {}
  }
}

export function hapticMedium() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(22);
    } catch (e) {}
  }
}

export function hapticSuccess() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([25, 35, 50]);
    } catch (e) {}
  }
}
