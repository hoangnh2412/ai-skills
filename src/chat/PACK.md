# PACK — chat

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)). Module **kênh** — SOP MCP mặt `chat`. Lark task ≠ skill này (ADR-033: hai lá).

```yaml
pack: chat
version: 0.1.0
owner: hoangnh
roles: [support, pm]
stage: cross-cutting
repo: any
consumes: ["bản tin L2", "chat_provider"]
produces: ["message_id"]
handoff-in:  []
handoff-out: []
memory: —
mcp: [chat]
```
