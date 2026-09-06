# Redesenho do portfólio — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o portfólio de oito secções por um de três — Hero, Projetos, Contacto — a preto e branco, com caracteres japoneses como linguagem visual, mantendo o preloader existente intacto.

**Architecture:** As peças novas nascem ao lado das velhas, com o site antigo a funcionar e o build verde a cada passo (Tarefas 1–9). A demolição acontece de uma vez, numa única tarefa (10), porque as oito secções antigas cruzam-se em imports demais para valer a pena desmontá-las gradualmente. Depois, limpeza (11–13). A lógica com regras — cores, grelha, geometria do anel — vive em módulos puros com testes; os componentes só desenham.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, GSAP 3 + ScrollTrigger, Lenis, three.js/R3F (só o shader de dissolve), zustand. Testes com `node --test`, embutido — Node 25 corre TypeScript nativamente, portanto **não se instala nenhum framework de testes**.

**Spec:** `docs/superpowers/specs/2026-09-06-portfolio-redesign-design.md`

## Global Constraints

- **Sem dark mode.** Papel `#ffffff`, tinta `#0a0a0a`. Nenhum token novo pode ter cor. O bloco `.dark` do `globals.css` (linhas 72–115) desaparece.
- **Nenhuma dependência nova.** Nem de runtime nem de desenvolvimento. Os testes usam `node:test` e `node:assert/strict`, embutidos.
- **Tudo o que anima lê `useMotionPrefs()`** de `components/ReducedMotion.tsx`, que devolve `{ reducedMotion, canvasEnabled, resolved }`. Nada arranca antes de `resolved` ser `true`.
- **Nenhum texto visível é hardcoded.** Tudo passa por `t(key)` de `useLanguage()`, com assinatura `(key: string) => string`. As duas exceções são o nome `FELIPE KREULICH` e os caracteres japoneses, que são iguais nos dois idiomas.
- **O preloader não se toca em código.** Só os três valores CSS `--preloader-bg`, `--preloader-fg`, `--preloader-accent`.
- **Os comentários explicam porquê, não o quê**, em português europeu, seguindo o estilo que já existe no repo.
- **Caminhos novos:** as secções vivem em `components/sections/` e os componentes visuais em `components/visual/`. A spec dizia `components/hero/` e `components/projects/`, mas esses diretórios existem e só são apagados na Tarefa 10 — nomes novos evitam colisão e deixam o build verde até lá.

---

### Task 1: Assets e dados que sobrevivem à demolição

**Files:**
- Create: `public/avatar.png`
- Create: `lib/socials.ts`
- Modify: `components/footer/Footer.tsx` (o import de `socials`)
- Delete: `components/footer/socials.ts`
- Test: `scripts/check-avatar.mjs` (descartável, apagado no fim da tarefa)

**Interfaces:**
- Consumes: nada.
- Produces: `public/avatar.png` (PNG RGBA, 736×680); `lib/socials.ts` exportando `interface Social { plataforma: string; handle: string; url: string; nome: string }` e `const socials: Social[]` com seis entradas.

- [ ] **Step 1: Escrever o script de recorte**

O `~/Documents/profile_pic.jpg` tem a personagem sobre um fundo de anéis e partículas, e uma marca de água do TikTok no canto inferior direito. O Vision do macOS isola o sujeito; a marca de água sai cortando a faixa inferior.

Criar `/tmp/cutout.swift`:

```swift
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count >= 3 else { exit(2) }
guard let image = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else { exit(1) }

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: image)
try handler.perform([request])
guard let result = request.results?.first else { exit(1) }

let masked = try result.generateMaskedImage(
    ofInstances: result.allInstances,
    from: handler,
    croppedToInstancesExtent: false
)
try CIContext().writePNGRepresentation(
    of: CIImage(cvPixelBuffer: masked),
    to: URL(fileURLWithPath: args[2]),
    format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!
)
print("ok")
```

- [ ] **Step 2: Escrever a verificação, que ainda falha**

Criar `scripts/check-avatar.mjs`:

```js
// Verificacao descartavel: o avatar tem de existir, ser PNG com canal alfa,
// e ter a faixa da marca de agua ja cortada.
import { readFileSync } from "node:fs"
import assert from "node:assert/strict"

const buf = readFileSync("public/avatar.png")

assert.equal(buf.subarray(1, 4).toString("ascii"), "PNG", "nao e um PNG")

// Cabecalho IHDR: largura e altura big-endian nos bytes 16..24, tipo de cor
// no byte 25. 6 = RGBA, 4 = cinzento com alfa. Sem alfa nao ha recorte.
const width = buf.readUInt32BE(16)
const height = buf.readUInt32BE(20)
const colorType = buf.readUInt8(25)

assert.equal(width, 736, `largura ${width}`)
assert.equal(height, 680, `altura ${height} — a faixa da marca de agua nao foi cortada`)
assert.ok([4, 6].includes(colorType), `tipo de cor ${colorType} nao tem alfa`)

console.log(`ok: ${width}x${height}, tipo ${colorType}`)
```

- [ ] **Step 3: Correr a verificação para confirmar que falha**

Run: `node scripts/check-avatar.mjs`
Expected: FAIL com `ENOENT: no such file or directory, open 'public/avatar.png'`

- [ ] **Step 4: Gerar o avatar**

```bash
swift /tmp/cutout.swift ~/Documents/profile_pic.jpg /tmp/cut.png
python3 - <<'PY'
from PIL import Image
im = Image.open('/tmp/cut.png').convert('RGBA')
w, h = im.size
# A marca de agua vive na ultima faixa. Cortar a base e mais limpo do que
# apagar uma caixa por cima — nao deixa entalhe no ombro.
im.crop((0, 0, w, int(h * 0.925))).save('public/avatar.png', optimize=True)
print(Image.open('public/avatar.png').size)
PY
```

- [ ] **Step 5: Correr a verificação para confirmar que passa**

Run: `node scripts/check-avatar.mjs`
Expected: `ok: 736x680, tipo 6`

- [ ] **Step 6: Confirmar o recorte a olho**

```bash
python3 -c "
from PIL import Image
im = Image.open('public/avatar.png').convert('RGBA')
Image.alpha_composite(Image.new('RGBA', im.size, (255,255,255,255)), im).convert('RGB').save('/tmp/check.jpg')
"
open /tmp/check.jpg
```

Expected: a personagem sobre branco liso, com os fios do cabelo preservados, sem anéis nem partículas de fundo, e sem marca de água.

- [ ] **Step 7: Mover os socials para `lib/` e acrescentar as duas entradas em falta**

Criar `lib/socials.ts`:

```ts
/**
 * As ligações do contacto.
 *
 * Sem cores de marca e sem logótipos. Quatro identidades visuais alheias no
 * mesmo bloco desfaziam a do site — e ainda por cima no fim. A lista é
 * tipográfica: plataforma em mono, handle ao lado.
 */
export interface Social {
  /** Escrito em maiúsculas no mono da esquerda. */
  plataforma: string
  handle: string
  url: string
  /** Nome acessível: lido por inteiro pelo leitor de ecrã. */
  nome: string
}

export const socials: Social[] = [
  {
    plataforma: "GitHub",
    handle: "@FelipeKreulich",
    url: "https://github.com/FelipeKreulich",
    nome: "GitHub, @FelipeKreulich",
  },
  {
    plataforma: "LinkedIn",
    handle: "felipe-kreulich",
    url: "https://www.linkedin.com/in/felipe-kreulich/",
    nome: "LinkedIn, felipe-kreulich",
  },
  {
    plataforma: "X",
    handle: "@FelipeKreulich",
    url: "https://x.com/FelipeKreulich",
    nome: "X, @FelipeKreulich",
  },
  {
    plataforma: "Instagram",
    handle: "@kreulich.dev",
    url: "https://www.instagram.com/kreulich.dev/",
    nome: "Instagram, @kreulich.dev",
  },
  {
    plataforma: "Blog",
    handle: "kreulich-blog",
    url: "https://kreulich-blog.vercel.app",
    nome: "Blog, kreulich-blog.vercel.app",
  },
  {
    plataforma: "Buy me a coffee",
    handle: "felipekreulich",
    url: "https://buymeacoffee.com/felipekreulich",
    nome: "Buy me a coffee, felipekreulich",
  },
]
```

