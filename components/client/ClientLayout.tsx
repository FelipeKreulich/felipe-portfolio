"use client"

import { Toaster } from '@/components/ui/sonner'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  /*
    O `lang` do <html> deixou de ser escrito aqui. Passou a vir do layout da
    rota, servido no HTML — escrevê-lo por JavaScript significava que o
    crawler nunca o via.
  */
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
