/**
 * Golden test — checkAutoRouting(prompt, filePaths, opts) @ beforeSubmitPrompt
 *
 * Trả về:
 *   { action: "allow" }
 *   { action: "enrich", phase, prefix, context }
 *   { action: "block", message }
 *
 * Nguồn hành vi: install/cursor/hooks/minipower-auto-routing.py (289 dòng — bản trưởng thành nhất)
 * Đối chiếu:     .ps1 (191 dòng, bản dựng lại) và opencode/plugins/lib/auto-routing.ts (207 dòng)
 * SSOT tài liệu: agents/auto-routing.md
 *
 * Khác biệt API so với .py (cố ý):
 *   - .py trả prompt đã ghép sẵn; ở đây trả `prefix` + để caller ghép (theo bản .ts).
 *     Lý do: caller mỗi nền tảng ghép khác nhau (Cursor updated_input, OpenCode prependText).
 *   - `opts.root` thay cho đọc thẳng process.env.MINIPOWER_ROOT → test không cần global state.
 *     Mặc định vẫn là env, rồi tới "ai-skills/minipower".
 */

import test from "node:test"
import assert from "node:assert/strict"

import { checkAutoRouting } from "../lib/auto-routing.js"

const ROOT = "ai-skills/minipower"
const opts = { root: ROOT }
const route = (prompt, filePaths = []) => checkAutoRouting(prompt, filePaths, opts)

test("auto-routing: cho qua sớm", async (t) => {
  await t.test("prompt rỗng, không file", () => {
    assert.equal(route("").action, "allow")
    assert.equal(route("   ").action, "allow")
  })

  await t.test("BYPASS thắng mọi luật", () => {
    assert.equal(route("BYPASS sửa DOC-06").action, "allow")
    assert.equal(route("BYPASS review DOC-06 và DOC-08").action, "allow") // kể cả case multi-phase
  })

  await t.test("prompt không nhắc DOC nào", () => {
    assert.equal(route("giải thích pipeline minipower cho tôi").action, "allow")
  })

  await t.test("số DOC không có trong map → bỏ qua", () => {
    assert.equal(route("sửa DOC-99").action, "allow")
    assert.equal(route("sửa DOC-00").action, "allow")
  })
})

test("auto-routing: map DOC → phase (SSOT agents/auto-routing.md)", async (t) => {
  const MAP = [
    ["DOC-01", "discovery"],
    ["DOC-02", "discovery"],
    ["DOC-03", "discovery"],
    ["DOC-04", "requirements"],
    ["DOC-05", "requirements"],
    ["DOC-06", "requirements"],
    ["DOC-07", "requirements"],
    ["DOC-08", "architecture"],
    ["DOC-09", "architecture"],
    ["DOC-10", "architecture"],
    ["DOC-11", "architecture"],
    ["DOC-12", "architecture"],
    ["DOC-13", "requirements"], // bẫy: nằm ngoài dải 04–07 nhưng vẫn là requirements (NFR)
    ["DOC-14", "planning"],
    ["DOC-15", "planning"],
    ["DOC-16", "delivery"], // bẫy có ghi trong agents/auto-routing.md:
    ["DOC-17", "delivery"], //   DOC-16 nằm trong docs/03-modules/ nhưng phase là delivery
    ["DOC-18", "change-control"],
  ]

  for (const [doc, phase] of MAP) {
    await t.test(`${doc} → ${phase}`, () => {
      const r = route(`sửa ${doc}`)
      assert.equal(r.action, "enrich")
      assert.equal(r.phase, phase)
    })
  }
})