- [ ] **Step 8: Redirecionar o import do rodapé antigo e apagar o ficheiro velho**

```bash
grep -rl 'footer/socials\|from "./socials"' --include="*.tsx" --include="*.ts" . | grep -v node_modules
```

Em cada ficheiro encontrado, trocar o import por `from "@/lib/socials"`. Depois:

```bash
rm components/footer/socials.ts
```

- [ ] **Step 9: Confirmar que o build continua verde**

Run: `npm run build && npm run lint`
Expected: build com sucesso, sem erros novos de lint.

- [ ] **Step 10: Apagar a verificação descartável e fazer commit**

```bash
rm scripts/check-avatar.mjs
git add public/avatar.png lib/socials.ts components/footer/
git commit -m "feat: avatar recortado e socials movidos para lib/"
```

---

### Task 2: `lib/glitch.ts` — a matemática do LetterGlitch

**Files:**
- Create: `lib/glitch.ts`
- Test: `lib/glitch.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `FONT_SIZE: number` (15), `CELL_W: number`, `CELL_H: number`, `JP_CHARS: string[]`, `type Rgb = [number, number, number]`, `hexToRgb(hex: string): Rgb | null`, `lerpColor(from: string, to: string, t: number): string`, `gridFor(width: number, height: number): { cols: number; rows: number }`.

- [ ] **Step 1: Escrever os testes que falham**

Criar `lib/glitch.test.ts`:

```ts
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  CELL_H,
  CELL_W,
  FONT_SIZE,
  JP_CHARS,
  gridFor,
  hexToRgb,
  lerpColor,
} from "./glitch.ts"

test("hexToRgb lê hex de 6 e de 3 dígitos", () => {
  assert.deepEqual(hexToRgb("#0a0a0a"), [10, 10, 10])
  assert.deepEqual(hexToRgb("#abc"), [170, 187, 204])
})

test("hexToRgb devolve null para o que não é hex", () => {
  assert.equal(hexToRgb("rgb(10, 10, 10)"), null)
  assert.equal(hexToRgb(""), null)
})

test("lerpColor chega exatamente aos extremos", () => {
  assert.equal(lerpColor("#000000", "#ffffff", 0), "rgb(0, 0, 0)")
  assert.equal(lerpColor("#000000", "#ffffff", 1), "rgb(255, 255, 255)")
})

test("lerpColor limita t fora de [0,1]", () => {
  assert.equal(lerpColor("#000000", "#ffffff", 2), "rgb(255, 255, 255)")
  assert.equal(lerpColor("#000000", "#ffffff", -1), "rgb(0, 0, 0)")
})

/**
 * A regressão do bug do React Bits. No original, o valor de partida da
 * interpolação era a string CSS que ela própria tinha produzido na frame
 * anterior; o parser de hex devolvia null e a transição congelava ao fim de
 * um passo. Aqui a sequência inteira tem de chegar ao destino.
 */
test("uma sequência de passos de 0.06 acaba na cor de destino", () => {
  let p = 0
  let css = ""
  while (p < 1) {
    p = Math.min(1, p + 0.06)
    css = lerpColor("#0a0a0a", "#9a9a9a", p)
  }
  assert.equal(css, "rgb(154, 154, 154)")
})

test("lerpColor recusa entradas que não sejam hex", () => {
  assert.throws(() => lerpColor("rgb(0, 0, 0)", "#ffffff", 0.5))
})

/**
 * O guard do outro bug: os glifos CJK são full-width. Com uma célula mais
 * estreita do que o corpo da fonte — o `charWidth: 10` do original —
 * sobrepõem-se e a grelha fica ilegível.
 */
test("a célula acompanha o corpo da fonte", () => {
  assert.equal(CELL_W, FONT_SIZE)
  assert.ok(CELL_H > CELL_W, "a célula tem de ser mais alta do que larga")
})

test("gridFor arredonda para cima e nunca devolve zero", () => {
  assert.deepEqual(gridFor(800, 500), { cols: 54, rows: 25 })
  assert.deepEqual(gridFor(1, 1), { cols: 1, rows: 1 })
  assert.deepEqual(gridFor(0, 0), { cols: 1, rows: 1 })
})

test("o alfabeto é japonês e não tem repetidos", () => {
  assert.ok(JP_CHARS.length > 60, `só ${JP_CHARS.length} glifos`)
  assert.equal(new Set(JP_CHARS).size, JP_CHARS.length, "há glifos repetidos")
})
```

- [ ] **Step 2: Correr os testes para confirmar que falham**

Run: `node --test lib/glitch.test.ts`
Expected: FAIL — `Cannot find module './glitch.ts'`

- [ ] **Step 3: Escrever a implementação**

Criar `lib/glitch.ts`:

```ts
/**
 * A matemática do LetterGlitch, fora do componente.
 *
 * Vive aqui porque é a única parte com regras a sério, e porque assim
 * testa-se sem DOM nem canvas. O componente só desenha.
 */

/** Corpo da fonte do canvas, em px CSS. */
export const FONT_SIZE = 15

/**
 * Os glifos CJK são full-width: ocupam 1em, não os 10px fixos do componente
 * do React Bits. Numa grelha mais estreita do que o corpo da fonte
 * sobrepõem-se uns aos outros. A célula deriva do corpo — não é uma
 * constante à parte que se possa dessincronizar dele.
 */
export const CELL_W = FONT_SIZE
export const CELL_H = Math.round(FONT_SIZE * 1.34)

/** Katakana e os kanji do vocabulário do site. */
export const JP_CHARS = Array.from(
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "我術創数縁壊築設計沈黙実行規律誰来自分作深淵見返世出",
)

export type Rgb = [number, number, number]

const SHORT = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
const FULL = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

/** Aceita `#abc` e `#aabbcc`. Devolve null para tudo o resto. */
export function hexToRgb(hex: string): Rgb | null {
  const short = SHORT.exec(hex)
  if (short) {
    return [
      parseInt(short[1] + short[1], 16),
      parseInt(short[2] + short[2], 16),
      parseInt(short[3] + short[3], 16),
    ]
  }

  const full = FULL.exec(hex)
  if (!full) return null
  return [parseInt(full[1], 16), parseInt(full[2], 16), parseInt(full[3], 16)]
}

/**
 * Interpola entre duas cores hex e devolve uma string CSS.
 *
 * Os dois extremos são sempre hex — nunca o resultado desta função. É esta a
 * diferença para o componente original, que voltava a passar o seu próprio
 * `rgb(...)` ao parser de hex, recebia null, e congelava a transição no
 * primeiro passo. Lançar em vez de devolver algo é deliberado: um extremo
 * que não seja hex é sempre erro de quem chama.
 */
export function lerpColor(from: string, to: string, t: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  if (!a || !b) {
    throw new Error(`lerpColor precisa de hex nos dois extremos: "${from}" -> "${to}"`)
  }

  const f = Math.min(1, Math.max(0, t))
  const mix = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * f)
  return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`
}

/** Quantas células cabem numa caixa, em unidades CSS. */
export function gridFor(width: number, height: number) {
  return {
    cols: Math.max(1, Math.ceil(width / CELL_W)),
    rows: Math.max(1, Math.ceil(height / CELL_H)),
  }
}
```

