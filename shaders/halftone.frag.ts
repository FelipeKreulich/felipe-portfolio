/**
 * Trama de pontos sobre vídeo.
 *
 * O tamanho de cada ponto é função da luminância daquele frame, portanto a
 * trama pulsa com as imagens — não é uma textura colada por cima.
 *
 * Tudo em screen-space (`gl_FragCoord`), nunca em UV: em UV a trama deformava
 * com o aspect ratio do vídeo e deixava de ser uma grelha quadrada.
 */
export const halftoneFrag = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uVideo;
uniform vec2  uResolution;
uniform vec2  uCover;          // correção de aspect, calculada no CPU
uniform vec2  uMouse;          // px, origem no canto inferior esquerdo
uniform float uMouseStrength;  // 0 em repouso, 1 com o cursor na secção
uniform float uDotSize;        // lado da célula, em px de ecrã
uniform float uFocus;          // quanto a grelha afina perto do cursor
uniform float uPush;           // deslocamento radial, em px
uniform float uRadius;         // alcance da influência, em px
uniform float uTime;
uniform float uDrift;          // deriva autónoma, para touch
uniform vec3  uBack;
uniform vec3  uDot;

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec2 p = gl_FragCoord.xy;

  vec2 toMouse = p - uMouse;
  float distance = length(toMouse);

  // Decaimento suave: sem arestas e sem raio duro. É um gradiente de
  // resolução, não uma máscara — é isto que o distingue da revelação da hero.
  float falloff = smoothstep(uRadius, 0.0, distance) * uMouseStrength;

  // 1. Deslocamento radial. Aqui não há texto na imagem, portanto podemos
  //    deformar à vontade.
  vec2 direction = distance > 0.001 ? toMouse / distance : vec2(0.0);
  vec2 pushed = p + direction * uPush * falloff;

  /*
    2. Densidade.

    Em vez de variar o tamanho da célula — o que abriria buracos e
    sobreposições, porque a grelha deixaria de ser regular — expande-se o
    espaço à volta do cursor antes de quantizar. Uma célula de lado fixo num
    espaço esticado aparece mais pequena no ecrã, e a grelha continua contínua.
  */
  float zoom = 1.0 + uFocus * falloff;
  vec2 warped = uMouse + (pushed - uMouse) * zoom;

  vec2 cell = floor(warped / uDotSize);
  vec2 cellCenter = (cell + 0.5) * uDotSize;

  // Volta ao ecrã para saber que pixel do vídeo esta célula amostra.
  vec2 centerScreen = uMouse + (cellCenter - uMouse) / zoom;

  vec2 uv = centerScreen / uResolution;
  // cover: mantém a proporção do vídeo e corta o excesso.
  uv = (uv - 0.5) * uCover + 0.5;
  // Deriva lenta, para a trama não parecer congelada quando não há cursor.
  uv += vec2(sin(uTime * 0.07), cos(uTime * 0.05)) * uDrift;

  float outside = step(uv.x, 0.0) + step(1.0, uv.x) + step(uv.y, 0.0) + step(1.0, uv.y);
  float value = outside > 0.5 ? 0.0 : luma(texture2D(uVideo, uv).rgb);

  // 3. Raio proporcional à luminância. O 0.72 impede que as células mais
  //    claras se toquem e a trama vire uma mancha sólida.
  float radius = value * uDotSize * 0.72;
  float d = length(warped - cellCenter);

  // Aresta suave: sem isto os pontos ficam serrilhados.
  float mask = smoothstep(radius, radius - 1.4, d);

  gl_FragColor = vec4(mix(uBack, uDot, mask), 1.0);
}
`
