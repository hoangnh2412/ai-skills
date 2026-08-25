#!/usr/bin/env node
/**
 * Minipower prereq gate — CLI shim @ UserPromptSubmit.
 * stdin  {prompt, attachments:[{file_path}]}
 * stdout allow/warn → {"continue":true} exit 0 · block → {"continue":false,"user_message"} exit 2
 */
import { readJson, out, attachmentPaths } from "./_io.js"
import { checkPrereqGate } from "../lib/prereq-gate.js"

const data = await readJson()
const r = checkPrereqGate(data.prompt || "", attachmentPaths(data))

if (r.action === "block") {
  process.stderr.write(`[BLOCK] ${r.message}\n`)
  out({ continue: false, user_message: r.message })
  process.exit(2)
}
if (r.action === "warn") {
  process.stderr.write(`[WARN] ${r.message}\n`)
  out({
    continue: true,
    additional_context: r.message,
    hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: r.message },
  })
  process.exit(0)
}
out({ continue: true })
process.exit(0)
