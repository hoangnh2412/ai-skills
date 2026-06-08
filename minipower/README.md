# Minipower — Skill pack

Version 2.2.0

**Một folder** — router + skill con + template + skeleton.

```
minipower/
├── SKILL.md                 ← Skill duy nhất trong menu / của Cursor
├── skills/                  ← Phase con (file hướng dẫn, không có lệnh / riêng)
│   ├── discovery/SKILL.md
│   ├── requirements/SKILL.md
│   ├── architecture/SKILL.md
│   ├── planning/SKILL.md
│   ├── delivery/SKILL.md
│   └── change-control/SKILL.md
├── docs/                    ← Tài liệu framework (pipeline, song song)
├── project-skeleton/        ← Khung dự án: memory, assets, brainstorm
├── templates/               ← Khung 18 DOC
└── docs-skeleton/           ← Khung folder docs/ (artifact dự án)
```

## Tài liệu

| Bạn cần | File |
|---------|------|
| Pipeline, nguyên tắc, luồng artifact | [docs/pipeline.md](docs/pipeline.md) |
| Làm việc song song (multi-BA / SA / PM) | [docs/parallel-work.md](docs/parallel-work.md) |
| Người mới join **dự án** — đọc tài liệu | [project-skeleton/README.md](project-skeleton/README.md) |
| Init project, routing agent | [SKILL.md](SKILL.md) |
| Template 18 DOC | [templates/README.md](templates/README.md) |
| Index tài liệu pack | [docs/README.md](docs/README.md) |

---

## Hướng dẫn dùng trong Cursor

Cursor chỉ đăng ký skill ở **`.cursor/skills/{tên-skill}/SKILL.md`** (một cấp). Skill con nằm trong `skills/` **không** xuất hiện trong menu **`/`** — đó là hành vi bình thường, không phải lỗi cấu hình.

### Cách 1 — Lệnh `/` + nói rõ phase (khuyên dùng)

1. Gõ **`/minipower`** (hoặc chọn skill trong menu `/`).
2. Trong cùng prompt, ghi phase cần làm — agent sẽ đọc file skill con tương ứng:

| Bạn muốn | Ghi trong prompt (ví dụ) |
|----------|---------------------------|
| Khám phá / scope | `Phase: discovery` · `Làm bước 1–2` · `Brainstorm scope` |
| Phân tích yêu cầu | `Phase: requirements` · `Phân tích UC, FR, AC` |
| Kiến trúc | `Phase: architecture` · `Thiết kế SAD, API` |
| Estimate / plan | `Phase: planning` · `WBS, roadmap` |
| Test / deploy | `Phase: delivery` · `Test strategy, cutover` |
| Change Request | `Phase: change-control` · `Tạo CR sau baseline` |

**Ví dụ prompt đầy đủ:**

```text
/minipower
Phase: requirements — elicit use case cho module billing, output DOC-05/06
```

### Cách 2 — `@` gắn file skill con (khi chỉ làm một phase)

Trong ô chat, gõ **`@`** → chọn file (không dùng `/`):

| Phase | File cần @ |
|-------|------------|
| Discovery | `.cursor/skills/minipower/skills/discovery/SKILL.md` |
| Requirements | `…/skills/requirements/SKILL.md` |
| Architecture | `…/skills/architecture/SKILL.md` |
| Planning | `…/skills/planning/SKILL.md` |
| Delivery | `…/skills/delivery/SKILL.md` |
| Change control | `…/skills/change-control/SKILL.md` |

Có thể @ **cả hai**: skill cha + skill con (cha = context chung, con = workflow chi tiết).

**Ví dụ:**

```text
@skills/requirements/SKILL.md
Phân tích FR cho đăng nhập SSO — module auth
```

### Cách 3 — Chỉ `/minipower`, không chỉ phase

Dùng khi **chưa rõ phase** hoặc cần **overview end-to-end**. Agent hỏi ngắn phase hiện tại hoặc đề xuất bước tiếp theo theo pipeline.

---

## Bảng tra nhanh

| Việc | Cách gọi trong Cursor |
|------|------------------------|
| Overview / full pipeline | `/minipower` |
| Một phase cụ thể | `/minipower` + `Phase: …` **hoặc** `@skills/…/SKILL.md` |
| Template DOC | `@templates/DOC-06-srs.md` (hoặc file template khác) |
| Khởi tạo dự án | `/minipower` + `Init project` — xem [SKILL.md](SKILL.md#khởi-tạo-cấu-trúc-dự-án-mặc-định) |
| Khởi tạo thủ công | Copy `project-skeleton/` + `docs-skeleton/` → `{project}/` |

---

## Skill con — nội dung từng file

| File | Mục đích | Bước | DOC |
|------|----------|------|-----|
| [skills/discovery/SKILL.md](skills/discovery/SKILL.md) | Khám phá, scope, stakeholder | 1–2 | 01–03 |
| [skills/requirements/SKILL.md](skills/requirements/SKILL.md) | UC, FR, BR, NFR, AC | 3–8 | 04–07, 13 |
| [skills/architecture/SKILL.md](skills/architecture/SKILL.md) | SAD, ADR, API, data | 9 | 08–12 |
| [skills/planning/SKILL.md](skills/planning/SKILL.md) | WBS, estimate, roadmap | 10–12 | 14–15 |
| [skills/delivery/SKILL.md](skills/delivery/SKILL.md) | Test, deployment | — | 16–17 |
| [skills/change-control/SKILL.md](skills/change-control/SKILL.md) | CR sau baseline | — | 18 |

Router chi tiết: [SKILL.md](SKILL.md)

---

## Muốn skill con có lệnh `/` riêng?

Cursor **không** hỗ trợ skill lồng nhau trong menu `/`. Nếu bắt buộc cần `/minipower-requirements`, … phải **tách** mỗi phase thành folder riêng `.cursor/skills/minipower-requirements/SKILL.md` (mất lợi thế “một bộ gom pack”). Pack hiện tại ưu tiên **một bộ tài nguyên chung** + gọi phase bằng **`Phase:`** hoặc **`@` file**.
