"use client"

import { useEffect, useState } from "react"

/**
 * Lê a classe `.dark` do <html>.
 *
 * Só lê — quem escreve é o `hooks/use-theme.ts`. Ter dois donos do tema daria
 * estados divergentes, e o que interessa aqui é reagir, não decidir.
 */
export function useThemeMode(): boolean {
  // O ThemeScript corre síncrono no <head>, portanto a classe já está no DOM
  // antes do primeiro paint. O site arranca escuro por omissão.
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const read = () => setIsDark(document.documentElement.classList.contains("dark"))
    read()

    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return isDark
}
