import { NextResponse, type NextRequest } from "next/server"
import { LOCALE_COOKIE, isLocale, locales, negotiateLocale } from "@/lib/i18n/config"

/**
 * Encaminha `/` (e qualquer caminho sem prefixo de idioma) para uma rota real.
 *
 * Ficheiro `proxy.ts` e nao `middleware.ts`: o Next 16 depreciou a convencao
 * antiga e avisa no build.
 *
 * O idioma nunca é decidido no cliente: quando o browser chega, já está numa
 * rota com HTML completo. Quem já escolheu no seletor fica com essa escolha;
 * quem nunca escolheu recebe o que o browser pede.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return

  const remembered = request.cookies.get(LOCALE_COOKIE)?.value
  const locale =
    remembered && isLocale(remembered)
      ? remembered
      : negotiateLocale(request.headers.get("accept-language"))

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
