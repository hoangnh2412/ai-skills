# Cài Minipower — OpenCode (instructions + plugins)

Chạy từ **root workspace project docs**. Thay `$MP` bằng path tới pack `minipower/`.

OpenCode dùng:

| Cursor | OpenCode |
|--------|----------|
| `.cursor/rules/*.mdc` | `instructions` trong `opencode.json` + `.opencode/rules/*.md` |
| `.cursor/hooks/*.sh` / `hooks.json` | `.opencode/plugins/*.ts` (hook `chat.message`, `tool.execute.before`) |

**SSOT logic guard:** [install/cursor/hooks/](../cursor/hooks/) (bash/python) — plugin TypeScript port cùng hành vi.

## Rules (instructions)

```bash
# macOS / Linux
MP=/path/to/ai-skills/minipower
mkdir -p .opencode/rules
ln -snf "$MP/agents/token-guard.md" .opencode/rules/minipower-token-guard.md
ln -snf "$MP/install/opencode/rules/minipower-doc-editing.md" .opencode/rules/minipower-doc-editing.md
```

```powershell
# Windows PowerShell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .opencode\rules
New-Item -ItemType SymbolicLink -Force -Path .opencode\rules\minipower-token-guard.md `
  -Target "$MP\agents\token-guard.md"
New-Item -ItemType SymbolicLink -Force -Path .opencode\rules\minipower-doc-editing.md `
  -Target "$MP\install\opencode\rules\minipower-doc-editing.md"
```

Merge [opencode.fragment.json](opencode.fragment.json) vào `opencode.json` (giữ key khác nếu đã có):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".opencode/rules/minipower-token-guard.md",
    ".opencode/rules/minipower-doc-editing.md"
  ]
}
```

## Plugins (hooks)

Plugin gói **một file entry** + thư mục `lib/` (cùng logic với Cursor hooks).

| Hook OpenCode | Tương đương Cursor | Mục đích |
|---------------|-------------------|----------|
| `chat.message` | `beforeSubmitPrompt` → token-guard + auto-routing | Scope, @docs rộng, conflict phase |
| `tool.execute.before` (`read`) | `beforeReadFile` | Chặn `02-baseline/`, `_legacy/` (tuỳ chọn) |

Biến môi trường tuỳ chọn: `MINIPOWER_ROOT` (mặc định `ai-skills/minipower`) — path gợi ý skill trong auto-route.

### Symlink plugin

**macOS / Linux:**

```bash
MP=/path/to/ai-skills/minipower
mkdir -p .opencode/plugins
ln -snf "$MP/install/opencode/plugins/minipower.ts" .opencode/plugins/
ln -snf "$MP/install/opencode/plugins/lib" .opencode/plugins/lib
```

**Windows (PowerShell):**

```powershell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .opencode\plugins
New-Item -ItemType SymbolicLink -Force -Path .opencode\plugins\minipower.ts `
  -Target "$MP\install\opencode\plugins\minipower.ts"
New-Item -ItemType SymbolicLink -Force -Path .opencode\plugins\lib `
  -Target "$MP\install\opencode\plugins\lib"
```

> **Symlink thất bại (Windows):** `Copy-Item -Recurse -Force "$MP\install\opencode\plugins\*" .opencode\plugins\`

OpenCode tự load `.opencode/plugins/` lúc khởi động — không cần khai báo thêm trong `opencode.json` (trừ khi dùng npm plugin).

### Auto-routing (DOC → phase)

Chạy trong `chat.message` **sau** token guard:

| Tình huống | Hành vi |
|------------|---------|
| Tag 1 DOC, đúng `Phase:` | Cho gửi |
| Tag 1 DOC, thiếu `Phase:` | Cho gửi + **chèn** `/minipower`, `Phase:`, `@skill` vào prompt |
| Tag DOC khác phase (vd. DOC-07 + DOC-16) | **Chặn** + gợi ý tách prompt |
| `Phase:` sai so với file DOC | **Chặn** |

**SSOT:** [agents/auto-routing.md](../../agents/auto-routing.md)

### Read guard (tuỳ chọn)

`tool.execute.before` chặn tool `read` tới `docs/02-baseline/` và `docs/03-modules/_legacy/` (trừ khi prompt có `_legacy` / `MIGRATION` / `migrate`).

Nếu chưa cần: xoá block `tool.execute.before` trong [plugins/minipower.ts](plugins/minipower.ts) bản local (hoặc fork plugin).

## Kiểm tra

1. Khởi động lại OpenCode — plugin load không lỗi (xem log).
2. Prompt thiếu scope: `/minipower` + `đồng bộ requirements` (không @ file) → cảnh báo token guard trong context.
3. `@docs/` hoặc `@docs/03-modules/` không kèm file → bị chặn.
4. Tag DOC-07 + DOC-16 cùng lúc → bị chặn (auto-routing).
5. Agent `read` vào `docs/02-baseline/` → lỗi read guard (nếu bật).

## Bypass

Giống Cursor: prefix `BYPASS` hoặc `@{skill} BYPASS` trong prompt để bỏ qua guard.

## Skill Minipower

Symlink skill pack (nếu chưa có) — xem [README.md](../../README.md). Trong chat: `/minipower` hoặc attach `SKILL.md`, kèm `Phase: discovery` (hoặc requirements, architecture, …).
