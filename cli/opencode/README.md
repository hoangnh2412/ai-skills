# Cài Minipower — OpenCode (plugins)

Chạy từ **root workspace project docs**. `$REPO` là gốc repo factory; `$MP` là `$REPO/src/router` (hook và agents).

OpenCode dùng:

| Cursor | OpenCode |
|--------|----------|
| `.cursor/rules/*.mdc` (always-on) | `AGENTS.md` dự án |
| `.cursor/hooks.json` → `node hooks/bin/*.js` | `.opencode/plugins/minipower.ts` (hook `chat.message`, `tool.execute.before`) |

**SSOT logic guard:** [hooks/lib/*.js](../../src/router/hooks/) — dùng chung Cursor/Claude/OpenCode. Plugin OpenCode (`minipower.ts`) là glue mỏng: import thẳng lib `.js` (Bun chạy `.ts` + `.js` trực tiếp, không build).

## Lời nhắc

`AGENTS.md` dự án (mẫu [SAMPLE-agents.md](../../src/router/templates/SAMPLE-agents.md)) giữ slice, sửa DOC và profile. Không có file rule OpenCode lặp các đoạn đó. Hook `profile-guard` vẫn chặn khi thiếu profile.

## Plugins (hooks)

Plugin gói **một file entry** (`minipower.ts`) + `lib/parts.ts` (glue OpenCode). Logic guard đến từ [hooks/lib/*.js](../../src/router/hooks/) dùng chung — `minipower.ts` import qua đường dẫn tương đối `../../../hooks/lib/*.js`, resolve theo **realpath** của pack (nên symlink pack, đừng copy rời file).

| Hook OpenCode | Tương đương Cursor | Mục đích |
|---------------|-------------------|----------|
| `chat.message` | `beforeSubmitPrompt` → token-guard + auto-routing | Scope, @docs rộng, conflict phase |
| `chat.message` (message **đầu phiên**) | Claude SessionStart | Decision-log staleness advisory (không chặn) |
| `tool.execute.before` (`read`) | `beforeReadFile` | Chặn `02-baseline/`, `_legacy/` (tuỳ chọn) |

Biến môi trường tuỳ chọn: `MINIPOWER_ROOT` (mặc định `minipower/src/router`) — path gợi ý skill trong auto-route.

### Symlink plugin

**macOS / Linux:**

```bash
REPO=/path/to/minipower
MP=$REPO/src/router
mkdir -p .opencode/plugins
ln -snf "$REPO/cli/opencode/plugins/minipower.ts" .opencode/plugins/
ln -snf "$REPO/cli/opencode/plugins/lib" .opencode/plugins/lib
```

**Windows (PowerShell):**

```powershell
$REPO = "D:\path\to\minipower"
$MP = "$REPO\src\sdlc"
New-Item -ItemType Directory -Force -Path .opencode\plugins
New-Item -ItemType SymbolicLink -Force -Path .opencode\plugins\minipower.ts `
  -Target "$REPO\cli\opencode\plugins\minipower.ts"
New-Item -ItemType SymbolicLink -Force -Path .opencode\plugins\lib `
  -Target "$REPO\cli\opencode\plugins\lib"
```

> **Symlink thất bại (Windows):** `Copy-Item -Recurse -Force "$REPO\cli\opencode\plugins\*" .opencode\plugins\`

OpenCode tự load `.opencode/plugins/` lúc khởi động — không cần khai báo thêm trong `opencode.json` (trừ khi dùng npm plugin).

### Auto-routing (DOC → phase)

Chạy trong `chat.message` **sau** token guard:

| Tình huống | Hành vi |
|------------|---------|
| Tag 1 DOC, đúng `Phase:` | Cho gửi |
| Tag 1 DOC, thiếu `Phase:` | Cho gửi + **chèn** `/minipower-router`, `Phase:`, `@skill` vào prompt |
| Tag DOC khác phase (vd. DOC-07 + DOC-16) | **Chặn** + gợi ý tách prompt |
| `Phase:` sai so với file DOC | **Chặn** |

**SSOT:** [auto-routing.js](../../src/router/hooks/lib/auto-routing.js) (`phase_by_doc` trong [rules.json](../../src/router/hooks/lib/rules.json))

### Decision-log staleness (advisory)

Ở **message đầu tiên mỗi phiên** (mô phỏng SessionStart), plugin gọi `checkDecisionStaleness` từ [hooks/lib/decision-staleness.js](../../src/router/hooks/lib/decision-staleness.js): so ngày DEC (còn hiệu lực) với lịch sử git của DOC trong `Trace:`; DOC đổi sau ngày → chèn cảnh báo vào context. Git thuần qua `child_process`, không cần python. **Không chặn** — lỗi hook không ảnh hưởng luồng. Cùng logic với Cursor/Claude (một file `.js`).

### Read guard (tuỳ chọn)

`tool.execute.before` chặn tool `read` tới `docs/02-baseline/` và `docs/03-modules/_legacy/` (trừ khi prompt có `_legacy` / `MIGRATION` / `migrate`).

Nếu chưa cần: xoá block `tool.execute.before` trong [plugins/minipower.ts](plugins/minipower.ts) bản local (hoặc fork plugin).

## Kiểm tra

1. Khởi động lại OpenCode — plugin load không lỗi (xem log).
2. Dự án mới (chưa có `memory/profile.json`): `/minipower-router Init project HRM` → hook `profile-guard` chặn việc minipower cho đến khi init xong. Lời nhắc profile nằm ở `AGENTS.md` mục 0.
3. Prompt thiếu scope: `/minipower-router` + `đồng bộ requirements` (không @ file) → cảnh báo token guard trong context.
4. `@docs/` hoặc `@docs/03-modules/` không kèm file → bị chặn.
5. Tag DOC-07 + DOC-16 cùng lúc → bị chặn (auto-routing).
6. Agent `read` vào `docs/02-baseline/` → lỗi read guard (nếu bật).

## Bypass

Giống Cursor: prefix `BYPASS` hoặc `@{skill} BYPASS` trong prompt để bỏ qua guard.

## Skill Minipower

Symlink skill pack (nếu chưa có) — xem [README.md](../../README.md). Trong chat: `/minipower-router` hoặc attach `SKILL.md`, kèm `Phase: discovery` (hoặc requirements, architecture, …).
