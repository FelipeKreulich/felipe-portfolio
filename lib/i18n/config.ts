/** Idiomas suportados. A ordem define a ordem no seletor do topo. */
export const locales = ["pt", "en"] as const

export type Locale = (typeof locales)[number]

/** Usado quando o `Accept-Language` não bate com nenhum dos suportados. */
export const defaultLocale: Locale = "pt"

/**
 * Etiquetas BCP 47 completas, para o atributo `lang` e para o `hreflang`.
 * PT é `pt-PT` e não `pt`: o conteúdo é português europeu.
 */
export const localeTags: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en",
}

/** Endónimos — cada idioma escrito na sua própria língua. */
export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * Escolhe o idioma a partir do `Accept-Language`.
 *
 * "pt-PT,pt;q=0.9,en;q=0.8" -> pt. Compara-se pela subtag primária, para
 * `pt-PT` e `pt-BR` baterem com `pt`.
 */
export function negotiateLocale(header: string | null): Locale {
  if (!header) return defaultLocale

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const q = params.find((p) => p.trim().startsWith("q="))
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q.split("=")[1]) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const match = locales.find((locale) => locale === tag.split("-")[0])
    if (match) return match
  }

  return defaultLocale
}

/** Cookie escrito pelo seletor de idioma e lido pelo `proxy.ts`. */
export const LOCALE_COOKIE = "locale"
