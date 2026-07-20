/**
 * Minipower — auto-routing @ beforeSubmitPrompt.
 * SSOT. Port từ minipower-auto-routing.py (bản trưởng thành nhất) + auto-routing.ts.
 *
 * Map DOC → phase, chèn Phase:/@skill khi rõ 1 phase, block khi xung đột hoặc
 * nhiều phase. Trả quyết định thuần; caller mỗi nền tảng tự ghép prompt.
 *
 * @typedef {{action:"allow"}
 *          |{action:"block", message:string}
 *          |{action:"enrich", prefix:string, context:string, phase:string}} RouteResult
 *
 * Khác biệt API có chủ đích so với .py (xem ADR §7b):
 *   - Trả `prefix` (các dòng cần chèn), KHÔNG ghép sẵn — mỗi nền tảng ghép khác nhau.
 *   - `opts.root` thay cho đọc thẳng process.env → test không phụ thuộc global state.
 *     Ưu tiên: opts.root → process.env.MINIPOWER_ROOT → "ai-skills/minipower".
 */

import { shouldBypass } from "./bypass.js"
// [R3] Map DOC→phase và nhãn phase sinh từ rules.json (SSOT) — không hardcode.
// [N2] state/role gợi ý theo phase (project-state awareness).
import { PHASE_BY_DOC, PHASE_LABEL, stateForPhase, roleForPhase } from "./rules.js"

// [FIX-8] Không phân biệt hoa thường; separator `-` hoặc khoảng trắng;
//         số 1–2 chữ số (DOC 4 → 04). Tránh khớp tiếp chữ số (doc 100).
const DOC_IN_PROMPT = /\bDOC[\s-](\d{1,2})-[\w-]+\.md\b/gi
const DOC_BARE_IN_PROMPT = /\bDOC[\s-](\d{1,2})(?![\d\w-])/gi
const DOC_IN_NAME = /DOC[\s-](\d{1,2})/i
const EXPLICIT_PHASE =
  /Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)/i

function resolveRoot(opts) {
  const root = (opts && opts.root) || process.env.MINIPOWER_ROOT || "ai-skills/minipower"
  return root.replace(/[/\\]+$/, "")
}

function skillPath(phase, root) {
  return `${root}/skills/${phase}/SKILL.md`
}

function basename(path) {
  const norm = path.replace(/\\/g, "/")
  const i = norm.lastIndexOf("/")
  return i >= 0 ? norm.slice(i + 1) : norm
}

/** "4" / "04" / "19" → "04" / "19"; số không có trong map (rules.json) → null. */
function normalizeDocNum(raw) {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1) return null
  const key = String(n).padStart(2, "0")
  return key in PHASE_BY_DOC ? key : null
}

function addDocRef(byPhase, seen, docNumRaw, label) {
  const docNum = normalizeDocNum(docNumRaw)
  if (!docNum || !label.trim() || seen.has(docNum)) return
  const phase = PHASE_BY_DOC[docNum]
  if (!phase) return
  seen.add(docNum)
  ;(byPhase[phase] ||= []).push(label)
}

function addEntry(byPhase, seen, path) {
  if (!path || !path.trim()) return
  const match = basename(path).match(DOC_IN_NAME)
  if (!match) return
  addDocRef(byPhase, seen, match[1], path)
}

function collectByPhase(prompt, filePaths) {
  const byPhase = {}
  const seen = new Set()

  for (const path of filePaths) addEntry(byPhase, seen, path || "")

  for (const match of prompt.matchAll(DOC_IN_PROMPT)) addEntry(byPhase, seen, match[0])
  for (const match of prompt.matchAll(DOC_BARE_IN_PROMPT)) {
    const num = normalizeDocNum(match[1])
    if (num) addDocRef(byPhase, seen, num, `DOC-${num}`)
  }

  return byPhase
}

function parseExplicitPhase(prompt) {
  const match = prompt.match(EXPLICIT_PHASE)
  return match ? match[1].toLowerCase() : undefined
}

