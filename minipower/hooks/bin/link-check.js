#!/usr/bin/env node
/**
 * Minipower link:check — CLI cho CI (ADR-021 §6a · ADR-022 §6 bước 1).
 *   node bin/link-check.js [repoRoot]
 * exit 0 = mọi link tương đối trong .md trỏ file có thật · exit 1 = có link gãy
 */
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { checkRepo, formatReport } from "../lib/link-check.js"

// bin/ → hooks/ → pack → repo root
const DEFAULT_ROOT = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))))
const root = process.argv[2] || DEFAULT_ROOT

const result = checkRepo(root)
process.stdout.write(formatReport(result) + "\n")
process.exit(result.broken.length > 0 ? 1 : 0)
