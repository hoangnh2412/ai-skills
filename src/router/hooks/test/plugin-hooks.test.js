/**
 * Plugin Claude Code (ADR 2026-07-26 · ADR-037 E1). Khoá:
 *  - plugin.json hợp lệ: có `name`, và `agents: []` để KHÔNG scan guardrail agents/*.md.
 *  - hooks/hooks.json đúng schema plugin: top-level có wrapper `hooks`.
 *  - hooks.json ĐỒNG BỘ settings.fragment.json (chỉ khác path → ${CLAUDE_PLUGIN_ROOT}).
 *  - Không rò path tuyệt đối / placeholder cài đặt vào bản plugin.
 *
 * E2: hooks + .claude-plugin cùng `src/router/`.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { CLAUDE_PACK_PLACEHOLDER } from "../lib/install-fragments.js"
import { HOOKS, ROUTER, ROOT } from "../lib/skill-catalog.js"

const CLI = join(ROOT, "cli")
const PLACEHOLDER = CLAUDE_PACK_PLACEHOLDER

const plugin = JSON.parse(readFileSync(join(ROUTER, ".claude-plugin", "plugin.json"), "utf8"))
const hooksFile = readFileSync(join(HOOKS, "hooks.json"), "utf8")
const hooks = JSON.parse(hooksFile)
const fragment = JSON.parse(readFileSync(join(CLI, "claude", "settings.fragment.json"), "utf8"))

test("plugin.json: name bắt buộc + tên khớp router", () => {
  assert.equal(plugin.name, "minipower")
})

test("plugin.json: agents:[] để không đăng ký guardrail markdown làm subagent", () => {
  assert.deepEqual(plugin.agents, [], "phải là mảng rỗng — chặn scan agents/ mặc định")
})

test("hooks.json: đúng schema plugin (wrapper `hooks`)", () => {
  assert.ok(hooks.hooks, "top-level phải có khoá `hooks`")
  assert.ok(hooks.hooks.UserPromptSubmit, "thiếu event UserPromptSubmit")
  assert.ok(hooks.hooks.PreToolUse, "thiếu event PreToolUse")
})

test("hooks.json: đồng bộ settings.fragment.json (chỉ khác path)", () => {
  const expected =
    JSON.parse(
      JSON.stringify(fragment).split(PLACEHOLDER).join("${CLAUDE_PLUGIN_ROOT}"),
    )
  assert.deepEqual(hooks.hooks, expected.hooks)
})

test("hooks.json: không rò placeholder / absolute path factory", () => {
  assert.ok(!hooksFile.includes("ABSOLUTE"))
  assert.ok(!hooksFile.includes("/Volumes/"))
  assert.ok(!hooksFile.includes("C:\\\\"))
  assert.match(hooksFile, /\$\{CLAUDE_PLUGIN_ROOT\}/)
})

test("hooks.json: mỗi command là node + shim .js dưới hooks/bin", () => {
  const cmds = []
  for (const event of Object.keys(hooks.hooks)) {
    for (const group of hooks.hooks[event]) {
      for (const h of group.hooks || []) {
        if (h.command) cmds.push(h.command)
      }
    }
  }
  assert.ok(cmds.length >= 6)
  for (const c of cmds) {
    assert.match(c, /node /)
    assert.match(c, /hooks\/bin\/[\w-]+\.js/)
  }
})
