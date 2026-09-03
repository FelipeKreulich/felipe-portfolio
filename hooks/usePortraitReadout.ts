"use client"

import { type RefObject } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import {
  READOUT_GAP_X,
  READOUT_OPACITY,
  READOUT_GAP_Y,
  READOUT_HZ,
  READOUT_OFFSET,
  READOUT_TRAIL,
} from "@/lib/portraitConfig"

interface Refs {
  /** A área do retrato, que recebe os eventos. */
  area: RefObject<HTMLElement | null>
  /** A etiqueta que arrasta atrás do cursor. */
  label: RefObject<HTMLElement | null>
  /** A linha de coordenadas. */
  coords: RefObject<HTMLElement | null>
}

/**
 * Etiqueta de leitura sobre o retrato.
 *
 * A posição é interpolada pelo GSAP num objeto simples e escrita uma vez por
 * frame no ticker partilhado — nunca no handler de `pointermove`, e nunca pelo
 * estado do React. Os números são outra história: atualizam a ~12fps e só
 * tocam no DOM quando o texto formatado muda de facto.
 */
export function usePortraitReadout({ area, label, coords }: Refs) {
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const areaEl = area.current
      const labelEl = label.current
      const coordsEl = coords.current
      if (!areaEl || !labelEl || !coordsEl || !resolved) return

      const format = (x: number, y: number) =>
        `X ${x.toFixed(3)}   Y ${y.toFixed(3)}`

      // Reduced motion: etiqueta fixa num canto, valores estáticos, sem
      // trailing e sem ticker.
      if (reducedMotion) {
        coordsEl.textContent = format(0.5, 0.5)
        labelEl.style.transform = `translate3d(${READOUT_GAP_X}px, ${READOUT_GAP_Y}px, 0)`
        labelEl.style.opacity = String(READOUT_OPACITY)
        return
      }

      if (!window.matchMedia("(hover: hover)").matches) return

      // Posição em px dentro da área; `oy` é o deslocamento do fade.
      const pos = { x: 0, y: 0, oy: READOUT_OFFSET }
      // Valores normalizados, lidos pelo amostrador.
      const norm = { x: 0, y: 0 }
      const lastWritten = { transform: "", text: "" }

      const toX = gsap.quickTo(pos, "x", { duration: READOUT_TRAIL, ease: "power3" })
      const toY = gsap.quickTo(pos, "y", { duration: READOUT_TRAIL, ease: "power3" })
      const toOffset = gsap.quickTo(pos, "oy", { duration: 0.3, ease: "power2.out" })

      const onMove = (event: PointerEvent) => {
        const rect = areaEl.getBoundingClientRect()
        const px = event.clientX - rect.left
        const py = event.clientY - rect.top
        toX(px)
        toY(py)
        norm.x = Math.min(1, Math.max(0, px / rect.width))
        norm.y = Math.min(1, Math.max(0, py / rect.height))
      }

      const onEnter = () => {
        gsap.to(labelEl, { opacity: READOUT_OPACITY, duration: 0.3, ease: "power2.out", overwrite: true })
        toOffset(0)
      }

      const onLeave = () => {
        gsap.to(labelEl, { opacity: 0, duration: 0.25, ease: "power2.in", overwrite: true })
        toOffset(READOUT_OFFSET)
      }

      let elapsed = 0
      const interval = 1 / READOUT_HZ

      const tick = (_time: number, delta: number) => {
        // Composição: só transform, nunca left/top.
        const transform = `translate3d(${Math.round(pos.x + READOUT_GAP_X)}px, ${Math.round(
          pos.y + READOUT_GAP_Y + pos.oy,
        )}px, 0)`
        if (transform !== lastWritten.transform) {
          labelEl.style.transform = transform
          lastWritten.transform = transform
        }

        elapsed += delta / 1000
        if (elapsed < interval) return
        elapsed = 0

        const text = format(norm.x, norm.y)
        if (text !== lastWritten.text) {
          coordsEl.textContent = text
          lastWritten.text = text
        }
      }

      gsap.ticker.add(tick)

      areaEl.addEventListener("pointermove", onMove, { passive: true })
      areaEl.addEventListener("pointerenter", onEnter, { passive: true })
      areaEl.addEventListener("pointerleave", onLeave, { passive: true })

      return () => {
        gsap.ticker.remove(tick)
        areaEl.removeEventListener("pointermove", onMove)
        areaEl.removeEventListener("pointerenter", onEnter)
        areaEl.removeEventListener("pointerleave", onLeave)
        gsap.killTweensOf(pos)
        gsap.killTweensOf(labelEl)
      }
    },
    {
      scope: area,
      dependencies: [resolved, reducedMotion],
      revertOnUpdate: true,
    },
  )
}
