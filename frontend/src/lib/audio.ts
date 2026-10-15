/**
 * Web Audio API based realistic page flip sound generator.
 * Zero external asset dependencies, works offline and across all browsers.
 */

let audioCtx: AudioContext | null = null;

export function playPageFlipSound(): void {
  try {
    if (typeof window === 'undefined') return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;
    const duration = 0.26;

    // 1. Noise buffer for paper texture & friction
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Gentle pink-filtered noise
      let sample = (lastOut + 0.05 * white) / 1.05;
      // Subtle micro-creases/grain
      if (Math.random() > 0.88) {
        sample += (Math.random() - 0.5) * 0.15;
      }
      output[i] = sample;
      lastOut = sample;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    // Bandpass filter for authentic paper rustle frequency profile
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(950, now + duration * 0.55);
    filter.frequency.exponentialRampToValueAtTime(1750, now + duration);
    filter.Q.setValueAtTime(2.2, now);

    // Gain envelope (quick attack, rustle crest, smooth decay)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.24, now + 0.022);
    gainNode.gain.exponentialRampToValueAtTime(0.07, now + 0.14);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // 2. Low-frequency paper air movement / swoosh
    const swooshOsc = ctx.createOscillator();
    swooshOsc.type = 'sine';
    swooshOsc.frequency.setValueAtTime(150, now);
    swooshOsc.frequency.exponentialRampToValueAtTime(80, now + duration);

    const swooshGain = ctx.createGain();
    swooshGain.gain.setValueAtTime(0.001, now);
    swooshGain.gain.linearRampToValueAtTime(0.07, now + 0.035);
    swooshGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Connect noise path
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Connect swoosh path
    swooshOsc.connect(swooshGain);
    swooshGain.connect(ctx.destination);

    // Trigger playback
    noiseNode.start(now);
    swooshOsc.start(now);
    noiseNode.stop(now + duration);
    swooshOsc.stop(now + duration);
  } catch {
    // Gracefully handle browser policy if audio is restricted
  }
}
