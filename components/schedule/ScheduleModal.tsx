"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { gsap, useGSAP } from "@/lib/gsap"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { lenisBus } from "@/lib/lenisBus"
import { emitSpark } from "@/lib/sparks"
import { CALENDLY_URL, EMAIL } from "./config"

/** Só o calendário fica dentro do iframe. O resto escrevemo-lo nós. */
const PARAMS = "hide_gdpr_banner=1&hide_landing_page_details=1&hide_event_type_details=1"

/*
  Plano gratuito: `background_color`, `text_color` e `primary_color` são
  ignorados pelo Calendly. Ficam aqui por escrito para se ligarem numa linha
  se o plano mudar — pô-los no URL agora só sujava o link sem efeito nenhum.
*/
const CORES_PLANO_PAGO = ""

const SRC = `${CALENDLY_URL}?${PARAMS}${CORES_PLANO_PAGO}`

/** Ao fim disto, o utilizador fica com uma ligação em vez de uma espera. */
const TIMEOUT_MS = 8000

interface Props {
  aberto: boolean
  aoFechar: () => void
  devolverFocoA: React.RefObject<HTMLButtonElement | null>
}

export default function ScheduleModal({ aberto, aoFechar, devolverFocoA }: Props) {
  const { t } = useLanguage()
  const { reducedMotion } = useMotionPrefs()

  const painelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)
  const contadorRef = useRef<HTMLSpanElement>(null)
  const reguaRef = useRef<HTMLDivElement>(null)

  const [estado, setEstado] = useState<"a-carregar" | "pronto" | "falhou" | "marcado">("a-carregar")

  /* ------------------------------------------------------------------
   * Eventos do Calendly
   * --------------------------------------------------------------- */
  useEffect(() => {
    const ouvir = (event: MessageEvent) => {
      /*
        Validar a origem antes de olhar para o conteúdo. Sem isto, qualquer
        página ou iframe podia mandar `calendly.event_scheduled` e fazer o
        modal dizer que está marcado quando não está.
      */
      let origem: URL
      try {
        origem = new URL(event.origin)
      } catch {
        return
      }
      if (origem.hostname !== "calendly.com" && !origem.hostname.endsWith(".calendly.com")) return

      const dados = event.data
      if (dados?.event === "calendly.event_scheduled") setEstado("marcado")
    }
    window.addEventListener("message", ouvir)
    return () => window.removeEventListener("message", ouvir)
  }, [])

  /* ------------------------------------------------------------------
   * Scroll, foco e teclado
   * --------------------------------------------------------------- */
  useEffect(() => {
    if (!aberto) return

    const anterior = document.activeElement as HTMLElement | null

    /*
      `lenis.stop()` e não `overflow: hidden`.

      O Lenis interpola a posição fora da timeline do browser: com o overflow
      escondido continuava a mexer o conteúdo por baixo do modal. O overflow
      fica como recurso para quando o Lenis não existe — com movimento
      reduzido, ou antes de o preloader acabar, ele nem chega a ser montado.
    */
    const lenis = lenisBus.instance
    if (lenis) lenis.stop()
    else document.documentElement.style.overflow = "hidden"

    /*
      O fundo deixa de existir para o leitor de ecrã e para o Tab.

      `SCRIPT`, `STYLE` e `LINK` ficam de fora: não são focáveis nem lidos,
      e marcá-los era encher o DOM de atributos sem efeito. Sobram os
      elementos que de facto contêm conteúdo.
    */
    const painel = painelRef.current
    const IGNORAR = new Set(["SCRIPT", "STYLE", "LINK", "TEMPLATE"])
    const fundo = Array.from(document.body.children).filter(
      (el) => !IGNORAR.has(el.tagName) && (!painel || (!el.contains(painel) && el !== painel.parentElement)),
    ) as HTMLElement[]
    const inertesAntes = fundo.map((el) => el.hasAttribute("inert"))
    fundo.forEach((el) => el.setAttribute("inert", ""))

    fecharRef.current?.focus()

    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        aoFechar()
        return
      }
      if (event.key !== "Tab") return

      /*
        O foco fica preso — com um limite que vem do iframe ser cross-origin.

        Enquanto o foco está nos nossos elementos, o ciclo do Tab é fechado e
        o `Esc` funciona. Assim que entra no calendário do Calendly, os
        eventos de teclado deixam de nos chegar: um iframe de outra origem
        não propaga `keydown` para o documento pai, e não há forma de
        contornar isso — é a fronteira de segurança do browser a fazer o
        trabalho dela.

        Fica-se preso? Não. O Tab acaba por sair do iframe no fim do conteúdo
        dele, e o botão de fechar e o backdrop continuam a funcionar com o
        rato. Verificado: `Esc` com o foco no painel fecha e devolve o foco
        a quem abriu.
      */
      const focaveis = painelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focaveis || focaveis.length === 0) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]

      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault()
        ultimo.focus()
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener("keydown", aoTeclar)

    return () => {
      document.removeEventListener("keydown", aoTeclar)
      if (lenis) lenis.start()
      else document.documentElement.style.overflow = ""
      fundo.forEach((el, i) => {
        if (!inertesAntes[i]) el.removeAttribute("inert")
      })
      // O foco volta a quem abriu — nunca ao topo da página.
      ;(devolverFocoA.current ?? anterior)?.focus()
    }
  }, [aberto, aoFechar, devolverFocoA])

  /* ------------------------------------------------------------------
   * Entrada e saída
   * --------------------------------------------------------------- */
  useGSAP(
    () => {
      const painel = painelRef.current
      const backdrop = backdropRef.current
      if (!painel || !backdrop) return

      if (!aberto) {
        gsap.to([backdrop, painel], { opacity: 0, duration: 0.18, ease: "power2.in" })
        return
      }

      if (reducedMotion) {
        gsap.fromTo([backdrop, painel], { opacity: 0 }, { opacity: 1, duration: 0.15 })
        return
      }

      const tl = gsap.timeline()
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
      /*
        O mesmo dissolve do preloader, não um fade genérico: é o gesto com que
        este site abre as coisas.
      */
      tl.fromTo(
        painel,
        { opacity: 0, scale: 0.985, filter: "blur(6px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "dissolve" },
        0.05,
      )
      // Um flash curto de RGB split, uma vez.
      tl.fromTo(
        painel,
        { boxShadow: "-3px 0 0 var(--bg-accent), 3px 0 0 rgba(255,0,80,0.8)" },
        { boxShadow: "0 0 0 transparent", duration: 0.4, ease: "power2.out" },
        0.05,
      )
    },
    { dependencies: [aberto, reducedMotion], revertOnUpdate: true },
  )

  /* ------------------------------------------------------------------
   * Espera: o contador e a régua do preloader, em versão reduzida
   * --------------------------------------------------------------- */
  useGSAP(
    () => {
      if (!aberto || estado !== "a-carregar") return
      const contador = contadorRef.current
      const regua = reguaRef.current
      if (!contador || !regua) return

      const proxy = { v: 0 }
      const tween = gsap.to(proxy, {
        v: 92,
        duration: 6,
        ease: "power2.out",
        onUpdate: () => {
          contador.textContent = String(Math.round(proxy.v)).padStart(3, "0")
          regua.style.transform = `scaleX(${proxy.v / 100})`
        },
      })

      // Nunca deixar ninguém preso à espera.
      const limite = setTimeout(() => setEstado((e) => (e === "a-carregar" ? "falhou" : e)), TIMEOUT_MS)
      return () => {
        tween.kill()
        clearTimeout(limite)
      }
    },
    { dependencies: [aberto, estado] },
  )

  if (!aberto && estado !== "marcado") {
    // Fica montado mas fora do fluxo: reabrir tem de ser instantâneo.
    return <div ref={painelRef} hidden />
  }

  /*
    Portal para o `body`, e não onde o componente vive na árvore.

    A secção recebe `animate-fade-in-up` do observer da página, e essa
    animação carrega um `transform`. Um ancestral com transform cria bloco de
    contenção para `position: fixed`: o backdrop deixava de cobrir o ecrã e
    parava nas bordas da secção — via-se a página por cima e por baixo dele.
    Fora da árvore, `inset-0` volta a significar o viewport.
  */
  return createPortal(
    <div className="fixed inset-0 z-50" style={{ display: aberto ? undefined : "none" }}>
      <div
        ref={backdropRef}
        onClick={aoFechar}
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(3, 6, 10, 0.86)" }}
      />

      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agenda-titulo"
        onClick={(e) => {
          // Spark só dentro do painel, como no ecrã de idioma.
          if (!reducedMotion) emitSpark(e.clientX, e.clientY)
        }}
        className="absolute inset-x-3 top-3 bottom-3 mx-auto flex max-w-3xl flex-col overflow-hidden sm:inset-x-6 lg:inset-y-10"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Esquadrias hairline, como no retrato da About. */}
        {(["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
          (pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute z-10 size-4 ${pos}`}
              style={{ borderColor: "color-mix(in oklab, currentColor 35%, transparent)" }}
            />
          ),
        )}

        <header className="flex items-baseline justify-between gap-6 px-6 py-5 sm:px-8">
          <div>
            <h2 id="agenda-titulo" className="text-lg font-medium tracking-[-0.01em]">
              {t("schedule.modal_title")}
            </h2>
            {/*
              Os detalhes do evento vêm daqui, na nossa tipografia. É por isso
              que o `hide_event_type_details` está ligado: dentro do iframe
              fica só o calendário.
            */}
            <p className="mt-1 font-mono text-[11px] tracking-[0.16em] uppercase opacity-45">
              {t("schedule.modal_details")}
            </p>
          </div>
          <button
            ref={fecharRef}
            type="button"
            onClick={aoFechar}
            className="cursor-pointer font-mono text-[11px] tracking-[0.16em] uppercase opacity-60 transition-opacity hover:opacity-100"
          >
            {t("schedule.modal_close")}
          </button>
        </header>

        <div className="relative min-h-0 flex-1" style={{ borderTop: "1px solid color-mix(in oklab, currentColor 12%, transparent)" }}>
          {estado === "marcado" ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <h3 className="text-2xl font-medium tracking-[-0.02em]">{t("schedule.done_title")}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70">{t("schedule.done_body")}</p>
              {/* Não fecha sozinho: quem marcou tem de poder ler isto. */}
              <button
                type="button"
                onClick={aoFechar}
                className="mt-8 cursor-pointer px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase"
                style={{ border: "1px solid color-mix(in oklab, currentColor 28%, transparent)" }}
              >
                {t("schedule.done_close")}
              </button>
            </div>
          ) : null}

          {estado === "falhou" ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="max-w-md text-sm opacity-70">{t("schedule.fallback")}</p>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] tracking-[0.16em] uppercase underline">
                {t("schedule.fallback_link")}
              </a>
              <a href={`mailto:${EMAIL}`} data-selectable className="text-sm underline opacity-60">
                {EMAIL}
              </a>
            </div>
          ) : null}

          {estado === "a-carregar" ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5">
              <span ref={contadorRef} className="font-mono text-3xl tabular-nums opacity-70">
                000
              </span>
              <div className="h-px w-40 overflow-hidden" style={{ backgroundColor: "color-mix(in oklab, currentColor 14%, transparent)" }}>
                <div ref={reguaRef} className="h-full w-full origin-left" style={{ backgroundColor: "var(--bg-accent)", transform: "scaleX(0)" }} />
              </div>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-40">
                {t("schedule.loading")}
              </span>
            </div>
          ) : null}

          {estado !== "marcado" && estado !== "falhou" ? (
            <iframe
              src={SRC}
              title={t("schedule.modal_title")}
              onLoad={() => setEstado("pronto")}
              className="h-full w-full"
              style={{ border: 0, opacity: estado === "pronto" ? 1 : 0, transition: "opacity 300ms" }}
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}
