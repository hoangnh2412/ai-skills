/**
 * Golden test — checkTokenGuard(prompt) @ beforeSubmitPrompt
 *
 * Trả về: { action: "allow" } | { action: "warn", message } | { action: "block", message }
 *
 * Nguồn hành vi: install/cursor/hooks/minipower-token-guard.sh (bản đầy đủ nhất)
 * Đối chiếu:     .ps1 và opencode/plugins/lib/token-guard.ts
 *
 * ⚠ Ba bản cài đặt hiện tại BẤT ĐỒNG. Test này encode hành vi ĐÚNG, không phải
 *   hành vi của một bản cụ thể. Case sửa lỗi được đánh dấu [FIX-n]:
 *
 *   [FIX-1] Động từ sửa: .ps1 dùng danh sách KHÔNG DẤU ('sua|cap nhat'), .sh/.ts
 *           dùng CÓ DẤU ('sửa|cập nhật') và thiếu 'update|write|edit'.
 *           → Bản JS phải nhận CẢ HAI (chuẩn hoá bỏ dấu trước khi match).
 *   [FIX-2] Dấu phân cách path: .ps1 chỉ match '@docs/02-baseline'; .sh/.ts match
 *           cả '\'. → Bản JS nhận cả hai trên mọi OS.
 *   [FIX-3] hasDoc: cả ba bản dùng /DOC-0[0-9]/ → DOC-10..DOC-18 KHÔNG BAO GIỜ
 *           tính là "đã khai DOC". Một nửa bộ tài liệu bị cảnh báo sai.
 *           → Bản JS dùng /DOC-\d{2}/.
 *   [FIX-4] 'module:' — .sh match chữ thường, .ps1 đòi 'Module:' hoa.
 *           → Bản JS không phân biệt hoa thường.
 *
 * Thứ tự quyết định (giữ nguyên từ .sh):
 *   rỗng → allow · bypass → allow · block(@thư mục) · block(baseline/_legacy)
 *   · warn(thiếu scope) · warn(quá rộng) · allow
 */

import test from "node:test"
import assert from "node:assert/strict"

import { checkTokenGuard } from "../lib/token-guard.js"

const action = (prompt) => checkTokenGuard(prompt).action

test("token-guard: cho qua sớm", async (t) => {
  await t.test("prompt rỗng / chỉ khoảng trắng", () => {
    assert.equal(action(""), "allow")
    assert.equal(action("   \n  "), "allow")
  })

  await t.test("BYPASS thắng cả luật block", () => {
    assert.equal(action("BYPASS @docs/"), "allow")
    assert.equal(action("BYPASS @docs/02-baseline/v1.0/README.md"), "allow")
  })
})

test("token-guard: BLOCK — @ cả thư mục", async (t) => {
  await t.test("@docs/ ở cuối prompt", () => {
    assert.equal(action("@docs/"), "block")
    assert.equal(action("@docs"), "block")
    assert.equal(action("xem giúp @docs/  "), "block") // khoảng trắng cuối vẫn tính
  })

  await t.test("@docs\\ — dấu Windows [FIX-2]", () => {
    assert.equal(action("@docs\\"), "block")
  })

  await t.test("@docs/03-modules/ ở cuối prompt", () => {
    assert.equal(action("@docs/03-modules/"), "block")
    assert.equal(action("@docs/03-modules"), "block")
    assert.equal(action("@docs\\03-modules\\"), "block") // [FIX-2]
  })

  await t.test("KHÔNG block khi @docs không ở cuối (đã trỏ vào file)", () => {
    assert.equal(action("@docs/03-modules/billing/DOC-06-srs.md"), "allow")
  })

  await t.test("thông điệp block gợi ý @ 1 file cụ thể", () => {
    const r = checkTokenGuard("@docs/")
    assert.equal(r.action, "block")
    assert.match(r.message, /@docs\/03-modules\/\{module-id\}\/DOC-06-srs\.md/)
  })
})