- [ ] **Step 4: Correr os testes para confirmar que passam**

Run: `node --test lib/glitch.test.ts`
Expected: `pass 9`, `fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/glitch.ts lib/glitch.test.ts
git commit -m "feat: matemática do LetterGlitch com testes"
```

---

### Task 3: `components/visual/LetterGlitch.tsx`

**Files:**
- Create: `components/visual/LetterGlitch.tsx`

**Interfaces:**
- Consumes: `lib/glitch.ts` (`CELL_H`, `CELL_W`, `FONT_SIZE`, `JP_CHARS`, `gridFor`, `lerpColor`); `useMotionPrefs()` de `components/ReducedMotion`; `gsap` de `lib/gsap`.
- Produces: `export default function LetterGlitch(props: LetterGlitchProps)` com `props = { glitchColors?: string[]; glitchSpeed?: number; smooth?: boolean; characters?: string[]; centerVignette?: boolean; outerVignette?: boolean; className?: string }`. Preenche o elemento pai — o pai tem de ter dimensões próprias.

- [ ] **Step 1: Escrever o componente**

Criar `components/visual/LetterGlitch.tsx`:

```tsx
"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { CELL_H, CELL_W, FONT_SIZE, JP_CHARS, gridFor, lerpColor } from "@/lib/glitch"

interface Cell {
  ch: string
  /** Hex, sempre. Nunca a string CSS já composta — ver lib/glitch.ts. */
  from: string
  to: string
  /** A string CSS que o canvas usa. */
  css: string
  /** 0..1 */
  p: number
}

interface LetterGlitchProps {
  glitchColors?: string[]
  /** ms entre trocas de carácter. */
  glitchSpeed?: number
  smooth?: boolean
  characters?: string[]
  centerVignette?: boolean
  outerVignette?: boolean
  className?: string
}

/*
  Constantes de módulo e não literais nos parâmetros: um literal seria um
  array novo a cada render, entrava nas dependências do efeito sempre
  diferente, e o canvas remontava-se a cada render. Quem chamar este
  componente com literais inline sofre o mesmo — daí o aviso.
*/
const DEFAULT_COLORS = ["#0a0a0a", "#6b6b6b", "#9a9a9a"]

/** Fração de células que muda em cada tick. */
const CHURN = 0.045
/** Quanto avança a interpolação de cor por frame. */
const FADE_STEP = 0.06

const PAPER = "255, 255, 255"

export default function LetterGlitch({
  glitchColors = DEFAULT_COLORS,
  glitchSpeed = 55,
  smooth = true,
  characters = JP_CHARS,
  centerVignette = true,
  outerVignette = true,
  className = "",
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()

  useEffect(() => {
    if (!resolved) return

    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !parent || !ctx) return

    let cells: Cell[] = []
    let cols = 0
    let width = 0
    let height = 0
    let last = 0
    let running = false
    let font = `${FONT_SIZE}px ui-monospace, monospace`

    const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = font
      ctx.textBaseline = "top"

      for (let i = 0; i < cells.length; i++) {
        ctx.fillStyle = cells[i].css
        ctx.fillText(cells[i].ch, (i % cols) * CELL_W, Math.floor(i / cols) * CELL_H)
      }
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      width = rect.width
      height = rect.height

      // A família vem do CSS e não de uma string escrita à mão: é o
      // next/font que gera o nome real. Lida aqui e guardada — chamar
      // getComputedStyle dentro do draw obrigava a um cálculo de estilo
      // forçado por frame, que é exatamente o que se está a tentar evitar.
      font = `${FONT_SIZE}px ${getComputedStyle(parent).fontFamily}`

      // Travado em 2: num ecrã a 3x triplicam-se os pixels por frame sem
      // diferença visível numa grelha de texto.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const grid = gridFor(width, height)
      cols = grid.cols
      cells = Array.from({ length: grid.cols * grid.rows }, () => {
        const c = pick(glitchColors)
        return { ch: pick(characters), from: c, to: c, css: c, p: 1 }
      })
      draw()
    }

    const tick = () => {
      const now = performance.now()

      if (now - last >= glitchSpeed) {
        const n = Math.max(1, Math.round(cells.length * CHURN))
        for (let i = 0; i < n; i++) {
          const cell = cells[Math.floor(Math.random() * cells.length)]
          cell.ch = pick(characters)
          cell.from = cell.to
          cell.to = pick(glitchColors)
          if (smooth) {
            cell.p = 0
          } else {
            cell.p = 1
            cell.css = cell.to
          }
        }
        last = now
      }

      if (smooth) {
        for (const cell of cells) {
          if (cell.p < 1) {
            cell.p = Math.min(1, cell.p + FADE_STEP)
            cell.css = lerpColor(cell.from, cell.to, cell.p)
          }
        }
      }

      draw()
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      // No ticker do GSAP e não num rAF próprio: o Lenis já é conduzido por
      // este ticker, e dois loops descoordenados dão jitter no scroll.
      gsap.ticker.add(tick)
    }

    const stop = () => {
      if (!running) return
      running = false
      gsap.ticker.remove(tick)
    }

    resize()

    // O redimensionamento e a chegada da fonte valem para os dois casos: sem
    // movimento a grelha é estática, mas continua a ter de reagir a uma
    // rotação de ecrã e a ser repintada quando a fonte japonesa resolver.
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    // A fonte resolve depois do primeiro paint. Sem isto a grelha ficava
    // desenhada com o fallback do sistema até ao primeiro resize.
    void document.fonts.ready.then(() => {
      if (canvasRef.current) resize()
    })

    // Sem movimento, fica-se por aqui: a grelha está pintada e não arranca
    // loop nenhum.
    if (reducedMotion) {
      return () => ro.disconnect()
    }

    // Sem isto o canvas repintava a grelha inteira com o visitante já no
    // contacto — em 1080p são ~6900 fillText por frame, para ninguém ver.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(parent)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
    }
  }, [resolved, reducedMotion, glitchColors, glitchSpeed, smooth, characters])

  return (
    <div className={`font-jp relative h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />

      {/* O centro tem de respirar para o nome se ler por cima. */}
      {centerVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 46% 62% at 50% 50%, rgba(${PAPER},0.97) 0%, rgba(${PAPER},0.7) 52%, rgba(${PAPER},0) 78%)`,
          }}
        />
      )}

      {/* E o ruído não pode bater nas margens: cortado a direito lê-se como
          um rectângulo colado, não como atmosfera. */}
      {outerVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle, rgba(${PAPER},0) 52%, rgba(${PAPER},1) 100%)`,
          }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Confirmar que compila e passa no lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros. O componente ainda não está montado em lado nenhum — este passo só verifica os tipos e as regras de hooks.

- [ ] **Step 3: Commit**

```bash
git add components/visual/LetterGlitch.tsx
git commit -m "feat: LetterGlitch com alfabeto japonês, no ticker do GSAP"
```

---

### Task 4: `lib/kanji.ts` — as máximas e a geometria do anel

**Files:**
- Create: `lib/kanji.ts`
- Test: `lib/kanji.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `interface Maxim { ja: string; labelKey: string }`, `MAXIMS: Maxim[]`, `RING_SEPARATOR: string`, `circlePath(cx: number, cy: number, r: number): string`, `repeatToFit(text: string, radius: number, glyphWidth: number): string`, `ringText(maxims?: Maxim[]): string`.

- [ ] **Step 1: Escrever os testes que falham**

Criar `lib/kanji.test.ts`:

```ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { MAXIMS, RING_SEPARATOR, circlePath, repeatToFit, ringText } from "./kanji.ts"

test("circlePath fecha a volta com dois arcos de meia volta", () => {
  assert.equal(
    circlePath(400, 250, 100),
    "M 400 250 m -100 0 a 100 100 0 1 1 200 0 a 100 100 0 1 1 -200 0",
  )
})

