/**
 * Golden test cho rules-as-data (R3). Khoá:
 *  - rules.json phủ đủ DOC-01..18, mọi phase hợp lệ.
 *  - Nhãn phase suy ra khớp chuỗi cũ (không regress message hook).
 *  - Regex edit/breadth sinh từ keyword match đúng như bản hardcode cũ.
 *  - agents/auto-routing.md đồng bộ rules.json (chạy gen --check).
 */

import test from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import {
  RULES,
  PHASE_BY_DOC,
  PHASE_ORDER,
  PHASE_LABEL,
  EDIT_VERBS,
  BREADTH,
  formatDocRanges,
  stripDiacritics,
} from "../lib/rules.js"

const HOOKS = dirname(dirname(fileURLToPath(import.meta.url)))

test("rules.json — phủ đủ DOC-01..18, phase hợp lệ", () => {
  for (let i = 1; i <= 18; i++) {
    const key = String(i).padStart(2, "0")
    assert.ok(PHASE_BY_DOC[key], `thiếu ${key}`)
    assert.ok(PHASE_ORDER.includes(PHASE_BY_DOC[key]), `phase lạ cho ${key}: ${PHASE_BY_DOC[key]}`)
  }
  assert.equal(Object.keys(PHASE_BY_DOC).length, 18)
})

test("PHASE_LABEL — suy ra khớp chuỗi cũ", () => {
  assert.equal(PHASE_LABEL.discovery, "discovery (DOC-01–03)")
  assert.equal(PHASE_LABEL.requirements, "requirements (DOC-04–07, 13)")
  assert.equal(PHASE_LABEL.architecture, "architecture (DOC-08–12)")
  assert.equal(PHASE_LABEL.planning, "planning (DOC-14–15)")
  assert.equal(PHASE_LABEL.delivery, "delivery (DOC-16–17)")
  assert.equal(PHASE_LABEL["change-control"], "change-control (DOC-18)")
})

test("formatDocRanges — gom dải liên tục, tách quãng đứt", () => {
  assert.equal(formatDocRanges([1, 2, 3]), "01–03")
  assert.equal(formatDocRanges([4, 5, 6, 7, 13]), "04–07, 13")
  assert.equal(formatDocRanges([18]), "18")
  assert.equal(formatDocRanges([16, 17]), "16–17")
})

test("EDIT_VERBS — match cả có dấu (đã strip) lẫn Anh", () => {
  for (const w of ["sửa", "cập nhật", "viết", "thêm", "update", "edit", "write", "review"]) {
    assert.ok(EDIT_VERBS.test(stripDiacritics(w.toLowerCase())), `miss verb: ${w}`)
  }
  assert.ok(!EDIT_VERBS.test(stripDiacritics("xem gì đó")))
})

test("BREADTH — match từ khoá độ rộng", () => {
  for (const w of ["toàn bộ", "all modules", "đồng bộ hết", "review all"]) {
    assert.ok(BREADTH.test(stripDiacritics(w.toLowerCase())), `miss breadth: ${w}`)
  }
})

test("rules.json giữ đủ danh sách keyword không rỗng", () => {
  assert.ok(RULES.edit_verbs.length >= 5)
  assert.ok(RULES.breadth_words.length >= 3)
})

test("agents/auto-routing.md đồng bộ rules.json (gen --check)", () => {
  // Nếu lệch, execFileSync ném (exit 1) → test fail với stderr hướng dẫn.
  execFileSync("node", [join(HOOKS, "gen-agents-doc.js"), "--check"], { encoding: "utf8" })
})
