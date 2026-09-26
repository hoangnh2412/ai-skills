# minipower-tasks-lark

SOP đọc/ghi **Lark Tasks** cho agent Minipower. Cài atomic cùng pack `tasks/` (ADR-033).

## L1 / L2 / L3

| Mức | Làm gì | Cổng người |
|-----|--------|------------|
| L1 | `*_list` / `*_get` / `*_tasks` | Không |
| L2 | Bảng task đề xuất, chưa gọi ghi | Chờ "tạo / cập nhật" |
| L3 | Tool create/update **nếu MCP có** | Một OK cho cả bảng |

MCP hiện tại thường **chỉ đọc** task. Khi không có tool ghi: L2 xong, hướng dẫn tạo tay trên Lark.

## Cài

Symlink thư mục skill vào loader (cùng cách `ops/`). Server Lark phải có trong catalog MCP của máy người dùng.

## Không làm

- Gửi tin `im_v1_message_create` (skill `minipower-chat-lark`)
- Ghi Base/Bitable
- Đổi `tasks_provider` trong profile (người + migrate có chủ đích)
