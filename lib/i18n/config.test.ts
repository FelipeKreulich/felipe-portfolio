import { test } from "node:test"
import assert from "node:assert/strict"
import { negotiateLocale } from "./config.ts"

test("negotiateLocale respeita a ordem de qualidade", () => {
  assert.equal(negotiateLocale("en-GB,en;q=0.9,pt;q=0.8"), "en")
  assert.equal(negotiateLocale("fr;q=1,pt-BR;q=0.5,en;q=0.4"), "pt")
  assert.equal(negotiateLocale("en;q=0.2,pt-PT;q=0.9"), "pt")
})

test("negotiateLocale cai no idioma por omissão", () => {
  assert.equal(negotiateLocale(null), "pt")
  assert.equal(negotiateLocale("de,fr;q=0.8"), "pt")
})
