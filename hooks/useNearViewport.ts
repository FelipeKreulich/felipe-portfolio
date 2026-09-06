"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * `true` a partir do momento em que o elemento se aproxima do ecrã, e nunca
 * mais volta a `false`.
 *
 * Existe por causa de um mal-entendido caro sobre o `next/dynamic`: ele adia o
 * *código*, não a montagem. Assim que o chunk chega, o componente monta — mesmo
 * que a secção dele esteja três ecrãs abaixo. Com o olho, isso significava
 * um contexto WebGL de ecrã inteiro a desenhar enquanto o preloader ainda
 * estava por cima, a competir com ele pela GPU e pelo thread principal.
 *
 * Não desmonta ao sair de vista, de propósito: recriar um contexto WebGL é
 * caro e pisca. Quem poupa ciclos com a secção fora do ecrã são os próprios
 * componentes, que pausam o seu loop.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = "300px"): boolean {
  const [perto, setPerto] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || perto) return

    // Sem IntersectionObserver (browser antigo), monta na mesma: o site
    // funcionar vale mais do que a poupança. Adiado por um tick e não
    // chamado aqui de forma síncrona — um setState no corpo do efeito
    // encadeia renders, e neste caso não há razão nenhuma para o fazer.
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setPerto(true), 0)
      return () => clearTimeout(id)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPerto(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, perto])

  return perto
}
