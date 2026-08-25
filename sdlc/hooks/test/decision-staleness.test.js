/**
 * Test — decision-staleness.
 * checkDecisionStaleness cần git + fs thật; ở đây test phần thuần (parseEntries) kỹ,
 * và test checkDecisionStaleness trả null an toàn khi ngoài git / không có memory/.
 * Hành vi git-dependent đầy đủ được integration test gián tiếp qua repo thật.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { parseEntries, checkDecisionStaleness } from "../lib/decision-staleness.js"

test("parseEntries: tách DEC + ngày + status + trace", async (t) => {
  const md = `
# Decision log — requirements

### DEC-REQ-001 — Chọn REST cho public API [2026-06-10]
- Status: accepted
- Trace: DOC-06, docs/03-modules/billing/DOC-06-srs.md
- Why: loại B vì...

### DEC-REQ-002 — Bỏ webhook v1 [2026-06-12]
- Status: superseded-by DEC-REQ-005
- Trace: DOC-12
`
  const entries = parseEntries(md)

  await t.test("đúng số lượng", () => {
    assert.equal(entries.length, 2)
  })

  await t.test("id + date", () => {
    assert.equal(entries[0].id, "DEC-REQ-001")
    assert.equal(entries[0].date, "2026-06-10")
    assert.equal(entries[1].id, "DEC-REQ-002")
    assert.equal(entries[1].date, "2026-06-12")
  })

  await t.test("status + trace", () => {
    assert.match(entries[0].status.toLowerCase(), /accepted/)
    assert.match(entries[0].trace, /DOC-06/)
    assert.match(entries[1].status.toLowerCase(), /superseded-by/)
  })
})

test("parseEntries: đầu vào cạnh biên", async (t) => {
  await t.test("chuỗi rỗng → []", () => {
    assert.deepEqual(parseEntries(""), [])
  })

  await t.test("không có DEC nào → []", () => {
    assert.deepEqual(parseEntries("# tiêu đề\nvài dòng linh tinh"), [])
  })

  await t.test("DEC không có ngày [YYYY-MM-DD] → bỏ qua (không khớp ENTRY_RE)", () => {
    assert.deepEqual(parseEntries("### DEC-REQ-001 — thiếu ngày\n- Status: accepted"), [])
  })

  await t.test("CRLF vẫn tách được", () => {
    const e = parseEntries("### DEC-ARC-003 — x [2026-01-01]\r\n- Trace: DOC-08\r\n")
    assert.equal(e.length, 1)
    assert.match(e[0].trace, /DOC-08/)
  })
})

test("checkDecisionStaleness: trả null an toàn", async (t) => {
  await t.test("ngoài git repo → null", () => {
    const dir = mkdtempSync(join(tmpdir(), "mp-nogit-"))
    try {
      assert.equal(checkDecisionStaleness(dir), null)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  await t.test("đường dẫn không tồn tại → null, không ném lỗi", () => {
    assert.equal(checkDecisionStaleness(join(tmpdir(), "khong-ton-tai-minipower-xyz")), null)
  })
})
