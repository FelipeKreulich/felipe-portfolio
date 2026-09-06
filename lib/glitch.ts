/**
 * A matemática do LetterGlitch, fora do componente.
 *
 * Vive aqui porque é a única parte com regras a sério, e porque assim
 * testa-se sem DOM nem canvas. O componente só desenha.
 */

/** Corpo da fonte do canvas, em px CSS. */
export const FONT_SIZE = 15

/**
 * Os glifos CJK são full-width: ocupam 1em, não os 10px fixos do componente
 * do React Bits. Numa grelha mais estreita do que o corpo da fonte
 * sobrepõem-se uns aos outros. A célula deriva do corpo — não é uma
 * constante à parte que se possa dessincronizar dele.
 */
export const CELL_W = FONT_SIZE
export const CELL_H = Math.round(FONT_SIZE * 1.34)

/** Katakana e os kanji do vocabulário do site. */
export const JP_CHARS = Array.from(
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "我術創数縁壊築設計沈黙実行規律誰来自分作深淵見返世出",
)

export type Rgb = [number, number, number]

const SHORT = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
const FULL = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

/** Aceita `#abc` e `#aabbcc`. Devolve null para tudo o resto. */
export function hexToRgb(hex: string): Rgb | null {
  const short = SHORT.exec(hex)
  if (short) {
    return [
      parseInt(short[1] + short[1], 16),
      parseInt(short[2] + short[2], 16),
      parseInt(short[3] + short[3], 16),
    ]
  }

  const full = FULL.exec(hex)
  if (!full) return null
  return [parseInt(full[1], 16), parseInt(full[2], 16), parseInt(full[3], 16)]
}

/**
 * Interpola entre duas cores hex e devolve uma string CSS.
 *
 * Os dois extremos são sempre hex — nunca o resultado desta função. É esta a
 * diferença para o componente original, que voltava a passar o seu próprio
 * `rgb(...)` ao parser de hex, recebia null, e congelava a transição no
 * primeiro passo. Lançar em vez de devolver algo é deliberado: um extremo
 * que não seja hex é sempre erro de quem chama.
 */
export function lerpColor(from: string, to: string, t: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  if (!a || !b) {
    throw new Error(`lerpColor precisa de hex nos dois extremos: "${from}" -> "${to}"`)
  }

  const f = Math.min(1, Math.max(0, t))
  const mix = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * f)
  return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`
}

/** Quantas células cabem numa caixa, em unidades CSS. */
export function gridFor(width: number, height: number) {
  return {
    cols: Math.max(1, Math.ceil(width / CELL_W)),
    rows: Math.max(1, Math.ceil(height / CELL_H)),
  }
}
