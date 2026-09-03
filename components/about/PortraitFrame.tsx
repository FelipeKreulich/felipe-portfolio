"use client"

import { useRef } from "react"
import { PORTRAIT_IMAGE } from "@/lib/heroConfig"
import { usePortraitReadout } from "@/hooks/usePortraitReadout"

/**
 * O retrato, sem cartão e sem sombra.
 *
 * O enquadramento vem de esquadrias hairline nos cantos e de marcas de corte,
 * como uma prova de impressão — não de uma moldura.
 *
 * Sobre a imagem corre uma leitura de dados: uma etiqueta mono que arrasta
 * atrás do cursor com as coordenadas normalizadas. A imagem em si nunca é
 * transformada.
 */
export default function PortraitFrame({ alt }: { alt: string }) {
  const areaRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const coordsRef = useRef<HTMLSpanElement>(null)

  usePortraitReadout({ area: areaRef, label: labelRef, coords: coordsRef })

  return (
    // Sem `overflow-hidden`: as marcas de corte e a etiqueta saem da caixa de
    // propósito, e cortá-las mataria o efeito.
    <div ref={areaRef} className="relative">
      <img
        src={PORTRAIT_IMAGE}
        alt={alt}
        // 2:3 fixo desde o primeiro paint: reserva o espaço e não há CLS
        // quando a imagem chega.
        className="aspect-[2/3] w-full object-cover"
      />

      {/* Esquadrias: quatro cantos em L, 1px. */}
      {CORNERS.map((corner) => (
        <span
          key={corner.key}
          aria-hidden
          className={`pointer-events-none absolute h-5 w-5 ${corner.position}`}
          style={{ borderColor: HAIRLINE, ...corner.borders }}
        />
      ))}

      {/* Marcas de corte: ticks curtos para fora de cada canto. */}
      {CROP_MARKS.map((mark) => (
        <span
          key={mark.key}
          aria-hidden
          className={`pointer-events-none absolute ${mark.className}`}
          style={{ backgroundColor: HAIRLINE }}
        />
      ))}

      {/*
        A etiqueta. Decorativa: tudo o que interessa está no dossier em texto.
        `tabular-nums` é obrigatório — sem isso os dígitos saltam de largura e
        a etiqueta treme a cada atualização.
      */}
      <div
        ref={labelRef}
        aria-hidden
        /*
          `difference` com branco, e não uma cor fixa.

          A etiqueta anda por cima do retrato mas transborda para fora dele, e
          chega a ficar a cavalo da borda — uma cor por elemento acertava sempre
          só num dos lados. A diferença resolve por pixel: sobre a foto escura
          sai branca, sobre o papel do tema claro sai preta, e a transição
          acontece no meio da palavra sem código nenhum.
        */
        className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap font-mono text-[10px] uppercase tabular-nums tracking-[0.14em] mix-blend-difference"
        style={{ opacity: 0, color: "#ffffff", willChange: "transform" }}
      >
        <span ref={coordsRef}>X 0.000   Y 0.000</span>
      </div>
    </div>
  )
}

const HAIRLINE = "color-mix(in oklab, currentColor 34%, transparent)"

const CORNERS = [
  { key: "tl", position: "left-0 top-0", borders: { borderTopWidth: 1, borderLeftWidth: 1 } },
  { key: "tr", position: "right-0 top-0", borders: { borderTopWidth: 1, borderRightWidth: 1 } },
  { key: "bl", position: "bottom-0 left-0", borders: { borderBottomWidth: 1, borderLeftWidth: 1 } },
  { key: "br", position: "bottom-0 right-0", borders: { borderBottomWidth: 1, borderRightWidth: 1 } },
] as const

const CROP_MARKS = [
  { key: "t-l", className: "-top-3 left-0 h-2 w-px" },
  { key: "l-t", className: "-left-3 top-0 h-px w-2" },
  { key: "t-r", className: "-top-3 right-0 h-2 w-px" },
  { key: "r-t", className: "-right-3 top-0 h-px w-2" },
  { key: "b-l", className: "-bottom-3 left-0 h-2 w-px" },
  { key: "l-b", className: "-left-3 bottom-0 h-px w-2" },
  { key: "b-r", className: "-bottom-3 right-0 h-2 w-px" },
  { key: "r-b", className: "-right-3 bottom-0 h-px w-2" },
] as const
