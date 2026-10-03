# PACK — docs

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)). Module **kênh** — SOP MCP mặt `docs`.

```yaml
pack: docs
version: 0.1.0
owner: hoangnh
roles: [analyst, support]
stage: cross-cutting
repo: docs
consumes: ["body + id artifact", "docs_provider"]
produces: ["URI tài liệu trên provider"]
handoff-in:  []
handoff-out: []
memory: —
mcp: [docs]
```
