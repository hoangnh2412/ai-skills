/**
 * Golden test — ba kênh cài đặt phải cưỡng chế CÙNG một bộ guard (ADR-020 QĐ-4, việc #4).
 *
 * Trước đây `permissions.deny` chỉ có ở kênh settings, không đi được trong plugin
 * → hai kênh hành xử khác nhau và người dùng phải chép tay 2 dòng deny. QĐ-4 dồn
 * cưỡng chế về `baseline-guard`. Test này khoá điều đó lại: thêm/bớt guard ở một
 * nền tảng mà quên nền tảng kia → đỏ ngay, không chờ ai nhớ.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const HOOKS = dirname(dirname(fileURLToPath(import.meta.url)))
const INSTALL = join(dirname(HOOKS), "install")

const claude = JSON.parse(readFileSync(join(INSTALL, "claude", "settings.fragment.json"), "utf8"))
const cursor = JSON.parse(
  readFileSync(join(INSTALL, "cursor", "hooks", "hooks.fragment.json"), "utf8"),
)
const opencodeSrc = readFileSync(join(INSTALL, "opencode", "plugins", "minipower.ts"), "utf8")

const PLACEHOLDER_STR = "/ABSOLUTE/PATH/TO/ai-skills/minipower"

/** "…/bin/token-guard.js" → "token-guard" */
const shimName = (cmd) => {
  const m = /bin[/\\]([a-z0-9-]+)\.js/.exec(String(cmd))
  return m ? m[1] : null
}

function claudeShims() {
  const out = []
  for (const ev of Object.values(claude.hooks))
    for (const g of ev) for (const h of g.hooks || []) out.push(shimName(h.command))
  return out.filter(Boolean)
}

function cursorShims() {
  const out = []
  for (const ev of Object.values(cursor.hooks)) for (const h of ev) out.push(shimName(h.command))
  return out.filter(Boolean)
}

const EXPECTED = [
  "auto-routing",
  "baseline-guard",
  "decision-staleness",
  "prereq-gate",
  "profile-guard",
  "token-guard",
]

test("parity — Claude và Cursor cưỡng chế cùng bộ guard", () => {
  assert.deepEqual(claudeShims().sort(), EXPECTED, "kênh Claude lệch bộ guard chuẩn")
  assert.deepEqual(cursorShims().sort(), EXPECTED, "kênh Cursor lệch bộ guard chuẩn")
})

test("parity — OpenCode plugin dùng cùng bộ lib", () => {
  for (const name of EXPECTED) {
    assert.match(
      opencodeSrc,
      new RegExp(`hooks/lib/${name}\\.js`),
      `OpenCode thiếu lib ${name}`,
    )
  }
})

test("QĐ-4 — không kênh nào còn permissions.deny tĩnh", () => {
  assert.equal(
    claude.permissions,
    undefined,
    "settings.fragment.json còn permissions.deny — phải dồn về baseline-guard",
  )
})

test("QĐ-4 — token-guard-read đã rời wiring ở mọi kênh", () => {
  // lib/token-guard-read.js VẪN sống (baseline-guard wrap nó); chỉ shim rời wiring.
  for (const [label, shims] of [
    ["Claude", claudeShims()],
    ["Cursor", cursorShims()],
  ]) {
    assert.ok(!shims.includes("token-guard-read"), `${label} còn gọi token-guard-read`)
  }
  assert.doesNotMatch(
    opencodeSrc,
    /hooks\/lib\/token-guard-read\.js/,
    "OpenCode còn import checkReadGuard trực tiếp — phải qua baseline-guard",
  )
})

test("C4/C5 — baseline-guard canh cả Write/Edit, không chỉ Read", () => {
  const claudePre = claude.hooks.PreToolUse
  assert.equal(claudePre.length, 1)
  assert.equal(claudePre[0].matcher, "Read|Write|Edit")

  const cursorRead = cursor.hooks.beforeReadFile
  assert.equal(cursorRead.length, 1)
  assert.equal(cursorRead[0].matcher, "Read|Write|Edit")
})

test("thứ tự chuỗi prompt — prereq-gate sau profile-guard, trước decision-staleness", () => {
  for (const [label, shims] of [
    ["Claude", claudeShims()],
    ["Cursor", cursorShims()],
  ]) {
    const i = (n) => shims.indexOf(n)
    assert.ok(i("profile-guard") < i("prereq-gate"), `${label}: prereq-gate phải sau profile-guard`)
    assert.ok(
      i("prereq-gate") < i("decision-staleness"),
      `${label}: chặn trước, nhắc sau`,
    )
  }
})

test("install.mjs — resolve fragment được trên path Windows (dấu backslash)", () => {
  // Bug có sẵn: chèn PACK_ROOT thô vào văn bản JSON → "D:\Working" thành escape
  // không hợp lệ → JSON.parse ném → installer CHƯA BAO GIỜ chạy được trên Windows.
  // --print resolve fragment rồi in ra; nó chạy được nghĩa là path đã escape đúng.
  const out = execFileSync(
    process.execPath,
    [join(INSTALL, "claude", "install.mjs"), "--print"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  )
  const frag = JSON.parse(out)
  assert.ok(frag.hooks, "fragment resolve ra phải có hooks")
  assert.equal(frag.permissions, undefined, "fragment resolve vẫn không được có permissions")
  const cmds = Object.values(frag.hooks)
    .flat()
    .flatMap((g) => g.hooks || [])
    .map((h) => h.command)
  assert.equal(cmds.length, 6)
  for (const c of cmds) {
    assert.ok(!c.includes(PLACEHOLDER_STR), `còn placeholder chưa thay: ${c}`)
  }
})
