// Web Audio API Sound Utility for Book Open/Close & UI Tech Stack Taps
// Pure client-side synthesis with zero external dependencies and zero latency.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Authentic Book Opening Sound Effect:
 * Simulates the physical acoustic sound of an opening book:
 * 1. Air whoosh / paper fan as the heavy cover swings open.
 * 2. Multi-page crisp paper flutter & friction.
 * 3. Soft wooden / cardboard spine resonance.
 */
export function playBookOpenSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Spine low resonance thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.18);
    oscGain.gain.setValueAtTime(0.16, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);

    // 2. Paper rustle & swoosh (filtered noise burst)
    const bufferSize = Math.floor(ctx.sampleRate * 0.35);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Natural velvet noise decay
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.28);
    filter.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.24, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.35);

    // 3. Staggered secondary page flutter (crisp paper rustle)
    const flutterSize = Math.floor(ctx.sampleRate * 0.2);
    const flutterBuffer = ctx.createBuffer(1, flutterSize, ctx.sampleRate);
    const flutterData = flutterBuffer.getChannelData(0);
    for (let i = 0; i < flutterSize; i++) {
      flutterData[i] = (Math.random() * 2 - 1);
    }

    const flutter = ctx.createBufferSource();
    flutter.buffer = flutterBuffer;

    const flutterFilter = ctx.createBiquadFilter();
    flutterFilter.type = 'highpass';
    flutterFilter.frequency.setValueAtTime(2400, now + 0.06);

    const flutterGain = ctx.createGain();
    flutterGain.gain.setValueAtTime(0.001, now + 0.06);
    flutterGain.gain.linearRampToValueAtTime(0.12, now + 0.09);
    flutterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    flutter.connect(flutterFilter);
    flutterFilter.connect(flutterGain);
    flutterGain.connect(ctx.destination);
    flutter.start(now + 0.06);
    flutter.stop(now + 0.24);
  } catch {
    // Ignore audio context errors gracefully
  }
}

/**
 * Authentic Book Closing Sound Effect:
 * Gentle satisfying paper slap and spine closure.
 */
export function playBookCloseSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Soft cover slap thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);

    // 2. Paper slap snap
    const bufferSize = Math.floor(ctx.sampleRate * 0.15);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.15);
  } catch {
    // Ignore audio context errors gracefully
  }
}

/**
 * Crisp Tactile UI Tap / Tick Sound for Tech Stack Badges:
 * Subtle, satisfying haptic-like click on cursor hover.
 * Debounced to feel buttery smooth even with rapid cursor movements.
 */
let lastTapTime = 0;

export function playTapSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const nowMs = performance.now();
    // Prevent stuttering by enforcing a tiny 40ms cooldown between rapid hovers
    if (nowMs - lastTapTime < 40) return;
    lastTapTime = nowMs;

    const now = ctx.currentTime;

    // Short crisp click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Subtle pitch variation (+/- 5%) makes repeated taps sound organic and tactile
    const baseFreq = 1600 + (Math.random() * 200 - 100);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.022);

    // Gentle, pleasant volume (not harsh)
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  } catch {
    // Ignore audio context errors gracefully
  }
}

