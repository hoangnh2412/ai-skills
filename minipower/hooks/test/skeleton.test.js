/**
 * Golden test — skeleton dự án đích (ADR-020 QĐ-2, việc #6).
 *
 * Router [SKILL.md] hứa với người dùng rằng init sinh ra `memory/doc-debt.md`,
 * `assets/archive/` và **đủ 7 folder `docs/` ở mọi chế độ**. Test này khoá lời hứa
 * đó vào file thật — hứa mà thiếu file thì đỏ, không chờ ai init thử mới phát hiện.
 *
 * QĐ-2: mode KHÔNG cắt folder. Vì vậy chỉ có MỘT khung để kiểm, không rẽ nhánh
 * theo mode — đó chính là cái lợi đã đánh đổi khi chọn không cắt.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

// test/ → hooks/ → minipower/
const PACK = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const PROJECT_SKELETON = join(PACK, "project-skeleton")
const DOCS_SKELETON = join(PACK, "docs-skeleton")

const MEMORY_TOPICS = [
  "discovery",
  "requirements",
  "architecture",
  "planning",
  "delivery",
  "change-control",
]

const DOCS_FOLDERS = [
  "00-governance",
  "01-project",
  "02-baseline",
  "03-modules",
  "04-platform",
  "05-traceability",
  "06-changes",
]

test("project-skeleton — đủ 4 nhánh + FAQ (exit init §SKILL.md)", () => {
  for (const p of ["README.md", "FAQ.md", "INIT.md", "memory", "assets", "brainstorm"]) {
    assert.ok(existsSync(join(PROJECT_SKELETON, p)), `thiếu project-skeleton/${p}`)
  }
})

test("project-skeleton — memory/ đủ 6 folder chủ đề, mỗi folder có decision-log", () => {
  for (const topic of MEMORY_TOPICS) {
    const dir = join(PROJECT_SKELETON, "memory", topic)
    assert.ok(existsSync(join(dir, "README.md")), `thiếu memory/${topic}/README.md`)
    assert.ok(existsSync(join(dir, "decision-log.md")), `thiếu memory/${topic}/decision-log.md`)
  }
})

test("ADR-020 #6 — memory/doc-debt.md ở GỐC memory (cắt ngang mọi phase, §3c)", () => {
  const p = join(PROJECT_SKELETON, "memory", "doc-debt.md")
  assert.ok(existsSync(p), "thiếu memory/doc-debt.md — router SKILL.md có hứa file này")
  const text = readFileSync(p, "utf8")
  assert.match(text, /standard/, "phải nêu điều kiện lên standard")
  // Không được nằm trong memory/{phase}/ — nợ tài liệu không thuộc phase nào.
  for (const topic of MEMORY_TOPICS) {
    assert.ok(
      !existsSync(join(PROJECT_SKELETON, "memory", topic, "doc-debt.md")),
      `doc-debt.md không được nằm trong memory/${topic}/`,
    )
  }
})

test("ADR-020 #6 — assets/archive/ có README kèm cột độ tin cậy (Q5)", () => {
  const p = join(PROJECT_SKELETON, "assets", "archive", "README.md")
  assert.ok(existsSync(p), "thiếu assets/archive/README.md")
  const text = readFileSync(p, "utf8")
  for (const level of ["còn đúng", "nghi ngờ", "đã lỗi thời"]) {
    assert.match(text, new RegExp(level), `archive README thiếu mức tin cậy "${level}"`)
  }
  assert.match(text, /không phải artifact/i, "phải nói rõ archive KHÔNG phải artifact")
})

test("QĐ-2 — docs-skeleton đủ 7 folder, một khung cho cả 3 chế độ", () => {
  const dirs = readdirSync(DOCS_SKELETON, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
  assert.deepEqual(dirs, DOCS_FOLDERS, "cây docs/ lệch §2b — mode KHÔNG được cắt folder")
})

test("INIT.md — có README chuẩn cho folder chưa dùng (QĐ-2)", () => {
  const text = readFileSync(join(PROJECT_SKELETON, "INIT.md"), "utf8")
  assert.match(text, /chưa điền/i, "INIT.md phải định nghĩa README cho folder rỗng")
  assert.match(text, /doc-debt/, "README folder rỗng phải trỏ về sổ nợ")
  assert.match(text, /mọi ch[eế] đ[oộ]/i, "INIT.md phải nói rõ copy đủ khung ở mọi chế độ")
})
