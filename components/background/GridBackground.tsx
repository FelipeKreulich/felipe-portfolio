"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { isLowPowerDevice } from "@/lib/device"
import {
  CURSOR_SMOOTHING,
  DOT_ALPHA_IDLE,
  DOT_ALPHA_PEAK,
  DOT_MAX,
  DOT_MIN,
  DRIFT_PERIOD,
  GRID_PUSH,
  GRID_RADIUS,
  GRID_SPACING,
  TOUCH_DRIFT,
} from "@/lib/gridConfig"

/**
 * Grelha de pontos reativa ao cursor, por trás de todas as secções.
 *
 * Canvas 2D e não WebGL: evita um segundo contexto ao lado do Paper Shaders.
 * A animação corre no ticker do GSAP — que já conduz o Lenis — por isso não
 * existe um segundo requestAnimationFrame na aplicação.
 *
 * Nada aqui passa pelo estado do React. O componente renderiza um <canvas> uma
 * vez e não volta a renderizar.
 */
export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !resolved) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Em hardware fraco o DPR fica a 1: a grelha é ruído fino, e a 2x custa o
    // dobro dos pixels sem se notar.
    const dpr = Math.min(isLowPowerDevice() ? 1 : 2, window.devicePixelRatio || 1)

    const pointer = { x: -9999, y: -9999 } // alvo, em CSS px
    const eased = { x: -9999, y: -9999 } // posição suavizada
    let width = 0
    let height = 0

    /** Região suja do frame anterior, para a limpar antes de redesenhar. */
    let previous: { x: number; y: number; w: number; h: number } | null = null

    /** Cores da última pintura completa — se mudarem, a grelha inteira suja. */
    let paintedGrid = ""
    let paintedAccent = ""

    const root = document.documentElement
    const readColors = () => {
      const style = getComputedStyle(root)
      return {
        grid: style.getPropertyValue("--bg-grid").trim() || "#888",
        accent: style.getPropertyValue("--bg-accent").trim() || "#888",
      }
    }

    /**
     * Desenha os pontos cuja posição em repouso cai dentro de `area`.
     *
     * A área é expandida por GRID_PUSH ao procurar candidatos: um ponto de
     * fora pode ser empurrado para dentro dela.
     */
    const paint = (
      area: { x: number; y: number; w: number; h: number },
      colors: { grid: string; accent: string },
    ) => {
      ctx.clearRect(area.x, area.y, area.w, area.h)

      const first = (v: number) => Math.floor((v - GRID_PUSH) / GRID_SPACING) * GRID_SPACING
      const last = (v: number) => Math.ceil((v + GRID_PUSH) / GRID_SPACING) * GRID_SPACING

      // Duas passagens para trocar de fillStyle duas vezes por região em vez
      // de uma vez por ponto.
      for (const pass of [0, 1] as const) {
        ctx.fillStyle = pass === 0 ? colors.grid : colors.accent

        for (let gy = first(area.y); gy <= last(area.y + area.h); gy += GRID_SPACING) {
          for (let gx = first(area.x); gx <= last(area.x + area.w); gx += GRID_SPACING) {
            const dx = gx - eased.x
            const dy = gy - eased.y
            const distance = Math.hypot(dx, dy)

            // smoothstep: o decaimento linear deixa um anel visível na borda.
            const t = Math.max(0, 1 - distance / GRID_RADIUS)
            const falloff = t * t * (3 - 2 * t)

            if (pass === 1 && falloff <= 0.001) continue

            let px = gx
            let py = gy
            if (falloff > 0 && distance > 0.001) {
              const push = falloff * GRID_PUSH
              px += (dx / distance) * push
              py += (dy / distance) * push
            }

            ctx.globalAlpha =
              pass === 0
                ? DOT_ALPHA_IDLE + falloff * 0.25
                : falloff * DOT_ALPHA_PEAK

            const radius = DOT_MIN + falloff * (DOT_MAX - DOT_MIN)
            ctx.beginPath()
            ctx.arc(px, py, radius, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      ctx.globalAlpha = 1
    }

    const paintAll = (colors: { grid: string; accent: string }) => {
      paint({ x: 0, y: 0, w: width, h: height }, colors)
      paintedGrid = colors.grid
      paintedAccent = colors.accent
      previous = null
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // Trabalhar sempre em CSS px; o DPR vive só nesta matriz.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintAll(readColors())
    }

    resize()
    window.addEventListener("resize", resize, { passive: true })

    // Reduced motion: uma pintura estática e mais nada. Sem ticker, sem
    // listeners de ponteiro.
    if (reducedMotion) {
      return () => window.removeEventListener("resize", resize)
    }

    const hasHover = window.matchMedia("(hover: hover)").matches
    const drifting = !hasHover && TOUCH_DRIFT

    if (!hasHover && !TOUCH_DRIFT) {
      return () => window.removeEventListener("resize", resize)
    }

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }
    if (hasHover) window.addEventListener("pointermove", onMove, { passive: true })

    const tick = (time: number, delta: number) => {
      if (drifting) {
        const angle = (time / DRIFT_PERIOD) * Math.PI * 2
        pointer.x = width * (0.5 + 0.34 * Math.sin(angle))
        pointer.y = height * (0.5 + 0.28 * Math.sin(angle * 1.618))
      }

      // Suavização exponencial corrigida pelo delta: o mesmo aspecto a 60 ou
      // a 144 Hz.
      const factor = 1 - Math.pow(1 - CURSOR_SMOOTHING, delta / 16.667)
      eased.x += (pointer.x - eased.x) * factor
      eased.y += (pointer.y - eased.y) * factor

      const colors = readColors()

      // Uma cor nova invalida a grelha toda — acontece só durante os tweens
      // de secção, não no regime estacionário.
      if (colors.grid !== paintedGrid || colors.accent !== paintedAccent) {
        paintAll(colors)
        return
      }

      const reach = GRID_RADIUS + GRID_PUSH + DOT_MAX
      const current = {
        x: eased.x - reach,
        y: eased.y - reach,
        w: reach * 2,
        h: reach * 2,
      }

      // Limpa e redesenha a união com a região anterior: sem isso ficavam
      // rastos dos pontos deslocados no frame passado.
      const area = previous
        ? {
            x: Math.min(current.x, previous.x),
            y: Math.min(current.y, previous.y),
            w: Math.max(current.x + current.w, previous.x + previous.w) - Math.min(current.x, previous.x),
            h: Math.max(current.y + current.h, previous.y + previous.h) - Math.min(current.y, previous.y),
          }
        : current

      paint(area, colors)
      previous = current
    }

    gsap.ticker.add(tick)

    // Trocar de tema muda as duas variáveis de uma vez; sem isto metade da
    // grelha ficava com as cores antigas até o cursor lá passar.
    const themeObserver = new MutationObserver(() => paintAll(readColors()))
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => {
      gsap.ticker.remove(tick)
      themeObserver.disconnect()
      window.removeEventListener("resize", resize)
      if (hasHover) window.removeEventListener("pointermove", onMove)
    }
  }, [reducedMotion, resolved])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
