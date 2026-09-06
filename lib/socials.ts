/**
 * As ligações do contacto.
 *
 * Sem cores de marca e sem logótipos. Quatro identidades visuais alheias no
 * mesmo bloco desfaziam a do site — e ainda por cima no fim. A lista é
 * tipográfica: plataforma em mono, handle ao lado.
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
  {
    plataforma: "Blog",
    handle: "kreulich-blog",
    url: "https://kreulich-blog.vercel.app",
    nome: "Blog, kreulich-blog.vercel.app",
  },
  {
    plataforma: "Buy me a coffee",
    handle: "felipekreulich",
    url: "https://buymeacoffee.com/felipekreulich",
    nome: "Buy me a coffee, felipekreulich",
  },
]
