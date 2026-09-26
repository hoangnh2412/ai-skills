import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const CAT = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../catalog/ulnl-default.json"), "utf8"),
)

export function catalog() {
  return CAT
}

export function lineMH({ code, reuse_pct = 0, adjust_pct = 0 }) {
  const row = CAT.codes[code]
  if (!row) throw new Error(`mã ngoài catalog: ${code}`)
  const base = row.gp + row.pt + row.kt
  return round4(base * (1 - reuse_pct) * (1 + adjust_pct))
}

export function nfrMH(code) {
  const v = CAT.nfr[code]
  if (v == null) throw new Error(`NFR ngoài catalog: ${code}`)
  return v
}

export function sumMH(lines, nfrLines = []) {
  let s = 0
  for (const l of lines) {
    if (l.out_of_scope || l.group) continue
    s += l.mh
  }
  for (const n of nfrLines) s += n.mh
  return round4(s)
}

function round4(n) {
  return Math.round(n * 10000) / 10000
}
