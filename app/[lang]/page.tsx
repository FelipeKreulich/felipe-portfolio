"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { toast } from "sonner"
import { config } from "@/lib/config"
import { useTheme } from "@/hooks/use-theme"
import Hero from "@/components/hero/Hero"
import About from "@/components/about/About"
import Manifesto from "@/components/manifesto/Manifesto"
import Career from "@/components/career/Career"
import Transition from "@/components/transition/Transition"
import Projects from "@/components/projects/Projects"
import Pulse from "@/components/pulse/Pulse"
import Schedule from "@/components/schedule/Schedule"
import { lenisBus } from "@/lib/lenisBus"


export default function Home() {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const { language, setLanguage, t } = useLanguage()

  // A ordem aqui é a ordem dos pontos na navegação: segue a ordem da página.
  // "connect" saiu: passou a ser rodapé, montado no layout.
  const sections = ["intro", "about", "manifesto", "work", "transition", "projects", "pulse", "calendar"]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])




  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en')
  }

  const handleReadMore = () => {
    toast(t('thoughts.feature_coming_soon'))
  }

  const handleDownloadCV = () => {
    const filename = language === 'pt' ? 'curriculo.pdf' : 'curriculoenglish.pdf'
    const link = document.createElement('a')
    link.href = `/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Sem `bg-background` na div raiz: o fundo opaco vinha por cima do <Canvas>
  // fixo e tapava-o por completo. O `body` já pinta a mesma cor no globals.css,
  // por isso a única diferença é o plano de dissolve passar a ver-se por baixo
  // do conteúdo.
  return (
    <div className="min-h-screen text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="relative flex flex-col gap-4">

          {sections.map((section) => (
            <div key={section} className="relative group">
              <button
                onClick={() => {
                  const alvo = document.getElementById(section)
                  if (!alvo) return
                  /*
                    Pelo Lenis, não por `scrollIntoView`.

                    Um único salto nativo no meio de tudo o resto suave
                    denuncia-se logo — e estes são os nove pontos que se usam
                    para saltar entre secções, ou seja onde mais se nota. Sem
                    Lenis (movimento reduzido), o nativo é o correcto.
                  */
                  const lenis = lenisBus.instance
                  if (lenis) lenis.scrollTo(alvo, { duration: 1.2 })
                  else alvo.scrollIntoView({ behavior: "auto" })
                }}
                className={`relative w-2 h-8 rounded-full transition-all duration-700 ${activeSection === section
                  ? "bg-foreground shadow-lg shadow-white/20"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:shadow-md hover:shadow-white/10"
                  }`}
                aria-label={`Navigate to ${t(`nav.${section}`)}`}
              />

              {/* Tooltip */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg">
                  <span className="text-xs text-foreground font-medium whitespace-nowrap">
                    {t(`nav.${section}`)}
                  </span>
                  {/* Seta do tooltip */}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-background/90 border-l border-b border-border/50 transform rotate-45"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <Hero
        ref={(el) => {
          sectionsRef.current[0] = el
        }}
      />

      {/* Fora do <main>: a About controla a sua própria largura. */}
      <About
        ref={(el) => {
          sectionsRef.current[1] = el as HTMLElement | null;
        }}
      />

      {/* Fora do <main>: ecrã cheio, como a hero. */}
      <Manifesto
        ref={(el) => {
          sectionsRef.current[9] = el as HTMLElement | null;
        }}
      />

      {/* Fora do <main>: usa o contentor das secções redesenhadas. */}
      <Career
        ref={(el) => {
          sectionsRef.current[2] = el as HTMLElement | null;
        }}
      />

      {/* Transição: muda o ritmo entre o Percurso e o que vem a seguir. */}
      <Transition
        ref={(el) => {
          sectionsRef.current[10] = el as HTMLElement | null;
        }}
      />

      <Projects
        ref={(el) => {
          sectionsRef.current[3] = el as HTMLElement | null;
        }}
      />

      <Pulse
        ref={(el) => {
          sectionsRef.current[11] = el as HTMLElement | null;
        }}
      />

      <Schedule
        ref={(el) => {
          sectionsRef.current[5] = el as HTMLElement | null;
        }}
      />

      {/*
        O `<main>` ficou vazio: todas as secções que vivam nele foram
        substituídas por componentes de largura própria. O gradiente fixo do
        fundo saiu com ele — o dissolve de fecho faz agora esse trabalho, e
        os dois sobrepostos escureciam o rodapé a dobrar.
      */}
    </div>
  )
}
