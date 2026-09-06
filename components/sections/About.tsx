"use client"

import { useLanguage } from "@/contexts/language/LanguageContext"
import { SECTION_CONTAINER } from "@/lib/layout"

/**
 * Só texto. O avatar já está na hero, logo acima — repeti-lo aqui enfraquece
 * os dois. Segue a forma da secção de Projetos: kanji grande e palavra
 * latina no cabeçalho, corpo por baixo.
 */
export default function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-32 sm:py-48">
      <div className={SECTION_CONTAINER}>
        <header className="mb-16 flex items-baseline gap-4">
          <span className="font-jp text-5xl leading-none" aria-hidden>
            我
          </span>
          <h2 className="font-mono text-xs tracking-[0.22em] uppercase opacity-55">
            {t("about.title")}
          </h2>
        </header>

        <p className="max-w-3xl text-2xl leading-snug sm:text-3xl">{t("about.lead")}</p>

        {/* Dois parágrafos e não um: o primeiro diz de onde veio, o segundo o
            que fez desde então. Num bloco só o arco perdia-se, e ficava uma
            lista de empregos. */}
        <p className="mt-8 max-w-prose text-base leading-relaxed opacity-70">{t("about.body")}</p>

        <p className="mt-5 max-w-prose text-base leading-relaxed opacity-70">{t("about.body_2")}</p>

        <p className="mt-6 font-mono text-xs tracking-[0.05em] opacity-45">{t("about.background")}</p>

        {/* Duas opacidades distintas: aninhar um `opacity-100` dentro de um
            elemento com `opacity-45` não devolve o filho a 100%, porque a
            opacidade do pai já comprime tudo lá dentro. Por isso os dois
            `<span>` são irmãos, cada um com a sua opacidade própria. */}
        <p className="mt-10 font-mono text-[10px] tracking-[0.18em] uppercase">
          <span className="opacity-45">{t("about.stack_label")}</span>{" "}
          <span className="opacity-70">{t("about.stack")}</span>
        </p>
      </div>
    </section>
  )
}
