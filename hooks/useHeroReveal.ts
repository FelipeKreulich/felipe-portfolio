"use client"

import { type RefObject } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import {
  LISSAJOUS_PERIOD,
  MASK_RADIUS,
  MASK_RADIUS_TOUCH,
  TOUCH_AUTOPILOT,
} from "@/lib/heroConfig"

/**
 * A máscara de revelação da hero.
 *
 * Os listeners vivem na <section> e não no container do fundo: a camada de
 * texto é irmã do fundo e cobre a secção inteira, por isso o hit-test acerta
 * sempre nela. As custom properties escritas aqui descem por cascata até às
 * camadas — e assim passar o cursor sobre o próprio título também descodifica.
 */
export function useHeroReveal(ref: RefObject<HTMLElement | null>) {
  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !resolved) return

      // Percentagens para x/y, px para o raio, 0..1 para a opacidade do anel.
      const pos = { x: 50, y: 50, r: 0, o: 0 }
      const last = { x: -1, y: -1, r: -1, o: -1 }

      const write = () => {
        // Parado, o ticker não toca no style.
        if (pos.x === last.x && pos.y === last.y && pos.r === last.r && pos.o === last.o) return
        el.style.setProperty("--mx", `${pos.x}%`)
        el.style.setProperty("--my", `${pos.y}%`)
        el.style.setProperty("--mr", `${pos.r}px`)
        el.style.setProperty("--mo", `${pos.o}`)
        last.x = pos.x
        last.y = pos.y
        last.r = pos.r
        last.o = pos.o
      }

      // Reduced motion: máscara fixa ao centro. Sem ticker, sem tween, sem
      // listeners — nada aqui se mexe.
      if (reducedMotion) {
        pos.r = MASK_RADIUS
        pos.o = 1
        write()
        return
      }

      const toX = gsap.quickTo(pos, "x", { duration: 0.55, ease: "power3" })
      const toY = gsap.quickTo(pos, "y", { duration: 0.55, ease: "power3" })
      const toR = gsap.quickTo(pos, "r", { duration: 0.7, ease: "power2.out" })
      const toO = gsap.quickTo(pos, "o", { duration: 0.7, ease: "power2.out" })

      const hasHover = window.matchMedia("(hover: hover)").matches
      const autopilot = !hasHover && TOUCH_AUTOPILOT

      if (!hasHover && !TOUCH_AUTOPILOT) {
        write()
        return
      }

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        toX(((event.clientX - rect.left) / rect.width) * 100)
        toY(((event.clientY - rect.top) / rect.height) * 100)
      }

      const onEnter = () => {
        toR(MASK_RADIUS)
        toO(1)
      }

      const onLeave = () => {
        toR(0)
        toO(0)
      }

      // O único writer. Tudo o resto só escreve no objeto `pos`.
      const tick = (time: number) => {
        if (autopilot) {
          // Razão irracional entre as frequências: o caminho não se fecha de
          // forma óbvia dentro do período.
          const t = (time / LISSAJOUS_PERIOD) * Math.PI * 2
          pos.x = 50 + 30 * Math.sin(t)
          pos.y = 50 + 24 * Math.sin(t * 1.618 + Math.PI / 3)
        }
        write()
      }

      gsap.ticker.add(tick)

      if (autopilot) {
        pos.r = MASK_RADIUS_TOUCH
        pos.o = 1
      }

      if (hasHover) {
        el.addEventListener("pointermove", onMove, { passive: true })
        el.addEventListener("pointerenter", onEnter, { passive: true })
        el.addEventListener("pointerleave", onLeave, { passive: true })
      }

      return () => {
        gsap.ticker.remove(tick)
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerenter", onEnter)
        el.removeEventListener("pointerleave", onLeave)
        gsap.killTweensOf(pos)
      }
    },
    {
      scope: ref,
      dependencies: [resolved, reducedMotion],
      // Sem isto, uma mudança de dependência deixava dois tickers e dois
      // pares de listeners vivos.
      revertOnUpdate: true,
    },
  )
}
