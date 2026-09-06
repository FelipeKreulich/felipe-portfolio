"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { CELL_H, CELL_W, FONT_SIZE, JP_CHARS, gridFor, lerpColor } from "@/lib/glitch"

interface Cell {
  ch: string
  /** Hex, sempre. Nunca a string CSS já composta — ver lib/glitch.ts. */
  from: string
  to: string
  /** A string CSS que o canvas usa. */
  css: string
  /** 0..1 */
  p: number
}

interface LetterGlitchProps {
  glitchColors?: string[]
  /** ms entre trocas de carácter. */
  glitchSpeed?: number
  smooth?: boolean
  characters?: string[]
  centerVignette?: boolean
  outerVignette?: boolean
  className?: string
}

/*
  Constantes de módulo e não literais nos parâmetros: um literal seria um
  array novo a cada render, entrava nas dependências do efeito sempre
  diferente, e o canvas remontava-se a cada render. Quem chamar este
  componente com literais inline sofre o mesmo — daí o aviso.
*/
const DEFAULT_COLORS = ["#0a0a0a", "#6b6b6b", "#9a9a9a"]

/** Fração de células que muda em cada tick. */
const CHURN = 0.045
/** Quanto avança a interpolação de cor por frame. */
const FADE_STEP = 0.06

const PAPER = "255, 255, 255"

export default function LetterGlitch({
  glitchColors = DEFAULT_COLORS,
  glitchSpeed = 55,
  smooth = true,
  characters = JP_CHARS,
  centerVignette = true,
  outerVignette = true,
  className = "",
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useEffect(() => {
    if (!resolved) return

    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !parent || !ctx) return

    let cells: Cell[] = []
    let cols = 0
    let width = 0
    let height = 0
    let last = 0
    let running = false
    let font = `${FONT_SIZE}px ui-monospace, monospace`

    const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = font
      ctx.textBaseline = "top"

      for (let i = 0; i < cells.length; i++) {
        ctx.fillStyle = cells[i].css
        ctx.fillText(cells[i].ch, (i % cols) * CELL_W, Math.floor(i / cols) * CELL_H)
      }
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      width = rect.width
      height = rect.height

      // A família vem do CSS e não de uma string escrita à mão: é o
      // next/font que gera o nome real. Lida aqui e guardada — chamar
      // getComputedStyle dentro do draw obrigava a um cálculo de estilo
      // forçado por frame, que é exatamente o que se está a tentar evitar.
      font = `${FONT_SIZE}px ${getComputedStyle(parent).fontFamily}`

      // Travado em 2: num ecrã a 3x triplicam-se os pixels por frame sem
      // diferença visível numa grelha de texto.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const grid = gridFor(width, height)
      cols = grid.cols
      cells = Array.from({ length: grid.cols * grid.rows }, () => {
        const c = pick(glitchColors)
        return { ch: pick(characters), from: c, to: c, css: c, p: 1 }
      })
      draw()
    }

    const tick = () => {
      const now = performance.now()

      if (now - last >= glitchSpeed) {
        const n = Math.max(1, Math.round(cells.length * CHURN))
        for (let i = 0; i < n; i++) {
          const cell = cells[Math.floor(Math.random() * cells.length)]
          cell.ch = pick(characters)
          cell.from = cell.to
          cell.to = pick(glitchColors)
          if (smooth) {
            cell.p = 0
          } else {
            cell.p = 1
            cell.css = cell.to
          }
        }
        last = now
      }

      if (smooth) {
        for (const cell of cells) {
          if (cell.p < 1) {
            cell.p = Math.min(1, cell.p + FADE_STEP)
            cell.css = lerpColor(cell.from, cell.to, cell.p)
          }
        }
      }

      draw()
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      // No ticker do GSAP e não num rAF próprio: o Lenis já é conduzido por
      // este ticker, e dois loops descoordenados dão jitter no scroll.
      gsap.ticker.add(tick)
    }

    const stop = () => {
      if (!running) return
      running = false
      gsap.ticker.remove(tick)
    }

    resize()

    // O redimensionamento e a chegada da fonte valem para os dois casos: sem
    // movimento a grelha é estática, mas continua a ter de reagir a uma
    // rotação de ecrã e a ser repintada quando a fonte japonesa resolver.
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    // A fonte resolve depois do primeiro paint. Sem isto a grelha ficava
    // desenhada com o fallback do sistema até ao primeiro resize.
    void document.fonts.ready.then(() => {
      if (canvasRef.current) resize()
    })

    // Sem movimento, fica-se por aqui: a grelha está pintada e não arranca
    // loop nenhum.
    if (reducedMotion) {
      return () => ro.disconnect()
    }

    // Sem isto o canvas repintava a grelha inteira com o visitante já no
    // contacto — em 1080p são ~6900 fillText por frame, para ninguém ver.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(parent)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
    }
  }, [resolved, reducedMotion, glitchColors, glitchSpeed, smooth, characters])

  return (
    <div className={`font-jp relative h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />

      {/* O centro tem de respirar para o nome se ler por cima. */}
      {centerVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 46% 62% at 50% 50%, rgba(${PAPER},0.97) 0%, rgba(${PAPER},0.7) 52%, rgba(${PAPER},0) 78%)`,
          }}
        />
      )}

      {/* E o ruído não pode bater nas margens: cortado a direito lê-se como
          um rectângulo colado, não como atmosfera. */}
      {outerVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle, rgba(${PAPER},0) 52%, rgba(${PAPER},1) 100%)`,
          }}
        />
      )}
    </div>
  )
}
