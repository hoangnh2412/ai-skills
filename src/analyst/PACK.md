# PACK — analyst

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)).

UC/FR/BR/AC/SRS/NFR/prototype + nội dung CR. Template DOC-04…07, 13, 19 — **file** vẫn `router/templates/` (một SSOT) cho đến khi chuyển file.

```yaml
pack: analyst
version: 0.1.0
owner: hoangnh
roles: [analyst]
stage: requirements
repo: docs
consumes: [DOC-03, SUR-*]
produces: ["{MOD}-UC/FR/BR/AC/NFR-*", DOC-04, DOC-05, DOC-06, DOC-07, DOC-13, DOC-19]
handoff-in: [H1]
handoff-out: [H2, H3, H5]
memory: memory/
mcp: []
```
