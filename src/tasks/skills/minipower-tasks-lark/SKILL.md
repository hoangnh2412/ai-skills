---
name: minipower-tasks-lark
description: Đọc, lọc, soạn nháp và ghi task Lark (tasklist / task) theo L1–L3. Dùng khi việc trên Lark, sprint, tasklist, "tạo task", tasks_provider lark — không dùng cho tin nhắn nhóm hay wiki.
metadata:
  audience: hoangnh
  workflow: github
---

# minipower-tasks-lark

SOP MCP mặt **`tasks`**. Wrap tool, không copy schema API vào pack. Hướng dẫn người: [README.md](README.md).

## Khi nào dùng

| Tình huống | Workflow |
|---|---|
| Đọc việc / báo cáo tiến độ | [workflows/l1-l3.md](workflows/l1-l3.md) — dừng L1 |
| Đề xuất task mới / sửa due | L2 bảng preview → một lần OK → L3 |

**Không dùng** skill này cho IM, wiki, Bitable, Outline.

## Quy tắc cốt lõi

- Đọc `memory/profile.json` → `tasks_provider`. Khác `lark` → **dừng**, không ghi Lark. `none` → `memory/tasks/`.
- MCP từ `mcp.tasks` (thường `user-lark-mcp`). Thiếu server / `needsAuth` → `mcp_auth` một lần rồi dừng nếu vẫn lỗi.
- Đọc schema tool lần đầu phiên. Tên hay gặp: `task_v2_task_list`, `task_v2_task_get`, `task_v2_tasklist_list`, `task_v2_tasklist_tasks`. **Không** bịa `task_create` nếu catalog không có — nói rõ giới hạn, để người tạo tay.
- L1 tự do đọc. L3 chỉ sau OK trên **một bảng** (bỏ tick dòng không gửi — ADR-033 QĐ-7).
- Map task ↔ `{MOD}-FR-` / `T-NNN` trong bảng; **không** copy body FR sang Lark.
- Hỏi thiếu `tasklist_guid` / khoảng thời gian **một lượt**.
- `useUAT: true` khi schema cho phép và đang làm việc của chính user.

## Output

- L1: tóm tắt 3–7 bullet + mục mở.
- L2: bảng `hành động | tiêu đề | due | list | map ID`.
- L3: id task từ MCP + back-ref nếu user yêu cầu ghi memory (không tự ghi).
