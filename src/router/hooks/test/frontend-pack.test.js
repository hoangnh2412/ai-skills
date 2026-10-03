/**
 * Golden test — cấu trúc module frontend/ (ADR-040, cùng khuôn backend-pack.test.js).
 *
 * Invariant:
 *  - tên skill lá = minipower-frontend-{capability}-react, kebab, ≤64, ≡ tên thư mục
 *  - lá-rời sống nhờ description → bắt buộc có
 *  - provider/pattern con: name = <tên skill cha>-<biến thể>
 *  - bảng skill trong frontend/README.md khớp thư mục thật
 *  - mọi lá chở con trỏ tới hai luật cắt ngang: convention + architecture
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"

import { SRC } from "../lib/skill-catalog.js"

const MODULE = join(SRC, "frontend")
const SKILLS = join(MODULE, "skills")

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

test("frontend: mỗi skill lá có SKILL.md + README.md, name ≡ tên thư mục", () => {
  assert.ok(skillDirs.length >= 9, `chỉ thấy ${skillDirs.length} skill — thiếu?`)
  for (const dir of skillDirs) {
    const p = join(SKILLS, dir, "SKILL.md")
    assert.ok(existsSync(p), `${dir} thiếu SKILL.md`)
    assert.ok(existsSync(join(SKILLS, dir, "README.md")), `${dir} thiếu README.md`)
    assert.equal(fmField(frontmatter(p), "name"), dir, `${dir}: name lệch thư mục`)
  }
})

test("frontend: tên theo hệ minipower-frontend-{capability}-react — kebab, ≤64 (ADR-022 QĐ-4)", () => {
  for (const dir of skillDirs) {
    assert.match(dir, /^minipower-frontend-[a-z0-9]+(-[a-z0-9]+)*-react$/, `${dir}: không đúng kebab/tiền tố/hậu tố`)
    assert.ok(dir.length <= 64, `${dir}: ${dir.length} ký tự — vượt ngưỡng 64`)
  }
})

test("frontend: lá-rời bắt buộc có description (bề mặt kích hoạt)", () => {
  for (const dir of skillDirs) {
    const desc = fmField(frontmatter(join(SKILLS, dir, "SKILL.md")), "description")
    assert.ok(desc && desc.trim().length > 0, `${dir}: thiếu description`)
  }
})

test("frontend: provider/pattern con — name = <skill cha>-<biến thể>, ≤64, có description", () => {
  let checked = 0
  for (const dir of skillDirs) {
    for (const sub of ["providers", "patterns"]) {
      const subDir = join(SKILLS, dir, sub)
      if (!existsSync(subDir)) continue
      for (const p of readdirSync(subDir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
        const fm = frontmatter(join(subDir, p.name, "SKILL.md"))
        const name = fmField(fm, "name")
        assert.equal(name, `${dir}-${p.name}`, `${dir}/${sub}/${p.name}: name "${name}" lệch`)
        assert.ok(name.length <= 64, `${name}: vượt 64 ký tự`)
        assert.ok(fmField(fm, "description"), `${name}: thiếu description`)
        checked++
      }
    }
  }
  assert.ok(checked >= 2, `chỉ kiểm được ${checked} biến thể — walk hỏng?`)
})

test("frontend/README.md: bảng skill khớp thư mục thật — đủ và không thừa", () => {
  const readme = readFileSync(join(MODULE, "README.md"), "utf8")
  for (const dir of skillDirs) {
    assert.ok(readme.includes(`**${dir}**`), `README thiếu dòng bảng cho ${dir}`)
    assert.ok(readme.includes(`skills/${dir}/README.md`), `README thiếu link tới ${dir}`)
  }
  const rows = readme.match(/^\| \*\*minipower-frontend-[a-z0-9-]+\*\* \|/gm) || []
  assert.equal(rows.length, skillDirs.length, `bảng có ${rows.length} dòng, thư mục có ${skillDirs.length}`)
})

test("frontend/PACK.md tồn tại (manifest — ADR-022 QĐ-8)", () => {
  assert.ok(existsSync(join(MODULE, "PACK.md")))
})

// Hai luật cắt ngang — giống backend: skill nào kích hoạt thì luật "viết thế nào" và
// "đặt ở đâu" cũng đi cùng. Không có test, mỗi skill mới lại quên một con trỏ.
const CROSS_CUTTING = [
  { skill: "minipower-frontend-convention-react", what: "convention (code trong file viết thế nào)" },
  { skill: "minipower-frontend-architecture-react", what: "architecture (file nằm ở đâu, import thế nào)" },
]

for (const { skill, what } of CROSS_CUTTING) {
  test(`frontend: mọi skill lá trỏ tới ${what}`, () => {
    assert.ok(skillDirs.includes(skill), `thiếu chính skill ${skill}`)
    for (const dir of skillDirs) {
      if (dir === skill) continue
      const body = readFileSync(join(SKILLS, dir, "SKILL.md"), "utf8")
      assert.ok(
        body.includes(`../${skill}/SKILL.md`),
        `${dir}/SKILL.md không trỏ tới ${skill} — agent kích hoạt skill này sẽ không thấy luật ${what}`,
      )
    }
  })
}

// Template là code mẫu thay placeholder rồi dùng — placeholder lạ = agent không biết thay bằng gì.
const PLACEHOLDERS = new Set([
  "Feature", "feature", "FEATURE", "features", "apiPath",
  "Label", "label", "LabelEn", "labelEn", "app", "AppTitle", "kitSpec",
])

function walkFiles(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...walkFiles(p))
    else out.push(p)
  }
  return out
}

test("frontend: templates chỉ dùng placeholder đã khai trong architecture § Placeholder", () => {
  const unknown = []
  for (const dir of skillDirs) {
    const tplDir = join(SKILLS, dir, "templates")
    if (!existsSync(tplDir)) continue
    for (const file of walkFiles(tplDir)) {
      const rel = file.slice(SKILLS.length + 1)
      for (const m of rel.matchAll(/\{([A-Za-z]+)\}/g)) {
        if (!PLACEHOLDERS.has(m[1])) unknown.push(`${rel} (tên file): {${m[1]}}`)
      }
    }
  }
  assert.deepEqual(unknown, [], "placeholder chưa khai")
})

// Mock là nhánh tạm (ADR-040 Điều chỉnh): luồng mặc định thêm feature chỉ dùng call*; dữ liệu giả
// chỉ được nằm trong templates/mock/ để không ai copy nhầm vào feature theo luồng chuẩn.
test("frontend: template ngoài templates/mock/ không chở mock / dữ liệu giả", () => {
  const MOCK_CODE =
    /export\s+(async\s+)?function\s+mock[A-Z]|export\s+const\s+FAKE_|from\s+'[^']*Mock'|from\s+'[^']*\/mocks(\/|')|from\s+'[^']*\.json'/
  const offenders = []
  for (const dir of skillDirs) {
    const tplDir = join(SKILLS, dir, "templates")
    if (!existsSync(tplDir)) continue
    for (const file of walkFiles(tplDir)) {
      const rel = file.slice(tplDir.length + 1).replace(/\\/g, "/")
      if (rel.startsWith("mock/")) continue
      if (MOCK_CODE.test(readFileSync(file, "utf8"))) offenders.push(`${dir}/templates/${rel}`)
    }
  }
  assert.deepEqual(offenders, [], "template ngoài templates/mock/ đang chở mock / dữ liệu giả")
})
