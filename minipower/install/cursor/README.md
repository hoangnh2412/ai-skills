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
| Kiểm tra scope prompt | `check-prompt-scope.ps1` | `check-prompt-scope.sh` | Token guard — thiếu scope, `@docs/` quá rộng |
| **Auto-routing DOC → phase** | `check-doc-phase.ps1` | `check-doc-phase.sh` + `check-doc-phase.py` | Conflict phase khi tag nhiều DOC |
| Giới hạn đọc baseline/_legacy | `limit-reads.ps1` | `limit-reads.sh` | Tuỳ chọn — chặn Read path nặng |

Bản `.sh` cần **python3** (stdlib `json`) và quyền thực thi. Bản `.ps1` dùng message ASCII (tương thích PowerShell 5.1); `.sh` giữ đầy đủ tiếng Việt.

**SSOT logic agent:** [agents/auto-routing.md](../../agents/auto-routing.md) · **Hướng dẫn dự án:** [`auto-routing.md`](../../../auto-routing.md) *(root workspace docs, nếu có)*.

### Auto-routing (DOC → phase)

Chạy **sau** `check-prompt-scope` trong cùng `beforeSubmitPrompt`:

| Tình huống | Hành vi |
|------------|---------|
| Tag 1 DOC, đúng `Phase:` | Cho gửi |
| Tag 1 DOC, thiếu `Phase:` | Cho gửi + cảnh báo stderr |
| Tag DOC khác phase (vd. DOC-07 + DOC-16) | **Chặn** + gợi ý tách prompt |
| `Phase:` sai so với file DOC | **Chặn** |

Biến môi trường tuỳ chọn: `MINIPOWER_ROOT` (mặc định `ai-skills/minipower`) — path gợi ý skill trong message hook.

### 1. Symlink scripts

**Windows (PowerShell):**

```powershell
$MP = "D:\path\to\ai-skills\minipower"
New-Item -ItemType Directory -Force -Path .cursor\hooks
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\check-prompt-scope.ps1 `
  -Target "$MP\install\cursor\hooks\check-prompt-scope.ps1"
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\check-doc-phase.ps1 `
  -Target "$MP\install\cursor\hooks\check-doc-phase.ps1"
New-Item -ItemType SymbolicLink -Force -Path .cursor\hooks\limit-reads.ps1 `
  -Target "$MP\install\cursor\hooks\limit-reads.ps1"
```

> **Symlink thất bại (Windows, thiếu quyền Admin):** `Copy-Item -Force "$MP\install\cursor\hooks\*.ps1" .cursor\hooks\`

**macOS / Linux:**

```bash
MP=/path/to/ai-skills/minipower
mkdir -p .cursor/hooks
ln -snf "$MP/install/cursor/hooks/check-prompt-scope.sh" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/check-doc-phase.sh" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/check-doc-phase.py" .cursor/hooks/
ln -snf "$MP/install/cursor/hooks/limit-reads.sh" .cursor/hooks/
chmod +x .cursor/hooks/check-prompt-scope.sh .cursor/hooks/check-doc-phase.sh .cursor/hooks/limit-reads.sh
```

### 2. Merge `hooks.json`

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

`beforeReadFile` (`limit-reads`) là **tuỳ chọn** — xoá block tương ứng trong `hooks.json` nếu chưa cần.

### Smoke test (tuỳ chọn)

```bash
# macOS / Linux — beforeSubmitPrompt
printf '%s' '{"prompt":"@docs/03-modules/"}' | .cursor/hooks/check-prompt-scope.sh
# Kỳ vọng: exit 2, JSON continue:false

printf '%s' '{"prompt":"Phase: requirements — Module: billing, DOC-06"}' | .cursor/hooks/check-prompt-scope.sh
# Kỳ vọng: exit 0, {"continue": true}
```

```powershell
# Windows — auto-routing conflict
$payload = '{"prompt":"/minipower","attachments":[{"type":"file","file_path":"docs/03-modules/identity/DOC-07-acceptance-criteria.md"},{"type":"file","file_path":"docs/03-modules/identity/DOC-16-test-strategy.md"}]}'
$payload | .cursor\hooks\check-doc-phase.ps1
# Kỳ vọng: exit 2, continue:false

'{"prompt":"Phase: requirements — Module: billing, DOC-06"}' | .cursor\hooks\check-prompt-scope.ps1
# Kỳ vọng: exit 0, {"continue": true}

$pBare = '{"prompt":"review toan bo tai lieu DOC-16 trong @docs/03-modules xem phan nao ko khop voi DOC-04, DOC-05, DOC-07"}'
$pBare | .cursor\hooks\check-doc-phase.ps1
# Kỳ vọng: exit 2, continue:false (delivery DOC-16 vs requirements DOC-04/05/07)
```
