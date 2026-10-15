/**
 * Textures use SRGBColorSpace (correct filtering / mipmaps in linear space).
 * The prototype did all its math on raw sRGB values, so samples are
 * re-encoded to sRGB before applying the original formulas, and the result
 * is written out unchanged — pixel output matches estepink.html.
 */
export const SRGB_GLSL = /* glsl */ `
vec3 epToSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 epTex(sampler2D t, vec2 uv) { return epToSrgb(texture2D(t, uv).rgb); }
`;

export const PLAIN_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
