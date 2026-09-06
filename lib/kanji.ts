/**
 * As máximas do Felipe em japonês, e a geometria do anel que as escreve.
 *
 * O texto não é kanji decorativo: são as frases que ele já tem no README de
 * GitHub, traduzidas. Quem lê japonês encontra o mesmo manifesto.
 */

export interface Maxim {
  ja: string
  /** Chave do dicionário para o aria-label. O texto acessível nunca é solto. */
  labelKey: string
}

export const MAXIMS: Maxim[] = [
  { ja: "誰も来ない、自分で作れ", labelKey: "maxim.build_it_yourself" },
  { ja: "すべては壊れる、その前提で設計せよ", labelKey: "maxim.design_for_the_fall" },
  { ja: "規律は動機より長く続く", labelKey: "maxim.discipline" },
  { ja: "沈黙、そして実行", labelKey: "maxim.silence" },
  { ja: "壊して、理解して、より良く作り直す", labelKey: "maxim.rebuild" },
  { ja: "深淵は見返す。それでも世に出せ", labelKey: "maxim.abyss" },
]

/** Ideográfico, para respirar como o resto do texto japonês. */
export const RING_SEPARATOR = "　・　"

/**
 * O `d` de um círculo completo, para `<textPath>`.
 *
 * Dois arcos de meia volta e não um só: um arco de 360° tem o mesmo ponto de
 * início e de fim, e o SVG não sabe de que lado o há-de desenhar.
 */
export function circlePath(cx: number, cy: number, r: number): string {
  return `M ${cx} ${cy} m ${-r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 ${-r * 2} 0`
}

/**
 * Repete o texto até cobrir a circunferência.
 *
 * Um anel com texto a menos deixa um buraco onde a volta acaba — e como o
 * anel roda, o buraco acaba por passar em frente a quem está a ler.
 */
export function repeatToFit(text: string, radius: number, glyphWidth: number): string {
  const circunferencia = 2 * Math.PI * radius
  const lugares = Math.ceil(circunferencia / glyphWidth)
  const vezes = Math.max(1, Math.ceil(lugares / Array.from(text).length))
  return text.repeat(vezes)
}

/** As máximas encadeadas numa volta, com separador a fechar. */
export function ringText(maxims: Maxim[] = MAXIMS): string {
  return maxims.map((m) => m.ja).join(RING_SEPARATOR) + RING_SEPARATOR
}
