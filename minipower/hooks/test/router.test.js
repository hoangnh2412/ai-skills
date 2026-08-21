/**
 * Golden test — router [minipower/SKILL.md] (ADR-020 việc #5).
 *
 * Bảng chế độ trong router là vùng **generated** nên `gen:check` đã canh. Nhưng
 * phần VIẾT TAY quanh nó thì không ai canh — và đó mới là chỗ drift: thêm mode thứ
 * tư vào `rules.json` thì bảng tự cập nhật, còn câu hỏi init số 6 thì đứng yên.
 *
 * Test này neo phần viết tay vào SSOT: mọi mode / mọi loại `approval_source` phải
 * xuất hiện trong router, và số hiệu schema phải khớp code.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { PROJECT_MODES, APPROVAL_SOURCE_KINDS } from "../lib/rules.js"
import { PROFILE_VERSION } from "../lib/profile-guard.js"

// test/ → hooks/ → minipower/
const PACK = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const ROUTER = readFileSync(join(PACK, "SKILL.md"), "utf8")

test("router — vùng generated project-modes có mặt (gen sẽ ném nếu mất marker)", () => {
  assert.match(ROUTER, /BEGIN generated: project-modes/)
  assert.match(ROUTER, /END generated: project-modes/)
})

test("router — mọi mode trong rules.json đều được nhắc (init câu 6)", () => {
  for (const id of Object.keys(PROJECT_MODES)) {
    assert.match(ROUTER, new RegExp(`\`${id}\``), `router chưa nhắc chế độ \`${id}\``)
  }
  assert.match(ROUTER, /project_mode/, "router phải nêu tên trường project_mode")
})

test("router — mọi loại approval_source đều được hỏi (init câu 7)", () => {
  assert.match(ROUTER, /approval_source/, "router phải nêu tên trường approval_source")
  for (const kind of APPROVAL_SOURCE_KINDS) {
    assert.match(ROUTER, new RegExp(kind), `init chưa hỏi approval_source.${kind}`)
  }
  assert.match(ROUTER, /`local`/, "phải nêu mặc định local")
})

test("router — số hiệu schema profile khớp code (không hứa v cũ)", () => {
  assert.match(
    ROUTER,
    new RegExp(`v${PROFILE_VERSION}`),
    `router phải nói schema v${PROFILE_VERSION} — khớp PROFILE_VERSION`,
  )
})

test("router — QĐ-2: nói rõ copy đủ khung, không cắt folder theo chế độ", () => {
  assert.match(ROUTER, /đủ khung ở mọi chế độ|đủ.*7 folder/i)
  assert.match(ROUTER, /không.*cắt|KHÔNG.*cắt/i, "phải nói rõ không cắt folder theo chế độ")
})

test("router — có luồng init vào repo đã có sẵn (việc #5)", () => {
  assert.match(ROUTER, /Init vào repo đã có sẵn/i)
  assert.match(ROUTER, /assets\/archive/, "repo có sẵn: tài liệu cũ vào assets/archive")
  assert.match(ROUTER, /doc-debt/, "repo có sẵn: phải ghi sổ nợ")
})

test("router — mọi anchor nội bộ trỏ tới heading có thật", () => {
  // Anchor gãy là lỗi câm: đọc doc thấy link, bấm vào rơi về đầu trang.
  // Luật GitHub: bỏ dấu câu rồi thay TỪNG khoảng trắng bằng một gạch — KHÔNG gộp.
  // Vì thế "(micro / light / full)" → "micro--light--full" (gạch đôi), đúng như anchor thật.
  const slug = (h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[`*]/g, "")
      .replace(/[()[\]{}.,:;!?/\\]/g, "")
      .replace(/ /g, "-")

  const headings = new Set()
  for (const m of ROUTER.matchAll(/^#{1,6}\s+(.+)$/gm)) headings.add(slug(m[1]))

  const anchors = [...ROUTER.matchAll(/\]\(#([^)]+)\)/g)].map((m) => m[1])
  assert.ok(anchors.length >= 3, "router phải có link nội bộ để test có nghĩa")
  for (const a of anchors) {
    assert.ok(headings.has(a), `anchor gãy: #${a}`)
  }
})
