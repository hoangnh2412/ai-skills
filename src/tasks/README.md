# tasks — kênh quản lý việc

Module **kênh** (ADR-033 QĐ-5): SOP gọi MCP mặt `tasks`. Không chứa luật UC/FR. Provider hiện tại: Lark Tasks. OpenProject = lá sau, không folder trống.

Manifest: [PACK.md](PACK.md).

## Skill

| Skill | Tài liệu | Việc |
|---|---|---|
| **minipower-tasks-lark** | [skills/minipower-tasks-lark/README.md](./skills/minipower-tasks-lark/README.md) | Đọc / nháp / ghi task Lark theo L1–L3; map ID Minipower, không copy FR |

## Liên quan

- Chat Lark: [`chat/`](../chat/README.md) — tin nhắn, không task
- Task local (`tasks_provider: none`): `memory/tasks/` trên dự án đích, không MCP
