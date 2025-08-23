"use client"

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/language/LanguageContext'
import { Toaster } from '@/components/ui/sonner'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { language } = useLanguage()

  useEffect(() => {
    // Atualizar o atributo lang do HTML baseado no idioma selecionado
    document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en'
  }, [language])

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
