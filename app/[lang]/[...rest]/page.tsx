import { notFound } from "next/navigation"

/**
 * Sem isto, um URL que não existe (`/pt/qualquer-coisa`) nunca chega ao
 * `not-found.tsx` do idioma — cai no 404 genérico do Next, fora do layout.
 */
export default function CatchAll() {
  notFound()
}
