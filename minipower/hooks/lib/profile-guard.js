/**
 * Minipower — profile guard @ beforeSubmitPrompt.
 * SSOT. Chặn prompt làm việc minipower khi dự án chưa có memory/profile.json hợp lệ.
 *
 * SSOT máy đọc: memory/profile.json (không parse AGENTS.md).
 * Dự án minipower = memory/memory.md + thư mục docs/ tồn tại.
 */

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { shouldBypass } from "./bypass.js"
import { RULES, stripDiacritics } from "./rules.js"

/** @typedef {{action:"allow"}|{action:"block",message:string}} ProfileGuardResult */

export const PROFILE_VERSION = 1

const VALID_PHASES = new Set(RULES.phase_order)
const VALID_ROLES = new Set(RULES.roles.map((r) => r.id))
const VALID_EXPERIENCE = new Set(["new", "returning"])
const VALID_HONORIFIC = new Set(["anh", "chi"])

const EXEMPT_RE =
  /\b(init project|khoi tao|khoi tao du an|tao folder du an|reconfigure agent|cap nhat profile|ca nhan hoa|hoan tat profile|personalize profile)\b/

const MINIPOWER_WORK_RE =
  /\/minipower\b|phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)\b|doc-\d{2}\b|@docs\b|\/docs\/|\/memory\//

/**
 * @param {string} [root]
 * @returns {string}
 */
export function projectRoot(root) {
  return root || process.env.MP_PROJECT_ROOT || process.cwd()
}

/**
 * @param {string} root
 * @returns {boolean}
 */
export function isMinipowerProject(root) {
  return (
    existsSync(join(root, "memory", "memory.md")) && existsSync(join(root, "docs"))
  )
}

/**
 * @param {unknown} obj
 * @returns {{valid:boolean, errors:string[]}}
 */
export function validateProfile(obj) {
  const errors = []
  if (!obj || typeof obj !== "object") {
    return { valid: false, errors: ["profile không phải object"] }
  }
  const p = /** @type {Record<string, unknown>} */ (obj)

  if (p.version !== PROFILE_VERSION) errors.push("version phải là 1")

  for (const key of ["user_name", "project_name", "project_summary"]) {
    if (typeof p[key] !== "string" || !String(p[key]).trim()) errors.push(`thiếu ${key}`)
  }

  const honorific = stripDiacritics(String(p.honorific || "")).toLowerCase()
  if (!VALID_HONORIFIC.has(honorific)) errors.push("honorific phải là anh hoặc chị")

  if (!Array.isArray(p.roles) || p.roles.length === 0) {
    errors.push("roles phải là mảng không rỗng")
  } else {
    for (const r of p.roles) {
      if (!VALID_ROLES.has(String(r))) errors.push(`role không hợp lệ: ${r}`)
    }
  }

  if (!VALID_PHASES.has(String(p.current_phase || ""))) {
    errors.push("current_phase không hợp lệ")
  }

  const exp = String(p.minipower_experience || "")
  if (!VALID_EXPERIENCE.has(exp)) errors.push("minipower_experience phải là new hoặc returning")

  return { valid: errors.length === 0, errors }
}

/**
 * @param {string} root
 * @returns {Record<string, unknown>|null}
 */
export function loadProfile(root) {
  const path = join(root, "memory", "profile.json")
  if (!existsSync(path)) return null
  try {
    const data = JSON.parse(readFileSync(path, "utf8"))
    return data && typeof data === "object" ? data : null
  } catch {
    return null
  }
}

/**
 * @param {string} root
 * @returns {boolean}
 */
export function isProfileComplete(root) {
  const data = loadProfile(root)
  if (!data) return false
  return validateProfile(data).valid
}

/**
 * @param {string|null|undefined} prompt
 * @returns {boolean}
 */
export function isExemptPrompt(prompt) {
  const p = prompt || ""
  if (shouldBypass(p)) return true
  const norm = stripDiacritics(p).toLowerCase()
  return EXEMPT_RE.test(norm)
}

/**
 * @param {string|null|undefined} prompt
 * @param {string[]|null|undefined} [filePaths]
 * @returns {boolean}
 */
export function isMinipowerWorkPrompt(prompt, filePaths) {
  const p = prompt || ""
  const norm = stripDiacritics(p).toLowerCase()
  if (MINIPOWER_WORK_RE.test(norm)) return true

  const files = (filePaths || []).filter(Boolean)
  for (const f of files) {
    const n = String(f).replace(/\\/g, "/").toLowerCase()
    if (/(?:^|\/)docs(?:\/|$)/.test(n) || /(?:^|\/)memory(?:\/|$)/.test(n)) return true
  }
  return false
}

const BLOCK_MESSAGE = `Chưa cá nhân hoá Minipower (thiếu hoặc chưa hợp lệ memory/profile.json).

Chạy: **Init project {tên}** hoặc **Hoàn tất profile** — trả lời 5 câu hỏi bắt buộc:
1. Tên bạn (xưng hô anh/chị)
2. Vị trí trong dự án (có thể chọn nhiều: BA, PM, SA, DEV, QC, DevOps, Support)
3. Dự án làm về gì
4. Giai đoạn hiện tại (discovery → change-control)
5. Đã từng dùng minipower chưa (new / returning)

Sau đó agent ghi memory/profile.json, AGENTS.md và CLAUDE.md.
Gỡ tạm: BYPASS ở đầu dòng (chỉ khi cần thiết).`

/**
 * @param {string|null|undefined} prompt
 * @param {string[]|null|undefined} [filePaths]
 * @param {{root?:string}|null|undefined} [opts]
 * @returns {ProfileGuardResult}
 */
export function checkProfileGuard(prompt, filePaths, opts) {
  const root = projectRoot(opts?.root)
  if (!isMinipowerProject(root)) return { action: "allow" }
  if (isProfileComplete(root)) return { action: "allow" }
  if (isExemptPrompt(prompt)) return { action: "allow" }
  if (!isMinipowerWorkPrompt(prompt, filePaths)) return { action: "allow" }
  return { action: "block", message: BLOCK_MESSAGE }
}
