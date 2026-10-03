# minipower-chat-lark

SOP **Lark IM**. Tách khỏi task (ADR-033: hai lá).

## L1 / L2 / L3

Đọc list/search tin = L1. Mọi `message_create` / `chat_create` = L3.

## Cài

Pack `chat/` atomic. Cùng MCP Lark với tasks nếu máy đã login — vẫn load skill này riêng.

## Không làm

- Tạo/sửa task Lark
- Import docx / wiki
