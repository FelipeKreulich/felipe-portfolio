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
