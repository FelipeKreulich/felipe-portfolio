import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Projects from "@/components/sections/Projects"
import Contact from "@/components/sections/Contact"
import Eye from "@/components/sections/Eye"
import Footer from "@/components/sections/Footer"

/**
 * Seis secções: três em papel, três em tinta. A viragem acontece no
 * contacto — o site começa de dia e acaba de noite.
 *
 * Sem navegação lateral e sem observer de secção ativa: o scroll é a
 * navegação. A página deixou de ser componente de cliente — as secções
 * trazem o seu próprio "use client".
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Eye />
      <Footer />
    </main>
  )
}
