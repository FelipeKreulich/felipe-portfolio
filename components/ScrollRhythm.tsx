"use client"

import { useRef } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { RITMOS, RITMO_MAX_PX, type Ritmo } from "@/lib/scrollConfig"

/**
 * Desfasamento de ritmos.
 *
 * O scroll suave é o mínimo. A sensação de fluidez vem de as coisas se
 * moverem a velocidades ligeiramente diferentes: o título acompanha o scroll,
 * o texto secundário fica um pouco atrás, o fundo mais ainda.
 *
 * Um elemento adere marcando `data-rhythm="secundario"` ou `"fundo"`. Os
 * valores estão todos em `lib/scrollConfig.ts` — afinam-se num sítio só.
 *
 * Implementado com `y` scrubado por ScrollTrigger e não com lerps por
 * elemento: um lerp próprio seria uma segunda fonte de amortecimento na mesma
 * cadeia, que é exactamente o que dá a sensação de atraso.
 */
export default function ScrollRhythm() {
  const marcaRef = useRef<HTMLSpanElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      if (!resolved || reducedMotion) return

      const alvos = Array.from(document.querySelectorAll<HTMLElement>("[data-rhythm]"))
      const triggers = alvos.map((alvo) => {
        const ritmo = (alvo.dataset.rhythm as Ritmo) ?? "titulo"
        const taxa = RITMOS[ritmo] ?? 1

        return ScrollTrigger.create({
          trigger: alvo,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          animation: gsap.fromTo(
            alvo,
            { y: () => desvio(taxa) },
            { y: () => -desvio(taxa), ease: "none" },
          ),
        })
      })

      return () => triggers.forEach((t) => t.kill())
    },
    { dependencies: [resolved, reducedMotion], revertOnUpdate: true },
  )

  return <span ref={marcaRef} hidden aria-hidden />
}

/**
 * Metade do desvio total para uma taxa.
 *
 * O elemento percorre `viewport + altura` de scroll enquanto está visível; a
 * diferença acumulada é `(1 - taxa)` dessa distância. O tecto existe porque em
 * ecrãs altos a mesma percentagem dá desvios que já se lêem como página
 * partida em vez de profundidade.
 */
function desvio(taxa: number) {
  if (typeof window === "undefined") return 0
  const bruto = ((1 - taxa) * window.innerHeight) / 2
  return Math.min(bruto, RITMO_MAX_PX)
}
