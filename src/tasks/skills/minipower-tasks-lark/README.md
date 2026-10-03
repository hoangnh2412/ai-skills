# minipower-tasks-lark

SOP **Lark Tasks** (đọc / tìm / nháp / ghi nếu MCP có tool). Cài khi pack `tasks/` nằm trong `minipower install` — CLI symlink thư mục skill, không cần sửa CLI.

Persona (tuỳ phiên): [agents/minipower-tasks-lark.md](../../agents/minipower-tasks-lark.md).

## L1 / L2 / L3

| Mức | Làm gì | Cổng người |
|-----|--------|------------|
| L1 | Tìm, lọc, list, get | Không |
| L2 | Bảng đề xuất | Chờ một lần OK |
| L3 | Tool ghi **nếu catalog có** | Chỉ dòng còn tick |

MCP task thường **chỉ đọc**. Không có tool ghi: dừng sau L2, tạo tay trên Lark.

## Cài MCP (máy người)

[larksuite/lark-openapi-mcp](https://github.com/larksuite/lark-openapi-mcp) — app Feishu/Lark, OAuth user token, server `user-lark-mcp` / `lark-mcp` trong Settings → MCP. Skill không giả kết quả khi server thiếu.

`minipower install` với pack `tasks` (mặc định trong registry). Skill đã có trên đĩa được quét `listLeafSkills()` — **không** khai từng lá trong `module-registry.json` (file đó chỉ pack).

Agent-file **không** đi qua CLI: sống trong pack; phiên Agent Chat khớp `description` là đủ. Muốn persona cứng: `@` file agent hoặc Custom Agent Cursor trỏ cùng file — thủ công, không đợt CLI.

## Không làm

- `im_v1_message_create` (`minipower-chat-lark`)
- Wiki / Bitable / Drive / Outline
- OpenProject (lá `minipower-tasks-openproject` khi có SOP)
- Đổi `tasks_provider` (người + `minipower init`)