test("auto-routing: ENRICH — một phase, prompt chưa khai Phase", async (t) => {
  await t.test("chèn đủ /minipower + Phase + @skill", () => {
    const r = route("sửa DOC-06")
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
    assert.match(r.prefix, /^\/minipower$/m)
    assert.match(r.prefix, /^Phase: requirements$/m)
    assert.match(r.prefix, new RegExp(`^@${ROOT}/skills/requirements/SKILL\\.md$`, "m"))
  })

  await t.test("không chèn lại /minipower nếu prompt đã có", () => {
    const r = route("/minipower sửa DOC-06")
    assert.equal(r.action, "enrich")
    assert.doesNotMatch(r.prefix, /^\/minipower$/m)
    assert.match(r.prefix, /^Phase: requirements$/m)
  })

  await t.test("không chèn lại @skill nếu prompt đã có", () => {
    const r = route(`sửa DOC-06 @${ROOT}/skills/requirements/SKILL.md`)
    assert.equal(r.action, "enrich")
    assert.doesNotMatch(r.prefix, /SKILL\.md/)
  })

  await t.test("context nhắc token-guard: one slice", () => {
    const r = route("sửa DOC-06")
    assert.match(r.context, /Phase: requirements/)
    assert.match(r.context, /token-guard|one slice/i)
  })

  await t.test("[N2] context có State + Role theo phase", () => {
    const r = route("sửa DOC-08") // architecture → Design / SA
    assert.match(r.context, /State: Design/)
    assert.match(r.context, /Role: SA/)
  })

  await t.test("opts.root đổi được đường dẫn skill", () => {
    const r = checkAutoRouting("sửa DOC-06", [], { root: "custom/mp" })
    assert.match(r.prefix, /^@custom\/mp\/skills\/requirements\/SKILL\.md$/m)
  })

  await t.test("root có dấu / thừa ở cuối → cắt bỏ", () => {
    const r = checkAutoRouting("sửa DOC-06", [], { root: "custom/mp/" })
    assert.match(r.prefix, /^@custom\/mp\/skills\/requirements\/SKILL\.md$/m)
  })
})

test("auto-routing: nhận dạng tham chiếu DOC", async (t) => {
  await t.test("tên file đầy đủ trong prompt", () => {
    const r = route("sửa DOC-06-srs.md")
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
  })

  await t.test("nhắc trần DOC-06", () => {
    assert.equal(route("sửa DOC-06").phase, "requirements")
  })

  await t.test("không phân biệt hoa thường + separator khoảng trắng [FIX-8]", () => {
    assert.equal(route("doc-16 và doc-04 có trong tài liệu ko?").action, "block")
    assert.equal(route("doc 16 và doc 04 có trong tài liệu ko?").action, "block")
    assert.equal(route("DOC 16 và DOC 4 có trong tài liệu ko?").action, "block")
    const r = route("doc 16 và doc 04 có trong tài liệu ko?")
    assert.match(r.message, /delivery/)
    assert.match(r.message, /requirements/)
  })

  await t.test("DOC 4 (1 chữ số) chuẩn hoá thành 04 [FIX-8]", () => {
    const r = route("sửa doc 4")
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
  })

  await t.test("DOC-06-srs.md KHÔNG bị đếm hai lần (dedup theo số DOC)", () => {
    const r = route("sửa DOC-06 trong DOC-06-srs.md")
    assert.equal(r.action, "enrich") // nếu đếm 2 lần vẫn 1 phase → vẫn enrich; kiểm tra không block
    assert.equal(r.phase, "requirements")
  })

  await t.test("attachment filePaths", () => {
    const r = route("sửa giúp", ["docs/03-modules/billing/DOC-06-srs.md"])
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
  })

  await t.test("attachment dấu Windows", () => {
    const r = route("sửa giúp", ["docs\\03-modules\\billing\\DOC-06-srs.md"])
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
  })

  await t.test("@ file DOC được chèn vào prefix (chỉ khi là đường dẫn)", () => {
    const r = route("sửa giúp", ["docs/03-modules/billing/DOC-06-srs.md"])
    assert.match(r.prefix, /^@docs\/03-modules\/billing\/DOC-06-srs\.md$/m)
  })

  await t.test("nhắc trần DOC-06 KHÔNG sinh dòng @DOC-06 (không phải path)", () => {
    // .py build_route_prefix: chỉ @ khi label khớp /[\/\\]DOC-\d{2}/
    const r = route("sửa DOC-06")
    assert.doesNotMatch(r.prefix, /^@DOC-06$/m)
  })

  await t.test("đường dẫn Windows được chuẩn hoá sang / trong prefix", () => {
    const r = route("sửa giúp", ["docs\\03-modules\\billing\\DOC-06-srs.md"])
    assert.match(r.prefix, /^@docs\/03-modules\/billing\/DOC-06-srs\.md$/m)
    assert.doesNotMatch(r.prefix, /\\/)
  })

  await t.test("không chèn lại @doc nếu prompt đã có", () => {
    const p = "sửa @docs/03-modules/billing/DOC-06-srs.md"
    const r = route(p, ["docs/03-modules/billing/DOC-06-srs.md"])
    const hits = (r.prefix.match(/DOC-06-srs\.md/g) || []).length
    assert.equal(hits, 0)
  })
})

