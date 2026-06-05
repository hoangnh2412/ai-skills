---
name: minipower
description: >-
  Minipower — bộ skill BA + Solution Architect + TPM (6 phase con). Pipeline 12
  bước, 18 DOC, enterprise systems. Gõ /minipower hoặc @minipower. Phase:
  discovery | requirements | architecture | planning | delivery | change-control.
---

# Minipower — Skill pack (BA + SA + TPM)

**Một bộ skill** gồm router (file này) + **6 skill con** trong [`skills/`](skills/). Template & skeleton nằm cùng pack.

## Cách dùng trong Cursor

**Menu `/`:** chỉ có **`minipower`** (skill cha). Skill con **không** có lệnh `/` riêng.

| Cách | Thao tác |
|------|----------|
| **A — `/` + phase** | `/minipower` rồi ghi `Phase: requirements` (hoặc discovery / architecture / planning / delivery / change-control) → agent **đọc file skill con** tương ứng trước khi trả lời |
| **B — `@` file con** | `@skills/requirements/SKILL.md` (path đầy đủ trong `.cursor/skills/minipower/…`) |
| **C — overview** | `/minipower` không chỉ phase → router hỏi/đề xuất bước |

Chi tiết + ví dụ prompt: [README.md](README.md)

### Routing — agent bắt buộc

Khi user ghi `Phase: …` hoặc intent rõ (vd. "phân tích yêu cầu", "thiết kế kiến trúc") → **đọc** skill con tương ứng rồi áp dụng workflow của file đó:

| Phase / intent | Đọc file |
|----------------|----------|
| discovery, scope, brainstorm | [skills/discovery/SKILL.md](skills/discovery/SKILL.md) |
| requirements, UC, FR, SRS, AC | [skills/requirements/SKILL.md](skills/requirements/SKILL.md) |
| architecture, SAD, ADR, API | [skills/architecture/SKILL.md](skills/architecture/SKILL.md) |
| planning, WBS, estimate, roadmap | [skills/planning/SKILL.md](skills/planning/SKILL.md) |
| delivery, test, deploy, go-live | [skills/delivery/SKILL.md](skills/delivery/SKILL.md) |
| change-control, CR, baseline | [skills/change-control/SKILL.md](skills/change-control/SKILL.md) |

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
| Template 18 DOC | [templates/README.md](templates/README.md) |
| Skeleton folder | [docs-skeleton/README.md](docs-skeleton/README.md) |

Copy `docs-skeleton/` → `{project}/docs/` · module: `03-modules/_template/` → `{module-id}/`.

## 18 DOC & trace (tóm tắt)

```text
01–03 → 05 → 06 → 07 → 16 │ 06/10/12 → 08/09/11 │ 18 → revise → vX.Y
```

Chi tiết folder → [docs-skeleton](docs-skeleton/README.md).

## Go-live exit

- [ ] DOC-01–07 baseline · 08–12 reviewed · 13↔test · 14–15↔SRS · 16↔07 · 17 dry-run · 18 register
