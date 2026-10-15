import { CAMERA, HERO } from './config';

/** Field of view for an aspect ratio (wider on portrait screens). */
export const fovFor = (aspect: number): number => (aspect < 1 ? CAMERA.fovPortrait : CAMERA.fov);

/** Intro linear progress (ip) since textures loaded. */
export const introProgress = (start: number | null, now: number, reduced: boolean): number => {
  if (reduced) return 1;
  if (start === null) return 0;
  return Math.min(1, (now - start) / 1000 / HERO.introSeconds);
};

/** Cubic ease-out used for the iris intro (uI). */
export const easeOutCubic = (p: number): number => 1 - Math.pow(1 - p, 3);

/** Light sweep position (uS); repeats roughly every 10 s. */
export const sweepPosition = (elapsedSec: number): number =>
  ((elapsedSec - HERO.sweepDelay) % HERO.sweepPeriod) * HERO.sweepSpeed - HERO.sweepOffset;
