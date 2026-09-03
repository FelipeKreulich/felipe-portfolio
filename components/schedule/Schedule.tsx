"use client"

import { useRef, useState } from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { SECTION_CONTAINER } from "@/lib/layout"
import Magnet from "@/components/ui/Magnet"
import TimeZoneReadout from "./TimeZoneReadout"
import ScheduleModal from "./ScheduleModal"
import { CALENDLY_URL, EMAIL } from "./config"



/**
 * Agendar conversa.
 *
 * Sem embed inline. O Calendly só deixa personalizar três cores, e só em
 * planos pagos — neste é gratuito, portanto os parâmetros seriam ignorados.
 * Em vez de tentar fazer um painel branco pertencer a este site, tira-se da
 * composição: a secção é inteiramente nossa e o calendário vive num modal.
 *
 * Nada de `widget.js`. O prefill vai no URL e os eventos deles chegam por
 * `postMessage` — o script de terceiros não acrescentava nada e custava um
 * pedido a toda a gente que abre a página.
 */
export default function Schedule({ ref }: { ref?: React.Ref<HTMLElement> }) {
  const { t } = useLanguage()
  const [aberto, setAberto] = useState(false)
  /*
    Só é montado depois do primeiro clique, e daí em diante fica. Reabrir tem
    de ser instantâneo — recriar o iframe voltaria a pagar o carregamento.
  */
  const [jaAbriu, setJaAbriu] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)

  const abrir = () => {
    setJaAbriu(true)
    setAberto(true)
  }

  return (
    <section id="calendar" ref={ref} className="relative py-28 lg:py-36">
      <div className={SECTION_CONTAINER}>
        <p data-rhythm="secundario" className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-50">
          {t("schedule.eyebrow")}
        </p>

        <h2 className="mt-10 max-w-[18ch] text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-4xl lg:text-5xl">
          {t("schedule.phrase")}
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <Magnet>
            <button
              ref={botaoRef}
              type="button"
              onClick={abrir}
              className="group relative cursor-pointer px-6 py-3 font-mono text-[11px] tracking-[0.18em] uppercase"
              style={{ border: "1px solid color-mix(in oklab, currentColor 28%, transparent)" }}
            >
              {t("schedule.cta")}
            </button>
          </Magnet>

          {/*
            A ação secundária existe porque nem toda a gente marca uma reunião
            com um desconhecido antes de escrever, e esses costumam ser bons
            clientes. Obrigá-los ao calendário perde-os.
          */}
          <p className="text-sm opacity-60">
            {t("schedule.or")}{" "}
            <a
              href={`mailto:${EMAIL}`}
              data-selectable
              className="relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
            >
              {EMAIL}
            </a>
          </p>
        </div>

        <div className="mt-16">
          <TimeZoneReadout />
        </div>

        {/*
          Sem JavaScript o botão não faz nada, por isso a ligação directa fica
          sempre no HTML servido. `noscript` para não a duplicar visualmente
          para quem tem JS.
        */}
        <noscript>
          <p className="mt-8 text-sm">
            <a href={CALENDLY_URL} className="underline">
              {t("schedule.fallback_link")}
            </a>
          </p>
        </noscript>
      </div>

      {jaAbriu ? (
        <ScheduleModal aberto={aberto} aoFechar={() => setAberto(false)} devolverFocoA={botaoRef} />
      ) : null}
    </section>
  )
}
