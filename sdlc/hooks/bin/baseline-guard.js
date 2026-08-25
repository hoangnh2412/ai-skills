#!/usr/bin/env node
/**
 * Minipower baseline guard — CLI shim @ PreToolUse Read|Write|Edit.
 * stdin  {tool_input:{file_path}} | {file_path|path}, prompt
 * stdout {"permission":"allow"} | {"permission":"deny","user_message","agent_message"} — luôn exit 0
 */
import { readJson, out } from "./_io.js"
import { checkBaselineGuard } from "../lib/baseline-guard.js"

const data = await readJson()
const ti = data.tool_input && typeof data.tool_input === "object" ? data.tool_input : {}
const filePath = ti.file_path || ti.path || data.file_path || data.path || ""
const r = checkBaselineGuard(filePath, data.prompt || "")

if (r.action === "deny") {
  process.stderr.write(`[DENY] ${r.message}\n`)
  out({ permission: "deny", user_message: r.message, agent_message: r.message })
} else {
  out({ permission: "allow" })
}
process.exit(0)
