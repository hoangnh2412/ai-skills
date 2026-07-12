# Cài Minipower — Claude Code (rules)

Chạy từ **root workspace project docs**. Thay `$MP` bằng path tới pack `minipower/`.

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

Merge [settings.fragment.json](settings.fragment.json) vào `.claude/settings.json`:

- **`permissions.deny`** — chặn đọc `02-baseline/` và `_legacy/`.
- **`hooks.SessionStart`** — chạy [decision-log staleness](hooks/minipower-decision-staleness.sh) đầu phiên: cảnh báo DEC lỗi thời (DOC đổi sau ngày quyết định). **Advisory, không chặn.** Sửa `/ABSOLUTE/PATH/TO/...` trong fragment thành path thật tới pack.

Yêu cầu hook: `git` + `python3`. Chạy thủ công bất kỳ lúc nào (mọi IDE):

```bash
MP=/path/to/ai-skills/minipower
bash "$MP/install/claude/hooks/minipower-decision-staleness.sh"   # chạy từ root dự án
```

Kiểm tra: `/memory` — thấy minipower rules.
