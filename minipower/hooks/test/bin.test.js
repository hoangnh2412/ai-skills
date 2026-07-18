/**
 * Integration test — CLI shim (hooks/bin/*.js).
 * Spawn shim thật, pipe JSON vào stdin, kiểm tra stdout JSON + exit code.
 * Đây là lớp khoá HỢP ĐỒNG I/O mà lib (hàm thuần) không có.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const BIN = join(dirname(fileURLToPath(import.meta.url)), "..", "bin")

/** Chạy shim với input JSON. Trả {code, json, stdout}. */
function run(script, input) {
  let stdout = ""
  let code = 0
  try {
    stdout = execFileSync("node", [join(BIN, script)], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    })
  } catch (e) {
    stdout = e.stdout || ""
    code = e.status ?? 1
  }
  let json = null
  try {
    json = JSON.parse(stdout.trim())
  } catch {
    /* để nguyên null */
  }
  return { code, json, stdout }
}

test("shim token-guard", async (t) => {
  await t.test("allow → {continue:true} exit 0", () => {
    const r = run("token-guard.js", { prompt: "giải thích pipeline" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
  })

  await t.test("block @docs/ → {continue:false, user_message} exit 2", () => {
    const r = run("token-guard.js", { prompt: "@docs/" })
    assert.equal(r.code, 2)
    assert.equal(r.json.continue, false)
    assert.match(r.json.user_message, /1 file/)
  })

  await t.test("warn thiếu scope → vẫn {continue:true} exit 0", () => {
    const r = run("token-guard.js", { prompt: "Phase: requirements — sửa DOC-06" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
  })

  await t.test("stdin rỗng → allow, không crash", () => {
    const r = run("token-guard.js", {})
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
  })

  await t.test("micro → allow + additional_context gợi ý tầng (R2)", () => {
    const r = run("token-guard.js", { prompt: "/minipower sửa typo trong DOC-06" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
    assert.match(r.json.additional_context, /micro/i)
    assert.equal(r.json.hookSpecificOutput.hookEventName, "UserPromptSubmit")
  })
})

test("shim auto-routing", async (t) => {
  await t.test("enrich → updated_input + hookSpecificOutput exit 0", () => {
    const r = run("auto-routing.js", { prompt: "sửa DOC-06" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
    assert.match(r.json.updated_input.prompt, /Phase: requirements/)
    assert.match(r.json.updated_input.prompt, /sửa DOC-06/) // giữ prompt gốc
    assert.equal(r.json.hookSpecificOutput.hookEventName, "UserPromptSubmit")
    assert.match(r.json.hookSpecificOutput.updatedInput.prompt, /Phase: requirements/)
  })

  await t.test("block nhiều phase → {continue:false} exit 2", () => {
    const r = run("auto-routing.js", { prompt: "review DOC-06 và DOC-08" })
    assert.equal(r.code, 2)
    assert.equal(r.json.continue, false)
    assert.match(r.json.user_message, /tách/i)
  })

  await t.test("attachments → nhận diện phase", () => {
    const r = run("auto-routing.js", {
      prompt: "sửa giúp",
      attachments: [{ type: "file", file_path: "docs/03-modules/billing/DOC-06-srs.md" }],
    })
    assert.equal(r.code, 0)
    assert.match(r.json.updated_input.prompt, /Phase: requirements/)
  })

  await t.test("không DOC → allow", () => {
    const r = run("auto-routing.js", { prompt: "giải thích pipeline" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
    assert.equal(r.json.updated_input, undefined)
  })
})

test("shim token-guard-read", async (t) => {
  await t.test("allow file thường → {permission:allow} exit 0", () => {
    const r = run("token-guard-read.js", { file_path: "docs/03-modules/billing/DOC-06-srs.md" })
    assert.equal(r.code, 0)
    assert.equal(r.json.permission, "allow")
  })

  await t.test("deny baseline → {permission:deny} exit 0 (không chặn hard)", () => {
    const r = run("token-guard-read.js", { file_path: "docs/02-baseline/v1.0/README.md" })
    assert.equal(r.code, 0)
    assert.equal(r.json.permission, "deny")
    assert.match(r.json.user_message, /02-baseline/)
  })

  await t.test("field 'path' thay cho 'file_path'", () => {
    const r = run("token-guard-read.js", { path: "docs/02-baseline/x.md" })
    assert.equal(r.json.permission, "deny")
  })

  await t.test("_legacy + prompt migrate → allow", () => {
    const r = run("token-guard-read.js", {
      file_path: "docs/03-modules/_legacy/old.md",
      prompt: "migrate billing",
    })
    assert.equal(r.json.permission, "allow")
  })
})

test("shim decision-staleness", async (t) => {
  await t.test("prompt không liên quan → {continue:true}, không quét", () => {
    const r = run("decision-staleness.js", { prompt: "sửa DOC-06" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
    assert.equal(r.json.additional_context, undefined)
  })

  await t.test("prompt có keyword nhưng ngoài git → vẫn {continue:true} an toàn", () => {
    const r = run("decision-staleness.js", { prompt: "đánh giá lại quyết định baseline" })
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
  })

  await t.test("stdin rỗng → {continue:true}", () => {
    const r = run("decision-staleness.js", {})
    assert.equal(r.code, 0)
    assert.equal(r.json.continue, true)
  })
})
