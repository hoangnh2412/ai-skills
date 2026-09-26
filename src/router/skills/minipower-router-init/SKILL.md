---
name: minipower-router-init
description: Init dự án Minipower đã xong bằng CLI thì chỉ xác nhận, không ghi lại. Chưa có .minipower thì hướng dẫn chạy minipower init. Dùng khi init project, khởi tạo dự án, khai báo tôi là ai — support không init.
metadata:
  audience: hoangnh
  workflow: github
---

# minipower-router-init

**Không** thuộc support (QĐ-14). **Ghi file = CLI** `minipower init` ([ADR-031](../../../../ADRs/ADR-031-2026-09-01-cli-install-init-thay-llm-thi-hanh.md)). Skill **không** mkdir, **không** ghi `profile.json` / `profile.user.json`.

## Đã có `.minipower/` + `memory/profile.json` (ca smoke / dự án đã init)

1. Thông báo: sẽ dùng skill này **chỉ để đối chiếu**, không chạy lại init.
2. Đọc `memory/profile.json` (SSOT chế độ) — **không** lấy `project_mode` từ README/INIT.md.
3. Nêu ngắn: tên, mode, 4 provider, phase. Hỏi **một** câu: giữ nguyên hay chạy lại CLI.
4. Người **chưa OK** → dừng. Không hỏi lại 7 câu, không copy skeleton lần hai.

## Chưa có marker / profile

Bảng lệnh (không tự gõ JSON):

```text
node <factory>/cli/minipower.mjs init
# sau install:  node .minipower/bin/minipower init
```

CLI hỏi từng bước (số + Enter). Thiếu trường → CLI FAIL, **không** đệm bằng LLM.

Hướng dẫn người: [README.md](README.md).
