"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { allTechnologies } from "@/lib/careerData"
import TechIcon from "./TechIcon"

/**
 * Faixa de tecnologias em movimento contínuo, a separar o Percurso da secção
 * seguinte.
 *
 * O loop entra aqui e não na lista de propósito: tecnologias não têm ordem
 * cronológica, portanto um ciclo infinito não mente sobre nada — ao contrário
 * do percurso, onde apagaria o princípio e o fim.
 *
 * Decorativa: a informação já está nas etiquetas de cada entrada.
 */
export default function StackBand() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track || !resolved || reducedMotion) return

      /*
        Uma cópia do conteúdo e um tween de 0 a -50%.

        Aos -50% a segunda cópia está exactamente onde a primeira começou, por
        isso o `repeat` volta ao zero sem salto — e sem acumular deriva, que é
        o que aconteceria a somar deslocamentos frame a frame ou a mover
        clones à mão.
      */
      const loop = gsap.to(track, {
        xPercent: -50,
        duration: 48,
        ease: "none",
        repeat: -1,
      })

      // Em hover abranda, não pára de repente.
      const abrandar = () => gsap.to(loop, { timeScale: 0.18, duration: 0.6, ease: "power2.out" })
      const acelerar = () => gsap.to(loop, { timeScale: 1, duration: 0.9, ease: "power2.out" })
      track.parentElement?.addEventListener("pointerenter", abrandar)
      track.parentElement?.addEventListener("pointerleave", acelerar)

      return () => {
        loop.kill()
        track.parentElement?.removeEventListener("pointerenter", abrandar)
        track.parentElement?.removeEventListener("pointerleave", acelerar)
      }
    },
    { scope: trackRef, dependencies: [resolved, reducedMotion], revertOnUpdate: true },
  )

  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden py-6"
      style={{
        borderTop: "1px solid color-mix(in oklab, currentColor 12%, transparent)",
        borderBottom: "1px solid color-mix(in oklab, currentColor 12%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex w-max gap-10 will-change-transform">
        {/* Duas cópias: é o par que permite o loop fechar em -50%. */}
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 gap-10">
            {allTechnologies.map((tech) => (
              <span
                key={tech}
                data-band-tech={tech}
                className="inline-flex items-center gap-2 font-mono text-sm whitespace-nowrap opacity-30 transition-opacity duration-300"
              >
                <TechIcon tech={tech} />
                {tech}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
