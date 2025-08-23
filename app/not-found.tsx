"use client"

import { useLanguage } from '../contexts/language/LanguageContext'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { ArrowLeft, Mail, Home } from 'lucide-react'

export default function NotFound() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-700 select-none">
            {t('not_found.subtitle')}
          </h1>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t('not_found.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('not_found.description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="group">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {t('not_found.back_home')}
            </Link>
          </Button>
          
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-sm">{t('not_found.or')}</span>
            <Button variant="outline" size="lg" asChild>
              <Link 
                href={`mailto:contato.felipe.kreulich@gmail.com`}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {t('not_found.contact')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('not_found.if_need_help')}
        </p>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-100/20 to-blue-100/20 dark:from-green-900/20 dark:to-blue-900/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}
