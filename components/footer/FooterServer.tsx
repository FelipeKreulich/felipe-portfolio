import { fetchGitHubStats } from "@/lib/github"
import Footer from "./Footer"

/**
 * Camada de servidor do rodapé.
 *
 * O `Footer` precisa de estado e de eventos, portanto é de cliente. A chamada
 * ao GitHub tem de ser de servidor. Esta camada existe só para as separar: o
 * número chega ao cliente como dado, já resolvido no build.
 */
export default async function FooterServer() {
  const stats = await fetchGitHubStats()
  return <Footer stats={stats} />
}
