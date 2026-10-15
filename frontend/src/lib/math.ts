export const clamp = (x: number, min: number, max: number): number => Math.min(max, Math.max(min, x));

/** GLSL-compatible smoothstep (also works with reversed edges). */
export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Opacity of a scroll-driven card for range [a, b] at progress p. */
export const panelOpacity = (a: number, b: number, p: number, fade: number): number =>
  smoothstep(a, a + fade, p) * (1 - smoothstep(b - fade, b, p));
