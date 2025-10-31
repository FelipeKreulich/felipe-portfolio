"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "../contexts/language/LanguageContext"
import { toast } from "sonner"
import { config } from "@/lib/config"
import { useTheme } from "../hooks/use-theme"
import dynamic from "next/dynamic"

const ShapeBlur = dynamic(() => import("@/components/ui/ShapeBlur"), { ssr: false })

export default function Home() {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const { language, setLanguage, t } = useLanguage()

  const sections = ["intro", "about", "work", "projects", "services", "thoughts", "calendar", "coffee", "connect"]

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

  // Carregar script do Calendly
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
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

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="relative flex flex-col gap-4">

          {sections.map((section) => (
            <div key={section} className="relative group">
              <button
                onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
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

      <main className="max-w-4xl mx-auto px-8 lg:px-16">
        <motion.header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el
          }}
          className="min-h-screen flex items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid lg:grid-cols-5 gap-16 w-full">
            <div className="lg:col-span-3 space-y-8">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="text-sm text-muted-foreground font-mono tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {t('portfolio.year')}
                </motion.div>
                <motion.h1
                  className="text-6xl lg:text-7xl font-light tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                >
                  {t('intro.title')}
                  <br />
                  <span className="text-muted-foreground">{t('intro.subtitle')}</span>
                </motion.h1>
              </motion.div>

              <motion.div
                className="space-y-6 max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                <motion.p
                  className="text-xl text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                >
                  {t('intro.description')}
                  <span className="text-foreground font-medium"> {t('intro.design')}</span>,
                  <span className="text-foreground font-medium"> {t('intro.technology')}</span>,
                  {t('intro.and')}
                  <span className="text-foreground font-medium"> {t('intro.human_behavior')}</span>.
                </motion.p>

                <motion.div
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {t('intro.available')}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                  >
                    {t('intro.location')}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="relative"
                  >
                    {/* ShapeBlur Effect - Container com tamanho fixo */}
                    <div className="absolute -inset-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ width: '180px', height: '60px' }}>
                      <ShapeBlur
                        variation={0}
                        pixelRatioProp={typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1}
                        shapeSize={0.8}
                        roundness={0.6}
                        borderSize={0.08}
                        circleSize={0.4}
                        circleEdge={1.0}
                      />
                    </div>

                    <motion.button
                      onClick={handleDownloadCV}
                      className="group relative z-10 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-500 hover:to-blue-500 border border-purple-500/50 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50"
                      title={language === 'pt' ? 'Baixar currículo em português' : 'Download CV in English'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Brilho animado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>

                      <span className="relative text-xs text-white font-medium transition-colors duration-300 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {t('intro.cv_download')}
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">{t('intro.currently')}</div>
                <div className="space-y-2">
                  <div className="text-foreground">{t('intro.role')}</div>
                  <div className="text-muted-foreground">{t('intro.company')}</div>
                  <div className="text-xs text-muted-foreground">{t('intro.period')}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">{t('intro.focus')}</div>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Next.js", "PHP", "Laravel", "MySQL", "Design Systems", "UX/UI", "CyberSecurity"].map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 text-xs border rounded-full transition-all duration-300 ${skill === "CyberSecurity"
                        ? "relative overflow-hidden bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50 hover:border-amber-400 hover:from-amber-500/30 hover:to-yellow-500/30 hover:shadow-lg hover:shadow-amber-500/25 group"
                        : "border border-border hover:border-muted-foreground/50"
                        }`}
                    >
                      {skill === "CyberSecurity" && (
                        <>
                          {/* Borda giratória dourada */}
                          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-[length:200%_200%] group-hover:animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {/* Borda interna para cobrir o centro */}
                          <div className="absolute inset-[2px] rounded-full bg-background"></div>
                          {/* Efeito de brilho pulsante */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/20 via-yellow-300/20 to-amber-300/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
                          {/* Conteúdo do texto */}
                          <span className="relative z-10 text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors duration-300 font-medium">
                            {skill}
                          </span>
                        </>
                      )}
                      {skill !== "CyberSecurity" && skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section
          id="about"
          ref={(el) => {
            sectionsRef.current[1] = el as HTMLElement | null;
          }}
          className="py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-16">
            <motion.h2
              className="text-4xl font-light text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('about.title')}
            </motion.h2>

            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Card Metálico */}
                <div
                  className="relative bg-gradient-to-br from-background via-muted/30 to-background backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl overflow-hidden group/card dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 dark:border-zinc-600/50"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width) * 100
                    const y = ((e.clientY - rect.top) / rect.height) * 100
                    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
                    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--mouse-x', '50%')
                    e.currentTarget.style.setProperty('--mouse-y', '50%')
                  }}
                  style={{
                    '--mouse-x': '50%',
                    '--mouse-y': '50%'
                  } as React.CSSProperties}
                >
                  {/* Gradiente holográfico principal - Apenas no dark mode */}
                  <div className="absolute inset-0 opacity-0 dark:opacity-90 mix-blend-multiply dark:mix-blend-multiply">
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-75"
                      style={{
                        background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y),
                          rgba(220, 160, 225, 0.7) 0%,
                          rgba(30, 210, 220, 0.6) 30%,
                          rgba(60, 230, 65, 0.6) 60%,
                          transparent 80%)`
                      }}
                    />
                  </div>

                  {/* Segunda camada de gradiente - apenas dark mode */}
                  <div className="absolute inset-0 opacity-0 dark:opacity-90 mix-blend-multiply">
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-75"
                      style={{
                        background: `radial-gradient(circle at calc(100% - var(--mouse-x)) calc(100% - var(--mouse-y)),
                          rgba(30, 210, 220, 0.6) 0%,
                          rgba(140, 145, 255, 0.5) 40%,
                          transparent 70%)`
                      }}
                    />
                  </div>

                  {/* Terceira camada - verde - apenas dark mode */}
                  <div className="absolute inset-0 opacity-0 dark:opacity-90 mix-blend-multiply">
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-75"
                      style={{
                        background: `radial-gradient(circle at var(--mouse-x) calc(100% - var(--mouse-y)),
                          rgba(60, 230, 65, 0.6) 0%,
                          rgba(220, 160, 225, 0.5) 30%,
                          transparent 60%)`
                      }}
                    />
                  </div>

                  {/* Efeito sutil para light mode */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-20 dark:opacity-0 transition-opacity duration-300">
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-75"
                      style={{
                        background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y),
                          rgba(139, 92, 246, 0.3) 0%,
                          rgba(59, 130, 246, 0.2) 40%,
                          transparent 70%)`
                      }}
                    />
                  </div>

                  {/* Shimmer effect - ajustado para ambos os modos */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-20 dark:group-hover/card:opacity-25 mix-blend-overlay transition-opacity duration-300">
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-75"
                      style={{
                        background: `linear-gradient(calc(var(--mouse-x) * 2deg),
                          transparent 30%,
                          rgba(255, 255, 255, 0.6) 50%,
                          transparent 70%)`
                      }}
                    />
                  </div>



                  <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                    {/* Foto */}
                    <div className="relative">
                      <div className="relative w-64 h-64 mx-auto lg:mx-0">
                        {/* Efeitos holográficos - mais sutis no light mode */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/15 to-green-500/20 dark:from-purple-500/40 dark:via-cyan-500/30 dark:to-green-500/40 rounded-full blur-2xl transition-all duration-300 mix-blend-screen"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-purple-500/15 dark:from-cyan-500/35 dark:via-transparent dark:to-purple-500/35 rounded-full blur-xl transition-all duration-300 mix-blend-overlay"></div>
                        <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-pink-500/30 rounded-full blur-lg animate-pulse mix-blend-screen"></div>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/eu.png"
                          alt="Felipe Kreulich"
                          className="relative w-full h-full object-cover rounded-full border-4 border-border hover:border-purple-500/50 dark:border-purple-500/30 dark:hover:border-cyan-500/50 transition-all duration-500 shadow-2xl dark:shadow-purple-500/20"
                        />

                        {/* Brilho dinâmico adicional - ajustado para ambos os modos */}
                        <div className="absolute inset-0 rounded-full opacity-30 dark:opacity-70 mix-blend-overlay">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent rounded-full"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-cyan-500/30 to-transparent rounded-full"></div>
                        </div>

                        {/* Ring pulsante ao redor - mais sutil no light mode */}
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 dark:border-purple-500/20 animate-pulse"></div>
                        <div className="absolute inset-[-4px] rounded-full border border-purple-500/5 dark:border-cyan-500/10"></div>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="space-y-6 text-center lg:text-left">
                      <div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {t('about.description')}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground font-mono">{t('about.age')}</div>
                          <div className="text-foreground font-medium">{t('about.age_value')}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground font-mono">Location</div>
                          <div className="text-foreground font-medium">{t('about.location_full')}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground font-mono">{t('about.interests')}</div>
                          <div className="text-foreground font-medium text-sm">{t('about.interests_list')}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground font-mono">{t('about.available_for')}</div>
                          <div className="text-foreground font-medium text-sm">{t('about.available_for_value')}</div>
                        </div>
                      </div>

                      {/* Botão de download do CV */}
                      <div className="pt-4">
                        <button
                          onClick={handleDownloadCV}
                          className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-green-500/10 hover:from-purple-500/20 hover:via-cyan-500/20 hover:to-green-500/20 border border-border/50 hover:border-muted-foreground/50 rounded-lg transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                        >
                          {/* Efeito holográfico no botão */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"></div>
                          <svg
                            className="w-4 h-4 relative z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="relative z-10">{t('intro.cv_download')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="work"
          ref={(el) => {
            sectionsRef.current[2] = el as HTMLElement;
          }}
          className="min-h-screen py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-16">
            <motion.div
              className="flex items-end justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-4xl font-light"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('work.title')}
              </motion.h2>
              <motion.div
                className="text-sm text-muted-foreground font-mono"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('work.period')}
              </motion.div>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  year: "2025",
                  role: t('work.pop.role'),
                  company: t('work.pop.company'),
                  description: t('work.pop.description'),
                  tech: ["PHP", "Laravel", "MySQL", "React", "TypeScript", "Next.js"],
                  gradient: "from-purple-500 to-pink-500",
                  borderColor: "border-purple-500/30 hover:border-purple-500/60"
                },
                {
                  year: "2024",
                  role: t('work.az.role'),
                  company: t('work.az.company'),
                  description: t('work.az.description'),
                  tech: ["NextJS", "MySQL", "React", "Typescript"],
                  gradient: "from-blue-500 to-cyan-500",
                  borderColor: "border-blue-500/30 hover:border-blue-500/60"
                },
                {
                  year: "2023",
                  role: t('work.cstc.role'),
                  company: t('work.cstc.company'),
                  description: t('work.cstc.description'),
                  tech: ["PHP", "Laravel", "MySQL"],
                  gradient: "from-green-500 to-emerald-500",
                  borderColor: "border-green-500/30 hover:border-green-500/60"
                },
                {
                  year: "2021",
                  role: t('work.army.role'),
                  company: t('work.army.company'),
                  description: t('work.army.description'),
                  tech: ["React", "TypeScript", "Next.js"],
                  gradient: "from-orange-500 to-amber-500",
                  borderColor: "border-orange-500/30 hover:border-orange-500/60"
                },
              ].map((job, index) => (
                <motion.div
                  key={index}
                  className={`group relative grid lg:grid-cols-12 gap-8 py-8 border-b ${job.borderColor} transition-all duration-500 rounded-lg px-4 hover:shadow-lg`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Gradiente sutil de fundo no hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${job.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg pointer-events-none`}></div>

                  <div className="lg:col-span-2 relative z-10">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${job.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500`}>
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="projects"
          ref={(el) => {
            sectionsRef.current[3] = el as HTMLElement | null;
          }}
          className="min-h-screen py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-16">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-4xl font-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('projects.title')}
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('projects.description')}
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: t('projects.portfolio.title'),
                  description: t('projects.portfolio.description'),
                  tech: t('projects.portfolio.tech'),
                  link: t('projects.portfolio.link'),
                  color: 'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20',
                  borderColor: 'hover:border-cyan-500/40',
                  shadowColor: 'hover:shadow-cyan-500/20',
                  type: 'no-link'
                },
                {
                  title: t('projects.wormhole.title'),
                  description: t('projects.wormhole.description'),
                  tech: t('projects.wormhole.tech'),
                  link: t('projects.wormhole.link'),
                  color: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20',
                  borderColor: 'hover:border-purple-500/40',
                  shadowColor: 'hover:shadow-purple-500/20',
                  type: 'coming-soon'
                },
                {
                  title: t('projects.blog.title'),
                  description: t('projects.blog.description'),
                  tech: t('projects.blog.tech'),
                  link: t('projects.blog.link'),
                  color: 'from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20',
                  borderColor: 'hover:border-green-500/40',
                  shadowColor: 'hover:shadow-green-500/20',
                  type: 'external',
                  url: 'https://kreulich-blog.vercel.app'
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  className={`group relative bg-gradient-to-br from-background via-background/80 to-muted/20 backdrop-blur-sm border border-border/50 ${project.borderColor} rounded-xl p-6 transition-all duration-500 hover:shadow-2xl ${project.shadowColor} hover:-translate-y-2`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Efeito de brilho no hover - mais intenso */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

                  {/* Brilho adicional animado */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${project.color} opacity-0 group-hover:opacity-70 transition-all duration-700 rounded-xl blur-xl`}></div>

                  <div className="relative z-10 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-foreground group-hover:text-foreground transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs text-muted-foreground font-mono">{t('projects.technologies')}</div>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.split(', ').map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded border border-border/50 group-hover:border-muted-foreground/50 transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Renderização condicional do botão */}
                    {project.type === 'external' && project.url && (
                      <div className="pt-2">
                        <Link
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          <span>{project.link}</span>
                          <svg
                            className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    )}

                    {project.type === 'coming-soon' && (
                      <div className="pt-2">
                        <button
                          onClick={handleReadMore}
                          className="group/btn inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
                        >
                          <span>{project.link}</span>
                          <svg
                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          id="services"
          ref={(el) => {
            sectionsRef.current[7] = el as HTMLElement | null;
          }}
          className="py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-16">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-4xl font-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('services.title')}
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('services.description')}
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  icon: "💻",
                  title: t('services.development.title'),
                  description: t('services.development.description'),
                  features: t('services.development.features').split(', '),
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/10",
                  borderColor: "hover:border-cyan-500/40",
                  iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                },
                {
                  icon: "🎨",
                  title: t('services.design.title'),
                  description: t('services.design.description'),
                  features: t('services.design.features').split(', '),
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-500/10 to-pink-500/10",
                  borderColor: "hover:border-purple-500/40",
                  iconBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                },
                {
                  icon: "🔧",
                  title: t('services.maintenance.title'),
                  description: t('services.maintenance.description'),
                  features: t('services.maintenance.features').split(', '),
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-500/10 to-emerald-500/10",
                  borderColor: "hover:border-green-500/40",
                  iconBg: "bg-gradient-to-br from-green-500/20 to-emerald-500/20"
                },
                {
                  icon: "📱",
                  title: t('services.consulting.title'),
                  description: t('services.consulting.description'),
                  features: t('services.consulting.features').split(', '),
                  gradient: "from-orange-500 to-amber-500",
                  bgGradient: "from-orange-500/10 to-amber-500/10",
                  borderColor: "hover:border-orange-500/40",
                  iconBg: "bg-gradient-to-br from-orange-500/20 to-amber-500/20"
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className={`group relative bg-gradient-to-br from-background via-background/80 to-muted/20 backdrop-blur-sm border border-border/50 ${service.borderColor} rounded-xl p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Efeito de fundo colorido no hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl p-3 rounded-xl ${service.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                      <h3 className={`text-xl font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>{service.title}</h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-2xl font-light">{t('services.contact.title')}</h3>
                <p className="text-muted-foreground">{t('services.contact.description')}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`mailto:${t('connect.email')}?subject=${encodeURIComponent(t('services.contact.quote_subject'))}`}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('services.contact.quote_button')}
                </Link>

                <Link
                  href={`mailto:${t('connect.email')}?subject=${encodeURIComponent(t('services.contact.question_subject'))}`}
                  className="group inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-muted-foreground/50 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('services.contact.question_button')}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
        <motion.section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[4] = el as HTMLElement | null;
          }}
          className="min-h-screen py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-16">
            {/* Hero Section do Blog */}
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12 lg:p-16 overflow-hidden group">
                {/* Efeitos de fundo animados */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 text-center space-y-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    {t('blog.badge')}
                  </motion.div>

                  <motion.h2
                    className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    {t('blog.title')}
                  </motion.h2>

                  <motion.p
                    className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {t('blog.description')}
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    <Link
                      href="https://kreulich-blog.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                    >
                      <span className="relative z-10">{t('blog.cta')}</span>
                      <svg
                        className="w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 blur transition-opacity duration-300"></div>
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      <span>{t('blog.subtitle')}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Cards de Categorias/Tópicos */}
            <motion.div
              className="grid lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {[
                {
                  icon: "💻",
                  title: t('blog.topic1.title'),
                  description: t('blog.topic1.description'),
                  color: "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-500/30"
                },
                {
                  icon: "🚀",
                  title: t('blog.topic2.title'),
                  description: t('blog.topic2.description'),
                  color: "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30"
                },
                {
                  icon: "🧠",
                  title: t('blog.topic3.title'),
                  description: t('blog.topic3.description'),
                  color: "from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500/30"
                }
              ].map((topic, index) => (
                <motion.div
                  key={index}
                  className={`group relative bg-gradient-to-br ${topic.color} backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="space-y-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <h3 className="text-xl font-semibold text-foreground">{topic.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{topic.description}</p>
                  </div>

                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500 pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action Final */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="text-muted-foreground text-lg mb-6">
                {t('blog.footer_text')}
              </p>
              <Link
                href="https://kreulich-blog.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
              >
                <span className="text-sm font-medium">{t('blog.footer_cta')}</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="calendar"
          ref={(el) => {
            sectionsRef.current[5] = el as HTMLElement | null;
          }}
          className="py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-16">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-4xl font-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('calendar.title')}
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('calendar.description')}
              </motion.p>
            </motion.div>

            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-background via-background/80 to-muted/20 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/felipe-kreulich/30min"
                  style={{ minWidth: '320px', height: '500px' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Buy Me a Coffee Section */}
        <motion.section
          id="coffee"
          ref={(el) => {
            sectionsRef.current[7] = el as HTMLElement | null;
          }}
          className="py-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background com gradiente de café */}
              <div className="relative bg-gradient-to-br from-amber-900/40 via-orange-900/40 to-yellow-900/40 dark:from-amber-900/60 dark:via-orange-900/60 dark:to-yellow-900/60 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-12 lg:p-16 overflow-hidden group">
                {/* Efeitos de fundo animados - tema café */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center space-y-6 mb-12">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm text-amber-300"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <span className="text-2xl animate-bounce">☕</span>
                      {t('coffee.badge')}
                    </motion.div>

                    <motion.h2
                      className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {t('coffee.title')}
                    </motion.h2>

                    <motion.p
                      className="text-xl text-amber-100 dark:text-amber-200 max-w-3xl mx-auto leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      {t('coffee.description')}
                    </motion.p>
                  </div>

                  {/* Features Grid */}
                  <motion.div
                    className="grid md:grid-cols-3 gap-6 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    {[
                      { icon: "💻", text: t('coffee.feature1'), color: "from-amber-500 to-orange-500" },
                      { icon: "🚀", text: t('coffee.feature2'), color: "from-orange-500 to-yellow-500" },
                      { icon: "🤝", text: t('coffee.feature3'), color: "from-yellow-500 to-amber-500" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="group/feature relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-center space-y-3">
                          <div className="text-4xl transform group-hover/feature:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                          <p className={`text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                            {feature.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    <Link
                      href="https://buymeacoffee.com/felipekreulich"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 text-lg"
                    >
                      {/* Efeito de brilho */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 blur transition-opacity duration-300"></div>

                      <span className="relative z-10 text-2xl">☕</span>
                      <span className="relative z-10">{t('coffee.cta')}</span>
                      <svg
                        className="w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>

                    <motion.p
                      className="mt-6 text-sm text-amber-300 dark:text-amber-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                    >
                      {t('coffee.thanks')}
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="connect"
          ref={(el) => {
            sectionsRef.current[8] = el as HTMLElement | null;
          }}
          className="py-32 opacity-0"
        >
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-light">{t('connect.title')}</h2>

              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('connect.description')}
                </p>

                <div className="space-y-4">
                  <Link
                    href={`mailto:${t('connect.email')}`}
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-lg">{t('connect.email')}</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-sm text-muted-foreground font-mono">{t('connect.elsewhere')}</div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "GitHub", handle: "@FelipeKreulich", url: "https://github.com/FelipeKreulich", gradient: "from-gray-400 to-gray-600", borderColor: "hover:border-gray-500/40" },
                  { name: "Twitter", handle: "@FelipeKreulich", url: "https://x.com/FelipeKreulich", gradient: "from-blue-400 to-cyan-400", borderColor: "hover:border-blue-500/40" },
                  { name: "LinkedIn", handle: "felipe-kreulich", url: "https://www.linkedin.com/in/felipe-kreulich/", gradient: "from-blue-500 to-blue-700", borderColor: "hover:border-blue-600/40" },
                  { name: "Instagram", handle: "@kreulich.dev", url: "https://www.instagram.com/kreulich.dev/", gradient: "from-purple-400 via-pink-500 to-orange-400", borderColor: "hover:border-pink-500/40" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className={`group relative p-4 border border-border ${social.borderColor} rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden`}
                  >
                    {/* Efeito de fundo colorido no hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                    <div className="relative z-10 space-y-2">
                      <div className={`font-medium bg-gradient-to-r ${social.gradient} bg-clip-text text-transparent`}>
                        {social.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <footer className="py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{t('footer.copyright')}</div>
              <div className="text-xs text-muted-foreground">{t('footer.built_with')}</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300 flex items-center gap-2"
                aria-label={language === 'en' ? 'Mudar idioma para Português de Portugal' : 'Change language to English'}
                onClick={toggleLanguage}
              >
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {language === 'en' ? 'PT-PT' : 'EN'}
                </span>
              </button>

              <Link href={config.blog.url} target="_blank">
                <button className="group relative p-2 px-3 rounded-lg border border-purple-500/30 hover:border-purple-400/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-xs text-purple-400 group-hover:text-purple-300 transition-colors duration-300 font-medium">{t('footer.blog')}</span>
                </button>
              </Link>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
