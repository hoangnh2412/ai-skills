#!/usr/bin/env node
/**
 * Minipower trace:check — CLI cho CI (ADR-020 C8).
 *   node bin/trace-check.js [projectRoot]
 * exit 0 = không FAIL (WARN vẫn exit 0) · exit 1 = có FAIL
 */
import { traceCheck, formatReport } from "../lib/trace-check.js"

const root = process.argv[2] || process.env.MP_PROJECT_ROOT || process.cwd()
const result = traceCheck(root)

process.stdout.write(formatReport(result) + "\n")
process.exit(result.stats.fails > 0 ? 1 : 0)
