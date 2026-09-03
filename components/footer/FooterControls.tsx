"use client"

import { useLanguage } from "@/contexts/language/LanguageContext"
import { useTheme } from "@/hooks/use-theme"
import { locales, localeNames, localeTags, type Locale } from "@/lib/i18n/config"

const COFFEE = "https://buymeacoffee.com/felipekreulich"
const RULE = "color-mix(in oklab, currentColor 22%, transparent)"

/**
 * Preferências e apoio, no rodapé.
 *
 * Aqui e não no topo: são coisas que se procuram quando se procura, não que
 * se impõem à entrada. O idioma tem uma rota real por trás — trocar navega
 * para `/pt` ou `/en`, não troca strings no cliente.
 */
export default function FooterControls() {
  const { t, language, setLanguage } = useLanguage()
  const { isDark, setTheme } = useTheme()

  const base =
    "cursor-pointer px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-opacity"

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">
        {t("footer.settings")}
      </p>

      <div className="mt-6 flex flex-col gap-5">
        {/* Idioma */}
        <div className="flex items-center gap-3">
          <span className="w-[4.5rem] shrink-0 font-mono text-[11px] tracking-[0.14em] uppercase opacity-85">
            {t("footer.lang_label")}
          </span>
          <div role="group" aria-label={t("footer.lang_label")} className="flex" style={{ border: `1px solid ${RULE}` }}>
            {locales.map((loc: Locale) => (
              <button
                key={loc}
                type="button"
                lang={localeTags[loc]}
                onClick={() => setLanguage(loc)}
                aria-current={language === loc ? "true" : undefined}
                /*
                  O inactivo estava a 0.60 e dava 2.31:1 — falhava, e é um
                  controlo. A distinção passa a vir do fundo e do
                  `aria-current`, não de tornar uma das opções ilegível.
                */
                className={`${base} ${language === loc ? "opacity-100" : "opacity-85 hover:opacity-100"}`}
                style={language === loc ? { backgroundColor: "color-mix(in oklab, currentColor 10%, transparent)" } : undefined}
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
        </div>

        {/* Tema */}
        <div className="flex items-center gap-3">
          <span className="w-[4.5rem] shrink-0 font-mono text-[11px] tracking-[0.14em] uppercase opacity-85">
            {t("footer.theme_label")}
          </span>
          <div role="group" aria-label={t("footer.theme_label")} className="flex" style={{ border: `1px solid ${RULE}` }}>
            {([["light", t("footer.theme_light")], ["dark", t("footer.theme_dark")]] as const).map(([modo, rotulo]) => {
              const activo = modo === "dark" ? isDark : !isDark
              return (
                <button
                  key={modo}
                  type="button"
                  onClick={() => setTheme(modo)}
                  aria-current={activo ? "true" : undefined}
                  className={`${base} ${activo ? "opacity-100" : "opacity-85 hover:opacity-100"}`}
                  style={activo ? { backgroundColor: "color-mix(in oklab, currentColor 10%, transparent)" } : undefined}
                >
                  {rotulo}
                </button>
              )
            })}
          </div>
        </div>

        {/*
          Sem o widget deles e sem cores de marca: uma ligação normal, na
          paleta do site, como as outras quatro linhas.
        */}
        <a
          href={COFFEE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex w-fit items-center gap-2 px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-opacity hover:opacity-70"
          style={{ border: `1px solid ${RULE}` }}
        >
          {t("footer.coffee")}
          <span aria-hidden className="opacity-50">↗</span>
        </a>
      </div>
    </div>
  )
}
