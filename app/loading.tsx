"use client"

import { useLanguage } from "../contexts/language/LanguageContext"

export default function Loading() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="space-y-4 text-center">
                <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mx-auto"></div>
                <div className="text-sm text-muted-foreground">{t('loading.text')}</div>
            </div>
        </div>
    )
}
