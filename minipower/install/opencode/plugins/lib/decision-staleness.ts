/** Minipower decision-log staleness — port of install/cursor/hooks/minipower-decision-staleness.py
 *  Advisory, non-blocking. Pure git (execFileSync) + fs — không cần python runtime.
 */
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

function git(root: string, args: string[]): string {
  try {
    // stdio: nuốt stderr để không rò "fatal: not a git repository" vào log.
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

type Entry = { id: string; date: string; status: string; trace: string }

function parseEntries(text: string): Entry[] {
  const out: Entry[] = []
  let cur: Entry | null = null
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

export function checkDecisionStaleness(root: string): string | null {
  if (git(root, ["rev-parse", "--is-inside-work-tree"]) !== "true") return null
  const memDir = join(root, "memory")
  if (!existsSync(memDir)) return null

  const docsFiles = git(root, ["ls-files", "docs"])
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  const resolveDocs = (trace: string): Set<string> => {
    const files = new Set<string>()
    let m: RegExpExecArray | null
    DOC_PATH_RE.lastIndex = 0
    while ((m = DOC_PATH_RE.exec(trace))) files.add(m[1])
    DOC_TOKEN_RE.lastIndex = 0
    const nns = new Set<string>()
    while ((m = DOC_TOKEN_RE.exec(trace))) nns.add(m[1])
    for (const nn of nns) {
      const re = new RegExp(`/DOC-${nn}-[^/]*\\.md$`)
      for (const f of docsFiles) if (re.test("/" + f)) files.add(f)
    }
    return files
  }

  let phases: string[]
  try {
    phases = readdirSync(memDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()
  } catch {
    return null
  }

  const findings: string[] = []
  for (const ph of phases) {
    const logPath = join(memDir, ph, "decision-log.md")
    if (!existsSync(logPath)) continue
    let text: string
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
