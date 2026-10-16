"use client"

import { useState } from "react"
import { socials } from "@/lib/socials"
import { useLanguage } from "@/contexts/language/LanguageContext"

type CopyState = "idle" | "copied" | "failed"

export default function Footer() {
  const { t } = useLanguage()
  const [copy, setCopy] = useState<CopyState>("idle")
  const email = t("contact.email")

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopy("copied")
    } catch {
      // Sem permissão, ou fora de contexto seguro. Dizer que falhou é melhor
      // do que fingir que copiou — o endereço continua visível e selecionável.
      setCopy("failed")
    }
    setTimeout(() => setCopy("idle"), 2400)
  }

  const copyLabel =
    copy === "copied" ? t("footer.copied") : copy === "failed" ? t("footer.copy_failed") : t("footer.copy")

  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
        <p className="text-lg text-muted">{t("footer.invite")}</p>
        <a
          href={`mailto:${email}`}
          className="mt-2 inline-block text-[clamp(1.6rem,5vw,3.5rem)] leading-tight font-semibold tracking-[-0.02em] [overflow-wrap:anywhere] [font-stretch:75%] underline decoration-transparent decoration-2 underline-offset-8 transition-colors hover:decoration-current"
        >
          {email}
        </a>
        <div>
          <button
            type="button"
            onClick={copyEmail}
            className="mt-3 text-sm text-muted transition-colors hover:text-foreground"
          >
            {copyLabel}
          </button>
          {/* O resultado da cópia tem de chegar a quem não vê o botão mudar. */}
          <span aria-live="polite" className="sr-only">
            {copy === "idle" ? "" : copyLabel}
          </span>
        </div>

        <div className="mt-20 flex flex-col gap-6 text-sm sm:flex-row sm:items-end sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${social.nome}, ${t("footer.external")}`}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {social.plataforma}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-muted">© {new Date().getFullYear()} Felipe Kreulich</p>
        </div>
      </div>
    </footer>
  )
}
