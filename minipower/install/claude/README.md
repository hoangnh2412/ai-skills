# Cài Minipower — Claude Code (skill + rules + hooks)

Chạy từ **root workspace project docs**. Thay `$MP` bằng path tới pack `minipower/`.

## Đăng ký skill (để gõ `/minipower`)

Claude Code nhận skill tại **`.claude/skills/{tên}/SKILL.md`**. Symlink cả pack `minipower/` vào — `SKILL.md` ở gốc pack chính là router.

```bash
MP=/path/to/ai-skills/minipower
mkdir -p .claude/skills
ln -snf "$MP" .claude/skills/minipower

# Kiểm tra
test -f .claude/skills/minipower/SKILL.md && echo "OK"
```

```powershell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .claude\skills
New-Item -ItemType SymbolicLink -Force -Path .claude\skills\minipower -Target $MP
```

> Skill con trong `skills/` **không** hiện thành `/` riêng — auto-routing tự chọn phase theo intent (ADR Q6), không phải lỗi. Gọi phase con qua `Phase:` hoặc `@skills/{phase}/SKILL.md`.

## Cài bằng plugin (tùy chọn — gộp skill + hook)

Thay cho symlink skill + wire hook thủ công, có thể nạp cả pack như **plugin** ([ADR 2026-07-26](../../../ADRs/2026-07-26-minipower-claude-code-plugin.md)). Gốc plugin = `minipower/`, manifest ở `.claude-plugin/plugin.json`.

```bash
# Dev/local — không cần marketplace
claude --plugin-dir /path/to/ai-skills/minipower
```

- **Skill namespaced:** gọi `/minipower:ba-discovery`, `/minipower:doc-review`, … (không phải `/minipower` gọn như đường project-skill ở trên).
- **Hook tự nạp** từ `hooks/hooks.json` (sinh từ `settings.fragment.json` qua `npm run gen`). **KHÔNG** chạy `install.mjs` khi đã dùng plugin — nếu không hook chạy **hai lần** (settings + plugin).
- **`permissions.deny` KHÔNG đi trong plugin.** Nếu dùng plugin, tự thêm 2 dòng deny vào `.claude/settings.json`:

  ```json
  { "permissions": { "deny": ["Read(docs/02-baseline/**)", "Read(docs/03-modules/_legacy/**)"] } }
  ```

> Chọn **một** kênh: **project-skill + install.mjs** (mục dưới) *hoặc* **plugin** — đừng dùng cả hai, tránh trùng skill/hook.

## Symlink rules (khuyên dùng)

```bash
MP=/path/to/ai-skills/minipower
mkdir -p .claude/rules
ln -snf "$MP/agents/token-guard.md" .claude/rules/minipower-token-guard.md
ln -snf "$MP/install/claude/rules/minipower-doc-editing.md" .claude/rules/minipower-doc-editing.md
```

```powershell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .claude\rules
New-Item -ItemType SymbolicLink -Force -Path .claude\rules\minipower-token-guard.md `
  -Target "$MP\agents\token-guard.md"
New-Item -ItemType SymbolicLink -Force -Path .claude\rules\minipower-doc-editing.md `
  -Target "$MP\install\claude\rules\minipower-doc-editing.md"
```

## Hoặc import trong `CLAUDE.md`

```markdown
@path/to/ai-skills/minipower/agents/token-guard.md
@path/to/ai-skills/minipower/agents/doc-editing.md
```

## Permissions + hooks (tuỳ chọn)

**Khuyên dùng — script tự cài + verify** (thay find & replace tay, ADR R5). Đứng ở **root project docs** (nơi có/định tạo `.claude/settings.json`):

```bash
MP=/path/to/ai-skills/minipower
node "$MP/install/claude/install.mjs"          # resolve path + merge + smoke-test 4 shim
# node "$MP/install/claude/install.mjs" --check  # chỉ verify shim, không ghi
# node "$MP/install/claude/install.mjs" --print  # in JSON đã resolve ra stdout
```

Script tự suy path pack (không cần gõ), **merge an toàn**: giữ nguyên hook/permission khác của bạn, idempotent (chạy lại không nhân đôi), backup `.claude/settings.json.bak` trước khi ghi đè, và **verify** bằng cách chạy thật 4 shim dưới `node` hiện tại. Yêu cầu **Node ≥ 18**.

Fragment gồm:

- **`permissions.deny`** — chặn đọc `02-baseline/` và `_legacy/`.
- **`hooks.UserPromptSubmit`** — token-guard → auto-routing → decision-staleness (cùng logic Cursor).
- **`hooks.PreToolUse`** (`Read`) — read guard baseline/_legacy.

> Cài tay: vẫn merge [settings.fragment.json](settings.fragment.json) rồi thay mọi `/ABSOLUTE/PATH/TO/ai-skills/minipower` bằng path thật. Script ở trên làm đúng việc đó, có kiểm tra.

Tất cả gọi `node "…/minipower/hooks/bin/*.js"` — **một implementation dùng chung** với Cursor/OpenCode ([hooks/lib/*.js](../../hooks/)). Yêu cầu: **Node ≥ 18** + `git` (cho staleness). **Không còn cần `python3`**; bản `.sh`/`.ps1` cũ đã bỏ.

> Trước đây chỉ `SessionStart` (staleness) được wire, 2 prompt-guard là file chết (ADR §3.5). Nay wire đủ; staleness chuyển sang keyword-gated trên `UserPromptSubmit` như Cursor.

Chạy staleness thủ công bất kỳ lúc nào:

```bash
MP=/path/to/ai-skills/minipower
echo '{"prompt":"đánh giá lại quyết định"}' | node "$MP/hooks/bin/decision-staleness.js"   # từ root dự án
```

Kiểm tra: `/memory` — thấy minipower rules.
