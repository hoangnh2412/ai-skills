/**
 * SQLite projection cho trace:check (ADR-033 QĐ-9 / §5.4).
 * Không lưu body FR. Node `node:sqlite` (CI Node 22); Node 18 không có module → bỏ qua DB, chỉ markdown.
 */

import { existsSync, mkdirSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { loadProfile, providersFromProfile } from "./profile-guard.js"

const require = createRequire(import.meta.url)
const HERE = dirname(fileURLToPath(import.meta.url))
const PACK_SCHEMA = join(HERE, "..", "..", "templates", "trace.sql")

const KIND = {
  UC: "uc",
  FR: "fr",
  BR: "br",
  AC: "ac",
  NFR: "nfr",
  TC: "test",
}

/** @returns {typeof import("node:sqlite").DatabaseSync | null} */
export function sqliteDatabaseSync() {
  try {
    return require("node:sqlite").DatabaseSync
  } catch {
    return null
  }
}

export function schemaSql(root) {
  const local = root ? join(root, "memory", "trace.sql") : ""
  const path = local && existsSync(local) ? local : PACK_SCHEMA
  return readFileSync(path, "utf8")
}

export function dbPath(root) {
  return join(root, "memory", "trace.db")
}

export function shouldDumpLocalDocs(root) {
  const p = loadProfile(root)
  if (!p) return true
  if (p.version === 3) return String(p.docs_provider || "local") === "local"
  const docs = providersFromProfile(p).docs
  return docs === "local"
}

/**
 * @param {string} root
 * @returns {InstanceType<NonNullable<ReturnType<typeof sqliteDatabaseSync>>> | null}
 */
export function openTraceDb(root) {
  const DatabaseSync = sqliteDatabaseSync()
  if (!DatabaseSync) return null
  mkdirSync(join(root, "memory"), { recursive: true })
  const db = new DatabaseSync(dbPath(root))
  db.exec(schemaSql(root))
  return db
}

export function upsertFaceBindings(db, root) {
  const p = loadProfile(root)
  const providers = p ? providersFromProfile(p) : { docs: "local", tasks: "none", chat: "none", code: "local" }
  const mcp = p && p.mcp && typeof p.mcp === "object" && !Array.isArray(p.mcp) ? p.mcp : {}
  const ins = db.prepare(
    `INSERT INTO face_binding (face, provider, mcp_server) VALUES (?, ?, ?)
     ON CONFLICT(face) DO UPDATE SET provider = excluded.provider, mcp_server = excluded.mcp_server`,
  )
  for (const face of ["docs", "tasks", "chat", "code"]) {
    const server = typeof mcp[face] === "string" && mcp[face].trim() ? mcp[face].trim() : null
    ins.run(face, providers[face] || "local", server)
  }
}

/**
 * @param {object} db
 * @param {{id:string, file:string, line:number}[]} decls
 * @param {Map<string, Set<string>>} idsByFile
 */
export function dumpMarkdownIndex(db, decls, idsByFile) {
  db.exec("BEGIN")
  try {
    db.exec("DELETE FROM link WHERE rel IN ('satisfies', 'tests')")
    const del = db.prepare("DELETE FROM artifact WHERE type IN ('uc','fr','br','ac','nfr','test')")
    del.run()
    const insA = db.prepare(
      `INSERT INTO artifact (id, type, title, status, provider_face, provider, provider_uri)
       VALUES (?, ?, '', 'draft', 'docs', 'local', ?)`,
    )
    const seen = new Set()
    for (const d of decls) {
      const kind = kindFromId(d.id)
      if (!kind || seen.has(d.id)) continue
      seen.add(d.id)
      insA.run(d.id, kind, d.file)
    }
    const insL = db.prepare("INSERT OR IGNORE INTO link (from_id, to_id, rel) VALUES (?, ?, ?)")
    for (const ids of idsByFile.values()) {
      const frs = [...ids].filter((i) => i.includes("-FR-") && seen.has(i))
      const acs = [...ids].filter((i) => i.includes("-AC-") && seen.has(i))
      const tcs = [...ids].filter((i) => i.includes("-TC-") && seen.has(i))
      for (const fr of frs) {
        for (const ac of acs) insL.run(fr, ac, "satisfies")
      }
      for (const ac of acs) {
        for (const tc of tcs) insL.run(ac, tc, "tests")
      }
    }
    db.exec("COMMIT")
  } catch (e) {
    db.exec("ROLLBACK")
    throw e
  }
}

function kindFromId(id) {
  const m = String(id).match(/-([A-Z]+)-\d/)
  return m ? KIND[m[1]] || null : null
}

/**
 * WARN giống markdown: chỉ khi đã có AC/TC trong index.
 * @returns {{level:"warn", code:string, message:string}[]}
 */
export function findingsFromSqlite(db) {
  const findings = []
  const types = db.prepare("SELECT DISTINCT type FROM artifact").all().map((r) => r.type)
  const hasAc = types.includes("ac")
  const hasTc = types.includes("test")
  if (hasAc) {
    const rows = db
      .prepare(
        `SELECT a.id FROM artifact a
         WHERE a.type = 'fr'
           AND NOT EXISTS (
             SELECT 1 FROM link l WHERE l.from_id = a.id AND l.rel = 'satisfies'
           )`,
      )
      .all()
    for (const r of rows) {
      findings.push({
        level: "warn",
        code: "fr-no-ac",
        message: `${r.id} chưa thấy AC nào nối vào`,
      })
    }
  }
  if (hasTc) {
    const rows = db
      .prepare(
        `SELECT a.id FROM artifact a
         WHERE a.type = 'ac'
           AND NOT EXISTS (
             SELECT 1 FROM link l WHERE l.from_id = a.id AND l.rel = 'tests'
           )`,
      )
      .all()
    for (const r of rows) {
      findings.push({
        level: "warn",
        code: "ac-no-test",
        message: `${r.id} chưa thấy Test nào nối vào`,
      })
    }
  }
  return findings
}

export function closeDb(db) {
  if (db && typeof db.close === "function") db.close()
}
