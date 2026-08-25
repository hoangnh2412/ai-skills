/**
 * Plugin Claude Code (ADR 2026-07-26). Khoá:
 *  - plugin.json hợp lệ: có `name`, và `agents: []` để KHÔNG scan guardrail agents/*.md.
 *  - hooks/hooks.json đúng schema plugin: top-level có wrapper `hooks`.
 *  - hooks.json ĐỒNG BỘ settings.fragment.json (chỉ khác path → ${CLAUDE_PLUGIN_ROOT}).
 *  - Không rò path tuyệt đối / placeholder cài đặt vào bản plugin.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const HERE = dirname(fileURLToPath(import.meta.url)) // hooks/test
const PACK = join(HERE, "..", "..") // sdlc/
const PLACEHOLDER = "/ABSOLUTE/PATH/TO/minipower/sdlc"

const plugin = JSON.parse(readFileSync(join(PACK, ".claude-plugin", "plugin.json"), "utf8"))
const hooksFile = readFileSync(join(PACK, "hooks", "hooks.json"), "utf8")
const hooks = JSON.parse(hooksFile)
const fragment = JSON.parse(readFileSync(join(PACK, "install", "claude", "settings.fragment.json"), "utf8"))

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
    JSON.stringify(fragment.hooks).split(PLACEHOLDER).join("${CLAUDE_PLUGIN_ROOT}")
  assert.equal(JSON.stringify(hooks.hooks), expected, "lệch fragment — chạy `npm run gen`")
})

test("hooks.json: dùng ${CLAUDE_PLUGIN_ROOT}, không rò path tuyệt đối", () => {
  assert.ok(hooksFile.includes("${CLAUDE_PLUGIN_ROOT}"), "phải dùng ${CLAUDE_PLUGIN_ROOT}")
  assert.ok(!hooksFile.includes(PLACEHOLDER), "còn placeholder cài đặt trong bản plugin")
  const cmds = []
  for (const ev of Object.values(hooks.hooks))
    for (const g of ev) for (const h of g.hooks || []) cmds.push(h.command)
  // ADR-020 việc #3: 5 UserPromptSubmit + 1 PreToolUse. Trước đó là 4 + 1.
  assert.equal(cmds.length, 6, "kỳ vọng 6 command như fragment")
  for (const c of cmds) assert.ok(c.includes("${CLAUDE_PLUGIN_ROOT}"), `command thiếu root var: ${c}`)
})

test("hooks.json (ADR-020 #3): prereq-gate trong chuỗi prompt, baseline-guard canh tool", () => {
  const prompt = hooks.hooks.UserPromptSubmit.flatMap((g) => g.hooks || []).map((h) => h.command)
  assert.equal(prompt.length, 5, "UserPromptSubmit phải có 5 hook")
  assert.ok(prompt.some((c) => c.includes("prereq-gate.js")), "thiếu prereq-gate")
  // Thứ tự §4b: prereq-gate đứng TRƯỚC decision-staleness (chặn trước khi nhắc).
  const iPrereq = prompt.findIndex((c) => c.includes("prereq-gate.js"))
  const iStale = prompt.findIndex((c) => c.includes("decision-staleness.js"))
  assert.ok(iPrereq < iStale, "prereq-gate phải chạy trước decision-staleness")

  const pre = hooks.hooks.PreToolUse
  assert.equal(pre.length, 1)
  assert.equal(pre[0].matcher, "Read|Write|Edit", "baseline-guard canh cả Write/Edit, không chỉ Read")
  const preCmds = pre.flatMap((g) => g.hooks || []).map((h) => h.command)
  assert.ok(preCmds.some((c) => c.includes("baseline-guard.js")), "thiếu baseline-guard")
  assert.ok(
    !preCmds.some((c) => c.includes("token-guard-read.js")),
    "token-guard-read đã bị baseline-guard thay ở tầng wiring (QĐ-4)",
  )
})
