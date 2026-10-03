# PACK — qa

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)).

DOC-16 + `{MOD}-TEST-*`. Autotest runner ở repo code.

```yaml
pack: qa
version: 0.1.0
owner: hoangnh
roles: [qa-tester]
stage: qa
repo: any
consumes: [DOC-07, DOC-16, "{MOD}-AC-*"]
produces: ["{MOD}-TEST-*", "test report"]
handoff-in: [H5]
handoff-out: []
memory: memory/delivery/
mcp: []
```
