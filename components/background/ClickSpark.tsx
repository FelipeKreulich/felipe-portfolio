"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { isLowPowerDevice } from "@/lib/device"
import { emitSpark, flash, pruneSparks, sparks } from "@/lib/sparks"
import {
  SPARK_FLASH,
  SPARK_FLASH_DELAY,
  SPARK_FLASH_LIFE,
  SPARK_LIFE,
  SPARK_TRAIL,
} from "@/lib/gridConfig"

/**
 * Partículas no ponto do clique.
 *
 * Duas notas sobre a implementação:
 *
 * 1. O componente do React Bits abria um `requestAnimationFrame` próprio.
 *    Aqui o desenho corre no ticker do GSAP, o mesmo que conduz o Lenis, a
 *    grelha e as máscaras — continua a haver um só rAF na aplicação.
 *
 * 2. Tem canvas próprio, e isso é um desvio deliberado ao plano original.
 *    As partículas estavam a ser desenhadas no canvas da grelha, que está em
 *    `z-index: 0` — medido: 282 pixels pintados, todos escondidos por trás do
 *    conteúdo opaco da hero. Um clique é sempre por cima de alguma coisa, por
 *    isso o efeito precisa de estar por cima também.
 */
export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !resolved || reducedMotion) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(isLowPowerDevice() ? 1 : 2, window.devicePixelRatio || 1)
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--bg-accent").trim() || "#fff"

    const onDown = (event: PointerEvent) => emitSpark(event.clientX, event.clientY)
    // `pointerdown` e não `click`: dispara no momento da pressão, que é onde
    // a pessoa espera ver o impacto.
    window.addEventListener("pointerdown", onDown, { passive: true })

    let hadContent = false

    const tick = () => {
      const now = performance.now()
      const alive = pruneSparks(now)
      const since = flash.at ? now - flash.at : Infinity
      const flashing =
        SPARK_FLASH && since >= SPARK_FLASH_DELAY && since < SPARK_FLASH_DELAY + SPARK_FLASH_LIFE

      if (alive === 0 && !flashing) {
        // Um clear final e depois nada: parado, este canvas não custa nada.
        if (hadContent) {
          ctx.clearRect(0, 0, width, height)
          hadContent = false
        }
        return
      }

      ctx.clearRect(0, 0, width, height)
      hadContent = true

      /*
        Flash de aberração cromática, uma vez por clique. Duas bandas em
        `lighter` com deslocamento oposto — não é um split de canais a sério,
        que exigiria filtrar o conteúdo, mas lê-se como o mesmo acidente.
      */
      if (flashing) {
        const decay = 1 - (since - SPARK_FLASH_DELAY) / SPARK_FLASH_LIFE
        const shift = 4 * decay
        ctx.globalCompositeOperation = "lighter"
        for (const [color, direction] of [["#ff2d55", -1], ["#00e5ff", 1]] as const) {
          const gradient = ctx.createLinearGradient(0, 0, 0, height)
          gradient.addColorStop(0, "transparent")
          gradient.addColorStop(0.5, color)
          gradient.addColorStop(1, "transparent")
          ctx.globalAlpha = 0.06 * decay
          ctx.fillStyle = gradient
          ctx.fillRect(direction * shift, 0, width, height)
        }
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1
      }

      // Traços radiais, não círculos: nesta linguagem lêem-se como impacto e
      // não como confetti.
      ctx.strokeStyle = accent()
      ctx.lineWidth = 1.2
      ctx.lineCap = "round"

      for (const spark of sparks) {
        const progress = (now - spark.born) / SPARK_LIFE
        if (progress < 0 || progress >= 1) continue

        // Desaceleração: rápido a sair, a travar no fim.
        const eased = 1 - Math.pow(1 - progress, 3)
        const distance = eased * spark.reach
        const length = SPARK_TRAIL * (1 - eased)
        const cos = Math.cos(spark.angle)
        const sin = Math.sin(spark.angle)

        ctx.globalAlpha = (1 - progress) * 0.9
        ctx.beginPath()
        ctx.moveTo(spark.x + distance * cos, spark.y + distance * sin)
        ctx.lineTo(spark.x + (distance + length) * cos, spark.y + (distance + length) * sin)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointerdown", onDown)
      sparks.length = 0
    }
  }, [reducedMotion, resolved])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Por cima de tudo, incluindo do ecrã de idioma. Sem eventos: o clique
      // continua a chegar a quem estiver por baixo.
      className="pointer-events-none fixed inset-0 z-[80]"
    />
  )
}
