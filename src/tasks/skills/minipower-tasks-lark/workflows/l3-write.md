# L3 — Ghi Lark (sau OK)

1. Chỉ dòng còn tick trên bảng L2.
2. Catalog có tool create/update/complete **đúng tên trong schema** → gọi từng dòng; lỗi 4xx → báo, không retry vô hạn cùng payload.
3. **Không có** tool ghi (catalog 2026-09 thường chỉ đọc) → **không gọi MCP**, không bịa `task_create`. Trả: hướng dẫn tạo tay trên Task Center + copy tiêu đề/due từ bảng L2. Deep-link chỉ khi người đã đưa URL.
4. Thành công: in `task_guid` / id MCP. Back-ref `memory/memory.md` **chỉ khi** người yêu cầu một dòng.
5. Không gửi tin (`im_v1_*`) — đó là `minipower-chat-lark`.
