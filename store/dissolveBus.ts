/**
 * Canal mutável entre a timeline GSAP (que vive no DOM) e o shader (WebGL).
 *
 * Passar estes valores pela store do zustand daria um re-render do React por
 * frame a 60fps. O plano lê o objeto dentro do `useFrame`; o GSAP escreve-lhe
 * diretamente. Nenhum dos lados precisa de saber do outro.
 */
export const dissolveBus = {
  /** 0 tapa o ecrã, 1 abre-o. */
  progress: 0,
  /** Intensidade do plano como fundo do hero, depois da saída. */
  idle: 0,
  /** Deslocamento do RGB split, em px. Só diferente de zero durante a saída. */
  split: 0,
}

export function resetDissolveBus() {
  dissolveBus.progress = 0
  dissolveBus.idle = 0
  dissolveBus.split = 0
}
