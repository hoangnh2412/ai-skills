#!/usr/bin/env node
/**
 * Minipower link:check — CLI cho CI (ADR-021 §6a · ADR-022 §6 bước 1).
 *   node bin/link-check.js [repoRoot] [--baseline <file>] [--update-baseline]
 * Không baseline: exit 1 khi có bất kỳ link gãy.
 * Có baseline:    exit 1 chỉ khi có link gãy MỚI (ngoài baseline); nợ đã lành thì nhắc cập nhật.
 * --update-baseline: ghi trạng thái gãy hiện tại vào file baseline (soát diff trước khi commit).
 */
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { checkRepo, formatReport, parseBaseline, diffBaseline, toBaseline } from "../lib/link-check.js"

// bin/ → hooks/ → pack → repo root
const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_ROOT = dirname(dirname(dirname(HERE)))
const DEFAULT_BASELINE = resolve(HERE, "..", "link-check.baseline.txt")

const args = process.argv.slice(2)
const positional = args.filter((a) => !a.startsWith("--"))
const root = positional[0] || DEFAULT_ROOT
const bIdx = args.indexOf("--baseline")
const baselinePath = bIdx >= 0 && args[bIdx + 1] ? resolve(args[bIdx + 1]) : DEFAULT_BASELINE
const update = args.includes("--update-baseline")

const result = checkRepo(root)

if (update) {
  writeFileSync(baselinePath, toBaseline(result))
  process.stdout.write(`Đã ghi baseline ${result.broken.length} mục → ${baselinePath}\n`)
  process.exit(0)
}

if (existsSync(baselinePath)) {
  const { fresh, resolved } = diffBaseline(result, parseBaseline(readFileSync(baselinePath, "utf8")))
  for (const b of fresh) process.stdout.write(`${b.file}:${b.line}  →  ${b.target}  ✗ GÃY MỚI\n`)
  process.stdout.write(
    `— ${result.filesScanned} file · ${result.linksChecked} link · ` +
      `${result.broken.length} gãy (${result.broken.length - fresh.length} nợ baseline) · ` +
      `${fresh.length} MỚI · ${resolved.length} đã lành\n`,
  )
  if (resolved.length) {
    process.stdout.write(`Nợ đã lành — cập nhật baseline: npm run link:check -- --update-baseline\n`)
  }
  process.exit(fresh.length > 0 ? 1 : 0)
}

process.stdout.write(formatReport(result) + "\n")
process.exit(result.broken.length > 0 ? 1 : 0)
