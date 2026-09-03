/**
 * Telemetria pública do GitHub, lida no build.
 *
 * Corre no servidor e nunca no browser: um pedido a partir de cada visitante
 * gastaria o rate limit por IP e mandaria o tráfego deles para um terceiro.
 * `revalidate` diário chega — o número de repositórios não muda ao minuto.
 */
export interface GitHubStats {
  repos: number
}

export async function fetchGitHubStats(user = "FelipeKreulich"): Promise<GitHubStats | null> {
  try {
    const resposta = await fetch(`https://api.github.com/users/${user}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 86400 },
    })
    if (!resposta.ok) return null
    const dados = (await resposta.json()) as { public_repos?: unknown }
    const repos = dados.public_repos
    return typeof repos === "number" ? { repos } : null
  } catch {
    /*
      Falhar aqui é aceitável e previsto: a linha do GitHub renderiza sem o
      número. Um build não pode ir abaixo porque uma API de terceiros teve um
      mau minuto.
    */
    return null
  }
}
