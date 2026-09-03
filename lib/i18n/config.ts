/** Idiomas suportados. A ordem define a ordem no ecrã de escolha. */
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

/**
 * Bandeira de fundo no hover, no ecrã de escolha.
 *
 * Nota: uma bandeira representa um país, não uma língua. A do Reino Unido, dos
 * EUA ou da Irlanda representam o inglês igualmente mal — e o navegador desta
 * máquina reporta `en-GB`. Ficam aqui isoladas para serem fáceis de trocar ou
 * remover.
 */
export const localeFlags: Record<Locale, string> = {
  pt: "/flag-pt.webp",
  en: "/flag-en.webp",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
