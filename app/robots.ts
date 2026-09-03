import type { MetadataRoute } from "next"
import { config } from "@/lib/config"

/**
 * Robots.
 *
 * Tudo indexável menos o que não é conteúdo. O `/api/` e os internos do
 * Next não têm nada para um motor de busca ler, e deixá-los abertos só
 * gasta orçamento de rastreio numa página que ainda está a ser descoberta.
 */
export default function robots(): MetadataRoute.Robots {
  const base = config.app.baseUrl

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
