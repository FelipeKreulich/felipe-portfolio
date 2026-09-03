"use client"

import dynamic from "next/dynamic"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { usePreloaderStore } from "@/store/usePreloaderStore"

/**
 * A fronteira de code-splitting. O three, o fiber e o drei só entram no grafo
 * de módulos a partir daqui, por isso nada disso vai no bundle inicial da `/`.
 *
 * `ssr: false` porque não existe WebGL no servidor. `loading` a devolver null
 * porque o preloader já cobre o ecrã — um segundo estado de espera por baixo
 * só ia piscar.
 */
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
})

export default function SceneCanvas() {
  const { canvasEnabled } = useMotionPrefs()
  const phase = usePreloaderStore((state) => state.phase)

  // Sem WebGL, hardware fraco, ou reduced-motion: fallback estático. O import
  // dinâmico nunca chega a ser pedido, por isso o chunk nem é descarregado.
  if (!canvasEnabled) return null

  /*
    O canvas desmonta assim que o preloader acaba, e com ele vai o contexto
    WebGL — o R3F liberta o renderer no unmount.

    Este canvas era persistente porque o plano de dissolve ia ficar como fundo
    do hero a 15%. Essa função passou para o dithering do Paper Shaders, por
    isso depois da cortina não sobra trabalho nenhum para ele: mantê-lo vivo
    era só ocupar o segundo dos ~16 contextos que o browser dá.
  */
  if (phase === "done") return null

  return <Scene />
}
