"use client"

import { useLanguage } from "@/contexts/language/LanguageContext"
import ScrollExpand from "./ScrollExpand"

/**
 * Secção de respiração entre o Percurso e o que vem a seguir.
 *
 * Não acrescenta informação nova: muda o ritmo. Depois de uma lista densa de
 * datas e tecnologias, o olho precisa de um sítio onde não haja nada para
 * analisar. A moldura abre à medida que se desce e entrega o ecrã inteiro à
 * imagem — e só quando está aberta é que o texto aparece.
 */
export default function Transition({ ref }: { ref?: React.Ref<HTMLElement> }) {
  const { t } = useLanguage()

  return (
    <section id="transition" ref={ref} aria-labelledby="transicao-titulo" className="relative w-full">
      <ScrollExpand
        src="/transition-desktop.webp"
        srcMobile="/transition-mobile.webp"
        alt={t("transition.alt")}
        title={t("transition.phrase")}
        scrollHint={t("transition.hint")}
        startWidth={42}
        startHeight={58}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        overlayScrim={0.55}
      >
        <div className="mx-auto max-w-2xl">
          <h2
            id="transicao-titulo"
            className="text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl"
          >
            {t("transition.title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-balance text-white/85 sm:text-lg">
            {t("transition.body")}
          </p>
        </div>
      </ScrollExpand>
    </section>
  )
}
