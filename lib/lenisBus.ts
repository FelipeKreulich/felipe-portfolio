import type Lenis from "lenis"

/**
 * A instância viva do Lenis, para quem precisa de travar o scroll.
 *
 * `overflow: hidden` no body não trava o Lenis — ele interpola a posição por
 * fora da timeline do browser e continua a mexer o conteúdo por baixo de um
 * modal aberto. A única forma correta é chamar `stop()` e `start()`.
 *
 * `null` é um estado legítimo e frequente: com `prefers-reduced-motion`, ou
 * antes de o preloader acabar, o Lenis nem chega a existir. Quem consome tem
 * de ter um caminho alternativo.
 */
export const lenisBus: { instance: Lenis | null } = { instance: null }
