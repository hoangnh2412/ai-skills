# Auto-routing — DOC file → Minipower phase

Markdown thuần — **SSOT bảng map** DOC→phase và hành vi agent khi user `@` file DOC. Logic hook (một implementation Node cho cả 3 nền tảng): [hooks/lib/auto-routing.js](../hooks/lib/auto-routing.js) qua shim [hooks/bin/auto-routing.js](../hooks/bin/auto-routing.js) — cài: [install/cursor/README.md](../install/cursor/README.md#auto-routing-doc--phase).

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

1. Parse `@` path, tên file `DOC-NN-*.md`, hoặc nhắc trần `DOC-NN` trong prompt → tra bảng trên.
2. **Một phase** → hook/script chèn `Phase: …`, `/minipower`, `@skills/{phase}/SKILL.md` (và `@` file DOC nếu đã tag path đầy đủ); agent đọc skill con tương ứng.
3. **Nhiều phase** → **không** bắt đầu đọc/sửa; liệt kê file theo phase và gợi ý tách prompt (mỗi prompt 1 phase).
4. `Phase:` trong prompt **khác** phase file DOC → báo conflict, yêu cầu sửa.

## Kết hợp token guard

- [token-guard.md](token-guard.md) — scope, giới hạn đọc file.
- Hook `minipower-token-guard` — chặn `@docs/` quá rộng, thiếu scope.
- Hook `minipower-auto-routing` — conflict phase khi tag hoặc **nhắc trần** nhiều `DOC-NN` thuộc phase khác nhau.

Thứ tự `beforeSubmitPrompt`: **token-guard** → **auto-routing** → **decision-staleness** (advisory, keyword-gated). Shim tương ứng: `hooks/bin/{token-guard,auto-routing,decision-staleness}.js`.
