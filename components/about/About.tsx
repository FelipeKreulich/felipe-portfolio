"use client"

import { useLanguage } from "@/contexts/language/LanguageContext"
import { SECTION_CONTAINER } from "@/lib/layout"
import PortraitFrame from "./PortraitFrame"

/**
 * A About.
 *
 * Nada centrado: eyebrow em mono alinhado à esquerda, na mesma linguagem do
 * `DISPONÍVEL PARA TRABALHO` da hero, e uma grelha assimétrica com o retrato
 * numa coluna alta à esquerda.
 *
 * Vive fora do <main> para não ficar presa ao `max-w-4xl` das secções antigas
 * — ao lado de uma hero full-bleed aquela caixa fazia a secção parecer
 * encolhida.
 *
 * Passo 4 é o redesenho estático. As interações (scanline no retrato,
 * scramble nos metadados, SplitText na bio) entram no passo 6.
 */

/** Régua hairline entre linhas do dossier. */
const RULE = "color-mix(in oklab, currentColor 14%, transparent)"

interface AboutProps {
  ref?: React.Ref<HTMLElement>
}

export default function About({ ref }: AboutProps) {
  const { t } = useLanguage()

  const dossier = [
    { label: t("about.age"), value: t("about.age_value") },
    { label: t("about.location"), value: t("about.location_full") },
    { label: t("about.interests"), value: t("about.interests_list") },
    { label: t("about.available_for"), value: t("about.available_for_value") },
  ]

  return (
    <section id="about" ref={ref} className="relative py-32 lg:py-44">
      <div className={SECTION_CONTAINER}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-50">
          {t("about.title")}
        </p>

        {/*
          Assimétrica: o retrato ocupa ~38% e o texto o resto. `items-start`
          alinha as colunas pelo topo, para a bio arrancar na mesma linha de
          base que a esquadria superior do retrato.
        */}
        <div className="mt-14 grid items-start gap-14 lg:mt-20 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-24">
          <PortraitFrame alt={t("about.portrait_alt")} />

          <div className="lg:pt-2">
            <p className="max-w-[46ch] text-xl leading-[1.55] opacity-85 sm:text-2xl sm:leading-[1.5]">
              {t("about.description")}
            </p>

            {/* Dossier: rótulo em mono à esquerda, valor à direita. */}
            <dl className="mt-16 lg:mt-20" style={{ borderTop: `1px solid ${RULE}` }}>
              {dossier.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-10 py-5"
                  style={{ borderBottom: `1px solid ${RULE}` }}
                >
                  <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] opacity-40">
                    {row.label}
                  </dt>
                  <dd className="text-right text-[15px]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
