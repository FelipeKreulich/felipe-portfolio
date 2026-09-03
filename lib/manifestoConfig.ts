/** Fontes do vídeo. O Safari precisa do mp4; o VP9 é menor para quem o suporta. */
export const MANIFESTO_WEBM = "/section-1.webm"
export const MANIFESTO_MP4 = "/section-1.mp4"
export const MANIFESTO_POSTER = "/section-1-poster.webp"

/**
 * Densidade da trama ligada ao progresso de scroll: grossa à entrada, fina a
 * meio, grossa à saída. Passo 2 em diante — o interruptor existe desde já
 * para se poder ver com e sem.
 */
export const SCROLL_DRIVEN_DENSITY = true

/* --------------------------------------------------------------------------
 * Trama de pontos.
 * ----------------------------------------------------------------------- */

/** Lado da célula em repouso, em px de ecrã. */
export const DOT_SIZE = 13

/** Quanto a grelha afina junto ao cursor. 0.9 ≈ quase o dobro da densidade. */
export const DOT_FOCUS = 0.9

/** Deslocamento radial máximo dos pontos, em px. */
export const DOT_PUSH = 26

/** Alcance da influência do cursor, em px. */
export const DOT_RADIUS = 260

/** Deriva autónoma da amostragem quando não há cursor (touch). */
export const DOT_DRIFT = 0.006
