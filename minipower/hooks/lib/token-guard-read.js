/**
 * Minipower — read guard @ beforeReadFile.
 * SSOT. Port từ minipower-token-guard-read.{sh,ps1} + token-guard-read.ts.
 *
 * Canh HÀNH VI TỰ PHÁT của agent: chặn khi agent tự mở file tốn token mà user
 * không yêu cầu. Đây là guard duy nhất soi việc agent làm sau khi prompt đã qua.
 *
 * @typedef {{action:"allow"}|{action:"deny", message:string}} ReadGuardResult
 *
 * Quyết định đã chốt (ADR §6, 2026-07-17):
 *   Q7a — baseline DENY TUYỆT ĐỐI: không lối thoát, kể cả prompt nói migrate.
 *         (Khác bản .sh cũ: .sh tính allow_legacy rồi bỏ quên ở nhánh baseline —
 *          vô tình cũng deny tuyệt đối. Ở đây deny tuyệt đối là CÓ CHỦ ĐÍCH.)
 *   Q7b — KHÔNG gọi shouldBypass: BYPASS không mở read-guard. Bảo vệ token.
 *
 *   Ngoại lệ DUY NHẤT: _legacy mở khi prompt có _legacy | MIGRATION | migrate.
 */

/**
 * @param {string|null|undefined} filePath
 * @param {string|null|undefined} prompt
 * @returns {ReadGuardResult}
 */
export function checkReadGuard(filePath, prompt) {
  const path = (filePath || "").replace(/\\/g, "/")
  if (!path.trim()) return { action: "allow" }

  // Q7a — baseline: deny vô điều kiện, không đọc prompt.
  if (path.includes("docs/02-baseline")) {
    return {
      action: "deny",
      message: "02-baseline tốn token. Snapshot đã ký — không đọc qua agent, dùng khi cần thì mở tay.",
    }
  }

  // _legacy: deny trừ khi prompt chủ động nhắc migrate.
  const allowLegacy = /_legacy|MIGRATION|migrate/i.test(prompt || "")
  if (!allowLegacy && path.includes("docs/03-modules/_legacy")) {
    return {
      action: "deny",
      message: "_legacy tốn token. Chỉ đọc khi migrate — prompt cần nói _legacy hoặc MIGRATION.",
    }
  }

  return { action: "allow" }
}
