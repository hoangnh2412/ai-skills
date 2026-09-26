import test from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HOOKS = dirname(dirname(fileURLToPath(import.meta.url)))
const CLI = join(HOOKS, "..", "..", "..", "cli", "minipower.mjs")
const node = process.execPath

function run(args, cwd) {
  try {
    return execFileSync(node, [CLI, ...args], {
      encoding: "utf8",
      cwd: cwd || HOOKS,
      stdio: ["ignore", "pipe", "pipe"],
    })
  } catch (e) {
    e.message = `${e.stderr || ""}${e.stdout || ""}${e.message}`
    throw e
  }
}

test("install --list-modules đọc registry", () => {
  const out = run(["install", "--list-modules"])
  const reg = JSON.parse(out)
  assert.ok(Array.isArray(reg) && reg.some((p) => p.pack === "router"))
  assert.ok(reg.some((p) => p.pack === "toolbox" && p.install.default === false))
})

test("install không --client thì hỏi (stdin)", () => {
  const dir = mkdtempSync(join(tmpdir(), "mp-ask-i-"))
  try {
    const out = execFileSync(node, [CLI, "install", "--dry-run"], {
      encoding: "utf8",
      input: `${dir}\n1\n\nY\n`,
      stdio: ["pipe", "pipe", "pipe"],
    })
    assert.match(out, /cursor/)
    assert.match(out, /dry-run/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("install --client cursor --with router", () => {
  const dir = mkdtempSync(join(tmpdir(), "mp-install-"))
  try {
    run(["install", "--client", "cursor", "--with", "router", "--target", dir])
    assert.ok(existsSync(join(dir, ".cursor", "hooks.json")))
    assert.ok(existsSync(join(dir, ".cursor", "skills", "minipower-sdlc")))
    assert.ok(existsSync(join(dir, ".cursor", "skills", "minipower-router")))
    assert.ok(existsSync(join(dir, ".minipower", "clients.json")))
    assert.ok(existsSync(join(dir, ".minipower", "bin", "minipower")))
    const cfg = JSON.parse(readFileSync(join(dir, ".minipower", "clients.json"), "utf8"))
    assert.ok(cfg.factory_root)
    const hooks = JSON.parse(readFileSync(join(dir, ".cursor", "hooks.json"), "utf8"))
    assert.ok(hooks.hooks.beforeSubmitPrompt.length >= 5)
    run(["install", "--client", "cursor", "--with", "router", "--target", dir])
    const hooks2 = JSON.parse(readFileSync(join(dir, ".cursor", "hooks.json"), "utf8"))
    assert.equal(hooks2.hooks.beforeSubmitPrompt.length, hooks.hooks.beforeSubmitPrompt.length)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("init --answers + --check", () => {
  const dir = mkdtempSync(join(tmpdir(), "mp-init-"))
  const answers = join(dir, "a.json")
  writeFileSync(
    answers,
    JSON.stringify({
      project_name: "sample",
      project_summary: "demo",
      project_mode: "mvp",
      current_phase: "discovery",
      docs_provider: "local",
      tasks_provider: "none",
      chat_provider: "none",
      code_provider: "local",
      user_name: "Test",
      honorific: "anh",
      roles: ["BA"],
      minipower_experience: "new",
      os_username: "test",
    }),
  )
  try {
    run(["init", "--answers", answers, "--target", dir])
    assert.ok(existsSync(join(dir, ".minipower", "identity.json")))
    assert.ok(existsSync(join(dir, ".minipower", "minipower.sqlite")))
    assert.ok(existsSync(join(dir, "memory", "profile.json")))
    const p = JSON.parse(readFileSync(join(dir, "memory", "profile.json"), "utf8"))
    assert.equal(p.version, 3)
    assert.ok(existsSync(join(dir, "memory", "doc-debt.md")))
    const check = run(["init", "--check", "--target", dir])
    assert.match(check, /OK/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("init --check thiếu .minipower → FAIL", () => {
  const dir = mkdtempSync(join(tmpdir(), "mp-chk-"))
  try {
    assert.throws(() => run(["init", "--check", "--target", dir]), /FAIL/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("init hỏi lựa chọn qua stdin (không LLM)", () => {
  const dir = mkdtempSync(join(tmpdir(), "mp-ask-"))
  try {
    const input = Array(20).fill("").join("\n") + "\n"
    execFileSync(node, [CLI, "init", "--target", dir], {
      encoding: "utf8",
      input,
      stdio: ["pipe", "pipe", "pipe"],
    })
    const p = JSON.parse(readFileSync(join(dir, "memory", "profile.json"), "utf8"))
    assert.equal(p.version, 3)
    assert.equal(p.project_mode, "mvp")
    assert.equal(p.docs_provider, "local")
    assert.equal(p.tasks_provider, "none")
    assert.ok(existsSync(join(dir, ".minipower", "bin", "minipower")))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("claude/install.mjs --print uỷ quyền CLI", () => {
  const shim = join(HOOKS, "..", "..", "..", "cli", "claude", "install.mjs")
  const out = execFileSync(node, [shim, "--print"], { encoding: "utf8" })
  const frag = JSON.parse(out)
  assert.ok(frag.hooks.UserPromptSubmit)
  assert.equal(frag.permissions, undefined)
})
