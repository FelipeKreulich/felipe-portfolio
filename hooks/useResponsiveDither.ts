"use client"

import { useEffect, useState } from "react"
import {
  DITHER_SIZE_DIVISOR,
  DITHER_SIZE_MAX,
  DITHER_SIZE_MIN,
  DITHER_SIZE_STEP,
  HERO_IMAGE_DESKTOP,
  HERO_IMAGE_MOBILE,
  MOBILE_BREAKPOINT,
  RESIZE_DEBOUNCE_MS,
} from "@/lib/heroConfig"

interface ResponsiveDither {
  /** Lado da célula de Bayer, em pixels de ecrã. */
  size: number
  /** Recorte 16:9 ou vertical. */
  image: string
}

/** Largura assumida no servidor e no primeiro render do cliente. */
const SSR_WIDTH = 1440

function compute(width: number): ResponsiveDither {
  const raw = width / DITHER_SIZE_DIVISOR
  const clamped = Math.min(DITHER_SIZE_MAX, Math.max(DITHER_SIZE_MIN, raw))
  // Quantizado a 0.25: a fórmula é contínua, e sem isto arrastar a janela
  // gerava um valor novo — logo um render — a cada pixel.
  const size = Math.round(clamped / DITHER_SIZE_STEP) * DITHER_SIZE_STEP
  return {
    size,
    image: width < MOBILE_BREAKPOINT ? HERO_IMAGE_MOBILE : HERO_IMAGE_DESKTOP,
  }
}

/**
 * `size` e recorte derivados da largura do viewport.
 *
 * Isto é a única coisa na hero que pode provocar um re-render, e só o faz em
 * mudanças reais: o valor é quantizado, o observer é debounced, e o setState
 * devolve o estado anterior quando nada mudou — o que faz o React abortar.
 */
export function useResponsiveDither(): ResponsiveDither {
  // O mesmo valor no servidor e no primeiro render do cliente, senão há
  // divergência de hidratação. O efeito corrige logo a seguir.
  const [state, setState] = useState<ResponsiveDither>(() => compute(SSR_WIDTH))

  useEffect(() => {
    let timer: number | undefined

    const apply = () => {
      const next = compute(window.innerWidth)
      setState((previous) =>
        previous.size === next.size && previous.image === next.image ? previous : next,
      )
    }

    apply()

    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(apply, RESIZE_DEBOUNCE_MS)
    })
    observer.observe(document.documentElement)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return state
}
