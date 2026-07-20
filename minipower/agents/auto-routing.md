# Auto-routing — DOC file → Minipower phase

Markdown thuần — hành vi agent khi user `@` file DOC. **Bảng map DOC→phase là dữ liệu**, SSOT ở [hooks/lib/rules.json](../hooks/lib/rules.json) (R3). Bảng dưới **sinh tự động** từ đó (`npm run gen`) — thêm DOC-19 chỉ sửa rules.json, không đụng doc/code. Logic hook (một implementation Node cho cả 3 nền tảng): [hooks/lib/auto-routing.js](../hooks/lib/auto-routing.js) qua shim [hooks/bin/auto-routing.js](../hooks/bin/auto-routing.js) — cài: [install/cursor/README.md](../install/cursor/README.md#auto-routing-doc--phase).

## Bảng map DOC → phase

<!-- BEGIN generated: phase-map (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->

| Phase | DOC | Skill con |
|-------|-----|-----------|
| **discovery** | DOC-01–03 | `skills/discovery/SKILL.md` |
| **requirements** | DOC-04–07, 13, 19 | `skills/requirements/SKILL.md` |
| **architecture** | DOC-08–12 | `skills/architecture/SKILL.md` |
| **planning** | DOC-14–15 | `skills/planning/SKILL.md` |
| **delivery** | DOC-16–17 | `skills/delivery/SKILL.md` |
| **change-control** | DOC-18 | `skills/change-control/SKILL.md` |

<!-- END generated: phase-map -->

**Lưu ý:** DOC-13 (NFR) nằm ngoài dải 04–07 nhưng vẫn thuộc **requirements**. DOC-16 nằm trong `docs/03-modules/` nhưng phase là **delivery**, không phải requirements.

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
