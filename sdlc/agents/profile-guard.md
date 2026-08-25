# Profile guard — cá nhân hoá trước khi làm việc Minipower

Markdown thuần — hook chặn prompt làm việc minipower khi dự án chưa có `memory/profile.json` hợp lệ.
Logic: [hooks/lib/profile-guard.js](../hooks/lib/profile-guard.js) qua shim [hooks/bin/profile-guard.js](../hooks/bin/profile-guard.js).

Template sinh `AGENTS.md` / `CLAUDE.md`: [templates/TPL-agent-profile.md](../templates/TPL-agent-profile.md).
Workflow init: [SKILL.md](../SKILL.md#cá-nhân-hoá-agent-bắt-buộc).

## SSOT

| File | Vai trò |
|------|---------|
| `memory/profile.json` | SSOT máy đọc — hook validate |
| `AGENTS.md` | Cursor inject mỗi turn |
| `CLAUDE.md` | Claude Code inject + `@import` pack rules |

## Khi nào chặn

Dự án có `memory/memory.md` + `docs/` **và** profile chưa đủ **và** prompt là **việc minipower** (Phase, DOC, `/minipower`, `@docs`, attachment `docs/` hoặc `memory/`).

**Không chặn:** prompt thường (user trả lời onboarding), `Init project`, `Hoàn tất profile`, `BYPASS` đầu dòng.

## Agent — khi không có hook

1. Init / reconfigure → hỏi 5 câu, ghi `profile.json`, sinh `AGENTS.md` + `CLAUDE.md`.
2. Trước mọi việc DOC → kiểm tra profile đã có chưa.

## Thứ tự hook

`beforeSubmitPrompt`: **token-guard** → **auto-routing** → **profile-guard** → **decision-staleness** (advisory).
