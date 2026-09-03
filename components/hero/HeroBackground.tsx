"use client"

import { useMotionPrefs } from "@/components/ReducedMotion"
import { useResponsiveDither } from "@/hooks/useResponsiveDither"
import DitherLayer from "./DitherLayer"

/**
 * O fundo da hero, em quatro camadas.
 *
 * A imagem chega pré-tratada pelo `scripts/prepare-hero.mjs` — contraste
 * aberto a 1.7 e espelhada, para o pagode cair no terço direito em vez de
 * colidir com o título.
 *
 * As custom properties da máscara (--mx, --my, --mr, --mo) são escritas na
 * <section> pelo `useHeroReveal` e chegam aqui pela cascata.
 */

/** Máscara e anel leem as mesmas variáveis, escritas uma vez por frame. */
const MASK =
  "radial-gradient(circle var(--mr, 0px) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 55%, transparent 100%)"

export default function HeroBackground() {
  const { shaderCapable } = useMotionPrefs()
  const { size, image } = useResponsiveDither()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1. Base: a imagem reduzida a dados. */}
      {shaderCapable ? (
        <DitherLayer image={image} size={size} />
      ) : (
        /*
          Sem WebGL, ou em hardware fraco. Filtros CSS a aproximar o duotone,
          a seguir o tema por CSS — a classe `.dark` já está no <html> antes do
          primeiro paint, portanto não há risco de divergência de hidratação.
        */
        <img
          src={image}
          alt=""
          aria-hidden
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_contrast(2.2)_brightness(1.05)] dark:[filter:grayscale(1)_contrast(2.2)_brightness(0.85)]"
        />
      )}

      {/*
        2. A imagem por baixo do ruído, revelada pela máscara que segue o
        cursor. Mesmo ficheiro e mesmo enquadramento (`object-cover` espelha o
        `fit="cover"` do shader), por isso as duas camadas alinham ao pixel —
        e o browser serve-a da cache, já que o dithering usa o mesmo URL.
      */}
      <img
        src={image}
        alt=""
        aria-hidden
        decoding="async"
        // A imagem ja vem com o contraste aberto pelo script; empilhar mais
        // aqui so a endurecia. O ponto desta camada e mostrar a foto como ela e.
        className="absolute inset-0 h-full w-full object-cover [filter:grayscale(0.2)]"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      />

      {/* 3. Anel de scan, ligeiramente maior que a máscara. */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-screen"
        style={{
          willChange: "transform",
          opacity: "var(--mo, 0)",
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), transparent calc(var(--mr, 0px) + 1px), var(--hero-scan) calc(var(--mr, 0px) + 2px), transparent calc(var(--mr, 0px) + 5px))",
        }}
      />

      {/*
        4. Scrim. Sobe do fundo para dar contraste ao texto. Os stops foram
        medidos, não afinados a olho.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--background) 0%, color-mix(in oklab, var(--background) 88%, transparent) 30%, color-mix(in oklab, var(--background) 55%, transparent) 58%, transparent 88%)",
        }}
      />
    </div>
  )
}
