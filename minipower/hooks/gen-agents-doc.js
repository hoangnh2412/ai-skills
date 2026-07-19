#!/usr/bin/env node
/**
 * Minipower — sinh bảng map DOC→phase trong agents/auto-routing.md từ rules.json (R3).
 *
 * Bảng nằm giữa 2 marker HTML comment; mọi thứ ngoài marker do người viết tay.
 * Nhờ đó "thêm DOC-19 = 1 dòng rules.json" — chạy `npm run gen` là doc tự cập nhật.
 *
 *   node gen-agents-doc.js          # ghi lại doc
 *   node gen-agents-doc.js --check  # CI: exit 1 nếu doc lệch rules.json (không ghi)
 */

import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { PHASE_ORDER, docsForPhase, formatDocRanges } from "./lib/rules.js"

const DOC_PATH = fileURLToPath(new URL("../agents/auto-routing.md", import.meta.url))
const BEGIN = "<!-- BEGIN generated: phase-map (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->"
const END = "<!-- END generated: phase-map -->"

function buildTable() {
  const rows = [
    "| Phase | DOC | Skill con |",
    "|-------|-----|-----------|",
  ]
  for (const phase of PHASE_ORDER) {
    const nums = docsForPhase(phase)
    if (!nums.length) continue
    rows.push(`| **${phase}** | DOC-${formatDocRanges(nums)} | \`skills/${phase}/SKILL.md\` |`)
  }
  return rows.join("\n")
}

function render(current) {
  const block = `${BEGIN}\n\n${buildTable()}\n\n${END}`
  const re = new RegExp(`${escape(BEGIN)}[\\s\\S]*?${escape(END)}`)
  if (!re.test(current)) {
    throw new Error(`Không tìm thấy marker generated trong ${DOC_PATH}. Thêm cặp:\n${BEGIN}\n${END}`)
  }
  return current.replace(re, block)
}

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const current = readFileSync(DOC_PATH, "utf8")
const next = render(current)

if (process.argv.includes("--check")) {
  if (next !== current) {
    process.stderr.write(
      "agents/auto-routing.md lệch rules.json. Chạy `npm run gen` rồi commit.\n",
    )
    process.exit(1)
  }
  process.stdout.write("auto-routing.md đồng bộ với rules.json.\n")
  process.exit(0)
}

if (next !== current) {
  writeFileSync(DOC_PATH, next)
  process.stdout.write("Đã cập nhật agents/auto-routing.md từ rules.json.\n")
} else {
  process.stdout.write("agents/auto-routing.md đã đồng bộ — không đổi.\n")
}
