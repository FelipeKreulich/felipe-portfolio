/**
 * Loading de rota do Next.
 *
 * Devolve null de propósito: o preloader cobre o arranque e o <Canvas>
 * persistente cobre as transições entre rotas. Um spinner por baixo disso só
 * apareceria durante um frame ou dois, a competir com a linguagem do
 * preloader.
 */
export default function Loading() {
  return null
}
