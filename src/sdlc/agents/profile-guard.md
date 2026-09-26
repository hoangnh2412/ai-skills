# Profile guard — cấu hình dự án + identity máy

Markdown thuần — hook chặn prompt làm việc minipower khi thiếu `memory/profile.json` hợp lệ **hoặc** identity local thiếu / lệch OS user (ADR-033 QĐ-20).
Logic: [hooks/lib/profile-guard.js](../hooks/lib/profile-guard.js) qua shim [hooks/bin/profile-guard.js](../hooks/bin/profile-guard.js).

Template: [templates/TPL-agent-profile.md](../templates/TPL-agent-profile.md).
Workflow init: [SKILL.md](../SKILL.md#cá-nhân-hoá-agent-bắt-buộc).

## SSOT

| File | Git | Vai trò |
|------|-----|---------|
| `memory/profile.json` | Có | Dự án: `project_mode`, 4 provider, `trace_store` (schema **v3**; v1/v2 vẫn đọc được) |
| `memory/profile.user.json` | **Không** | Tên, xưng hô, vai, `os_username` |
| `~/.minipower/user.json` | ngoài repo | Fallback cùng máy; project file thắng |
| `AGENTS.md` | Có | **Không** nhúng tên người |

**Cấm** xưng hô từ `user_name` còn sót trên `profile.json` git.

## Khi nào chặn

Dự án có `memory/memory.md` + `docs/` **và** prompt là **việc minipower** **và** (profile dự án không hợp lệ **hoặc** identity missing/invalid/`os_username` ≠ user OS).

**Không chặn:** prompt thường, `Init project`, `Hoàn tất profile`, `Khai báo tôi là ai`, `BYPASS` đầu dòng.

`mcp.*` lệch mặt provider (vd `tasks_provider=none` nhưng có `mcp.tasks`) → profile v3 **không hợp lệ** → chặn như thiếu profile.

## Agent — khi không có hook

1. Init → hỏi trọn gói; ghi `profile.json` v3 + `profile.user.json`; sinh AGENTS không tên.
2. Đầu phiên: đọc user file; lệch OS → hỏi lại, ghi đè local.

## Thứ tự hook

`beforeSubmitPrompt`: **token-guard** → **auto-routing** → **profile-guard** → **decision-staleness** (advisory).
