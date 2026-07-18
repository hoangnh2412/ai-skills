/**
 * Minipower — token guard @ beforeSubmitPrompt.
 * SSOT. Hợp nhất từ minipower-token-guard.{sh,ps1} + token-guard.ts.
 *
 * Trả về quyết định thuần (không print/exit) để vừa test được vừa import được
 * từ shim mỗi nền tảng.
 *
 * @typedef {{action:"allow", tier?:"micro", note?:string}
 *          |{action:"warn", message:string}
 *          |{action:"block", message:string}} GuardResult
 *
 * Khác biệt có chủ đích so với các bản cũ (xem ADR §7b):
 *   [FIX-1] Động từ sửa + từ khoá độ rộng: chuẩn hoá bỏ dấu tiếng Việt trước khi
 *           match, và gộp cả Việt lẫn Anh (update|edit|write). Diệt class bug
 *           .ps1 (không dấu, thiếu chữ có dấu) vs .sh/.ts (có dấu, thiếu update).
 *   [FIX-3] hasDoc = /DOC-\d{2}/ — phủ DOC-01…DOC-18 (Q8=A). Bản cũ /DOC-0[0-9]/
 *           bỏ sót DOC-10…DOC-18 → cảnh báo sai ở 9/18 tài liệu.
 *   [FIX-4] module: không phân biệt hoa thường (đã có sẵn ở .ts).
 */

import { shouldBypass } from "./bypass.js"

/** Bỏ dấu tiếng Việt (gồm đ/Đ mà NFD không tách). */
function stripDiacritics(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
}

const HAS_PHASE = /Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)/i
// [FIX-1] danh sách không dấu — khớp cả prompt có dấu (đã strip) lẫn không dấu.
const EDIT_VERBS = /sua|cap nhat|viet|them|sync|dong bo|review|update|edit|write/
const BREADTH = /toan bo|all modules|sync everything|dong bo het|review all/

// [R2 / tầng] Micro = sửa bề mặt, KHÔNG đổi nội dung/quyết định (typo, format,
// version, wording, thêm 1 dòng đã soạn). Chỉ dùng để HẠ cảnh báo scope — không
// bỏ gate thật (agent vẫn tự phân tầng theo SKILL.md). Cố ý tight: cần tín hiệu
// micro dương; breadth / baseline / việc nặng ⇒ KHÔNG micro.
const MICRO_SIGNAL =
  /\b(typo|sai chinh ta|chinh ta|loi danh may|danh may|format|dinh dang|can le|can cot|thang cot|thang hang|xuong dong|dau cau|wording|van phong|doi version|cap nhat version|version \d|metadata|them 1 dong|them mot dong|1 row|1 hang)\b/
const MICRO_EXCLUDE =
  /02-baseline|_legacy|\bbaseline\b|module moi|moi module|doi kien truc|thay doi kien truc|kien truc moi|adr moi|doc moi|tai lieu moi/

/** Micro? Dựa trên tín hiệu bề mặt + độ ngắn; loại trừ breadth/baseline/việc nặng. */
function isMicroTask(norm) {
  const words = norm.trim().split(/\s+/).filter(Boolean).length
  if (words > 20) return false
  if (BREADTH.test(norm) || MICRO_EXCLUDE.test(norm)) return false
  return MICRO_SIGNAL.test(norm)
}

/**
 * @param {string|null|undefined} prompt
 * @returns {GuardResult}
 */
export function checkTokenGuard(prompt) {
  const p = prompt || ""
  if (!p.trim()) return { action: "allow" }
  if (shouldBypass(p)) return { action: "allow" }

  const lower = p.toLowerCase()
  const norm = stripDiacritics(lower)

  const hasPhase = HAS_PHASE.test(p)

  // Nhận diện module theo 4 cách. Đường dẫn 03-modules/<seg>: <seg> phải là module
  // thật — 1+ ký tự, KHÔNG bắt đầu bằng '_' (loại _template, _legacy).
  // [FIX-5] Bản .py/.sh/.ts cũ dùng char class có ']' thừa (`[^_/\\[\s:]]`) → luôn
  //         fail → nhận diện module qua đường dẫn CHƯA BAO GIỜ chạy. Viết lại bằng
  //         negative lookahead cho rõ.
  const MODULE_SEG = /03-modules[/\\](?!_)[^/\\\s:]+/
  let hasModule = /module:\s*[a-z0-9_-]+/i.test(lower)
  if (!hasModule && /@docs[/\\]03-modules[/\\](?!_)[^/\\\s:]+/.test(p)) hasModule = true
  if (!hasModule && MODULE_SEG.test(p)) hasModule = true
  if (!hasModule && /\b[A-Z][A-Z0-9]{1,5}-(FR|UC|BR|AC|NFR|ADR)-[0-9]{2,}\b/.test(p)) hasModule = true

  const hasPlatform = lower.includes("04-platform") || /@docs[/\\]04-platform/.test(p)
  const hasDoc = /DOC-\d{2}/.test(p) // [FIX-3]
  const hasAtFile =
    /@docs[/\\]03-modules[/\\][^/\\\s]+[/\\]DOC-/.test(p) ||
    /@docs[/\\]04-platform[/\\]DOC-/.test(p)

  // BLOCK — @ cả thư mục (chưa trỏ vào file cụ thể).
  if (/@docs[/\\]?\s*$/.test(p) || /@docs[/\\]03-modules[/\\]?\s*$/.test(p)) {
    return {
      action: "block",
      message:
        "Bạn đang @ cả thư mục docs/modules. Hãy @ 1 file, vd: @docs/03-modules/{module-id}/DOC-06-srs.md",
    }
  }

  // BLOCK — baseline / legacy tốn token.
  if (/@docs[/\\]02-baseline/.test(p) || /@docs[/\\]03-modules[/\\]_legacy/.test(p)) {
    return {
      action: "block",
      message:
        "02-baseline và _legacy tốn token. Chỉ dùng khi migrate — @ file MIGRATION.md hoặc 1 DOC cụ thể.",
    }
  }

  // MICRO — sửa bề mặt: bỏ cảnh báo scope (nhưng block ở trên vẫn áp). Kèm
  // gợi ý MỀM để agent tự xác nhận tầng (regex có thể sai — agent quyết cuối).
  if (isMicroTask(norm)) {
    return {
      action: "allow",
      tier: "micro",
      note:
        "Có thể là micro (sửa bề mặt: typo/format/version/1 dòng). Nếu đúng: bỏ deliberation/doc-review, giữ 1 slice. Nếu thật ra đổi nội dung/quyết định: theo tầng light/full trong SKILL.md.",
    }
  }

  // WARN — hành động sửa trên minipower nhưng thiếu scope.
  const looksLikeMinipower = lower.includes("minipower") || hasPhase
  const looksLikeEdit = EDIT_VERBS.test(norm) // [FIX-1]
  if (looksLikeMinipower && looksLikeEdit && !hasAtFile) {
    const hasScopeTarget = hasModule || hasPlatform
    if (!hasPhase || !hasDoc || !hasScopeTarget) {
      return {
        action: "warn",
        message:
          "Thiếu scope: thêm Phase + Module (hoặc 04-platform) + DOC-XX, hoặc @ 1 file đích. Ví dụ: Phase: requirements — Module: {module-id}, DOC-06 §2",
      }
    }
  }

  // WARN — prompt quá rộng.
  if (BREADTH.test(norm)) {
    return {
      action: "warn",
      message: "Prompt quá rộng — tách theo 1 module/DOC mỗi phiên để tiết kiệm token.",
    }
  }

  return { action: "allow" }
}
