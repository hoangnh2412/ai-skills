---
name: minipower-architecture-sad
description: Viết SAD ADR integration data model API spec DOC-08 đến 12. Dùng khi architecture, SAD, OpenAPI — không vibe-code .NET.
metadata:
  workflow: github
---

# minipower-architecture-sad

SAD cho người đọc sau ký. Không convention .NET (lá `minipower-backend-architecture-dotnet`). Không báo giá.

Trước ký, giải pháp mức bán là [minipower-architecture-solution-lite](../minipower-architecture-solution-lite/SKILL.md) (`SOL-*`), không phải SAD đầy đủ.

**Tiên quyết:** DOC-06 + DOC-13 của module. Thiếu → [minipower-analyst-srs](../../../analyst/skills/minipower-analyst-srs/SKILL.md).

**Template:** [DOC-08–12](../../../router/templates/) · **Folder:** `docs/04-platform/`

| DOC | Nội dung |
|-----|----------|
| 08 SAD | 4+1 views |
| 09 ADR | 1 file / quyết định — không sửa Accepted |
| 10 Integration | Protocol, direction, SLA |
| 11 Data Model | ERD, master data |
| 12 API | OpenAPI |

**Exit:** SAD/ADR reviewed · API/Data trace FR · NFR in architecture

## Format phản hồi

1. Context · 2. Components · 3. Integration · 4. ADRs · 5. Data/API · 6. NFR map · 7. Risks · 8. DOC updates · 9. Questions · 10. Tiếp → [minipower-pm-plan](../../../pm/skills/minipower-pm-plan/SKILL.md)

## Anti-patterns

- SAD trước SRS · sửa ADR cũ · API không trace FR

Hướng dẫn người: [README.md](README.md).
