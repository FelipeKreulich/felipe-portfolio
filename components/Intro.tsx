"use client"

import Image from "next/image"
import Link from "next/link"
import { useSyncExternalStore, type CSSProperties } from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { LOCALE_COOKIE, localeNames, locales, localeTags, type Locale } from "@/lib/i18n/config"

/*
  Um PDF por idioma. Fica aqui e não no dicionário: é um caminho de ficheiro,
  não texto traduzível.
*/
const CV: Record<Locale, string> = {
  pt: "/curriculo.pdf",
  en: "/curriculoenglish.pdf",
}

/**
 * Secção 1: quem é, o que faz, e as duas coisas que quem chega aqui costuma
 * querer — o currículo e o email.
 */
export default function Intro() {
  const { t, language } = useLanguage()
  const email = t("contact.email")

  return (
    <section id="intro" className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 sm:px-8">
      <header className="flex items-center justify-between py-6 text-sm">
        <p className="text-muted">
          {t("nav.city")} <LisbonTime />
        </p>
        <div className="flex items-center gap-5">
          <nav aria-label={t("nav.language")} className="flex gap-3">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                hrefLang={localeTags[locale]}
                aria-label={localeNames[locale]}
                aria-current={locale === language ? "page" : undefined}
                // O proxy lê isto da próxima vez que alguém abrir `/`.
                onClick={() => {
                  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
                }}
                className={
                  locale === language
                    ? "underline decoration-1 underline-offset-4"
                    : "text-muted transition-colors hover:text-foreground"
                }
              >
                {locale.toUpperCase()}
              </Link>
            ))}
          </nav>
          <ThemeToggle label={t("nav.theme")} />
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-center pt-6 pb-16">
        {/* O nome é a única coisa grande da página: estreito, pesado e
            apertado, no eixo de largura da própria fonte. Medido, ocupa 3,79
            vezes o corpo em largura — dividir a largura útil por 4 deixa-o de
            margem a margem numa linha só, até ao limite do contentor. */}
        <h1 className="rise text-[min(17.75rem,calc((100vw-2.5rem)/4))] leading-[0.85] font-semibold tracking-[-0.04em] [font-stretch:75%] sm:text-[min(17.75rem,calc((100vw-4rem)/4))]">
          Felipe Kreulich
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <Image
            src="/felipe.jpg"
            alt={t("intro.portrait_alt")}
            width={1122}
            height={1402}
            priority
            sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 100vw"
            className="rise w-full rounded-sm md:col-span-4"
            style={{ "--delay": "0.12s" } as CSSProperties}
          />

          <div className="rise md:col-span-7 md:col-start-6" style={{ "--delay": "0.24s" } as CSSProperties}>
            <p className="text-muted">{t("intro.role")}</p>
            <p className="mt-3 max-w-[38rem] text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-snug">
              {t("intro.bio")}
            </p>

            <p className="mt-8 flex items-center gap-2.5 text-sm">
              <span className="size-2 rounded-full bg-available" aria-hidden />
              {t("intro.available")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href={CV[language]}
                download="Felipe-Kreulich-CV.pdf"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 font-medium text-background transition-opacity hover:opacity-85"
              >
                {t("intro.cv")}
                <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 2.5v8m0 0L4.5 7M8 10.5 11.5 7M3 13.5h10" />
                </svg>
              </a>
              <a
                href={`mailto:${email}`}
                className="font-medium underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-foreground"
              >
                {t("intro.email")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const lisbonFormat = new Intl.DateTimeFormat("pt-PT", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Lisbon",
})

const subscribeToClock = (onChange: () => void) => {
  const id = setInterval(onChange, 10_000)
  return () => clearInterval(id)
}

/**
 * A hora em Lisboa, para quem está noutro fuso saber se é hora de esperar
 * resposta. No servidor não há hora certa para dar, e fica `--:--`.
 */
function LisbonTime() {
  const time = useSyncExternalStore(
    subscribeToClock,
    () => lisbonFormat.format(Date.now()),
    () => "--:--",
  )
  return <time className="tabular-nums">{time}</time>
}

/**
 * Claro ou escuro. O estado vive na classe do <html> (posta pelo script do
 * layout antes da primeira pintura), não no React — assim o servidor e o
 * cliente renderizam o mesmo botão, e é o CSS que o vira.
 */
function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark")
    try {
      localStorage.setItem("theme", dark ? "dark" : "light")
    } catch {
      // Modo privado: o tema muda na mesma, só não fica lembrado.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="-m-2 p-2 text-muted transition-colors hover:text-foreground"
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="size-5 transition-transform duration-500 motion-reduce:transition-none dark:rotate-180"
      >
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  )
}
