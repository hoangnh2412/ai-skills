import test from "node:test"
import assert from "node:assert/strict"
import { classify } from "../../../presales/skills/minipower-presales-estimation-ulnl/lib/classify.js"
import { lineMH, nfrMH, sumMH } from "../../../presales/skills/minipower-presales-estimation-ulnl/lib/calc.js"

test("T3 — biên fields/steps/columns/refs", () => {
  assert.equal(classify({ kind: "gd_web", fields: 9 }).code, "GD_WEB1")
  assert.equal(classify({ kind: "gd_web", fields: 10 }).code, "GD_WEB2")
  assert.equal(classify({ kind: "ds", columns: 20 }).code, "DS2")
  assert.equal(classify({ kind: "ds", columns: 21 }).code, "DS3")
  assert.equal(classify({ kind: "nv", steps: 4 }).code, "NV1")
  assert.equal(classify({ kind: "nv", steps: 5 }).code, "NV2")
  assert.equal(classify({ kind: "nv", steps: 10 }).code, "NV2")
  assert.equal(classify({ kind: "nv", steps: 11 }).code, "NV3")
  assert.equal(classify({ kind: "dm", refs: 3 }).code, "DM2")
  assert.equal(classify({ kind: "dm", refs: 0 }).code, "DM1")
})

test("T4 — classify idempotent", () => {
  const a = { kind: "cn_web", fields: 12 }
  assert.deepEqual(classify(a), classify(a))
})

test("T5 — unclear → *4 + open_question", () => {
  const r = classify({ kind: "bc", unclear: true })
  assert.equal(r.code, "BC4")
  assert.equal(r.open_question, true)
})

test("T6 — tách CN_WEB 40 trường / TT_DB 24 bước", () => {
  const a = classify({ kind: "cn_web", fields: 40 })
  assert.equal(a.code, "CN_WEB2")
  assert.equal(a.split, 2)
  const b = classify({ kind: "tt_db", steps: 24 })
  assert.equal(b.code, "TT_DB2")
  assert.equal(b.split, 2)
})

test("T1 — ví dụ §12: 77 MH", () => {
  const lines = [
    { id: "1", code: "CN_WEB1", mh: lineMH({ code: "CN_WEB1" }), out_of_scope: false, group: false },
    { id: "2", code: "DS2", mh: lineMH({ code: "DS2" }), out_of_scope: false, group: false },
    { id: "3", code: "BC2", mh: lineMH({ code: "BC2" }), out_of_scope: false, group: false },
  ]
  const nfr = [{ code: "TP", mh: nfrMH("TP") }]
  assert.equal(sumMH(lines, nfr), 77)
})
