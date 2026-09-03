/**
 * Configuração da hero.
 *
 * As imagens vêm do `scripts/prepare-hero.mjs` — não edites os WebP à mão,
 * reafina o CONFIG do script e volta a correr.
 */
/** Retrato da About. Gerado a partir de `public/eu.png`. */
export const PORTRAIT_IMAGE = "/portrait.webp"

export const HERO_IMAGE_DESKTOP = "/hero-desktop.webp"
export const HERO_IMAGE_MOBILE = "/hero-mobile.webp"

/** Abaixo disto usa-se o recorte vertical; o 16:9 corta o pagode em retrato. */
export const MOBILE_BREAKPOINT = 768

/* --------------------------------------------------------------------------
 * Presets do dithering.
 *
 * Trocar de paleta é mudar `ACTIVE_PRESET` — nada disto está no JSX.
 * ----------------------------------------------------------------------- */

/** Comum aos dois presets. */
export const DITHER_BASE = {
  type: "8x8",
  originalColors: false,
  inverted: false,
  fit: "cover",
} as const

export const DITHER_PRESETS = {
  /**
   * Duotone clássico: `colorHighlight` igual ao `colorFront`, portanto não há
   * terceiro tom nenhum.
   *
   * As duas variantes NÃO são uma inversão — os escuros continuam escuros, ou
   * o pagode ficava branco e o céu preto. O que troca é qual das pontas se
   * funde com a página: no escuro é o `colorBack` que desaparece no fundo e a
   * imagem emerge do preto; no claro é o `colorFront` que se funde com o papel
   * e a imagem emerge do branco.
   */
  duotone: {
    dark: {
      colorBack: "#0A0A0B",
      // Não é branco puro de propósito: deixa margem para o texto da hero.
      colorFront: "#EDEBE6",
      colorHighlight: "#EDEBE6",
      colorSteps: 2,
    },
    light: {
      // Tinta, não preto absoluto — sobre papel um preto chapado fica duro.
      colorBack: "#16150F",
      colorFront: "#F3F1EA",
      colorHighlight: "#F3F1EA",
      colorSteps: 2,
    },
  },

  /**
   * Variante com acento, preparada mas inactiva. Mantém a imagem
   * monocromática e reserva o âmbar só para os realces mais claros — nesta
   * imagem, o céu e o horizonte.
   */
  amber: {
    dark: {
      colorBack: "#0A0A0B",
      colorFront: "#BFC3C7",
      colorHighlight: "#FFB020",
      colorSteps: 3,
    },
    light: {
      colorBack: "#16150F",
      colorFront: "#6B6F73",
      // O âmbar claro desaparece sobre papel; escurecido, lê-se. Mesmo
      // problema que o ciano do preloader teve no tema claro.
      colorHighlight: "#B26A00",
      colorSteps: 3,
    },
  },
} as const

export type DitherPreset = keyof typeof DITHER_PRESETS
export const ACTIVE_PRESET: DitherPreset = "duotone"

/* --------------------------------------------------------------------------
 * `size` responsivo.
 *
 * O `size` do Paper é medido em PIXELS DE ECRÃ, não em pixels da imagem. Um
 * valor fixo dá grão fino em desktop e enorme em telemóvel; derivá-lo da
 * largura do viewport mantém o grão constante em relação ao conteúdo.
 *
 * O grão é grosso de propósito: a 2 com colorSteps 2 o resultado é ruído a 50%
 * sem forma legível. Esta imagem é uma paisagem densa, não uma silhueta sobre
 * fundo liso — grão grosso obriga o efeito a escolher, e lê-se como serigrafia.
 * NÃO baixes isto para "ganhar detalhe".
 * ----------------------------------------------------------------------- */
export const DITHER_SIZE_DIVISOR = 350
export const DITHER_SIZE_MIN = 2
export const DITHER_SIZE_MAX = 6

/** Quantização: sem isto cada pixel de resize dava um valor novo e um render. */
export const DITHER_SIZE_STEP = 0.25

/** Cada mudança de `size` força um re-render, por isso o resize é estrangulado. */
export const RESIZE_DEBOUNCE_MS = 150

/* --------------------------------------------------------------------------
 * "Decode on hover" — a máscara de revelação.
 *
 * O cursor abre um buraco no dithering e mostra a imagem por baixo. A máscara
 * é composta pela GPU e a posição vive em custom properties CSS escritas uma
 * vez por frame no ticker do GSAP — não passa nada pelo estado do React, e não
 * há um segundo requestAnimationFrame.
 * ----------------------------------------------------------------------- */

/** Raio da máscara, em px. */
export const MASK_RADIUS = 260
export const MASK_RADIUS_TOUCH = 190

/**
 * Sem hover, a máscara segue uma trajetória de Lissajous autónoma.
 * A `false` fecha-se e sobra só o dithering.
 */
export const TOUCH_AUTOPILOT = true

/** Período da trajetória de Lissajous, em segundos. */
export const LISSAJOUS_PERIOD = 16
