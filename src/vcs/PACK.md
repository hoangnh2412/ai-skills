# PACK — vcs

Manifest máy-đọc (schema: [contracts/pack-manifest.md](../../contracts/pack-manifest.md)). Module **kênh** — SOP MCP/Git mặt `code`.

```yaml
pack: vcs
version: 0.1.0
owner: hoangnh
roles: [backend-dotnet, qa-tester]
stage: implementation
repo: code
consumes: ["diff / commit msg / MR description", "code_provider"]
produces: ["MR iid", "SHA"]
handoff-in:  []
handoff-out: []
memory: —
mcp: [code]
```
