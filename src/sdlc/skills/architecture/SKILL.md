---
name: architecture
description: >-
  [KHO] SOP SAD/ADR/API. Làm việc mở minipower-architecture-sad
  (trước ký: minipower-architecture-solution-lite). Không route vào skill này.
---

# Solution Architecture

> Kho. Mở [minipower-architecture-sad](../../../architecture/skills/minipower-architecture-sad/SKILL.md).

**Pack:** minipower · **Phase:** 9 · **Tiên quyết:** DOC-06 + DOC-13 baseline.

**Template:** [DOC-08–12](../../templates/) · **Folder:** `docs/04-platform/`

| DOC | Nội dung |
|-----|----------|
| 08 SAD | 4+1 views |
| 09 ADR | 1 file / quyết định — không sửa Accepted |
| 10 Integration | Protocol, direction, SLA |
| 11 Data Model | ERD, master data |
| 12 API | OpenAPI |

**Exit:** SAD/ADR reviewed · API/Data trace FR · NFR in architecture

## Format phản hồi

1. Context · 2. Components · 3. Integration · 4. ADRs · 5. Data/API · 6. NFR map · 7. Risks · 8. DOC updates · 9. Questions · 10. Tiếp → [planning](../planning/SKILL.md)

## Anti-patterns

- SAD trước SRS · sửa ADR cũ · API không trace FR
