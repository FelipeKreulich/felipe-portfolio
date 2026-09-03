"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { lenisBus } from "@/lib/lenisBus"
import { LENIS_LERP, TOUCH_MULTIPLIER } from "@/lib/scrollConfig"
import "lenis/dist/lenis.css"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { usePreloaderStore } from "@/store/usePreloaderStore"

/**
 * Wiring Lenis <-> ScrollTrigger.
 *
 * O Lenis interpola a posição de scroll fora da timeline nativa do browser.
 * Sem os dois fios abaixo, o ScrollTrigger continua a ler a posição real e
 * dispara os triggers nas coordenadas erradas, com o pinning sempre um frame
 * atrás do conteúdo.
 */
export default function SmoothScroll() {
  const { reducedMotion, resolved } = useMotionPrefs()
  const phase = usePreloaderStore((state) => state.phase)

  /*
    O browser restaura a posição de scroll antes de o Lenis existir, e
    vê-se o salto. Restaurar é connosco.
  */
  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  useEffect(() => {
    if (!resolved) return

    /*
      Com movimento reduzido o Lenis não é configurado com duração zero — não
      chega a existir. O scroll é o nativo do browser, e o ScrollTrigger
      passa a ler o evento de scroll nativo, que é o comportamento dele por
      omissão. Nada aqui fica pendurado à espera de uma instância.
    */
    if (reducedMotion) {
      ScrollTrigger.config({ ignoreMobileResize: true })
      return
    }
    // Só depois do preloader: durante ele o scroll está travado, e montar o
    // Lenis por baixo de um body com overflow hidden deixa-o a medir alturas
    // erradas.
    if (phase !== "done") return

    /*
      `lerp` e não `duration` + `easing`.

      São dois modelos alternativos, não duas afinações do mesmo. O
      `duration: 1.1` com cauda exponencial era agradável com a página
      parada e pesado a usar: cada gesto novo tinha de esperar que o
      anterior terminasse a cauda. O `lerp` persegue o alvo e aceita o gesto
      seguinte de imediato.

      `syncTouch` fica no default (`false`): em toque manda o momentum
      nativo do sistema, que é melhor do que qualquer emulação.
    */
    const lenis = new Lenis({
      lerp: LENIS_LERP,
      touchMultiplier: TOUCH_MULTIPLIER,
    })

    // Publicado para quem precisa de travar o scroll (o modal de agenda).
    lenisBus.instance = lenis

    // Fio 1: o ScrollTrigger recalcula sempre que o Lenis mexe.
    lenis.on("scroll", ScrollTrigger.update)

    // Fio 2: um único rAF a conduzir os dois. O Lenis pede milissegundos, o
    // ticker do GSAP entrega segundos.
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)

    // O lag smoothing salta frames para recuperar de engasgos, o que faz a
    // posição interpolada do Lenis divergir do scroll real — e é o que dá o
    // salto ao voltar de um separador inativo.
    gsap.ticker.lagSmoothing(0)

    /*
      Em telemóvel, a barra de endereço a aparecer e a desaparecer conta
      como resize. Sem isto, cada uma dessas dispara um `refresh` e vê-se a
      página a saltar a meio do scroll.
    */
    ScrollTrigger.config({ ignoreMobileResize: true })

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenisBus.instance = null
      lenis.destroy()
    }
  }, [reducedMotion, resolved, phase])

  return null
}
