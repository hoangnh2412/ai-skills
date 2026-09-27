# Agent guardrails (Minipower)

Markdown thuần — **source of truth** cho Cursor, Claude Code và agent khác. Không chứa hook hay frontmatter tool-specific.

| File | Khi nào áp dụng |
|------|-----------------|
| [token-guard.md](token-guard.md) | Mọi phiên Minipower trên repo `docs/` |
| [profile-guard.md](profile-guard.md) | `profile.json` v3 + identity local; thiếu mode / lệch provider |
| [approval-gate.md](approval-gate.md) | Phê duyệt mềm — người ký, máy không chặn verdict |
| [doc-editing.md](doc-editing.md) | Khi sửa file `docs/**/*.md` trên project đích |
| [auto-routing.md](auto-routing.md) | Khi `@` file DOC — map phase, xử lý conflict (agent + hook) |
| [project-state.md](project-state.md) | Suy giai đoạn dự án → phase → vai trò (lăng kính hỗ trợ) |
| [context-load.md](context-load.md) | Khi tiền đề đủ — nạp chuỗi ngữ cảnh trước khi đề xuất |
| [lark-work-assistant.md](lark-work-assistant.md) | Wiki / Base / Drive Lark — **không** SOP task (`minipower-tasks-lark`) |

## Cài trên workspace project docs

Chi tiết lệnh: [install/cursor/README.md](../../../cli/cursor/README.md) · [install/claude/README.md](../../../cli/claude/README.md)

**Cursor:** symlink skill **không** kéo rules/hooks — cài riêng từ `install/cursor/`.

**Claude Code:** symlink `agents/*.md` → `.claude/rules/` hoặc `@import` trong `CLAUDE.md`.
