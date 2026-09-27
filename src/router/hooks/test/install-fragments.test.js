import test from "node:test"
import assert from "node:assert/strict"
import { INSTALL_HOOKS } from "../lib/rules.js"
import { claudeSettingsFragment, cursorHooksFragment } from "../lib/install-fragments.js"

test("install_hooks: đúng 6 shim, prompt rồi pre_tool", () => {
  assert.equal(INSTALL_HOOKS.length, 6)
  const shims = INSTALL_HOOKS.map((h) => h.shim)
  assert.deepEqual(shims, [
    "token-guard",
    "auto-routing",
    "profile-guard",
    "prereq-gate",
    "decision-staleness",
    "baseline-guard",
  ])
  assert.equal(INSTALL_HOOKS.filter((h) => h.slot === "prompt").length, 5)
  assert.equal(INSTALL_HOOKS.filter((h) => h.slot === "pre_tool").length, 1)
})

test("fragment Claude/Cursor cùng thứ tự shim với install_hooks", () => {
  const claudeCmds = claudeSettingsFragment()
    .hooks.UserPromptSubmit[0].hooks.map((h) => h.command)
    .concat(claudeSettingsFragment().hooks.PreToolUse[0].hooks.map((h) => h.command))
  const cursorCmds = cursorHooksFragment()
    .hooks.beforeSubmitPrompt.map((h) => h.command)
    .concat(cursorHooksFragment().hooks.beforeReadFile.map((h) => h.command))
  for (const h of INSTALL_HOOKS) {
    assert.ok(claudeCmds.some((c) => c.includes(`${h.shim}.js`)), `Claude thiếu ${h.shim}`)
    assert.ok(cursorCmds.some((c) => c.includes(`${h.shim}.js`)), `Cursor thiếu ${h.shim}`)
  }
})
