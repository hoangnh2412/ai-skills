/**
 * Golden test — shouldBypass(prompt)
 *
 * Nguồn hành vi: install/cursor/hooks/hook_bypass.py
 *   BYPASS_RE = /(?:^\s*BYPASS(?:\s+|$)|@\S+\s+BYPASS(?:\s+|$))/im
 *
 * Ý nghĩa: "BYPASS ..." đầu dòng, hoặc "@{skill} BYPASS ...".
 * Cố ý KHÔNG khớp khi chữ BYPASS nằm giữa câu — tránh bypass do vô tình.
 */

import test from "node:test"
import assert from "node:assert/strict"

import { shouldBypass } from "../lib/bypass.js"

test("bypass: nhận dạng đúng", async (t) => {
  await t.test("BYPASS đầu dòng + nội dung", () => {
    assert.equal(shouldBypass("BYPASS sửa DOC-06"), true)
  })

  await t.test("BYPASS đứng một mình (khớp nhánh $)", () => {
    assert.equal(shouldBypass("BYPASS"), true)
  })

  await t.test("BYPASS có khoảng trắng đầu dòng", () => {
    assert.equal(shouldBypass("   BYPASS sửa DOC-06"), true)
  })

  await t.test("dạng @skill BYPASS", () => {
    assert.equal(shouldBypass("@minipower BYPASS sửa DOC-06"), true)
  })

  await t.test("không phân biệt hoa thường (cờ i)", () => {
    assert.equal(shouldBypass("bypass sửa DOC-06"), true)
    assert.equal(shouldBypass("ByPaSs sửa DOC-06"), true)
  })

  await t.test("BYPASS ở đầu dòng thứ hai (cờ m)", () => {
    assert.equal(shouldBypass("sửa DOC-06\nBYPASS"), true)
    assert.equal(shouldBypass("dòng một\n  BYPASS làm đi"), true)
  })

  await t.test("tab cũng là khoảng trắng hợp lệ", () => {
    assert.equal(shouldBypass("BYPASS\tsửa DOC-06"), true)
  })
})

test("bypass: KHÔNG nhận dạng (chống bypass vô tình)", async (t) => {
  await t.test("prompt thường", () => {
    assert.equal(shouldBypass("sửa DOC-06 module billing"), false)
  })

  await t.test("BYPASS giữa câu — không đầu dòng, không sau @skill", () => {
    assert.equal(shouldBypass("hãy BYPASS cái guard này"), false)
    assert.equal(shouldBypass("tôi muốn bypass token guard"), false)
  })

  await t.test("BYPASSED — không có ranh giới \\s hoặc $ sau BYPASS", () => {
    assert.equal(shouldBypass("BYPASSED sửa DOC-06"), false)
  })

  await t.test("@skill rồi BYPASS nhưng dính liền chữ khác", () => {
    assert.equal(shouldBypass("@minipower BYPASSED sửa"), false)
  })

  await t.test("chuỗi rỗng / chỉ khoảng trắng", () => {
    assert.equal(shouldBypass(""), false)
    assert.equal(shouldBypass("   "), false)
  })
})

test("bypass: đầu vào không hợp lệ không được ném lỗi", async (t) => {
  // hook_bypass.py: `prompt or ""` — nuốt None an toàn.
  await t.test("null / undefined → false", () => {
    assert.equal(shouldBypass(null), false)
    assert.equal(shouldBypass(undefined), false)
  })
})
