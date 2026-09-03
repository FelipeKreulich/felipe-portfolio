"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { SECTION_CONTAINER } from "@/lib/layout"
import { projects, statusKey } from "@/lib/projectsData"

const RULE = "color-mix(in oklab, currentColor 14%, transparent)"

/** Tamanho fixo. Não escala com a linha — se escalasse virava um cartão. */
const PREVIEW_W = 380
const PREVIEW_H = 240

/*
  A trama de pontos do tratamento de entrada. SVG embutido, não WebGL: já
  temos dois contextos no site e esse é o limite.
*/
const TRAMA =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23000'/%3E%3C/svg%3E\")"

/**
 * Índice de projetos.
 *
 * Índice, não grelha: linhas na mesma gramática do Percurso. Sem cartões, sem
 * sombras, sem o gradiente roxo — essa linguagem não pertence a este site.
 *
 * Passo 3: estático e semântico. As animações entram depois.
 */
export default function Projects({ ref }: { ref?: React.Ref<HTMLElement> }) {
  const { t } = useLanguage()
  const { reducedMotion, resolved } = useMotionPrefs()

  const listRef = useRef<HTMLOListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const tramaRef = useRef<HTMLDivElement>(null)
  const shotRefs = useRef<(HTMLDivElement | null)[]>([])

  /*
    As imagens da pré-visualização só entram no DOM depois do primeiro
    `pointerenter` na lista — não no carregamento da página.

    Isto é um re-render, mas acontece uma vez, à entrada. O que a regra
    proíbe é re-renderizar durante o movimento do cursor, e daqui para a
    frente é tudo DOM directo.
  */
  const [armado, setArmado] = useState(false)
  /*
    Sobrevive ao re-render de `armado`. Sem isto, o primeiro hover mostrava
    uma caixa vazia: o `pointerenter` da linha corria antes de as imagens
    entrarem no DOM, e como o cursor já estava dentro, nada voltava a
    disparar para a corrigir.
  */
  const ultimaLinha = useRef(-1)

  useGSAP(
    () => {
      const list = listRef.current
      const preview = previewRef.current
      if (!list || !preview || !resolved) return

      const linhas = Array.from(list.querySelectorAll<HTMLAnchorElement>("a[data-linha]"))
      const limpezas: (() => void)[] = []

      /* ----------------------------------------------------------------
       * Entrada no scroll
       * ------------------------------------------------------------- */
      if (!reducedMotion) {
        const entrada = gsap.from(linhas, {
          yPercent: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "reveal",
          scrollTrigger: { trigger: list, start: "top 80%", once: true },
        })
        limpezas.push(() => entrada.scrollTrigger?.kill())
      }

      /* ----------------------------------------------------------------
       * Pré-visualização
       * ------------------------------------------------------------- */
      const temHover = window.matchMedia("(hover: hover)").matches
      let activa = -1

      /** Troca a imagem visível com crossfade e volta a correr o tratamento. */
      const mostrar = (i: number) => {
        if (i === activa) return
        activa = i
        shotRefs.current.forEach((shot, n) => {
          if (!shot) return
          gsap.to(shot, { opacity: n === i ? 1 : 0, duration: 0.28, ease: "power2.out", overwrite: true })
        })

        /*
          Tratamento de entrada: contraste alto e trama por cima, a resolver
          para limpo em ~450ms enquanto a imagem assenta. Liga à linguagem da
          hero sem repetir a mecânica dela.
        */
        if (reducedMotion) return
        const alvo = shotRefs.current[i]
        if (alvo) {
          gsap.fromTo(
            alvo,
            { filter: "contrast(2.1) brightness(0.82) saturate(0.6)" },
            { filter: "contrast(1) brightness(1) saturate(1)", duration: 0.45, ease: "power2.out", overwrite: "auto" },
          )
        }
        if (tramaRef.current) {
          gsap.fromTo(
            tramaRef.current,
            { opacity: 0.5 },
            { opacity: 0, duration: 0.45, ease: "power2.out", overwrite: true },
          )
        }
      }

      const aparecer = () => gsap.to(preview, { opacity: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" })
      const desaparecer = () => {
        gsap.to(preview, { opacity: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" })
        activa = -1
        ultimaLinha.current = -1
      }

      if (temHover && !reducedMotion) {
        /*
          `quickTo` em vez de escrever no handler: o handler só actualiza um
          número, e é o ticker do GSAP — o único rAF do site — que escreve o
          transform.
        */
        const paraX = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" })
        const paraY = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" })
        const paraRot = gsap.quickTo(preview, "rotation", { duration: 0.45, ease: "power2" })

        /*
          Deslocada para a direita do cursor, não centrada nele.

          Centrada, tapava por completo o nome da linha que se está a
          apontar — a única coisa que ali interessa ler. À direita, cai no
          espaço vazio da linha e o nome fica visível. Presa ao ecrã nas
          bordas, para não sair fora à direita.
        */
        const mover = (event: PointerEvent) => {
          paraX(
            gsap.utils.clamp(8, window.innerWidth - PREVIEW_W - 8, event.clientX + 40),
          )
          paraY(
            gsap.utils.clamp(8, window.innerHeight - PREVIEW_H - 8, event.clientY - PREVIEW_H / 2),
          )
        }

        /*
          Inclinação por velocidade.

          A velocidade sai da posição já suavizada, lida uma vez por frame no
          ticker — não do delta bruto do `pointermove`, que dispara em rajadas
          e dava um tremor. Ao parar o cursor a velocidade cai e a caixa
          endireita-se sozinha.
        */
        let anterior = 0
        const inclinar = () => {
          const agora = Number(gsap.getProperty(preview, "x"))
          const v = agora - anterior
          anterior = agora
          // 1.1 e não 0.4: com o multiplicador baixo, um varrimento rápido
          // chegava a 2.6° e a inclinação não se via. Medido.
          paraRot(gsap.utils.clamp(-8, 8, v * 1.1))
        }
        gsap.ticker.add(inclinar)
        limpezas.push(() => gsap.ticker.remove(inclinar))

        list.addEventListener("pointermove", mover, { passive: true })
        list.addEventListener("pointerleave", desaparecer)
        limpezas.push(() => {
          list.removeEventListener("pointermove", mover)
          list.removeEventListener("pointerleave", desaparecer)
        })
      }

      // Primeiro contacto com a lista: carregar as imagens.
      const armar = () => setArmado(true)
      list.addEventListener("pointerenter", armar, { once: true })
      list.addEventListener("focusin", armar, { once: true })
      limpezas.push(() => {
        list.removeEventListener("pointerenter", armar)
        list.removeEventListener("focusin", armar)
      })

      linhas.forEach((linha, i) => {
        const numero = linha.querySelector<HTMLElement>("[data-numero]")
        const nome = linha.querySelector<HTMLElement>("[data-nome]")
        const scan = linha.querySelector<HTMLElement>("[data-scan]")

        const entrar = () => {
          ultimaLinha.current = i
          if (temHover) {
            mostrar(i)
            aparecer()
          }
          if (reducedMotion) return

          // RGB split no número.
          if (numero) {
            gsap.fromTo(
              numero,
              { textShadow: "0 0 0 transparent" },
              {
                textShadow: "-1.5px 0 var(--bg-accent), 1.5px 0 rgba(255,0,80,0.7)",
                duration: 0.18,
                yoyo: true,
                repeat: 1,
                overwrite: true,
              },
            )
          }
          if (nome) gsap.to(nome, { x: 12, duration: 0.4, ease: "power3.out", overwrite: true })
          if (scan) {
            gsap
              .timeline({ overwrite: true })
              .fromTo(scan, { xPercent: -120, opacity: 0 }, { opacity: 1, duration: 0.12 }, 0)
              .to(scan, { xPercent: 900, duration: 0.7, ease: "power2.out" }, 0)
              .to(scan, { opacity: 0, duration: 0.22 }, 0.48)
          }
        }

        const sair = () => {
          if (reducedMotion) return
          if (nome) gsap.to(nome, { x: 0, duration: 0.4, ease: "power3.out", overwrite: true })
        }

        /*
          Teclado: a pré-visualização aparece na mesma, mas ancorada à linha
          em foco em vez de ao cursor. Perseguir um cursor que não se move
          não faria sentido nenhum.
        */
        const focar = () => {
          entrar()
          mostrar(i)
          const caixa = linha.getBoundingClientRect()
          gsap.set(preview, {
            x: Math.min(caixa.right - PREVIEW_W - 24, window.innerWidth - PREVIEW_W - 24),
            y: gsap.utils.clamp(12, window.innerHeight - PREVIEW_H - 12, caixa.top + caixa.height / 2 - PREVIEW_H / 2),
            rotation: 0,
          })
          aparecer()
        }

        linha.addEventListener("pointerenter", entrar)
        linha.addEventListener("pointerleave", sair)
        linha.addEventListener("focus", focar)
        linha.addEventListener("blur", () => {
          sair()
          desaparecer()
        })
        limpezas.push(() => {
          linha.removeEventListener("pointerenter", entrar)
          linha.removeEventListener("pointerleave", sair)
          linha.removeEventListener("focus", focar)
        })
      })

      // Recuperar o hover que já estava a decorrer quando as imagens armaram.
      if (armado && temHover && ultimaLinha.current >= 0) {
        mostrar(ultimaLinha.current)
        aparecer()
      }

      return () => limpezas.forEach((fn) => fn())
    },
    { scope: listRef, dependencies: [resolved, reducedMotion, armado], revertOnUpdate: true },
  )

  return (
    <section id="projects" ref={ref} className="relative py-28 lg:py-36">
      <div className={SECTION_CONTAINER}>
        <div className="flex items-baseline justify-between gap-8">
          <p data-rhythm="secundario" className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-50">
            {t("projects.index.eyebrow")}
          </p>
          <p className="font-mono text-[11px] tracking-[0.18em] tabular-nums uppercase opacity-35">
            {projects.length.toString().padStart(2, "0")}
          </p>
        </div>

        <ol
          ref={listRef}
          /*
            As outras linhas recuam em hover, como no ecrã de idioma e no
            Percurso. Em CSS puro, e só onde há cursor a sério — em touch o
            `:hover` fica preso depois do toque.
          */
          className="mt-12 [@media(hover:hover)]:[&:has(a:hover)_li:not(:has(a:hover))]:opacity-40 lg:mt-16"
        >
          {projects.map((project) => {
            const destino = project.links.live ?? project.links.repo
            /*
              A coluna da direita diz a coisa mais específica que é verdade
              sobre o projeto: a métrica quando existe, o estado quando é
              informativo. Com os três projetos ativos, três etiquetas `ATIVO`
              iguais não eram telemetria — eram ruído.
            */
            const direita = project.metricKey
              ? t(project.metricKey)
              : project.status !== "live"
                ? t(statusKey[project.status])
                : null

            return (
              <li key={project.slug} style={{ borderTop: `1px solid ${RULE}` }}>
                <a
                  href={destino}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-linha
                  /*
                    Foco distinto do hover: o hover desloca o nome, o foco
                    acende uma barra de acento à esquerda. Quem navega por
                    teclado nunca fica sem saber onde está.
                  */
                  className="group relative grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 py-7 outline-none before:absolute before:top-4 before:bottom-4 before:-left-4 before:w-[2px] before:origin-top before:scale-y-0 before:bg-[var(--bg-accent)] before:transition-transform before:duration-300 focus-visible:before:scale-y-100 sm:gap-x-8 lg:grid-cols-[auto_1fr_auto] lg:items-baseline lg:py-9"
                >
                  {/* Varredura, uma vez por entrada do cursor. */}
                  <span
                    aria-hidden
                    data-scan
                    className="pointer-events-none absolute inset-y-0 left-0 w-[12%] opacity-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in oklab, var(--bg-accent) 22%, transparent), transparent)",
                    }}
                  />
                  {/*
                    Em telemóvel a miniatura vive dentro da linha e está sempre
                    visível — sem cursor não há pré-visualização a seguir, e
                    emular hover com toque é pior do que não ter.
                  */}
                  <Image
                    src={project.preview.src}
                    alt=""
                    width={project.preview.width}
                    height={project.preview.height}
                    sizes="(max-width: 1023px) 88px, 1px"
                    className="mt-1 h-[56px] w-[88px] rounded-[2px] object-cover object-top opacity-80 lg:hidden"
                  />

                  {/* Índice numerado, em mono e tabular. */}
                  <span
                    aria-hidden
                    data-numero
                    className="hidden font-mono text-[11px] tabular-nums opacity-30 lg:block"
                  >
                    {project.index}
                  </span>

                  <span className="min-w-0">
                    <span
                      data-nome
                      className="block text-xl font-medium tracking-[-0.02em] will-change-transform sm:text-2xl lg:text-3xl"
                    >
                      {project.name}
                    </span>
                    <span className="mt-1.5 block text-sm opacity-60 sm:text-base">
                      {t(project.summaryKey)}
                    </span>

                    {/* No máximo três. O resto vive na página de caso. */}
                    <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="font-mono text-[11px] opacity-40">
                          {tech}
                        </span>
                      ))}
                    </span>
                  </span>

                  {direita ? (
                    <span /*
                        Em telemóvel alinha com a coluna de texto, não com a
                        margem — arrancava por baixo da miniatura e parecia
                        pertencer à linha seguinte.
                      */
                      className="col-start-2 font-mono text-[11px] tracking-[0.14em] tabular-nums uppercase opacity-45 lg:col-start-auto lg:text-right lg:whitespace-nowrap">
                      {direita}
                    </span>
                  ) : (
                    <span className="hidden lg:block" />
                  )}
                </a>
              </li>
            )
          })}
        </ol>
        <div style={{ borderTop: `1px solid ${RULE}` }} />
      </div>

      {/*
        A pré-visualização. Decorativa: tudo o que ela mostra já está escrito
        na linha, por isso `aria-hidden`.

        `fixed` com transform-only — a posição nunca toca em `top`/`left`, que
        obrigariam a recalcular layout a cada frame.
      */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden overflow-hidden rounded-[3px] opacity-0 will-change-transform lg:block"
        style={{ width: PREVIEW_W, height: PREVIEW_H }}
      >
        {armado
          ? projects.map((project, i) => (
              <div
                key={project.slug}
                ref={(node) => {
                  shotRefs.current[i] = node
                }}
                className="absolute inset-0 opacity-0 will-change-[filter,opacity]"
              >
                <Image
                  src={project.preview.src}
                  alt=""
                  width={project.preview.width}
                  height={project.preview.height}
                  sizes="380px"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            ))
          : null}

        {/* A trama do tratamento de entrada, por cima de todas as imagens. */}
        <div
          ref={tramaRef}
          className="pointer-events-none absolute inset-0 opacity-0 [mix-blend-mode:multiply]"
          style={{ backgroundImage: TRAMA, backgroundSize: "4px 4px" }}
        />
      </div>
    </section>
  )
}
