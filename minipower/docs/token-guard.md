# Token guard

[← README](README.md) · [Pipeline](pipeline.md)

Giảm **đọc/sửa lan man** trên repo `docs/` (baseline, legacy, cả thư mục, nhiều module một lúc) — tiết kiệm token và giữ mỗi phiên chat **một slice** rõ ràng.

**Cần cài rules/hooks** trên **workspace project docs** — symlink skill Minipower **không** tự bật token guard. Xem [../install/cursor/README.md](../install/cursor/README.md) · [../install/claude/README.md](../install/claude/README.md).

## Ba lớp

| Lớp | Vai trò | Nguồn |
|-----|---------|--------|
| **Agent rules** | Hướng dẫn agent: hỏi scope, đọc theo lớp, một slice khi sửa | [../agents/token-guard.md](../agents/token-guard.md) · [../agents/doc-editing.md](../agents/doc-editing.md) |
| **IDE rules** | Cursor `.mdc` / Claude `.md` — áp dụng khi chat hoặc khi sửa `docs/**/*.md` | [../install/cursor/README.md](../install/cursor/README.md) · [../install/claude/README.md](../install/claude/README.md) |
| **Hooks (Cursor)** | Chặn/cảnh báo **trước khi gửi prompt** và **trước khi đọc file** | `check-prompt-scope` · `limit-reads` — [../install/cursor/README.md](../install/cursor/README.md) |

## Quy ước scope trong prompt

Một phiên làm việc nên có đủ **phase + đích + file** (hoặc @ một file cụ thể):

| Thành phần | Cách ghi | Ví dụ |
|------------|----------|--------|
| Phase | `Phase: discovery` · `requirements` · … (xem [pipeline.md](pipeline.md)) | `Phase: requirements` |
| Module | `Module: {module-id}` hoặc path `03-modules/{module-id}/` | `Module: billing` |
| Platform | `04-platform` (khi không theo module) | `Phase: architecture — 04-platform, DOC-08` |
| DOC | `DOC-06` … `DOC-18` | `DOC-06 §2` |
| File đích | `@docs/03-modules/{module-id}/DOC-06-srs.md` | @ một file, không @ cả folder |

**Prompt gọn, đủ scope:**

```text
/minipower
Phase: requirements — Module: billing, DOC-06
@docs/03-modules/billing/DOC-06-srs.md
Cap nhat FR dang nhap SSO — section 2.3
```

**Tránh** (hooks có thể chặn hoặc cảnh báo):

```text
@docs/
@docs/03-modules/
Dong bo toan bo requirements tat ca module
```

## Agent làm gì khi đọc / sửa

- **Chưa rõ scope** → hỏi 1 câu (module + DOC + section), không quét repo.
- **Context theo lớp:** `overview.md` → `memory/{phase}/` → **1 DOC đích** (+ tối đa 1 dependency).
- **Tối đa 3 file** đọc thêm so với file user @; vượt → hỏi trước.
- **Không tự đọc** `docs/02-baseline/`, `docs/03-modules/_legacy/`, toàn bộ `trace-matrix.md` / `doc-registry.md` trừ khi user yêu cầu rõ (migrate, rollup).
- **Một slice khi sửa:** `{module}/{DOC-XX}` + section hoặc ID (`{MOD}-FR-010`); chỉ diff phần được yêu cầu.

Chi tiết rule agent: [../agents/token-guard.md](../agents/token-guard.md)

## Hooks Cursor (khi đã cài)

| Hook | Sự kiện | Hành vi |
|------|---------|---------|
| `check-prompt-scope` | `beforeSubmitPrompt` | **Chặn** `@docs/` hoặc `@docs/03-modules/` không kèm file; **cảnh báo** prompt sửa/sync thiếu Phase + Module (hoặc 04-platform) + DOC |
| `limit-reads` | `beforeReadFile` (tuỳ chọn) | **Từ chối** đọc `02-baseline/`, `_legacy/` trừ khi prompt có migrate / MIGRATION |

Smoke test: [../install/cursor/README.md](../install/cursor/README.md)
