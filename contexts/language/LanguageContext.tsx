"use client"

import React, { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { locales, type Locale } from '@/lib/i18n/config'

/** Mantido por compatibilidade com o resto do código. */
type Language = Locale

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

/** Lembra a escolha para a próxima visita; a rota continua a mandar. */
const STORAGE_KEY = 'portfolio-language'

export function rememberLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Modo privado. Sem persistência, mas nada rebenta.
  }
}

export function readRememberedLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value && (locales as readonly string[]).includes(value) ? (value as Locale) : null
  } catch {
    return null
  }
}

interface LanguageProviderProps {
  /** Vem do segmento da rota, resolvido no servidor. */
  locale: Locale
  children: ReactNode
}

/**
 * O idioma deixou de ser estado do cliente e passou a ser a rota.
 *
 * Antes vivia num `useState` alimentado pelo localStorage, o que significava
 * que o HTML servido não tinha idioma nenhum — o conteúdo só aparecia depois
 * de o JavaScript correr. Agora `/pt` e `/en` são páginas reais, geradas
 * estaticamente, e trocar de idioma é navegar.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ locale, children }) => {
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = useCallback(
    (next: Language) => {
      rememberLocale(next)
      // Troca só o primeiro segmento e preserva o resto do caminho.
      const rest = pathname.replace(/^\/[^/]+/, '')
      router.push(`/${next}${rest}`)
    },
    [pathname, router],
  )

  const t = useCallback(
    (key: string): string => {
      const dictionary = dictionaries[locale] as Record<string, string>
      return dictionary[key] ?? key
    },
    [locale],
  )

  const value = useMemo(
    () => ({ language: locale, setLanguage, t }),
    [locale, setLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
