import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const SCHEMA = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../../schema/estimate-v1.0.json"), "utf8"),
)
const CAT = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../minipower-presales-estimation-ulnl/catalog/ulnl-default.json"),
    "utf8",
  ),
)

const STAR4 = /4$/

export function validate(estimate) {
  const errors = []
  for (const k of SCHEMA.required) {
    if (estimate[k] == null) errors.push({ rule: "schema-field", field: k })
  }
  if (estimate.schema !== SCHEMA.schema) errors.push({ rule: "schema-id", field: "schema" })
  if (estimate.catalog_id && estimate.catalog_id !== CAT.catalog_id) {
    errors.push({ rule: "catalog_id", id: estimate.catalog_id })
  }
  const screens = new Map()
  for (const l of estimate.lines || []) {
    for (const k of SCHEMA.line_required) {
      if (l[k] == null) errors.push({ rule: "line-field", id: l.id, field: k })
    }
    if (l.group && l.code) errors.push({ rule: "group-has-code", id: l.id })
    if (Math.abs(l.adjust_pct || 0) > 0.1 && !l.approved_by) {
      errors.push({ rule: "adjust-pct", id: l.id })
    }
    if (l.out_of_scope && l.mh > 0 && l.counted !== false) {
      /* counted into sum checked below */
    }
    if (l.screen) {
      const arr = screens.get(l.screen) || []
      arr.push(l.code)
      screens.set(l.screen, arr)
    }
  }
  for (const [screen, codes] of screens) {
    const cn = codes.some((c) => String(c).startsWith("CN_WEB"))
    const gd = codes.some((c) => String(c).startsWith("GD_WEB"))
    if (cn && gd) errors.push({ rule: "cn-plus-gd", screen })
  }
  const star4 = (estimate.lines || []).filter((l) => !l.out_of_scope && STAR4.test(l.code || ""))
  if (star4.length && estimate.hard_number === true) {
    errors.push({ rule: "star4-hard-number" })
  }
  const counted = (estimate.lines || []).filter((l) => l.out_of_scope && l.include_in_sum)
  if (counted.length) errors.push({ rule: "oos-in-sum", ids: counted.map((l) => l.id) })
  return { ok: errors.length === 0, errors }
}
