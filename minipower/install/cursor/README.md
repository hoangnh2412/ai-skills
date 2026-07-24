# Cài Minipower — Cursor (rules + hooks)

Chạy từ **root workspace project docs**. Thay `$MP` bằng path tới pack `minipower/`.

## Rules

```powershell
# Windows PowerShell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .cursor\rules
New-Item -ItemType SymbolicLink -Force -Path .cursor\rules\minipower-token-guard.mdc `
  -Target "$MP\install\cursor\rules\minipower-token-guard.mdc"
New-Item -ItemType SymbolicLink -Force -Path .cursor\rules\minipower-doc-editing.mdc `
  -Target "$MP\install\cursor\rules\minipower-doc-editing.mdc"
```

```bash
# macOS / Linux
MP=/path/to/ai-skills/minipower
mkdir -p .cursor/rules
ln -snf "$MP/install/cursor/rules/minipower-token-guard.mdc" .cursor/rules/
ln -snf "$MP/install/cursor/rules/minipower-doc-editing.mdc" .cursor/rules/
ln -snf "$MP/install/cursor/rules/minipower-profile.mdc" .cursor/rules/
```

## Hooks

**Một implementation Node duy nhất** cho cả 3 nền tảng (Cursor/Claude/OpenCode). Logic ở [`hooks/lib/*.js`](../../hooks/), shim CLI ở [`hooks/bin/*.js`](../../hooks/bin/). Yêu cầu **Node ≥ 18** trên PATH — không còn cần `python3`, không còn bản `.ps1`/`.sh` riêng.

> Vì sao đổi: 4 bản cài đặt cũ (`.py`/`.ps1`/`.sh`/`.ts`) đã lệch nhau thành nhiều bug thật (regex có dấu/không dấu, path `/` vs `\`, `DOC-0[0-9]` bỏ sót DOC-10…18). Gộp về một bản Node + golden test (`node --test`) + CI 3 OS. Xem `ADRs/`.

| Hook (`beforeSubmitPrompt`) | Shim | Mục đích |
|------|------|----------|
| Token guard | `bin/token-guard.js` | Thiếu scope, `@docs/` quá rộng, chặn baseline/_legacy |
| Auto-routing DOC → phase | `bin/auto-routing.js` | Chèn `Phase:` / chặn conflict khi tag nhiều DOC |
| Profile guard | `bin/profile-guard.js` | Chặn việc minipower khi thiếu `memory/profile.json` |
| Decision-log staleness | `bin/decision-staleness.js` | Advisory (không chặn), keyword-gated |
| Read guard (`beforeReadFile`) | `bin/token-guard-read.js` | Tuỳ chọn — chặn Read `02-baseline/`, `_legacy/` |

**SSOT logic agent:** [agents/auto-routing.md](../../agents/auto-routing.md).

### Auto-routing (DOC → phase)

| Tình huống | Hành vi |
|------------|---------|
| Tag 1 DOC, đúng `Phase:` | Cho gửi |
| Tag 1 DOC, thiếu `Phase:` | Cho gửi + **chèn** `/minipower`, `Phase:`, `@skill` (`updated_input` + `additional_context`) |
| Tag DOC khác phase (vd. DOC-07 + DOC-16) | **Chặn** + gợi ý tách prompt |
| `Phase:` sai so với file DOC | **Chặn** |

Biến môi trường tuỳ chọn: `MINIPOWER_ROOT` (mặc định `ai-skills/minipower`) — path gợi ý skill trong message hook.

### Decision-log staleness (advisory)

**Keyword-gated** — chỉ quét khi prompt bàn về quyết định (`decision|deliberation|premise|quyết định|đánh giá lại|baseline|supersede|stale|lỗi thời`). So ngày DEC (còn hiệu lực) với lịch sử git của DOC trong `Trace:`; DOC đổi sau ngày → cảnh báo (`additional_context`). **Không chặn.** Git thuần, không cần python.

### Cài đặt

Pack đã được symlink tại `.cursor/skills/minipower/` (xem [README chính](../../README.md)) → bin + lib đi kèm sẵn, **không cần symlink script riêng**. Chỉ cần merge một fragment.

Merge [hooks.fragment.json](hooks/hooks.fragment.json) vào `.cursor/hooks.json` (giữ hook khác nếu đã có). Fragment gọi `node .cursor/skills/minipower/hooks/bin/*.js` — giống hệt trên Windows/macOS/Linux.

> Nếu pack **không** nằm ở `.cursor/skills/minipower/` (vd. Claude/khác), sửa path trong fragment thành đường dẫn tới `…/minipower/hooks/bin/`.

### Kiểm tra

1. **Settings → Hooks** — hook hiển thị, không lỗi path.
2. Prompt thiếu scope: `/minipower` + `đồng bộ requirements` (không @ file) → cảnh báo token guard.
3. `@docs/` hoặc `@docs/03-modules/` không kèm file → bị chặn.
4. `@` DOC-07 + DOC-16 cùng lúc → bị chặn (auto-routing).
5. Nhắc `DOC-16` + `DOC-04` trong text → bị chặn (delivery vs requirements).

`beforeReadFile` là **tuỳ chọn** — xoá block tương ứng trong `hooks.json` nếu chưa cần.

### Smoke test (mọi OS, giống hệt nhau)

```bash
MP=/path/to/ai-skills/minipower

echo '{"prompt":"@docs/03-modules/"}' | node "$MP/hooks/bin/token-guard.js"
# Kỳ vọng: exit 2, {"continue":false,...}

echo '{"prompt":"Phase: requirements — Module: billing, DOC-06"}' | node "$MP/hooks/bin/token-guard.js"
# Kỳ vọng: exit 0, {"continue":true}

echo '{"prompt":"review DOC-06 và DOC-08"}' | node "$MP/hooks/bin/auto-routing.js"
# Kỳ vọng: exit 2, continue:false (requirements vs architecture)
```

Chạy toàn bộ golden test: `cd "$MP/hooks" && node --test` (169 case, không cần cài gì).
