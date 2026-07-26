# Minipower — Cursor Plugin (`.cursor-plugin`): đánh giá & quyết định

| | |
|---|---|
| **Ngày** | 2026-07-26 |
| **Trạng thái** | ⏸️ **Chấp nhận: HOÃN** (người chốt 2026-07-26). Giữ adapter Cursor cũ; mở lại khi đủ điều kiện tái xét §4 |
| **Phạm vi** | `minipower/` — có nên đóng plugin Cursor song song [plugin Claude Code](2026-07-26-minipower-claude-code-plugin.md) không |
| **Nối tiếp** | [ADR plugin Claude Code 2026-07-26](2026-07-26-minipower-claude-code-plugin.md) · adapter Cursor hiện có `minipower/install/cursor/` |
| **Mục đích** | Ghi lại cơ chế plugin Cursor đã xác minh + ma sát, và quyết định làm/hoãn |

---

## §0. Bối cảnh

Cursor **3.9 (22/06/2026)** ra hệ plugin riêng: manifest `.cursor-plugin/plugin.json`, bundle cùng loại primitive như Claude Code (skills, rules, hooks, agents, commands, MCP), quản lý ở trang *Customize* theo scope user/team/workspace.

minipower **đã có adapter Cursor** đang chạy tốt tại `install/cursor/`: symlink skill (`.cursor/skills/minipower`) + rules `.mdc` + `hooks.fragment.json` (event `beforeSubmitPrompt`/`beforeReadFile`).

Câu hỏi: sau khi có plugin Claude Code, có nên đóng **plugin Cursor** song song để trải nghiệm "1 manifest" trên cả hai công cụ?

## §1. Cơ chế đã xác minh (nguồn: cursor.com/docs/plugins/building)

- **Manifest:** `.cursor-plugin/plugin.json`; chỉ `name` bắt buộc.
- **Component mặc định:** `skills/` (dir có `SKILL.md`), `rules/` (`.md/.mdc/.markdown`), `agents/` (mọi `.md…` → subagent), `commands/`, `hooks/hooks.json`, `mcp.json`.
- **Custom path:** field `skills/rules/agents/hooks/…` nhận path tương đối, **thay** scan mặc định. **Cấm `..` và path tuyệt đối** → mọi thứ phải nằm trong cây thư mục gốc plugin.
- **Hooks schema:** `{ "version": 1, "hooks": { "<event>": [ { "command", "matcher?", "timeout?" } ] } }`; event **camelCase khác Claude** (`beforeSubmitPrompt`, `beforeReadFile`, `preToolUse`…).

## §2. Ma sát & ẩn số (lý do khuyến nghị hoãn)

| # | Vấn đề | Hệ quả |
|---|--------|--------|
| M1 | **Không có `--plugin-dir` local** trong docs. Phân phối = **submit `cursor.com/marketplace/publish`, Cursor team review**, cần **repo Git public** | Không deploy riêng/nội bộ/local dễ như Claude Code (`--plugin-dir`). Payoff "1 lệnh cài" phụ thuộc bên thứ ba duyệt |
| M2 | **Không có biến plugin-root** kiểu `${CLAUDE_PLUGIN_ROOT}`; CWD của `command` hook **không rõ** | Không wire chắc `node hooks/bin/*.js` trong plugin. Adapter cũ dựa vào path symlink `.cursor/skills/minipower/…` — **không** áp dụng cho plugin marketplace |
| M3 | `hooks/hooks.json` mặc định của Cursor **trùng đúng file** đã tạo cho plugin Claude Code (khác schema/event) | Phải đặt **custom hooks path** riêng cho từng plugin để không đọc nhầm |
| M4 | **Namespace gọi skill** (bare `/minipower` vs `/minipower:skill`) **chưa tài liệu hoá** | Chưa biết UX cuối, khó cam kết |
| M5 | `agents/*.md` (guardrail) sẽ bị scan làm subagent | Phải `agents: []` để chặn (giống Claude) — cơ chế empty-array **chưa được docs xác nhận rõ** cho Cursor |

## §3. Phương án

- **A — Đóng plugin Cursor ngay.** Chặn bởi M2 (không wire chắc hook) + phụ thuộc marketplace review (M1). Rủi ro làm ra thứ không chạy/không giao được. ❌
- **B — HOÃN, giữ adapter cũ.** Adapter `install/cursor/` **đang chạy tốt** cho local/team **không cần marketplace**. Không tăng mặt bảo trì khi payoff chưa rõ. ✅ **Khuyến nghị**
- **C — Làm một phần (manifest + skills/rules, bỏ hook).** Vẫn cần marketplace để phân phối (M1), payoff thấp, lại thêm file. ❌

## §4. Quyết định (đã chốt 2026-07-26)

**Chọn B — HOÃN.** Lý do khớp triết lý repo: *"co lại trước khi mở rộng; mọi thứ mới phải có SSOT + payoff rõ, không thêm mặt bảo trì tuỳ tiện"*. Adapter Cursor hiện tại đã phủ nhu cầu local/team.

**Điều kiện tái xét (đủ 1 là mở lại ADR này):**
1. Team **thực sự** muốn phân phối minipower qua **Cursor marketplace** (chấp nhận repo public + review).
2. Cursor **tài liệu hoá** local-dev install + biến plugin-root (giải M1/M2).

## §5. Nếu sau này làm — phác thảo việc (chưa thực thi)

1. `minipower/.cursor-plugin/plugin.json` — `name`, `agents: []`, `hooks: "./hooks/hooks.cursor.json"` (tránh trùng M3), `rules: "./install/cursor/rules/"`, skills mặc định `skills/`.
2. `hooks/hooks.cursor.json` — **sinh từ SSOT** `install/cursor/hooks/hooks.fragment.json` (đã đúng event Cursor), sau khi giải M2 (path command hợp lệ trong plugin).
3. Xác minh M4 (namespace) + M5 (agents empty-array) trên Cursor thật.
4. Test đồng bộ + doc install, như đã làm cho Claude Code.

## §6. Hệ quả

- **Bây giờ:** không thêm gì cho Cursor; adapter cũ vẫn là đường chính thức. Zero mặt bảo trì mới.
- Plugin Claude Code (ADR song song) **không bị ảnh hưởng**.
- Triết lý §0 (gatekeeper + fan-out) không đổi.
