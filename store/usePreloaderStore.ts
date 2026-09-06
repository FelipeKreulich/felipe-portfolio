import { create } from "zustand"

export type PreloaderPhase = "loading" | "exiting" | "done"

/**
 * Intensidade do plano de dissolve depois de o preloader sair. O mesmo plano
 * não desmonta — passa a ser o fundo do hero. É essa continuidade que faz a
 * transição parecer cara em vez de parecer um corte.
 */
export const IDLE_DISSOLVE_INTENSITY = 0.15

/** Abaixo disto o preloader pisca em ligações rápidas em vez de se ler. */
export const MIN_VISIBLE_MS = 900

/** Versão curta para navegações seguintes dentro da mesma sessão. */
export const RETURNING_VISIBLE_MS = 400

/** Rede de segurança: fecha na mesma se algo ficar preso a carregar. */
export const SAFETY_TIMEOUT_MS = 4000

/**
 * Segunda rede, para depois de `beginExit`: a timeline de saída em si corre a
 * reboque de `requestAnimationFrame`, que o browser suspende numa aba oculta
 * ou em segundo plano — sem frames, o `onComplete` da timeline nunca dispara
 * e o overlay ficava preso a `opacity: 1` sem limite. Folgado em relação à
 * timeline real (~1.2s no caminho completo), para nunca cortar a coreografia
 * em condições normais.
 */
export const EXIT_FALLBACK_MS = 2000

const SESSION_KEY = "preloader-seen"

/** O sessionStorage rebenta em modo privado nalguns browsers. */
export function hasSeenPreloader(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return false
  }
}

export function markPreloaderSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1")
  } catch {
    // Sem sessionStorage o visitante vê sempre a versão completa. É o
    // comportamento mais seguro dos dois.
  }
}

interface PreloaderState {
  phase: PreloaderPhase
  /** 0..1, sempre de fontes reais de carregamento. Nunca temporizado. */
  progress: number
  /** Progresso reportado de dentro do chunk WebGL. */
  sceneProgress: number
  /** O <Canvas> montou e chegou ao primeiro frame. */
  canvasReady: boolean
  setProgress: (value: number) => void
  setSceneProgress: (value: number) => void
  setCanvasReady: (ready: boolean) => void
  beginExit: () => void
  complete: () => void
  reset: () => void
}

export const usePreloaderStore = create<PreloaderState>((set) => ({
  phase: "loading",
  progress: 0,
  sceneProgress: 0,
  canvasReady: false,

  /**
   * Monotónico e limitado a 1. O progresso real recua quando entram assets
   * novos na fila a meio do carregamento, e uma régua a andar para trás
   * lê-se como bug mesmo quando o número está certo.
   */
  setProgress: (value) =>
    set((state) => ({ progress: Math.max(state.progress, Math.min(1, value)) })),

  setSceneProgress: (value) =>
    set((state) => ({ sceneProgress: Math.max(state.sceneProgress, Math.min(1, value)) })),

  setCanvasReady: (canvasReady) => set({ canvasReady }),

  /** Só sai de `loading` — protege contra o progresso real e o timeout de
   *  segurança dispararem a saída os dois. */
  beginExit: () => set((state) => (state.phase === "loading" ? { phase: "exiting" } : state)),

  complete: () => set({ phase: "done", progress: 1 }),

  reset: () => set({ phase: "loading", progress: 0, sceneProgress: 0 }),
}))
