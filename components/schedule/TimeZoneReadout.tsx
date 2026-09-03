"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
import { useLanguage } from "@/contexts/language/LanguageContext"

const LISBOA = "Europe/Lisbon"

/**
 * A diferença horária entre Lisboa e o fuso do visitante, em horas.
 *
 * Formatar o mesmo instante nos dois fusos e subtrair é o único método que
 * acerta sempre: apanha o horário de verão de cada lado, que muda em datas
 * diferentes, e os fusos de meia hora.
 */
function diferencaHoraria(fuso: string) {
  const agora = new Date()
  const emLisboa = new Date(agora.toLocaleString("en-US", { timeZone: LISBOA }))
  const emCasa = new Date(agora.toLocaleString("en-US", { timeZone: fuso }))
  return Math.round(((emCasa.getTime() - emLisboa.getTime()) / 3600000) * 2) / 2
}

/**
 * Telemetria de fuso, na linguagem de dossier da About.
 *
 * Informação útil de facto para quem está noutro país — não é decoração.
 */
export default function TimeZoneReadout() {
  const { t } = useLanguage()
  const relogioRef = useRef<HTMLSpanElement>(null)
  /*
    `null` até o cliente responder. O servidor não tem `Intl` do visitante, e
    renderizar um fuso às cegas dava divergência de hidratação.
  */
  const [fuso, setFuso] = useState<{ nome: string; delta: number } | null>(null)

  useEffect(() => {
    const nome = Intl.DateTimeFormat().resolvedOptions().timeZone
    setFuso({ nome, delta: diferencaHoraria(nome) })
  }, [])

  useEffect(() => {
    const el = relogioRef.current
    if (!el) return

    const formato = new Intl.DateTimeFormat("pt-PT", {
      timeZone: LISBOA,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    /*
      O relógio corre no ticker partilhado com um guard de um segundo, não num
      `setInterval` próprio. O ticker já corre; um intervalo à parte seria um
      segundo relógio a acordar a página fora de fase com os frames.
    */
    let ultimo = 0
    const tique = () => {
      const agora = performance.now()
      if (agora - ultimo < 1000) return
      ultimo = agora
      el.textContent = formato.format(new Date())
    }
    tique()
    gsap.ticker.add(tique)
    return () => gsap.ticker.remove(tique)
  }, [])

  const sinal = fuso ? (fuso.delta > 0 ? `+${fuso.delta}h` : fuso.delta < 0 ? `${fuso.delta}h` : t("schedule.tz_same")) : ""

  return (
    <dl className="font-mono text-[11px] tracking-[0.14em] uppercase">
      <div className="flex items-baseline gap-4">
        <dt className="w-[9.5rem] shrink-0 opacity-40">{t("schedule.tz_lisbon")}</dt>
        {/* `tabular-nums`: sem isto os dígitos mudam de largura e a linha treme. */}
        <dd ref={relogioRef} className="tabular-nums opacity-70" suppressHydrationWarning />
      </div>
      <div className="mt-2 flex items-baseline gap-4">
        <dt className="w-[9.5rem] shrink-0 opacity-40">{t("schedule.tz_yours")}</dt>
        <dd className="tabular-nums opacity-70" suppressHydrationWarning>
          {fuso ? `${fuso.nome}  (${sinal})` : ""}
        </dd>
      </div>
    </dl>
  )
}
