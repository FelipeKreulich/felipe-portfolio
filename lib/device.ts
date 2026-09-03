/**
 * Deteção de capacidade do dispositivo.
 *
 * Tudo aqui toca em APIs do browser, por isso nada deve correr durante o
 * render do servidor — chama sempre a partir de um efeito, ou de um
 * `useSyncExternalStore` com um snapshot de servidor estável.
 */

/** Cria um contexto WebGL descartável só para saber se existe. */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false

  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")

    if (!gl) return false

    // O contexto de teste conta para o limite do browser (~16 por página).
    // Libertá-lo explicitamente evita ficar sem contextos para a cena real.
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")
    lose?.loseContext()

    return true
  } catch {
    return false
  }
}

/**
 * Heurística de dispositivo fraco. `hardwareConcurrency` é grosseiro mas é o
 * único sinal barato e síncrono que existe — `deviceMemory` não está no Safari.
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return true

  const cores = navigator.hardwareConcurrency ?? 4
  if (cores <= 4) return true

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof memory === "number" && memory <= 4) return true

  return false
}

/** O Canvas só monta se houver WebGL e músculo para o mexer. */
export function canRenderCanvas(): boolean {
  return hasWebGL() && !isLowPowerDevice()
}
