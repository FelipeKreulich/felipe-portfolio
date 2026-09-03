import {
  SPARK_JITTER,
  SPARK_LIFE,
  SPARK_MAX,
  SPARK_MIN,
  SPARK_REACH_MAX,
  SPARK_REACH_MIN,
} from "@/lib/gridConfig"

export interface Spark {
  x: number
  y: number
  angle: number
  reach: number
  born: number
}

/**
 * Fila de partículas partilhada.
 *
 * O emissor (um clique em qualquer lado) escreve aqui; o `GridBackground`
 * consome no ticker que já corre. É este objeto que evita um segundo canvas e
 * um segundo requestAnimationFrame — o componente do React Bits criava ambos.
 */
export const sparks: Spark[] = []

/** Momento do último clique, para o flash cromático. `0` = nenhum pendente. */
export const flash = { at: 0 }

export function emitSpark(x: number, y: number) {
  const count = SPARK_MIN + Math.floor(Math.random() * (SPARK_MAX - SPARK_MIN + 1))
  const now = performance.now()
  const step = (Math.PI * 2) / count

  for (let i = 0; i < count; i++) {
    sparks.push({
      x,
      y,
      // Distribuídos, mas com jitter: uma estrela perfeitamente regular
      // lê-se como ícone, não como impacto.
      angle: i * step + (Math.random() - 0.5) * SPARK_JITTER,
      reach: SPARK_REACH_MIN + Math.random() * (SPARK_REACH_MAX - SPARK_REACH_MIN),
      born: now,
    })
  }

  flash.at = now
}

/** Remove as que já morreram. Devolve quantas ficaram vivas. */
export function pruneSparks(now: number): number {
  for (let i = sparks.length - 1; i >= 0; i--) {
    if (now - sparks[i].born >= SPARK_LIFE) sparks.splice(i, 1)
  }
  return sparks.length
}
