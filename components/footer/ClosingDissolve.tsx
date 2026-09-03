"use client"

import { useRef } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"

/*
  A mesma trama das pré-visualizações dos projetos. SVG embutido, não WebGL:
  o site tem dois contextos e esse é o limite — abrir um terceiro para pintar
  grão seria desproporcionado.
*/
const GRAO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='3'%3E%3Ccircle cx='0.6' cy='0.6' r='0.6' fill='%23000'/%3E%3C/svg%3E\")"

/** O dissolve nunca passa daqui. É um gesto, não uma cortina. */
const OPACIDADE_MAXIMA = 0.55

/**
 * O fecho.
 *
 * O site abre com um preloader que dissolve para revelar. Fecha com o
 * inverso: nos últimos ecrãs, a página desfaz-se no mesmo grão, com o
 * progresso preso ao scroll. O sinal começa e o sinal acaba.
 */
export default function ClosingDissolve({ alvo }: { alvo: string }) {
  const camadaRef = useRef<HTMLDivElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const camada = camadaRef.current
      if (!camada || !resolved || reducedMotion) return

      const rodape = document.querySelector<HTMLElement>(alvo)
      if (!rodape) return

      /*
        Ancorado ao fim do scroll, não à geometria do rodapé.

        Com `trigger: rodape` e `end: "bottom bottom"` o intervalo dependia da
        altura do rodapé, e essa mudou assim que lhe acrescentei os controlos:
        numa medição dava 0.55 no fundo e noutra dava 0. O que esta camada
        quer dizer é "os últimos 40vh da página" — e é isso que agora está
        escrito, em vez de uma aproximação que calhava bater certo.
      */
      const proxy = { p: 0 }
      const st = ScrollTrigger.create({
        trigger: rodape,
        start: () => Math.max(0, ScrollTrigger.maxScroll(window) - window.innerHeight * 0.4),
        end: () => ScrollTrigger.maxScroll(window),
        scrub: 0.5,
        invalidateOnRefresh: true,
        animation: gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => {
            camada.style.opacity = `${proxy.p * OPACIDADE_MAXIMA}`
            /*
              O grão engrossa com o progresso: as células aproximam-se, e o
              mesmo ponto passa a ocupar mais da área. É o inverso exacto do
              preloader, onde o grão abre para revelar.
            */
            camada.style.backgroundSize = `${6 - proxy.p * 3}px ${6 - proxy.p * 3}px`
          },
        }),
      })

      return () => st.kill()
    },
    { scope: camadaRef, dependencies: [resolved, reducedMotion, alvo], revertOnUpdate: true },
  )

  return (
    <div
      ref={camadaRef}
      aria-hidden
      /*
        `pointer-events-none` não é detalhe: sem isto, uma camada fixa por
        cima do rodapé engolia os cliques em todas as ligações, exactamente
        na parte da página onde as ligações são a única coisa que interessa.
      */
      className="pointer-events-none fixed inset-0 z-20 opacity-0"
      style={{ backgroundImage: GRAO, backgroundSize: "6px 6px" }}
    />
  )
}
