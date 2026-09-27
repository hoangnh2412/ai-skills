# L1 — Đọc / tìm / lọc task Lark

1. Face: `tasks_provider === lark`. MCP `mcp.tasks` sẵn sàng (schema `task_v2_*`).
2. Hỏi **một lượt** nếu thiếu: Owned (`my_tasks`) hay một tasklist; `completed`; cửa sổ thời gian; từ khóa lọc sau khi đã list; map ID Minipower.
3. Gọi đọc: `task_v2_task_list` (`type=my_tasks`) và/hoặc `tasklist_list` → `tasklist_tasks`. Chi tiết một id: `task_v2_task_get`. `useUAT: true` khi schema có và việc của user.
4. `page_token`: lấy tiếp hoặc nói rõ đang cắt N bản ghi. Không bịa phần chưa đọc. Không bịa tool `task_search`.
5. Trả 3–7 bullet + mục mở. Dừng đây nếu người chỉ hỏi tìm/tóm tắt.
6. Cần ghi (tạo/sửa) → [l2-preview.md](l2-preview.md).
