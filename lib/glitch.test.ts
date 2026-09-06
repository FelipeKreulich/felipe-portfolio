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
 * A regressão do bug do React Bits, com a forma que o componente lhe dá:
 * uma célula com estado, um passo por frame.
 *
 * O que partia no original era o valor de partida ser a string CSS que a
 * própria interpolação tinha produzido na frame anterior. Aqui o `from`
 * fica em hex e o `css` é só valor de pintura — se alguém voltar a
 * realimentar um com o outro, o `lerpColor` rebenta e este teste cai.
 *
 * Passar sempre os mesmos dois literais em cada iteração não serviria: o
 * `hexToRgb` nunca chegaria a ver nada que não fosse hex, e o teste passava
 * de igual maneira com o bug presente.
 */
test("uma célula interpolada frame a frame chega à cor de destino", () => {
  const cell = { from: "#0a0a0a", to: "#9a9a9a", css: "#0a0a0a", p: 0 }
  let pintadas = 0

  for (let frame = 0; frame < 30 && cell.p < 1; frame++) {
    cell.p = Math.min(1, cell.p + 0.06)
    cell.css = lerpColor(cell.from, cell.to, cell.p)
    pintadas++
  }

  assert.equal(cell.p, 1)
  assert.equal(cell.css, "rgb(154, 154, 154)")
  // 17 e não 1: no bug original só a primeira frame é que pintava.
  assert.equal(pintadas, 17)
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
