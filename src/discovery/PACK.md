# PACK — discovery

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)).

Pack nghề khảo sát (QĐ-18). Output một bản; presales và analyst cùng đọc. **Không** FR/AC/giá.

```yaml
pack: discovery
version: 0.1.0
owner: hoangnh
roles: [analyst]
stage: discovery
repo: docs
consumes: ["biên bản", "painpoint", "tài liệu nguồn"]
produces: [DOC-01, DOC-02, DOC-03, SUR-*]
handoff-in: []
handoff-out: [H0, H1]
memory: memory/discovery/
mcp: []
```
