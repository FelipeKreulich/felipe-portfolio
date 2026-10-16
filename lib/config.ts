/**
 * Configuração dependente do ambiente.
 */
export const config = {
  /*
    URL base do site.

    Alimenta o `metadataBase`, o `canonical`, os `hreflang` e o Open Graph.
    Apontar para o domínio errado não parte nada visualmente — parte o SEO
    em silêncio: o Google continua a indexar o domínio antigo e trata o novo
    como duplicado.

    `NEXT_PUBLIC_APP_URL` pode sobrepor-se — serve para ambientes de
    pré-visualização, onde anunciar o domínio de produção faria o Google
    indexar a preview.
  */
  app: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://felipekreulich.pt'
      : process.env.NEXT_PUBLIC_APP_URL_DEV || 'http://localhost:3000'
  }
} as const;
