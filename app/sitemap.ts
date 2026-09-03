import type { MetadataRoute } from "next"
import { config } from "@/lib/config"
import { locales, defaultLocale, localeTags } from "@/lib/i18n/config"

/**
 * Sitemap.
 *
 * O site tem uma página por idioma e mais nada indexável — o resto são
 * secções da mesma página, e listar âncoras num sitemap não ajuda ninguém.
 *
 * Cada entrada declara as suas alternativas em `languages`. Sem isso o
 * Google trata `/pt` e `/en` como páginas concorrentes em vez de duas
 * versões da mesma, e escolhe uma para mostrar a toda a gente.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.app.baseUrl
  const agora = new Date()

  const languages = Object.fromEntries(
    locales.map((locale) => [localeTags[locale], `${base}/${locale}`]),
  )

  return locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: agora,
    changeFrequency: "monthly",
    // O idioma por omissão é o que se quer ver primeiro nos resultados.
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: { languages: { ...languages, "x-default": `${base}/${defaultLocale}` } },
  }))
}
