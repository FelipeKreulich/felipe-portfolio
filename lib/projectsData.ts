/**
 * Índice de projetos.
 *
 * Desenhado a pensar nas páginas de caso desde já: o que o índice mostra é um
 * subconjunto do que aqui está. Acrescentar um projeto é acrescentar uma
 * entrada a este ficheiro e as chaves ao dicionário — nunca mexer em
 * componentes.
 *
 * O "Website Portfolio" saiu: é este site, e quem está a ler já o está a ver.
 */

/** Telemetria, na mesma linguagem do dossier da About. */
export type ProjectStatus = "live" | "archived" | "private"

export interface ProjectImage {
  src: string
  /** Declaradas para o `next/image` reservar o espaço e não haver CLS. */
  width: number
  height: number
  /** Chave do dicionário. O alt nunca é hardcoded. */
  altKey: string
}

export interface Project {
  /** Segmento da rota: /pt/projetos/<slug> e /en/projetos/<slug>. */
  slug: string
  /**
   * Índice escrito, não derivado da posição. Reordenar a lista não deve
   * renumerar projetos que já foram partilhados com o número antigo.
   */
  index: string
  /** Nome próprio — não passa pelo dicionário. */
  name: string
  status: ProjectStatus
  year: string

  /** Chave da linha única do índice. */
  summaryKey: string
  /**
   * A frase de consequência: o que o projeto resolveu, não o que é.
   * TODO: à espera do conteúdo. Sem inventar.
   */
  outcomeKey: string
  /** Um número, quando existe de facto. Ausente é melhor do que inventado. */
  metricKey?: string

  /** No máximo 3 — o resto é ruído e a faixa da secção anterior já o cobre. */
  stack: string[]
  /** A stack completa, para a página de caso. */
  stackFull: string[]

  preview: ProjectImage
  /** Capturas adicionais da página de caso. */
  shots: ProjectImage[]

  links: { live?: string; repo?: string }
}

export const projects: Project[] = [
  {
    slug: "ciphermesh",
    index: "01",
    name: "CipherMesh",
    /*
      Estava aqui como "archived" com Curve25519 e XSalsa20-Poly1305. Ambas
      as coisas estavam desactualizadas: o site e o npm dão v2.14.1 publicada,
      MIT, e a criptografia passou a X25519 + ML-KEM-768 — troca de chaves
      pós-quântica. Verificado com `npm view ciphermesh`.
    */
    status: "live",
    year: "2024",
    summaryKey: "projects.ciphermesh.summary",
    outcomeKey: "projects.ciphermesh.outcome",
    metricKey: "projects.ciphermesh.metric",
    stack: ["X25519", "ML-KEM-768", "Terminal UI"],
    stackFull: [
      "X25519",
      "ML-KEM-768",
      "Sealed sender",
      "Sealed sender padding",
      "WebSocket",
      "mDNS",
      "Terminal UI",
      "Docker",
    ],
    preview: {
      src: "/ciphermesh-image.png",
      width: 1919,
      height: 963,
      altKey: "projects.ciphermesh.alt",
    },
    shots: [],
    links: {
      live: "https://ciphermesh.de",
      repo: "https://github.com/FelipeKreulich/secret-chat-lan",
    },
  },
  {
    slug: "worm-hole",
    index: "02",
    name: "Worm Hole",
    status: "live",
    year: "2024",
    summaryKey: "projects.wormhole.summary",
    outcomeKey: "projects.wormhole.outcome",
    metricKey: "projects.wormhole.metric",
    stack: ["Next.js", "Prisma", "NeonDB"],
    stackFull: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "NeonDB", "Vercel"],
    preview: {
      src: "/worm-image.png",
      width: 1918,
      height: 964,
      altKey: "projects.wormhole.alt",
    },
    shots: [],
    links: { live: "https://worm-hole.vercel.app" },
  },
  {
    slug: "blog",
    index: "03",
    name: "Blog Pessoal",
    status: "live",
    year: "2023",
    summaryKey: "projects.blog.summary",
    outcomeKey: "projects.blog.outcome",
    stack: ["React", "Prisma", "PostgreSQL"],
    stackFull: ["React", "TypeScript", "Prisma", "PostgreSQL"],
    preview: {
      src: "/blog-image.png",
      width: 1914,
      height: 962,
      altKey: "projects.blog.alt",
    },
    shots: [],
    links: { live: "https://kreulich-blog.vercel.app" },
  },
]

/** As etiquetas de estado, em mono e minúsculas, vêm do dicionário. */
export const statusKey: Record<ProjectStatus, string> = {
  live: "projects.status.live",
  archived: "projects.status.archived",
  private: "projects.status.private",
}
