/** Espaçamento da grelha, em CSS px. */
export const GRID_SPACING = 48

/** Raio de influência do cursor, em CSS px. */
export const GRID_RADIUS = 190

/** Deslocamento máximo de uma célula, para fora do cursor, em CSS px. */
export const GRID_PUSH = 11

/** Raio do ponto em repouso e no pico. */
export const DOT_MIN = 0.9
export const DOT_MAX = 2.1

/** Opacidade do ponto em repouso e no pico. */
export const DOT_ALPHA_IDLE = 0.16
export const DOT_ALPHA_PEAK = 0.85

/**
 * Suavização exponencial do cursor, por frame a 60fps. Mais baixo = mais
 * preguiçoso. Corrigido pelo delta real para não depender da taxa de frames.
 */
export const CURSOR_SMOOTHING = 0.12

/**
 * Sem hover não há cursor. A `false` a grelha fica completamente estática e o
 * ticker nem é subscrito; a `true` deriva devagar por conta própria.
 */
export const TOUCH_DRIFT = false

/** Período da deriva autónoma, em segundos. */
export const DRIFT_PERIOD = 22

/* --------------------------------------------------------------------------
 * Click spark.
 *
 * As partículas são desenhadas no canvas da grelha e avançadas pelo mesmo
 * ticker. Não há canvas novo nem rAF novo — entram no loop que já existe.
 * ----------------------------------------------------------------------- */

/** Partículas por clique. */
export const SPARK_MIN = 18
export const SPARK_MAX = 26

/** Vida de cada partícula, em ms. */
export const SPARK_LIFE = 450

/** Distância percorrida, em px. */
export const SPARK_REACH_MIN = 26
export const SPARK_REACH_MAX = 62

/** Comprimento do traço radial, em px. */
export const SPARK_TRAIL = 14

/** Jitter angular, em radianos: sem isto os traços saem numa estrela regular. */
export const SPARK_JITTER = 0.45

/**
 * Flash de aberração cromática a acompanhar o clique.
 *
 * Desligado: competia com as partículas em vez de as sublinhar. A mecânica
 * fica montada — voltar é pôr isto a `true`.
 */
export const SPARK_FLASH = false

/** Quando entra, e quanto dura, em ms. */
export const SPARK_FLASH_DELAY = 120
export const SPARK_FLASH_LIFE = 170
