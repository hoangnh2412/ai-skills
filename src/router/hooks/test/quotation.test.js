import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { toMD, risk, rom, price } from "../../../presales/skills/minipower-presales-quotation/lib/money.js"
import { validate } from "../../../presales/skills/minipower-presales-quotation/lib/validate.js"
import { lineMH, nfrMH, sumMH } from "../../../presales/skills/minipower-presales-estimation-ulnl/lib/calc.js"

const ROOT = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))))

function goldenEstimate() {
  const lines = [
    { id: "1", code: "CN_WEB1", mh: lineMH({ code: "CN_WEB1" }), out_of_scope: false, group: false },
    { id: "2", code: "DS2", mh: lineMH({ code: "DS2" }), out_of_scope: false, group: false },
    { id: "3", code: "BC2", mh: lineMH({ code: "BC2" }), out_of_scope: false, group: false },
  ]
  const nfr_lines = [{ code: "TP", mh: nfrMH("TP") }]
  return {
    schema: "estimate-v1.0",
    catalog_id: "ulnl-default",
    catalog_version: "1.0.0",
    lines,
    nfr_lines,
    sum_mh: sumMH(lines, nfr_lines),
    open_assumptions: 0,
  }
}

test("T1 — 77 MH → ≈10.3 MD, ROM 9.3–11.3", () => {
  const e = goldenEstimate()
  assert.equal(e.sum_mh, 77)
  const md = toMD(e.sum_mh)
  assert.equal(md, 10.3)
  assert.deepEqual(rom(md), { low: 9.3, high: 11.3 })
})

test("T2 — bảng đã có số, không LLM", () => {
  const e = goldenEstimate()
  assert.equal(typeof e.sum_mh, "number")
})

test("T8 — risk 2 lần giống; override thiếu reason FAIL", () => {
  const e = goldenEstimate()
  assert.deepEqual(risk(e), risk(e))
  assert.throws(() => risk(e, { buffer: 0.3, approved_by: "x" }))
})

test("T7 — validate 6 luật", () => {
  const rules = new Set()
  const base = goldenEstimate()
  const cases = [
    { ...base, schema: "nope" },
    { ...base, catalog_id: "other" },
    { ...base, lines: [{ ...base.lines[0], adjust_pct: 0.2 }] },
    { ...base, lines: [{ ...base.lines[0], group: true, code: "NV1", id: "g", mh: 0, out_of_scope: false }] },
    {
      ...base,
      lines: [
        { id: "a", code: "CN_WEB1", mh: 7, out_of_scope: false, group: false, screen: "S" },
        { id: "b", code: "GD_WEB1", mh: 6, out_of_scope: false, group: false, screen: "S" },
      ],
    },
    { ...base, lines: [{ id: "z", code: "BC4", mh: 88, out_of_scope: false, group: false }], hard_number: true },
    { ...base, lines: [{ id: "o", code: "NV1", mh: 4, out_of_scope: true, group: false, include_in_sum: true }] },
  ]
  for (const c of cases) {
    const r = validate(c)
    assert.equal(r.ok, false, JSON.stringify(r.errors))
    r.errors.forEach((e) => rules.add(e.rule))
  }
  for (const need of [
    "schema-id",
    "catalog_id",
    "adjust-pct",
    "group-has-code",
    "cn-plus-gd",
    "star4-hard-number",
    "oos-in-sum",
  ]) {
    assert.ok(rules.has(need), `thiếu luật ${need}: ${[...rules]}`)
  }
})

test("T9 — quotation đọc estimate; schema thiếu field đỏ", () => {
  const e = goldenEstimate()
  assert.equal(validate(e).ok, true)
  const { schema: _, ...stripped } = e
  assert.equal(validate(stripped).ok, false)
})

test("price cần rate runtime", () => {
  assert.equal(price(10.3, 1), 10.3)
  assert.throws(() => price(10, null))
})

test("T15 — không commit rate_md số trong pack quotation (chỉ example null)", () => {
  const ex = JSON.parse(
    readFileSync(
      join(ROOT, "presales/skills/minipower-presales-quotation/quotation-rates.json.example"),
      "utf8",
    ),
  )
  assert.equal(ex.rate_md, null)
})
