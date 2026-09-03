/**
 * Dissolve por ruído FBM com uma grelha subtil por baixo.
 *
 * Dois uniforms independentes controlam as duas vidas do plano:
 *   uProgress — 0 tapa o ecrã, 1 abre-o por completo (o preloader);
 *   uIdle     — a intensidade com que o mesmo plano fica como fundo do hero.
 * Separá-los evita o caso ambíguo em que o dissolve está aberto mas ainda se
 * quer textura no fundo.
 */
export const dissolveFrag = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uProgress;
uniform float uIdle;
uniform float uSplit;
uniform vec2  uResolution;
uniform vec3  uBg;
uniform vec3  uAccent;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  // Rodar entre oitavas parte o alinhamento axial que o value noise deixa —
  // sem isto veem-se cruzes horizontais e verticais no ruído.
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

/**
 * Grelha de ~1px a cada 64px. A espessura vem da resolução e não de fwidth,
 * para não depender da extensão de derivadas.
 */
float grid(vec2 uv) {
  vec2 cell = uv * uResolution / 64.0;
  vec2 d = abs(fract(cell - 0.5) - 0.5);
  vec2 g = smoothstep(1.0 / 64.0, 0.0, d);
  return max(g.x, g.y);
}

float field(vec2 uv) {
  float n = fbm(uv * 3.2 + vec2(uTime * 0.025, uTime * -0.018));
  return clamp(n + grid(uv) * 0.05, 0.0, 1.0);
}

/** 1 = ainda tapado, 0 = revelado. */
float coverage(vec2 uv, float threshold, float edge) {
  return 1.0 - smoothstep(threshold - edge, threshold + edge, field(uv));
}

void main() {
  vec2 uv = vUv;

  // uProgress 0 -> threshold acima de todo o ruído (nada passa).
  // uProgress 1 -> threshold abaixo de todo o ruído (passa tudo).
  float threshold = mix(1.08, -0.08, uProgress);
  float edge = 0.04;

  float cG = coverage(uv, threshold, edge);
  float cR = cG;
  float cB = cG;

  // Três amostras custam 3x o FBM, por isso só na saída. O ramo é uniforme
  // (uSplit é igual para todos os fragmentos), logo não há divergência.
  if (uSplit > 0.001) {
    vec2 off = vec2(uSplit * 1.5 / uResolution.x, 0.0);
    cR = coverage(uv + off, threshold, edge);
    cB = coverage(uv - off, threshold, edge);
  }

  // Orla emissiva fina, só onde o ruído cruza o threshold.
  float n = field(uv);
  float rim = smoothstep(edge * 2.0, 0.0, abs(n - threshold));
  // Sem isto a orla acende-se de repente com o plano já aberto ou fechado.
  rim *= smoothstep(0.0, 0.08, uProgress) * smoothstep(1.0, 0.92, uProgress);

  vec3 col = uBg;
  float alpha = cG;

  // A franja cromática vive na cor: o alpha é um canal só, não dá para
  // separar por componente.
  col += vec3(cR - cG, 0.0, cB - cG) * 0.6;

  col = mix(col, uAccent, rim * 0.9);
  alpha = max(alpha, rim * 0.9);

  // O mesmo plano, agora como fundo do hero.
  float idleTex = fbm(uv * 2.0 + vec2(uTime * 0.012, uTime * 0.008));
  float idle = idleTex * uIdle;
  col = mix(col, uAccent, idle * 0.25);
  alpha = max(alpha, idle);

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`
