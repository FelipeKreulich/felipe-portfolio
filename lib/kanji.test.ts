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
