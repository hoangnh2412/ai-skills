/**
 * Golden test — tài liệu gốc repo khớp quyết định (ADR-020 §8 #10, #12).
 *
 * AGENTS.md và COORDINATION.md là thứ agent đọc ĐẦU TIÊN. Một câu sai ở đó lan
 * ra mọi phiên làm việc sau — đắt hơn nhiều so với một câu sai trong skill lẻ.
 * Trước giờ chúng chỉ được canh bằng trí nhớ người sửa.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { PROJECT_MODES } from "../lib/rules.js"

// test/ → hooks/ → minipower/ → repo root
const PACK = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const ROOT = dirname(PACK)

const read = (...p) => readFileSync(join(ROOT, ...p), "utf8")
const MODE_IDS = Object.keys(PROJECT_MODES)

// ─── #12 — AGENTS.md ────────────────────────────────────────────────────────

test("#12 — AGENTS.md nói rõ 3 gate là MỀM (QĐ-11)", () => {
  const t = read("AGENTS.md")
  assert.match(t, /gate đều MỀM|gate.*mềm/i, "phải nói 3 gate là mềm")
  assert.match(t, /QĐ-11/, "phải trỏ quyết định nguồn")
  assert.match(t, /không hook nào chặn/i)
})

test("#12 — AGENTS.md có phép thử 'cái gì FAIL được bằng máy'", () => {
  const t = read("AGENTS.md")
  assert.match(t, /FAIL được bằng máy/i, "phải có phép thử trước khi viết 'bắt buộc'")
  assert.match(t, /cứng bằng máy, mềm bằng lời/i)
})

test("#12 — AGENTS.md khai đủ 3 chế độ + không hứa permissions.deny nữa", () => {
  const t = read("AGENTS.md")
  for (const id of MODE_IDS) {
    assert.match(t, new RegExp(`\`${id}\``), `AGENTS.md chưa nhắc chế độ \`${id}\``)
  }
  assert.match(t, /[Kk]hông còn `permissions\.deny` tĩnh/, "phải nói rõ đã bỏ deny tĩnh")
  assert.match(t, /baseline-guard/, "phải nêu hook thay thế")
})

test("#12 — AGENTS.md khai mô hình mỗi module một nhịp (QĐ-14)", () => {
  const t = read("AGENTS.md")
  assert.match(t, /QĐ-14/)
  assert.match(t, /pipeline theo module/i)
  assert.match(t, /không.*agent bàn giao cho agent/i, "phải giữ ranh giới §0")
})

test("#12 — AGENTS.md nêu lệnh trace:check", () => {
  const t = read("AGENTS.md")
  assert.match(t, /trace:check/)
  const pkg = JSON.parse(readFileSync(join(PACK, "hooks", "package.json"), "utf8"))
  assert.ok(pkg.scripts["trace:check"], "AGENTS.md nêu lệnh mà package.json không có")
})

// ─── #12 — COORDINATION.md ──────────────────────────────────────────────────

test("#12 — COORDINATION.md: handoff là per-module, không per-project", () => {
  const t = read("COORDINATION.md")
  assert.match(t, /per-module/i, "phải nói rõ handoff theo module")
  assert.match(t, /QĐ-14/)
  assert.match(t, /[Kk]hông có vạch đích chung/, "phải phủ định barrier")
  for (const h of ["H1", "H2", "H3", "H4", "H5", "H6"]) {
    assert.match(t, new RegExp(`\\*\\*${h}\\*\\*`), `thiếu boundary ${h}`)
  }
})

// ─── #12 — README use-case ──────────────────────────────────────────────────

test("#12 — README repo có use-case cho cả 3 chế độ", () => {
  const t = read("README.md")
  for (const id of MODE_IDS) {
    assert.match(t, new RegExp(`\`${id}\``), `README thiếu use-case chế độ \`${id}\``)
  }
  assert.match(t, /con người là người ra lệnh|người ra lệnh/i)
  assert.match(t, /SKILL\.md#chế-độ-dự-án-project_mode/, "phải trỏ bảng chi tiết")
})

// ─── #10 — change-control ───────────────────────────────────────────────────

test("#10 — change-control có luồng chuyển mode đủ 2 chiều lên + nhắc DEC", () => {
  const t = readFileSync(join(PACK, "skills", "change-control", "SKILL.md"), "utf8")
  assert.match(t, /mvp → standard/i, "thiếu luồng mvp → standard")
  assert.match(t, /maintain → standard/i, "thiếu luồng maintain → standard")
  assert.match(t, /QĐ-7/, "phải trỏ quyết định nguồn")
  assert.match(t, /phải kèm DEC|kèm DEC/i, "đổi mode phải kèm DEC (chặn R3)")
  assert.match(t, /trace:check/, "điều kiện lên standard phải gồm trace:check")
  assert.match(t, /[Kk]hông có bước di trú cấu trúc/, "phải khẳng định QĐ-2")
})

test("#10 — change-control định nghĩa format doc-debt khớp file skeleton", () => {
  const skill = readFileSync(join(PACK, "skills", "change-control", "SKILL.md"), "utf8")
  const debt = readFileSync(
    join(PACK, "project-skeleton", "memory", "doc-debt.md"),
    "utf8",
  )
  // Cùng bộ cột — skill mô tả format, skeleton là file thật; lệch nhau là bẫy.
  for (const col of ["Thiếu gì", "Module / phạm vi", "Cần trước khi", "Trạng thái"]) {
    assert.match(skill, new RegExp(col), `change-control thiếu cột "${col}"`)
    assert.match(debt, new RegExp(col), `doc-debt.md thiếu cột "${col}"`)
  }
  assert.match(skill, /prereq-gate/, "phải nói rõ KHI NÀO ghi nợ")
})

test("#10 — change-control khai per-mode và tự nhận là mềm", () => {
  const t = readFileSync(join(PACK, "skills", "change-control", "SKILL.md"), "utf8")
  for (const id of MODE_IDS) assert.match(t, new RegExp(`\`${id}\``), `thiếu chế độ \`${id}\``)
  assert.match(t, /không lặp lại ở đây/i)
  assert.match(t, /baseline-guard/, "phải phân biệt cái mềm với cái cứng còn lại")
})

// ─── #11 — wiring CI ────────────────────────────────────────────────────────

test("#11 — mọi file ADR-020 hứa đều tồn tại thật", () => {
  const must = [
    ["sdlc", "hooks", "lib", "trace-check.js"],
    ["sdlc", "hooks", "bin", "trace-check.js"],
    ["sdlc", "project-skeleton", ".gitlab-ci.yml"],
    ["sdlc", "project-skeleton", "memory", "doc-debt.md"],
    ["sdlc", "project-skeleton", "assets", "archive", "README.md"],
    ["sdlc", "skills", "as-built", "SKILL.md"],
    ["sdlc", "docs-skeleton", "06-changes", "incident", "README.md"],
  ]
  for (const p of must) {
    assert.ok(existsSync(join(ROOT, ...p)), `thiếu ${p.join("/")}`)
  }
})
