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
```

## Hooks

Mỗi hook có **hai bản** cùng logic:

| Hook | Windows | macOS / Linux | Mục đích |
|------|---------|----------------|----------|
| Kiểm tra scope prompt | `minipower-token-guard.ps1` | `minipower-token-guard.sh` | Token guard — thiếu scope, `@docs/` quá rộng |
| **Auto-routing DOC → phase** | `minipower-auto-routing.ps1` | `minipower-auto-routing.sh` + `minipower-auto-routing.py` | Conflict phase khi tag nhiều DOC |
| **Decision-log staleness** | `minipower-decision-staleness.ps1` | `minipower-decision-staleness.sh` + `minipower-decision-staleness.py` | Advisory (không chặn) — DEC lỗi thời; keyword-gated |
| Giới hạn đọc baseline/_legacy | `minipower-token-guard-read.ps1` | `minipower-token-guard-read.sh` | Tuỳ chọn — chặn Read path nặng (cùng rule token guard) |

Bản `.sh` cần **python3** (stdlib `json`) và quyền thực thi. Bản `.ps1` dùng message ASCII (tương thích PowerShell 5.1); `.sh` giữ đầy đủ tiếng Việt.

**SSOT logic agent:** [agents/auto-routing.md](../../agents/auto-routing.md) · **Hướng dẫn dự án:** [`auto-routing.md`](../../../auto-routing.md) *(root workspace docs, nếu có)*.

### Auto-routing (DOC → phase)

Chạy **sau** `minipower-token-guard` trong cùng `beforeSubmitPrompt`:

| Tình huống | Hành vi |
|------------|---------|
| Tag 1 DOC, đúng `Phase:` | Cho gửi |
| Tag 1 DOC, thiếu `Phase:` | Cho gửi + **chèn** `/minipower`, `Phase:`, `@skill` vào prompt (`updated_input` + `additional_context`) |
| Tag DOC khác phase (vd. DOC-07 + DOC-16) | **Chặn** + gợi ý tách prompt |
| `Phase:` sai so với file DOC | **Chặn** |

Biến môi trường tuỳ chọn: `MINIPOWER_ROOT` (mặc định `ai-skills/minipower`) — path gợi ý skill trong message hook.

**Chèn context sau auto-route (1 phase, thiếu `Phase:`):** hook trả `updated_input.prompt` (prompt đầy đủ có `/minipower`, `Phase:`, `@skill`) và `additional_context`. Cursor 3.6+ có thể chỉ áp dụng một trong hai — nếu transcript vẫn prompt gốc, kiểm tra Hooks log có `additional_context`; feature đầy đủ đang được Cursor mở rộng ([forum](https://forum.cursor.com/t/add-additional-context-to-beforesubmitprompt-hook-output/157231)).

### Decision-log staleness (advisory)

Chạy **sau** auto-routing trong `beforeSubmitPrompt`, **keyword-gated** — chỉ quét khi prompt bàn về quyết định (`decision|deliberation|premise|quyết định|đánh giá lại|baseline|supersede|stale|lỗi thời`). So ngày DEC (còn hiệu lực) với lịch sử git của DOC trong `Trace:`; DOC đổi sau ngày → cảnh báo (stderr + `additional_context`). **Không chặn.** Cursor không có SessionStart nên gate theo keyword đúng thời điểm đang ra/soát quyết định.

- SSOT scanner: `minipower-decision-staleness.py` (dùng chung Claude/OpenCode). Yêu cầu `git` + `python3`.
- Chạy tay mọi lúc: `MP_PROJECT_ROOT="$PWD" python3 .cursor/hooks/minipower-decision-staleness.py`.

### 1. Symlink scripts

**Windows (PowerShell):**

```powershell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .cursor\hooks
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\minipower-token-guard.ps1 `
  -Target "$MP\install\cursor\hooks\minipower-token-guard.ps1"
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\minipower-auto-routing.ps1 `
  -Target "$MP\install\cursor\hooks\minipower-auto-routing.ps1"
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\minipower-token-guard-read.ps1 `
  -Target "$MP\install\cursor\hooks\minipower-token-guard-read.ps1"
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\minipower-decision-staleness.ps1 `
  -Target "$MP\install\cursor\hooks\minipower-decision-staleness.ps1"
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\minipower-decision-staleness.py `
  -Target "$MP\install\cursor\hooks\minipower-decision-staleness.py"
```

