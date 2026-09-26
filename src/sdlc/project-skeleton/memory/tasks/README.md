# Việc khi `tasks_provider=none`

Tracker **file** — không phải bảng Kanban trong SRS/WBS.

- **Một việc = một file** `T-NNN.md` (copy từ `T-NNN.md.example`).
- Điền `id`, `title`, `status`, `due`, `refs` (trỏ `{MOD}-FR-*` / `DOC-NN`).
- Tài liệu nghiệp vụ (`docs/**`) **được trỏ** `T-001`; **cấm** nhúng cột To-do / Doing / Done hay board vào DOC-06 / DOC-14.

Khi `tasks_provider` là OpenProject hoặc Lark: **không** thêm việc mới vào đây — SSOT ở provider; folder này chỉ là khuôn.

Index SQLite (`memory/trace.db`): mỗi `T-NNN.md` = một hàng `artifact` (`type=task`, `provider=none`) — agent ghi khi có ID (Đợt B đã có schema).
