/**
 * Quad fullscreen em clip space: sem matrizes, sem câmara. O mesmo truque do
 * dissolve do preloader.
 */
export const halftoneVert = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`
