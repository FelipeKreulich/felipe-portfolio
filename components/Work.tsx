"use client"

import { useRef, type ReactNode } from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import type { TranslationKey } from "@/lib/i18n/dictionaries"

/** Do mais recente para o mais antigo. Datas do currículo. */
const jobs = [
  { key: "pop", from: "2025", to: null },
  { key: "az", from: "2024", to: "2025" },
  { key: "cstc", from: "2024", to: null, single: true },
  { key: "army", from: "2021", to: "2023" },
] as const

type Project = { key: string; name: string; lang: string; url?: string; soon?: true }

const gh = (repo: string) => `https://github.com/FelipeKreulich/${repo}`

/** Os três primeiros abrem a fila. O portfólio não entra: quem lê já o está a ver. Privados sem site não têm url, logo não têm link. */
const projects: Project[] = [
  { key: "ciphermesh", name: "CipherMesh", lang: "TypeScript", url: "https://www.npmjs.com/package/ciphermesh" },
  { key: "blog", name: "The Commit Times", lang: "Next.js", url: "https://the-commit-times.vercel.app" },
  { key: "wormhole", name: "Worm Hole", lang: "Next.js", url: "https://worm-hole.vercel.app", soon: true },
  { key: "zerobit", name: "Zerobit", lang: "Swift" },
  { key: "glasshouse", name: "Operation Glasshouse", lang: "Python", url: gh("operation-glasshouse") },
  { key: "secretchat", name: "Secret Chat LAN", lang: "JavaScript", url: gh("secret-chat-lan") },
  { key: "devileye", name: "Devil Eye Radar", lang: "Go", url: gh("devil-eye-radar-lan") },
  { key: "ewmap", name: "EW Tactical Map", lang: "Go", url: gh("ew-tactical-map-system") },
  { key: "phantomip", name: "PhantomIP", lang: "Rust", url: gh("phantom-ip") },
  { key: "logdriver", name: "LogDriver", lang: "TypeScript" },
  { key: "typehorizon", name: "Type Horizon", lang: "TypeScript", url: gh("type-horizon") },
  { key: "tamagotchi", name: "Tamagotchi", lang: "Next.js", url: "https://tamagotchi-livid.vercel.app" },
  { key: "jarvis", name: "Jarvis", lang: "Python", url: gh("jarvis-assistant") },
  { key: "argus", name: "ARGUS", lang: "Python", url: gh("argus") },
  { key: "venomforge", name: "VenomForge", lang: "Python", url: gh("venom-forge") },
  { key: "particle", name: "Particle Morphism", lang: "JavaScript", url: "https://particle-morphism.vercel.app" },
  { key: "orus", name: "Orus NeoVim", lang: "Lua", url: gh("Orus-NeoVim") },
]

/** Tirado dos repositórios do GitHub e do dia a dia. */
const stack = [
  ["lang", "TypeScript, JavaScript, Go, Rust, Python, Swift, Kotlin, C#, PHP"],
  ["front", "React, Next.js, Tailwind CSS, shadcn/ui, Motion, GSAP, Three.js"],
  ["back", "Node.js, .NET, Laravel, Prisma, Zod, REST, WebSockets"],
  ["mobile", "SwiftUI, Kotlin, Tauri"],
  ["data", "PostgreSQL, MySQL, Redis, Neon, S3"],
  ["infra", "Docker, Kubernetes, AWS, Vercel, GitHub Actions, Sentry"],
  ["sec", "libsodium, Double Ratchet, Vitest, Playwright"],
] as const

/** O mesmo desenho do nome no topo: estreito e pesado. */
const display = "font-semibold tracking-[-0.03em] [font-stretch:75%]"
const card = "flex h-full snap-start flex-col border bg-background p-6 transition-colors"

export default function Work() {
  const { t } = useLanguage()

  return (
    <section id="work" className="mx-auto w-full max-w-6xl space-y-24 px-5 pt-12 pb-24 sm:px-8 sm:pt-16 sm:pb-32">
      <Rail index="01" title={t("work.experience")}>
        {jobs.map((job) => (
          <li key={job.key} className="w-[85%] shrink-0 sm:w-[22rem]">
            <article className={card}>
              <p className={`${display} text-4xl leading-none tabular-nums`}>
                {"single" in job ? job.from : (
                  <>
                    {job.from}
                    <span className="text-muted">–</span>
                    {job.to ? job.to.slice(2) : <span className="text-available">{t("work.now")}</span>}
                  </>
                )}
              </p>
              <h3 className="mt-8 text-lg font-medium">{t(`work.${job.key}.company`)}</h3>
              <p className="mt-1 text-xs tracking-wide text-muted uppercase">{t(`work.${job.key}.role`)}</p>
              <p className="mt-4 text-sm leading-relaxed text-pretty">{t(`work.${job.key}.description`)}</p>
            </article>
          </li>
        ))}
      </Rail>

      <Rail index="02" title={t("work.projects")}>
        {projects.map((p) => {
          const body = (
            <>
              <span className="flex items-center justify-between gap-3 text-xs tracking-wide text-muted uppercase">
                {p.lang}
                {p.soon && <span className="rounded-full border px-2 py-0.5 text-foreground normal-case">{t("work.soon")}</span>}
              </span>
              <span className={`${display} mt-10 block text-3xl leading-none`}>{p.name}</span>
              <span className="mt-3 block flex-1 text-sm leading-relaxed text-pretty text-muted">
                {t(`gallery.${p.key}` as TranslationKey)}
              </span>
              <span className="mt-6 block text-sm">
                {p.url ? (
                  <>
                    {new URL(p.url).host.replace("www.", "")}{" "}
                    <span aria-hidden className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </>
                ) : (
                  <span className="text-muted">{t("work.private")}</span>
                )}
              </span>
            </>
          )
          return (
            <li key={p.key} className="w-[80%] shrink-0 sm:w-[18rem]">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.name}, ${t("footer.external")}`}
                  className={`${card} group hover:border-foreground`}
                >
                  {body}
                </a>
              ) : (
                <div className={card}>{body}</div>
              )}
            </li>
          )
        })}
      </Rail>

      <div className="grid gap-8 md:grid-cols-12">
        <Heading index="03" title={t("work.stack")} />
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 md:col-span-9">
          {stack.map(([key, items]) => (
            <div key={key} className="border-t pt-4">
              <dt className="text-xs tracking-wide text-muted uppercase">{t(`work.stack.${key}`)}</dt>
              <dd className="mt-2 leading-relaxed">{items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Heading({ index, title }: { index: string; title: string }) {
  return (
    <h2 className={`${display} text-4xl leading-none md:col-span-3`}>
      <span className="mb-3 block text-sm font-normal tracking-normal text-muted tabular-nums [font-stretch:100%]">{index}</span>
      {title}
    </h2>
  )
}

/** Fila horizontal com scroll nativo e snap. Os botões só ajudam quem não tem trackpad. */
function Rail({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  const { t } = useLanguage()
  const ref = useRef<HTMLUListElement>(null)
  const move = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" })
  const btn = "grid size-10 place-items-center rounded-full border transition-colors hover:border-foreground"

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <Heading index={index} title={title} />
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label={t("work.prev")} className={btn}>←</button>
          <button type="button" onClick={() => move(1)} aria-label={t("work.next")} className={btn}>→</button>
        </div>
      </div>
      <ul
        ref={ref}
        className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  )
}
