/**
 * Toda a afinação do scroll num sítio só.
 *
 * O site tem um único relógio (o ticker do GSAP) e uma única fonte de
 * amortecimento por cadeia: o cursor amortece com `quickTo`, o scroll
 * amortece com `scrub`. Estes valores são os dessa segunda cadeia.
 */

/**
 * Intensidade da interpolação do Lenis, de 0 a 1. Mais alto = mais directo.
 *
 * Substitui o par `duration: 1.1` + `easing` exponencial que aqui estava. Não
 * é uma afinação do mesmo modelo, é outro modelo: o `duration` dá uma cauda
 * longa que parece luxuosa com a página parada e pesada num trackpad, porque
 * cada gesto novo espera pelo anterior. O `lerp` persegue o alvo e responde
 * ao gesto seguinte de imediato.
 */
export const LENIS_LERP = 0.1

/** Multiplicador do toque. O momentum nativo continua a mandar. */
export const TOUCH_MULTIPLIER = 1.6

/**
 * `scrub` base para o que segue o scroll com amortecimento.
 *
 * Usa `true` (directo, sem atraso) para o que tem de acompanhar o dedo ou o
 * cursor — um valor numérico aí lê-se como atraso, não como suavidade.
 */
export const SCRUB = 0.5

/**
 * Ritmos.
 *
 * A suavidade não vem do scroll suave — vem de as coisas se moverem a
 * velocidades ligeiramente diferentes. O título acompanha o scroll a 1.0, o
 * texto secundário fica um pouco para trás, o fundo mais ainda.
 *
 * Acima de ~15% de diferença deixa de parecer profundidade e passa a parecer
 * que a página está partida. Daí o tecto no `RITMO_MAX_PX`.
 */
export const RITMOS = {
  titulo: 1,
  secundario: 0.94,
  fundo: 0.85,
} as const

export type Ritmo = keyof typeof RITMOS

/** Tecto do desvio, em píxeis. Impede que ecrãs altos exagerem o efeito. */
export const RITMO_MAX_PX = 60
