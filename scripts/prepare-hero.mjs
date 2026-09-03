/**
 * Pré-tratamento da imagem da hero.
 *
 * O dithering só consegue quantizar a luminância que a imagem já tem. O
 * original tem os meios-tons comprimidos, e por isso o Bayer devolvia uma papa
 * cinzenta em vez de formas legíveis. Isto abre o contraste antes de a imagem
 * chegar ao shader.
 *
 *   node scripts/prepare-hero.mjs
 *
 * Afina os valores em CONFIG e volta a correr — não precisas de um editor.
 */
import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const CONFIG = {
  source: "assets/new-hero.jpg",
  outDir: "public",

  /**
   * Contraste em torno do ponto médio.
   *
   * 1.4 e não 1.8: mudou a imagem e mudou o problema.
   *
   * A cidade de dia tinha mediana 118 e precisava de ser escurecida para o
   * texto branco assentar. Este retrato nocturno tem mediana 68, e a banda
   * onde o texto vive já está em 26 — mede-se sozinha. Curvas fortes só
   * esmagam a fotografia a preto: com 1.8 e lift -50, a mediana geral cai a
   * 0 e não sobra imagem nenhuma para o dithering desenhar.
   */
  contrast: 1.4,

  /**
   * Lift ligeiramente positivo, ao contrário da imagem anterior.
   *
   * O -50 existia para baixar uma imagem clara. Aqui levantaria a única
   * coisa que falta: separar as sombras do preto absoluto, para o Bayer ter
   * material com que trabalhar em vez de uma chapa.
   */
  blackLift: 5,

  /**
   * A camada revelada pela máscara do cursor mostra esta imagem SEM
   * dithering, e é aí que a compressão se vê.
   */
  quality: 85,

  /**
   * Sem espelhamento. A figura olha para baixo e para a esquerda, que é
   * exactamente para onde o texto do hero assenta.
   */
  flip: false,

  variants: [
    {
      /**
       * 1672 e não 1920: é a largura nativa da fonte. Ampliar não inventa
       * detalhe, só peso — e a camada revelada mostraria a interpolação.
       */
      name: "hero-desktop.webp",
      width: 1672,
      ratio: 16 / 9,
      x: 0.5,
      y: 0.5,
    },
    {
      /**
       * 0.38 e não 0.25: o rosto está a 45% da largura da fonte. Com o
       * recorte antigo, feito para uma cidade, ficava encostado à borda
       * direita do enquadramento.
       */
      name: "hero-mobile.webp",
      width: 706,
      ratio: 3 / 4,
      x: 0.38,
      y: 0.42,
    },
  ],
}

/**
 * O retrato da About.
 *
 * Sem tratamento de contraste: ao contrário da hero, esta imagem é mostrada
 * tal e qual, sem dithering por cima. Só redimensiona e converte.
 */
const PORTRAIT = {
  source: "assets/eu.png",
  name: "portrait.webp",
  width: 1100,
  quality: 86,
}

/**
 * `linear(a, b)` do sharp faz `saída = a * entrada + b` em 0-255.
 * Para escalar o contraste em torno de 127.5 sem deslocar o ponto médio:
 *   saída = c * (entrada - 127.5) + 127.5 + lift
 */
function contrastCoefficients({ contrast, blackLift }) {
  return [contrast, 127.5 * (1 - contrast) + blackLift]
}

async function build(variant, flipped, meta) {
  const [a, b] = contrastCoefficients(CONFIG)

  // Janela na proporção pedida, a maior que cabe na fonte.
  const sourceRatio = meta.width / meta.height
  const cropWidth = sourceRatio > variant.ratio ? Math.round(meta.height * variant.ratio) : meta.width
  const cropHeight = sourceRatio > variant.ratio ? meta.height : Math.round(meta.width / variant.ratio)

  const left = Math.round((meta.width - cropWidth) * variant.x)
  const top = Math.round((meta.height - cropHeight) * variant.y)

  const out = path.join(CONFIG.outDir, variant.name)

  const info = await sharp(flipped)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize({ width: variant.width })
    // Contraste depois do downscale: mais barato, e evita amplificar ruído
    // que a redução ia média de qualquer maneira.
    .linear(a, b)
    .webp({ quality: CONFIG.quality })
    .toFile(out)

  return { out, cropWidth, cropHeight, left, top, info }
}

async function main() {
  await mkdir(CONFIG.outDir, { recursive: true })

  // O espelhamento vai num passo próprio: a ordem interna de operações do
  // sharp não é a ordem das chamadas, e misturar flop com extract no mesmo
  // pipeline torna as coordenadas ambíguas.
  const flipped = CONFIG.flip
    ? await sharp(CONFIG.source).flop().toBuffer()
    : await sharp(CONFIG.source).toBuffer()

  const meta = await sharp(flipped).metadata()
  const [a, b] = contrastCoefficients(CONFIG)

  console.log(`fonte      ${meta.width}x${meta.height}${CONFIG.flip ? "  (espelhada)" : ""}`)
  console.log(`contraste  ${CONFIG.contrast}  lift ${CONFIG.blackLift}  ->  linear(${a}, ${b.toFixed(1)})`)
  console.log()

  for (const variant of CONFIG.variants) {
    const { out, cropWidth, cropHeight, info } = await build(variant, flipped, meta)
    console.log(
      `${variant.name.padEnd(20)} ${info.width}x${info.height}  ` +
        `${(info.size / 1024).toFixed(0)}K  ` +
        `(janela ${cropWidth}x${cropHeight} @ x=${variant.x})`,
    )
  }

  const portrait = await sharp(PORTRAIT.source)
    .resize({ width: PORTRAIT.width, withoutEnlargement: true })
    .webp({ quality: PORTRAIT.quality })
    .toFile(path.join(CONFIG.outDir, PORTRAIT.name))

  console.log(
    `${PORTRAIT.name.padEnd(20)} ${portrait.width}x${portrait.height}  ` +
      `${(portrait.size / 1024).toFixed(0)}K  (sem tratamento)`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