test("token-guard: BLOCK — 02-baseline và _legacy", async (t) => {
  await t.test("@docs/02-baseline (mọi độ sâu)", () => {
    assert.equal(action("@docs/02-baseline"), "block")
    assert.equal(action("@docs/02-baseline/v1.0/README.md"), "block")
  })

  await t.test("@docs\\02-baseline — dấu Windows [FIX-2]", () => {
    assert.equal(action("@docs\\02-baseline\\v1.0\\README.md"), "block")
  })

  await t.test("@docs/03-modules/_legacy", () => {
    assert.equal(action("@docs/03-modules/_legacy/old.md"), "block")
    assert.equal(action("@docs\\03-modules\\_legacy\\old.md"), "block") // [FIX-2]
  })

  await t.test("block baseline BẤT KỂ prompt có nói migrate", () => {
    // Khác với read-guard: token-guard block vô điều kiện (theo .sh).
    assert.equal(action("migrate @docs/02-baseline/v1.0/README.md"), "block")
  })
})

test("token-guard: WARN — thiếu scope", async (t) => {
  // Điều kiện warn: looksLikeMinipower && looksLikeEdit && !hasAtFile
  //                 && (!hasPhase || !hasDoc || !hasScopeTarget)

  await t.test("đủ scope (Phase + DOC + Module) → allow", () => {
    assert.equal(action("Phase: requirements — sửa DOC-06, Module: billing"), "allow")
  })

  await t.test("[FIX-3] DOC-10..DOC-18 phải tính là đã khai DOC", () => {
    // Cả 3 bản hiện tại: /DOC-0[0-9]/ → warn sai ở toàn bộ nhóm này.
    assert.equal(action("Phase: architecture — sửa DOC-12, Module: billing"), "allow")
    assert.equal(action("Phase: architecture — sửa DOC-10, Module: billing"), "allow")
    assert.equal(action("Phase: planning — sửa DOC-14, Module: billing"), "allow")
    assert.equal(action("Phase: delivery — sửa DOC-16, Module: billing"), "allow")
    assert.equal(action("Phase: change-control — sửa DOC-18, Module: billing"), "allow")
  })

  await t.test("DOC-01..DOC-09 vẫn tính (không được regress)", () => {
    assert.equal(action("Phase: discovery — sửa DOC-01, Module: billing"), "allow")
    assert.equal(action("Phase: requirements — sửa DOC-09, Module: billing"), "allow")
  })

  await t.test("thiếu Phase → warn", () => {
    assert.equal(action("minipower sửa DOC-06, Module: billing"), "warn")
  })

  await t.test("thiếu DOC → warn", () => {
    assert.equal(action("Phase: requirements — sửa mô tả, Module: billing"), "warn")
  })

  await t.test("thiếu Module/platform → warn", () => {
    assert.equal(action("Phase: requirements — sửa DOC-06"), "warn")
  })

  await t.test("[FIX-1] động từ sửa: cả có dấu lẫn không dấu, Việt lẫn Anh", () => {
    // .sh/.ts bỏ sót 'update|edit|write'; .ps1 bỏ sót toàn bộ chữ có dấu.
    for (const verb of ["sửa", "sua", "cập nhật", "cap nhat", "viết", "viet", "thêm", "them", "update", "edit", "write", "sync", "đồng bộ", "review"]) {
      assert.equal(action(`Phase: requirements — ${verb} DOC-06`), "warn", `động từ "${verb}" phải kích hoạt kiểm tra scope`)
    }
  })

  await t.test("prompt không phải hành động sửa → không warn", () => {
    // 'giải thích' không nằm trong danh sách động từ sửa.
    assert.equal(action("Phase: requirements — giải thích DOC-06 giúp tôi"), "allow")
  })

  await t.test("không liên quan minipower → không warn dù thiếu scope", () => {
    assert.equal(action("sửa hàm login trong auth.js"), "allow")
  })

  await t.test("có @ file đích → bỏ qua kiểm tra scope", () => {
    assert.equal(action("Phase: requirements — sửa @docs/03-modules/billing/DOC-06-srs.md"), "allow")
    assert.equal(action("sửa @docs/04-platform/DOC-08-sad.md"), "allow")
  })

  await t.test("thông điệp warn nêu đúng 3 thứ cần thêm", () => {
    const r = checkTokenGuard("Phase: requirements — sửa DOC-06")
    assert.equal(r.action, "warn")
    assert.match(r.message, /Phase/)
    assert.match(r.message, /Module/)
    assert.match(r.message, /DOC-XX/)
  })
})

