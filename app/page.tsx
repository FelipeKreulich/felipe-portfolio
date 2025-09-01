"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useLanguage } from "../contexts/language/LanguageContext"
import { toast } from "sonner"
import { config } from "@/lib/config"
import { useTheme } from "../hooks/use-theme"

export default function Home() {
  const { isDark, toggleTheme, isLoaded } = useTheme()
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const { language, setLanguage, t } = useLanguage()

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

  const getActiveSectionPosition = () => {
    if (!activeSection) return 0

    const sections = ["intro", "about", "work", "projects", "thoughts", "connect"]
    const activeIndex = sections.indexOf(activeSection)
    return activeIndex * 48
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="relative flex flex-col gap-4">
          {/* Indicador de seção ativa com blur branco */}
          <div
            className="absolute left-0 w-2 h-8 bg-gradient-to-b from-white/30 via-white/20 to-white/10 backdrop-blur-md rounded-full transition-all duration-1200 ease-out shadow-lg shadow-white/20"
            style={{
              transform: `translateY(${getActiveSectionPosition()}px)`,
              opacity: activeSection ? 1 : 0,
              transitionDelay: '100ms'
            }}
          />

          {["intro", "about", "work", "projects", "thoughts", "connect"].map((section, index) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`relative w-2 h-8 rounded-full transition-all duration-700 ${activeSection === section
                  ? "bg-foreground shadow-lg shadow-white/20"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:shadow-md hover:shadow-white/10"
                }`}
              aria-label={`Navigate to ${t(`nav.${section}`)}`}
            />
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
                  <span className="text-foreground"> {t('intro.design')}</span>,<span className="text-foreground"> {t('intro.technology')}</span>,
                  {t('intro.and')}
                  <span className="text-foreground"> {t('intro.human_behavior')}</span>.
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
                  >
                    <motion.button
                      onClick={handleDownloadCV}
                      className="group p-2 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300 hover:bg-muted/50"
                      title={language === 'pt' ? 'Baixar currículo em português' : 'Download CV in English'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex items-center gap-2">
                        <svg
                          className="w-3 h-3"
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
                  className="relative bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 backdrop-blur-sm border border-zinc-600/50 rounded-2xl p-8 shadow-2xl overflow-hidden group/card"
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


                  {/* Base metálica com textura */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, 
                          rgba(192, 192, 192, 0.1) 0%, 
                          rgba(255, 255, 255, 0.2) 25%, 
                          rgba(192, 192, 192, 0.1) 50%, 
                          rgba(128, 128, 128, 0.1) 75%, 
                          rgba(192, 192, 192, 0.1) 100%)`
                      }}
                    />
                  </div>

                  {/* Efeito holográfico colorido */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-400 mix-blend-screen">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(ellipse at var(--mouse-x) var(--mouse-y), 
                          rgba(220, 160, 225, 0.2) 0%, 
                          rgba(30, 210, 220, 0.15) 30%, 
                          rgba(60, 230, 65, 0.15) 60%, 
                          transparent 80%)`
                      }}
                    />
                  </div>



                  {/* Reflexão metálica principal */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-400 mix-blend-overlay">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(ellipse at var(--mouse-x) var(--mouse-y), 
                          rgba(255, 255, 255, 0.4) 0%, 
                          rgba(255, 255, 255, 0.1) 40%, 
                          transparent 70%)`
                      }}
                    />
                  </div>

                  {/* Reflexão secundária (inversa) */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 mix-blend-overlay">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(ellipse at calc(100% - var(--mouse-x)) calc(100% - var(--mouse-y)), 
                          rgba(0, 0, 0, 0.2) 0%, 
                          rgba(0, 0, 0, 0.05) 40%, 
                          transparent 70%)`
                      }}
                    />
                  </div>

                  {/* Brilho metálico dinâmico */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 mix-blend-soft-light">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(calc(var(--mouse-x) * 3.6deg), 
                          transparent 0%, 
                          rgba(255, 255, 255, 0.3) 50%, 
                          transparent 100%)`
                      }}
                    />
                  </div>

                  {/* Gradiente holográfico linear */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 mix-blend-screen">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(calc(var(--mouse-x) * 3.6deg), 
                          rgba(220, 160, 225, 0.1), 
                          rgba(30, 210, 220, 0.1), 
                          rgba(140, 145, 255, 0.1))`
                      }}
                    />
                  </div>

                  {/* Textura metálica sutil */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-600 mix-blend-multiply">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 2px,
                          rgba(255, 255, 255, 0.02) 2px,
                          rgba(255, 255, 255, 0.02) 4px
                        )`
                      }}
                    />
                  </div>



                  <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                    {/* Foto */}
                    <div className="relative">
                      <div className="relative w-64 h-64 mx-auto lg:mx-0">
                        {/* Efeito holográfico na foto */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-cyan-500/20 to-green-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 mix-blend-screen"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/25 via-transparent to-purple-500/25 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 mix-blend-overlay"></div>

                        <img
                          src="/eu.png"
                          alt="Felipe Kreulich"
                          className="relative w-full h-full object-cover rounded-full border-4 border-border/50 group-hover:border-muted-foreground/50 transition-all duration-500 shadow-2xl"
                        />

                        {/* Efeito de brilho holográfico na foto */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent rounded-full"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-cyan-500/20 to-transparent rounded-full"></div>
                        </div>
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
                },
                {
                  year: "2023",
                  role: t('work.cstc.role'),
                  company: t('work.cstc.company'),
                  description: t('work.cstc.description'),
                  tech: ["PHP", "Laravel", "MySQL"],
                },
                {
                  year: "2021",
                  role: t('work.army.role'),
                  company: t('work.army.company'),
                  description: t('work.army.description'),
                  tech: ["React", "TypeScript", "Next.js"],
                },
              ].map((job, index) => (
                <motion.div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-8 py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="lg:col-span-2">
                    <div className="text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
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
                  color: 'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20'
                },
                {
                  title: t('projects.wormhole.title'),
                  description: t('projects.wormhole.description'),
                  tech: t('projects.wormhole.tech'),
                  link: t('projects.wormhole.link'),
                  color: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20'
                },
                {
                  title: t('projects.blog.title'),
                  description: t('projects.blog.description'),
                  tech: t('projects.blog.tech'),
                  link: t('projects.blog.link'),
                  color: 'from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20'
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-gradient-to-br from-background via-background/80 to-muted/20 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Efeito de brilho no hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

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

                    <div className="pt-2">
                      <button
                        onClick={handleReadMore}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 cursor-pointer hover:opacity-80"
                      >
                        <span>{project.link}</span>
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
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[4] = el as HTMLElement | null;
          }}
          className="min-h-screen py-32 opacity-0"
        >
          <div className="space-y-16">
            <h2 className="text-4xl font-light">{t('thoughts.title')}</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  title: t('thoughts.future.title'),
                  excerpt: t('thoughts.future.excerpt'),
                  date: "Dec 2024",
                  readTime: "5 min",
                },
                {
                  title: t('thoughts.design.title'),
                  excerpt: t('thoughts.design.excerpt'),
                  date: "Nov 2024",
                  readTime: "8 min",
                },
                {
                  title: t('thoughts.performance.title'),
                  excerpt: t('thoughts.performance.excerpt'),
                  date: "Oct 2024",
                  readTime: "6 min",
                },
                {
                  title: t('thoughts.code_review.title'),
                  excerpt: t('thoughts.code_review.excerpt'),
                  date: "Sep 2024",
                  readTime: "4 min",
                },
              ].map((post, index) => (
                <article
                  key={index}
                  className="group p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>

                    <button
                      onClick={handleReadMore}
                      className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 cursor-pointer hover:opacity-80"
                    >
                      <span>{t('thoughts.read_more')}</span>
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
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="connect"
          ref={(el) => {
            sectionsRef.current[5] = el as HTMLElement | null;
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
                  { name: "GitHub", handle: "@FelipeKreulich", url: "https://github.com/FelipeKreulich" },
                  { name: "Twitter", handle: "@FelipeKreulich", url: "https://x.com/FelipeKreulich" },
                  { name: "LinkedIn", handle: "felipe-kreulich", url: "https://www.linkedin.com/in/felipe-kreulich/" },
                  { name: "Instagram", handle: "@kreulich.dev", url: "https://www.instagram.com/kreulich.dev/" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
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
                <button className="group p-2 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300">
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">{t('footer.blog')}</span>
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
