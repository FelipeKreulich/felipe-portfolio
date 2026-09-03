"use client"

import { useEffect, useRef, useState } from "react"
import { gsap, useGSAP, SplitText } from "@/lib/gsap"
import { useMotionPrefs, REDUCED_DURATION } from "@/components/ReducedMotion"
import { useAppProgress } from "@/hooks/useAppProgress"
import { dissolveBus } from "@/store/dissolveBus"
import {
  usePreloaderStore,
  hasSeenPreloader,
  markPreloaderSeen,
  IDLE_DISSOLVE_INTENSITY,
  MIN_VISIBLE_MS,
  RETURNING_VISIBLE_MS,
  SAFETY_TIMEOUT_MS,
} from "@/store/usePreloaderStore"
import ScrambleText from "./ScrambleText"

const NAME = "FELIPE KREULICH"

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const ruleFillRef = useRef<HTMLSpanElement>(null)
  const readout = useRef({ value: 0 })
  const startedAt = useRef(0)

  const [isReturning, setIsReturning] = useState(false)
  const [readoutSettled, setReadoutSettled] = useState(false)

  const phase = usePreloaderStore((state) => state.phase)
  const progress = usePreloaderStore((state) => state.progress)
  const beginExit = usePreloaderStore((state) => state.beginExit)
  const complete = usePreloaderStore((state) => state.complete)
  const { reducedMotion, canvasEnabled, resolved } = useMotionPrefs()

  useAppProgress()

  useEffect(() => {
    startedAt.current = performance.now()
    setIsReturning(hasSeenPreloader())
  }, [])

  // Trava o scroll enquanto o preloader cobre o ecrã.
  useEffect(() => {
    if (phase === "done") return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [phase])

  // Saída pelo progresso real, mas nunca antes da duração mínima visível nem
  // antes de o contador ter mesmo chegado a 100 — senão, com as fontes a
  // resolver tarde, a saída apanha o tween a meio e o número nunca se lê.
  useEffect(() => {
    if (phase !== "loading" || progress < 1 || !readoutSettled) return
    const minVisible = isReturning ? RETURNING_VISIBLE_MS : MIN_VISIBLE_MS
    const remaining = Math.max(0, minVisible - (performance.now() - startedAt.current))
    const id = setTimeout(beginExit, remaining)
    return () => clearTimeout(id)
  }, [progress, phase, isReturning, readoutSettled, beginExit])

  // Rede de segurança: fecha na mesma se algum asset ficar preso.
  useEffect(() => {
    const id = setTimeout(beginExit, SAFETY_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [beginExit])

  // Contador e régua. Escritos direto no DOM, sem passar pelo React: a 60fps
  // um setState por frame seria um re-render por frame.
  useGSAP(
    () => {
      gsap.to(readout.current, {
        value: progress,
        duration: reducedMotion ? REDUCED_DURATION : 0.6,
        ease: "power2.out",
        // Cada atualização de progresso cria um tween novo. Sem overwrite os
        // antigos continuavam vivos a escrever no mesmo valor; com revert, o
        // GSAP repunha o valor inicial e o contador saltava para trás.
        overwrite: true,
        onUpdate: () => {
          const v = readout.current.value
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.round(v * 100)).padStart(3, "0")
          }
          if (ruleFillRef.current) {
            ruleFillRef.current.style.transform = `scaleX(${v})`
          }
        },
        onComplete: () => {
          if (progress >= 1) setReadoutSettled(true)
        },
      })
    },
    { dependencies: [progress, reducedMotion] },
  )

  // Timeline de saída.
  useGSAP(
    () => {
      if (phase !== "exiting" || !resolved) return

      const finish = () => {
        markPreloaderSeen()
        complete()
      }

      // Sem movimento, ou sem Canvas para dissolver: o overlay só desaparece.
      if (reducedMotion || !canvasEnabled) {
        dissolveBus.progress = 1
        dissolveBus.idle = canvasEnabled ? IDLE_DISSOLVE_INTENSITY : 0
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: reducedMotion ? REDUCED_DURATION : 0.4,
          ease: "none",
          onComplete: finish,
        })
        return
      }

      const split = SplitText.create(nameRef.current, { type: "chars", mask: "chars" })
      const tl = gsap.timeline({ onComplete: finish })

      tl.to(split.chars, { yPercent: -110, duration: 0.5, stagger: 0.02, ease: "reveal" }, 0)
        .to([counterRef.current, ruleFillRef.current], { autoAlpha: 0, duration: 0.3 }, 0.1)
        // O dissolve abre.
        .to(dissolveBus, { progress: 1, duration: 1.1, ease: "dissolve" }, 0.15)
        // RGB split só na transição, nunca em repouso.
        .to(dissolveBus, { split: 1.5, duration: 0.25, ease: "power2.out" }, 0.15)
        .to(dissolveBus, { split: 0, duration: 0.55, ease: "power2.inOut" }, 0.5)
        // O mesmo plano assenta como fundo do hero.
        .to(dissolveBus, { idle: IDLE_DISSOLVE_INTENSITY, duration: 0.8, ease: "none" }, 0.6)
        .to(rootRef.current, { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.85)

      return () => {
        tl.kill()
        split.revert()
      }
    },
    { scope: rootRef, dependencies: [phase, reducedMotion, canvasEnabled, resolved] },
  )

  if (phase === "done") return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 font-mono"
      style={{ backgroundColor: "var(--preloader-bg)", color: "var(--preloader-fg)" }}
    >
      {/* O nome ocupa o centro ótico do ecrã. */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <ScrambleText
          ref={nameRef}
          text={NAME}
          className="font-medium leading-none text-[clamp(1.5rem,7vw,6rem)] tracking-[0.04em]"
        />
      </div>

      {/* A instrumentação fica em baixo, deliberadamente pequena: mede, não
          compete com o nome. */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        {/* Régua de 1px. O brilho ciano vive só na extremidade direita. */}
        {/* O escurecimento vive na cor, não em `opacity`: a opacidade do
            elemento aplicar-se-ia também ao preenchimento ciano, que é filho
            dele, e apagava-o. */}
        <div
          className="relative h-px w-full"
          style={{ backgroundColor: "color-mix(in oklab, currentColor 14%, transparent)" }}
        >
          <span
            ref={ruleFillRef}
            className="absolute inset-0 origin-left"
            style={{
              transform: "scaleX(0)",
              backgroundColor: "var(--preloader-accent)",
              boxShadow: "6px 0 12px -2px var(--preloader-accent)",
            }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <span ref={counterRef} className="text-xs sm:text-sm tabular-nums opacity-50">
            000
          </span>
        </div>
      </div>
    </div>
  )
}
