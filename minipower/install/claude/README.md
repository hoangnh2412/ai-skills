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

## Permissions (tuỳ chọn)

Merge [settings.fragment.json](settings.fragment.json) vào `.claude/settings.json` để chặn đọc `02-baseline/` và `_legacy/`.

Kiểm tra: `/memory` — thấy minipower rules.
