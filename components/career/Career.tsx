"use client"

import { useRef } from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"
import { SECTION_CONTAINER } from "@/lib/layout"
import { career } from "@/lib/careerData"
import StackBand from "./StackBand"

interface CareerProps {
  ref?: React.Ref<HTMLElement>
}

/** Régua hairline entre linhas. */
const RULE = "color-mix(in oklab, currentColor 14%, transparent)"

/** O trilho em repouso, antes de ser preenchido. */
const TRACK = "color-mix(in oklab, currentColor 18%, transparent)"

/**
 * Percurso.
 *
 * Passo 2 de 5: estrutura semântica e layout estático. O trilho, a expansão
 * animada e a faixa de tecnologias entram a seguir.
 *
 * `<ol>` porque é uma lista ordenada por tempo, e `<details>`/`<summary>`
 * porque dão foco por teclado, `aria-expanded` implícito e funcionam sem
 * JavaScript nenhum — o requisito que um `<div onClick>` nunca cumpriria.
 */
export default function Career({ ref }: CareerProps) {
  const { t } = useLanguage()
  const { reducedMotion, resolved } = useMotionPrefs()
  const listRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([])

  useGSAP(
    () => {
      const list = listRef.current
      const fill = fillRef.current
      if (!list || !fill || !resolved) return

      const nodes = nodeRefs.current.filter(Boolean) as HTMLSpanElement[]
      if (nodes.length < 2) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const accent = "var(--bg-accent)"

      /*
        O trilho vai de centro-do-primeiro-nó a centro-do-último, e não da
        altura toda do contentor. Antes sobrava trilho por baixo do último nó
        que nunca chegava a ser preenchido, e lia-se como incompleto.

        Medido a cada refresh, porque abrir uma entrada move os nós.
      */
      const track = trackRef.current
      const layout = () => {
        if (!track) return
        const listTop = list.getBoundingClientRect().top
        const a = first.getBoundingClientRect()
        const b = last.getBoundingClientRect()
        /*
          Centro a centro, nunca topo a topo.

          O nó pulsa com `scale` em hover. Escalar move o topo do rectângulo
          mas não o centro, por isso `b.top - a.top` encolhia ou esticava o
          trilho ~3px sempre que o primeiro ou o último nó estava a pulsar. O
          centro é invariante à escala.
        */
        const centroA = a.top + a.height / 2
        const centroB = b.top + b.height / 2
        track.style.top = `${centroA - listTop}px`
        track.style.height = `${centroB - centroA}px`
      }
      layout()

      // Sem movimento: trilho cheio e nós preenchidos, estáticos.
      if (reducedMotion) {
        gsap.set(fill, { scaleY: 1 })
        gsap.set(nodes, { backgroundColor: accent, borderColor: accent })
        // Todas abertas, sem expansão, sem varredura, sem scramble.
        list.querySelectorAll<HTMLDetailsElement>("details").forEach((item) => {
          item.open = true
          const box = item.querySelector<HTMLElement>("[data-box]")
          if (box) box.style.gridTemplateRows = "1fr"
        })
        window.addEventListener("resize", layout, { passive: true })
        return () => window.removeEventListener("resize", layout)
      }

      /*
        `scaleY` com origem no topo, nunca `height`: alterar a altura obriga a
        um layout por frame, e isto corre em scrub.

        O intervalo é ancorado ao primeiro e ao último nó — não ao contentor.
        Com `end: "bottom 60%"` o trilho só completava depois de a secção já
        estar a sair do ecrã, e enquanto se lia nunca estava cheio.
      */
      gsap.set(fill, { scaleY: 0, transformOrigin: "top center" })
      const scrub = ScrollTrigger.create({
        trigger: first,
        start: "center 75%",
        endTrigger: last,
        end: "center 60%",
        scrub: 0.4,
        // Sem isto o intervalo ficava congelado nas alturas de origem, e cada
        // expansão desalinhava o preenchimento.
        invalidateOnRefresh: true,
        onRefresh: layout,
        /*
          Monotónico: o preenchimento nunca recua.

          Com um `animation` normal, abrir uma entrada acrescentava conteúdo
          por baixo e a mesma posição de scroll passava a valer menos — o
          traço encolhia à frente de quem tinha acabado de abrir a linha.
          Tecnicamente certo, mas lê-se como avaria.

          O traço marca até onde já se leu, e ler mais nunca desfaz isso.
        */
        onUpdate: (self) => {
          const atual = (gsap.getProperty(fill, "scaleY") as number) || 0
          if (self.progress > atual) {
            gsap.to(fill, { scaleY: self.progress, duration: 0.3, ease: "none", overwrite: true })
          }
        },
      })

      // Cada nó passa de contorno a preenchido quando a sua linha entra.
      const nodeTriggers = nodes.map((node) =>
        ScrollTrigger.create({
          trigger: node,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(node, {
              backgroundColor: accent,
              borderColor: accent,
              duration: 0.4,
              ease: "power2.out",
            }),
        }),
      )

      /* ----------------------------------------------------------------
       * Expansão
       * ------------------------------------------------------------- */
      const items = Array.from(list.querySelectorAll<HTMLDetailsElement>("details"))
      const hasHover = window.matchMedia("(hover: hover)").matches

      const boxOf = (item: HTMLDetailsElement) =>
        item.querySelector<HTMLElement>("[data-box]")

      /*
        A caixa e o trilho movem-se no mesmo frame.

        `layout()` só corria no toggle, ou seja duas vezes: no início e no fim
        dos 0.45s de expansão. Durante a animação o trilho mantinha a geometria
        velha — ficava curto e só crescia no fim ao abrir, ficava longo e só
        encolhia no fim ao fechar. Escrever a altura e remedir no mesmo
        `onUpdate` elimina o desfasamento.
      */
      const aplicar = (box: HTMLElement, v: number) => {
        box.style.gridTemplateRows = `${v}fr`
        layout()
      }

      const abrir = (item: HTMLDetailsElement) => {
        const box = boxOf(item)
        if (!box || item.open) return
        item.open = true
        const proxy = { v: 0 }
        gsap.killTweensOf(proxy)
        gsap.to(proxy, {
          v: 1,
          duration: 0.45,
          ease: "power3.out",
          onUpdate: () => aplicar(box, proxy.v),
          onComplete: () => ScrollTrigger.refresh(),
        })
        // O conteúdo entra depois de a caixa abrir, não ao mesmo tempo.
        gsap.fromTo(
          box.querySelectorAll("[data-reveal]"),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, delay: 0.14, ease: "power2.out" },
        )
      }

      const fechar = (item: HTMLDetailsElement) => {
        const box = boxOf(item)
        if (!box || !item.open) return
        const proxy = { v: 1 }
        gsap.killTweensOf(proxy)
        gsap.to(proxy, {
          v: 0,
          duration: 0.3,
          ease: "power3.out",
          onUpdate: () => aplicar(box, proxy.v),
          onComplete: () => {
            // `open` só cai no fim — antes disso o browser escondia o
            // conteúdo e não havia nada para animar.
            item.open = false
            ScrollTrigger.refresh()
          },
        })
      }

      const abrirSo = (alvo: HTMLDetailsElement | null) => {
        items.forEach((item) => (item === alvo ? abrir(item) : fechar(item)))
      }

      // Estado inicial: tudo fechado, menos a primeira em touch.
      items.forEach((item, index) => {
        const box = boxOf(item)
        const inicial = !hasHover && index === 0
        if (box) box.style.gridTemplateRows = inicial ? "1fr" : "0fr"
        item.open = inicial
      })

      const limpezas: Array<() => void> = []

      /*
        Ligação entre a lista e a faixa: passar o cursor numa entrada acende
        as tecnologias dessa entrada na banda. DOM directo, sem estado nem
        eventos — é uma consulta por hover, não por frame.
      */
      const acender = (tecnologias: string[] | null) => {
        document.querySelectorAll<HTMLElement>("[data-band-tech]").forEach((span) => {
          const activa = tecnologias?.includes(span.dataset.bandTech ?? "")
          span.style.opacity = tecnologias === null ? "" : activa ? "1" : "0.12"
          span.style.color = activa ? "var(--bg-accent)" : ""
        })
      }

      items.forEach((item) => {
        const summary = item.querySelector<HTMLElement>("[data-summary]")
        const year = item.querySelector<HTMLElement>("[data-year]")
        const scan = item.querySelector<HTMLElement>("[data-scan]")
        const node = item.closest("li")?.querySelector<HTMLElement>("span[aria-hidden]")
        if (!summary) return

        // Clique e teclado: o `<details>` faz o toggle nativo, e nós
        // assumimos o controlo para animar e fechar as outras.
        const onClick = (event: MouseEvent) => {
          event.preventDefault()
          abrirSo(item.open ? null : item)
        }
        summary.addEventListener("click", onClick)
        limpezas.push(() => summary.removeEventListener("click", onClick))

        if (!hasHover) return

        const entrada = career[items.indexOf(item)]

        const onEnter = () => {
          abrirSo(item)
          if (entrada) acender([...entrada.stack, ...entrada.context])

          // Varredura, uma vez por entrada.
          if (scan) {
            /*
              Timeline e não um `fromTo` só: com um tween único a varredura
              acabava o percurso com `opacity: 1` e ficava estacionada na
              borda direita da linha, como um retângulo aceso.
            */
            gsap
              .timeline({ overwrite: true })
              .fromTo(scan, { xPercent: -120, opacity: 0 }, { opacity: 1, duration: 0.12 }, 0)
              .to(scan, { xPercent: 900, duration: 0.7, ease: "power2.out" }, 0)
              .to(scan, { opacity: 0, duration: 0.22 }, 0.48)
          }
          // RGB split subtil no ano.
          if (year) {
            gsap.fromTo(
              year,
              { textShadow: "0 0 0 transparent" },
              {
                textShadow: "-1.2px 0 rgba(255,45,85,.55), 1.2px 0 rgba(0,229,255,.55)",
                duration: 0.18,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
                overwrite: true,
              },
            )
          }
          if (node) {
            gsap.fromTo(node, { scale: 1 }, { scale: 2.1, duration: 0.28, yoyo: true, repeat: 1, ease: "power2.out", overwrite: true })
          }
        }
        summary.addEventListener("pointerenter", onEnter)
        limpezas.push(() => summary.removeEventListener("pointerenter", onEnter))
      })

      if (hasHover) {
        const apagar = () => acender(null)
        list.addEventListener("pointerleave", apagar)
        limpezas.push(() => {
          list.removeEventListener("pointerleave", apagar)
          apagar()
        })
      }

      /* ----------------------------------------------------------------
       * Entrada no scroll
       * ------------------------------------------------------------- */
      const linhas = items.map((item) => item.querySelector("[data-summary]")).filter(Boolean) as HTMLElement[]
      const entrada = gsap.from(linhas, {
        yPercent: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "reveal",
        scrollTrigger: { trigger: list, start: "top 78%", once: true },
      })
      limpezas.push(() => entrada.scrollTrigger?.kill())

      const anos = items
        .map((item) => item.querySelector<HTMLElement>("[data-year]"))
        .filter(Boolean) as HTMLElement[]
      /*
        O alvo do scramble vem do atributo, nunca de `{original}`.

        `{original}` lê o texto que está no DOM no instante em que o tween
        arranca. Se um scramble anterior for interrompido a meio — re-execução
        do efeito, HMR, revert — o elemento fica a mostrar dígitos aleatórios,
        e o tween seguinte adopta esses dígitos como "original". O ano ficava
        corrompido de forma permanente: 2025 virava 2008.
      */
      const scramble = gsap.timeline({
        scrollTrigger: { trigger: list, start: "top 78%", once: true },
      })
      anos.forEach((el, i) => {
        scramble.to(
          el,
          {
            duration: 0.8,
            ease: "none",
            scrambleText: { text: el.dataset.year ?? "", chars: "0123456789", speed: 0.6 },
          },
          i * 0.08,
        )
      })
      limpezas.push(() => {
        scramble.scrollTrigger?.kill()
        scramble.kill()
        // Limpar a meio deixaria dígitos aleatórios no ecrã.
        anos.forEach((el) => {
          el.textContent = el.dataset.year ?? el.textContent
        })
      })

      /*
        Abrir uma entrada muda a altura da lista. O refresh remapeia o
        intervalo e o `layout` reposiciona o trilho; sem os dois, o
        preenchimento ficava a meio.
      */
      const onToggle = () => {
        layout()
        ScrollTrigger.refresh()
      }
      const details = Array.from(list.querySelectorAll("details"))
      details.forEach((d) => d.addEventListener("toggle", onToggle))
      window.addEventListener("resize", layout, { passive: true })

      return () => {
        scrub.kill()
        nodeTriggers.forEach((trigger) => trigger.kill())
        details.forEach((d) => d.removeEventListener("toggle", onToggle))
        window.removeEventListener("resize", layout)
        limpezas.forEach((limpar) => limpar())
      }
    },
    { scope: listRef, dependencies: [resolved, reducedMotion], revertOnUpdate: true },
  )

  return (
    <section id="work" ref={ref} className="relative py-28 lg:py-36">
      <div className={SECTION_CONTAINER}>
        <div className="flex items-baseline justify-between gap-8">
          <p data-rhythm="secundario" className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-50">
            {t("work.title")}
          </p>
          <p className="font-mono text-[11px] tabular-nums uppercase tracking-[0.18em] opacity-35">
            {t("work.period")}
          </p>
        </div>

        {/* O trilho encosta aqui no passo 3. */}
        <div ref={listRef} className="relative mt-12 lg:mt-16">
          {/*
            O trilho. Hairline em repouso, com o traço de acento a preenchê-lo
            de cima para baixo conforme o scroll — é o `2021 — Presente`
            desenhado em vez de escrito.
          */}
          <div
            ref={trackRef}
            aria-hidden
            className="pointer-events-none absolute left-0 w-px"
            style={{ backgroundColor: TRACK, top: 0, height: 0 }}
          >
            <div ref={fillRef} className="h-full w-full" style={{ backgroundColor: "var(--bg-accent)" }} />
          </div>

          {/*
            Compromisso visual: a linha sob o cursor mantém-se, as outras
            recuam. Puro CSS e só onde há hover a sério — em touch o
            `:hover` fica preso depois do toque.
          */}
          <ol
            className="pl-8 [@media(hover:hover)]:[&:has(summary:hover)_li:not(:has(summary:hover))]:opacity-40 sm:pl-12"
            style={{ borderTop: `1px solid ${RULE}` }}
          >
          {career.map((entry, index) => (
            <li key={entry.id} className="relative" style={{ borderBottom: `1px solid ${RULE}` }}>
              {/* O nó desta entrada, encostado ao trilho. */}
              <span
                ref={(node) => {
                  nodeRefs.current[index] = node
                }}
                aria-hidden
                /*
                  A margem negativa acompanha o padding da lista (`pl-8` /
                  `sm:pl-12`) para o nó cair sempre em cima do trilho — com um
                  valor fixo desalinhava 16px no breakpoint.
                */
                className="pointer-events-none absolute left-0 top-[2.05rem] -ml-8 h-[7px] w-[7px] -translate-x-1/2 sm:-ml-12"
                style={{
                  border: "1px solid var(--bg-accent)",
                  backgroundColor: "transparent",
                }}
              />
              <details className="group">
                <summary
                  data-summary
                  className="relative flex cursor-pointer list-none items-baseline gap-6 overflow-hidden py-6 outline-none [&::-webkit-details-marker]:hidden"
                >
                  {/* Varredura de scanline, uma vez por entrada de cursor. */}
                  <span
                    aria-hidden
                    data-scan
                    className="pointer-events-none absolute inset-y-0 left-0 w-24 opacity-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in oklab, var(--bg-accent) 22%, transparent), transparent)",
                    }}
                  />
                  <span
                    data-year={entry.year}
                    className="relative shrink-0 font-mono text-2xl tabular-nums opacity-60 sm:text-3xl"
                  >
                    {entry.year}
                  </span>
                  <span className="flex-1 text-lg font-medium sm:text-xl">
                    {t(`work.${entry.id}.role`)}
                  </span>
                  <span className="hidden shrink-0 text-right text-sm opacity-50 sm:block">
                    {t(`work.${entry.id}.company`)}
                  </span>
                </summary>

                {/*
                  Continua no DOM quando fechada — o `<details>` esconde-a, mas
                  os leitores de ecrã e o Google encontram-na na mesma.
                */}
                {/*
                  Grelha de uma linha animada de `0fr` a `1fr`. O filho leva
                  `overflow: hidden` — é o par que permite abrir sem medir
                  altura à mão e sem tocar em `height: auto`.
                */}
                <div data-box className="grid" style={{ gridTemplateRows: "1fr" }}>
                  <div className="overflow-hidden">
                <div className="pb-8 pl-0 sm:pl-[5.5rem]">
                  <p data-reveal className="max-w-[52ch] text-[15px] leading-relaxed opacity-70">
                    {t(`work.${entry.id}.description`)}
                  </p>

                  <p className="mt-4 text-sm opacity-50 sm:hidden">
                    {t(`work.${entry.id}.company`)}
                  </p>

                  {entry.stack.length > 0 && (
                    <TagRow label={t("work.stack")} tags={entry.stack} strong />
                  )}
                  {entry.context.length > 0 && (
                    <TagRow label={t("work.context")} tags={entry.context} />
                  )}
                </div>
                  </div>
                </div>
              </details>
            </li>
            ))}
          </ol>
        </div>
      </div>

      {/* A faixa separa esta secção da seguinte. */}
      <div className="mt-24 lg:mt-32">
        <StackBand />
      </div>
    </section>
  )
}

function TagRow({ label, tags, strong }: { label: string; tags: string[]; strong?: boolean }) {
  return (
    <div data-reveal className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-35">
        {label}
      </span>
      {tags.map((tag) => (
        <span
          key={tag}
          data-tech={tag}
          className={`font-mono text-[11px] ${strong ? "opacity-80" : "opacity-45"}`}
          style={
            strong
              ? undefined
              : // Contexto: sem contorno, mais apagado. A diferença tem de se
                // ver sem legenda.
                { fontStyle: "italic" }
          }
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
