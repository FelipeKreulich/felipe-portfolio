/**
 * Variáveis de ambiente lidas por `lib/config.ts`.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL?: string
      NEXT_PUBLIC_APP_URL_DEV?: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export {}
