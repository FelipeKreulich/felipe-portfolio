/**
 * Quad fullscreen sem dependência de câmara: a posição já vai em clip space,
 * por isso não há matriz de projeção nem de view no meio. Isto deixa o plano
 * imune a qualquer coisa que a cena faça à câmara mais tarde.
 */
export const dissolveVert = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`
