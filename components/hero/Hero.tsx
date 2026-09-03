"use client"

import { useCallback, useRef } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { useHeroReveal } from "@/hooks/useHeroReveal"
import MaskedHeading from "@/components/ui/MaskedHeading"
import HeroBackground from "./HeroBackground"

/**
 * A hero.
 *
 * O texto não está atrás de nenhum gate de montagem nem de `ssr: false`, por
 * isso vai no HTML prerenderizado — é ele o candidato a LCP, não o canvas.
 *
 * A secção é também a superfície de interação: os listeners vivem aqui, no
 * elemento que apanha todo o hit-test, e as custom properties que escrevem
 * descem por cascata até às camadas do fundo.
 */

interface HeroProps {
  ref?: React.Ref<HTMLElement>
}

export default function Hero({ ref }: HeroProps) {
  // O copy vive no LanguageContext (chaves `hero.*`), em PT-PT e EN.
  // Continua marcado como TODO: copy até o texto final chegar.
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  // Máscara de revelação. Escreve custom properties na secção; não devolve
  // nada, porque nenhum valor desta interação passa pelo React.
  useHeroReveal(sectionRef)

  // A secção tem dois donos: o hook, que lhe escreve as variáveis, e o
  // observador de secções da página.
  const attachRefs = useCallback(
    (el: HTMLElement | null) => {
      sectionRef.current = el
      if (typeof ref === "function") ref(el)
      else if (ref) ref.current = el
    },
    [ref],
  )

  return (
    <section
      id="intro"
      ref={attachRefs}
      className="relative min-h-screen w-full overflow-hidden"
    >
      <HeroBackground />

      {/* Texto ancorado em baixo à esquerda. Nada centrado. */}
      <div className="relative z-10 flex min-h-screen flex-col justify-end px-8 pb-20 lg:px-16 lg:pb-28">
        <div className="max-w-4xl">
          {/* O brief pedia opacidade 0.5, mas a 0.5 este texto media 2.77:1 contra
              as zonas mais claras do dithering — abaixo do 4.5:1 que o proprio
              brief exige. O criterio de contraste ganha. */}
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-80">
            {t('hero.eyebrow')}
          </p>

          {/*
            O título é preenchido por vídeo, recortado pelas próprias letras.
            `textScale` 0.1 reproduz o clamp(2.5rem, 7vw, 5.5rem) que estava
            aqui: 0.1 x 896px do contentor da o mesmo corpo no topo da escala.
          */}
          <MaskedHeading
            tag="h1"
            text={t('hero.headline')}
            mediaType="video"
            src="/word-video.mp4"
            className="mt-6"
            align="left"
            weight={600}
            tracking={-0.03}
            lineHeight={0.95}
            /*
              0.125 e nao 0.1: letras maiores dao mais area de video por
              glifo, e a forma le-se mesmo quando o frame esta escuro.
            */
            textScale={0.125}
            /*
              O video tem media de luminancia 66/255 e mediana 40 — escuro
              demais para preencher letras sobre um fundo tambem escuro. O
              filtro e composto pela GPU, portanto nao custa por frame.
            */
            brightness={1.9}
            saturation={1.15}
            reveal="rise"
            trigger="view"
            duration={1.1}
            stagger={0.09}
            fillScale={1.25}
            parallax={26}
            drift={18}
          />

          <p className="mt-7 max-w-xl text-base leading-relaxed opacity-70 sm:text-lg">
            {t('hero.sub')}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <HeroLink href="#work">{t('hero.cta_work')}</HeroLink>
            <HeroLink href="#connect">{t('hero.cta_contact')}</HeroLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Link de texto com underline que entra pela esquerda e sai pela direita. */
function HeroLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative font-mono text-sm tracking-wide">
      {children}
      <span
        aria-hidden
        className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100"
      />
    </Link>
  )
}
