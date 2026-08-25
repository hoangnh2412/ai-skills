#!/usr/bin/env node
/**
 * Minipower decision-staleness — CLI shim @ beforeSubmitPrompt (advisory, non-blocking).
 * Keyword-gated: chỉ quét khi prompt bàn về quyết định/baseline (tránh chạy mỗi prompt).
 * stdin  {prompt}
 * stdout {continue:true} | {continue:true, additional_context} — luôn exit 0, không bao giờ chặn.
 */
import { readJson, out } from "./_io.js"
import { checkDecisionStaleness } from "../lib/decision-staleness.js"

const GATE = /decision|deliberation|premise|quyết định|đánh giá lại|baseline|supersede|stale|lỗi thời/i

const data = await readJson()
const prompt = data.prompt || ""

if (prompt.trim() && GATE.test(prompt)) {
  try {
    const adv = checkDecisionStaleness(process.env.MP_PROJECT_ROOT || process.cwd())
    if (adv) {
      process.stderr.write(`${adv}\n`)
      out({ continue: true, additional_context: adv })
      process.exit(0)
    }
  } catch {
    // advisory — không bao giờ chặn
  }
}

out({ continue: true })
process.exit(0)
