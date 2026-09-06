"use client"

/*
  Fundo do contacto — Galaxy, do React Bits, copiado com três alterações:

  1. "use client" (o original vem de um projeto Vite, sem fronteiras de
     servidor/cliente).
  2. Movimento reduzido e visibilidade: o original corre requestAnimationFrame
     para sempre. Aqui, com `prefers-reduced-motion`, pinta-se um único frame
     estático; sem isso, um IntersectionObserver põe o loop em pausa quando a
     secção sai do ecrã.
  3. `focal` e `rotation` por omissão deixam de ser literais no parâmetro —
     ver DEFAULT_FOCAL/DEFAULT_ROTATION abaixo.

  Os shaders e a matemática ficam exactamente como vieram.
*/

import { Renderer, Program, Mesh, Color, Triangle } from "ogl"
import { useEffect, useRef } from "react"
import { useMotionPrefs } from "@/components/ReducedMotion"

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform float uLightMode;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    float coverage = clamp(smoothstep(0.0, 0.42, energy) * 0.92, 0.0, 0.92);
    vec3 ink = clamp(col * 0.48, 0.0, 0.82);
    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage), 1.0);
  } else if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`

interface GalaxyProps {
  focal?: [number, number]
  rotation?: [number, number]
  starSpeed?: number
  density?: number
  hueShift?: number
  disableAnimation?: boolean
  speed?: number
  mouseInteraction?: boolean
  glowIntensity?: number
  saturation?: number
  mouseRepulsion?: boolean
  twinkleIntensity?: number
  rotationSpeed?: number
  repulsionStrength?: number
  autoCenterRepulsion?: number
  transparent?: boolean
  lightMode?: boolean
}

/*
  Constantes de módulo e não literais no valor por omissão do parâmetro: um
  array por omissão em JavaScript é recriado a cada chamada da função, o que
  bastava para o array "focal" (ou "rotation") entrar nas dependências do
  efeito como referência nova a cada render — e o efeito reconstruía o
  renderer WebGL inteiro nesse ciclo. Ninguém neste site passa focal/rotation
  explícitos, por isso hoistar os valores por omissão cobre o caso real sem
  tirar os dois props da API pública.
*/
const DEFAULT_FOCAL: [number, number] = [0.5, 0.5]
const DEFAULT_ROTATION: [number, number] = [1.0, 0.0]

export default function Galaxy({
  focal = DEFAULT_FOCAL,
  rotation = DEFAULT_ROTATION,
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  lightMode = false,
  ...rest
}: GalaxyProps) {
  const ctnDom = useRef<HTMLDivElement>(null)
  const targetMousePos = useRef({ x: 0.5, y: 0.5 })
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 })
  const targetMouseActive = useRef(0.0)
  const smoothMouseActive = useRef(0.0)
  const { reducedMotion, resolved } = useMotionPrefs()

  useEffect(() => {
    // `resolved` só fica verdadeiro depois de o cliente ler as prefs de
    // movimento — arrancar antes disso arriscava montar o loop e desmontá-lo
    // no frame seguinte assim que `reducedMotion` chegasse a `true`.
    if (!resolved || !ctnDom.current) return
    const ctn = ctnDom.current
    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
    })
    const gl = renderer.gl

    if (lightMode) {
      gl.clearColor(1, 1, 1, 1)
    } else if (transparent) {
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
    } else {
      gl.clearColor(0, 0, 0, 1)
    }

    // Dimensiona o canvas antes do `Program` existir — o uniform de
    // resolução lê `gl.canvas.width/height` na própria criação, por isso o
    // tamanho tem de estar certo primeiro.
    const scale = 1
    function sizeCanvas() {
      renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale)
    }
    sizeCanvas()

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: {
          value: new Float32Array([smoothMousePos.current.x, smoothMousePos.current.y]),
        },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uTransparent: { value: transparent },
        uLightMode: { value: lightMode ? 1 : 0 },
      },
    })

    function resize() {
      sizeCanvas()
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      )
      // Sem loop a correr (movimento reduzido), o resize por si só não
      // repinta — sem isto, rodar o ecrã deixava o fundo esticado até à
      // próxima mudança de secção.
      if (reducedMotion) frame(0)
    }
    window.addEventListener("resize", resize, false)

    const mesh = new Mesh(gl, { geometry, program })
    let animateId: number | null = null
    let running = false

    function frame(t: number) {
      if (!disableAnimation) {
        program.uniforms.uTime.value = t * 0.001
        program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0
      }

      const lerpFactor = 0.05
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor
      smoothMouseActive.current += (targetMouseActive.current - smoothMouseActive.current) * lerpFactor

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current

      renderer.render({ scene: mesh })
    }

    function loop(t: number) {
      frame(t)
      animateId = requestAnimationFrame(loop)
    }

    function start() {
      if (running) return
      running = true
      animateId = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      if (animateId !== null) cancelAnimationFrame(animateId)
      animateId = null
    }

    ctn.appendChild(gl.canvas)

    /*
      O rato é escutado na janela, não no contentor.

      O original escutava em `ctn`, mas quem monta este componente põe-lhe
      `pointer-events-none` — é o que deixa as ligações do contacto
      continuarem clicáveis através do fundo. Um elemento com
      `pointer-events-none` nunca recebe eventos de rato, portanto a
      interação simplesmente não acontecia.

      Escutando na janela e projetando as coordenadas na caixa do contentor,
      as duas coisas passam a ser verdade ao mesmo tempo: o fundo reage ao
      rato e não rouba um único clique.
    */
    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height

      // Fora da secção não há repulsão: sem isto o campo continuava a ser
      // puxado por um cursor que já vai a meio da página seguinte.
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        targetMouseActive.current = 0.0
        return
      }

      targetMousePos.current = { x, y }
      targetMouseActive.current = 1.0
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0
    }

    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      window.addEventListener("blur", handleMouseLeave)
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    let io: IntersectionObserver | undefined

    if (reducedMotion) {
      // Um frame estático e nada de loop: para quem pediu menos movimento, o
      // fundo do contacto não é uma segunda animação WebGL a correr para
      // sempre por trás do texto.
      frame(0)
    } else {
      // O contacto pode já ter saído do ecrã (visitante no olho ou no
      // rodapé) sem o componente desmontar — pausar aqui poupa um loop WebGL
      // inteiro a desenhar fora da vista.
      io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
      io.observe(ctn)
    }

    return () => {
      stop()
      io?.disconnect()
      window.removeEventListener("resize", resize)
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("blur", handleMouseLeave)
        document.removeEventListener("mouseleave", handleMouseLeave)
      }
      ctn.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [
    resolved,
    reducedMotion,
    focal,
    rotation,
    starSpeed,
    density,
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity,
    saturation,
    mouseRepulsion,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
    lightMode,
  ])

  return <div ref={ctnDom} className="relative h-full w-full" {...rest} />
}
