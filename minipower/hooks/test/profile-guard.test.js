/**
 * Golden test — checkProfileGuard @ beforeSubmitPrompt
 */

import test from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"

import {
  checkProfileGuard,
  isMinipowerProject,
  isProfileComplete,
  validateProfile,
} from "../lib/profile-guard.js"

function makeProject() {
  const root = mkdtempSync(join(tmpdir(), "mp-profile-"))
  mkdirSync(join(root, "memory"), { recursive: true })
  mkdirSync(join(root, "docs"), { recursive: true })
  writeFileSync(join(root, "memory", "memory.md"), "# Memory\n", "utf8")
  return root
}

const VALID_PROFILE = {
  version: 1,
  user_name: "Hoàng",
  honorific: "anh",
  agent_pronoun: "em",
  roles: ["BA", "PM"],
  project_name: "demo",
  project_summary: "Hệ thống hóa đơn điện tử",
  current_phase: "discovery",
  minipower_experience: "new",
  completed_at: "2026-07-25",
}

test("validateProfile", async (t) => {
  await t.test("profile hợp lệ", () => {
    const r = validateProfile(VALID_PROFILE)
    assert.equal(r.valid, true)
    assert.equal(r.errors.length, 0)
  })

  await t.test("thiếu user_name", () => {
    const r = validateProfile({ ...VALID_PROFILE, user_name: "" })
    assert.equal(r.valid, false)
  })

  await t.test("role không hợp lệ", () => {
    const r = validateProfile({ ...VALID_PROFILE, roles: ["CEO"] })
    assert.equal(r.valid, false)
  })
})

test("isMinipowerProject", async (t) => {
  const root = makeProject()
  try {
    assert.equal(isMinipowerProject(root), true)
    assert.equal(isMinipowerProject(tmpdir()), false)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("checkProfileGuard", async (t) => {
  const root = makeProject()
  try {
    await t.test("chưa profile — prompt thường → allow", () => {
      assert.equal(
        checkProfileGuard("xin chào, tôi là Hoàng", [], { root }).action,
        "allow",
      )
    })

    await t.test("chưa profile — minipower work → block", () => {
      const r = checkProfileGuard("Phase: requirements — DOC-06", [], { root })
      assert.equal(r.action, "block")
      assert.match(r.message, /profile\.json/)
    })

    await t.test("init project → allow", () => {
      assert.equal(
        checkProfileGuard("Init project billing", [], { root }).action,
        "allow",
      )
    })

    await t.test("BYPASS → allow", () => {
      assert.equal(
        checkProfileGuard("BYPASS Phase: requirements DOC-06", [], { root }).action,
        "allow",
      )
    })

    writeFileSync(
      join(root, "memory", "profile.json"),
      JSON.stringify(VALID_PROFILE, null, 2),
      "utf8",
    )

    await t.test("đã profile — minipower work → allow", () => {
      assert.equal(isProfileComplete(root), true)
      assert.equal(
        checkProfileGuard("Phase: requirements — DOC-06", [], { root }).action,
        "allow",
      )
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
