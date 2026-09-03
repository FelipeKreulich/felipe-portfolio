import type { ReactNode } from "react"

/**
 * Tecla, para as dicas de teclado.
 *
 * Hairline e mono, na mesma linguagem das esquadrias e do dossier — não é o
 * `<kbd>` cinzento com relevo dos temas por omissão.
 */
export default function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className="inline-flex min-w-[1.6em] items-center justify-center rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] leading-none"
      style={{
        border: "1px solid color-mix(in oklab, currentColor 28%, transparent)",
        color: "inherit",
      }}
    >
      {children}
    </kbd>
  )
}
