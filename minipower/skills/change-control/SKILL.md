---
name: ba-change-control
description: >-
  [minipower] Change Request sau baseline — DOC-18, delta,
  re-baseline. Dùng khi CR, RFC, sửa requirement đã sign-off, impact analysis.
---

# BA Change Control

**Pack:** minipower · **Tiên quyết:** baseline DOC-01–07.

**Template:** [DOC-18](../../templates/DOC-18-change-request-register.md) · **Folder:** `00-governance/` · `06-changes/CR-xxx/` · **Versioning:** [doc-versioning](../../docs-skeleton/00-governance/doc-versioning.md)

**Quy tắc:** Sau baseline → CR bắt buộc · không sửa `02-baseline/` trực tiếp.

```text
CR → impact → deltas/ → merge docs → regression → approve → vX.Y
```

**Sau merge delta** — [doc-review](../doc-review/SKILL.md) regression tài liệu (trace + mâu thuẫn) trước re-baseline. CR lớn → [deliberation](../deliberation/SKILL.md) trước khi chấp thuận.

**Liên quan:** [requirements](../requirements/SKILL.md) · [architecture](../architecture/SKILL.md) · [planning](../planning/SKILL.md) · [delivery](../delivery/SKILL.md)

## Anti-patterns

- Sửa SRS không CR · duplicate DOC · approve CR không cập nhật trace/test
