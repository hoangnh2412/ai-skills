/**
 * Golden test — skill as-built (ADR-020 §8 #9 · ADR-037 E4 → architecture leaf).
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { HOOKS, ROOT, ROUTER, SRC } from "../lib/skill-catalog.js"

const SKILL = readFileSync(
  join(SRC, "architecture", "skills", "minipower-architecture-as-built", "SKILL.md"),
  "utf8",
)

test("#9 — skill as-built tồn tại, có frontmatter name + description", () => {
  assert.match(SKILL, /^---\r?\n/, "thiếu frontmatter")
  assert.match(SKILL, /^name: minipower-architecture-as-built$/m)
  assert.match(SKILL, /^description:/m)
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
  for (const sub of ["lib", "bin"]) {
    for (const f of readdirSync(join(HOOKS, sub))) {
      const text = readFileSync(join(HOOKS, sub, f), "utf8")
      assert.ok(
        !/as-built|codegraph/i.test(text),
        `${sub}/${f} nhắc as-built/codegraph — tầng cứng KHÔNG được phụ thuộc (R6)`,
      )
    }
  }
  const fragment = readFileSync(join(ROOT, "cli", "claude", "settings.fragment.json"), "utf8")
  assert.ok(!/as-built/i.test(fragment), "wiring hook không được gọi as-built")
})

test("#9 — router nối trigger as-built", () => {
  const router = readFileSync(join(ROUTER, "skills", "minipower-router", "SKILL.md"), "utf8")
  assert.match(router, /minipower-architecture-as-built/, "router phải trỏ as-built")
  assert.match(router, /as-built/, "bảng routing phải có dòng as-built")
})

test("#9 — docs/06-changes/incident/ có chỗ đứng + trỏ đủ 2 template", () => {
  const p = join(ROUTER, "docs-skeleton", "06-changes", "incident", "README.md")
  assert.ok(existsSync(p), "thiếu docs-skeleton/06-changes/incident/")
  const text = readFileSync(p, "utf8")
  assert.match(text, /TPL-incident-report/, "phải trỏ template incident")
  assert.match(text, /TPL-postmortem/, "phải trỏ template postmortem")
  for (const tpl of ["TPL-incident-report.md", "TPL-postmortem.md"]) {
    assert.ok(existsSync(join(ROUTER, "templates", tpl)), `thiếu templates/${tpl}`)
  }
})
