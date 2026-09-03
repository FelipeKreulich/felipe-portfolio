import sharp from "sharp"
import { statSync } from "node:fs"

/*
  A imagem da secção de transição chega com 6000x4000 e 2.28MB. Expande para
  ecrã inteiro, mas nunca precisa de mais do que o dobro da largura do
  viewport — servir o original seria mandar 2MB para pintar 1440px.

  Igual ao `prepare-hero.mjs`: o original fica em `public/` como fonte, e o
  site serve as variantes.
*/
// Junto dos outros originais, fora do `public/`: 2.3MB servidos
// publicamente sem nada os referenciar era peso morto no deploy.
const SRC = "assets/image-transition.jpg"

const VARIANTS = [
  { out: "public/transition-desktop.webp", width: 2560, quality: 82 },
  { out: "public/transition-mobile.webp", width: 1080, quality: 80 },
]

const original = statSync(SRC).size

for (const { out, width, quality } of VARIANTS) {
  const info = await sharp(SRC)
    .resize(width, null, { fit: "inside" })
    .webp({ quality, effort: 6 })
    .toFile(out)
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`)
}

console.log(`original ${(original / 1024 / 1024).toFixed(2)}MB`)
