#!/usr/bin/env node
/**
 * Minipower profile guard — CLI shim @ beforeSubmitPrompt.
 * stdin  {prompt, attachments:[{file_path}]}
 * stdout block → {"continue":false,"user_message"} exit 2 · allow → {"continue":true} exit 0
 */
import { readJson, out, attachmentPaths } from "./_io.js"
import { checkProfileGuard } from "../lib/profile-guard.js"

const data = await readJson()
const r = checkProfileGuard(data.prompt || "", attachmentPaths(data))

if (r.action === "block") {
  process.stderr.write(`[BLOCK] ${r.message}\n`)
  out({ continue: false, user_message: r.message })
  process.exit(2)
}
out({ continue: true })
process.exit(0)
