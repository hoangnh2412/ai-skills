# PACK — architecture

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)).

Giải pháp mức bán (SOL) + SAD/ADR. **Không** gộp `minipower-backend-architecture-dotnet`. as-built đứng cạnh pack này (intel).

```yaml
pack: architecture
version: 0.1.0
owner: hoangnh
roles: [solution-architect]
stage: architecture
repo: docs
consumes: [DOC-03, DOC-06, DOC-13]
produces: [SOL-*, DOC-08, DOC-09, DOC-10, DOC-11, DOC-12, ADR-*]
handoff-in: [H2]
handoff-out: [H4]
memory: memory/
mcp: [code-intel]
```
