"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { hasWebGL, isLowPowerDevice } from "@/lib/device"

// DEBUG-TEMP
function dbg(...a: unknown[]) {
  console.log(...a)
  const w = window as unknown as { __dbg?: unknown[] }
  w.__dbg = w.__dbg || []
  w.__dbg.push(a)
}

/** Duração para onde todas as timelines colapsam com reduced-motion. */
export const REDUCED_DURATION = 0.15

interface MotionPrefs {
  /** `prefers-reduced-motion: reduce` está ativo. */
  reducedMotion: boolean
  /** Há WebGL e músculo que chegue, e o utilizador não pediu menos movimento.
   *  É este o sinal para o <Canvas> R3F, que anima continuamente. */
  canvasEnabled: boolean
  /** Só a capacidade do dispositivo, sem a preferência de movimento. Shaders
   *  estáticos usam este — não há movimento neles para reduzir. */
  shaderCapable: boolean
  /** As prefs já foram lidas no cliente. Antes disto, não arranques timelines. */
  resolved: boolean
  /** Colapsa qualquer duração para 150ms quando há reduced-motion. */
  duration: (seconds: number) => number
}

const MotionContext = createContext<MotionPrefs>({
  reducedMotion: false,
  canvasEnabled: false,
  shaderCapable: false,
  resolved: false,
  duration: (seconds) => seconds,
})

export const useMotionPrefs = () => useContext(MotionContext)

/**
 * Porta de entrada do movimento. Decide, uma vez, se o Canvas monta e qual a
 * escala de duração de tudo o resto.
 *
 * Arranca com os dois sinais desligados para o primeiro render do cliente bater
 * certo com o do servidor — o efeito resolve as capacidades reais logo a
 * seguir, e `resolved` diz aos consumidores quando podem confiar nos valores.
 */
export default function ReducedMotion({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [canvasEnabled, setCanvasEnabled] = useState(false)
  const [shaderCapable, setShaderCapable] = useState(false)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")

    const apply = () => {
      const reduce = query.matches
      const capable = hasWebGL() && !isLowPowerDevice()
      setReducedMotion(reduce)
      setShaderCapable(capable)
      setCanvasEnabled(!reduce && capable)
      setResolved(true)
    }

    apply()
    // DEBUG-TEMP
    dbg("[dbg] ReducedMotion apply", { t: performance.now(), reduce: query.matches, webgl: hasWebGL(), low: isLowPowerDevice() })
    query.addEventListener("change", apply)
    return () => query.removeEventListener("change", apply)
  }, [])

  const value = useMemo<MotionPrefs>(
    () => ({
      reducedMotion,
      canvasEnabled,
      shaderCapable,
      resolved,
      duration: (seconds) => (reducedMotion ? REDUCED_DURATION : seconds),
    }),
    [reducedMotion, canvasEnabled, shaderCapable, resolved],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
