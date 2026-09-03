"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"

/**
 * Latim maiúsculo + katakana + glifos de ruído.
 *
 * Nenhuma mono latina cobre katakana, por isso o browser cai para a CJK do
 * sistema (Hiragino, Yu Gothic, Noto) a meio do scramble. Essas são
 * full-width: sem o fantasma abaixo a reservar a largura final, o texto muda
 * de largura de frame para frame e, centrado, oscilaria à volta do eixo.
 */
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "/\\|_—+·"

interface ScrambleTextProps {
  text: string
  className?: string
  duration?: number
  ref?: React.Ref<HTMLSpanElement>
}

export default function ScrambleText({
  text,
  className,
  duration = 1.4,
  ref,
}: ScrambleTextProps) {
  const localRef = useRef<HTMLSpanElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const el = localRef.current
      if (!el || !resolved) return

      if (reducedMotion) {
        el.textContent = text
        return
      }

      // `gsap.to` e nao `fromTo`: o valor inicial `{ text: "" }` pertence ao
      // TextPlugin, que nao esta registado — o GSAP ignorava-o em silencio e
      // avisava "Invalid property text set to" a cada carater. O
      // ScrambleTextPlugin nao precisa de ponto de partida.
      gsap.to(el, {
        duration,
        ease: "none",
        scrambleText: {
          text,
          chars: SCRAMBLE_CHARS,
          speed: 0.4,
          revealDelay: duration * 0.35,
        },
      })
    },
    { dependencies: [text, duration, reducedMotion, resolved] },
  )

  return (
    <span className={className} style={{ position: "relative", display: "inline-block" }}>
      {/* O texto real, para leitores de ecrã e para o caso sem JS. */}
      <span className="sr-only">{text}</span>

      {/*
        Fantasma: ocupa layout mas não pinta. É ele que fixa a largura da
        caixa, e como é o browser a medi-lo, acompanha sozinho o resize e a
        troca de fonte — sem nenhum px trancado por JS.
      */}
      <span aria-hidden style={{ visibility: "hidden", whiteSpace: "pre" }}>
        {text}
      </span>

      {/* O texto animado, sobreposto ao fantasma. */}
      <span
        aria-hidden
        ref={(node) => {
          localRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          whiteSpace: "pre",
          // Glifos mais largos do fallback cortam simetricamente em vez de
          // empurrarem o texto para um dos lados.
          textAlign: "center",
        }}
      >
        {text}
      </span>
    </span>
  )
}
