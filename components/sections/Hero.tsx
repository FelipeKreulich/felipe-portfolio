"use client"

import Image from "next/image"
import LetterGlitch from "@/components/visual/LetterGlitch"
import { useLanguage } from "@/contexts/language/LanguageContext"

/**
 * A hero tem uma figura e um nome. Mais nada — sem eyebrow, sem localização,
 * sem CTA, sem indicador de scroll. A decisão está registada na spec, §4.1,
 * com o risco assumido.
 *
 * `h-svh` e não `h-screen`: em telemóvel o `100vh` conta a barra do browser
 * que se recolhe, e o nome nascia por baixo do fundo do ecrã.
 */
export default function Hero() {
  const { t } = useLanguage()

  return (
    <section
      id="hero"
      className="relative flex h-svh w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <LetterGlitch />
      </div>

      <div className="relative flex flex-col items-center px-6">
        <Image
          src="/avatar.png"
          alt={t("hero.portrait_alt")}
          width={736}
          height={680}
          priority
          /* O preloader espera por esta imagem antes de sair — o
             hooks/useAppProgress.ts procura img[data-critical]. */
          data-critical
          className="w-[54vw] max-w-[20rem] sm:w-[26vw] sm:max-w-[24rem] [filter:grayscale(1)_contrast(1.35)_brightness(0.92)]"
        />

        {/* O intervalo é `clamp` e não percentagem: uma margem percentual
            resolve-se contra a *largura* do contentor e não contra a altura,
            portanto abria e fechava conforme o ecrã em vez de acompanhar a
            figura. Assim escala com o corpo do nome, que é o que se quer. */}
        {/* `tracking` positivo e não negativo: a Dystopian Canticle tem
            hastes que se cruzam e, apertada, os remates das letras tocam-se e
            o nome deixa de se ler. O aperto da mono não serve a uma fonte
            desenhada como logótipo. */}
        <h1 className="font-metal mt-[clamp(1rem,3vw,2.5rem)] text-center text-[clamp(1.75rem,6.5vw,5.5rem)] leading-[0.9] tracking-[0.02em]">
          FELIPE KREULICH
        </h1>
      </div>
    </section>
  )
}
