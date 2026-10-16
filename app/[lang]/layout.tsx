import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "../../contexts/language/LanguageContext";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { config } from "@/lib/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, locales, localeTags, type Locale } from "@/lib/i18n/config";

/*
  Uma família só. A Bricolage Grotesque tem eixo de largura e de tamanho
  óptico: o nome usa-a estreita e grande, o texto corrido larga e pequena,
  e as duas leem-se como vozes diferentes da mesma pessoa.
*/
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
})

/*
  Corre antes da primeira pintura, para quem escolheu escuro nunca ver um
  flash de claro. Sem escolha guardada, segue o sistema.
*/
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`

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
      images: ["/felipe.jpg"],
    },
    /*
      Sem bloco `icons` aqui de propósito. O `app/icon.ico` e o
      `app/apple-icon.png` são convenções de ficheiro do Next e já geram as
      tags sozinhos, com hash de conteúdo no URL.
    */
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
      className={bricolage.variable}
      // O script do tema mexe na classe antes de o React hidratar.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider locale={locale}>
          {children}
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
