"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { halftoneVert } from "@/shaders/halftone.vert"
import { halftoneFrag } from "@/shaders/halftone.frag"
import { resolveCssColor } from "@/lib/cssColor"
import {
  DOT_DRIFT,
  DOT_FOCUS,
  DOT_PUSH,
  DOT_RADIUS,
  DOT_SIZE,
} from "@/lib/manifestoConfig"

/** Canal entre o ponteiro (DOM) e o shader. Não passa pelo React. */
export const halftoneBus = {
  x: -9999,
  y: -9999,
  strength: 0,
  /** 0 em repouso, 1 com a secção centrada — liga a densidade ao scroll. */
  progress: 0,
}

function Plane({ video, poster }: { video: HTMLVideoElement; poster: string | null }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const elapsed = useRef(0)
  const size = useThree((state) => state.size)

  /*
    Com reduced-motion ou `saveData` o vídeo nunca reproduz — e uma
    `VideoTexture` de um vídeo que nunca teve um frame descodificado devolve
    preto. Nesses casos a trama é alimentada pelo poster.
  */
  const texture = useMemo(() => {
    const t = poster
      ? new THREE.TextureLoader().load(poster)
      : new THREE.VideoTexture(video)
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    // Mipmaps numa trama não fazem sentido e custam upload por frame.
    t.generateMipmaps = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [video, poster])

  const uniforms = useMemo(
    () => ({
      uVideo: { value: texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCover: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMouseStrength: { value: 0 },
      uDotSize: { value: DOT_SIZE },
      uFocus: { value: DOT_FOCUS },
      uPush: { value: DOT_PUSH },
      uRadius: { value: DOT_RADIUS },
      uTime: { value: 0 },
      uDrift: { value: 0 },
      uBack: { value: new THREE.Color() },
      uDot: { value: new THREE.Color() },
    }),
    [texture],
  )

  // Cores da secção: as mesmas variáveis que a grelha de fundo global lê, por
  // isso a transição de paleta vinda da About acontece sozinha.
  useEffect(() => {
    const sync = () => {
      const [br, bg, bb] = resolveCssColor("--background", [0.03, 0.03, 0.03])
      const [dr, dg, db] = resolveCssColor("--bg-accent", [0.5, 0.85, 0.9])
      uniforms.uBack.value.setRGB(br, bg, bb, THREE.SRGBColorSpace)
      uniforms.uDot.value.setRGB(dr, dg, db, THREE.SRGBColorSpace)
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    return () => observer.disconnect()
  }, [uniforms])

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height)

    // `cover` calculado aqui e não no shader: o vídeo tem proporção fixa e
    // isto só muda no resize.
    const videoAspect = (video.videoWidth || 16) / (video.videoHeight || 9)
    const screenAspect = size.width / size.height
    if (screenAspect > videoAspect) {
      uniforms.uCover.value.set(1, videoAspect / screenAspect)
    } else {
      uniforms.uCover.value.set(screenAspect / videoAspect, 1)
    }
  }, [size, uniforms, video])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    const u = materialRef.current?.uniforms
    if (!u) return
    elapsed.current += delta
    u.uTime.value = elapsed.current
    // O ponteiro chega em coordenadas de ecrã com origem em baixo, como o
    // `gl_FragCoord`.
    u.uMouse.value.set(halftoneBus.x, halftoneBus.y)
    u.uMouseStrength.value = halftoneBus.strength
    u.uDrift.value = halftoneBus.strength > 0.01 ? 0 : DOT_DRIFT
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={halftoneVert}
        fragmentShader={halftoneFrag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

/**
 * O segundo e último contexto WebGL do site. O primeiro é o do Paper Shaders
 * na hero.
 *
 * O `frameloop` desliga quando a secção sai do ecrã: sem isso o R3F continuava
 * a pedir frames para desenhar algo que ninguém vê.
 */
export default function HalftoneScene({
  video,
  active,
  poster,
}: {
  video: HTMLVideoElement | null
  active: boolean
  /** Quando definido, a trama vem do poster e não do vídeo. */
  poster?: string | null
}) {
  if (!video) return null

  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      // Parado, um frame chega: o poster não muda.
      frameloop={poster ? "demand" : active ? "always" : "never"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
    >
      <Plane video={video} poster={poster ?? null} />
    </Canvas>
  )
}
