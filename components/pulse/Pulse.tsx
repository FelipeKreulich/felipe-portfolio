"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { useMotionPrefs } from "@/components/ReducedMotion"

/*
  O CRTWarp só entra no bundle quando é preciso. É three.js: mantê-lo fora do
  carregamento inicial é a diferença entre a página abrir e a página esperar.
*/
const CRTWarp = dynamic(() => import("./CRTWarp"), { ssr: false })

/**
 * Secção de pulso, abaixo dos projetos.
 *
 * O fundo é um terceiro shader WebGL — e o site tinha um tecto de dois
 * contextos. A saída não foi subir o tecto: é montar e desmontar por
 * `IntersectionObserver`, para o contexto só existir enquanto a secção está
 * à vista e ser largado quando sai. Em qualquer instante continuam a ser
 * dois.
 */
export default function Pulse({ ref }: { ref?: React.Ref<HTMLElement> }) {
  const { t } = useLanguage()
  const { reducedMotion, shaderCapable, resolved } = useMotionPrefs()
  const sentinelaRef = useRef<HTMLDivElement>(null)
  const [perto, setPerto] = useState(false)

  useEffect(() => {
    const alvo = sentinelaRef.current
    if (!alvo || !resolved || reducedMotion || !shaderCapable) return

    /*
      Margem generosa para o contexto nascer antes de a secção aparecer — a
      criação custa alguns frames e não se quer que se vejam.

      O desmonte espera 600ms. Sem isso, parar em cima do limite a subir e
      descer criava e destruía o contexto em cada oscilação, que é a forma
      mais rápida de fazer um browser desistir de dar contextos.
    */
    let adiar: ReturnType<typeof setTimeout> | undefined
    const observador = new IntersectionObserver(
      ([entrada]) => {
        clearTimeout(adiar)
        if (entrada.isIntersecting) setPerto(true)
        else adiar = setTimeout(() => setPerto(false), 600)
      },
      { rootMargin: "300px 0px" },
    )
    observador.observe(alvo)
    return () => {
      clearTimeout(adiar)
      observador.disconnect()
    }
  }, [resolved, reducedMotion, shaderCapable])

  const estatico = resolved && (reducedMotion || !shaderCapable)

  return (
    <section
      id="pulse"
      ref={ref}
      className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden lg:min-h-[80vh]"
      style={{ backgroundColor: "#01070a" }}
    >
      <div ref={sentinelaRef} aria-hidden className="absolute inset-0">
        {perto ? (
          <CRTWarp
            /*
              O ciano do site, não o roxo do exemplo.

              `#7fd8e8` é o `--bg-accent` do tema escuro, e não o `#157c96`
              do claro, porque esta secção é escura nos dois temas — o
              acento para fundo escuro é o que aqui se aplica. Vem em hex e
              não da variável CSS porque o `THREE.Color` não lê `oklch()`
              nem tokens.
            */
            color="#7fd8e8"
            /* Preto com desvio frio, a acompanhar. Era roxo-escuro. */
            backgroundColor="#01070a"
            speed={0.5}
            curvature={0.25}
            scanlineStrength={0.25}
            scanlineFrequency={200}
            waveAmplitude={0.3}
            waveFrequency={2.5}
            /*
              `bloom` e `brightness` descem: o ciano tem 0.594 de luminância
              contra 0.254 do magenta, 2.34x mais. Com os valores do exemplo
              a secção ficava a arder e o texto branco perdia-se por cima.
            */
            bloom={1.1}
            bloomRadius={1}
            noise={0.1}
            vignette={0}
            brightness={0.92}
            pixelation={1}
            rgbShift={0.015}
            mouseReact
            mouseStrength={0.5}
            dpr={1}
            fps={30}
          />
        ) : null}

        {/*
          Sem movimento ou sem WebGL: um fundo parado com a mesma paleta. Não
          finge ser o shader — só não deixa a secção como um rectângulo preto.
        */}
        {estatico ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 55%, #0d4a5a 0%, #05222b 45%, #01070a 100%)",
            }}
          />
        ) : null}
      </div>

      {/*
        Scrim por trás do texto: o plasma tem picos claros e o texto é branco.
        Local, para não chapar o shader todo.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 46% 30% at 50% 50%, rgba(1,7,10,0.86) 0%, rgba(1,7,10,0.6) 55%, transparent 82%)",
        }}
      />

      <h2 className="relative z-10 max-w-[16ch] px-8 text-center text-4xl leading-[1.05] font-medium tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-7xl">
        {t("pulse.phrase")}
      </h2>
    </section>
  )
}
