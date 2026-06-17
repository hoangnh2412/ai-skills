---
name: ba-delivery
description: >-
  [minipower] Test strategy (ISTQB) & deployment — DOC-16–17. Dùng
  khi UAT, test strategy, trace matrix test, deployment, cutover, go-live.
---

# BA Delivery — Test & Deploy

**Pack:** minipower · **Tiên quyết:** DOC-06 + DOC-07.

**Template:** [DOC-16–17](../../templates/) · **Folder:** module DOC-16 · platform DOC-17 · **Versioning:** [doc-versioning](../../docs-skeleton/00-governance/doc-versioning.md) · **Glossary:** [business-glossary](../../docs-skeleton/00-governance/business-glossary.md)

| Level | Owner |
|-------|-------|
| Unit → Integration → System → UAT | Dev / QA / Business |

**Exit go-live:** Must AC pass · trace green · dry-run rollback

## Format phản hồi

1. Test scope · 2. Trace gaps · 3. UAT · 4. Entry/exit · 5. Deploy · 6. Rollback · 7. Risks · 8. DOC-16/17 · 9. Questions · 10. Go-live checklist

## Anti-patterns

- UAT không trace AC · go-live không dry-run · thiếu regression sau CR → [change-control](../change-control/SKILL.md)
