# Changelog

Mọi thay đổi đáng chú ý của **Minipower skill pack** được ghi trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/). Phiên bản theo [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added

- **`docs/05-traceability/overview.md`** — rollup tiến độ 30s: snapshot, module × pipeline, milestones, blocker, việc 2 tuần tới
- Link từ `memory/memory.md` và `project-skeleton/README.md` → `overview.md`; hướng dẫn agent rollup sau sync

### Changed

- `docs-skeleton/README.md`, `SKILL.md`, `README.md` — mô tả `05-traceability` gồm overview

---

## [2.2.0] - 2026-06-08

### Added

- **`README.md` — pipeline & làm việc song song:** mô tả vòng đời nghiệp vụ (Discovery → Delivery), 8 nguyên tắc, luồng artifact (`assets/` → `brainstorm/` → `memory/{phase}/` → `docs/`)
- **Phân vai multi-BA / SA / PM:** bảng ownership folder, quy tắc song song, điểm đồng bộ, mức tối thiểu để dev bắt đầu, xử lý xung đột thường gặp
- **Sơ đồ Mermaid:** BA1/BA2 theo module, SA platform, PM planning, subgraph SYNC (`trace-matrix`, `memory/`)

### Changed

- Bảng tra Phase → Memory → Docs → DOC; tiên quyết từng phase; luồng module (BA) và kiến trúc (SA)

---

## [2.1.0] - 2026-06-08

### Added

- **`brainstorm/`** — thay `notes/`; file phẳng theo ngày (`YYYY-MM-DD*.md`), không chia folder con; `brainstorm/README.md` hướng dẫn đặt tên & distill
- **`memory/{phase}/`** — 6 chủ đề: `discovery`, `requirements`, `architecture`, `planning`, `delivery`, `change-control`; mỗi folder có `README.md` làm index
- **`memory/memory.md`** — chỉ index gốc (meta chung + link), không gom toàn bộ context

### Changed

- **`SKILL.md`:** routing đọc `memory/{phase}/` theo phase; kết thúc phiên cập nhật đúng chủ đề, không append dài vào `memory.md`
- **`project-skeleton/`:** đồng bộ cấu trúc mới; cập nhật `INIT.md`, `README.md`, `assets/README.md`

### Removed

- **`project-skeleton/notes/`** — chuyển sang `brainstorm/` + `memory/{phase}/`

---

## [2.0.0] - 2026-06-06

### Added

- **Khởi tạo dự án mặc định** trong `SKILL.md` — lệnh `Init project` / `Khởi tạo dự án`
- **`project-skeleton/`** — khung `{project}/`: `README.md`, `memory/`, `assets/`, `brainstorm/` (ban đầu qua `notes/`)
- **`assets/public/`** và **`assets/internal/`** — tài liệu thô từ khách hàng vs nội bộ; quy tắc không sửa file gốc
- **`project-skeleton/INIT.md`** — hướng dẫn maintainer & lệnh `cp` copy skeleton
- **Exit checklist init** — 4 nhánh (`memory/`, `assets/`, `brainstorm/`, `docs/`), 6 memory phase, 7 folder `docs/`

### Changed

- **`docs-skeleton/README.md`** — tham chiếu luồng init từ `project-skeleton/`
- **`minipower/README.md`** — bổ sung hướng dẫn khởi tạo dự án

---

## [1.1.0] - 2026-06-05

### Changed

- **Di chuyển pack** từ `.cursor/skills/minipower/` → **`minipower/`** ở root repo — source of truth; symlink vào `.cursor/skills/minipower` khi dùng Cursor
- **`README.md` (repo root)** — mục cài Minipower, bảng skill pack, hướng dẫn `ln -snf`

---

## [1.0.0] - 2026-06-05

### Added

- **Skill router** `SKILL.md` — pipeline 12 bước, 18 DOC, routing 6 phase
- **6 skill con:** discovery, requirements, architecture, planning, delivery, change-control
- **18 template DOC** (`templates/DOC-01` … `DOC-18`)
- **`docs-skeleton/`** — khung `docs/` 7 folder: governance, project, baseline, modules, platform, traceability, changes
