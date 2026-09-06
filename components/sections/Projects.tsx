"use client"

import Image from "next/image"
import { useState } from "react"
import { projects, statusKey } from "@/lib/projectsData"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { SECTION_CONTAINER } from "@/lib/layout"

/**
 * Lista e não grelha de cartões: três projetos numa grelha deixam demasiado
 * espaço vazio, e a lista deixa o texto respirar em vez de o cortar a três
 * linhas.
 *
 * A pré-visualização vive num painel colado à direita e troca com o hover em
 * vez de seguir o cursor: sem rastreio de rato, funciona com teclado, e não
 * há nada a perseguir quem lê.
 */
export default function Projects() {
  const { t } = useLanguage()
  const [ativo, setAtivo] = useState(projects[0].slug)
  const mostrado = projects.find((p) => p.slug === ativo) ?? projects[0]

  return (
    <section id="projects" className="py-32 sm:py-48">
      <div className={SECTION_CONTAINER}>
        <header className="mb-16 flex items-baseline gap-4">
          <span className="font-jp text-5xl leading-none" aria-hidden>
            創
          </span>
          <h2 className="font-mono text-xs tracking-[0.22em] uppercase opacity-55">
            {t("projects.title")}
          </h2>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)]">
          <ul className="divide-y divide-black/10">
            {projects.map((projeto) => (
              <li key={projeto.slug}>
                <a
                  href={projeto.links.live ?? projeto.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setAtivo(projeto.slug)}
                  onFocus={() => setAtivo(projeto.slug)}
                  className="group grid grid-cols-[2.5rem_1fr] items-start gap-x-4 py-8 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100 lg:opacity-55"
                >
                  <span className="font-mono text-xs tabular-nums opacity-45">
                    {projeto.index}
                  </span>

                  <span>
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-2xl sm:text-3xl">{projeto.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45">
                        {t(statusKey[projeto.status])} · {projeto.year}
                      </span>
                    </span>

                    <span className="mt-2 block max-w-prose text-sm opacity-70">
                      {t(projeto.summaryKey)}
                    </span>

                    <span className="mt-3 flex flex-wrap gap-x-4 font-mono text-[10px] tracking-[0.18em] uppercase opacity-45">
                      {projeto.stack.map((tec) => (
                        <span key={tec}>{tec}</span>
                      ))}
                    </span>

                    {/* Em ecrã estreito não há painel lateral onde pôr a
                        imagem: ela desce para dentro da própria linha. */}
                    <Image
                      src={projeto.preview.src}
                      alt={t(projeto.preview.altKey)}
                      width={projeto.preview.width}
                      height={projeto.preview.height}
                      className="mt-5 w-full grayscale lg:hidden"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Image
                key={mostrado.slug}
                src={mostrado.preview.src}
                alt={t(mostrado.preview.altKey)}
                width={mostrado.preview.width}
                height={mostrado.preview.height}
                className="w-full grayscale"
              />

              <p className="mt-5 max-w-prose text-sm leading-relaxed opacity-70">
                {t(mostrado.outcomeKey)}
              </p>

              {mostrado.metricKey && (
                <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase opacity-45">
                  {t(mostrado.metricKey)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
