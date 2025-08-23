"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "../contexts/language/LanguageContext"
import { toast } from "sonner"
import { config } from "@/lib/config"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

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

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en')
  }

  const handleReadMore = () => {
    toast(t('thoughts.feature_coming_soon'))
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "work", "thoughts", "connect"].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${t(`nav.${section}`)}`}
            />
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el
          }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-16 w-full">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">{t('portfolio.year')}</div>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight">
                  {t('intro.title')}
                  <br />
                  <span className="text-muted-foreground">{t('intro.subtitle')}</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('intro.description')}
                  <span className="text-foreground"> {t('intro.design')}</span>,<span className="text-foreground"> {t('intro.technology')}</span>,
                  and
                  <span className="text-foreground"> {t('intro.human_behavior')}</span>.
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {t('intro.available')}
                  </div>
                  <div>{t('intro.location')}</div>
                </div>
              </div>
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
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="work"
          ref={(el) => {
            sectionsRef.current[1] = el as HTMLElement;
          }}
          className="min-h-screen py-32 opacity-0"
        >
          <div className="space-y-16">
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-light">{t('work.title')}</h2>
              <div className="text-sm text-muted-foreground font-mono">{t('work.period')}</div>
            </div>

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
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-8 py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
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
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[2] = el as HTMLElement | null;
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
        </section>

        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[3] = el as HTMLElement | null;
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
                    href="mailto:jordan@example.com"
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
        </section>

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
