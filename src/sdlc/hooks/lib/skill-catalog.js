/**
 * Catalog lá đăng ký + kho SOP + agent guardrail — toàn repo, không chỉ sdlc/.
 * Consumer: test/minipower-catalog.test.js
 */

import { readdirSync, existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HOOKS_LIB = dirname(fileURLToPath(import.meta.url))
/** lib → hooks → sdlc */
export const SDLC = dirname(dirname(HOOKS_LIB))
/** pack cài được */
export const SRC = dirname(SDLC)
/** gốc repo */
export const ROOT = dirname(SRC)

/** PACK.md modules có thư mục skills/ lá minipower-* (không gồm kho sdlc/) */
export const SKILL_PACKS = [
  "router",
  "discovery",
  "analyst",
  "architecture",
  "pm",
  "support",
  "qa",
  "presales",
  "ops",
  "backend",
  "toolbox",
  "docs",
  "tasks",
  "chat",
  "vcs",
]

export function frontmatter(path) {
  const t = readFileSync(path, "utf8")
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ""
}

export function fmHasDescription(fm) {
  return /^description:\s*\S/m.test(fm)
}

export function fmName(fm) {
  return (fm.match(/^name:\s*(\S+)/m) || [])[1]
}

export function listLeafSkills() {
  const out = []
  for (const pack of SKILL_PACKS) {
    const skills = join(SRC, pack, "skills")
    if (!existsSync(skills)) continue
    for (const e of readdirSync(skills, { withFileTypes: true })) {
      if (!e.isDirectory() || !e.name.startsWith("minipower-")) continue
      const skillMd = join(skills, e.name, "SKILL.md")
      const readme = join(skills, e.name, "README.md")
      out.push({
        pack,
        name: e.name,
        skillMd,
        readme,
      })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

export function listWarehouseSkills() {
  const dir = join(SDLC, "skills")
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({
      name: e.name,
      skillMd: join(dir, e.name, "SKILL.md"),
    }))
    .filter((x) => existsSync(x.skillMd))
}

export function listAgents() {
  const dir = join(SDLC, "agents")
  return readdirSync(dir)
    .filter((n) => n.endsWith(".md") && n !== "README.md")
    .sort()
    .map((n) => ({ name: n, path: join(dir, n) }))
}
