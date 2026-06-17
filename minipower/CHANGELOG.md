# Changelog

Mọi thay đổi đáng chú ý của **Minipower skill pack** được ghi trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/). Phiên bản theo [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added

- **`agents/`** — `token-guard.md`, `doc-editing.md`, `README.md` (guardrails tool-agnostic)
- **`install/cursor/`** — rules `.mdc`, hooks (`minipower-token-guard.ps1`, `minipower-token-guard-read.ps1`, `hooks.fragment.json`)
- **`install/claude/`** — rule `paths` cho doc-editing, `settings.fragment.json`, README cài đặt

### Changed

- **Hooks** — đổi tên `check-prompt-scope` → `minipower-token-guard`, `check-doc-phase` → `minipower-auto-routing`, `limit-reads` → `minipower-token-guard-read` (khớp rule/agent)
- **`SKILL.md`** — section Agent guardrails + link `agents/`
- **`README.md`** — cấu trúc pack, link `agents/` và `install/`

---

## [2.4.0] - 2026-06-17

### Added

- **`docs-skeleton/00-governance/business-glossary.md`** — SSOT trạng thái & thuật ngữ (DOC Status, Sign-off registry, DOC-16 catalog columns, Layer/Path/Priority, RACI)
- **`templates/DOC-16-test-strategy.md`** — cấu trúc catalog-first (7 cột TC), trace matrix
### Changed

- **`docs-skeleton/05-traceability/doc-registry.md`** — template 9 cột (Author, Sign-off ×3), governance table, link glossary
- **`docs-skeleton/00-governance/doc-versioning.md`** — link glossary; §4 sync registry (Người thực hiện, Sign-off, Người Sign-off, Ngày sign-off)
- **`docs-skeleton/README.md`** — `business-glossary` trong `00-governance/`
- **`templates/README.md`**, **`skills/delivery/SKILL.md`** — DOC-16 + glossary references

---

## [2.3.0] - 2026-06-17

### Added

- **`docs/05-traceability/overview.md`** — rollup tiến độ 30s: snapshot, module × pipeline, milestones, blocker, việc 2 tuần tới
- Link từ `memory/memory.md` và `project-skeleton/README.md` → `overview.md`; hướng dẫn agent rollup sau sync
- **`docs-skeleton/00-governance/doc-versioning.md`** — quy tắc version & Change Log: Version chỉ sau REQ owner sign-off; trước đó `—` + Draft; Change Log chỉ ghi mốc đã approve
- Link từ `SKILL.md`, `docs-skeleton/README.md`, `templates/README.md`, skill `change-control` / `delivery` → `doc-versioning.md`
- **`docs/pipeline.md`**, **`docs/parallel-work.md`**, **`docs/README.md`** — tách tài liệu framework khỏi README chính

### Changed

- `docs-skeleton/README.md`, `SKILL.md`, `README.md` — mô tả `05-traceability` gồm overview
- **`README.md`** — giữ hướng dẫn Cursor + bảng link tài liệu; pipeline & song song chuyển sang `docs/`
- **`docs/parallel-work.md`** — quy tắc #7 DOC versioning (Version sau sign-off; Draft dùng `—`)
- **`templates/DOC-16-test-strategy.md`** — header mặc định `Version = —` + blockquote tham chiếu `doc-versioning.md`
- **`templates/README.md`** — mô tả versioning trỏ chi tiết sang `doc-versioning.md`
- **`project-skeleton/README.md`** — hướng dẫn người mới join: cách đọc tài liệu, thứ tự đọc từng module

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
