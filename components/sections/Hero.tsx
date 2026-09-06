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

        {/* Encostado à figura: o nome assina por baixo dela em vez de
            flutuar como um segundo bloco. */}
        <h1 className="mt-[-3%] text-center font-mono text-[clamp(1.5rem,5.5vw,4.5rem)] leading-[0.86] font-medium tracking-[-0.03em]">
          FELIPE KREULICH
        </h1>
      </div>
    </section>
  )
}
