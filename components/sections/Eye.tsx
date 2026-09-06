"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import { useNearViewport } from "@/hooks/useNearViewport"

/**
 * Secção puramente decorativa: só o olho, sem texto nenhum. `aria-hidden` na
 * secção inteira, porque uma secção sem conteúdo que ainda assim se anuncia
 * a um leitor de ecrã é ruído para quem navega por teclado ou leitor.
 *
 * Lazy com `ssr: false`: é WebGL,
 * não existe no servidor, e não deve pesar no primeiro carregamento.
 */
const EvilEye = dynamic(() => import("@/components/visual/EvilEye"), {
  ssr: false,
  loading: () => null,
})

export default function Eye() {
  const seccaoRef = useRef<HTMLElement>(null)
  const perto = useNearViewport(seccaoRef)

  return (
    <section ref={seccaoRef}
      id="eye" aria-hidden className="h-svh w-full bg-ink">
      {/* Única exceção à regra de "sem cor" do site: o utilizador pediu
          explicitamente o azul dos olhos do Gojo (Jujutsu Kaisen), à mão e
          não amostrado do avatar — os azuis daquela imagem são
          cinza-azulados dessaturados, sem nada do ciano luminoso pedido.
          `intensity` abaixo do valor por omissão (1.5) e não a cor
          escurecida: o centro do olho satura para branco de qualquer
          maneira, e é nas bordas da íris que o azul se lê. O componente
          recebe a tinta em hex e não via a variável CSS — o valor entra num
          uniform do shader, não numa propriedade de estilo. */}
      {perto && <EvilEye eyeColor="#6EC8F5" intensity={0.9} backgroundColor="#0a0a0a" />}
    </section>
  )
}
