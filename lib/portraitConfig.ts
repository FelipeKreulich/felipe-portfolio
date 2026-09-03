/**
 * Leitura de dados sobre o retrato da About.
 *
 * A imagem nunca é transformada: nada de deslocar pixels, ondular ou
 * distorcer. O efeito trata-a como superfície intacta e instrumenta-a por
 * cima.
 */

/** Arrasto da etiqueta atrás do cursor, em segundos. Colada parece tooltip. */
export const READOUT_TRAIL = 0.35

/**
 * Ritmo de atualização dos números.
 *
 * A 60fps são ilegíveis — os dígitos viram uma mancha. A ~12fps lêem-se e
 * continuam a parecer vivos.
 */
export const READOUT_HZ = 12

/** Deslocamento do fade de entrada e saída, em px. */
export const READOUT_OFFSET = 6

/**
 * Opacidade da etiqueta em repouso.
 *
 * Alta de propósito: com `mix-blend-mode: difference` a inversão é atenuada
 * pela opacidade, e a 0.65 o texto saía cinzento em vez de branco por cima do
 * retrato.
 */
export const READOUT_OPACITY = 0.9

/** Distância da etiqueta ao ponteiro, em px. */
export const READOUT_GAP_X = 18
export const READOUT_GAP_Y = 14

/**
 * Sem hover não há cursor nem etiqueta. A `true`, as esquadrias fazem uma
 * varredura autónoma lenta; a `false`, ficam estáticas.
 */
export const TOUCH_SWEEP = false
