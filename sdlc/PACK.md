# PACK — sdlc

Manifest máy-đọc của module (schema: [contracts/pack-manifest.md](../contracts/pack-manifest.md)). Consumer: installer `--with` · bảng router sinh tự động · trace liên-pack · Skill Registry tương lai.

```yaml
pack: sdlc
version: 0.1.0
owner: hoangnh
roles: [business-analyst, solution-architect, technical-pm]
stage: [discovery, requirements, architecture, planning, delivery, change-control]
repo: docs
consumes: [assets/*, "khách hàng: khảo sát, biên bản"]
produces: [DOC-01..19, "{MOD}-UC/FR/BR/AC-*", ADR-*, "trace-matrix"]
handoff-out: [H2, H3, H4, H5, H6]
memory: memory/{phase}/
mcp: [tasks, docs]   # tên trừu tượng (QĐ-9) — dự kiến openproject, outline; hiện approval_source: local
```
