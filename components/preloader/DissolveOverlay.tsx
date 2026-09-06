"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useProgress } from "@react-three/drei"
import * as THREE from "three"
import { dissolveVert } from "@/shaders/dissolve.vert"
import { dissolveFrag } from "@/shaders/dissolve.frag"
import { dissolveBus } from "@/store/dissolveBus"
import { usePreloaderStore } from "@/store/usePreloaderStore"
import { resolveCssColor } from "@/lib/cssColor"

/**
 * O quad de dissolve. Vive dentro do <Canvas> e nunca desmonta: durante o
 * preloader é a cortina, depois da saída fica como fundo do hero a 15%.
 *
 * Só é importado pelo Scene.tsx, ou seja, só existe dentro do chunk lazy —
 * é isso que mantém o three fora do bundle inicial.
 */
export default function DissolveOverlay() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const elapsed = useRef(0)
  const size = useThree((state) => state.size)
  const setSceneProgress = usePreloaderStore((state) => state.setSceneProgress)
  const { progress, total } = useProgress()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uIdle: { value: 0 },
      uSplit: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBg: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
    }),
    [],
  )

  // Cores do tema. Os tokens estão em oklch, que o shader não lê — o
  // resolveCssColor devolve sRGB, e o setRGB converte para o espaço de
  // trabalho linear. Passar sRGB cru daria uma imagem lavada, porque o
  // renderer volta a converter linear -> sRGB na saída.
  useEffect(() => {
    const sync = () => {
      const [br, bg, bb] = resolveCssColor("--preloader-bg", [0.03, 0.035, 0.04])
      const [ar, ag, ab] = resolveCssColor("--preloader-accent", [0.45, 0.78, 0.88])
      uniforms.uBg.value.setRGB(br, bg, bb, THREE.SRGBColorSpace)
      uniforms.uAccent.value.setRGB(ar, ag, ab, THREE.SRGBColorSpace)
    }

    sync()

    // O tema troca-se pondo e tirando `.dark` no <html>. Sem observar isso o
    // plano ficava com as cores do tema anterior depois do toggle.
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [uniforms])

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height)
  }, [size, uniforms])

  useEffect(() => {
    // Um shader procedural não põe nada na fila do loader. Nesse caso o sinal
    // honesto é o material estar compilado, o que acontece ao primeiro frame.
    setSceneProgress(total === 0 ? 1 : progress / 100)
  }, [progress, total, setSceneProgress])

  useFrame((_, delta) => {
    const u = materialRef.current?.uniforms
    if (!u) return
    // Acumular o delta em vez de usar o state.clock: o THREE.Clock está
    // deprecado desde a r183.
    elapsed.current += delta
    u.uTime.value = elapsed.current
    u.uProgress.value = dissolveBus.progress
    u.uIdle.value = dissolveBus.idle
    u.uSplit.value = dissolveBus.split
  })

  return (
    <mesh frustumCulled={false} renderOrder={999}>
      {/* 2x2 cobre o clip space inteiro; o vertex shader ignora a câmara. */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={dissolveVert}
        fragmentShader={dissolveFrag}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
