# PACK — support

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)).

Rà soát tiêu chuẩn + nhắc owner. Không soạn lại FR/SAD. Không init. Publish qua kênh (QĐ-15, §5.1d).

```yaml
pack: support
version: 0.1.0
owner: hoangnh
roles: [support]
stage: cross-cutting
repo: any
consumes: ["artifact đã có ID"]
produces: ["registry", "nhắc thiếu", "chỉ đạo publish"]
handoff-in: []
handoff-out: []
memory: memory/
mcp: [docs, tasks, chat]
```
