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
  readProjectMode,
  PROFILE_VERSION,
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

// ─── ADR-020 — schema v2 (project_mode + approval_source) ───────────────────

const VALID_PROFILE_V2 = {
  ...VALID_PROFILE,
  version: 2,
  project_mode: "standard",
  approval_source: { docs: "local", tasks: "local", code: "local" },
}

test("profile v2 (QĐ-1, QĐ-12)", async (t) => {
  await t.test("schema hiện hành là v2", () => {
    assert.equal(PROFILE_VERSION, 2)
  })

  await t.test("v2 đầy đủ → hợp lệ", () => {
    assert.equal(validateProfile(VALID_PROFILE_V2).valid, true)
  })

  await t.test("v1 vẫn hợp lệ — không chặn oan dự án cài bản cũ (QĐ-2a)", () => {
    assert.equal(validateProfile(VALID_PROFILE).valid, true)
  })

  await t.test("version lạ → không hợp lệ", () => {
    assert.equal(validateProfile({ ...VALID_PROFILE_V2, version: 3 }).valid, false)
  })

  await t.test("v2 thiếu project_mode → không hợp lệ", () => {
    const r = validateProfile({ ...VALID_PROFILE_V2, project_mode: undefined })
    assert.equal(r.valid, false)
    assert.ok(r.errors.some((e) => e.includes("project_mode")))
  })

  await t.test("v2 project_mode lạ → không hợp lệ", () => {
    assert.equal(validateProfile({ ...VALID_PROFILE_V2, project_mode: "turbo" }).valid, false)
  })

  await t.test("v2 mode mvp / maintain đều hợp lệ", () => {
    for (const m of ["mvp", "maintain"]) {
      assert.equal(validateProfile({ ...VALID_PROFILE_V2, project_mode: m }).valid, true, m)
    }
  })

  await t.test("v2 approval_source thiếu một loại → không hợp lệ", () => {
    const r = validateProfile({
      ...VALID_PROFILE_V2,
      approval_source: { docs: "local", tasks: "local" },
    })
    assert.equal(r.valid, false)
    assert.ok(r.errors.some((e) => e.includes("approval_source.code")))
  })

  await t.test("v2 approval_source nhận tên MCP, không chỉ 'local'", () => {
    const r = validateProfile({
      ...VALID_PROFILE_V2,
      approval_source: { docs: "outline", tasks: "openproject", code: "gitlab" },
    })
    assert.equal(r.valid, true)
  })
})

test("readProjectMode — fail-open (R2)", async (t) => {
  const root = makeProject()
  try {
    await t.test("chưa có profile → standard + local, legacy=true, không ném", () => {
      const r = readProjectMode(root)
      assert.equal(r.mode, "standard")
      assert.deepEqual(r.approvalSource, { docs: "local", tasks: "local", code: "local" })
      assert.equal(r.legacy, true)
    })

    await t.test("root không tồn tại → vẫn trả mặc định", () => {
      const r = readProjectMode(join(root, "khong-ton-tai"))
      assert.equal(r.mode, "standard")
      assert.equal(r.legacy, true)
    })

    await t.test("profile v1 → đọc như standard + local (legacy)", () => {
      writeFileSync(
        join(root, "memory", "profile.json"),
        JSON.stringify(VALID_PROFILE, null, 2),
        "utf8",
      )
      const r = readProjectMode(root)
      assert.equal(r.mode, "standard")
      assert.equal(r.legacy, true)
    })

    await t.test("profile v2 → đọc đúng mode + nguồn phê duyệt", () => {
      writeFileSync(
        join(root, "memory", "profile.json"),
        JSON.stringify(
          {
            ...VALID_PROFILE_V2,
            project_mode: "maintain",
            approval_source: { docs: "outline", tasks: "openproject", code: "local" },
          },
          null,
          2,
        ),
        "utf8",
      )
      const r = readProjectMode(root)
      assert.equal(r.mode, "maintain")
      assert.equal(r.legacy, false)
      assert.equal(r.approvalSource.docs, "outline")
      assert.equal(r.approvalSource.code, "local")
    })

    await t.test("v2 mode lạ → rơi về standard, không ném", () => {
      writeFileSync(
        join(root, "memory", "profile.json"),
        JSON.stringify({ ...VALID_PROFILE_V2, project_mode: "turbo" }, null, 2),
        "utf8",
      )
      assert.equal(readProjectMode(root).mode, "standard")
    })

    await t.test("profile.json hỏng JSON → mặc định, không ném", () => {
      writeFileSync(join(root, "memory", "profile.json"), "{ khong phai json", "utf8")
      const r = readProjectMode(root)
      assert.equal(r.mode, "standard")
      assert.equal(r.legacy, true)
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
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
