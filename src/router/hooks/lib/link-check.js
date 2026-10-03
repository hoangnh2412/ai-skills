/**
 * Link-check — quét mọi .md trong repo, kiểm link markdown tương đối trỏ file có thật
 * (ADR-021 §6a · ADR-022 §6 bước 1). Link markdown là chuỗi ký tự thường, không compiler
 * nào kiểm — đổi tên/di chuyển file làm link chết im lặng; script này biến nó thành FAIL.
 *
 * Bỏ qua có chủ đích:
 *  - link ngoài (http/https/mailto/… — mọi target có scheme) và anchor thuần (#...)
 *  - link trong code fence ``` và inline code `...` (ví dụ minh hoạ, không phải điều hướng)
 *  - folder ship sang dự án đích (templates/ · docs-skeleton/ · project-skeleton/ · install/):
 *    link trong đó viết theo ngữ cảnh dự án đích, "gãy trong repo này" là trạng thái đúng
 */
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join, dirname, resolve } from "node:path"

const SKIP_DIRS = new Set([
  "node_modules", ".git",
  "templates", "docs-skeleton", "project-skeleton", "install",
])

/** Liệt kê đường dẫn tương đối (dùng "/") của mọi .md dưới root, trừ SKIP_DIRS. */
export function listMdFiles(root, rel = "") {
  const out = []
  for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      out.push(...listMdFiles(root, rel ? `${rel}/${entry.name}` : entry.name))
    } else if (entry.name.endsWith(".md")) {
      out.push(rel ? `${rel}/${entry.name}` : entry.name)
    }
  }
  return out
}

/** Bóc link khỏi một file markdown → [{ line, target }]. Bỏ fence, inline code, scheme, anchor thuần. */
export function extractLinks(text) {
  const links = []
  let inFence = false
  text.split("\n").forEach((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; return }
    if (inFence) return
    const line = raw.replace(/`[^`]*`/g, "") // inline code là ví dụ, không phải điều hướng
    for (const m of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      let target = m[1].trim().replace(/^<|>$/g, "").split(/\s+/)[0]
      if (target === "" || target.startsWith("#")) continue
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue // http:, https:, mailto:, …
      links.push({ line: i + 1, target })
    }
  })
  return links
}

/** Quét cả repo. → { broken: [{file, line, target}], filesScanned, linksChecked } */
export function checkRepo(root) {
  const broken = []
  let linksChecked = 0
  const files = listMdFiles(root)
  for (const file of files) {
    const text = readFileSync(join(root, file), "utf8")
    for (const { line, target } of extractLinks(text)) {
      linksChecked++
      let clean = target.split("#")[0]
      if (clean === "") continue // dạng "file.md#..." đã strip hết → anchor nội bộ
      try { clean = decodeURIComponent(clean) } catch { /* giữ nguyên nếu encode hỏng */ }
      const abs = clean.startsWith("/") ? join(root, clean) : resolve(root, dirname(file), clean)
      if (!existsSync(abs)) broken.push({ file, line, target })
    }
  }
  return { broken, filesScanned: files.length, linksChecked }
}

export function formatReport({ broken, filesScanned, linksChecked }) {
  const lines = broken.map((b) => `${b.file}:${b.line}  →  ${b.target}  ✗ KHÔNG TỒN TẠI`)
  lines.push(
    `— ${filesScanned} file .md · ${linksChecked} link tương đối · ${broken.length} gãy` +
      (broken.length ? "" : " · sạch ✓"),
  )
  return lines.join("\n")
}

// ── Baseline — nợ link gãy đã biết (ADR-021 §6a: đợt chỉ phải không sinh gãy MỚI) ──
// Format file baseline: mỗi dòng `file → target`, bỏ số dòng (số dòng trôi khi sửa file
// không liên quan); dòng bắt đầu `#` là chú thích.

const key = (b) => `${b.file} → ${b.target}`

export function parseBaseline(text) {
  return new Set(
    text.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")),
  )
}

/** So kết quả quét với baseline. → { fresh: gãy MỚI (fail), resolved: nợ đã lành (nên cập nhật baseline) } */
export function diffBaseline({ broken }, baselineSet) {
  const current = new Set(broken.map(key))
  return {
    fresh: broken.filter((b) => !baselineSet.has(key(b))),
    resolved: [...baselineSet].filter((k) => !current.has(k)),
  }
}

export function toBaseline({ broken }) {
  const uniq = [...new Set(broken.map(key))]
  return (
    "# Nợ link gãy đã biết — link:check chỉ FAIL khi có gãy NGOÀI danh sách này.\n" +
    "# Cập nhật (sau khi soát diff bằng mắt): npm run link:check -- --update-baseline\n" +
    uniq.join("\n") + "\n"
  )
}
