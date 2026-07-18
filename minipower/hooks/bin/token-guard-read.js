#!/usr/bin/env node
/**
 * Minipower read guard — CLI shim @ beforeReadFile.
 * stdin  {file_path|path, prompt}
 * stdout {"permission":"allow"} | {"permission":"deny","user_message","agent_message"} — luôn exit 0
 */
import { readJson, out } from "./_io.js"
import { checkReadGuard } from "../lib/token-guard-read.js"

const data = await readJson()
const filePath = data.file_path || data.path || ""
const r = checkReadGuard(filePath, data.prompt || "")

if (r.action === "deny") {
  process.stderr.write(`[DENY] ${r.message}\n`)
  out({ permission: "deny", user_message: r.message, agent_message: r.message })
} else {
  out({ permission: "allow" })
}
process.exit(0)