test("repeatToFit cobre a circunferência inteira", () => {
  // 2π×100 ≈ 628px; com glifos de 15px são 42 lugares.
  const out = Array.from(repeatToFit("あいうえお", 100, 15))
  assert.ok(out.length >= 42, `só ${out.length} glifos para 42 lugares`)
})

test("repeatToFit nunca devolve vazio", () => {
  assert.ok(repeatToFit("あ", 0, 15).length > 0)
})

test("ringText encadeia todas as máximas e fecha com separador", () => {
  const text = ringText()
  for (const maxim of MAXIMS) {
    assert.ok(text.includes(maxim.ja), `falta a máxima ${maxim.ja}`)
  }
  assert.ok(text.endsWith(RING_SEPARATOR), "sem separador final a volta cola-se a si própria")
})

test("cada máxima tem japonês e chave de dicionário", () => {
  assert.ok(MAXIMS.length >= 6)
  for (const maxim of MAXIMS) {
    assert.ok(maxim.ja.length > 0)
    assert.match(maxim.labelKey, /^maxim\./)
  }
})

test("as chaves das máximas são únicas", () => {
  const keys = MAXIMS.map((m) => m.labelKey)
  assert.equal(new Set(keys).size, keys.length)
})
```

- [ ] **Step 2: Correr os testes para confirmar que falham**

Run: `node --test lib/kanji.test.ts`
Expected: FAIL — `Cannot find module './kanji.ts'`

- [ ] **Step 3: Escrever a implementação**

Criar `lib/kanji.ts`:

```ts
/**
 * As máximas do Felipe em japonês, e a geometria do anel que as escreve.
 *
 * O texto não é kanji decorativo: são as frases que ele já tem no README de
 * GitHub, traduzidas. Quem lê japonês encontra o mesmo manifesto.
 */

export interface Maxim {
  ja: string
  /** Chave do dicionário para o aria-label. O texto acessível nunca é solto. */
  labelKey: string
}

export const MAXIMS: Maxim[] = [
  { ja: "誰も来ない、自分で作れ", labelKey: "maxim.build_it_yourself" },
  { ja: "すべては壊れる、その前提で設計せよ", labelKey: "maxim.design_for_the_fall" },
  { ja: "規律は動機より長く続く", labelKey: "maxim.discipline" },
  { ja: "沈黙、そして実行", labelKey: "maxim.silence" },
  { ja: "壊して、理解して、より良く作り直す", labelKey: "maxim.rebuild" },
  { ja: "深淵は見返す。それでも世に出せ", labelKey: "maxim.abyss" },
]

/** Ideográfico, para respirar como o resto do texto japonês. */
export const RING_SEPARATOR = "　・　"

/**
 * O `d` de um círculo completo, para `<textPath>`.
 *
 * Dois arcos de meia volta e não um só: um arco de 360° tem o mesmo ponto de
 * início e de fim, e o SVG não sabe de que lado o há-de desenhar.
 */
export function circlePath(cx: number, cy: number, r: number): string {
  return `M ${cx} ${cy} m ${-r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 ${-r * 2} 0`
}

/**
 * Repete o texto até cobrir a circunferência.
 *
 * Um anel com texto a menos deixa um buraco onde a volta acaba — e como o
 * anel roda, o buraco acaba por passar em frente a quem está a ler.
 */
export function repeatToFit(text: string, radius: number, glyphWidth: number): string {
  const circunferencia = 2 * Math.PI * radius
  const lugares = Math.ceil(circunferencia / glyphWidth)
  const vezes = Math.max(1, Math.ceil(lugares / Array.from(text).length))
  return text.repeat(vezes)
}

/** As máximas encadeadas numa volta, com separador a fechar. */
export function ringText(maxims: Maxim[] = MAXIMS): string {
  return maxims.map((m) => m.ja).join(RING_SEPARATOR) + RING_SEPARATOR
}
```

- [ ] **Step 4: Correr os testes para confirmar que passam**

Run: `node --test lib/kanji.test.ts`
Expected: `pass 6`, `fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/kanji.ts lib/kanji.test.ts
git commit -m "feat: máximas em japonês e geometria do anel, com testes"
```

---

### Task 5: `components/visual/KanjiRing.tsx`

**Files:**
- Create: `components/visual/KanjiRing.tsx`

**Interfaces:**
- Consumes: `lib/kanji.ts` (`MAXIMS`, `circlePath`, `repeatToFit`, `ringText`); `gsap`, `useGSAP` de `lib/gsap`; `useMotionPrefs()`; `useLanguage()`.
- Produces: `export default function KanjiRing({ className }: { className?: string })`. Devolve um `<svg>` quadrado que preenche o contentor.

- [ ] **Step 1: Escrever o componente**

Criar `components/visual/KanjiRing.tsx`:

```tsx
"use client"