test("auto-routing: một phase + Phase: khai sẵn", async (t) => {
  await t.test("khớp → allow, không enrich", () => {
    assert.equal(route("Phase: requirements — sửa DOC-06").action, "allow")
  })

  await t.test("khớp, không phân biệt hoa thường", () => {
    assert.equal(route("phase: REQUIREMENTS — sửa DOC-06").action, "allow")
  })

  await t.test("xung đột → block", () => {
    const r = route("Phase: architecture — sửa DOC-06")
    assert.equal(r.action, "block")
    assert.match(r.message, /conflict|xung đột/i)
    assert.match(r.message, /architecture/)
    assert.match(r.message, /requirements/)
  })

  await t.test("thông điệp xung đột hướng dẫn cách sửa", () => {
    const r = route("Phase: architecture — sửa DOC-06")
    assert.match(r.message, /Phase: requirements/)
  })
})

test("auto-routing: BLOCK — nhiều phase", async (t) => {
  await t.test("hai DOC khác phase", () => {
    const r = route("review DOC-06 và DOC-08")
    assert.equal(r.action, "block")
    assert.match(r.message, /requirements/)
    assert.match(r.message, /architecture/)
  })

  await t.test("thông điệp gợi ý tách thành từng prompt 1 phase", () => {
    const r = route("review DOC-06 và DOC-08")
    assert.match(r.message, /tách/i)
    assert.match(r.message, /1\) Phase: architecture/)
    assert.match(r.message, /2\) Phase: requirements/)
  })

  await t.test("phase liệt kê theo thứ tự alphabet (ổn định, không phụ thuộc thứ tự gặp)", () => {
    const a = route("review DOC-06 và DOC-08").message
    const b = route("review DOC-08 và DOC-06").message
    assert.equal(a, b)
  })

  await t.test("có Phase: khai sẵn → thêm ghi chú giữ lại file đúng phase", () => {
    const r = route("Phase: requirements — review DOC-06 và DOC-08")
    assert.equal(r.action, "block")
    assert.match(r.message, /Phase: requirements/)
  })

  await t.test("ba phase trở lên", () => {
    const r = route("review DOC-06, DOC-08, DOC-14")
    assert.equal(r.action, "block")
    assert.match(r.message, /requirements/)
    assert.match(r.message, /architecture/)
    assert.match(r.message, /planning/)
  })

  await t.test("cùng phase, nhiều DOC → KHÔNG block", () => {
    const r = route("review DOC-06 và DOC-07")
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
  })

  await t.test("attachment + prompt khác phase → block", () => {
    const r = route("sửa DOC-08", ["docs/03-modules/billing/DOC-06-srs.md"])
    assert.equal(r.action, "block")
  })
})

test("auto-routing: đầu vào không hợp lệ", async (t) => {
  await t.test("filePaths rỗng / null", () => {
    assert.equal(route("sửa DOC-06", []).action, "enrich")
    assert.equal(checkAutoRouting("sửa DOC-06", null, opts).action, "enrich")
    assert.equal(checkAutoRouting("sửa DOC-06", undefined, opts).action, "enrich")
  })

  await t.test("prompt null → allow, không ném lỗi", () => {
    assert.equal(checkAutoRouting(null, [], opts).action, "allow")
  })

  await t.test("filePaths có phần tử rỗng → bỏ qua", () => {
    const r = checkAutoRouting("sửa DOC-06", ["", "   ", null], opts)
    assert.equal(r.action, "enrich")
    assert.equal(r.phase, "requirements")
  })

  await t.test("file không phải DOC → bỏ qua", () => {
    const r = route("sửa giúp", ["src/auth.js", "README.md"])
    assert.equal(r.action, "allow")
  })
})
