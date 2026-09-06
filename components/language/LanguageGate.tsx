"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  locales,
  localeNames,
  localeTags,
  type Locale,
} from "@/lib/i18n/config"
import {
  readRememberedLocale,
  rememberLocale,
} from "@/contexts/language/LanguageContext"
import { usePreloaderStore } from "@/store/usePreloaderStore"
import { useMotionPrefs } from "@/components/ReducedMotion"

/**
 * Escolha de idioma.
 *
 * Não é um portão: a rota por baixo já foi servida com o conteúdo completo, e
 * este overlay é uma camada de cliente por cima. Sem JavaScript, a página
 * responde na mesma e isto simplesmente não aparece.
 *
 * Sem bandeiras — bandeiras representam países, não línguas. Cada opção está
 * escrita na sua própria língua, para ser reconhecível por quem não percebe a
 * outra, e cada bloco leva o seu `lang` para o leitor de ecrã pronunciar
 * "Português" e "English" cada um na sua fonética.
 */
export default function LanguageGate({ current }: { current: Locale }) {
  const router = useRouter()
  const phase = usePreloaderStore((state) => state.phase)
  const { reducedMotion } = useMotionPrefs()

  // `null` enquanto não se sabe: o servidor não tem `navigator` nem
  // localStorage, e renderizar às cegas daria divergência de hidratação.
  const [visible, setVisible] = useState(false)
  const [detected, setDetected] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    // Quem já escolheu nunca mais vê isto.
    if (readRememberedLocale()) return

    const language = typeof navigator !== "undefined" ? navigator.language : ""
    setDetected(language || null)
    setVisible(true)
  }, [])

  /** O idioma detetado, se for um dos suportados. Entra pré-destacado. */
  const preferred: Locale =
    (detected && locales.find((locale) => detected.toLowerCase().startsWith(locale))) || current

  /*
    Foco inicial na opção pré-destacada: assim o Enter confirma-a sem obrigar
    ninguém a navegar primeiro.

    Depende de `phase` e não só de `visible`: enquanto a cortina do preloader
    não sai, este componente devolve null e não há botão nenhum para focar —
    o efeito corria cedo demais e o foco perdia-se.
  */
  useEffect(() => {
    if (!visible || phase === "loading") return
    const index = locales.indexOf(preferred)
    buttonRefs.current[index]?.focus()
  }, [visible, phase, preferred])

  const choose = useCallback(
    (locale: Locale) => {
      rememberLocale(locale)
      setLeaving(true)
      const done = () => {
        setVisible(false)
        if (locale !== current) router.push(`/${locale}`)
      }
      // Fade curto; o encadeamento com o dissolve do preloader é o passo 5.
      window.setTimeout(done, reducedMotion ? 150 : 260)
    },
    [current, reducedMotion, router],
  )

  const move = (delta: number) => {
    const index = buttonRefs.current.findIndex((button) => button === document.activeElement)
    const next = (index + delta + locales.length) % locales.length
    buttonRefs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      move(event.key === "ArrowRight" ? 1 : -1)
      return
    }

    /*
      Aprisionamento de foco.

      `aria-modal="true"` diz que o resto da página está inerte, mas isso é só
      uma promessa à árvore de acessibilidade — o Tab continuava a sair do
      overlay e a percorrer o conteúdo por baixo. Aqui o ciclo fecha-se nas
      duas opções, que é o que a promessa implica.
    */
    if (event.key === "Tab") {
      event.preventDefault()
      move(event.shiftKey ? -1 : 1)
    }
  }

  /*
    Existe a partir do momento em que a cortina começa a sair, não depois.

    Em `done` havia uma janela entre o fade da cortina e a montagem disto em
    que o site aparecia por baixo — um pisca-pisca de meio segundo. Agora o
    overlay já está pintado quando a cortina desvanece, e ela desvanece para
    dentro dele: em vez de revelar a hero, revela as duas opções.
  */
  if (!visible || phase === "loading") return null

  return (
    <div
      ref={containerRef}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Language / Idioma"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-16 transition-opacity"
      style={{
        backgroundColor: "var(--preloader-bg)",
        color: "var(--preloader-fg)",
        opacity: leaving ? 0 : 1,
        transitionDuration: reducedMotion ? "150ms" : "260ms",
      }}
    >
      {/*
        `:has()` para escurecer a opção que não está sob o cursor — o ecrã
        mostra que já sabe o que vais escolher. Puro CSS, sem estado.
      */}
      <div className="flex items-stretch gap-12 [&:has(button:hover)_button:not(:hover)]:opacity-40 [&:has(button:hover)_button:not(:hover)]:saturate-50 sm:gap-28">
        {locales.map((locale, index) => {
          const isPreferred = locale === preferred
          return (
            <button
              key={locale}
              ref={(node) => {
                buttonRefs.current[index] = node
              }}
              type="button"
              lang={localeTags[locale]}
              onClick={() => choose(locale)}
              data-preferred={isPreferred || undefined}
              className="group relative overflow-hidden px-10 py-8 outline-none transition-[opacity,filter] duration-500 sm:px-16 sm:py-10"
            >
              {/* Esquadrias. Acesas na opção detetada, com um pulso lento. */}
              {CORNERS.map((corner) => (
                <span
                  key={corner.key}
                  aria-hidden
                  className={`pointer-events-none absolute h-4 w-4 transition-opacity duration-500 ${corner.position} ${
                    isPreferred ? "opacity-90" : "opacity-15"
                  } group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    isPreferred && !reducedMotion ? "motion-safe:animate-pulse" : ""
                  }`}
                  style={{ borderColor: "currentColor", ...corner.borders }}
                />
              ))}

              <span className="relative block font-mono text-4xl font-medium tracking-[0.1em] sm:text-5xl">
                {locale.toUpperCase()}
              </span>
              <span className="relative mt-3 block text-sm opacity-50">{localeNames[locale]}</span>
            </button>
          )
        })}
      </div>

      {/*
        Linha de diagnóstico, não instrução: não exige compreensão e reforça a
        linguagem de dossier do resto do site.
      */}
      <div className="flex flex-col items-center gap-5">
        {/*
          Dicas de teclado. Em maiúsculas neutras, como o `DETECTED`: este
          ecrã aparece antes de haver idioma escolhido, e escrevê-las em PT ou
          EN presumia a escolha.
        */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.16em] opacity-45">
          <span className="inline-flex items-center gap-2">
            <kbd>&larr;</kbd>
            <kbd>&rarr;</kbd>
            <span>Select</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <kbd>Tab</kbd>
            <span>Move</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <kbd>&crarr;</kbd>
            <span>Confirm</span>
          </span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-35">
          Detected · {detected ?? "—"}
        </p>

        {/* Quase invisível de propósito: descobre-se, não se lê. */}
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-[0.12]">
          Click anywhere
        </p>
      </div>
    </div>
  )
}

const CORNERS = [
  { key: "tl", position: "left-0 top-0", borders: { borderTopWidth: 1, borderLeftWidth: 1 } },
  { key: "tr", position: "right-0 top-0", borders: { borderTopWidth: 1, borderRightWidth: 1 } },
  { key: "bl", position: "bottom-0 left-0", borders: { borderBottomWidth: 1, borderLeftWidth: 1 } },
  { key: "br", position: "bottom-0 right-0", borders: { borderBottomWidth: 1, borderRightWidth: 1 } },
] as const
