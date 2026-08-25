/**
 * Test link-check (ADR-021 §6a · ADR-022 §6 bước 1) — fixture tạm + smoke trên repo thật.
 * KHÔNG assert repo thật 0 link gãy: baseline nợ sẵn có được chốt ở đợt thi hành ADR-022,
 * CI chỉ được phép đỏ vì link gãy MỚI sau khi đợt hàn xong.
 */
import test from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { listMdFiles, extractLinks, checkRepo } from "../lib/link-check.js"

const ROOT = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))))

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), "mp-linkcheck-"))
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true })
    writeFileSync(join(dir, rel), content, "utf8")
  }
  return dir
}

test("link lành không báo; link gãy báo đúng file:line → target", () => {
  const dir = fixture({
    "a.md": "xem [b](docs/b.md) và [hụt](docs/missing.md)\n",
    "docs/b.md": "ngược về [a](../a.md)\n",
  })
  try {
    const r = checkRepo(dir)
    assert.equal(r.broken.length, 1)
    assert.deepEqual(r.broken[0], { file: "a.md", line: 1, target: "docs/missing.md" })
    assert.equal(r.linksChecked, 3)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test("bỏ qua: scheme ngoài, anchor thuần, anchor sau file có thật", () => {
  const dir = fixture({
    "a.md": "[web](https://x.vn) [mail](mailto:a@b.c) [neo](#muc) [b](b.md#phan-2)\n",
    "b.md": "nội dung\n",
  })
  try {
    const r = checkRepo(dir)
    assert.equal(r.broken.length, 0)
    assert.equal(r.linksChecked, 1) // chỉ b.md#phan-2 là link tương đối phải kiểm
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test("bỏ qua link trong code fence và inline code (ví dụ minh hoạ)", () => {
  const text = [
    "```md",
    "[vi du trong fence](khong-ton-tai-1.md)",
    "```",
    "chữ `[vi du inline](khong-ton-tai-2.md)` chữ",
    "[that](that.md)",
  ].join("\n")
  const links = extractLinks(text)
  assert.deepEqual(links, [{ line: 5, target: "that.md" }])
})

test("không quét folder ship sang dự án đích (templates/, docs-skeleton/, …)", () => {
  const dir = fixture({
    "a.md": "[ok](a.md)\n",
    "templates/t.md": "[gãy theo ngữ cảnh dự án đích](../05-traceability/x.md)\n",
    "docs-skeleton/d.md": "[gãy](y.md)\n",
  })
  try {
    assert.deepEqual(listMdFiles(dir), ["a.md"])
    assert.equal(checkRepo(dir).broken.length, 0)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test("smoke — chạy trên repo thật không throw, có quét file", () => {
  const r = checkRepo(ROOT)
  assert.ok(r.filesScanned > 50, `quét được ${r.filesScanned} file — quá ít, walk hỏng?`)
  assert.ok(r.linksChecked > 100)
})

test("baseline — chỉ fail khi gãy MỚI; nợ đã lành được báo", async () => {
  const { parseBaseline, diffBaseline, toBaseline } = await import("../lib/link-check.js")
  const result = { broken: [
    { file: "a.md", line: 3, target: "x.md" },
    { file: "b.md", line: 9, target: "y.md" },
  ] }
  const base = parseBaseline("# chú thích\na.md → x.md\nc.md → z.md\n")
  const { fresh, resolved } = diffBaseline(result, base)
  assert.deepEqual(fresh.map((b) => b.file), ["b.md"])   // y.md là gãy mới
  assert.deepEqual(resolved, ["c.md → z.md"])            // z.md đã lành
  assert.match(toBaseline(result), /a\.md → x\.md\nb\.md → y\.md\n$/)
})
