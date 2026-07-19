#!/usr/bin/env node
/**
 * Minipower auto-routing — CLI shim @ beforeSubmitPrompt.
 * stdin  {prompt, attachments:[{file_path}]}
 * stdout enrich → {continue, updated_input, additional_context, hookSpecificOutput} exit 0
 *        block  → {continue:false, user_message} exit 2 · allow → {continue:true} exit 0
 *
 * Phát cả hai shape (Cursor updated_input + Claude hookSpecificOutput) như bản .py cũ.
 */
import { readJson, attachmentPaths, out } from "./_io.js"
import { checkAutoRouting } from "../lib/auto-routing.js"

const data = await readJson()
const prompt = data.prompt || ""
const r = checkAutoRouting(prompt, attachmentPaths(data))

if (r.action === "block") {
  process.stderr.write(`[BLOCK] ${r.message}\n`)
  out({ continue: false, user_message: r.message })
  process.exit(2)
}

if (r.action === "enrich") {
  const enriched = r.prefix ? (prompt ? `${r.prefix}\n\n${prompt}` : r.prefix) : prompt
  process.stderr.write(`[INFO] Minipower auto-routing: Phase: ${r.phase}\n`)
  out({
    continue: true,
    updated_input: { prompt: enriched },
    additional_context: r.context,
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: r.context,
      updatedInput: { prompt: enriched },
    },
  })
  process.exit(0)
}

out({ continue: true })
process.exit(0)
