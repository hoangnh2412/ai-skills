# Minipower — Cursor Plugin (`.cursor-plugin`): đánh giá & quyết định

| | |
|---|---|
| **Ngày** | 2026-07-26 |
| **Trạng thái** | 🔁 **MỞ LẠI 2026-08-25** — docs Cursor đã có local-dev install (giải một nửa M1) ⇒ điều kiện tái xét §4.2 đạt vế đầu; chủ repo quyết làm **plugin đầy đủ skill + rule + hook** theo phương án §7. Quyết định HOÃN 2026-07-26 hết hiệu lực |
| **Phạm vi** | `minipower/` — có nên đóng plugin Cursor song song [plugin Claude Code](ADR-011-2026-07-26-minipower-claude-code-plugin.md) không |
| **Nối tiếp** | [ADR plugin Claude Code 2026-07-26](ADR-011-2026-07-26-minipower-claude-code-plugin.md) · adapter Cursor hiện có `minipower/install/cursor/` |
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

---

## §7. Điều chỉnh 2026-08-25 — MỞ LẠI: plugin Cursor đầy đủ skill + rule + hook

### §7a. Vì sao mở lại (đối chiếu docs cursor.com/docs/plugins + reference, đọc 2026-08-25)

| # | Trạng thái 2026-07-26 | Trạng thái 2026-08-25 |
|---|---|---|
| M1 | Không có local install — chỉ marketplace (repo public + review) | **Giải một nửa:** local-dev install chính thức — đặt/symlink plugin vào `~/.cursor/plugins/local/<name>/` + Reload Window, **không cần marketplace**. Phân phối public vẫn qua marketplace; enterprise có thêm team marketplaces |
| M2 | Không có biến plugin-root, CWD hook không rõ | **Vẫn treo** — docs không có `${CURSOR_PLUGIN_ROOT}`; ví dụ hook dùng path tương đối (`"./scripts/…"`) nhưng **không nói CWD**. Chuyển từ "chờ docs" sang **tự xác minh bằng thực nghiệm** (V1, §7c) — local install đã cho phép test thật |
| M3 | Trùng `hooks/hooks.json` với plugin Claude | Vẫn đúng — custom hooks path là **bắt buộc** |
| M4 | Namespace gọi skill chưa tài liệu hoá | Vẫn chưa — xác minh thực nghiệm (V2) |
| M5 | `agents: []` chặn scan chưa xác nhận | Vẫn chưa — xác minh thực nghiệm (V3) |

Điều kiện tái xét §4.2 mới đạt **vế đầu** (local-dev install ✅, biến plugin-root ❌). Cái mở khoá thực sự: **có đường test thật** — 3 ẩn số còn lại (M2/M4/M5) không cần chờ docs nữa, tự đóng bằng thực nghiệm như đã smoke plugin Claude (ADR-011).

### §7b. Quyết định

**Làm plugin Cursor đầy đủ 3 component: skills + rules + hooks** (thay phương án C "bỏ hook" đã loại ở §3). Nguyên tắc giữ nguyên từ ADR-011:

- **Manifest mỏng thêm tại chỗ** — gốc plugin = `sdlc/`, manifest `.cursor-plugin/plugin.json`. **Không dời file**, không đổi pipeline/skill logic.
- **Hooks sinh-từ-SSOT** — `hooks/hooks.cursor.json` **generated** từ `install/cursor/hooks/hooks.fragment.json` (đã đúng event Cursor: `beforeSubmitPrompt` ×5 + `beforeReadFile` baseline-guard), chỉ viết lại path command theo kết quả V1. Vào vòng `gen → test → gen:check`.
- **Ba kênh cùng bộ guard** (QĐ-4 ADR-020) — hooks.cursor.json vào **test parity** cùng settings.fragment.json (Claude) + hooks.json (plugin Claude): cùng 6 hook, chỉ khác event-name/path.
- **Chọn một kênh** — người dùng dùng plugin thì **không** chạy adapter symlink cũ (hook chạy hai lần — cùng rủi ro §6 ADR-011). Adapter `install/cursor/` giữ nguyên làm đường thay thế cho ai chưa dùng plugin.

### §7c. Việc triển khai (thứ tự bắt buộc — V trước, W sau)

**Vòng V — thực nghiệm đóng ẩn số** (plugin nháp tối thiểu, symlink vào `~/.cursor/plugins/local/`, chủ repo chạy Cursor thật):
1. **V1 (M2 — chặn W2):** hook `echo`/`node -e` in `process.cwd()` + `__dirname` → xác định CWD và cách trỏ `node hooks/bin/*.js` chắc chắn (path tương đối gốc plugin? workspace? cần wrapper?).
2. **V2 (M4):** skill nháp → xem tên gọi thực tế (`/minipower:skill` hay bare) → viết vào doc install.
3. **V3 (M5):** `agents: []` trong manifest → xác nhận `agents/*.md` guardrail **không** bị scan làm subagent; nếu empty-array không được hỗ trợ → chuyển `agents` sang custom path trỏ folder rỗng.

**Vòng W — triển khai thật** (sau khi V1–V3 có kết quả):
4. **W1:** `sdlc/.cursor-plugin/plugin.json` — `name: "minipower"`, `agents` theo V3, `hooks: "./hooks/hooks.cursor.json"` (tránh M3), `rules: "./install/cursor/rules/"` (3 file `.mdc` hiện có), skills mặc định `skills/`.
5. **W2:** generator sinh `hooks/hooks.cursor.json` từ fragment SSOT (path command theo V1) + test khớp fragment + đưa vào `gen:check` + test parity 3 kênh. Đụng `lib`/gen ⇒ vòng bắt buộc `gen → test → gen:check` cả ba xanh.
6. **W3:** doc `install/cursor/README.md` — thêm mục "Cài bằng plugin (local)": symlink `~/.cursor/plugins/local/minipower` → `sdlc/`, Reload Window; ghi rõ **chọn một kênh** (plugin XOR adapter symlink); ghi kết quả M4 (tên gọi skill).
7. **W4:** smoke của chủ repo trên Cursor thật (định nghĩa xong §7d) + cập nhật `ADRs/README.md`.

### §7d. Xác minh (định nghĩa xong)

- `npm run gen` → `npm test` → `npm run gen:check` cả ba xanh; parity 3 kênh có test canh.
- Smoke Cursor: plugin local nạp — skill thấy được và gọi được, 3 rule `.mdc` hiện ở Customize, **hook bắn thật** (gõ prompt thấy output token-guard/auto-routing; Read file baseline thấy baseline-guard chặn).
- `agents/*.md` không xuất hiện thành subagent.
- `npm run link:check` 0 gãy mới.

### §7e. Rủi ro còn lại

- **V1 ra kết quả xấu** (CWD không ổn định, không có cách trỏ path tin được): hooks trong plugin **không khả thi** → rơi về plugin skills + rules, hook tiếp tục đi đường adapter symlink; ghi lại tại đây và giữ điều kiện chờ `${CURSOR_PLUGIN_ROOT}`.
- Cursor local plugin là **per-machine persistent** (khác `--plugin-dir` per-session của Claude) — dev sửa hook xong phải Reload Window; ghi vào doc.
- Docs Cursor đổi nhanh (3.9 mới ra 06/2026) — mỗi kết quả V ghi kèm ngày + version Cursor đã test.
