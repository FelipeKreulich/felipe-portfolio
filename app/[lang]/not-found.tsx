"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language/LanguageContext"

/**
 * A página de quem escreveu o URL ao lado.
 *
 * Era a única superfície que tinha sobrado do site anterior — gradientes,
 * azuis, roxos e manchas desfocadas, com classes `dark:` de um tema que já
 * não existe. Quem falhasse um endereço caía num sítio que já não era este.
 *
 * Papel, tinta e mono, como o resto. O 迷 é o kanji de "perder-se": segue o
 * mesmo vocabulário do 我, 創 e 縁 das secções, e é a única decoração aqui —
 * a página não precisa de mais nada para dizer o que tem a dizer.
 */
export default function NotFound() {
  const { t } = useLanguage()

  return (
    <main className="flex min-h-svh w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="font-jp text-6xl leading-none opacity-25" aria-hidden>
          迷
        </span>

        <p className="mt-8 font-mono text-xs tracking-[0.22em] uppercase opacity-45">
          {t("not_found.subtitle")}
        </p>

        <h1 className="mt-3 font-mono text-2xl tracking-tight sm:text-3xl">
          {t("not_found.title")}
        </h1>

        <p className="mt-5 text-sm leading-relaxed opacity-70">
          {t("not_found.description")}
        </p>

        {/* A régua repete a do preloader: 1px, a largura toda, discreta. É a
            assinatura da casa, e chega para separar o texto da saída. */}
        <span className="mt-10 h-px w-full bg-black/10" />

        <div className="mt-8 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 font-mono text-[10px] tracking-[0.22em] uppercase">
          <Link href="/" className="opacity-70 transition-opacity hover:opacity-100">
            {t("not_found.back_home")}
          </Link>
          <span className="opacity-35">{t("not_found.or")}</span>
          <a
            href={`mailto:${t("contact.email")}`}
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            {t("not_found.contact")}
          </a>
          <span className="opacity-35">{t("not_found.if_need_help")}</span>
        </div>
      </div>
    </main>
  )
}
