/**
 * Golden test — templates (ADR-020 §8 #8).
 *
 * Ba thứ được khoá:
 *  1. **Nhãn 2 mức「lõi ▸ full」** trên 6 DOC nặng — để `mvp`/`maintain` biết bỏ mục
 *     nào là có chủ đích, và **giữ heading** để lên `standard` chỉ việc điền tiếp.
 *  2. **Chỗ đứng DOC-19** — Prototype là DOC theo module (`doc_scope`), nhưng
 *     `_template/README.md` từng bỏ sót nó ⇒ mở module xong không ai biết tạo file đâu.
 *  3. **Mọi TPL-* có mặt trong README** — TPL-agent-profile từng tồn tại mà không
 *     được liệt kê ⇒ không ai tìm ra schema profile.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { DOC_SCOPE } from "../lib/rules.js"
import { PROFILE_VERSION } from "../lib/profile-guard.js"

// test/ → hooks/ → minipower/
const PACK = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const TPL = join(PACK, "templates")

const read = (...p) => readFileSync(join(PACK, ...p), "utf8")

/** 6 DOC nặng cần chia mức (ADR-020 §8 #8). */
const TWO_LEVEL = [
  "DOC-06-srs.md",
  "DOC-08-sad.md",
  "DOC-13-nfr.md",
  "DOC-15-project-plan.md",
  "DOC-16-test-strategy.md",
  "DOC-17-deployment-guide.md",
]

test("#8 — 6 DOC nặng có legend 2 mức + ít nhất một mục mỗi mức", () => {
  for (const f of TWO_LEVEL) {
    const text = readFileSync(join(TPL, f), "utf8")
    assert.match(text, /Hai mức điền/, `${f}: thiếu legend 2 mức`)
    assert.match(text, /doc-debt/, `${f}: legend phải trỏ sổ nợ`)
    assert.match(text, /[Kk]hông xoá heading/, `${f}: phải cấm xoá heading mục full`)

    const headings = [...text.matchAll(/^## \d+\. .+$/gm)].map((m) => m[0])
    const full = headings.filter((h) => h.includes("▸ full"))
    const core = headings.filter((h) => !h.includes("▸ full"))
    assert.ok(full.length > 0, `${f}: không mục nào là ▸ full — chia mức vô nghĩa`)
    assert.ok(core.length > 0, `${f}: mọi mục đều ▸ full — mức lõi rỗng`)
  }
})

test("#8 — nhãn full chỉ nằm ở heading, không rải trong thân bài", () => {
  for (const f of TWO_LEVEL) {
    const text = readFileSync(join(TPL, f), "utf8")
    for (const line of text.split(/\r?\n/)) {
      if (!line.includes("▸ full")) continue
      assert.ok(
        line.startsWith("## ") || line.startsWith(">"),
        `${f}: "▸ full" nằm ngoài heading/legend — "${line.slice(0, 60)}"`,
      )
    }
  }
})

test("#8 — DOC-17: các mục sống-còn phải là LÕI, không được đẩy sang full", () => {
  // Deploy mà bỏ "các bước", "rollback", "xác minh" thì mode nào cũng hỏng.
  const text = readFileSync(join(TPL, "DOC-17-deployment-guide.md"), "utf8")
  for (const must of ["Các bước triển khai", "Quy trình rollback", "Xác minh sau triển khai"]) {
    const re = new RegExp(`^## \\d+\\. ${must}\\s*$`, "m")
    assert.match(text, re, `DOC-17: "${must}" phải là mục lõi (không ▸ full)`)
  }
})

test("#8 — DOC-19 có chỗ đứng trong _template module (doc_scope = module)", () => {
  assert.equal(DOC_SCOPE["19"], "module", "tiền đề: DOC-19 là DOC theo module")
  const readme = read("docs-skeleton", "03-modules", "_template", "README.md")
  assert.match(readme, /DOC-19/, "_template/README.md phải liệt kê DOC-19")
  assert.match(readme, /DOC-19-prototype\.md/, "phải trỏ đúng file template")
})

test("#8 — _template liệt kê ĐỦ mọi DOC scope=module", () => {
  const readme = read("docs-skeleton", "03-modules", "_template", "README.md")
  const moduleDocs = Object.entries(DOC_SCOPE)
    .filter(([, s]) => s === "module")
    .map(([d]) => d)
  for (const d of moduleDocs) {
    assert.match(readme, new RegExp(`DOC-${d}`), `_template thiếu DOC-${d} (scope=module)`)
  }
})

test("#8 — mọi file TPL-* đều được liệt kê trong templates/README.md", () => {
  const readme = readFileSync(join(TPL, "README.md"), "utf8")
  const tplFiles = readdirSync(TPL).filter((f) => f.startsWith("TPL-") && f.endsWith(".md"))
  assert.ok(tplFiles.length >= 4, "phải có ít nhất vài TPL để test có nghĩa")
  for (const f of tplFiles) {
    assert.match(readme, new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `README thiếu ${f}`)
  }
})

test("#8 — TPL-agent-profile khai đúng schema hiện hành", () => {
  const text = readFileSync(join(TPL, "TPL-agent-profile.md"), "utf8")
  assert.match(text, new RegExp(`schema v${PROFILE_VERSION}`), "tiêu đề schema lệch code")
  assert.match(text, /"version": 2/, "ví dụ JSON phải là v2")
  assert.match(text, /"project_mode"/, "v2 phải có project_mode")
  assert.match(text, /"approval_source"/, "v2 phải có approval_source")
  for (const kind of ["docs", "tasks", "code"]) {
    assert.match(text, new RegExp(`"${kind}"`), `approval_source thiếu ${kind}`)
  }
})
