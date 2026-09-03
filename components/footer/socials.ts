/**
 * As ligações do rodapé.
 *
 * Sem cores de marca. Quatro paletas alheias no mesmo bloco desfaziam a
 * identidade que o site inteiro construiu — e ainda por cima no fim. Todas
 * entram na paleta do site, com o acento reservado ao hover.
 */
export interface Social {
  /** Escrito em maiúsculas no mono da esquerda. */
  plataforma: string
  handle: string
  url: string
  /** Nome acessível: lido por inteiro pelo leitor de ecrã. */
  nome: string
}

export const socials: Social[] = [
  {
    plataforma: "GitHub",
    handle: "@FelipeKreulich",
    url: "https://github.com/FelipeKreulich",
    nome: "GitHub, @FelipeKreulich",
  },
  {
    plataforma: "LinkedIn",
    handle: "felipe-kreulich",
    url: "https://www.linkedin.com/in/felipe-kreulich/",
    nome: "LinkedIn, felipe-kreulich",
  },
  {
    plataforma: "X",
    handle: "@FelipeKreulich",
    url: "https://x.com/FelipeKreulich",
    nome: "X, @FelipeKreulich",
  },
  {
    plataforma: "Instagram",
    handle: "@kreulich.dev",
    url: "https://www.instagram.com/kreulich.dev/",
    nome: "Instagram, @kreulich.dev",
  },
]
