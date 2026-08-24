/**
 * Golden test — skill `as-built` (ADR-020 §8 #9, QĐ-6, R5, R6).
 *
 * Rủi ro lớn nhất của skill này KHÔNG phải nó chạy sai, mà là nó bị hiểu thành
 * "agent tự khảo cổ": quét cả repo, sinh DOC hàng loạt, không ai kiểm (R5). Tài
 * liệu sai mà trông đúng còn tệ hơn không có tài liệu — người sau sẽ tin nó.
 *
 * Vì vậy test này canh **ranh giới đã tuyên bố** còn nguyên trong SKILL.md, và
 * codegraph vẫn là **tuỳ chọn** (R6) — không được leo vào tầng cứng.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

// test/ → hooks/ → minipower/
const PACK = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const read = (...p) => readFileSync(join(PACK, ...p), "utf8")

const SKILL = read("skills", "as-built", "SKILL.md")

test("#9 — skill as-built tồn tại, có frontmatter name + description", () => {
  assert.match(SKILL, /^---\r?\n/, "thiếu frontmatter")
  assert.match(SKILL, /^name: as-built$/m)
  assert.match(SKILL, /description: >-/)
})

test("R5 — ranh giới chống 'agent tự khảo cổ' còn nguyên", () => {
  assert.match(SKILL, /[Nn]gười trigger/, "phải nói rõ người trigger")
  assert.match(SKILL, /một vùng chạm|Một vùng chạm/i, "phải giới hạn một vùng chạm")
  assert.match(SKILL, /[Kk]hông quét cả repo/, "phải cấm quét cả repo")
  assert.match(SKILL, /[Kk]hông chạy nền/, "phải cấm chạy nền")
  assert.match(SKILL, /nháp \+ câu hỏi|NHÁP \+ CÂU HỎI/i, "đầu ra phải là nháp + câu hỏi")
  assert.match(SKILL, /path:line/, "phát hiện phải trỏ bằng chứng path:line")
})

test("R5 — tách sự thật / phỏng đoán / mâu thuẫn, không trộn", () => {
  for (const nhom of ["Sự thật", "Phỏng đoán", "Mâu thuẫn"]) {
    assert.match(SKILL, new RegExp(nhom), `thiếu nhóm "${nhom}"`)
  }
  assert.match(SKILL, /[Kk]hông.*tự chọn bên đúng/, "mâu thuẫn phải để người quyết")
})

test("R6 — codegraph là TUỲ CHỌN, có đường degrade", () => {
  assert.match(SKILL, /codegraph/i)
  assert.match(SKILL, /tuỳ chọn|optional/i, "phải khai codegraph là tuỳ chọn")
  assert.match(SKILL, /degrade|Read\/Grep|Grep/i, "phải có đường degrade")
  assert.match(SKILL, /[Kk]hông.*bắt người cài|không.*dừng/i, "không được bắt cài mới làm được")
})

test("Q4 — index codegraph local + gitignore, không commit", () => {
  assert.match(SKILL, /\.gitignore/, "phải nêu gitignore")
  assert.match(SKILL, /[Kk]hông commit/, "phải cấm commit index")
})

test("#9 — as-built KHÔNG được vào tầng cứng (không hook nào gọi)", () => {
  const hooksDir = join(PACK, "hooks")
  for (const sub of ["lib", "bin"]) {
    for (const f of readdirSync(join(hooksDir, sub))) {
      const text = readFileSync(join(hooksDir, sub, f), "utf8")
      assert.ok(
        !/as-built|codegraph/i.test(text),
        `${sub}/${f} nhắc as-built/codegraph — tầng cứng KHÔNG được phụ thuộc (R6)`,
      )
    }
  }
  const fragment = read("install", "claude", "settings.fragment.json")
  assert.ok(!/as-built/i.test(fragment), "wiring hook không được gọi as-built")
})

test("#9 — router nối trigger as-built (dời từ việc #5)", () => {
  const router = read("SKILL.md")
  assert.match(router, /skills\/as-built\/SKILL\.md/, "router phải trỏ skill as-built")
  assert.match(router, /as-built/, "bảng routing phải có dòng as-built")
  // Skill trỏ tới phải tồn tại thật — chống lặp lại lỗi "router hứa file chưa có".
  for (const m of router.matchAll(/skills\/([a-z-]+)\/SKILL\.md/g)) {
    assert.ok(
      existsSync(join(PACK, "skills", m[1], "SKILL.md")),
      `router trỏ skill không tồn tại: ${m[1]}`,
    )
  }
})

test("#9 — docs/06-changes/incident/ có chỗ đứng + trỏ đủ 2 template", () => {
  const p = join(PACK, "docs-skeleton", "06-changes", "incident", "README.md")
  assert.ok(existsSync(p), "thiếu docs-skeleton/06-changes/incident/")
  const text = readFileSync(p, "utf8")
  assert.match(text, /TPL-incident-report/, "phải trỏ template incident")
  assert.match(text, /TPL-postmortem/, "phải trỏ template postmortem")
  for (const tpl of ["TPL-incident-report.md", "TPL-postmortem.md"]) {
    assert.ok(existsSync(join(PACK, "templates", tpl)), `thiếu templates/${tpl}`)
  }
})
