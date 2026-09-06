import Hero from "@/components/sections/Hero"
import Projects from "@/components/sections/Projects"
import Contact from "@/components/sections/Contact"

/**
 * Três secções e mais nada.
 *
 * Sem navegação lateral e sem observer de secção ativa: com três ecrãs, o
 * scroll é a navegação. A página deixou de ser componente de cliente — as
 * secções trazem o seu próprio "use client".
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <Contact />
    </main>
  )
}
