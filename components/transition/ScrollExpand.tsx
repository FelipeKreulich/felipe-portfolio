"use client"

import { useRef } from "react"
import type { CSSProperties, ReactNode } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"

/*
  Adaptado do ScrollExpand do React Bits. A composição visual é a do
  original — a moldura abre em `clip-path: inset()`, a imagem desfaz o zoom,
  o título sai e o texto entra. O motor é que mudou, por três razões:

  1. O original abre o seu próprio `requestAnimationFrame` e faz o seu
     próprio lerp exponencial. Aqui só existe um rAF, o do ticker do GSAP,
     e o `scrub` do ScrollTrigger já é a suavização.

  2. O original ouve `scroll` na janela. Este site rola com Lenis: duas
     suavizações em série davam um arrasto pastoso. O ScrollTrigger já está
     ligado ao Lenis, portanto lê a mesma posição, uma vez só.

  3. O original lê `matchMedia` à mão. O projecto tem provider para isso, e
     é ele que decide — inclui `saveData` e dispositivos fracos, não só a
     preferência do sistema.

  Mantive a API de props para o componente continuar a ser substituível.
*/

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1)
  return t * t * (3 - 2 * t)
}

export interface ScrollExpandProps {
  /** Imagem servida em ecrãs largos. */
  src: string
  /** Variante leve para telemóvel. Sem isto serve-se `src` a toda a gente. */
  srcMobile?: string
  alt?: string
  /** Frase visível enquanto a moldura está fechada. */
  title?: string
  scrollHint?: string
  startWidth?: number
  startHeight?: number
  startRadius?: number
  endRadius?: number
  mediaZoom?: number
  /** Altura da expansão, em múltiplos do ecrã. */
  scrollDistance?: number
  /** Ecrãs de pausa no fim, com a imagem já aberta. */
  holdDistance?: number
  overlayScrim?: number
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export default function ScrollExpand({
  src,
  srcMobile,
  alt = "",
  title = "",
  scrollHint = "",
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  overlayScrim = 0.45,
  children,
  className = "",
  style,
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const duotoneRef = useRef<HTMLDivElement>(null)
  const scanRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)

  const { reducedMotion, resolved } = useMotionPrefs()

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      const stage = stageRef.current
      const frame = frameRef.current
      const media = mediaRef.current
      if (!root || !track || !stage || !frame || !media || !resolved) return

      /**
       * Escreve o estado da moldura para um progresso de 0 a 1.
       *
       * Toca só em `clip-path`, `transform` e `opacity` — nenhuma destas
       * propriedades obriga o browser a recalcular layout.
       */
      const aplicar = (p: number) => {
        const e = smoothstep(0, 1, p)

        const w = startWidth + (100 - startWidth) * e
        const h = startHeight + (100 - startHeight) * e
        const ix = Math.max(0, (100 - w) / 2)
        const iy = Math.max(0, (100 - h) / 2)
        const r = startRadius + (endRadius - startRadius) * e
        frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`

        media.style.transform = `scale(${mediaZoom + (1 - mediaZoom) * e})`

        /*
          O filtro resolve-se com a abertura.

          Fechada, a imagem é um duotone dessaturado e um pouco desfocado:
          lê-se como textura, não pede leitura. À medida que a moldura toma o
          ecrã, a cor volta e o foco assenta — a fotografia torna-se real no
          momento em que passa a ser o assunto. Não é filtro por cima, é o
          mesmo gesto da moldura dito de outra maneira.
        */
        /*
          Valores medidos, não escolhidos a olho: 92% dos pixels da fotografia
          estão no terço inferior de luminância (média 43/255). Sem levantar a
          curva primeiro, qualquer tratamento dava um bloco escuro chapado —
          foi o que aconteceu à primeira tentativa. O `brightness` a 2.1 e o
          `contrast` a 1.45 abrem a gama; o `grayscale` fica em 0.82 e não em
          1 porque a cena já é magenta e ciano, e apagá-la por completo para
          voltar a pintá-la por cima era trabalho a dobrar.
        */
        media.style.filter = `grayscale(${0.82 * (1 - e)}) brightness(${1 + 1.1 * (1 - e)}) contrast(${1 + 0.45 * (1 - e)}) blur(${3 * (1 - e)}px)`
        if (duotoneRef.current) duotoneRef.current.style.opacity = `${0.32 * (1 - e)}`
        if (scanRef.current) scanRef.current.style.opacity = `${0.3 * (1 - e)}`

        if (scrimRef.current) scrimRef.current.style.opacity = `${overlayScrim * e}`

        if (titleRef.current) {
          // A frase sai antes de a moldura acabar de abrir, para não
          // colidir com o texto que entra.
          const out = smoothstep(0.4, 0.88, p)
          titleRef.current.style.opacity = `${1 - out}`
          // O -50% em X vai aqui dentro: o transform inline substitui a
          // classe `-translate-x-1/2`, não se soma a ela.
          titleRef.current.style.transform = `translate3d(-50%, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`
          /*
            A frase acompanha a largura da moldura.

            A versão do registo põe o título a ocupar o palco todo, o que
            funciona numa página escura. Aqui o fundo é creme: o texto branco
            que saísse da imagem desaparecia. Amarrado à moldura, está sempre
            por cima da fotografia.
          */
          titleRef.current.style.width = `${w}%`
        }

        if (hintRef.current) {
          const gone = smoothstep(0, 0.12, p)
          hintRef.current.style.opacity = `${1 - gone}`
          hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`
        }

        if (overlayRef.current) {
          const inn = smoothstep(0.68, 1, p)
          overlayRef.current.style.opacity = `${inn}`
          overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`
        }
      }

      const medir = () => {
        const altura = window.innerHeight
        stage.style.height = `${altura}px`
        track.style.height = `${altura * (1 + Math.max(0, scrollDistance) + Math.max(0, holdDistance))}px`
        // Dimensionada pela moldura fechada, que é a caixa mais apertada
        // em que a frase tem de caber.
        const larguraFechada = (root.clientWidth || altura) * (startWidth / 100)
        stage.style.setProperty("--se-title-size", `${clamp(larguraFechada * 0.082, 18, 60)}px`)
      }

      medir()

      /*
        Sem movimento: a moldura fica aberta e o texto legível, sem pista de
        scroll e sem pista falsa de que há aqui algo para animar. A altura do
        track cai para um ecrã — manter três ecrãs de scroll para uma imagem
        parada seria só um buraco na página.
      */
      if (reducedMotion) {
        const altura = window.innerHeight
        stage.style.height = `${altura}px`
        track.style.height = `${altura}px`
        aplicar(1)
        if (hintRef.current) hintRef.current.style.opacity = "0"
        if (lightRef.current) lightRef.current.style.opacity = "0"
        window.addEventListener("resize", medir, { passive: true })
        return () => window.removeEventListener("resize", medir)
      }

      /*
        `scrub: 0.6` substitui o lerp do original. A diferença é que o valor
        não é reconstruído a cada evento de scroll: o ScrollTrigger lê a
        posição uma vez por frame no ticker partilhado.
      */
      const proxy = { p: 0 }
      const st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: () => `+=${window.innerHeight * Math.max(0.01, scrollDistance)}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: medir,
        animation: gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => aplicar(proxy.p),
        }),
      })

      aplicar(0)

      /*
        O cursor é uma terceira fonte de luz.

        A cena está iluminada por tubos de néon, portanto a interação
        coerente aqui é acender, não revelar — a hero já revela com máscara
        radial e o vídeo já deforma a trama. `screen` soma luz onde o cursor
        passa, como um candeeiro que ninguém montou.

        Sem estado, sem rAF novo: o `quickTo` do GSAP corre no ticker que já
        existe e escreve transform, que é trabalho do compositor.
      */
      const light = lightRef.current
      let limparLuz = () => {}
      if (light && window.matchMedia("(hover: hover)").matches) {
        const paraX = gsap.quickTo(light, "x", { duration: 0.5, ease: "power3" })
        const paraY = gsap.quickTo(light, "y", { duration: 0.5, ease: "power3" })
        const paraO = gsap.quickTo(light, "opacity", { duration: 0.45, ease: "power2" })

        const mover = (event: PointerEvent) => {
          const caixa = stage.getBoundingClientRect()
          paraX(event.clientX - caixa.left)
          paraY(event.clientY - caixa.top)
        }
        const entrar = () => paraO(1)
        const sair = () => paraO(0)

        stage.addEventListener("pointermove", mover, { passive: true })
        stage.addEventListener("pointerenter", entrar)
        stage.addEventListener("pointerleave", sair)
        limparLuz = () => {
          stage.removeEventListener("pointermove", mover)
          stage.removeEventListener("pointerenter", entrar)
          stage.removeEventListener("pointerleave", sair)
        }
      }

      return () => {
        st.kill()
        limparLuz()
      }
    },
    { scope: rootRef, dependencies: [resolved, reducedMotion], revertOnUpdate: true },
  )

  return (
    <div ref={rootRef} className={`relative w-full ${className}`.trim()} style={style}>
      <div ref={trackRef} className="relative w-full">
        <div ref={stageRef} className="sticky top-0 w-full overflow-hidden [--se-title-size:4rem]">
          <div
            ref={frameRef}
            className="absolute inset-0 [clip-path:inset(21%_29%_21%_29%_round_24px)] [will-change:clip-path]"
          >
            {/*
              `<img>` simples e não `next/image`: a moldura precisa da imagem
              a preencher `inset-0` com `object-cover` e um `transform` de
              zoom próprio, e o wrapper do next/image estorva as duas coisas.
              `fetchPriority="low"` porque isto está muito abaixo da dobra.
            */}
            <picture>
              {srcMobile ? <source media="(max-width: 640px)" srcSet={srcMobile} /> : null}
              <img
                ref={mediaRef}
                className="absolute inset-0 h-full w-full origin-center object-cover select-none [will-change:transform]"
                src={src}
                alt={alt}
                draggable={false}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </picture>
            {/*
              Duotone verdadeiro, em duas camadas.

              A primeira tentativa foi um gradiente com `mix-blend-mode: color`
              e saiu um bloco violeta chapado: `color` aplica a cor por
              posição no ecrã, não por luminância da imagem. Um duotone mapeia
              a escala de cinzentos para uma rampa de duas cores, e em CSS
              isso faz-se com `lighten` a levantar as sombras para a cor
              escura e `darken` a puxar as luzes para a cor clara.
            */}
            <div ref={duotoneRef} aria-hidden className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0 [mix-blend-mode:lighten]"
                style={{ backgroundColor: "oklch(0.28 0.11 268)" }}
              />
              <div
                className="absolute inset-0 [mix-blend-mode:darken]"
                style={{ backgroundColor: "oklch(0.82 0.13 328)" }}
              />
            </div>

            {/* Trama de linhas, só enquanto está fechada. */}
            <div
              ref={scanRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 [mix-blend-mode:overlay]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/*
              A luz do cursor. Fica centrada na origem e é o transform que a
              leva ao ponteiro — assim o gradiente é pintado uma vez e nunca
              mais recalculado.
            */}
            <div
              ref={lightRef}
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 -mt-[26vmax] -ml-[26vmax] h-[52vmax] w-[52vmax] opacity-0 [mix-blend-mode:screen] [will-change:transform,opacity]"
              style={{
                background:
                  "radial-gradient(circle closest-side, oklch(0.72 0.19 328 / 0.5) 0%, oklch(0.62 0.17 250 / 0.22) 42%, transparent 72%)",
              }}
            />

            <div
              ref={scrimRef}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.4))] opacity-0"
            />
            {children ? (
              /*
                O scrim vive na camada do texto, não na imagem inteira.

                O gradiente de baixo para cima que vem do componente original
                não chega aqui: o texto fica a meia altura e por trás passam
                os tubos de néon. Medido, o pior contraste era 1.00:1 — havia
                pixels tão claros como a letra. Uma elipse escura centrada no
                texto resolve sem chapar a fotografia toda, e entra e sai com
                o próprio texto.
              */
              <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col items-center justify-center p-[6%] text-center opacity-0 [will-change:opacity,transform]"
                style={{
                  background:
                    "radial-gradient(ellipse 58% 42% at 50% 47%, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0.35) 70%, transparent 88%)",
                }}
              >
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div
              ref={titleRef}
              className="pointer-events-none absolute inset-y-0 left-1/2 m-0 flex items-center justify-center px-[4%] text-center leading-[1.08] font-medium tracking-[-0.03em] text-balance text-white [font-size:var(--se-title-size)] [text-shadow:0_2px_20px_rgba(0,0,0,0.7)] [will-change:opacity,transform]"
            >
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div
              ref={hintRef}
              className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-mono text-xs tracking-[0.18em] text-white/70 uppercase [will-change:opacity,transform]"
            >
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
