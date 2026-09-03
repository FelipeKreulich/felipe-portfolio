/**
 * Resolve uma custom property CSS para um triplo sRGB em 0..1.
 *
 * `getComputedStyle` devolve o texto do token tal e qual — `oklch(...)`,
 * `lab(...)`, `color(display-p3 ...)` — e nenhum deles é legível pelo
 * THREE.Color nem por um parser de hex.
 *
 * Em vez de tentar cobrir os formatos um a um, pinta-se a cor num canvas de
 * 1x1 e lê-se o pixel de volta. O browser faz a conversão, e qualquer cor CSS
 * que ele entenda passa a funcionar — foi assim que se apanhou o `lab(100% 0 0)`
 * do tema claro a cair no fallback escuro em silêncio.
 */
export function resolveCssColor(
  varName: string,
  fallback: [number, number, number] = [0, 0, 0],
): [number, number, number] {
  if (typeof document === "undefined") return fallback

  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  if (!raw) return fallback

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return fallback

  // Uma cor inválida deixa o fillStyle no valor anterior, sem lançar erro. O
  // sentinela é a única forma de distinguir isso de um sucesso.
  const sentinel = "#010203"
  ctx.fillStyle = sentinel
  ctx.fillStyle = raw
  if (ctx.fillStyle === sentinel && raw.toLowerCase() !== sentinel) return fallback

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillRect(0, 0, 1, 1)

  try {
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r / 255, g / 255, b / 255]
  } catch {
    // Canvas contaminado não acontece aqui (não há imagem externa), mas
    // getImageData pode falhar em contextos restritos.
    return fallback
  }
}