function buildRoutePrefix(prompt, phase, skill, docLabels) {
  const lines = []
  if (!prompt.includes("/minipower")) lines.push("/minipower")
  if (!new RegExp(`Phase:\\s*${phase}\\b`, "i").test(prompt)) lines.push(`Phase: ${phase}`)
  if (!prompt.includes(skill)) lines.push(`@${skill}`)
  for (const doc of docLabels) {
    if (!doc || !/[/\\]DOC[\s-]\d{1,2}/i.test(doc)) continue
    const docNorm = doc.replace(/\\/g, "/")
    if (!prompt.includes(docNorm)) lines.push(`@${docNorm}`)
  }
  return lines.join("\n")
}

function handleSinglePhase(byPhase, explicit, prompt, root) {
  const detected = Object.keys(byPhase)[0]
  const files = byPhase[detected].join(", ")
  const label = PHASE_LABEL[detected] || detected

  if (explicit && explicit !== detected) {
    return {
      action: "block",
      message: [
        `Phase conflict: prompt ghi Phase: ${explicit} nhưng file DOC thuộc ${label}.`,
        "",
        `File: ${files}`,
        "",
        "Sửa prompt thành:",
        `Phase: ${detected}`,
        "/minipower",
        "@<file DOC>",
        "",
        `Hoặc bỏ dòng Phase: và chỉ tag file thuộc phase ${explicit}.`,
      ].join("\n"),
    }
  }

  if (!explicit) {
    const skill = skillPath(detected, root)
    const prefix = buildRoutePrefix(prompt, detected, skill, byPhase[detected])
    const role = roleForPhase(detected)
    const context = [
      "Minipower auto-route (DOC -> phase).",
      `Phase: ${detected} Skill: @${skill}`,
      // [N2] Giai đoạn dự án + vai trò chính (lăng kính hỗ trợ, không phải agent tự chạy).
      `State: ${stateForPhase(detected)}${role ? ` Role: ${role}` : ""}`,
      "Follow minipower-token-guard: one slice, read skill con for this phase only.",
    ].join(" ")
    return { action: "enrich", prefix, context, phase: detected }
  }

  return { action: "allow" }
}

function handleMultiPhase(byPhase, explicit, root) {
  const lines = ["Conflict phase — các file DOC bạn tag thuộc nhiều phase khác nhau.", ""]
  const sorted = Object.keys(byPhase).sort()

  for (const phase of sorted) {
    lines.push(`• ${PHASE_LABEL[phase] || phase}:`)
    for (const path of byPhase[phase]) lines.push(`  - ${path}`)
    lines.push("")
  }

  lines.push("Gợi ý — tách thành từng prompt (mỗi prompt 1 phase):", "")

  sorted.forEach((phase, idx) => {
    const sample = byPhase[phase][0]
    lines.push(
      `${idx + 1}) Phase: ${phase}`,
      "   /minipower",
      `   @${sample}`,
      `   @${skillPath(phase, root)}`,
      "   <mô tả task cho phase này>",
      "",
    )
  })

  if (explicit) {
    lines.push(
      `Lưu ý: prompt hiện có Phase: ${explicit} — chỉ giữ file thuộc phase đó, bỏ tag file phase khác.`,
    )
  }

  return { action: "block", message: lines.join("\n") }
}

/**
 * @param {string|null|undefined} prompt
 * @param {string[]|null|undefined} filePaths
 * @param {{root?:string}} [opts]
 * @returns {RouteResult}
 */
export function checkAutoRouting(prompt, filePaths, opts) {
  const p = prompt || ""
  const files = filePaths || []
  if (!p.trim() && files.length === 0) return { action: "allow" }
  if (shouldBypass(p)) return { action: "allow" }

  const byPhase = collectByPhase(p, files)
  const phases = Object.keys(byPhase)
  if (phases.length === 0) return { action: "allow" }

  const root = resolveRoot(opts)
  const explicit = parseExplicitPhase(p)
  if (phases.length === 1) return handleSinglePhase(byPhase, explicit, p, root)
  return handleMultiPhase(byPhase, explicit, root)
}
