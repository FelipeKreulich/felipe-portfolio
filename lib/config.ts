/**
 * Configuration file for environment variables
 * This file centralizes all environment-specific configuration
 */

export const config = {
  // Blog URLs
  blog: {
    url: process.env.NEXT_PUBLIC_BLOG_URL || 'https://kreulich-blog.vercel.app'
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  /*
    URL base do site.

    Alimenta o `metadataBase`, o `canonical`, os `hreflang` e o Open Graph.
    Apontar para o domínio errado não parte nada visualmente — parte o SEO
    em silêncio: o Google continua a indexar o domínio antigo e trata o novo
    como duplicado.

    O fallback é o domínio próprio. `NEXT_PUBLIC_APP_URL` continua a poder
    sobrepor-se — serve para ambientes de pré-visualização, onde anunciar o
    domínio de produção faria o Google indexar a preview.

    O esquema era `http://` e passou a `https://`: os canónicos e o Open
    Graph iam anunciar a versão insegura de um site que só serve HTTPS.
  */
  app: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://felipekreulich.pt'
      : process.env.NEXT_PUBLIC_APP_URL_DEV || 'http://localhost:3000'
  }
} as const;

// Type for the config object
export type Config = typeof config;
