/**
 * Minipower — decision-log staleness (advisory, non-blocking).
 * SSOT. Port từ minipower-decision-staleness.py + decision-staleness.ts.
 * Git thuần (execFileSync) + fs — KHÔNG cần python runtime.
 *
 * Quét memory/{phase}/decision-log.md, so ngày mỗi DEC (còn hiệu lực) với git log của
 * các DOC trong dòng Trace:. DOC đổi sau ngày quyết định → nhắc chạy Premise Check.
 * Chỉ để NHẮC — verdict cuối do người/deliberation (xem docs/decision-log.md).
 */

import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

function git(root, args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return ""
  }
}

const ENTRY_RE = /^###\s+(DEC-[A-Z]{2,4}-\d+)\b.*?\[(\d{4}-\d{2}-\d{2})\]/
const DOC_TOKEN_RE = /\bDOC-(\d{2})\b/g
const DOC_PATH_RE = /\b(docs\/[\w./-]+?DOC-\d{2}[\w./-]*\.md)\b/g

/**
 * @param {string} text
 * @returns {{id:string, date:string, status:string, trace:string}[]}
 */
export function parseEntries(text) {
  const out = []
  let cur = null
  for (const line of text.split(/\r?\n/)) {
    const m = ENTRY_RE.exec(line)
    if (m) {
      if (cur) out.push(cur)
      cur = { id: m[1], date: m[2], status: "", trace: "" }
      continue
    }
    if (!cur) continue
    const s = line.trim()
    const low = s.toLowerCase()
    if (low.startsWith("- status:")) cur.status = s
    else if (low.startsWith("- trace:")) cur.trace = s
  }
  if (cur) out.push(cur)
  return out
}

/**
 * @param {string} root — project root
 * @returns {string|null} advisory text, hoặc null nếu không có gì để nhắc
 */
export function checkDecisionStaleness(root) {
  if (git(root, ["rev-parse", "--is-inside-work-tree"]) !== "true") return null
  const memDir = join(root, "memory")
  if (!existsSync(memDir)) return null

  const docsFiles = git(root, ["ls-files", "docs"])
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  const resolveDocs = (trace) => {
    const files = new Set()
    let m
    DOC_PATH_RE.lastIndex = 0
    while ((m = DOC_PATH_RE.exec(trace))) files.add(m[1])
    DOC_TOKEN_RE.lastIndex = 0
    const nns = new Set()
    while ((m = DOC_TOKEN_RE.exec(trace))) nns.add(m[1])
    for (const nn of nns) {
      const re = new RegExp(`/DOC-${nn}-[^/]*\\.md$`)
      for (const f of docsFiles) if (re.test("/" + f)) files.add(f)
    }
    return files
  }

  let phases
  try {
    phases = readdirSync(memDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()
  } catch {
    return null
  }

  const findings = []
  for (const ph of phases) {
    const logPath = join(memDir, ph, "decision-log.md")
    if (!existsSync(logPath)) continue
    let text
    try {
      text = readFileSync(logPath, "utf8")
    } catch {
      continue
    }
    for (const e of parseEntries(text)) {
      if (e.status.toLowerCase().includes("superseded-by")) continue
      if (!e.trace) continue
      for (const doc of resolveDocs(e.trace)) {
        const cd = git(root, ["log", "-1", "--format=%cs", "--", doc])
        if (cd && cd > e.date) findings.push(`  - ${e.id} (${e.date}) ← ${doc} đổi ${cd}`)
      }
    }
  }

  if (findings.length === 0) return null
  const uniq = Array.from(new Set(findings)).sort()
  return (
    "[Minipower] Decision-log có thể lỗi thời — DOC đã đổi sau ngày quyết định.\n" +
    "Chạy deliberation Premise Check để xác nhận / supersede:\n" +
    uniq.join("\n")
  )
}
