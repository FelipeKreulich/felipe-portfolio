"use client"

import { useEffect, useState } from "react"
import { usePreloaderStore } from "@/store/usePreloaderStore"
import { useMotionPrefs } from "@/components/ReducedMotion"

/**
 * Progresso real de carregamento, sem nada temporizado.
 *
 * Fontes do lado do DOM: `document.fonts.ready` e as imagens marcadas com
 * `data-critical`. O progresso da cena WebGL não é lido aqui — chega à store
 * de dentro do chunk lazy, porque importar o `useProgress` do drei nesta
 * camada arrastaria o three inteiro para o bundle inicial.
 */
export function useAppProgress() {
  const setProgress = usePreloaderStore((state) => state.setProgress)
  const sceneProgress = usePreloaderStore((state) => state.sceneProgress)
  const { canvasEnabled, resolved } = useMotionPrefs()
  const [domProgress, setDomProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    const tasks: Promise<unknown>[] = [document.fonts.ready]

    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-critical]"))
    for (const img of images) {
      if (img.complete) continue
      tasks.push(
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true })
          // Uma imagem partida não pode prender o preloader no ecrã.
          img.addEventListener("error", () => resolve(), { once: true })
        }),
      )
    }

    const total = tasks.length
    let done = 0

    for (const task of tasks) {
      task.then(() => {
        if (cancelled) return
        done += 1
        setDomProgress(done / total)
      })
    }

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!resolved) return
    // Sem Canvas não há progresso de cena por que esperar, senão o preloader
    // ficava preso nos 70% em dispositivos sem WebGL.
    const combined = canvasEnabled ? domProgress * 0.7 + sceneProgress * 0.3 : domProgress
    setProgress(combined)
  }, [domProgress, sceneProgress, canvasEnabled, resolved, setProgress])
}