> **Symlink thất bại (Windows, thiếu quyền Admin):** `Copy-Item -Force "$MP\install\cursor\hooks\*.ps1" .cursor\hooks\`

**macOS / Linux:**

```bash
MP=/path/to/ai-skills/minipower
mkdir -p .cursor/hooks
ln -snf "$MP/install/cursor/hooks/minipower-token-guard.sh" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/minipower-auto-routing.sh" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/minipower-auto-routing.py" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/minipower-token-guard-read.sh" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/minipower-decision-staleness.sh" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/minipower-decision-staleness.py" .cursor/hooks/
chmod +x .cursor/hooks/minipower-token-guard.sh .cursor/hooks/minipower-auto-routing.sh .cursor/hooks/minipower-token-guard-read.sh .cursor/hooks/minipower-decision-staleness.sh
```

### 2. Merge `hooks.json`

**Windows:** fragment dùng `powershell -NoProfile -ExecutionPolicy Bypass -File …` — Cursor gọi `.ps1` trực tiếp thì stdin không tới `[Console]::In` (hook treo/timeout → `continue: true`). Spawn process con với `-File` là bắt buộc.

Hook `.ps1` dùng `hook-stdin.ps1`: đọc stdin UTF-8 (raw bytes + BOM), ghi stdout JSON với non-ASCII escape `\uXXXX` (tránh mojibake trong Hooks log khi Cursor decode sai code page).

Chọn fragment theo OS — merge vào `.cursor/hooks.json` (giữ hook khác nếu đã có):

| OS | File fragment |
|----|----------------|
| **Windows** | [hooks/hooks.fragment.windows.json](hooks/hooks.fragment.windows.json) |
| **macOS / Linux** | [hooks/hooks.fragment.unix.json](hooks/hooks.fragment.unix.json) |

[hooks.fragment.json](hooks/hooks.fragment.json) giữ alias macOS/Linux (tương đương `hooks.fragment.unix.json`).

### 3. Kiểm tra

1. **Settings → Hooks** — hook hiển thị và không lỗi path.
2. Thử prompt thiếu scope: `/minipower` + `đồng bộ requirements` (không @ file) → cảnh báo token guard.
3. Thử `@docs/` hoặc `@docs/03-modules/` không kèm file → bị chặn (token guard).
4. Thử `@` DOC-07 + DOC-16 cùng lúc → bị chặn (auto-routing); xem [agents/auto-routing.md](../../agents/auto-routing.md).
5. Thử nhắc `DOC-16` + `DOC-04` trong text (không `@` file) → bị chặn (auto-routing — conflict delivery vs requirements).

`beforeReadFile` (`minipower-token-guard-read`) là **tuỳ chọn** — xoá block tương ứng trong `hooks.json` nếu chưa cần.

### Smoke test (tuỳ chọn)

```bash
# macOS / Linux — beforeSubmitPrompt
printf '%s' '{"prompt":"@docs/03-modules/"}' | .cursor/hooks/minipower-token-guard.sh
# Kỳ vọng: exit 2, JSON continue:false

printf '%s' '{"prompt":"Phase: requirements — Module: billing, DOC-06"}' | .cursor/hooks/minipower-token-guard.sh
# Kỳ vọng: exit 0, {"continue": true}
```

```powershell
# Windows — dùng cùng wrapper như hooks.json (không pipe trực tiếp vào .ps1 — sẽ treo)
$hook = { param($s) $s | powershell -NoProfile -ExecutionPolicy Bypass -File $args[0] }

# auto-routing conflict
$payload = '{"prompt":"/minipower","attachments":[{"type":"file","file_path":"docs/03-modules/identity/DOC-07-acceptance-criteria.md"},{"type":"file","file_path":"docs/03-modules/identity/DOC-16-test-strategy.md"}]}'
& $hook $payload .cursor\hooks\minipower-auto-routing.ps1
# Kỳ vọng: exit 2, continue:false

& $hook '{"prompt":"Phase: requirements — Module: billing, DOC-06"}' .cursor\hooks\minipower-token-guard.ps1
# Kỳ vọng: exit 0, {"continue": true}

$pBare = '{"prompt":"review toan bo tai lieu DOC-16 trong @docs/03-modules xem phan nao ko khop voi DOC-04, DOC-05, DOC-07"}'
& $hook $pBare .cursor\hooks\minipower-auto-routing.ps1
# Kỳ vọng: exit 2, continue:false (delivery DOC-16 vs requirements DOC-04/05/07)
```