test("token-guard: nhận dạng scope target", async (t) => {
  await t.test("Module: — không phân biệt hoa thường [FIX-4]", () => {
    assert.equal(action("Phase: requirements — sửa DOC-06, Module: billing"), "allow")
    assert.equal(action("Phase: requirements — sửa DOC-06, module: billing"), "allow")
    assert.equal(action("Phase: requirements — sửa DOC-06, MODULE: billing"), "allow")
  })

  await t.test("đường dẫn 03-modules/{module}", () => {
    assert.equal(action("Phase: requirements — sửa DOC-06 trong 03-modules/billing"), "allow")
    assert.equal(action("Phase: requirements — sửa DOC-06 trong 03-modules\\billing"), "allow")
  })

  await t.test("_template và _legacy KHÔNG tính là module", () => {
    assert.equal(action("Phase: requirements — sửa DOC-06 trong 03-modules/_template"), "warn")
  })

  await t.test("ID có prefix module (BIL-FR-012) tính là module", () => {
    assert.equal(action("Phase: requirements — sửa BIL-FR-012 trong DOC-06"), "allow")
    assert.equal(action("Phase: architecture — sửa PAY-ADR-003 trong DOC-09"), "allow")
  })

  await t.test("04-platform tính là scope target", () => {
    assert.equal(action("Phase: architecture — sửa DOC-08 trong 04-platform"), "allow")
    assert.equal(action("Phase: architecture — sửa DOC-08 @docs/04-platform"), "allow")
  })
})

test("token-guard: WARN — prompt quá rộng", async (t) => {
  // Khai ĐỦ scope (Phase + Module: + DOC) để nhánh "thiếu scope" KHÔNG bắn,
  // cô lập đúng nhánh "quá rộng". Nếu không, warn thiếu-scope bắn trước → test pass nhầm lý do.
  await t.test("từ khoá độ rộng (đã đủ scope, chỉ còn nhánh breadth)", () => {
    for (const w of ["toàn bộ", "all modules", "sync everything", "đồng bộ hết", "review all"]) {
      const r = checkTokenGuard(`Phase: requirements — Module: billing, ${w} DOC-06`)
      assert.equal(r.action, "warn", `"${w}" phải cảnh báo quá rộng`)
      assert.match(r.message, /tách|token/i)
    }
  })

  await t.test("[FIX-1] từ khoá độ rộng không dấu", () => {
    assert.equal(action("Phase: requirements — Module: billing, toan bo DOC-06"), "warn")
    assert.equal(action("Phase: requirements — Module: billing, dong bo het DOC-06"), "warn")
  })

  await t.test("không phân biệt hoa thường", () => {
    assert.equal(action("Phase: requirements — Module: billing, REVIEW ALL DOC-06"), "warn")
  })
})

test("token-guard: block ưu tiên hơn warn", async (t) => {
  await t.test("prompt vừa quá rộng vừa @ thư mục → block", () => {
    assert.equal(action("review toàn bộ @docs/"), "block")
  })
})

test("token-guard: đầu vào không hợp lệ", async (t) => {
  await t.test("null / undefined → allow, không ném lỗi", () => {
    assert.equal(action(null), "allow")
    assert.equal(action(undefined), "allow")
  })
})
