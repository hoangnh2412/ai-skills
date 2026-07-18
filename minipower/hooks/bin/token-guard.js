#!/usr/bin/env node
/**
 * Minipower token guard — CLI shim @ beforeSubmitPrompt.
 * stdin  {prompt}
 * stdout allow/warn → {"continue":true} exit 0 · block → {"continue":false,"user_message"} exit 2
 */
import { readJson, out } from "./_io.js"
import { checkTokenGuard } from "../lib/token-guard.js"

const data = await readJson()
const r = checkTokenGuard(data.prompt || "")

if (r.action === "block") {
  process.stderr.write(`[BLOCK] ${r.message}\n`)
  out({ continue: false, user_message: r.message })
  process.exit(2)
}
if (r.action === "warn") {
  process.stderr.write(`[WARN] Minipower token guard: ${r.message}\n`)
}
out({ continue: true })
process.exit(0)
