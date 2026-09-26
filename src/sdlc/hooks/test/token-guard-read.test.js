/**
 * Golden test — checkReadGuard(filePath, prompt) @ beforeReadFile
 *
 * Trả về: { action: "allow" } | { action: "deny", message }
 *
 * Nguồn hành vi: install/cursor/hooks/minipower-token-guard-read.sh
 * Đối chiếu:     .ps1 và opencode/plugins/lib/token-guard-read.ts
 *
 * Luật (theo .sh):
 *   - path rỗng → allow
 *   - docs/02-baseline → deny VÔ ĐIỀU KIỆN (kể cả prompt nói migrate)
 *   - docs/03-modules/_legacy → deny TRỪ KHI prompt nhắc _legacy | MIGRATION | migrate
 *   - còn lại → allow
 *
 * Quyết định đã chốt (ADR §6, 2026-07-17):
 *   Q7a — baseline DENY TUYỆT ĐỐI: không lối thoát, kể cả prompt nói migrate.
 *         (Tài liệu agents/token-guard.md + docs/token-guard.md phải sửa cho khớp — P4.)
 *   Q7b — read-guard KHÔNG gọi shouldBypass: BYPASS không mở được read-guard.
 *         Lý do: bảo vệ token, chặn AI đọc thừa. read-guard là guard nghiêm nhất, có chủ đích.
 *
 *   Ngoại lệ DUY NHẤT còn lại: _legacy mở khi prompt có _legacy | MIGRATION | migrate.
 *   Baseline KHÔNG có ngoại lệ này.
 */

import test from "node:test"
import assert from "node:assert/strict"

import { checkReadGuard } from "../lib/token-guard-read.js"

const guard = (filePath, prompt = "") => checkReadGuard(filePath, prompt)
const action = (filePath, prompt = "") => guard(filePath, prompt).action

test("token-guard-read: cho qua", async (t) => {
  await t.test("path rỗng / khoảng trắng", () => {
    assert.equal(action(""), "allow")
    assert.equal(action("   "), "allow")
  })

  await t.test("file DOC bình thường", () => {
    assert.equal(action("docs/03-modules/billing/DOC-06-srs.md"), "allow")
    assert.equal(action("docs/04-platform/DOC-08-sad.md"), "allow")
    assert.equal(action("docs/01-project/DOC-01-vision-business-case.md"), "allow")
  })

  await t.test("file ngoài docs/", () => {
    assert.equal(action("src/auth.js"), "allow")
    assert.equal(action("memory/requirements/decision-log.md"), "allow")
  })

  await t.test("tên module chứa chữ 'baseline' nhưng không phải 02-baseline", () => {
    assert.equal(action("docs/03-modules/baseline-report/DOC-06-srs.md"), "allow")
  })
})

test("token-guard-read: DENY — docs/02-baseline", async (t) => {
  await t.test("deny mọi độ sâu", () => {
    assert.equal(action("docs/02-baseline"), "deny")
    assert.equal(action("docs/02-baseline/v1.0/README.md"), "deny")
    assert.equal(action("docs/02-baseline/v1.0/manifest.yaml"), "deny")
  })

  await t.test("deny với đường dẫn tuyệt đối", () => {
    assert.equal(action("/home/u/proj/docs/02-baseline/v1.0/README.md"), "deny")
    assert.equal(action("D:/proj/docs/02-baseline/v1.0/README.md"), "deny")
  })

  await t.test("dấu Windows được chuẩn hoá trước khi so", () => {
    assert.equal(action("docs\\02-baseline\\v1.0\\README.md"), "deny")
    assert.equal(action("D:\\proj\\docs\\02-baseline\\v1.0\\README.md"), "deny")
  })

  await t.test("deny KỂ CẢ khi prompt nói migrate (khác _legacy)", () => {
    assert.equal(action("docs/02-baseline/v1.0/README.md", "migrate sang v2"), "deny")
    assert.equal(action("docs/02-baseline/v1.0/README.md", "đọc MIGRATION.md"), "deny")
  })

  await t.test("thông điệp deny giải thích lý do + lối thoát", () => {
    const r = guard("docs/02-baseline/v1.0/README.md")
    assert.equal(r.action, "deny")
    assert.match(r.message, /02-baseline/)
    assert.match(r.message, /token/i)
  })
})

test("token-guard-read: DENY — docs/03-modules/_legacy (có điều kiện)", async (t) => {
  await t.test("deny khi prompt không nhắc migrate", () => {
    assert.equal(action("docs/03-modules/_legacy/old-srs.md"), "deny")
    assert.equal(action("docs/03-modules/_legacy/old-srs.md", "sửa DOC-06"), "deny")
  })

  await t.test("dấu Windows", () => {
    assert.equal(action("docs\\03-modules\\_legacy\\old-srs.md"), "deny")
  })

  await t.test("allow khi prompt nhắc _legacy", () => {
    assert.equal(action("docs/03-modules/_legacy/old-srs.md", "đọc _legacy giúp tôi"), "allow")
  })

  await t.test("allow khi prompt nhắc migrate", () => {
    assert.equal(action("docs/03-modules/_legacy/old-srs.md", "migrate module billing"), "allow")
  })

  await t.test("allow khi prompt nhắc MIGRATION", () => {
    assert.equal(action("docs/03-modules/_legacy/old-srs.md", "theo MIGRATION.md"), "allow")
  })

  await t.test("thông điệp deny nêu điều kiện mở khoá", () => {
    const r = guard("docs/03-modules/_legacy/old-srs.md")
    assert.equal(r.action, "deny")
    assert.match(r.message, /_legacy|MIGRATION/)
  })
})

test("token-guard-read: Q7b — BYPASS KHÔNG mở read-guard (đã chốt)", async (t) => {
  await t.test("BYPASS + baseline → vẫn deny", () => {
    assert.equal(action("docs/02-baseline/v1.0/README.md", "BYPASS đọc giúp"), "deny")
  })

  await t.test("BYPASS + _legacy (không nhắc migrate) → vẫn deny", () => {
    assert.equal(action("docs/03-modules/_legacy/old.md", "BYPASS đọc giúp"), "deny")
  })
})

test("token-guard-read: đầu vào không hợp lệ", async (t) => {
  await t.test("null / undefined → allow, không ném lỗi", () => {
    assert.equal(action(null), "allow")
    assert.equal(action(undefined), "allow")
    assert.equal(checkReadGuard("docs/03-modules/billing/DOC-06-srs.md", null).action, "allow")
  })
})
