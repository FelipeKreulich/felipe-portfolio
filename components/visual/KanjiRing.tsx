"use client"

import { useId, useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { MAXIMS, circlePath, repeatToFit, ringText } from "@/lib/kanji"

/** Unidades do viewBox. Os raios são relativos a este quadrado. */
const SIZE = 800
const CENTER = SIZE / 2
const OUTER_R = 330
const INNER_R = 258
/** Corpo dos glifos no anel, nas mesmas unidades. */
const GLYPH = 13

export default function KanjiRing({ className = "" }: { className?: string }) {
  const rootRef = useRef<SVGSVGElement>(null)
  const outerRef = useRef<SVGGElement>(null)
  const innerRef = useRef<SVGGElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()
  const { t } = useLanguage()

  // Dois anéis na mesma página colidiriam nos ids dos <path>.
  const uid = useId().replace(/:/g, "")
  const outerId = `ring-outer-${uid}`
  const innerId = `ring-inner-${uid}`

  const volta = ringText()
  const label = MAXIMS.map((m) => t(m.labelKey)).join(". ")

  useGSAP(
    () => {
      if (!resolved || reducedMotion) return

      // Roda com o scroll e não com o relógio: assim o anel mede a página em
      // vez de a decorar. O `scrub` liga a rotação à posição.
      const spin = (el: SVGGElement | null, graus: number) => {
        if (!el) return
        gsap.to(el, {
          rotation: graus,
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
      }

      // Sentidos opostos: dois anéis a rodar juntos leem-se como um só.
      spin(outerRef.current, 90)
      spin(innerRef.current, -60)
    },
    { scope: rootRef, dependencies: [resolved, reducedMotion] },
  )

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={label}
    >
      <defs>
        <path id={outerId} d={circlePath(CENTER, CENTER, OUTER_R)} />
        <path id={innerId} d={circlePath(CENTER, CENTER, INNER_R)} />
      </defs>

      <circle
        cx={CENTER}
        cy={CENTER}
        r={OUTER_R}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.14}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={INNER_R}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.14}
      />

      <g ref={outerRef}>
        <text className="font-jp" fontSize={GLYPH} fill="currentColor" fillOpacity={0.5}>
          <textPath href={`#${outerId}`}>{repeatToFit(volta, OUTER_R, GLYPH)}</textPath>
        </text>
      </g>

      <g ref={innerRef}>
        <text className="font-jp" fontSize={GLYPH} fill="currentColor" fillOpacity={0.24}>
          <textPath href={`#${innerId}`}>{repeatToFit(volta, INNER_R, GLYPH)}</textPath>
        </text>
      </g>
    </svg>
  )
}
