/**
 * Test ĐỎ cho baseline-guard (ADR-020 C4 · C5 · QĐ-4 · việc #2 §8).
 * Viết TRƯỚC hook (QĐ-10).
 *
 * baseline-guard thay `token-guard-read` VÀ `permissions.deny` tĩnh trong install/*
 * — dồn cưỡng chế về một chỗ để hết lệch giữa kênh plugin và kênh settings (QĐ-4).
 *
 * Hai điều kiện cứng:
 *   C4 — docs/02-baseline: DENY ở CẢ 3 MODE, **không BYPASS**. Đây là hook duy nhất
 *        không có lối thoát (§5): snapshot đã ký, đọc qua agent vừa tốn token vừa
 *        mở đường sửa nhầm.
 *   C5 — docs/03-modules/_legacy: deny trừ khi prompt nhắc migrate;
 *        **mode `maintain` mở hẳn** — đọc code/tài liệu cũ chính là công việc.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"

import { checkBaselineGuard } from "../lib/baseline-guard.js"

const BASE_PROFILE = {
  user_name: "Hoàng",
  honorific: "anh",
  roles: ["BA"],
  project_name: "demo",
  project_summary: "demo",
  current_phase: "requirements",
  minipower_experience: "returning",
}

function makeProject(mode) {
  const root = mkdtempSync(join(tmpdir(), "mp-baseline-"))
  mkdirSync(join(root, "memory"), { recursive: true })
  mkdirSync(join(root, "docs"), { recursive: true })
  writeFileSync(join(root, "memory", "memory.md"), "# Memory\n", "utf8")
  if (mode) {
    writeFileSync(
      join(root, "memory", "profile.json"),
      JSON.stringify({
        ...BASE_PROFILE,
        version: 2,
        project_mode: mode,
        approval_source: { docs: "local", tasks: "local", code: "local" },
      }),
      "utf8",
    )
  }
  return root
}

const MODES = ["standard", "mvp", "maintain"]

// ─── C4 — baseline deny tuyệt đối ───────────────────────────────────────────

test("baseline-guard (C4) — docs/02-baseline DENY ở cả 3 mode", async (t) => {
  for (const mode of MODES) {
    await t.test(`mode ${mode} → deny`, () => {
      const root = makeProject(mode)
      try {
        const r = checkBaselineGuard("docs/02-baseline/v1.0/DOC-06-srs.md", "", { root })
        assert.equal(r.action, "deny")
        assert.match(r.message, /baseline/i)
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    })
  }
})

test("baseline-guard (C4) — không lối thoát nào mở được baseline", async (t) => {
  const root = makeProject("maintain") // mode dễ dãi nhất
  try {
    await t.test("BYPASS KHÔNG mở (§5: hook duy nhất không có BYPASS)", () => {
      assert.equal(
        checkBaselineGuard("docs/02-baseline/v1.0/x.md", "BYPASS đọc giúp tôi", { root }).action,
        "deny",
      )
    })

    await t.test("prompt nói migrate cũng KHÔNG mở (khác _legacy)", () => {
      assert.equal(
        checkBaselineGuard("docs/02-baseline/v1.0/x.md", "migrate baseline", { root }).action,
        "deny",
      )
    })

    await t.test("deny ở mọi độ sâu", () => {
      assert.equal(
        checkBaselineGuard("docs/02-baseline/v2.3/03-modules/ORD/DOC-06.md", "", { root }).action,
        "deny",
      )
    })

    await t.test("đường dẫn tuyệt đối + dấu Windows", () => {
      assert.equal(
        checkBaselineGuard("D:\\p\\docs\\02-baseline\\v1.0\\x.md", "", { root }).action,
        "deny",
      )
    })

    await t.test("baseline rỗng (mvp/maintain chưa chốt) vẫn deny — vô hại, ít nhánh test", () => {
      const r2 = makeProject("mvp")
      try {
        assert.equal(checkBaselineGuard("docs/02-baseline/", "", { root: r2 }).action, "deny")
      } finally {
        rmSync(r2, { recursive: true, force: true })
      }
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("baseline-guard (C4) — không deny nhầm tên gần giống", async (t) => {
  const root = makeProject("standard")
  try {
    await t.test("module tên chứa chữ 'baseline' → allow", () => {
      assert.equal(
        checkBaselineGuard("docs/03-modules/baseline-report/DOC-06-srs.md", "", { root }).action,
        "allow",
      )
    })

    await t.test("file DOC bình thường → allow", () => {
      assert.equal(
        checkBaselineGuard("docs/01-project/DOC-03-brd.md", "", { root }).action,
        "allow",
      )
    })

    await t.test("file ngoài docs/ → allow", () => {
      assert.equal(checkBaselineGuard("src/index.ts", "", { root }).action, "allow")
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

// ─── C5 — _legacy theo mode ─────────────────────────────────────────────────

test("baseline-guard (C5) — _legacy: standard/mvp deny trừ migrate", async (t) => {
  for (const mode of ["standard", "mvp"]) {
    await t.test(`mode ${mode}: không nhắc migrate → deny`, () => {
      const root = makeProject(mode)
      try {
        const r = checkBaselineGuard("docs/03-modules/_legacy/old.md", "đọc file này", { root })
        assert.equal(r.action, "deny")
        assert.match(r.message, /migrate|_legacy/i, "thông điệp nêu điều kiện mở khoá")
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    })

    await t.test(`mode ${mode}: prompt nhắc migrate → allow`, () => {
      const root = makeProject(mode)
      try {
        assert.equal(
          checkBaselineGuard("docs/03-modules/_legacy/old.md", "migrate module cũ", { root })
            .action,
          "allow",
        )
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    })
  }
})

test("baseline-guard (C5) — mode maintain MỞ _legacy vô điều kiện", async (t) => {
  const root = makeProject("maintain")
  try {
    await t.test("không cần nhắc migrate — đọc tài liệu cũ chính là công việc", () => {
      assert.equal(
        checkBaselineGuard("docs/03-modules/_legacy/old.md", "xem hệ cũ làm gì", { root }).action,
        "allow",
      )
    })

    await t.test("dấu Windows", () => {
      assert.equal(
        checkBaselineGuard("docs\\03-modules\\_legacy\\old.md", "", { root }).action,
        "allow",
      )
    })

    await t.test("nhưng baseline thì vẫn deny — C5 mở không kéo theo C4", () => {
      assert.equal(
        checkBaselineGuard("docs/02-baseline/v1.0/x.md", "", { root }).action,
        "deny",
      )
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

// ─── R2 — fail-open ─────────────────────────────────────────────────────────

test("baseline-guard (R2) — thiếu profile: giữ mặc định an toàn, không ném", async (t) => {
  const root = makeProject(null) // không có profile.json
  try {
    await t.test("baseline vẫn deny (an toàn không phụ thuộc profile)", () => {
      assert.equal(
        checkBaselineGuard("docs/02-baseline/v1.0/x.md", "", { root }).action,
        "deny",
      )
    })

    await t.test("_legacy rơi về hành vi standard — deny trừ migrate", () => {
      assert.equal(
        checkBaselineGuard("docs/03-modules/_legacy/old.md", "đọc thử", { root }).action,
        "deny",
      )
      assert.equal(
        checkBaselineGuard("docs/03-modules/_legacy/old.md", "migrate", { root }).action,
        "allow",
      )
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("baseline-guard — đầu vào không hợp lệ", async (t) => {
  const root = makeProject("standard")
  try {
    await t.test("path rỗng / null / undefined → allow, không ném", () => {
      assert.equal(checkBaselineGuard("", "", { root }).action, "allow")
      assert.equal(checkBaselineGuard("   ", "", { root }).action, "allow")
      assert.equal(checkBaselineGuard(null, null, { root }).action, "allow")
      assert.equal(checkBaselineGuard(undefined, undefined, { root }).action, "allow")
    })

    await t.test("thiếu opts → không ném", () => {
      assert.equal(checkBaselineGuard("src/a.ts").action, "allow")
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
