# Minipower — Đóng gói Claude Code Plugin (`minipower-dev`)

| | |
|---|---|
| **Ngày** | 2026-07-26 |
| **Trạng thái** | ✅ Đã triển khai (`plugin.json`, `hooks.json` sinh-từ-SSOT, test, doc). **223 test pass**, `gen:check` xanh. Còn: smoke `claude --plugin-dir` do người dùng chạy (interactive) |
| **Phạm vi** | `minipower/` — thêm mặt phân phối (plugin) tại chỗ; **không** dời file, **không** đổi pipeline/skill logic |
| **Nối tiếp** | [SOP NguyenTac_ClaudeCode](../SOPs/NguyenTac_ClaudeCode.md) (Module 07) · các fix conformance 2026-07-26 (skill install, AGENTS/CLAUDE SSOT) |
| **Mục đích** | Cho phép phân phối minipower cho team qua Claude Code plugin (`claude --plugin-dir` / marketplace), giữ nguyên kiến trúc đa công cụ |
| **Ảnh hưởng** | [minipower/install/claude/README.md](../sdlc/install/claude/README.md) — mục "Cài bằng plugin" · `minipower/.claude-plugin/plugin.json` + `hooks.json` (sinh từ SSOT) |

---

## §0. Bối cảnh

Sau đợt rà soát 2026-07-26, minipower **đã tuân thủ** chuẩn Claude Code theo §304 của SOP (skill đúng vị trí + đường cài, memory `CLAUDE.md = @AGENTS.md`, hook đúng chuẩn, permission). Module 07 (Plugins) trong SOP là **khuyến nghị** ("giải pháp hoàn chỉnh cho chuẩn hoá team"), **không** phải ràng buộc đặt-file — thiếu plugin **không** vi phạm chuẩn.

Người quyết định (chủ repo) chọn **làm plugin** để có kênh phân phối 1-bước cho team. ADR này ghi quyết định + trade-off, đúng quy tắc "đổi phạm vi phân phối → ADR trước".

Xác minh cơ chế (Claude Code v2.1.x, nguồn `plugins-reference.md`):
- `plugin.json` cho **custom path** tới component (`skills`, `hooks`, `agents`), tương đối gốc plugin.
- `minipower/skills/` **đã khớp** layout `skills/` mặc định → skill tự nhận, **không dời file**.
- Hook plugin dùng `${CLAUDE_PLUGIN_ROOT}/hooks/bin/*.js` → **tái dùng đúng** implementation hiện có.
- Cài dev: `claude --plugin-dir ./minipower` — **không cần marketplace**.

→ Plugin là **manifest mỏng thêm tại chỗ**, thuộc diện *mở rộng*, không *đổi kiến trúc*.

## §1. Quyết định

Đóng gói `minipower/` thành plugin Claude Code **wrap-in-place**:

1. **Không restructure.** Gốc plugin = `minipower/`; tái dùng `skills/`, `hooks/bin/*.js` sẵn có.
2. **Không build step chồng thêm.** File cần-sinh (`hooks/hooks.json`) sinh qua **`npm run gen`** hiện có + `gen:check` — cùng kỷ luật rules-as-data, không thêm toolchain.
3. **Không phân mảnh nguồn chung.** `agents/*.md` (guardrail, không phải subagent) **không** bị đăng ký làm subagent; cấu hình plugin.json để bỏ scan `agents/`.
4. **SSOT cho hook wiring.** `settings.fragment.json` vẫn là nguồn; `hooks/hooks.json` (bản plugin) **sinh tự động** từ nó bằng cách thay placeholder path → `${CLAUDE_PLUGIN_ROOT}`. `gen:check` fail nếu lệch.

## §2. Trade-off chấp nhận

| Đánh đổi | Chi tiết | Giảm nhẹ |
|----------|----------|----------|
| **Namespace slash** | Skill plugin gọi `/minipower:<skill>` (namespaced), không phải `/minipower` gọn | Project-skill (`.claude/skills/minipower`) vẫn giữ `/minipower` cho ai cài kiểu cũ; auto-invoke theo description vẫn chạy |
| **Hook 2 mặt** | Wiring tồn tại ở `settings.fragment.json` **và** `hooks/hooks.json` | **Sinh 1 chiều từ SSOT** + `gen:check` + test → không dựa kỷ luật tay |
| **Permission không pluginize** | `permissions.deny` (chặn đọc baseline/legacy) **không** đi trong plugin | Vẫn cài qua `settings.json` (install.mjs); doc ghi rõ plugin **không** thay thế bước này |
| **Router entry** | `minipower/SKILL.md` ở gốc plugin **không** được nhận làm skill (skill chỉ dưới `skills/`) | Ghi rõ trong doc; router chỉ có ở đường project-skill. (Chưa expose router qua plugin ở vòng này) |

## §3. Phương án bị loại

- **A — Restructure** (dời `skills/`,`hooks/`,`agents/` sang layout plugin thuần): phá path Cursor/OpenCode, trái "đa công cụ dùng chung". ❌
- **B — Symlink thuần** (không manifest, symlink component ngoài pack): symlink ngoài pack bị Claude Code **skip** (bảo mật) với `--plugin-dir`. ❌
- **C — Chọn: manifest + custom path + hooks.json sinh-từ-SSOT.** ✅

## §4. Việc triển khai

1. `minipower/.claude-plugin/plugin.json` — manifest (name/version/description) + bỏ scan `agents/` + trỏ hooks.
2. `minipower/hooks/hooks.json` — **generated**; wiring qua `${CLAUDE_PLUGIN_ROOT}`, nguồn = `settings.fragment.json`.
3. Mở rộng `gen-agents-doc.js` (hoặc script gen kèm) + `gen:check` + **test** cho hooks.json.
4. Doc cài plugin (`--plugin-dir` / marketplace) trong `install/claude/README.md`; ghi rõ permission vẫn qua settings.

## §5. Xác minh (định nghĩa xong)

- `npm run gen` → `npm test` → `npm run gen:check` **cả ba xanh**.
- `hooks/hooks.json` khớp `settings.fragment.json` (chỉ khác placeholder path) — có test khẳng định.
- Smoke: `claude --plugin-dir ./minipower` nạp được plugin, thấy skill namespaced.

## §6. Rủi ro & hệ quả

- Người dùng cài **cả** project-skill lẫn plugin → skill xuất hiện 2 tên (`/minipower` và `/minipower:*`). Doc phải nói rõ chọn **một** kênh.
- Tăng bề mặt bảo trì: mọi thay đổi hook wiring phải chạy `gen` (đã có `gen:check` chặn quên).
- Không kéo repo về "agent tự chạy" — plugin chỉ là đóng gói phân phối, triết lý §0/gated-fanout **không đổi**.
