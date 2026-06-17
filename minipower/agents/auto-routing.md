# Auto-routing — DOC file → Minipower phase

Markdown thuần — **SSOT** bảng map DOC→phase và hành vi agent khi user `@` file DOC. Hook Cursor triển khai logic này: [install/cursor/hooks/check-doc-phase.*](../install/cursor/README.md#auto-routing-doc--phase).

## Bảng map DOC → phase

| DOC | Phase | Skill con |
|-----|-------|-----------|
| DOC-01, 02, 03 | **discovery** | `skills/discovery/SKILL.md` |
| DOC-04, 05, 06, 07 | **requirements** | `skills/requirements/SKILL.md` |
| DOC-13 (NFR) | **requirements** | `skills/requirements/SKILL.md` |
| DOC-08, 09, 10, 11, 12 | **architecture** | `skills/architecture/SKILL.md` |
| DOC-14, 15 | **planning** | `skills/planning/SKILL.md` |
| DOC-16 | **delivery** | `skills/delivery/SKILL.md` |
| DOC-17 | **delivery** | `skills/delivery/SKILL.md` |
| DOC-18 | **change-control** | `skills/change-control/SKILL.md` |

**Lưu ý:** DOC-16 nằm trong `docs/03-modules/` nhưng phase là **delivery**, không phải requirements.

## Agent — khi không có hook

1. Parse `@` path hoặc tên file `DOC-NN-*.md` → tra bảng trên.
2. **Một phase** → đọc skill con tương ứng; nhắc user thêm `Phase: …` nếu thiếu.
3. **Nhiều phase** → **không** bắt đầu đọc/sửa; liệt kê file theo phase và gợi ý tách prompt (mỗi prompt 1 phase).
4. `Phase:` trong prompt **khác** phase file DOC → báo conflict, yêu cầu sửa.

## Kết hợp token guard

- [token-guard.md](token-guard.md) — scope, giới hạn đọc file.
- Hook `check-prompt-scope` — chặn `@docs/` quá rộng, thiếu scope.
- Hook `check-doc-phase` — conflict phase khi tag nhiều DOC.

Thứ tự `beforeSubmitPrompt`: **check-prompt-scope** → **check-doc-phase**.
