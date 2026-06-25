/**
 * Minipower — OpenCode plugin (token guard + auto-routing + read guard).
 * SSOT logic: install/cursor/hooks/ · agents/auto-routing.md
 */

import { checkAutoRouting } from "./lib/auto-routing.ts"
import { checkTokenGuard } from "./lib/token-guard.ts"
import { checkReadGuard } from "./lib/token-guard-read.ts"
import {
  blockParts,
  filePaths,
  prependText,
  promptText,
  pushContext,
} from "./lib/parts.ts"

type PartLike = {
  type?: string
  text?: string
  synthetic?: boolean
  ignored?: boolean
  filename?: string
  url?: string
}

type MessageOutput = {
  message: unknown
  parts: PartLike[]
  noReply?: boolean
}

const promptBySession: Record<string, string> = {}

function log(level: "info" | "warn" | "error", service: string, message: string) {
  console.error(`[${level.toUpperCase()}] ${service}: ${message}`)
}

function blockMessage(output: MessageOutput, msg: string): never {
  log("error", "minipower", msg)
  blockParts(output.parts, msg)
  if ("noReply" in output) output.noReply = true
  throw new Error(msg)
}

export const MinipowerPlugin = async () => {
  return {
    "chat.message": async (
      input: { sessionID: string },
      output: MessageOutput,
    ) => {
      const parts = output.parts
      const prompt = promptText(parts)
      promptBySession[input.sessionID] = prompt

      const guard = checkTokenGuard(prompt)
      if (guard.action === "block") blockMessage(output, guard.message)
      if (guard.action === "warn") {
        log("warn", "minipower-token-guard", guard.message)
        pushContext(parts, `[Minipower token guard] ${guard.message}`)
      }

      const route = checkAutoRouting(prompt, filePaths(parts))
      if (route.action === "block") blockMessage(output, route.message)
      if (route.action === "warn") {
        log("warn", "minipower-auto-routing", route.message)
        pushContext(parts, `[Minipower auto-routing] ${route.message}`)
      }
      if (route.action === "enrich") {
        log("info", "minipower-auto-routing", `Da chen Phase: ${route.phase}`)
        prependText(parts, route.prefix)
        pushContext(parts, route.context)
      }
    },

    "tool.execute.before": async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: Record<string, unknown> },
    ) => {
      if (input.tool !== "read") return

      const filePath =
        (output.args.filePath as string) ||
        (output.args.path as string) ||
        (output.args.file as string) ||
        ""

      const sessionPrompt = promptBySession[input.sessionID] || ""
      const result = checkReadGuard(filePath, sessionPrompt)
      if (result.action === "deny") {
        log("error", "minipower-token-guard-read", result.message)
        throw new Error(result.message)
      }
    },
  }
}
