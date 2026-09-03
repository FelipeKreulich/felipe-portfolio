"use client"

import { Canvas } from "@react-three/fiber"
import { usePreloaderStore } from "@/store/usePreloaderStore"
import DissolveOverlay from "@/components/preloader/DissolveOverlay"

/**
 * O único <Canvas> da aplicação. Vive no root layout e é persistente entre
 * rotas — é isto que dá a continuidade visual que o Barba dava em sites
 * multi-página, sem ter de lutar com o router do Next nem com a hidratação.
 *
 * O quad de dissolve nunca desmonta: é a cortina do preloader e depois o
 * fundo do hero.
 */
export default function Scene() {
  const setCanvasReady = usePreloaderStore((state) => state.setCanvasReady)

  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      // Sem limite, um ecrã a 3x triplica os pixels por frame sem diferença
      // visível num shader de ruído.
      dpr={[1, 2]}
      // "always" e não "demand": neste design o plano de dissolve nunca fica
      // parado — sai do preloader e continua como fundo do hero a 15%, com o
      // ruído sempre a andar. Não há fase em repouso que justifique "demand".
      frameloop="always"
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => setCanvasReady(true)}
    >
      <DissolveOverlay />
    </Canvas>
  )
}
