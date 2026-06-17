---
name: minipower
description: >-
  Minipower — bộ skill BA + Solution Architect + TPM (6 phase con). Pipeline 12
  bước, 18 DOC, enterprise systems. Khởi tạo dự án: init project. Gõ /minipower
  hoặc @minipower. Phase: discovery | requirements | architecture | planning |
  delivery | change-control.
---

# Minipower — Skill pack (BA + SA + TPM)

**Một bộ skill** gồm router (file này) + **6 skill con** trong [`skills/`](skills/). Template, skeleton dự án & skeleton `docs/` nằm cùng pack.

## Cách dùng trong Cursor

**Menu `/`:** chỉ có **`minipower`** (skill cha). Skill con **không** có lệnh `/` riêng.

| Cách | Thao tác |
|------|----------|
| **A — `/` + phase** | `/minipower` rồi ghi `Phase: requirements` (hoặc discovery / architecture / planning / delivery / change-control) → agent **đọc file skill con** tương ứng trước khi trả lời |
| **B — `@` file con** | `@skills/requirements/SKILL.md` (path đầy đủ trong `.cursor/skills/minipower/…`) |
| **C — overview** | `/minipower` không chỉ phase → router hỏi/đề xuất bước |
| **D — khởi tạo dự án** | `/minipower` + `Init project` / `Khởi tạo dự án` → agent thực hiện [Khởi tạo cấu trúc dự án](#khởi-tạo-cấu-trúc-dự-án-mặc-định) |

Chi tiết + ví dụ prompt: [README.md](README.md)

### Routing — agent bắt buộc

Khi user ghi `Phase: …` hoặc intent rõ (vd. "phân tích yêu cầu", "thiết kế kiến trúc") → **đọc** `memory/{phase}/` + skill con tương ứng, rồi áp dụng workflow. Kết thúc phiên → cập nhật `memory/{phase}/`, **không** append dài vào `memory/memory.md`.

| Phase / intent | Đọc file |
|----------------|----------|
| discovery, scope, brainstorm | [skills/discovery/SKILL.md](skills/discovery/SKILL.md) |
| requirements, UC, FR, SRS, AC | [skills/requirements/SKILL.md](skills/requirements/SKILL.md) |
| architecture, SAD, ADR, API | [skills/architecture/SKILL.md](skills/architecture/SKILL.md) |
| planning, WBS, estimate, roadmap | [skills/planning/SKILL.md](skills/planning/SKILL.md) |
| delivery, test, deploy, go-live | [skills/delivery/SKILL.md](skills/delivery/SKILL.md) |
| change-control, CR, baseline | [skills/change-control/SKILL.md](skills/change-control/SKILL.md) |
| init project, khởi tạo dự án, tạo folder dự án | Section [Khởi tạo](#khởi-tạo-cấu-trúc-dự-án-mặc-định) **trong file này** |

## Khởi tạo cấu trúc dự án mặc định

Khi user yêu cầu **khởi tạo / init dự án** mới → agent **bắt buộc** tạo đúng cấu trúc dưới `{project}/` (root dự án, không phải folder skill pack).

### Cấu trúc mặc định

```text
{project}/
├── README.md              ← Entry dự án
├── memory/                ← Context nhanh — index theo chủ đề (đọc trước khi làm việc)
│   ├── memory.md          ← Index gốc (chung) — link 6 chủ đề bên dưới
│   ├── discovery/         ← Phạm vi, stakeholder, khảo sát (→ DOC-01–03)
│   ├── requirements/      ← UC, FR, SRS theo module (→ DOC-04–07, 13)
│   ├── architecture/      ← SAD, ADR, tích hợp, API (→ DOC-08–12)
│   ├── planning/          ← WBS, ước lượng, kế hoạch (→ DOC-14–15)
│   ├── delivery/          ← Chiến lược test, triển khai (→ DOC-16–17)
│   └── change-control/    ← CR, delta baseline sau ký (→ DOC-18)
├── assets/                ← Tài liệu thô từ khách hàng / họp nội bộ
│   ├── public/            ← Đã share với khách hàng
│   └── internal/          ← Nội bộ — không gửi khách
├── brainstorm/            ← Trao đổi & phân tích — file theo ngày (không chia folder con)
└── docs/                  ← Artifact chính thức Minipower (DOC-01–18)
    ├── 00-governance/     ← Kế hoạch, CR register, lịch sử baseline (DOC-15, 18)
    ├── 01-project/        ← Vision, stakeholder, BRD (DOC-01–03)
    ├── 02-baseline/       ← Snapshot đã ký — chỉ đọc
    ├── 03-modules/        ← UC, FR, SRS, test theo module (DOC-04–07, 16)
    ├── 04-platform/       ← SAD, tích hợp, NFR, triển khai (DOC-08–14, 17)
    ├── 05-traceability/   ← Overview, ma trận trace, doc registry
    └── 06-changes/        ← CR và delta thay đổi (DOC-18)
```

### Quy ước folder

| Thư mục | Vai trò |
|---------|---------|
| [`assets/`](assets/) | Giữ **bản gốc** khảo sát, checklist, biên bản — **không sửa file gốc** |
| [`brainstorm/`](brainstorm/) | Phân tích, trao đổi, decision log theo ngày; chốt → **distill** vào `docs/` |
| [`docs/`](docs/) | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |
| [`memory/`](memory/) | Index context theo chủ đề — `memory.md` gốc + `memory/{phase}/` |

**Bổ sung:**

| Thư mục | Quy tắc |
|---------|---------|
| `assets/public/` | Đã share / nhận từ khách hàng |
| `assets/internal/` | Họp nội bộ — không gửi khách |
| `brainstorm/` | File: `YYYY-MM-DD.md` hoặc `YYYY-MM-DD-<mo-ta>.md` — **không** tạo folder con |
| `docs/03-modules/` | Copy `_template/` → `{module-id}/` khi mở module |
| `memory/memory.md` | Index gốc — đọc **đầu session**, rồi mở `memory/{phase}/` |
| `memory/{phase}/` | Ghi memory **theo chủ đề** — tránh nhồi hết vào `memory.md` |

**Luồng:** `assets/` → `brainstorm/` → `docs/` → `02-baseline/` · sau baseline → `06-changes/CR-xxx/`

### Thao tác agent khi init

1. Xác nhận `{project}/` path (hoặc tạo folder mới theo tên user cung cấp).
2. Copy [`project-skeleton/`](project-skeleton/) → `{project}/` (README, memory, assets, brainstorm).
3. Copy [`docs-skeleton/`](docs-skeleton/) → `{project}/docs/`.
4. Điền `README.md`, `memory/memory.md` (chỉ meta chung), `memory/discovery/` (bắt đầu phase).
5. **Không** gom context dài vào `memory/memory.md` — cập nhật đúng `memory/{phase}/`.
6. **Không** tạo thêm cấu trúc lệch chuẩn trừ khi user yêu cầu rõ.

```bash
# Tham chiếu — chạy từ thư mục cha của dự án
PROJECT={tên-dự-án}
MINIPOWER={path-tới-minipower-skill-pack}

mkdir -p "$PROJECT"
cp -R "$MINIPOWER/project-skeleton/"* "$PROJECT/"
cp -R "$MINIPOWER/docs-skeleton" "$PROJECT/docs"
```

Nguồn skeleton: [project-skeleton/INIT.md](project-skeleton/INIT.md)

### Exit init

- [ ] Đủ 4 nhánh: `memory/` (6 chủ đề), `assets/`, `brainstorm/`, `docs/` (7 folder)
- [ ] `memory/memory.md` + 6 folder `memory/{phase}/README.md`
- [ ] `brainstorm/README.md` — **không** folder con trong `brainstorm/`

## Pipeline

```text
Business Goal → Stakeholder → Process → Requirement → Solution
```

**Nguyên tắc:** Không nhảy giải pháp sớm · Assumption · Tìm req thiếu · Rủi ro.

## Skill con

| Skill | Path | Bước | DOC |
|-------|------|------|-----|
| Discovery | [skills/discovery/SKILL.md](skills/discovery/SKILL.md) | 1–2 | 01–03 |
| Requirements | [skills/requirements/SKILL.md](skills/requirements/SKILL.md) | 3–8 | 04–07, 13 |
| Architecture | [skills/architecture/SKILL.md](skills/architecture/SKILL.md) | 9 | 08–12 |
| Planning | [skills/planning/SKILL.md](skills/planning/SKILL.md) | 10–12 | 14–15 |
| Delivery | [skills/delivery/SKILL.md](skills/delivery/SKILL.md) | — | 16–17 |
| Change control | [skills/change-control/SKILL.md](skills/change-control/SKILL.md) | — | 18 |

## Tài nguyên dùng chung

| Resource | Path |
|----------|------|
| **Project skeleton** | [project-skeleton/](project-skeleton/) |
| **DOC versioning** | [docs-skeleton/00-governance/doc-versioning.md](docs-skeleton/00-governance/doc-versioning.md) |
| Template 18 DOC | [templates/README.md](templates/README.md) |
| Skeleton `docs/` | [docs-skeleton/README.md](docs-skeleton/README.md) |

## 18 DOC & trace (tóm tắt)

```text
01–03 → 05 → 06 → 07 → 16 │ 06/10/12 → 08/09/11 │ 18 → revise → vX.Y
```

Chi tiết folder `docs/` → [docs-skeleton](docs-skeleton/README.md).

## Go-live exit

- [ ] DOC-01–07 baseline · 08–12 reviewed · 13↔test · 14–15↔SRS · 16↔07 · 17 dry-run · 18 register
