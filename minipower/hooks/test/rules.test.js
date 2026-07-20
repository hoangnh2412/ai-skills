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
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import {
  RULES,
  PHASE_BY_DOC,
  PHASE_ORDER,
  PHASE_LABEL,
  EDIT_VERBS,
  BREADTH,
  DOC_SHORT,
  PHASE_META,
  ROLES,
  PREREQ_BY_INTENT,
  CONTEXT_CHAIN,
  APPROVAL_GATES,
  formatDocRanges,
  stripDiacritics,
  docLabel,
  stateForPhase,
  roleForPhase,
  matchIntents,
} from "../lib/rules.js"

const HOOKS = dirname(dirname(fileURLToPath(import.meta.url)))

test("rules.json — phủ đủ DOC-01..19, phase hợp lệ", () => {
  for (let i = 1; i <= 19; i++) {
    const key = String(i).padStart(2, "0")
    assert.ok(PHASE_BY_DOC[key], `thiếu ${key}`)
    assert.ok(PHASE_ORDER.includes(PHASE_BY_DOC[key]), `phase lạ cho ${key}: ${PHASE_BY_DOC[key]}`)
  }
  assert.equal(Object.keys(PHASE_BY_DOC).length, 19)
  assert.equal(PHASE_BY_DOC["19"], "requirements") // DOC-19 Prototype thuộc requirements
})

test("PHASE_LABEL — suy ra khớp chuỗi cũ", () => {
  assert.equal(PHASE_LABEL.discovery, "discovery (DOC-01–03)")
  assert.equal(PHASE_LABEL.requirements, "requirements (DOC-04–07, 13, 19)")
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

// ─── N1/N2/N3/N4 — dữ liệu bổ sung ──────────────────────────────────────────

test("doc_short (N4) — phủ đủ DOC-01..19, không ngoặc lồng", () => {
  for (let i = 1; i <= 19; i++) {
    const key = String(i).padStart(2, "0")
    assert.ok(DOC_SHORT[key], `thiếu doc_short ${key}`)
    assert.ok(!/[()]/.test(DOC_SHORT[key]), `doc_short ${key} có ngoặc → docLabel lồng`)
  }
  assert.equal(docLabel("06"), "DOC-06 (SRS)")
  assert.equal(docLabel(3), "DOC-03 (BRD)")
})

test("phase_meta (N2) — mọi phase có state+role, role trỏ ROLES hợp lệ", () => {
  const roleIds = new Set(ROLES.map((r) => r.id))
  for (const phase of PHASE_ORDER) {
    const meta = PHASE_META[phase]
    assert.ok(meta && meta.state && meta.role, `phase ${phase} thiếu state/role`)
    // role có thể là "DEV / QC / DevOps" — mỗi token phải là role hợp lệ.
    for (const id of meta.role.split("/").map((s) => s.trim())) {
      assert.ok(roleIds.has(id), `phase ${phase}: role lạ "${id}"`)
    }
  }
  assert.equal(stateForPhase("architecture"), "Design")
  assert.equal(roleForPhase("architecture"), "SA")
  assert.equal(stateForPhase("phase-khong-ton-tai"), "phase-khong-ton-tai")
})

test("roles (N3) — id duy nhất, phase hợp lệ, file .md", () => {
  const ids = ROLES.map((r) => r.id)
  assert.equal(new Set(ids).size, ids.length, "role id trùng")
  const phases = new Set(PHASE_ORDER)
  for (const r of ROLES) {
    assert.ok(r.file.endsWith(".md"), `role ${r.id} file lạ`)
    for (const p of r.phase.split(",").map((s) => s.trim())) {
      assert.ok(phases.has(p), `role ${r.id}: phase lạ "${p}"`)
    }
  }
})

test("role files (N3) — mỗi role trong rules.json có file thật", () => {
  const rolesDir = join(dirname(HOOKS), "roles")
  for (const r of ROLES) {
    assert.ok(existsSync(join(rolesDir, r.file)), `thiếu file roles/${r.file}`)
  }
})

test("prereq_by_intent (N1) — requires trỏ DOC hợp lệ, keyword không dấu", () => {
  assert.ok(PREREQ_BY_INTENT.length >= 3)
  for (const it of PREREQ_BY_INTENT) {
    assert.ok(it.keywords.length >= 1, `intent ${it.id} không keyword`)
    for (const k of it.keywords) {
      assert.equal(k, stripDiacritics(k.toLowerCase()), `keyword "${k}" phải strip+lower để match norm`)
    }
    for (const d of it.requires) {
      assert.ok(PHASE_BY_DOC[d], `intent ${it.id}: DOC lạ "${d}"`)
    }
  }
})

test("matchIntents (N1) — nhận diện intent từ prompt đã strip", () => {
  const hit = matchIntents(stripDiacritics("giúp tôi viết code cho module billing".toLowerCase()))
  assert.ok(hit.some((h) => h.id === "implement"), "miss intent implement")
  assert.equal(matchIntents(stripDiacritics("chào bạn".toLowerCase())).length, 0)
})

test("context_chain (N4) — mỗi mục có doc hợp lệ HOẶC path", () => {
  assert.ok(CONTEXT_CHAIN.length >= 3)
  for (const c of CONTEXT_CHAIN) {
    if (c.doc) assert.ok(DOC_SHORT[c.doc], `context doc lạ "${c.doc}"`)
    else assert.ok(c.path, `context "${c.label}" thiếu cả doc lẫn path`)
  }
})

// ─── A2/A3 — gated fan-out (ADR 2026-07-20 gated-fanout) ─────────────────────

test("approval_gates (A2) — id duy nhất, approve trỏ DOC hợp lệ, có label+unlocks", () => {
  assert.ok(APPROVAL_GATES.length >= 5)
  const ids = APPROVAL_GATES.map((g) => g.id)
  assert.equal(new Set(ids).size, ids.length, "gate id trùng")
  for (const g of APPROVAL_GATES) {
    assert.ok(g.label && g.unlocks, `gate ${g.id} thiếu label/unlocks`)
    assert.ok(PHASE_BY_DOC[g.approve], `gate ${g.id}: approve DOC lạ "${g.approve}"`)
  }
  // Cổng prototype duyệt đúng DOC-19.
  assert.ok(APPROVAL_GATES.some((g) => g.id === "prototype" && g.approve === "19"))
})

test("intent prototype (A3) — nhận diện, requires DOC-04 (Business Rules đã chốt)", () => {
  const proto = PREREQ_BY_INTENT.find((it) => it.id === "prototype")
  assert.ok(proto, "thiếu intent prototype")
  assert.deepEqual(proto.requires, ["04"])
  assert.ok(matchIntents(stripDiacritics("vẽ prototype cho module billing".toLowerCase())).some((h) => h.id === "prototype"))
  // implement (viết code) nay cần cả prototype DOC-19.
  const impl = PREREQ_BY_INTENT.find((it) => it.id === "implement")
  assert.ok(impl.requires.includes("19"), "implement phải yêu cầu DOC-19 prototype")
})
