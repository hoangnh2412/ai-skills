/**
 * Golden test — pack nghề ADR-033 Đợt D2 (router/discovery/analyst/architecture/pm/support/qa).
 * ops/ đã có ops-pack.test.js; D2 chỉ thêm lá deploy/incident vào ops.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const ROOT = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))))
const ROLE_PACKS = ["router", "discovery", "analyst", "architecture", "pm", "support", "qa"]

function frontmatter(path) {
  const t = readFileSync(path, "utf8")
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  assert.ok(m, `${path} thiếu frontmatter`)
  return m[1]
}
const fmField = (fm, key) => (fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m")) || [])[1]

function skillDirs(pack) {
  const skills = join(ROOT, pack, "skills")
  assert.ok(existsSync(skills), `${pack}/skills không tồn tại`)
  return readdirSync(skills, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
}

for (const pack of ROLE_PACKS) {
  const dirs = skillDirs(pack)
  const prefix = new RegExp(`^minipower-${pack}(-[a-z0-9]+)*$`)

  test(`${pack}: mỗi skill lá có SKILL.md, name ≡ thư mục`, () => {
    assert.ok(dirs.length >= 1, `${pack}: cấm folder trống`)
    for (const dir of dirs) {
      const p = join(ROOT, pack, "skills", dir, "SKILL.md")
      assert.ok(existsSync(p), `${dir} thiếu SKILL.md`)
      assert.equal(fmField(frontmatter(p), "name"), dir)
    }
  })

  test(`${pack}: tên kebab minipower-${pack}-* ≤64`, () => {
    for (const dir of dirs) {
      assert.match(dir, prefix, `${dir}: sai tiền tố`)
      assert.ok(dir.length <= 64)
    }
  })

  test(`${pack}: description bắt buộc`, () => {
    for (const dir of dirs) {
      const desc = fmField(frontmatter(join(ROOT, pack, "skills", dir, "SKILL.md")), "description")
      assert.ok(desc && desc.trim().length > 0, `${dir}`)
    }
  })

  test(`${pack}/README.md bảng khớp thư mục`, () => {
    const readme = readFileSync(join(ROOT, pack, "README.md"), "utf8")
    for (const dir of dirs) {
      assert.ok(readme.includes(`**${dir}**`), `README thiếu ${dir}`)
      assert.ok(readme.includes(`skills/${dir}/README.md`))
    }
    const rows = readme.match(new RegExp(`^\\| \\*\\*minipower-${pack}(-[a-z0-9]+)*\\*\\* \\|`, "gm")) || []
    assert.equal(rows.length, dirs.length, `${pack} bảng ${rows.length} vs ${dirs.length}`)
  })

  test(`${pack}/PACK.md tồn tại`, () => {
    assert.ok(existsSync(join(ROOT, pack, "PACK.md")))
  })
}
