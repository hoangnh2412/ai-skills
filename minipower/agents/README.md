# Agent guardrails (Minipower)

Markdown thuần — **source of truth** cho Cursor, Claude Code và agent khác. Không chứa hook hay frontmatter tool-specific.

| File | Khi nào áp dụng |
|------|-----------------|
| [token-guard.md](token-guard.md) | Mọi phiên Minipower trên repo `docs/` |
| [doc-editing.md](doc-editing.md) | Khi sửa file `docs/**/*.md` trên project đích |

## Cài trên workspace project docs

Chi tiết lệnh: [install/cursor/README.md](../install/cursor/README.md) · [install/claude/README.md](../install/claude/README.md)

**Cursor:** symlink skill **không** kéo rules/hooks — cài riêng từ `install/cursor/`.

**Claude Code:** symlink `agents/*.md` → `.claude/rules/` hoặc `@import` trong `CLAUDE.md`.
