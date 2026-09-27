# Token guard

[← README](README.md) · [Pipeline](pipeline.md)

Hook chặn **đọc/sửa lan man** trên repo `docs/` (baseline, legacy, cả thư mục, nhiều module một lúc). Lời nhắc cho agent — một slice, tối đa ba file, không đọc baseline — nằm ở `AGENTS.md` dự án, mẫu [SAMPLE-agents.md](../templates/SAMPLE-agents.md) mục 2–3.

Cài hook trên workspace project. Symlink skill **không** tự bật token guard. Xem [Cursor](../../../cli/cursor/README.md) · [Claude](../../../cli/claude/README.md).

## Hooks

Chạy qua Node (`node …/hooks/bin/*.js`) — giống nhau trên Cursor/Claude/OpenCode. Cùng `beforeSubmitPrompt` còn có auto-routing và decision-staleness ([auto-routing.js](../hooks/lib/auto-routing.js), [decision-log.md](decision-log.md)).

| Shim | Sự kiện | Hành vi |
|------|---------|---------|
| `bin/token-guard.js` | `beforeSubmitPrompt` | **Chặn** `@docs/` hoặc `@docs/03-modules/` không kèm file; **cảnh báo** prompt sửa/sync thiếu Phase + Module (hoặc 04-platform) + DOC |
| `bin/token-guard-read.js` | `beforeReadFile` (tuỳ chọn) | **Từ chối** đọc `02-baseline/` (tuyệt đối) và `_legacy/` (trừ khi prompt có migrate / MIGRATION) |

Prompt bị chặn hoặc cảnh báo khi thiếu scope, ví dụ `@docs/`, `@docs/03-modules/`, hoặc "đồng bộ toàn bộ requirements tất cả module" mà không có phase, module và DOC.

Smoke test: [Cursor](../../../cli/cursor/README.md)
