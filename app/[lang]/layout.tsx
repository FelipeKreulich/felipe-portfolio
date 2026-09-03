import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "../../contexts/language/LanguageContext";
import ClientLayout from "../../components/client/ClientLayout";
import ReducedMotion from "../../components/ReducedMotion";
import FooterServer from "@/components/footer/FooterServer";
import ScrollRhythm from "@/components/ScrollRhythm";
import SmoothScroll from "../../components/SmoothScroll";
import SceneCanvas from "../../components/canvas/SceneCanvas";
import Preloader from "../../components/preloader/Preloader";
import LanguageGate from "../../components/language/LanguageGate";
import GridBackground from "../../components/background/GridBackground";
import SectionGridColors from "../../components/background/SectionGridColors";
import { ThemeScript } from "../theme-script";
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
      className={`${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        {/* Decide uma vez se há movimento e se o Canvas monta; tudo o que anima
            lê essa decisão daqui. */}
        <ReducedMotion>
          {/* Grelha reativa, por trás de tudo. Um canvas 2D, sem contexto
              WebGL, a correr no mesmo ticker do GSAP que conduz o Lenis. */}
          <GridBackground />
          <SectionGridColors />
          <SceneCanvas />
          <Preloader />
          <LanguageGate current={locale} />
          <LanguageProvider locale={locale}>
            <ClientLayout>
              {children}
              {/*
                O rodapé vive no layout e não na página: é do site inteiro, e
                aqui é servidor — o que permite ler o GitHub no build sem
                mandar o visitante bater numa API de terceiros.
              */}
              <FooterServer />
              <ScrollRhythm />
              <SpeedInsights />
            </ClientLayout>
          </LanguageProvider>
        </ReducedMotion>
      </body>
    </html>
  );
}
