import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { LanguageProvider } from "../../contexts/language/LanguageContext";
import ReducedMotion from "../../components/ReducedMotion";
import SmoothScroll from "../../components/SmoothScroll";
import SceneCanvas from "../../components/canvas/SceneCanvas";
import Preloader from "../../components/preloader/Preloader";
import LanguageGate from "../../components/language/LanguageGate";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { config } from "@/lib/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, locales, localeTags, type Locale } from "@/lib/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// O IBM Plex Mono não tem versão variável, por isso os pesos são explícitos.
// Dois chegam: 400 para o contador e a régua, 500 para o nome.
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
})

/*
  O japonês é a identidade do site, não um detalhe. Sem esta fonte o browser
  cai para a CJK do sistema — Hiragino no Mac, Yu Gothic no Windows — e o
  site muda de cara conforme o sistema operativo.

  `preload: false` porque a Noto Sans JP chega particionada em dezenas de
  ficheiros por unicode-range: pré-carregá-los todos seria pior do que não
  pré-carregar nenhum.
*/
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-jp",
})

/*
  A fonte do nome. Servida do próprio domínio e não do Google — não existe lá,
  e é este o único sítio onde o site usa uma fonte que não é de sistema nem do
  Google.

  Dystopian Canticle, de Scapholène, sob SIL Open Font License 1.1. A licença
  permite uso comercial, incorporação e serviço a partir do site; exige que o
  aviso de direitos viaje com o ficheiro, e é por isso que o
  `license_Dystopian-Canticle.txt` está ao lado dela em `app/fonts/` em vez de
  ser apagado como lixo do download.

  `display: "block"` e não "swap": o nome é uma palavra só, no centro do ecrã.
  Trocá-la à vista dava um salto tipográfico enorme no elemento mais visível
  da página. Bloquear uns milissegundos é o mal menor — e o preloader ainda
  está por cima quando isto resolve.
*/
const dystopianCanticle = localFont({
  src: "../fonts/Dystopian-Canticle-Regular.otf",
  display: "block",
  variable: "--font-dystopian",
})

/**
 * Este é o layout raiz. Vive dentro do segmento `[lang]` de propósito: é o que
 * permite servir `<html lang>` correcto por rota, sem depender de JavaScript.
 *
 * As duas rotas são geradas estaticamente, portanto o HTML de cada idioma
 * existe em disco e um crawler indexa-o sem executar nada.
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}

  const dictionary = dictionaries[lang]
  const base = config.app.baseUrl

  return {
    metadataBase: new URL(base),
    title: dictionary["meta.title"],
    description: dictionary["meta.description"],
    /**
     * hreflang recíproco. Cada versão aponta para todas, incluindo para si
     * própria — é isso que faz o Google tratá-las como alternativas em vez de
     * conteúdo duplicado. O `x-default` responde a quem não bate com nenhuma.
     */
    alternates: {
      canonical: `${base}/${lang}`,
      languages: {
        "pt-PT": `${base}/pt`,
        en: `${base}/en`,
        "x-default": `${base}/pt`,
      },
    },
    openGraph: {
      title: dictionary["meta.title"],
      description: dictionary["meta.description"],
      url: `${base}/${lang}`,
      locale: localeTags[lang].replace("-", "_"),
      type: "website",
    },
    icons: {
      icon: [
        { url: '/icon16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon96.png', sizes: '96x96', type: 'image/png' },
      ],
      shortcut: '/icon32.png',
      apple: '/icon32.png',
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const locale = lang as Locale

  return (
    <html
      // Servido, não escrito por JavaScript. É esta a diferença entre um
      // crawler saber o idioma da página e não saber.
      lang={localeTags[locale]}
      className={`${inter.variable} ${ibmPlexMono.variable} ${notoSansJP.variable} ${dystopianCanticle.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/* Decide uma vez se há movimento e se o Canvas monta; tudo o que
            anima lê essa decisão daqui. */}
        <ReducedMotion>
          <SceneCanvas />
          <Preloader />
          <LanguageGate current={locale} />
          <LanguageProvider locale={locale}>
            <SmoothScroll />
            {children}
            <SpeedInsights />
          </LanguageProvider>
        </ReducedMotion>
      </body>
    </html>
  );
}
