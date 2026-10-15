import { HERO } from '../../lib/config';
import { PLAIN_VERTEX, SRGB_GLSL } from './common';

const f = (n: number): string => (Number.isInteger(n) ? n.toFixed(1) : String(n));

export const heroVertex = PLAIN_VERTEX;

/**
 * Hero: cover-fit photo -> zoom -> cross-fade to poster, light sweep,
 * cursor glow and the circular iris intro with a white rim.
 */
export const heroFragment = /* glsl */ `
uniform sampler2D a;
uniform sampler2D b;
uniform float uAsp, uO, uX, uY, uI, uZ, uS, uH;
uniform vec2 uPt;
varying vec2 vUv;
${SRGB_GLSL}

vec2 cov(vec2 u, float img) {
  vec2 s = uAsp > img ? vec2(1.0, img / uAsp) : vec2(uAsp / img, 1.0);
  return (u - 0.5) * s + 0.5;
}

void main() {
  vec2 o = vec2(uX, uY) * 0.025;
  float mB = smoothstep(0.45, 0.95, uZ);

  float k = (0.92 - 0.09 * (1.0 - uI)) / (1.0 + uZ * 1.5);
  vec3 A = epTex(a, cov(0.5 + (vUv - 0.5) * k, ${f(HERO.heroAspect)}) + o);
  vec3 B = epTex(b, cov(0.5 + (vUv - 0.5) * mix(0.55, 0.92, mB) * (1.0 - 0.12 * uH), ${f(HERO.posterAspect)}) + o);
  vec3 c = mix(A, B, mB);

  // light sweep
  float lum = dot(c, vec3(0.3, 0.59, 0.11));
  float d = vUv.x + vUv.y * 0.35 - uS;
  float band = exp(-d * d * 50.0);
  c += band * (vec3(1.0, 0.93, 0.85) * 0.1 + c * pow(lum, 2.0) * 0.7);

  // cursor glow
  vec2 e = vUv - uPt;
  float g = exp(-dot(e * e, vec2(uAsp * uAsp, 1.0)) * 9.0);
  c = c * (1.0 + 0.12 * g) + g * 0.03 * vec3(1.0, 0.9, 0.8);

  // iris intro
  float dd = length((vUv - 0.5) * vec2(uAsp, 1.0));
  float R = uI * (length(vec2(uAsp, 1.0)) * 0.5 + 0.2);
  float m = smoothstep(R, R - 0.12, dd);
  float ring = smoothstep(R - 0.2, R - 0.04, dd) * m * (1.0 - uI);
  c = mix(c, vec3(1.0), ring * 0.55);

  gl_FragColor = vec4(c, m * uO);
}
`;
