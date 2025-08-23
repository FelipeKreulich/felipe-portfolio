import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Verificar se há uma preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      // Se não há preferência salva, verificar a preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }
    
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    
    // Aplicar o tema ao DOM
    document.documentElement.classList.toggle("dark", isDark)
    
    // Salvar no localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark, isLoaded])

  // Listener para mudanças na preferência do sistema
  useEffect(() => {
    if (!isLoaded) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Só aplicar se não houver preferência salva no localStorage
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isLoaded])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark')
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    isLoaded
  }
}
