"use client"

import React, { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { dictionaries, type TranslationKey } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'

interface LanguageContextType {
  language: Locale
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

/**
 * O idioma é a rota. `/pt` e `/en` são páginas reais, geradas estaticamente,
 * e trocar de idioma é navegar — por isso aqui não há estado, só leitura.
 */
export const LanguageProvider: React.FC<{ locale: Locale; children: ReactNode }> = ({
  locale,
  children,
}) => {
  const t = useCallback((key: TranslationKey) => dictionaries[locale][key], [locale])
  const value = useMemo(() => ({ language: locale, t }), [locale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
