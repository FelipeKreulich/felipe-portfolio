"use client"

import { useEffect } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

/**
 * Cor da grelha por secção.
 *
 * Uma secção declara a sua paleta em `data-grid-color` / `data-grid-accent` e
 * um ScrollTrigger interpola as variáveis do <html> à entrada e à saída. A
 * grelha lê-as uma vez por frame — mudar a paleta de uma secção passa a ser
 * um atributo, não código.
 *
 * Ainda não há consumidores: entra em serviço quando a About declarar a sua.
 */
export default function SectionGridColors() {
  useEffect(() => {
    const root = document.documentElement
    let triggers: ScrollTrigger[] = []

    /**
     * O tween escreve as variáveis inline no <html>, o que passa à frente das
     * definições de `:root` e `.dark`. Limpar é o que devolve o controlo ao
     * tema.
     */
    const clearInline = () => {
      gsap.killTweensOf(root)
      root.style.removeProperty("--bg-grid")
      root.style.removeProperty("--bg-accent")
    }

    const build = () => {
      triggers.forEach((trigger) => trigger.kill())
      clearInline()

      // Lido depois de limpar, portanto é sempre o valor do tema actual.
      const style = getComputedStyle(root)
      const base = {
        grid: style.getPropertyValue("--bg-grid").trim(),
        accent: style.getPropertyValue("--bg-accent").trim(),
      }

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-grid-color], [data-grid-accent]"),
      )

      triggers = sections.map((section) => {
        const to = (grid: string, accent: string) =>
          gsap.to(root, {
            "--bg-grid": grid,
            "--bg-accent": accent,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          })

        const enter = () =>
          to(section.dataset.gridColor || base.grid, section.dataset.gridAccent || base.accent)
        const leave = () => to(base.grid, base.accent)

        return ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: enter,
          onEnterBack: enter,
          onLeave: leave,
          onLeaveBack: leave,
        })
      })
    }

    build()

    // Trocar de tema muda a base; os triggers têm de ser reconstruídos com os
    // valores novos, senão a saída de uma secção repunha a cor do tema antigo.
    const observer = new MutationObserver(build)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => {
      observer.disconnect()
      triggers.forEach((trigger) => trigger.kill())
      clearInline()
    }
  }, [])

  return null
}
