import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const BANDS = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../catalog/risk-bands.json"), "utf8"),
)

const STAR4 = /4$/

export function toMD(mh, mhPerMd = 7.5) {
  return Math.round((mh / mhPerMd) * 10) / 10
}

export function risk(estimate, override) {
  if (override) {
    if (!override.reason || !override.approved_by) {
      throw new Error("risk override thiếu reason hoặc approved_by")
    }
    return { band: "override", buffer: override.buffer, machine: machineBand(estimate) }
  }
  const b = machineBand(estimate)
  const spec = BANDS.bands[b]
  return { band: b, buffer: spec.min, machine: b }
}

function machineBand(estimate) {
  const lines = (estimate.lines || []).filter((l) => !l.out_of_scope && !l.group)
  const star4 = lines.filter((l) => STAR4.test(l.code))
  const mh = lines.reduce((s, l) => s + l.mh, 0) || 1
  const star4mh = star4.reduce((s, l) => s + l.mh, 0)
  const open = estimate.open_assumptions ?? 0
  const v = BANDS.vague_if
  if (
    star4.length >= v.star4_lines_gte ||
    star4mh / mh >= v.star4_mh_ratio_gte ||
    open >= v.open_assumptions_gte
  ) {
    return "vague"
  }
  return "clear"
}

export function price(md, rateMd) {
  if (rateMd == null) throw new Error("thiếu rate_md (file local, không commit)")
  return Math.round(md * rateMd * 100) / 100
}

export function rom(md) {
  return { low: round1(md * 0.9), high: round1(md * 1.1) }
}

function round1(n) {
  return Math.round(n * 10) / 10
}
