"use client"

import { localeNames, locales } from "@/lib/i18n/config"
import { useLanguage } from "@/contexts/language/LanguageContext"

/**
 * Fecha a página, ainda em tinta. Sem redes sociais — já vivem no contacto,
 * e repeti-las aqui era ruído.
 */
export default function Footer() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <footer className="flex flex-col items-center gap-6 bg-ink py-16 text-white">
      <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-55">
        {t("footer.made_by")}
      </p>

      <div
        role="group"
        aria-label={t("footer.language")}
        className="flex items-center gap-4 font-mono text-xs tracking-[0.18em] uppercase"
      >
        {locales.map((locale) => {
          const ativo = locale === language
          return (
            <button
              key={locale}
              type="button"
              onClick={() => setLanguage(locale)}
              aria-current={ativo ? "true" : undefined}
              aria-label={localeNames[locale]}
              /* O sublinhado é a diferença visual do idioma ativo: a
                 opacidade sozinha (a única diferença nas outras ligações do
                 site) não chega para quem não distingue cor nem contraste
                 fino. */
              className={
                ativo
                  ? "underline decoration-1 underline-offset-4 opacity-100"
                  : "opacity-45 transition-opacity hover:opacity-80"
              }
            >
              {locale.toUpperCase()}
            </button>
          )
        })}
      </div>
    </footer>
  )
}
