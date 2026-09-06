"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { useNearViewport } from "@/hooks/useNearViewport"
import { socials } from "@/lib/socials"
import { useLanguage } from "@/contexts/language/LanguageContext"

/**
 * A viragem do site: papel até aqui, tinta a partir daqui. O `KanjiRing` que
 * fechava esta secção saiu — substituído pelo campo de estrelas do Galaxy,
 * que também marca a mudança para escuro.
 *
 * `next/dynamic` com `ssr: false`: o Galaxy é WebGL puro, não há nada para
 * renderizar no servidor, e não faz sentido pesar no bundle inicial de uma
 * página cuja primeira secção nem o usa. Ver components/canvas/SceneCanvas.tsx
 * para o mesmo padrão.
 */
const Galaxy = dynamic(() => import("@/components/visual/Galaxy"), {
  ssr: false,
  loading: () => null,
})

type EstadoCopia = "nao" | "sim" | "falhou"

export default function Contact() {
  const { t } = useLanguage()
  const seccaoRef = useRef<HTMLElement>(null)
  const perto = useNearViewport(seccaoRef)
  const [copiado, setCopiado] = useState<EstadoCopia>("nao")
  const email = t("contact.email")

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiado("sim")
    } catch {
      // Sem permissão, ou fora de contexto seguro. Dizer que falhou é melhor
      // do que fingir que copiou — o endereço continua visível e selecionável.
      setCopiado("falhou")
    }
    setTimeout(() => setCopiado("nao"), 2400)
  }

  const legenda =
    copiado === "sim"
      ? t("contact.copied")
      : copiado === "falhou"
        ? t("contact.copy_failed")
        : t("contact.copy")

  return (
    <section
      ref={seccaoRef}
      id="contact"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-ink py-32 text-white"
    >
      {/* `pointer-events-none` para as ligações por cima continuarem
          clicáveis — isto é fundo, não interface. `saturation={0}` porque o
          site inteiro é preto, branco e cinzentos: as estrelas por omissão
          do Galaxy são verdes, e aqui ficam brancas. */}
      {/* Só monta quando a secção se aproxima. O `next/dynamic` adia o
          código, não a montagem: sem este guard, o contexto WebGL arrancava
          com o preloader ainda no ecrã, três ecrãs acima. */}
      <div className="pointer-events-none absolute inset-0">
        {perto && <Galaxy
          saturation={0}
          density={1}
          glowIntensity={0.35}
          twinkleIntensity={0.4}
          mouseRepulsion
          transparent
        />}
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="font-jp text-5xl leading-none" aria-hidden>
          縁
        </span>
        <h2 className="mt-4 font-mono text-xs tracking-[0.22em] uppercase opacity-55">
          {t("contact.title")}
        </h2>

        <p className="mt-8 max-w-xs text-lg leading-snug">{t("contact.intro")}</p>

        <ul className="mt-10 flex flex-col items-center gap-3">
          {socials.map((social) => (
            <li key={social.url}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.nome}, ${t("contact.external")}`}
                className="flex items-baseline gap-3 font-mono text-sm opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
              >
                <span className="tracking-[0.18em] uppercase">{social.plataforma}</span>
                <span className="opacity-60">{social.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-2">
          <a
            href={`mailto:${email}`}
            className="font-mono text-sm underline-offset-4 hover:underline"
          >
            {email}
          </a>

          <button
            type="button"
            onClick={copiar}
            className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45 transition-opacity hover:opacity-80"
          >
            {legenda}
          </button>

          {/* O resultado da cópia tem de chegar a quem não vê o botão mudar. */}
          <span aria-live="polite" className="sr-only">
            {copiado === "nao" ? "" : legenda}
          </span>
        </div>
      </div>
    </section>
  )
}
