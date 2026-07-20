---
name: ba-requirements
description: >-
  [minipower] Phân tích yêu cầu — Actor, UC, BR, Prototype, FR, NFR, AC
  (Gherkin). Bước 3–9, DOC-04–07, 13, 19. Dùng khi requirements, use case, SRS,
  business rule, prototype, wireframe, acceptance criteria.
---

# BA Requirements Analysis

**Pack:** minipower · **Phase:** 3–9 · **Tiên quyết:** DOC-03 scope.

**Template:** [DOC-04–07, 13, 19](../../templates/) · **Folder:** `docs/03-modules/{module-id}/` · NFR: `docs/04-platform/DOC-13-nfr.md`

**ID:** `{MOD}-UC-001`, `{MOD}-FR-001`, `{MOD}-BR-001`, `{MOD}-SCR-001`

## Quy trình

| Bước | Nội dung | Artifact |
|------|----------|----------|
| 3 | Actor | DOC-05 |
| 4 | Use Case | DOC-05 |
| 5 | Business Rules | DOC-04 |
| 6 | Prototype / Wireframe — **cổng chốt** trước SRS | DOC-19 |
| 7 | FR (SRS) | DOC-06 |
| 8 | NFR | DOC-13 |
| 9 | Acceptance Criteria | DOC-07 |

> **Cổng chốt (A2):** sau DOC-04 người chốt Business Rules → mới sinh Prototype; sau DOC-19 người chốt Prototype → mới viết SRS. AI soạn DEC nháp, người duyệt — xem [agents/approval-gate.md](../../agents/approval-gate.md). Wireframe HTML sinh qua MCP ngoài (hoãn).

**NFR:** Performance · SLA · Security · Audit · HA/DR

**Exit:** FR baseline · AC trace FR · `05-traceability/trace-matrix.md`

## Format phản hồi (10 mục)

1. Đã hiểu · 2. Còn thiếu · 3. Câu hỏi · 4. Requirements · 5. Actor · 6. UC · 7. BR · 8. Rủi ro · 9. Complexity · 10. DOC-XX

## Anti-patterns

- FR không trace UC/BR · thiếu negative AC · SRS monolith — tách module

**Tiếp:** [architecture](../architecture/SKILL.md) · [delivery](../delivery/SKILL.md)
