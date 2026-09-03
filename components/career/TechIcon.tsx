import {
  siPhp,
  siLaravel,
  siNextdotjs,
  siMysql,
  siSwift,
  siKotlin,
  siReact,
  siTypescript,
} from "simple-icons"
import { Cloud, Infinity as InfinityIcon, Network, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

/*
  Oito das doze entradas são marcas e têm logótipo oficial — vêm do
  simple-icons (CC0-1.0), fixo na 16.29.0, com o `path` lido directamente para
  não carregar o pacote inteiro.

  As outras quatro — DevOps, Cloud, Networking, CyberSecurity — são práticas,
  não produtos. Não existe logótipo para elas, por isso usam o lucide-react,
  que já cá estava. Inventar uma marca para um conceito seria pior do que não
  ter ícone nenhum.
*/
const marcas: Record<string, string> = {
  PHP: siPhp.path,
  Laravel: siLaravel.path,
  "Next.js": siNextdotjs.path,
  MySQL: siMysql.path,
  Swift: siSwift.path,
  Kotlin: siKotlin.path,
  React: siReact.path,
  TypeScript: siTypescript.path,
}

const conceitos: Record<string, LucideIcon> = {
  DevOps: InfinityIcon,
  Cloud: Cloud,
  Networking: Network,
  CyberSecurity: ShieldCheck,
}

/**
 * Ícone de uma tecnologia. Herda `currentColor`, portanto acende-se com o
 * texto quando a entrada correspondente do percurso recebe o cursor.
 *
 * Decorativo: o nome está sempre escrito ao lado.
 */
export default function TechIcon({ tech, className = "" }: { tech: string; className?: string }) {
  const path = marcas[tech]
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        focusable="false"
        className={`size-[1.05em] shrink-0 ${className}`}
      >
        <path d={path} />
      </svg>
    )
  }

  const Conceito = conceitos[tech]
  if (!Conceito) return null
  return <Conceito aria-hidden focusable="false" strokeWidth={1.5} className={`size-[1.05em] shrink-0 ${className}`} />
}
