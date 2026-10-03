#!/usr/bin/env node
/**
 * Minipower baseline guard — CLI shim @ PreToolUse Read|Write|Edit.
 * stdin  {tool_input:{file_path}} | {file_path|path}, prompt
 * stdout (luôn exit 0):
 *   Cursor (beforeReadFile / không có hook_event_name):
 *     {"permission":"allow"} | {"permission":"deny","user_message","agent_message"}
 *   Claude Code (hook_event_name = "PreToolUse"):
 *     deny  → {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason"}}
 *     allow → không in gì
 */
import { readJson, out } from "./_io.js"
import { checkBaselineGuard } from "../lib/baseline-guard.js"

const data = await readJson()
const ti = data.tool_input && typeof data.tool_input === "object" ? data.tool_input : {}
const filePath = ti.file_path || ti.path || data.file_path || data.path || ""
const r = checkBaselineGuard(filePath, data.prompt || "")
const isClaude = data.hook_event_name === "PreToolUse"

if (r.action === "deny") {
  process.stderr.write(`[DENY] ${r.message}\n`)
  out(
    isClaude
      ? {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: r.message,
          },
        }
      : { permission: "deny", user_message: r.message, agent_message: r.message },
  )
} else if (!isClaude) {
  out({ permission: "allow" })
}
// Claude + allow: im lặng. "allow" của Claude Code bỏ qua bước xin quyền — guard chỉ được chặn, không được duyệt hộ.
process.exit(0)
