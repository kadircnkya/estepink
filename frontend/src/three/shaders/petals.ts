/** Falling petals — all motion lives in the vertex shader (no CPU loop). */
export const petalsVertex = /* glsl */ `
attribute vec3 aS;
uniform float uT, uPR, uO;
uniform vec2 uHalf, uPtr;
varying float vA, vR;

void main() {
  float y = mod(aS.y * 2.0 - uT * (0.16 + aS.z * 0.2), 2.0) - 1.0;
  float x = (aS.x * 2.0 - 1.0) + sin(uT * 0.5 + aS.x * 20.0) * 0.07;
  vec2 p = vec2(x, y) * uHalf * 1.08;
  vec2 d = p - uPtr;
  p += normalize(d + vec2(1e-4)) * smoothstep(1.4, 0.0, length(d)) * 0.9;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  gl_PointSize = uPR * (9.0 + aS.z * 20.0);

  vR = aS.x * 6.28 + uT * (0.4 + aS.y);
  vA = smoothstep(1.0, 0.88, abs(y)) * uO * (0.5 + 0.5 * aS.z);
}
`;

export const petalsFragment = /* glsl */ `
varying float vA, vR;

void main() {
  vec2 u = gl_PointCoord - 0.5;
  float c = cos(vR), s = sin(vR);
  u = vec2(c * u.x - s * u.y, s * u.x + c * u.y);
  float a = smoothstep(0.5, 0.28, length(u * vec2(1.0, 1.9)));
  vec3 col = mix(vec3(1.0, 0.5, 0.7), vec3(1.0, 0.84, 0.9), u.y + 0.5);
  gl_FragColor = vec4(col, a * vA);
}
`;
