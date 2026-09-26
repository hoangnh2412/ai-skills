#!/usr/bin/env node
/** Shim — uỷ quyền CLI chung (ADR-031). */
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const cli = join(HERE, "..", "minipower.mjs")
const extra = process.argv.slice(2)
const r = spawnSync(process.execPath, [cli, "install", "--client", "claude", ...extra], {
  stdio: "inherit",
  cwd: process.cwd(),
})
process.exit(r.status === null ? 1 : r.status)