import { useId, useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { MAXIMS, circlePath, repeatToFit, ringText } from "@/lib/kanji"

/** Unidades do viewBox. Os raios são relativos a este quadrado. */
const SIZE = 800
const CENTER = SIZE / 2
const OUTER_R = 330
const INNER_R = 258
/** Corpo dos glifos no anel, nas mesmas unidades. */
const GLYPH = 13

export default function KanjiRing({ className = "" }: { className?: string }) {
  const rootRef = useRef<SVGSVGElement>(null)
  const outerRef = useRef<SVGGElement>(null)
  const innerRef = useRef<SVGGElement>(null)
  const { reducedMotion, resolved } = useMotionPrefs()
  const { t } = useLanguage()

  // Dois anéis na mesma página colidiriam nos ids dos <path>.
  const uid = useId().replace(/:/g, "")
  const outerId = `ring-outer-${uid}`
  const innerId = `ring-inner-${uid}`

  const volta = ringText()
  const label = MAXIMS.map((m) => t(m.labelKey)).join(". ")

  useGSAP(
    () => {
      if (!resolved || reducedMotion) return

      // Roda com o scroll e não com o relógio: assim o anel mede a página em
      // vez de a decorar. O `scrub` liga a rotação à posição.
      const spin = (el: SVGGElement | null, graus: number) => {
        if (!el) return
        gsap.to(el, {
          rotation: graus,
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
      }

      // Sentidos opostos: dois anéis a rodar juntos leem-se como um só.
      spin(outerRef.current, 90)
      spin(innerRef.current, -60)
    },
    { scope: rootRef, dependencies: [resolved, reducedMotion] },
  )

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={label}
    >
      <defs>
        <path id={outerId} d={circlePath(CENTER, CENTER, OUTER_R)} />
        <path id={innerId} d={circlePath(CENTER, CENTER, INNER_R)} />
      </defs>

      <circle
        cx={CENTER}
        cy={CENTER}
        r={OUTER_R}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.14}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={INNER_R}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.14}
      />

      <g ref={outerRef}>
        <text className="font-jp" fontSize={GLYPH} fill="currentColor" fillOpacity={0.5}>
          <textPath href={`#${outerId}`}>{repeatToFit(volta, OUTER_R, GLYPH)}</textPath>
        </text>
      </g>

      <g ref={innerRef}>
        <text className="font-jp" fontSize={GLYPH} fill="currentColor" fillOpacity={0.24}>
          <textPath href={`#${innerId}`}>{repeatToFit(volta, INNER_R, GLYPH)}</textPath>
        </text>
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Confirmar que compila e passa no lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/visual/KanjiRing.tsx
git commit -m "feat: anel de kanji em SVG textPath, a rodar com o scroll"
```

---

### Task 6: Dicionário — as chaves novas

As chaves antigas ficam por agora; são podadas na Tarefa 11, depois de deixarem de ser usadas. Acrescentar chaves não parte nada.

**Files:**
- Modify: `lib/i18n/dictionaries.ts`

**Interfaces:**
- Consumes: nada.
- Produces: as chaves novas `hero.portrait_alt`, `projects.title`, `contact.title`, `contact.intro`, `contact.email`, `contact.copy`, `contact.copied`, `contact.copy_failed`, `contact.external`, `maxim.build_it_yourself`, `maxim.design_for_the_fall`, `maxim.discipline`, `maxim.silence`, `maxim.rebuild`, `maxim.abyss` — nos dois idiomas.

- [ ] **Step 1: Acrescentar o bloco ao dicionário inglês**

Em `lib/i18n/dictionaries.ts`, dentro do objeto `en`, acrescentar antes do fecho:

```ts
    // --- Redesenho 2026 ---
    'hero.portrait_alt': 'Illustrated portrait of Felipe Kreulich, white hair and glowing eyes',

    'projects.title': 'Projects',
    'contact.title': 'Connect',
    'contact.intro': 'Tell me what you are building.',
    'contact.email': 'contato.felipe.kreulich@gmail.com',
    'contact.copy': 'Copy address',
    'contact.copied': 'Address copied',
    'contact.copy_failed': 'Select and copy the address',
    'contact.external': 'opens in a new window',

    // As máximas do anel. O japonês está em lib/kanji.ts; aqui vive só o
    // texto que o leitor de ecrã lê.
    'maxim.build_it_yourself': 'No one is coming. Build it yourself',
    'maxim.design_for_the_fall': 'Every system fails — design for the fall',
    'maxim.discipline': 'Discipline outlives motivation',
    'maxim.silence': 'Silence, then execution',
    'maxim.rebuild': 'Break it, understand it, rebuild it better',
    'maxim.abyss': 'The abyss stares back. Ship anyway',
```

- [ ] **Step 2: Acrescentar o bloco equivalente ao dicionário português**

No objeto `pt`, o mesmo conjunto de chaves:

```ts
    // --- Redesenho 2026 ---
    'hero.portrait_alt': 'Retrato ilustrado de Felipe Kreulich, cabelo branco e olhos a brilhar',

    'projects.title': 'Projetos',
    'contact.title': 'Ligações',
    'contact.intro': 'Conta-me o que estás a construir.',
    'contact.email': 'contato.felipe.kreulich@gmail.com',
    'contact.copy': 'Copiar endereço',
    'contact.copied': 'Endereço copiado',
    'contact.copy_failed': 'Seleciona e copia o endereço',
    'contact.external': 'abre numa janela nova',

    'maxim.build_it_yourself': 'Ninguém vem. Constrói tu',
    'maxim.design_for_the_fall': 'Todos os sistemas falham — desenha para a queda',
    'maxim.discipline': 'A disciplina dura mais do que a motivação',
    'maxim.silence': 'Silêncio, e depois execução',
    'maxim.rebuild': 'Parte, percebe, reconstrói melhor',
    'maxim.abyss': 'O abismo devolve o olhar. Publica na mesma',
```

- [ ] **Step 3: Verificar que os dois dicionários têm exatamente as mesmas chaves**

Run:

```bash
node --input-type=module -e '
import { dictionaries } from "./lib/i18n/dictionaries.ts"
const en = Object.keys(dictionaries.en).sort()
const pt = Object.keys(dictionaries.pt).sort()
const soEn = en.filter((k) => !pt.includes(k))
const soPt = pt.filter((k) => !en.includes(k))
if (soEn.length || soPt.length) {
  console.error("só em en:", soEn, "\nsó em pt:", soPt)
  process.exit(1)
}
console.log(`ok: ${en.length} chaves nos dois idiomas`)
'
```

Expected: `ok: N chaves nos dois idiomas`

- [ ] **Step 4: Confirmar que o build continua verde**

Run: `npm run build`
Expected: sucesso.

- [ ] **Step 5: Commit**

```bash
git add lib/i18n/dictionaries.ts
git commit -m "feat: chaves de tradução das três secções novas"
```

---

### Task 7: `components/sections/Hero.tsx`

**Files:**
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `components/visual/LetterGlitch`; `useLanguage()`; `public/avatar.png`; chave `hero.portrait_alt`.
- Produces: `export default function Hero()`. Ocupa `h-svh`.

- [ ] **Step 1: Escrever o componente**

Criar `components/sections/Hero.tsx`:

```tsx
"use client"

import Image from "next/image"
import LetterGlitch from "@/components/visual/LetterGlitch"
import { useLanguage } from "@/contexts/language/LanguageContext"

/**
 * A hero tem uma figura e um nome. Mais nada — sem eyebrow, sem localização,
 * sem CTA, sem indicador de scroll. A decisão está registada na spec, §4.1,
 * com o risco assumido.
 *
 * `h-svh` e não `h-screen`: em telemóvel o `100vh` conta a barra do browser
 * que se recolhe, e o nome nascia por baixo do fundo do ecrã.
 */
export default function Hero() {
  const { t } = useLanguage()

  return (
    <section
      id="hero"
      className="relative flex h-svh w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <LetterGlitch />
      </div>

      <div className="relative flex flex-col items-center px-6">
        <Image
          src="/avatar.png"
          alt={t("hero.portrait_alt")}
          width={736}
          height={680}
          priority
          /* O preloader espera por esta imagem antes de sair — o
             hooks/useAppProgress.ts procura img[data-critical]. */
          data-critical
          className="w-[54vw] max-w-[20rem] sm:w-[26vw] sm:max-w-[24rem] [filter:grayscale(1)_contrast(1.35)_brightness(0.92)]"
        />

        {/* Encostado à figura: o nome assina por baixo dela em vez de
            flutuar como um segundo bloco. */}
        <h1 className="mt-[-3%] text-center font-mono text-[clamp(1.5rem,5.5vw,4.5rem)] leading-[0.86] font-medium tracking-[-0.03em]">
          FELIPE KREULICH
        </h1>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Confirmar que compila e passa no lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: hero com figura e nome centrados sobre o glitch"
```

---

### Task 8: `components/sections/Projects.tsx`

**Files:**
- Create: `components/sections/Projects.tsx`

**Interfaces:**
- Consumes: `lib/projectsData.ts` (`projects`, `statusKey`); `lib/layout.ts` (`SECTION_CONTAINER`); `useLanguage()`.
- Produces: `export default function Projects()`.

- [ ] **Step 1: Escrever o componente**

Criar `components/sections/Projects.tsx`:

```tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { projects, statusKey } from "@/lib/projectsData"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { SECTION_CONTAINER } from "@/lib/layout"

/**
 * Lista e não grelha de cartões: três projetos numa grelha deixam demasiado
 * espaço vazio, e a lista deixa o texto respirar em vez de o cortar a três
 * linhas.
 *
 * A pré-visualização vive num painel colado à direita e troca com o hover em
 * vez de seguir o cursor: sem rastreio de rato, funciona com teclado, e não
 * há nada a perseguir quem lê.
 */
export default function Projects() {
  const { t } = useLanguage()
  const [ativo, setAtivo] = useState(projects[0].slug)
  const mostrado = projects.find((p) => p.slug === ativo) ?? projects[0]

  return (
    <section id="projects" className="py-32 sm:py-48">
      <div className={SECTION_CONTAINER}>
        <header className="mb-16 flex items-baseline gap-4">
          <span className="font-jp text-5xl leading-none" aria-hidden>
            創
          </span>
          <h2 className="font-mono text-xs tracking-[0.22em] uppercase opacity-55">
            {t("projects.title")}
          </h2>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)]">
          <ul className="divide-y divide-black/10">
            {projects.map((projeto) => (
              <li key={projeto.slug}>
                <a
                  href={projeto.links.live ?? projeto.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setAtivo(projeto.slug)}
                  onFocus={() => setAtivo(projeto.slug)}
                  className="group grid grid-cols-[2.5rem_1fr] items-start gap-x-4 py-8 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100 lg:opacity-55"
                >
                  <span className="font-mono text-xs tabular-nums opacity-45">
                    {projeto.index}
                  </span>

                  <span>
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-2xl sm:text-3xl">{projeto.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45">
                        {t(statusKey[projeto.status])} · {projeto.year}
                      </span>
                    </span>

                    <span className="mt-2 block max-w-prose text-sm opacity-70">
                      {t(projeto.summaryKey)}
                    </span>

                    <span className="mt-3 flex flex-wrap gap-x-4 font-mono text-[10px] tracking-[0.18em] uppercase opacity-45">
                      {projeto.stack.map((tec) => (
                        <span key={tec}>{tec}</span>
                      ))}
                    </span>

                    {/* Em ecrã estreito não há painel lateral onde pôr a
                        imagem: ela desce para dentro da própria linha. */}
                    <Image
                      src={projeto.preview.src}
                      alt={t(projeto.preview.altKey)}
                      width={projeto.preview.width}
                      height={projeto.preview.height}
                      className="mt-5 w-full grayscale lg:hidden"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Image
                key={mostrado.slug}
                src={mostrado.preview.src}
                alt={t(mostrado.preview.altKey)}
                width={mostrado.preview.width}
                height={mostrado.preview.height}
                className="w-full grayscale"
              />

              <p className="mt-5 max-w-prose text-sm leading-relaxed opacity-70">
                {t(mostrado.outcomeKey)}
              </p>

              {mostrado.metricKey && (
                <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase opacity-45">
                  {t(mostrado.metricKey)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Confirmar que compila e passa no lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Projects.tsx
git commit -m "feat: secção de projetos em lista com painel de pré-visualização"
```

---

### Task 9: `components/sections/Contact.tsx`

**Files:**
- Create: `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `components/visual/KanjiRing`; `lib/socials.ts` (`socials`); `useLanguage()`; chaves `contact.*`.
- Produces: `export default function Contact()`.

- [ ] **Step 1: Escrever o componente**

Criar `components/sections/Contact.tsx`:

```tsx
"use client"

import { useState } from "react"
import KanjiRing from "@/components/visual/KanjiRing"
import { socials } from "@/lib/socials"
import { useLanguage } from "@/contexts/language/LanguageContext"

type EstadoCopia = "nao" | "sim" | "falhou"

/**
 * O anel fecha o site com o mesmo gesto circular com que o preloader o abre.
 * As ligações vivem dentro dele, em texto: sem logótipos, para não trazer de
 * volta quatro identidades visuais que o resto do site não tem.
 */
export default function Contact() {
  const { t } = useLanguage()
  const [copiado, setCopiado] = useState<EstadoCopia>("nao")
  const email = t("contact.email")

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiado("sim")
    } catch {
      // Sem permissão, ou fora de contexto seguro. Dizer que falhou é melhor
      // do que fingir que copiou — o endereço continua visível e selecionável.
      setCopiado("falhou")
    }
    setTimeout(() => setCopiado("nao"), 2400)
  }

  const legenda =
    copiado === "sim"
      ? t("contact.copied")
      : copiado === "falhou"
        ? t("contact.copy_failed")
        : t("contact.copy")

  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden py-32"
    >
      {/* Maior do que a coluna de texto, e cortado pelas margens em ecrã
          estreito — de propósito: sugere que continua para fora. */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(120vw,52rem)] -translate-x-1/2 -translate-y-1/2">
        <KanjiRing />
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="font-jp text-5xl leading-none" aria-hidden>
          縁
        </span>
        <h2 className="mt-4 font-mono text-xs tracking-[0.22em] uppercase opacity-55">
          {t("contact.title")}
        </h2>

        <p className="mt-8 max-w-xs text-lg leading-snug">{t("contact.intro")}</p>

        <ul className="mt-10 flex flex-col items-center gap-3">
          {socials.map((social) => (
            <li key={social.url}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.nome}, ${t("contact.external")}`}
                className="flex items-baseline gap-3 font-mono text-sm opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
              >
                <span className="tracking-[0.18em] uppercase">{social.plataforma}</span>
                <span className="opacity-60">{social.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-2">
          <a
            href={`mailto:${email}`}
            className="font-mono text-sm underline-offset-4 hover:underline"
          >
            {email}
          </a>

          <button
            type="button"
            onClick={copiar}
            className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45 transition-opacity hover:opacity-80"
          >
            {legenda}
          </button>

          {/* O resultado da cópia tem de chegar a quem não vê o botão mudar. */}
          <span aria-live="polite" className="sr-only">
            {copiado === "nao" ? "" : legenda}
          </span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Confirmar que compila e passa no lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat: secção de contacto com anel de kanji e ligações"
```

---

### Task 10: A troca — montar o novo e demolir o velho

Esta é a única tarefa em que o build fica partido a meio. É deliberado: as oito secções antigas cruzam-se em imports demais para as desmontar uma a uma. O commit é atómico.

**Files:**
- Modify: `app/[lang]/page.tsx` (substituição integral)
- Modify: `app/[lang]/layout.tsx`
- Delete: `components/{about,career,manifesto,pulse,schedule,transition,background,footer,ui,client,hero,projects}/`, `components/ScrollRhythm.tsx`, `app/theme-script.tsx`, `hooks/{use-mobile,use-theme,useThemeMode,useHeroReveal,usePortraitReadout,useResponsiveDither}.ts`, `lib/{careerData,github,gridConfig,heroConfig,manifestoConfig,portraitConfig,sparks}.ts`, `shaders/halftone.{vert,frag}.ts`, `scripts/`, `assets/`, `components.json`

**Interfaces:**
- Consumes: `components/sections/{Hero,Projects,Contact}.tsx` das Tarefas 7–9.
- Produces: uma página com três secções e um layout sem tema, sem rodapé antigo e sem fundos de grelha.

- [ ] **Step 1: Substituir a página**

Substituir `app/[lang]/page.tsx` por:

```tsx
import Hero from "@/components/sections/Hero"
import Projects from "@/components/sections/Projects"
import Contact from "@/components/sections/Contact"

/**
 * Três secções e mais nada.
 *
 * Sem navegação lateral e sem observer de secção ativa: com três ecrãs, o
 * scroll é a navegação. A página deixou de ser componente de cliente — as
 * secções trazem o seu próprio "use client".
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <Contact />
    </main>
  )
}
```

- [ ] **Step 2: Acrescentar a fonte japonesa ao layout**

Em `app/[lang]/layout.tsx`, trocar o import de fontes por:

```tsx
import { Inter, IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
```

E acrescentar, depois do `ibmPlexMono`:

```tsx
/*
  O japonês é a identidade do site, não um detalhe. Sem esta fonte o browser
  cai para a CJK do sistema — Hiragino no Mac, Yu Gothic no Windows — e o
  site muda de cara conforme o sistema operativo.

  `preload: false` porque a Noto Sans JP chega particionada em dezenas de
  ficheiros por unicode-range: pré-carregá-los todos seria pior do que não
  pré-carregar nenhum.
*/
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-jp",
})
```

E na `<html>`, juntar a variável:

```tsx
className={`${inter.variable} ${ibmPlexMono.variable} ${notoSansJP.variable}`}
```

Por fim, declarar o utilitário no `@theme inline` de `app/globals.css` — a variável e a classe que a consome nascem juntas, senão os kanji das Tarefas 3, 5, 8 e 9 desenham-se com a fonte errada até à Tarefa 11:

```css
  --font-jp: var(--font-noto-sans-jp), "Hiragino Sans", "Yu Gothic", ui-monospace, monospace;
```

É isto que faz `font-jp` existir como classe do Tailwind 4, usada pelo `LetterGlitch`, pelo `KanjiRing` e pelos kanji de cabeçalho.

- [ ] **Step 3: Reduzir o corpo do layout**

No mesmo ficheiro, apagar os imports de `ClientLayout`, `FooterServer`, `ScrollRhythm`, `GridBackground`, `SectionGridColors` e `ThemeScript`, apagar o `<head>` inteiro, e substituir o `<body>` por:

```tsx
      <body className="font-sans antialiased">
        {/* Decide uma vez se há movimento e se o Canvas monta; tudo o que
            anima lê essa decisão daqui. */}
        <ReducedMotion>
          <SceneCanvas />
          <Preloader />
          <LanguageGate current={locale} />
          <LanguageProvider locale={locale}>
            <SmoothScroll />
            {children}
            <SpeedInsights />
          </LanguageProvider>
        </ReducedMotion>
      </body>
```

Antes de escrever isto, confirmar onde o `SmoothScroll` estava montado — se já vinha de dentro do `ClientLayout`, tem de passar para aqui:

```bash
grep -rn "SmoothScroll" app/ components/ | grep -v node_modules
```

- [ ] **Step 4: Apagar tudo o que ficou órfão**

```bash
rm -rf components/about components/career components/manifesto components/pulse \
       components/schedule components/transition components/background \
       components/footer components/ui components/client \
       components/hero components/projects \
       assets scripts
rm -f components/ScrollRhythm.tsx app/theme-script.tsx components.json
rm -f hooks/use-mobile.ts hooks/use-theme.ts hooks/useThemeMode.ts \
      hooks/useHeroReveal.ts hooks/usePortraitReadout.ts hooks/useResponsiveDither.ts
rm -f lib/careerData.ts lib/github.ts lib/gridConfig.ts lib/heroConfig.ts \
      lib/manifestoConfig.ts lib/portraitConfig.ts lib/sparks.ts
rm -f shaders/halftone.vert.ts shaders/halftone.frag.ts
rm -f public/hero-desktop.webp public/hero-mobile.webp \
      public/transition-desktop.webp public/transition-mobile.webp \
      public/section-1.mp4 public/section-1.webm public/section-1-poster.webp \
      public/word-video.mp4 public/portrait.webp public/iconpattern.svg \
      public/flag-en.webp public/flag-pt.webp
```

O `components.json` é a configuração do shadcn e deixa de ter razão de ser sem `components/ui/`.

- [ ] **Step 5: Encontrar e resolver os imports partidos**

Run: `npx tsc --noEmit`
Expected na primeira passagem: erros de módulos não encontrados.

Para cada erro, apagar o import e o uso. Não recriar nada. Os suspeitos habituais são o `LanguageGate` (pode importar as bandeiras de `public/flag-*`) e o `package.json`, que ainda refere `scripts/prepare-transition.mjs` no script `prepare:transition` — apagar essa linha. Repetir até `tsc` ficar limpo.

- [ ] **Step 6: Confirmar que o build volta a passar**

Run: `npm run build && npm run lint`
Expected: sucesso, e no output as rotas `/pt` e `/en` marcadas como estáticas.

- [ ] **Step 7: Ver o site a funcionar**

Run: `npm run dev`

Abrir `http://localhost:3000/pt` e confirmar, por esta ordem:
1. O preloader aparece, o contador chega a 100 e sai.
2. A hero tem o glitch japonês a animar, a figura e o nome por baixo.
3. Scroll suave até aos projetos; a lista tem três entradas e o painel da direita troca de imagem ao passar o rato.
4. Scroll até ao contacto; o anel de kanji roda conforme o scroll.
5. `http://localhost:3000/en` mostra o mesmo em inglês.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: três secções novas, oito antigas apagadas"
```

---

### Task 11: Papel e tinta — tokens, tema e poda do dicionário

**Files:**
- Modify: `app/globals.css`
- Modify: `lib/i18n/dictionaries.ts`
- Modify: `store/usePreloaderStore.ts` (uma constante)

**Interfaces:**
- Consumes: nada.
- Produces: tokens `--paper`, `--ink`, `--ink-60`, `--ink-35`, `--ink-14`; utilitário Tailwind `font-jp`; `--preloader-*` a papel e tinta. Nenhum token com cor.

- [ ] **Step 1: Substituir o bloco de tokens**

Em `app/globals.css`, apagar o `.dark { ... }` inteiro (linhas 72–115) e o `@custom-variant dark (&:is(.dark *));` (linha 11). Substituir o `:root { ... }` (linhas 13–70) por:

```css
:root {
  /* Dois materiais e as suas graduações. Não há mais cor nenhuma no site. */
  --paper: #ffffff;
  --ink: #0a0a0a;
  --ink-60: color-mix(in oklab, var(--ink) 60%, transparent);
  --ink-35: color-mix(in oklab, var(--ink) 35%, transparent);
  --ink-14: color-mix(in oklab, var(--ink) 14%, transparent);

  --background: var(--paper);
  --foreground: var(--ink);
  --border: var(--ink-14);
  --ring: var(--ink-35);

  --radius: 0rem;

  /* O preloader deixa de ser luz no escuro e passa a tinta em papel. O
     shader não muda: pinta uBg com o alpha de cobertura, e uAccent na orla e
     no repouso. Com o accent em preto, o grão de repouso passa a ser a
     textura do papel em vez de um brilho. */
  --preloader-bg: var(--paper);
  --preloader-fg: var(--ink);
  --preloader-accent: var(--ink);
}
```

- [ ] **Step 2: Confirmar que o `--font-jp` sobreviveu**

O utilitário foi declarado na Tarefa 10, Passo 2, junto com a fonte que o alimenta. A substituição do `:root` no passo anterior não lhe toca — ele vive no `@theme inline` —, mas confirmar é barato:

```bash
grep -n "font-jp" app/globals.css
```

Expected: uma linha, dentro do `@theme inline`. Se desapareceu, repor.

- [ ] **Step 3: Podar o `@theme inline`, o `@layer base` e o `@layer utilities`**

Apagar as entradas de `@theme inline` que apontem para tokens que já não existem (`--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--chart-*`, `--sidebar-*`). Apagar dos dois `@layer` tudo o que só servia as secções apagadas.

Run após cada corte: `npm run build`
Expected: sucesso. Se falhar, o token ainda está a ser usado — encontrar onde com `grep -rn "<token>" app/ components/ lib/`.

- [ ] **Step 4: Podar o dicionário**

Apagar de `lib/i18n/dictionaries.ts`, nos dois idiomas, todas as chaves com os prefixos `about.`, `work.`, `career.`, `manifesto.`, `services.`, `blog.`, `thoughts.`, `coffee.`, `calendar.`, `schedule.`, `transition.`, `connect.`, `footer.`, `intro.`, `nav.`, `pulse.`, `portfolio.`, e as chaves `hero.eyebrow`, `hero.headline`, `hero.sub`, `hero.cta_work`, `hero.cta_contact`.

Manter: `meta.*`, `hero.portrait_alt`, `projects.*`, `contact.*`, `maxim.*`.

- [ ] **Step 5: Verificar que nenhuma chave usada desapareceu**

Run:

```bash
node --input-type=module -e '
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { dictionaries } from "./lib/i18n/dictionaries.ts"

const ficheiros = []
const andar = (dir) => {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome)
    if (statSync(caminho).isDirectory()) andar(caminho)
    else if (/\.tsx?$/.test(nome)) ficheiros.push(caminho)
  }
}
for (const dir of ["app", "components", "lib", "contexts", "hooks"]) andar(dir)

const usadas = new Set()
for (const f of ficheiros) {
  for (const m of readFileSync(f, "utf8").matchAll(/\bt\(\s*"([^"]+)"\s*\)/g)) usadas.add(m[1])
}

const existentes = new Set(Object.keys(dictionaries.pt))
const faltam = [...usadas].filter((k) => !existentes.has(k))
if (faltam.length) { console.error("usadas mas sem tradução:", faltam); process.exit(1) }

// As projects.* e maxim.* são consultadas por chave dinâmica —
// t(projeto.summaryKey), t(m.labelKey) — e a heurística não as vê.
const orfas = [...existentes].filter(
  (k) => !usadas.has(k) && !/^(meta|projects|maxim)\./.test(k),
)
console.log(`ok: ${usadas.size} chaves usadas, ${existentes.size} no dicionário`)
if (orfas.length) console.log("candidatas a apagar:", orfas)
'
```

Expected: `ok: N chaves usadas` e nenhuma chave em falta.

- [ ] **Step 6: Aferir a intensidade do dissolve em repouso**

`IDLE_DISSOLVE_INTENSITY` em `store/usePreloaderStore.ts` está a `0.15`, afinado para ciano sobre preto. Preto a 15% sobre branco lê-se muito mais.

Run: `npm run dev`, abrir a hero, e baixar o valor até o grão ser textura e não mancha. Ponto de partida sugerido: `0.06`.

- [ ] **Step 7: Confirmar o build e fazer commit**

```bash
npm run build && npm run lint
git add app/globals.css lib/i18n/dictionaries.ts store/usePreloaderStore.ts
git commit -m "feat: papel e tinta — tokens sem cor, dicionário podado"
```

---

### Task 12: Limpar as dependências

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (gerado)

**Interfaces:**
- Consumes: nada.
- Produces: um `package.json` só com o que o site usa.

- [ ] **Step 1: Confirmar que nenhuma das dependências a remover é importada**

```bash
for p in @paper-design/shaders-react @react-three/postprocessing postprocessing \
         motion recharts embla-carousel-react cmdk vaul react-day-picker \
         date-fns input-otp react-hook-form @hookform/resolvers zod \
         next-themes react-resizable-panels sonner class-variance-authority \
         lucide-react simple-icons framer-motion; do
  n=$(grep -rl "from \"$p" --include="*.ts" --include="*.tsx" \
      app components lib hooks contexts store shaders 2>/dev/null | wc -l | tr -d ' ')
  echo "$n  $p"
done
```

Expected: `0` em todas. Qualquer valor diferente de zero é um import que a Tarefa 10 deixou para trás — resolver antes de continuar.

- [ ] **Step 2: Remover**

```bash
npm uninstall @paper-design/shaders-react @react-three/postprocessing postprocessing \
  motion recharts embla-carousel-react cmdk vaul react-day-picker date-fns \
  input-otp react-hook-form @hookform/resolvers zod next-themes \
  react-resizable-panels sonner class-variance-authority lucide-react simple-icons
npm uninstall $(node -p "Object.keys(require('./package.json').dependencies).filter(d => d.startsWith('@radix-ui/')).join(' ')")
```

- [ ] **Step 3: Remover as de desenvolvimento que ficaram órfãs**

O `sharp` só servia os scripts de preparação de imagem, apagados na Tarefa 10. O `tw-animate-css` só servia os componentes shadcn — apagar primeiro o `@import "tw-animate-css";` da linha 2 do `globals.css`.

```bash
grep -rn "tw-animate-css" app/ && echo "AINDA IMPORTADO — apagar a linha primeiro" || npm uninstall tw-animate-css
npm uninstall sharp
```

- [ ] **Step 4: Reinstalar do zero e confirmar que nada partiu**

```bash
rm -rf node_modules .next
npm install
npm run build && npm run lint
```

Expected: build com sucesso.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/globals.css
git commit -m "chore: remover ~20 dependências que deixaram de ser usadas"
```

---

### Task 13: Verificação final

**Files:** nenhum, salvo correções que apareçam.

- [ ] **Step 1: Correr os testes todos**

Run: `node --test lib/`
Expected: `pass 15`, `fail 0`

- [ ] **Step 2: Confirmar que as duas rotas são estáticas**

Run: `npm run build`
Expected: no quadro de rotas, `/pt` e `/en` marcadas como estáticas.

- [ ] **Step 3: Confirmar que o conteúdo chega em HTML, sem JavaScript**

```bash
npm run build && npm start &
sleep 6
curl -s http://localhost:3000/pt | grep -c "CipherMesh"
curl -s http://localhost:3000/en | grep -c "Worm Hole"
curl -s http://localhost:3000/pt | grep -o 'lang="[^"]*"' | head -1
kill %1
```

Expected: contagens ≥ 1 nas duas, e `lang="pt-PT"`. Se der 0, uma secção está a renderizar só no cliente.

- [ ] **Step 4: Confirmar que o `three` não está no bundle inicial**

Run: `npm run analyze`
Expected: o `three` aparece só num chunk carregado dinamicamente, nunca no de entrada. É o `SceneCanvas` que garante isto com `next/dynamic`; se aparecer no inicial, alguém importou o `Scene` diretamente.

- [ ] **Step 5: Confirmar que nada anima com movimento reduzido**

No DevTools, Rendering → *Emulate CSS prefers-reduced-motion: reduce*, e recarregar.

Expected: o preloader sai por fade, o glitch fica estático, o anel não roda, e o scroll é o nativo do browser. No separador Performance, nenhuma atividade sustentada de rAF depois de o preloader sair.

- [ ] **Step 6: Confirmar que a fonte japonesa carregou mesmo**

No DevTools, Network → Font, recarregar e procurar ficheiros da Noto Sans JP. Depois, no Elements, selecionar um kanji e ver em Computed → Rendered Fonts.

Expected: `Noto Sans JP`.

**Se aparecer Hiragino, Yu Gothic ou outra do sistema**, o `next/font` não trouxe os intervalos japoneses. Plano B, sem dependências novas: apagar o `Noto_Sans_JP` do layout e deixar o `--font-jp` com a pilha do sistema, que já lá está como fallback. O site fica com aspeto ligeiramente diferente entre sistemas operativos — é o preço, e é o que já acontece hoje no preloader. Registar a decisão num comentário no `globals.css`.

- [ ] **Step 7: Confirmar em telemóvel**

DevTools em iPhone SE (375×667) e num Android largo.

Expected: a figura e o nome cabem no ecrã sem scroll dentro da hero; a lista de projetos mostra as miniaturas em vez do painel lateral; o anel do contacto é cortado pelas margens sem cortar as ligações.

- [ ] **Step 8: Confirmar que não ficou lixo**

```bash
git status --short
grep -rn "TODO\|FIXME\|placeholder" app/ components/ lib/ --include="*.ts" --include="*.tsx"
```

Expected: árvore limpa, e nenhum TODO novo.

- [ ] **Step 9: Commit final**

```bash
git add -A
git commit -m "chore: verificação final do redesenho"
```

---

## Notas para quem executar

**A ordem importa.** As Tarefas 1–9 deixam o site antigo a funcionar. Só a 10 é que parte o build, e resolve-o dentro da própria tarefa. Não começar pela 10.

**O preloader não se toca.** Se alguma tarefa parecer pedir uma alteração a `components/preloader/*`, `store/dissolveBus.ts`, `hooks/useAppProgress.ts` ou `shaders/dissolve.*`, é sinal de que algo correu mal — parar e perguntar. As únicas alterações previstas são três valores CSS na Tarefa 11 e a constante `IDLE_DISSOLVE_INTENSITY` no Passo 6 da mesma tarefa.

**Nada de dependências novas.** Se uma tarefa parecer precisar de uma biblioteca, não precisa. Os testes correm com `node --test`, que lê TypeScript sem transpilar, no Node 25.

**A rede é o git.** O ponto de retorno antes de tudo isto é o commit `1de3ad0`. Não há cópia arquivada das secções apagadas — só o histórico.
