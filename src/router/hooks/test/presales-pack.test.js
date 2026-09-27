/**
 * Golden test — module presales/ (ADR-030 + ADR-033 D3).
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const ROOT = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))))
const SKILLS = join(ROOT, "presales", "skills")

const skillDirs = readdirSync(SKILLS, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)

function frontmatter(path) {
  const t = readFileSync(path, "utf8")
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  assert.ok(m, `${path} thiếu frontmatter`)
  return m[1]
}
const fmField = (fm, key) => (fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m")) || [])[1]

test("presales: đúng hai thư mục skill, name ≡ thư mục", () => {
  assert.equal(skillDirs.length, 2)
  assert.deepEqual([...skillDirs].sort(), [
    "minipower-presales-estimation-ulnl",
    "minipower-presales-quotation",
  ])
  for (const dir of skillDirs) {
    const p = join(SKILLS, dir, "SKILL.md")
    assert.ok(existsSync(p))
    assert.equal(fmField(frontmatter(p), "name"), dir)
  }
})

test("presales: tiền tố kebab ≤64 + description", () => {
  for (const dir of skillDirs) {
    assert.match(dir, /^minipower-presales-[a-z0-9]+(-[a-z0-9]+)*$/)
    assert.ok(dir.length <= 64)
    const desc = fmField(frontmatter(join(SKILLS, dir, "SKILL.md")), "description")
    assert.ok(desc && desc.trim())
  }
})

test("presales/README.md bảng khớp", () => {
  const readme = readFileSync(join(ROOT, "presales", "README.md"), "utf8")
  for (const dir of skillDirs) {
    assert.ok(readme.includes(`**${dir}**`))
    assert.ok(readme.includes(`skills/${dir}/README.md`))
  }
  const rows = readme.match(/^\| \*\*minipower-presales-[a-z0-9-]+\*\* \|/gm) || []
  assert.equal(rows.length, 2)
})

test("presales/PACK.md tồn tại", () => {
  assert.ok(existsSync(join(ROOT, "presales", "PACK.md")))
})

test("T10 — estimation không chứa đơn giá", () => {
  const t = readFileSync(join(SKILLS, "minipower-presales-estimation-ulnl", "SKILL.md"), "utf8")
  assert.doesNotMatch(t, /rate_md|đơn giá MD/i)
})

test("T14 — SKILL.md không chép bảng MH / ngưỡng §6", () => {
  for (const dir of skillDirs) {
    const t = readFileSync(join(SKILLS, dir, "SKILL.md"), "utf8")
    assert.doesNotMatch(t, /CN_WEB1/)
    assert.doesNotMatch(t, /&lt; 5 bước/)
  }
})
