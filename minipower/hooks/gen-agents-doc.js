#!/usr/bin/env node
/**
 * Minipower — sinh các bảng "rules-as-data" từ rules.json (R3 + N1/N2/N3/N4).
 *
 * Mỗi target = 1 file có cặp marker HTML comment; generator thay phần GIỮA marker,
 * mọi thứ ngoài marker do người viết tay. Nhờ đó "thêm DOC-19 / intent / role = sửa
 * rules.json" — chạy `npm run gen` là mọi doc tự cập nhật.
 *
 *   node gen-agents-doc.js          # ghi lại mọi target
 *   node gen-agents-doc.js --check  # CI: exit 1 nếu bất kỳ target lệch rules.json
 *
 * Target:
 *   agents/auto-routing.md          — bảng map DOC→phase
 *   agents/project-state.md         — bảng giai đoạn dự án → phase → vai trò (N2)
 *   agents/context-load.md          — chuỗi ngữ cảnh auto-load (N4)
 *   skills/readiness-gate/SKILL.md  — bảng tiền đề theo intent (N1)
 *   roles/README.md                 — chỉ mục vai trò (N3)
 *   hooks/hooks.json                — hook wiring bản plugin (nguồn: settings.fragment.json)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import {
  PHASE_ORDER,
  PHASE_META,
  ROLES,
  PREREQ_BY_INTENT,
  PROJECT_MODES,
  CONTEXT_CHAIN,
  APPROVAL_GATES,
  docsForPhase,
  formatDocRanges,
  docLabel,
  docScope,
} from "./lib/rules.js"

const rel = (p) => fileURLToPath(new URL(p, import.meta.url))

/** Mô tả tình huống mỗi mode — chữ cho NGƯỜI, không phải luật máy (luật ở rules.json). */
const MODE_NOTE = {
  standard: "Sản phẩm mới / outsource; hoặc MVP lên đời",
  mvp: "Chỉ cần chạy được, tài liệu cơ bản",
  maintain: "Hệ chạy nhiều năm, tài liệu cũ rời rạc",
}
const marker = (id) =>
  `<!-- BEGIN generated: ${id} (nguồn: hooks/lib/rules.json — chạy \`npm run gen\`) -->`
const END = (id) => `<!-- END generated: ${id} -->`

function phaseMapTable() {
  const rows = ["| Phase | DOC | Skill con |", "|-------|-----|-----------|"]
  for (const phase of PHASE_ORDER) {
    const nums = docsForPhase(phase)
    if (!nums.length) continue
    rows.push(`| **${phase}** | DOC-${formatDocRanges(nums)} | \`skills/${phase}/SKILL.md\` |`)
  }
  return rows.join("\n")
}

function projectStateTable() {
  const rows = [
    "| Giai đoạn dự án | Phase minipower | Vai trò chính |",
    "|-----------------|-----------------|----------------|",
  ]
  for (const phase of PHASE_ORDER) {
    const meta = PHASE_META[phase]
    if (!meta) continue
    rows.push(`| ${meta.state} | \`${phase}\` | ${meta.role} |`)
  }
  return rows.join("\n")
}

function contextChainTable() {
  const rows = ["| # | Nguồn ngữ cảnh | Vị trí |", "|---|----------------|--------|"]
  CONTEXT_CHAIN.forEach((c, i) => {
    const where = c.doc ? docLabel(c.doc) : `\`${c.path}\``
    rows.push(`| ${i + 1} | ${c.label} | ${where} |`)
  })
  return rows.join("\n")
}

function prereqTable() {
  const rows = [
    "| Intent | Tiền đề cần có | Kiểm ở đâu |",
    "|--------|----------------|------------|",
  ]
  for (const it of PREREQ_BY_INTENT) {
    const reqs = it.requires.map(docLabel).join(" · ")
    const scopes = new Set(it.requires.map(docScope))
    const where = scopes.has("module")
      ? scopes.has("project")
        ? "module + dự án"
        : "theo module"
      : "cấp dự án"
    rows.push(`| **${it.label}** | ${reqs} | ${where} |`)
  }
  return rows.join("\n")
}

function approvalGateTable() {
  const rows = [
    "| # | Cổng (người chốt) | DOC duyệt | Mở khoá bước sau |",
    "|---|-------------------|-----------|------------------|",
  ]
  APPROVAL_GATES.forEach((g, i) => {
    rows.push(`| ${i + 1} | **${g.label}** | ${docLabel(g.approve)} | ${g.unlocks} |`)
  })
  return rows.join("\n")
}

