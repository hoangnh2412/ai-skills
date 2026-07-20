/**
 * Minipower — rules-as-data loader (R3 / ADR §5.2).
 *
 * SSOT duy nhất cho map DOC→phase và các danh sách từ khoá heuristic là
 * [rules.json](./rules.json). File này CHỈ đọc + suy ra cấu trúc dùng chung;
 * không hardcode luật. Thêm DOC-19 = **một dòng** trong rules.json (auto-routing,
 * token-guard và agents/auto-routing.md đều sinh từ đây — chạy `npm run gen`).
 *
 * Vì sao keyword lưu dạng tiếng Việt CÓ DẤU nhưng match được prompt không dấu:
 * cả prompt lẫn keyword đều được `stripDiacritics` + lowercase trước khi so
 * (xem token-guard.js). Nhờ đó rules.json đọc được cho người, mà vẫn diệt sạch
 * class bug có-dấu/không-dấu từng khiến .ps1 và .sh/.ts lệch nhau (ADR §1.1).
 */

import { readFileSync } from "node:fs"

/** @typedef {{
 *   phase_by_doc: Record<string,string>,
 *   phase_order: string[],
 *   edit_verbs: string[],
 *   breadth_words: string[],
 *   doc_short: Record<string,string>,
 *   phase_meta: Record<string,{state:string,role:string}>,
 *   roles: {id:string,title:string,phase:string,file:string}[],
 *   prereq_by_intent: {id:string,label:string,keywords:string[],requires:string[]}[],
 *   context_chain: {label:string,doc?:string,path?:string}[],
 *   approval_gates: {id:string,label:string,approve:string,unlocks:string}[]
 * }} Rules */

/** @type {Rules} */
export const RULES = JSON.parse(readFileSync(new URL("./rules.json", import.meta.url), "utf8"))

/** Bỏ dấu tiếng Việt (gồm đ/Đ mà NFD không tách). Dùng chung cho match keyword. */
export function stripDiacritics(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
}

/** @type {Record<string,string>} DOC "01".."18" → phase. */
export const PHASE_BY_DOC = RULES.phase_by_doc

/** @type {string[]} Thứ tự phase để hiển thị/nhóm (deterministic). */
export const PHASE_ORDER = RULES.phase_order

const pad = (n) => String(n).padStart(2, "0")

/** [1,2,3] → "01–03"; [4,5,6,7,13] → "04–07, 13"; [18] → "18". */
export function formatDocRanges(nums) {
  const sorted = [...nums].sort((a, b) => a - b)
  const groups = []
  let start = sorted[0]
  let prev = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i]
      continue
    }
    groups.push([start, prev])
    start = sorted[i]
    prev = sorted[i]
  }
  groups.push([start, prev])
  return groups.map(([s, e]) => (s === e ? pad(s) : `${pad(s)}–${pad(e)}`)).join(", ")
}

/** DOC numbers thuộc một phase, đã sort. */
export function docsForPhase(phase) {
  return Object.entries(PHASE_BY_DOC)
    .filter(([, p]) => p === phase)
    .map(([d]) => Number(d))
    .sort((a, b) => a - b)
}

/** @type {Record<string,string>} phase → nhãn hiển thị, vd "discovery (DOC-01–03)". */
export const PHASE_LABEL = (() => {
  const label = {}
  for (const phase of PHASE_ORDER) {
    const nums = docsForPhase(phase)
    if (nums.length) label[phase] = `${phase} (DOC-${formatDocRanges(nums)})`
  }
  return label
})()

/** Danh sách từ (tiếng Việt có dấu) → regex substring, match trên text đã strip+lower. */
function wordListRegex(words) {
  const alts = words.map((w) =>
    stripDiacritics(w.toLowerCase()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  )
  return new RegExp(alts.join("|"))
}

/** [FIX-1] Động từ sửa — Việt (đã strip) + Anh. Match trên `norm` trong token-guard. */
export const EDIT_VERBS = wordListRegex(RULES.edit_verbs)

/** Từ khoá độ rộng — prompt quá rộng. Match trên `norm`. */
export const BREADTH = wordListRegex(RULES.breadth_words)

// ─── N1/N2/N4 — dữ liệu bổ sung, cùng SSOT rules.json ───────────────────────

/** @type {Record<string,string>} DOC "01".."18" → tên ngắn (SSOT nhãn DOC). */
export const DOC_SHORT = RULES.doc_short

/** "06" → "DOC-06 (SRS)"; số không rõ → "DOC-06". */
export function docLabel(num) {
  const key = pad(Number(num))
  const short = DOC_SHORT[key]
  return short ? `DOC-${key} (${short})` : `DOC-${key}`
}

/** @type {Record<string,{state:string,role:string}>} phase → giai đoạn vòng đời + vai trò chính (N2). */
export const PHASE_META = RULES.phase_meta

/** phase → giai đoạn dự án ("Design"…) hoặc phase gốc nếu thiếu. */
export function stateForPhase(phase) {
  return (PHASE_META[phase] && PHASE_META[phase].state) || phase
}

/** phase → vai trò chính ("SA"…) hoặc "" nếu thiếu. */
export function roleForPhase(phase) {
  return (PHASE_META[phase] && PHASE_META[phase].role) || ""
}

/** @type {{id:string,title:string,phase:string,file:string}[]} Danh mục vai trò (N3). */
export const ROLES = RULES.roles

/** @type {{id:string,label:string,keywords:string[],requires:string[]}[]} Bộ tiền đề theo intent (N1). */
export const PREREQ_BY_INTENT = RULES.prereq_by_intent

/**
 * Nhận diện intent từ prompt đã chuẩn hoá (strip+lower). Keyword lưu KHÔNG dấu
 * trong rules.json → so trực tiếp trên `norm`. Trả mọi intent khớp (có thể nhiều).
 * @param {string} norm text đã stripDiacritics + toLowerCase
 * @returns {{id:string,label:string,requires:string[]}[]}
 */
export function matchIntents(norm) {
  const s = String(norm)
  return PREREQ_BY_INTENT.filter((it) => it.keywords.some((k) => s.includes(k))).map(
    ({ id, label, requires }) => ({ id, label, requires }),
  )
}

/** @type {{label:string,doc?:string,path?:string}[]} Chuỗi ngữ cảnh auto-load (N4). */
export const CONTEXT_CHAIN = RULES.context_chain

/**
 * @type {{id:string,label:string,approve:string,unlocks:string}[]}
 * Cổng người-chốt (A2, ADR 2026-07-20 gated-fanout). Mỗi cổng: người duyệt DOC
 * `approve` (ghi DEC) → mở khoá bước `unlocks`. AI soạn DEC nháp, người review.
 */
export const APPROVAL_GATES = RULES.approval_gates
