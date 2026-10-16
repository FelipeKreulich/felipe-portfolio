"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language/LanguageContext"

/** A página de quem escreveu o URL ao lado. Na mesma linguagem do resto. */
export default function NotFound() {
  const { t, language } = useLanguage()

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-5 sm:px-8">
      <p className="text-muted">404</p>
      <h1 className="mt-2 text-[clamp(3rem,10vw,8rem)] leading-[0.85] font-semibold tracking-[-0.04em] [font-stretch:75%]">
        {t("not_found.title")}
      </h1>
      <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted">{t("not_found.description")}</p>
      <Link
        href={`/${language}`}
        className="mt-10 inline-flex h-11 w-fit items-center rounded-full bg-foreground px-5 font-medium text-background transition-opacity hover:opacity-85"
      >
        {t("not_found.back_home")}
      </Link>
    </main>
  )
}
