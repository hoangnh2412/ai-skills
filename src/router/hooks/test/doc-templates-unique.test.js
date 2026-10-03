/**
 * ADR-037 T6 — mỗi DOC-NN chỉ một file dưới src/{pack}/templates/.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { SRC } from "../lib/skill-catalog.js"

test("T6 — mỗi DOC-NN đúng một path trong src/*/templates/", () => {
  const byId = new Map()
  for (const pack of readdirSync(SRC, { withFileTypes: true })) {
    if (!pack.isDirectory()) continue
    const dir = join(SRC, pack.name, "templates")
    if (!existsSync(dir)) continue
    for (const f of readdirSync(dir)) {
      const m = f.match(/^DOC-(\d{2})-.*\.md$/)
      if (!m) continue
      const id = m[1]
      const path = `${pack.name}/templates/${f}`
      if (byId.has(id)) {
        assert.fail(`DOC-${id} trùng: ${byId.get(id)} và ${path}`)
      }
      byId.set(id, path)
    }
  }
  for (let i = 1; i <= 19; i++) {
    const id = String(i).padStart(2, "0")
    assert.ok(byId.has(id), `thiếu DOC-${id} trong src/*/templates/`)
  }
})
