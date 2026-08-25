/**
 * Minipower — bypass guard.
 * SSOT. Port từ install/cursor/hooks/hook_bypass.py.
 *
 * "BYPASS ..." đầu dòng, hoặc "@{skill} BYPASS ...". Cố ý KHÔNG khớp khi chữ
 * BYPASS nằm giữa câu — tránh bypass do vô tình.
 *
 * Lưu ý: read-guard KHÔNG dùng hàm này (quyết định Q7b) — BYPASS chỉ mở
 * token-guard và auto-routing, không mở read-guard.
 */

const BYPASS_RE = /(?:^\s*BYPASS(?:\s+|$)|@\S+\s+BYPASS(?:\s+|$))/im

/**
 * @param {string|null|undefined} prompt
 * @returns {boolean}
 */
export function shouldBypass(prompt) {
  return BYPASS_RE.test(prompt || "")
}
