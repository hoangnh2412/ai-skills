#!/usr/bin/env node
/**
 * Minipower — cài hook Claude Code (R5). Thay `/ABSOLUTE/PATH/TO/ai-skills/minipower`
 * bằng path THẬT (tự suy từ vị trí script), merge vào `.claude/settings.json` của
 * project (thư mục đang đứng), rồi VERIFY bằng smoke-test 4 shim.
 *
 * Trước đây README bắt find & replace tay (ADR §3.6/R5) → dễ sai, không kiểm.
 *
 *   cd <project docs>            # nơi có/định tạo .claude/settings.json
 *   node <MP>/install/claude/install.mjs           # merge + verify
 *   node <MP>/install/claude/install.mjs --check    # chỉ verify shim, không ghi
 *   node <MP>/install/claude/install.mjs --print    # in JSON đã resolve, không ghi
 *
 * An toàn: idempotent (chạy lại không nhân đôi hook), backup .bak trước khi ghi đè,
 * chỉ đụng khối minipower — giữ nguyên hook/permission khác của bạn.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { execFileSync } from "node:child_process"

const HERE = dirname(fileURLToPath(import.meta.url)) // install/claude
const PACK_ROOT = resolve(HERE, "..", "..") // …/minipower
const PLACEHOLDER = "/ABSOLUTE/PATH/TO/ai-skills/minipower"
const FRAGMENT = join(HERE, "settings.fragment.json")
const BIN = join(PACK_ROOT, "hooks", "bin")

const args = new Set(process.argv.slice(2))
const CHECK = args.has("--check")
const PRINT = args.has("--print")

/**
 * Đọc fragment, thay placeholder bằng path pack thật.
 *
 * Thay trên VĂN BẢN JSON nên path phải được escape theo luật JSON trước — trên
 * Windows `PACK_ROOT` là `D:\Working\…`, chèn thô vào sẽ thành escape không hợp lệ
 * (`\W`) và `JSON.parse` ném. `JSON.stringify(...).slice(1,-1)` cho đúng dạng đã
 * escape, bỏ hai dấu nháy bao ngoài.
 */
function resolvedFragment() {
  const packRoot = JSON.stringify(PACK_ROOT).slice(1, -1)
  const raw = readFileSync(FRAGMENT, "utf8").split(PLACEHOLDER).join(packRoot)
  return JSON.parse(raw)
}

const MINIPOWER_MARK = join("minipower", "hooks", "bin") // nhận diện hook của ta để idempotent

function isMinipowerHook(h) {
  return h && typeof h.command === "string" && h.command.includes(MINIPOWER_MARK)
}

/** Bỏ mọi hook minipower cũ trong 1 event (idempotent); group rỗng thì loại. */
function stripMinipower(groups) {
  if (!Array.isArray(groups)) return []
  return groups
    .map((g) => ({ ...g, hooks: (g.hooks || []).filter((h) => !isMinipowerHook(h)) }))
    .filter((g) => (g.hooks || []).length > 0)
}

function mergeSettings(cur, frag) {
  const next = { ...cur }

  // permissions — fragment KHÔNG còn khai deny (ADR-020 QĐ-4: dồn cưỡng chế về
  // baseline-guard, một SSOT). Giữ nguyên permission RIÊNG của người dùng; chỉ
  // hợp nhất nếu fragment có gì đó. Không tự xoá 2 dòng deny cũ của bản cài trước
  // — chúng vô hại (trùng với baseline-guard), xoá hộ là đụng settings của người.
  const fragDeny = (frag.permissions && frag.permissions.deny) || []
  if (fragDeny.length) {
    const curDeny = (cur.permissions && cur.permissions.deny) || []
    next.permissions = {
      ...(cur.permissions || {}),
      deny: [...new Set([...curDeny, ...fragDeny])],
    }
  }

  // hooks — mỗi event: giữ hook không phải minipower, rồi nối khối minipower.
  next.hooks = { ...(cur.hooks || {}) }
  for (const event of Object.keys(frag.hooks || {})) {
    const kept = stripMinipower((cur.hooks || {})[event])
    next.hooks[event] = [...kept, ...frag.hooks[event]]
  }
  return next
}

/** Smoke-test: mỗi shim phải chạy dưới node hiện tại + path đã resolve, in JSON hợp lệ. */
function verify() {
  const cases = [
    ["token-guard.js", { prompt: "@docs/" }],
    ["auto-routing.js", { prompt: "sửa DOC-06" }],
    ["profile-guard.js", { prompt: "Phase: requirements — DOC-06" }],
    ["prereq-gate.js", { prompt: "phan tich yeu cau" }],
    ["decision-staleness.js", { prompt: "đánh giá lại quyết định" }],
    ["baseline-guard.js", { tool_input: { file_path: "docs/02-baseline/x.md" }, prompt: "" }],
  ]
  for (const [script, input] of cases) {
    const bin = join(BIN, script)
    if (!existsSync(bin)) throw new Error(`Thiếu shim: ${bin}`)
    let stdout = ""
    try {
      stdout = execFileSync(process.execPath, [bin], {
        input: JSON.stringify(input),
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      })
    } catch (e) {
      // block/deny thoát exit 2 vẫn in JSON hợp lệ ra stdout — chấp nhận.
      stdout = e.stdout || ""
    }
    const obj = JSON.parse(stdout.trim())
    if (!obj || typeof obj !== "object") throw new Error(`${script}: output không phải JSON object`)
  }
  return cases.length
}

// ── main ─────────────────────────────────────────────────────────────────
const frag = resolvedFragment()

if (PRINT) {
  process.stdout.write(JSON.stringify(frag, null, 2) + "\n")
  process.exit(0)
}

process.stdout.write(`Pack: ${PACK_ROOT}\n`)
const n = verify()
process.stdout.write(`✓ Verify: ${n}/${n} shim chạy OK dưới ${process.execPath}\n`)

if (CHECK) {
  process.stdout.write("(--check) Chỉ verify, không ghi settings.\n")
  process.exit(0)
}

const target = join(process.cwd(), ".claude", "settings.json")
mkdirSync(dirname(target), { recursive: true })

let result
if (existsSync(target)) {
  const cur = JSON.parse(readFileSync(target, "utf8"))
  const bak = target + ".bak"
  copyFileSync(target, bak)
  result = mergeSettings(cur, frag)
  writeFileSync(target, JSON.stringify(result, null, 2) + "\n")
  process.stdout.write(`✓ Merged vào ${target} (backup: ${bak})\n`)
} else {
  writeFileSync(target, JSON.stringify(frag, null, 2) + "\n")
  process.stdout.write(`✓ Đã tạo ${target}\n`)
}
process.stdout.write("Xong. Mở Claude Code, gõ /memory để kiểm tra rules.\n")
