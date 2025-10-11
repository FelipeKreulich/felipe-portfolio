"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'pt'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Recuperar idioma salvo no localStorage
    const savedLanguage = localStorage.getItem('portfolio-language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('portfolio-language', lang)
  }

  const t = (key: string): string => {
    const translations = {
      en: {
        // Header
        'portfolio.year': 'PORTFOLIO / 2025',
        'intro.title': 'Felipe',
        'intro.subtitle': 'Kreulich',
        'intro.description': 'Full Stack Developer crafting digital experiences at the intersection of',
        'intro.design': 'design',
        'intro.technology': 'technology',
        'intro.and': 'and',
        'intro.human_behavior': 'human behavior',
        'intro.available': 'Available for work',
        'intro.location': 'Lisboa, Portugal',
        'intro.cv_download': 'Download CV',
        'intro.currently': 'CURRENTLY',
        'intro.role': 'Full Stack Developer',
        'intro.company': '@ POP Tecnologia e Mobilidade',
        'intro.period': '2025 — Present',
        'intro.focus': 'FOCUS',
        
        // Work Section
        'work.title': 'Selected Work',
        'work.period': '2025 — Present',
        'work.army.role': 'Support Technician and Full Stack Developer',
        'work.army.company': '9º Batalhão de Polícia do Exército',
        'work.army.description': 'Provided technical support to employees and developed solutions for the daily operations of the battalion.',
        'work.cstc.role': 'Full Stack Developer',
        'work.cstc.company': 'CSTC',
        'work.cstc.description': 'Developed a people management application, it was a very rewarding experience.',
        'work.pop.role': 'Full Stack Developer',
        'work.pop.company': 'POP Tecnologia e Mobilidade',
        'work.pop.description': 'I cannot say much about the project, but it was a very rewarding experience.',
        'work.az.role': 'Fullstack Developer and Support Analyst',
        'work.az.company': 'AZ Tecnologia e Gestao',
        'work.az.description': 'At AZ I worked as a fullstack analyst and developer, developing internal tools for use in support',
        
        // Projects Section
        'projects.title': 'Featured Projects',
        'projects.description': 'A selection of my recent work and personal projects.',
        'projects.portfolio.title': 'Portfolio Website',
        'projects.portfolio.description': 'Modern portfolio built with Next.js, TypeScript, and Tailwind CSS. Features dark/light theme, multilingual support, and responsive design.',
        'projects.portfolio.tech': 'Next.js, TypeScript, Tailwind CSS',
        'projects.portfolio.link': 'View Project',
        'projects.wormhole.title': 'Worm Hole',
        'projects.wormhole.description': 'Worm Hole is a personal project I developed: a platform for secure file transfer and sharing through links. I transformed it into a SaaS, currently in testing phase, and will be available soon for everyone.',
        'projects.wormhole.tech': 'Next.JS, TypeScript, Tailwind CSS, Prisma, NeonDB, Vercel, MySQL',
        'projects.wormhole.link': 'View Project',
        'projects.blog.title': 'Personal Blog',
        'projects.blog.description': 'Personal blog built with Next.js, TypeScript, and Tailwind CSS. Features dark/light theme, multilingual support, and responsive design.',
        'projects.blog.tech': 'Next.js, TypeScript, Tailwind CSS, Prisma, NeonDB, Vercel, MySQL',
        'projects.blog.link': 'View Project',
        'projects.technologies': 'Technologies',
        
        // Thoughts Section
        'thoughts.title': 'Recent Thoughts',
        'thoughts.future.title': 'The Future of Web Development',
        'thoughts.future.excerpt': 'Exploring how AI and automation are reshaping the way we build for the web.',
        'thoughts.design.title': 'Design Systems at Scale',
        'thoughts.design.excerpt': 'Lessons learned from building and maintaining design systems across multiple products.',
        'thoughts.performance.title': 'Performance-First Development',
        'thoughts.performance.excerpt': 'Why performance should be a first-class citizen in your development workflow.',
        'thoughts.code_review.title': 'The Art of Code Review',
        'thoughts.code_review.excerpt': 'Building better software through thoughtful and constructive code reviews.',
        'thoughts.read_more': 'Read more',
        'thoughts.feature_coming_soon': 'This feature is still being added. Coming soon!',
        
        // Calendar Section
        'calendar.title': 'Schedule a Meeting',
        'calendar.description': "Let's talk about your project and how I can help!",
        
        // Connect Section
        'connect.title': "Let's Connect",
        'connect.description': 'Always interested in new opportunities, collaborations, and conversations about technology and design.',
        'connect.email': 'contato.felipe.kreulich@gmail.com',
        'connect.elsewhere': 'ELSEWHERE',
        
        // About Section
        'about.title': 'About Me',
        'about.description': 'A passionate developer who loves to create meaningful digital experiences.',
        'about.age': 'Age',
        'about.age_value': '23 years',
        'about.location_full': 'Lisboa, Portugal',
        'about.interests': 'Interests',
        'about.interests_list': 'Technology, Design, Music, Travel',
        'about.available_for': 'Available for',
        'about.available_for_value': 'Freelance & Full-time',
        
        // Footer
        'footer.copyright': '© 2025 Felipe Kreulich. All rights reserved.',
        'footer.built_with': 'Built with ❤️ by Felipe Kreulich',
        'footer.blog': 'Visit my blog',
        
        // Navigation
        'nav.intro': 'Intro',
        'nav.work': 'Work',
        'nav.projects': 'Projects',
        'nav.thoughts': 'Thoughts',
        'nav.calendar': 'Calendar',
        'nav.connect': 'Connect',
        'nav.about': 'About',
        
        // Not Found Page
        'not_found.title': 'Page Not Found',
        'not_found.subtitle': '404',
        'not_found.description': 'The page you are looking for does not exist or has been moved.',
        'not_found.back_home': 'Back to Home',
        'not_found.or': 'or',
        'not_found.contact': 'contact me',
        'not_found.if_need_help': 'if you need help.',
        
        // Loading
        'loading.text': 'Loading...',
      },
      pt: {
        // Header
        'portfolio.year': 'PORTFÓLIO / 2025',
        'intro.title': 'Felipe',
        'intro.subtitle': 'Kreulich',
        'intro.description': 'Full Stack Developer criando experiências digitais na interseção entre',
        'intro.design': 'design',
        'intro.technology': 'tecnologia',
        'intro.and': 'e',
        'intro.human_behavior': 'comportamento humano',
        'intro.available': 'Disponível para trabalho',
        'intro.location': 'Lisboa, Portugal',
        'intro.cv_download': 'Download CV',
        'intro.currently': 'ATUALMENTE',
        'intro.role': 'Full Stack Developer',
        'intro.company': '@ POP Tecnologia e Mobilidade',
        'intro.period': '2025 — Presente',
        'intro.focus': 'FOCO',
        
        // Work Section
        'work.title': 'Trabalhos Selecionados',
        'work.period': '2021 — 2025',
        'work.army.role': 'Suporte Técnico e Desenvolvedor Full Stack',
        'work.army.company': '9º Batalhão de Polícia do Exército',
        'work.army.description': 'Atuei como Suporte Técnico e Desenvolvedor Full Stack. Prestava suporte técnico aos colaboradores e desenvolvia soluções para o dia a dia do batalhão.',
        'work.cstc.role': 'Desenvolvedor Full Stack',
        'work.cstc.company': 'CSTC',
        'work.cstc.description': 'Atuei como Desenvolvedor Full Stack. Desenvolvi uma aplicação para gestão de pessoas, foi uma experiência muito gratificante.',
        'work.pop.role': 'Desenvolvedor Full Stack',
        'work.pop.company': 'POP Tecnologia e Mobilidade',
        'work.pop.description': 'Atuei como Desenvolvedor Full Stack. Não posso dizer muito sobre o projeto, mas foi uma experiência muito gratificante.',
        'work.az.role': 'Analista de Suporte e Desenvolvedor Fullstack',
        'work.az.company': 'AZ Tecnologia e Gestao',
        'work.az.description': 'Na AZ atuei como analista e desenvolvedor fullstack, no desenvolvimento de ferramentas internas para uso no suporte.',
        
        // Projects Section
        'projects.title': 'Projetos em Destaque',
        'projects.description': 'Uma seleção dos meus trabalhos recentes e projetos pessoais.',
        'projects.portfolio.title': 'Website Portfolio',
        'projects.portfolio.description': 'Portfolio moderno construído com Next.js, TypeScript e Tailwind CSS. Inclui tema escuro/claro, suporte multilíngue e design responsivo.',
        'projects.portfolio.tech': 'Next.js, TypeScript, Tailwind CSS',
        'projects.portfolio.link': 'Ver Projeto',
        'projects.wormhole.title': 'Worm Hole',
        'projects.wormhole.description': 'Worm Hole é um projeto pessoal que desenvolvi: uma plataforma para transferência e envio de arquivos através de links seguros. Transformei-o em um SaaS, atualmente em fase de testes, e em breve estará disponível para todos.',
        'projects.wormhole.tech': 'Next.JS, TypeScript, Tailwind CSS, Prisma, NeonDB, Vercel, MySQL',
        'projects.wormhole.link': 'Ver Projeto',
        'projects.blog.title': 'Blog Pessoal',
        'projects.blog.description': 'Blog pessoal construído com Next.js, TypeScript e Tailwind CSS. Inclui tema escuro/claro, suporte multilíngue e design responsivo.',
        'projects.blog.tech': 'Next.js, TypeScript, Tailwind CSS, Prisma, NeonDB, Vercel, MySQL',
        'projects.blog.link': 'Ver Projeto',
        'projects.technologies': 'Tecnologias',
        
        // Thoughts Section
        'thoughts.title': 'Pensamentos Recentes',
        'thoughts.future.title': 'O Futuro do Desenvolvimento Web',
        'thoughts.future.excerpt': 'Explorando como a IA e automação estão a reformular a forma como construímos para a web.',
        'thoughts.design.title': 'Sistemas de Design em Escala',
        'thoughts.design.excerpt': 'Lições aprendidas ao construir e manter sistemas de design em múltiplos produtos.',
        'thoughts.performance.title': 'Desenvolvimento com Foco na Performance',
        'thoughts.performance.excerpt': 'Por que a performance deve ser um cidadão de primeira classe no seu fluxo de trabalho de desenvolvimento.',
        'thoughts.code_review.title': 'A Arte da Revisão de Código',
        'thoughts.code_review.excerpt': 'Construir software melhor através de revisões de código pensativas e construtivas.',
        'thoughts.read_more': 'Ler mais',
        'thoughts.feature_coming_soon': 'Esta funcionalidade ainda está sendo adicionada. Em breve!',
        
        // Calendar Section
        'calendar.title': 'Agende uma Reunião',
        'calendar.description': 'Vamos conversar sobre seu projeto e como posso ajudar!',
        
        // Connect Section
        'connect.title': 'Vamos Conectar',
        'connect.description': 'Sempre interessado em novas oportunidades, colaborações e conversas sobre tecnologia e design.',
        'connect.email': 'contato.felipe.kreulich@gmail.com',
        'connect.elsewhere': 'OUTROS SÍTIOS',
        
        // About Section
        'about.title': 'Sobre Mim',
        'about.description': 'Um desenvolvedor apaixonado que adora criar experiências digitais significativas.',
        'about.age': 'Idade',
        'about.age_value': '23 anos',
        'about.location_full': 'Lisboa, Portugal',
        'about.interests': 'Interesses',
        'about.interests_list': 'Tecnologia, Design, Música, Viagens',
        'about.available_for': 'Disponível para',
        'about.available_for_value': 'Freelance & Tempo integral',
        
        // Footer
        'footer.copyright': '© 2025 Felipe Kreulich. Todos os direitos reservados.',
        'footer.built_with': 'Construído com ❤️ por Felipe Kreulich',
        'footer.blog': 'Visite meu blog',
        
        // Navigation
        'nav.intro': 'Introdução',
        'nav.work': 'Trabalho',
        'nav.projects': 'Projetos',
        'nav.thoughts': 'Pensamentos',
        'nav.calendar': 'Agenda',
        'nav.connect': 'Conectar',
        'nav.about': 'Sobre',
        
        // Not Found Page
        'not_found.title': 'Página não encontrada',
        'not_found.subtitle': '404',
        'not_found.description': 'A página que você está procurando não existe ou foi movida.',
        'not_found.back_home': 'Voltar ao início',
        'not_found.or': 'ou',
        'not_found.contact': 'entre em contato',
        'not_found.if_need_help': 'se precisar de ajuda.',
        
        // Loading
        'loading.text': 'Carregando...',
      }
    }

    return translations[language][key as keyof typeof translations[Language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