function projectModesTable() {
  const rows = [
    "| Chế độ | Tình huống | DOC cần điền (`docs_focus`) | prereq | `02-baseline` | `_legacy` |",
    "|--------|------------|------------------------------|:------:|:-------------:|:---------:|",
  ]
  for (const [id, cfg] of Object.entries(PROJECT_MODES)) {
    const focus =
      cfg.docs_focus === "all"
        ? "**tất cả 19 DOC**"
        : `DOC-${formatDocRanges(cfg.docs_focus.map(Number))}`
    const g = cfg.gates
    rows.push(
      `| **${cfg.label}** (\`${id}\`) | ${MODE_NOTE[id] || ""} | ${focus} | ${g.prereq} | ${g.baseline} | ${g.legacy_read} |`,
    )
  }
  return rows.join("\n")
}

function rolesTable() {
  const rows = ["| Vai trò | Chức danh | Phase liên quan | File |", "|---------|-----------|-----------------|------|"]
  for (const r of ROLES) {
    rows.push(`| **${r.id}** | ${r.title} | ${r.phase} | [${r.file}](${r.file}) |`)
  }
  return rows.join("\n")
}

const TARGETS = [
  { file: rel("../agents/auto-routing.md"), id: "phase-map", build: phaseMapTable },
  { file: rel("../agents/project-state.md"), id: "project-state", build: projectStateTable },
  { file: rel("../agents/context-load.md"), id: "context-chain", build: contextChainTable },
  { file: rel("../skills/readiness-gate/SKILL.md"), id: "prereq-by-intent", build: prereqTable },
  { file: rel("../agents/approval-gate.md"), id: "approval-gates", build: approvalGateTable },
  { file: rel("../roles/README.md"), id: "roles-index", build: rolesTable },
  { file: rel("../SKILL.md"), id: "project-modes", build: projectModesTable },
]

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ── Plugin hooks.json (sinh từ settings.fragment.json) ──────────────────────
// Bản plugin của hook wiring: cùng nội dung fragment, chỉ thay path tuyệt đối
// (placeholder cài đặt) bằng ${CLAUDE_PLUGIN_ROOT}. SSOT ở fragment — sửa fragment,
// chạy `npm run gen`, hooks.json tự cập nhật (ADR 2026-07-26 plugin §1.4).
const FRAGMENT = rel("../install/claude/settings.fragment.json")
const PLUGIN_HOOKS = rel("hooks.json")
const INSTALL_PLACEHOLDER = "/ABSOLUTE/PATH/TO/ai-skills/minipower"

function pluginHooksJson() {
  const frag = JSON.parse(readFileSync(FRAGMENT, "utf8"))
  const hooks = JSON.parse(
    JSON.stringify(frag.hooks).split(INSTALL_PLACEHOLDER).join("${CLAUDE_PLUGIN_ROOT}"),
  )
  return JSON.stringify({ hooks }, null, 2) + "\n"
}

function render(target) {
  const current = readFileSync(target.file, "utf8")
  const begin = marker(target.id)
  const end = END(target.id)
  const block = `${begin}\n\n${target.build()}\n\n${end}`
  const re = new RegExp(`${escape(begin)}[\\s\\S]*?${escape(end)}`)
  if (!re.test(current)) {
    throw new Error(`Không tìm thấy marker "${target.id}" trong ${target.file}. Thêm cặp:\n${begin}\n${end}`)
  }
  return { current, next: current.replace(re, block) }
}

const check = process.argv.includes("--check")
let drift = false

for (const target of TARGETS) {
  const { current, next } = render(target)
  const name = target.file.split("/minipower/")[1] || target.file
  if (check) {
    if (next !== current) {
      drift = true
      process.stderr.write(`${name} lệch rules.json. Chạy \`npm run gen\` rồi commit.\n`)
    }
  } else if (next !== current) {
    writeFileSync(target.file, next)
    process.stdout.write(`Đã cập nhật ${name} từ rules.json.\n`)
  } else {
    process.stdout.write(`${name} đã đồng bộ — không đổi.\n`)
  }
}

// hooks.json cho plugin — cùng cơ chế drift, nhưng nguồn là settings.fragment.json.
{
  const next = pluginHooksJson()
  const current = existsSync(PLUGIN_HOOKS) ? readFileSync(PLUGIN_HOOKS, "utf8") : ""
  const name = "hooks/hooks.json"
  if (check) {
    if (next !== current) {
      drift = true
      process.stderr.write(`${name} lệch settings.fragment.json. Chạy \`npm run gen\` rồi commit.\n`)
    }
  } else if (next !== current) {
    writeFileSync(PLUGIN_HOOKS, next)
    process.stdout.write(`Đã cập nhật ${name} từ settings.fragment.json.\n`)
  } else {
    process.stdout.write(`${name} đã đồng bộ — không đổi.\n`)
  }
}

if (check) {
  if (drift) process.exit(1)
  process.stdout.write("Mọi bảng generated đồng bộ với rules.json.\n")
}
