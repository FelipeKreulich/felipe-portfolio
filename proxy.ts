import { NextResponse, type NextRequest } from "next/server"
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config"

/**
 * Encaminha `/` (e qualquer caminho sem prefixo de idioma) para uma rota real.
 *
 * Ficheiro `proxy.ts` e nao `middleware.ts`: o Next 16 depreciou a convencao
 * antiga e avisa no build.
 *
 * O idioma nunca é decidido no cliente: quando o browser chega, já está numa
 * rota com HTML completo. É isso que separa este desenho de um portão que
 * esconde o conteúdo até haver escolha — e que faria o site desaparecer do
 * Google.
 */
function negotiate(request: NextRequest): Locale {
  const header = request.headers.get("accept-language")
  if (!header) return defaultLocale

  // "pt-PT,pt;q=0.9,en;q=0.8" -> [["pt-pt", 1], ["pt", 0.9], ["en", 0.8]]
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const q = params.find((p) => p.trim().startsWith("q="))
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q.split("=")[1]) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    // `pt-PT` tem de bater com `pt`, por isso compara-se pela subtag primária.
    const primary = tag.split("-")[0]
    const match = locales.find((locale) => locale === primary)
    if (match) return match
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return

  const locale = negotiate(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  /**
   * Fora: `_next`, a API, e tudo o que tenha extensão (imagens, PDFs, vídeo).
   * Sem esta exclusão o middleware redirecionava os próprios assets.
   */
  matcher: ["/((?!_next|api|.*\\.).*)"],
}
