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
        'intro.human_behavior': 'human behavior',
        'intro.available': 'Available for work',
        'intro.location': 'Lisboa, Portugal',
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
        
        // Connect Section
        'connect.title': "Let's Connect",
        'connect.description': 'Always interested in new opportunities, collaborations, and conversations about technology and design.',
        'connect.email': 'contato.felipe.kreulich@gmail.com',
        'connect.elsewhere': 'ELSEWHERE',
        
        // Footer
        'footer.copyright': '© 2025 Felipe Kreulich. All rights reserved.',
        'footer.built_with': 'Built with ❤️ by Felipe Kreulich',
        'footer.blog': 'Visit my blog',
        
        // Navigation
        'nav.intro': 'intro',
        'nav.work': 'work',
        'nav.thoughts': 'thoughts',
        'nav.connect': 'connect',
        
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
        'intro.human_behavior': 'comportamento humano',
        'intro.available': 'Disponível para trabalho',
        'intro.location': 'Lisboa, Portugal',
        'intro.currently': 'ATUALMENTE',
        'intro.role': 'Full Stack Developer',
        'intro.company': '@ POP Tecnologia e Mobilidade',
        'intro.period': '2025 — Presente',
        'intro.focus': 'FOCO',
        
        // Work Section
        'work.title': 'Trabalhos Selecionados',
        'work.period': '2023 — 2025',
        'work.army.role': 'Suporte Técnico e Desenvolvedor Full Stack',
        'work.army.company': '9º Batalhão de Polícia do Exército',
        'work.army.description': 'Atuei como Suporte Técnico e Desenvolvedor Full Stack. Prestava suporte técnico aos colaboradores e desenvolvia soluções para o dia a dia do batalhão.',
        'work.cstc.role': 'Desenvolvedor Full Stack',
        'work.cstc.company': 'CSTC',
        'work.cstc.description': 'Atuei como Desenvolvedor Full Stack. Desenvolvi uma aplicação para gestão de pessoas, foi uma experiência muito gratificante.',
        'work.pop.role': 'Desenvolvedor Full Stack',
        'work.pop.company': 'POP Tecnologia e Mobilidade',
        'work.pop.description': 'Atuei como Desenvolvedor Full Stack. Não posso dizer muito sobre o projeto, mas foi uma experiência muito gratificante.',
        
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
        
        // Connect Section
        'connect.title': 'Vamos Conectar',
        'connect.description': 'Sempre interessado em novas oportunidades, colaborações e conversas sobre tecnologia e design.',
        'connect.email': 'contato.felipe.kreulich@gmail.com',
        'connect.elsewhere': 'OUTROS SÍTIOS',
        
        // Footer
        'footer.copyright': '© 2025 Felipe Kreulich. Todos os direitos reservados.',
        'footer.built_with': 'Construído com ❤️ por Felipe Kreulich',
        'footer.blog': 'Visite meu blog',
        
        // Navigation
        'nav.intro': 'introdução',
        'nav.work': 'trabalho',
        'nav.thoughts': 'pensamentos',
        'nav.connect': 'conectar',
        
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
