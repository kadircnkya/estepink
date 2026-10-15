/**
 * "Night" progress: 0 while the hero photo is fully visible, 1 once it has
 * faded out. Uses the same threshold as HeroPlane / Petals so the WebGL
 * backdrop, CSS ambience and header all transition in lockstep.
 */
export const NIGHT_BG = '#1c0c16';

export function nightProgress(): number {
  if (typeof window === 'undefined') return 0;
  const threshold = Math.max(1, window.innerHeight * 0.75);
  return Math.min(1, Math.max(0, window.scrollY / threshold));
}
