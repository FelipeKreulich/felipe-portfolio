"use client"

import { useState } from "react"
import { socials } from "@/lib/socials"
import { useLanguage } from "@/contexts/language/LanguageContext"

/**
 * A viragem do site: papel até aqui, tinta a partir daqui.
 *
 * Esteve aqui um campo de estrelas WebGL a marcar a mudança. Saiu: um
 * contexto WebGL de ecrã inteiro por trás de seis ligações custava caro para
 * o que entregava, e esta é a secção onde se quer que a pessoa clique, não
 * que fique a olhar. O preto liso faz o mesmo trabalho de rutura.
 */

type EstadoCopia = "nao" | "sim" | "falhou"

export default function Contact() {
  const { t } = useLanguage()
  const [copiado, setCopiado] = useState<EstadoCopia>("nao")
  const email = t("contact.email")

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiado("sim")
    } catch {
      // Sem permissão, ou fora de contexto seguro. Dizer que falhou é melhor
      // do que fingir que copiou — o endereço continua visível e selecionável.
      setCopiado("falhou")
    }
    setTimeout(() => setCopiado("nao"), 2400)
  }

  const legenda =
    copiado === "sim"
      ? t("contact.copied")
      : copiado === "falhou"
        ? t("contact.copy_failed")
        : t("contact.copy")

  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full items-center justify-center bg-ink py-32 text-white"
    >
      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="font-jp text-5xl leading-none" aria-hidden>
          縁
        </span>
        <h2 className="mt-4 font-mono text-xs tracking-[0.22em] uppercase opacity-55">
          {t("contact.title")}
        </h2>

        <p className="mt-8 max-w-xs text-lg leading-snug">{t("contact.intro")}</p>

        <ul className="mt-10 flex flex-col items-center gap-3">
          {socials.map((social) => (
            <li key={social.url}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.nome}, ${t("contact.external")}`}
                className="flex items-baseline gap-3 font-mono text-sm opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
              >
                <span className="tracking-[0.18em] uppercase">{social.plataforma}</span>
                <span className="opacity-60">{social.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-2">
          <a
            href={`mailto:${email}`}
            className="font-mono text-sm underline-offset-4 hover:underline"
          >
            {email}
          </a>

          <button
            type="button"
            onClick={copiar}
            className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45 transition-opacity hover:opacity-80"
          >
            {legenda}
          </button>

          {/* O resultado da cópia tem de chegar a quem não vê o botão mudar. */}
          <span aria-live="polite" className="sr-only">
            {copiado === "nao" ? "" : legenda}
          </span>
        </div>
      </div>
    </section>
  )
}
