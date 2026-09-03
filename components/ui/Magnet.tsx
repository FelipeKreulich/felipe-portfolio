"use client"

import { useRef, type HTMLAttributes, type ReactNode } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Folga à volta do elemento onde o ímã já actua, em px. */
  padding?: number
  disabled?: boolean
  /** Deslocamento máximo do container, em px. */
  magnetStrength?: number
  /**
   * Quanto o rótulo interior se move em relação ao container.
   *
   * É este paralaxe que faz o botão parecer magnético em vez de simplesmente
   * deslizante — os dois a andar juntos não convencem.
   */
  innerRatio?: number
  wrapperClassName?: string
  innerClassName?: string
}

/**
 * Botão magnético.
 *
 * Mesma API do componente do React Bits, mecânica diferente: aquele fazia
 * `setState` a cada `mousemove` — um re-render do React por frame — e escrevia
 * o transform no próprio handler. Aqui o GSAP interpola dois objectos simples
 * e um único writer no ticker partilhado copia-os para o DOM. Nenhum valor
 * passa pelo React, e não há um segundo requestAnimationFrame.
 */
export default function Magnet({
  children,
  padding = 50,
  disabled = false,
  magnetStrength = 14,
  innerRatio = 1.8,
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      const inner = innerRef.current
      if (!wrapper || !inner || !resolved) return
      if (disabled || reducedMotion) return
      // Num telemóvel um botão magnético só produz saltos estranhos ao toque.
      if (!window.matchMedia("(hover: hover)").matches) return

      const offset = { x: 0, y: 0 }
      const last = { outer: "", inner: "" }

      const toX = gsap.quickTo(offset, "x", { duration: 0.4, ease: "power3" })
      const toY = gsap.quickTo(offset, "y", { duration: 0.4, ease: "power3" })

      const onMove = (event: PointerEvent) => {
        const rect = wrapper.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = event.clientX - centerX
        const dy = event.clientY - centerY

        // A área de detecção é maior que a visível: o ímã começa a agir antes
        // de o cursor tocar no botão.
        const inRange =
          Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding

        if (!inRange) {
          toX(0)
          toY(0)
          wrapper.dataset.magnetNear = "false"
          return
        }

        wrapper.dataset.magnetNear = "true"
        const reachX = rect.width / 2 + padding
        const reachY = rect.height / 2 + padding
        toX(gsap.utils.clamp(-magnetStrength, magnetStrength, (dx / reachX) * magnetStrength))
        toY(gsap.utils.clamp(-magnetStrength, magnetStrength, (dy / reachY) * magnetStrength))
      }

      // O único writer. Só transform, e só quando algo mudou.
      const tick = () => {
        const outer = `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`
        if (outer !== last.outer) {
          wrapper.style.transform = outer
          last.outer = outer
        }
        const innerTransform = `translate3d(${(offset.x * (innerRatio - 1)).toFixed(2)}px, ${(
          offset.y *
          (innerRatio - 1)
        ).toFixed(2)}px, 0)`
        if (innerTransform !== last.inner) {
          inner.style.transform = innerTransform
          last.inner = innerTransform
        }
      }

      window.addEventListener("pointermove", onMove, { passive: true })
      gsap.ticker.add(tick)

      return () => {
        window.removeEventListener("pointermove", onMove)
        gsap.ticker.remove(tick)
        gsap.killTweensOf(offset)
      }
    },
    { scope: wrapperRef, dependencies: [padding, disabled, magnetStrength, innerRatio, reducedMotion, resolved], revertOnUpdate: true },
  )

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block", willChange: "transform" }}
      {...props}
    >
      <div ref={innerRef} className={innerClassName} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  )
}
