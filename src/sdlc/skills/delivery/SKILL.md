---
name: delivery
description: >-
  [KHO] SOP DOC-16/17. DOC-16 mở minipower-qa-strategy.
  DOC-17 mở minipower-ops-deploy. Không route vào skill này.
---

# BA Delivery — Test & Deploy

> Kho. DOC-16: [minipower-qa-strategy](../../../qa/skills/minipower-qa-strategy/SKILL.md). DOC-17: [minipower-ops-deploy](../../../ops/skills/minipower-ops-deploy/SKILL.md).

**Pack:** minipower · **Tiên quyết:** DOC-06 + DOC-07.

**Template:** [DOC-16–17](../../templates/) · **Folder:** module DOC-16 · platform DOC-17 · **Versioning:** [doc-versioning](../../docs-skeleton/00-governance/doc-versioning.md) · **Glossary:** [business-glossary](../../docs-skeleton/00-governance/business-glossary.md)

| Level | Owner |
|-------|-------|
| Unit → Integration → System → UAT | Dev / QA / Business |

**Exit go-live:** Must AC pass · trace green · dry-run rollback

## Format phản hồi

1. Test scope · 2. Trace gaps · 3. UAT · 4. Entry/exit · 5. Deploy · 6. Rollback · 7. Risks · 8. DOC-16/17 · 9. Questions · 10. Go-live checklist

**Trước go-live** — chạy [doc-review](../doc-review/SKILL.md) làm gate: verdict PASS (0 Blocker) mới baseline.

## Anti-patterns

- UAT không trace AC · go-live không dry-run · thiếu regression sau CR → [change-control](../change-control/SKILL.md)
