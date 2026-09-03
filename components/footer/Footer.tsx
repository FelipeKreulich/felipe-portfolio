"use client"

import { useRef, useState } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { lenisBus } from "@/lib/lenisBus"
import { emitSpark } from "@/lib/sparks"
import { SECTION_CONTAINER } from "@/lib/layout"
import { socials } from "./socials"
import ClosingDissolve from "./ClosingDissolve"
import FooterControls from "./FooterControls"
import type { GitHubStats } from "@/lib/github"

const RULE = "color-mix(in oklab, currentColor 14%, transparent)"
const EMAIL = "contato.felipe.kreulich@gmail.com"

/**
 * O fecho do site.
 *
 * Presença, não pedido: a secção de agenda já pede contacto, e repetir a
 * frase e o botão aqui era dizer duas vezes a mesma coisa no espaço de um
 * ecrã. Aqui fica onde mais me encontram, uma medida real de atividade e a
 * linha final.
 */
export default function Footer({ stats }: { stats: GitHubStats | null }) {
  const { t } = useLanguage()
  const { reducedMotion, resolved } = useMotionPrefs()
  const listaRef = useRef<HTMLUListElement>(null)
  const [copiado, setCopiado] = useState<"nao" | "sim" | "falhou">("nao")

  useGSAP(
    () => {
      const lista = listaRef.current
      if (!lista || !resolved || reducedMotion) return

      const linhas = Array.from(lista.querySelectorAll<HTMLAnchorElement>("a[data-linha]"))
      const limpezas: (() => void)[] = []

      linhas.forEach((linha) => {
        const handle = linha.querySelector<HTMLElement>("[data-handle]")
        const scan = linha.querySelector<HTMLElement>("[data-scan]")

        const entrar = () => {
          if (handle) gsap.to(handle, { x: 10, duration: 0.4, ease: "power3.out", overwrite: true })
          if (scan) {
            gsap
              .timeline({ overwrite: true })
              .fromTo(scan, { xPercent: -120, opacity: 0 }, { opacity: 1, duration: 0.12 }, 0)
              .to(scan, { xPercent: 900, duration: 0.7, ease: "power2.out" }, 0)
              .to(scan, { opacity: 0, duration: 0.22 }, 0.48)
          }
        }
        const sair = () => {
          if (handle) gsap.to(handle, { x: 0, duration: 0.4, ease: "power3.out", overwrite: true })
        }

        linha.addEventListener("pointerenter", entrar)
        linha.addEventListener("pointerleave", sair)
        linha.addEventListener("focus", entrar)
        linha.addEventListener("blur", sair)
        limpezas.push(() => {
          linha.removeEventListener("pointerenter", entrar)
          linha.removeEventListener("pointerleave", sair)
          linha.removeEventListener("focus", entrar)
          linha.removeEventListener("blur", sair)
        })
      })

      return () => limpezas.forEach((fn) => fn())
    },
    { scope: listaRef, dependencies: [resolved, reducedMotion], revertOnUpdate: true },
  )

  /*
    Copiar em vez de `mailto:`.

    Muita gente em desktop não tem cliente de email configurado, e nesses o
    `mailto:` falha em silêncio — clica-se e não acontece nada. Copiar nunca
    falha, e o `mailto:` fica ao lado para quem o tem.
  */
  const copiar = async (event: React.MouseEvent) => {
    if (!reducedMotion) emitSpark(event.clientX, event.clientY)
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopiado("sim")
    } catch {
      // Sem Clipboard API (http, permissões negadas): o endereço fica
      // seleccionável e diz-se isso em vez de fingir que copiou.
      setCopiado("falhou")
    }
    setTimeout(() => setCopiado("nao"), 3000)
  }

  const aoTopo = (event: React.MouseEvent) => {
    event.preventDefault()
    const lenis = lenisBus.instance
    // `window.scrollTo` briga com o Lenis: ele continua a interpolar para a
    // posição antiga e o salto fica a meio.
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  }

  return (
    <footer
      id="rodape"
      role="contentinfo"
      /*
        A grelha engrossa e o acento esvai-se ao chegar aqui — o mesmo
        mecanismo por secção que o resto do site já usa.
      */
      data-grid-color="#1b1c22"
      data-grid-accent="#3a4046"
      className="relative pt-24 pb-10 lg:pt-32"
    >
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
          {/* ---------------------------------------------------------- */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">
              {t("footer.elsewhere")}
            </p>

            <ul
              ref={listaRef}
              className="mt-8 [@media(hover:hover)]:[&:has(a:hover)_li:not(:has(a:hover))]:opacity-40"
            >
              {socials.map((social) => (
                <li key={social.plataforma} style={{ borderTop: `1px solid ${RULE}` }}>
                  <a
                    data-linha
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.nome}, ${t("footer.external")}`}
                    className="group relative grid grid-cols-[7.5rem_1fr_auto] items-baseline gap-4 py-4 outline-none focus-visible:[&_[data-handle]]:underline sm:grid-cols-[9rem_1fr_auto]"
                  >
                    <span
                      aria-hidden
                      data-scan
                      className="pointer-events-none absolute inset-y-0 left-0 w-[12%] opacity-0"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, color-mix(in oklab, var(--bg-accent) 22%, transparent), transparent)",
                      }}
                    />
                    <span aria-hidden className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">
                      {social.plataforma}
                    </span>
                    <span aria-hidden data-handle className="text-base will-change-transform sm:text-lg">
                      {social.handle}
                      {/*
                        A telemetria vive na linha do GitHub e é lida no
                        build. Prova atividade em vez de a afirmar.
                      */}
                      {social.plataforma === "GitHub" && stats ? (
                        <span className="ml-3 font-mono text-[11px] tabular-nums opacity-85">
                          {stats.repos} {t("footer.repos")}
                        </span>
                      ) : null}
                    </span>
                    <span aria-hidden className="font-mono text-xs opacity-35 transition-opacity group-hover:opacity-70">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
              <li style={{ borderTop: `1px solid ${RULE}` }} />
            </ul>
          </div>

          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col gap-14">
            <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">
              {t("footer.email_label")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copiar}
                aria-label={t("footer.copy")}
                data-selectable
                className="cursor-pointer text-sm underline-offset-4 hover:underline sm:text-base"
              >
                {EMAIL}
              </button>
              <a
                href={`mailto:${EMAIL}`}
                aria-label={t("footer.mailto")}
                title={t("footer.mailto")}
                className="font-mono text-xs opacity-35 transition-opacity hover:opacity-70"
              >
                ↗
              </a>
            </div>
            {/* Anunciado, não só mostrado. */}
            <p aria-live="polite" className="mt-3 min-h-[1.25rem] font-mono text-[11px] tracking-[0.14em] uppercase opacity-70">
              {copiado === "sim" ? t("footer.copied") : copiado === "falhou" ? t("footer.copy_failed") : ""}
            </p>
            </div>

            <FooterControls />
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        <div
          /*
            0.85 e não 0.40. Medido sobre o creme: a 0.40 o rácio é 1.61:1 e
            a 0.45 é 1.74:1 — bem abaixo dos 4.5:1. E não é culpa do
            dissolve: dá o mesmo número com ele desligado.
          */
          className="mt-20 flex flex-wrap items-baseline justify-between gap-4 pt-6 font-mono text-[11px] tracking-[0.14em] uppercase opacity-85"
          style={{ borderTop: `1px solid ${RULE}` }}
        >
          {/* Sem "todos os direitos reservados": não pertence a esta linguagem. */}
          <p>
            <span className="tabular-nums">{new Date().getFullYear()}</span> · {t("footer.built")}
          </p>
          <a href="#intro" onClick={aoTopo} className="transition-opacity hover:opacity-90">
            {t("footer.top")} ↑
          </a>
        </div>
      </div>

      <ClosingDissolve alvo="#rodape" />
    </footer>
  )
}
