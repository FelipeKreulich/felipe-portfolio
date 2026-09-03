/**
 * As entradas do percurso, por ordem cronológica inversa.
 *
 * O texto vive no i18n; aqui ficam só os dados que não se traduzem: o ano, as
 * chaves e as tecnologias.
 */
export interface CareerEntry {
  /** Sufixo das chaves `work.<id>.role` / `.company` / `.description`. */
  id: "pop" | "az" | "cstc" | "army"
  year: string
  /**
   * Tecnologias pelas quais foi responsável.
   */
  stack: string[]
  /**
   * Tecnologias do ambiente, usadas à volta da função sem responsabilidade
   * direta. Separadas de propósito: misturá-las com a stack fazia a lista
   * prometer profundidade que não houve, e era isso que tornava a entrada de
   * Analista de Suporte incoerente com a própria descrição.
   */
  context: string[]
}

export const career: CareerEntry[] = [
  {
    id: "pop",
    year: "2025",
    // Swift e Kotlin em vez de só SwiftUI: o trabalho cobre iOS e Android.
    stack: ["PHP", "Laravel", "Next.js", "MySQL", "Swift", "Kotlin", "DevOps", "Cloud"],
    context: [],
  },
  {
    id: "az",
    year: "2024",
    /*
      Estas passaram de `context` para `stack`.

      A classificação anterior vinha da resposta de que eram "ferramentas de
      contexto", mas a descrição que se seguiu diz outra coisa: a ferramenta
      interna de suporte foi desenvolvida por ele. Quem constrói é responsável
      — mesmo que o cargo se chame Analista de Suporte.
    */
    stack: ["Next.js", "React", "TypeScript", "MySQL"],
    context: [],
  },
  {
    id: "cstc",
    year: "2024",
    stack: ["PHP", "Laravel", "MySQL"],
    context: [],
  },
  {
    id: "army",
    year: "2021",
    stack: ["React", "TypeScript", "Next.js", "Networking", "CyberSecurity"],
    context: [],
  },
]

/** Todas as tecnologias do percurso, sem repetições — alimenta a faixa. */
export const allTechnologies = Array.from(
  new Set(career.flatMap((entry) => [...entry.stack, ...entry.context])),
)
