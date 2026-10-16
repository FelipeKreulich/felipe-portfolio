"use client"

import type { ReactNode } from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"

/** Do mais recente para o mais antigo. Datas do currículo. */
const jobs = [
  { key: "pop", from: "2025", to: null },
  { key: "az", from: "2024", to: "2025" },
  { key: "cstc", from: "2024", to: null, single: true },
  { key: "army", from: "2021", to: "2023" },
] as const

/** O "Website Portfolio" não entra: é este site, e quem lê já o está a ver. */
const projects = [
  { key: "ciphermesh", name: "CipherMesh", url: "https://ciphermesh.de" },
  { key: "wormhole", name: "Worm Hole", url: "https://worm-hole.vercel.app" },
  { key: "blog", name: "Blog", url: "https://kreulich-blog.vercel.app" },
] as const

/**
 * Secção 2: o que fez e o que construiu. Título à esquerda, conteúdo à
 * direita — em telemóvel empilha.
 */
export default function Work() {
  const { t } = useLanguage()

  return (
    <section id="work" className="mx-auto w-full max-w-6xl space-y-24 px-5 pt-12 pb-24 sm:px-8 sm:pt-16 sm:pb-32">
      <Block title={t("work.experience")}>
        <ol>
          {jobs.map((job) => (
            <li
              key={job.key}
              className="grid gap-x-8 gap-y-2 border-t py-7 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_1fr]"
            >
              <p className="text-muted tabular-nums sm:pt-0.5">
                {"single" in job ? job.from : `${job.from}–${job.to ?? t("work.now")}`}
              </p>
              <div>
                <h3 className="text-lg font-medium">{t(`work.${job.key}.company`)}</h3>
                <p className="text-muted">{t(`work.${job.key}.role`)}</p>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-pretty">
                  {t(`work.${job.key}.description`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      <Block title={t("work.projects")}>
        <ul>
          {projects.map((project) => (
            <li key={project.key} className="border-t first:border-t-0">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name}, ${t("footer.external")}`}
                className="group grid gap-x-8 gap-y-1 py-7 sm:grid-cols-[1fr_auto] [li:first-child_&]:pt-0"
              >
                <span>
                  <span className="block text-lg font-medium underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-current">
                    {project.name}
                  </span>
                  <span className="mt-1 block max-w-[60ch] leading-relaxed text-muted">
                    {t(`projects.${project.key}.summary`)}
                  </span>
                </span>
                <span className="text-sm text-muted sm:pt-1">{new URL(project.url).host}</span>
              </a>
            </li>
          ))}
        </ul>
      </Block>

      <Block title={t("work.stack")}>
        <p className="max-w-[60ch] text-lg leading-relaxed">{t("work.stack_list")}</p>
      </Block>
    </section>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* Os títulos repetem o desenho do nome, em pequeno: estreitos e
          pesados. É a única ligação visual entre as duas secções. */}
      <h2 className="text-3xl leading-none font-semibold tracking-[-0.02em] [font-stretch:75%] md:col-span-3">
        {title}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </div>
  )
}
