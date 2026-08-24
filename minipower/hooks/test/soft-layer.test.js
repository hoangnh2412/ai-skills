/**
 * Golden test — tầng MỀM không được hứa cái tầng CỨNG không làm (ADR-020 §8 #7, #7b).
 *
 * Tiêu chí xác minh của việc #7: *"Không skill nào còn chữ 'bắt buộc' thiếu hook/CI
 * đằng sau"*. Đó là câu tiếng Việt, không phải test — nên nó sẽ mục theo thời gian.
 * File này biến nó thành assert.
 *
 * Hai lỗi cụ thể đang canh:
 *  1. **Hứa cổng chặn** — QĐ-11 bỏ `dec-gate`, chữ ký thôi làm điều kiện máy kiểm.
 *     Markdown nào còn viết "chưa duyệt = không qua" là nói dối người đọc.
 *  2. **Barrier** — QĐ-14 đổi fan-out sang pipeline theo module. Câu "chỉ chạy giữa
 *     hai cổng" bắt module xong trước phải chờ module chưa xong.
 *
 * Test đọc VĂN BẢN nên chỉ bắt được lỗi diễn đạt đã biết mặt. Nó không thay người
 * đọc — nó chỉ bảo đảm bốn câu sai cũ không lặng lẽ quay lại.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { PROJECT_MODES } from "../lib/rules.js"

// test/ → hooks/ → minipower/
const PACK = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

const read = (...p) => readFileSync(join(PACK, ...p), "utf8")

const GATE_SKILLS = ["deliberation", "readiness-gate", "doc-review"]
const MODE_IDS = Object.keys(PROJECT_MODES)

/** Mọi SKILL.md trong skills/ + các markdown điều phối hay nhắc tới cổng. */
function markdownFiles() {
  const out = []
  const skills = join(PACK, "skills")
  for (const d of readdirSync(skills, { withFileTypes: true })) {
    if (!d.isDirectory()) continue
    const f = join(skills, d.name, "SKILL.md")
    if (existsSync(f)) out.push([`skills/${d.name}/SKILL.md`, readFileSync(f, "utf8")])
  }
  for (const rel of [
    "SKILL.md",
    "docs/parallel-work.md",
    "docs/pipeline.md",
    "agents/approval-gate.md",
  ]) {
    out.push([rel, read(rel)])
  }
  return out
}

// ─── #7 — 3 skill gate khai hành vi per-mode ────────────────────────────────

test("#7 — mỗi skill gate có mục 'Theo chế độ dự án' phủ đủ 3 chế độ", () => {
  for (const s of GATE_SKILLS) {
    const text = read("skills", s, "SKILL.md")
    assert.match(text, /[Tt]heo chế độ dự án/, `${s}: thiếu mục theo chế độ`)
    for (const id of MODE_IDS) {
      assert.match(text, new RegExp(`\`${id}\``), `${s}: chưa khai chế độ \`${id}\``)
    }
  }
})

test("#7 — skill gate KHÔNG lặp lại định nghĩa chế độ, phải trỏ về router", () => {
  // Lặp định nghĩa = hai nguồn chân lý = drift. Router là chỗ duy nhất (vùng generated).
  for (const s of GATE_SKILLS) {
    const text = read("skills", s, "SKILL.md")
    assert.match(
      text,
      /không lặp lại ở đây/i,
      `${s}: phải nói rõ không lặp định nghĩa chế độ`,
    )
    assert.match(
      text,
      /SKILL\.md#chế-độ-dự-án-project_mode/,
      `${s}: phải trỏ về router § Chế độ dự án`,
    )
    // Nhắc TÊN trường (`prereq_overrides`, `docs_focus`) là được — đó là trỏ.
    // Cấm là copy nguyên BẢNG generated của router sang: bảng copy sẽ lệch khi
    // `rules.json` đổi, mà `gen:check` không canh bản copy.
    // (Không dò theo nhãn chế độ — "MVP" là từ thông dụng, bắt oan.)
    assert.doesNotMatch(
      text,
      /DOC cần điền \(`docs_focus`\)/,
      `${s}: copy bảng chế độ từ router — chỉ được trỏ`,
    )
  }
})

test("#7 — skill gate nói rõ mình MỀM, phần cứng do hook làm", () => {
  for (const s of GATE_SKILLS) {
    const text = read("skills", s, "SKILL.md")
    assert.match(
      text,
      /mềm|advisory|người quyết|verdict cuối/i,
      `${s}: phải nói rõ ranh giới mềm/cứng`,
    )
  }
})

// ─── #7b — fan-out là pipeline, không phải barrier ──────────────────────────

test("#7b — fan-out mô hình pipeline theo module, bỏ barrier", () => {
  const text = read("skills", "fan-out", "SKILL.md")
  assert.match(text, /pipeline theo module/i, "phải khai rõ mô hình pipeline")
  assert.match(text, /mỗi module một nhịp|nhịp riêng/i)
  assert.match(text, /QĐ-14/, "phải trỏ quyết định nguồn")
  assert.match(text, /không.*chờ|không chờ nhau/i, "phải nói module không chờ nhau")
})

test("#7b — fan-out KHÔNG còn bắt kiểm DEC trước khi chạy", () => {
  const text = read("skills", "fan-out", "SKILL.md")
  assert.doesNotMatch(text, /Kiểm cổng \(bắt buộc\)/i)
  assert.doesNotMatch(text, /chỉ chạy GIỮA hai cổng/i)
  assert.doesNotMatch(
    text,
    /DEC "đã chốt".*Chưa.*dừng/is,
    "fan-out không được dừng vì thiếu DEC (QĐ-11)",
  )
})

// ─── Chung — không markdown nào hứa cổng chặn ───────────────────────────────

test("QĐ-11 — không markdown nào còn hứa 'chưa duyệt = không qua'", () => {
  const BANNED = [
    [/không có DEC chốt cho cổng = không qua/i, 'hứa "không có DEC = không qua"'],
    [/fan-out chỉ nằm giữa hai cổng/i, "hứa fan-out bị kẹp giữa hai cổng"],
    [/KHÔNG tự sang bước sau/i, "hứa AI bị chặn sang bước sau"],
    [/mới được fan-out/i, "hứa fan-out cần điều kiện chữ ký"],
  ]
  const problems = []
  for (const [name, text] of markdownFiles()) {
    for (const [re, why] of BANNED) {
      if (re.test(text)) problems.push(`${name}: ${why}`)
    }
  }
  assert.deepEqual(problems, [], `tầng mềm còn hứa cổng chặn:\n${problems.join("\n")}`)
})

test("QĐ-11 — approval-gate.md tự khai là advisory, không phải rào", () => {
  const text = read("agents", "approval-gate.md")
  assert.match(text, /advisory/i)
  assert.match(text, /[Kk]hông hook nào enforce/, "phải nói thẳng không hook nào enforce")
  assert.match(text, /QĐ-11/)
})
