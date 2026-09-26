/**
 * Sinh fragment cài IDE từ INSTALL_HOOKS (rules.json). ADR-031 Confirm Q5 cách B.
 */

import { INSTALL_HOOKS } from "./rules.js"

export const CLAUDE_PACK_PLACEHOLDER = "/ABSOLUTE/PATH/TO/minipower/src/sdlc"
export const CURSOR_SKILL_HOOK = ".cursor/skills/minipower-sdlc/hooks/bin"

function promptHooks() {
  return INSTALL_HOOKS.filter((h) => h.slot === "prompt")
}
function preToolHooks() {
  return INSTALL_HOOKS.filter((h) => h.slot === "pre_tool")
}

export function claudeSettingsFragment() {
  return {
    hooks: {
      UserPromptSubmit: [
        {
          hooks: promptHooks().map((h) => ({
            type: "command",
            command: `node "${CLAUDE_PACK_PLACEHOLDER}/hooks/bin/${h.shim}.js"`,
          })),
        },
      ],
      PreToolUse: preToolHooks().map((h) => ({
        matcher: h.matcher,
        hooks: [
          {
            type: "command",
            command: `node "${CLAUDE_PACK_PLACEHOLDER}/hooks/bin/${h.shim}.js"`,
          },
        ],
      })),
    },
  }
}

export function cursorHooksFragment() {
  return {
    version: 1,
    hooks: {
      beforeSubmitPrompt: promptHooks().map((h) => ({
        command: `node ${CURSOR_SKILL_HOOK}/${h.shim}.js`,
        timeout: h.cursor_timeout,
      })),
      beforeReadFile: preToolHooks().map((h) => ({
        command: `node ${CURSOR_SKILL_HOOK}/${h.shim}.js`,
        matcher: h.matcher,
      })),
    },
  }
}

export function pluginHooksJson() {
  const frag = claudeSettingsFragment()
  const hooks = JSON.parse(
    JSON.stringify(frag.hooks).split(CLAUDE_PACK_PLACEHOLDER).join("${CLAUDE_PLUGIN_ROOT}"),
  )
  return { hooks }
}

export function jsonFile(obj) {
  return JSON.stringify(obj, null, 2) + "\n"
}
