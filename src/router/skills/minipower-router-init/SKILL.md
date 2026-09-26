---
name: minipower-router-init
description: Init dự án bằng CLI minipower init, không phỏng vấn LLM. Đã có .minipower thì nói CLI đã xong. Chưa có thì in lệnh init. Dùng khi init project, khởi tạo dự án — support không init.
metadata:
  audience: hoangnh
  workflow: github
---

# minipower-router-init

**Không** thuộc support (QĐ-14). **Ghi cây + profile = CLI** `minipower init` ([ADR-031](../../../../ADRs/ADR-031-2026-09-01-cli-install-init-thay-llm-thi-hanh.md) QĐ-9). Skill **không** mkdir, **không** hỏi 7 câu, **không** ghi `profile.json` / `profile.user.json`.

## Đã có `.minipower/`

Một đoạn: init đã chạy bằng script; SSOT là `memory/profile.json`. Muốn sửa → người chạy lại `minipower init`. Dừng.

## Chưa có marker

```text
node <factory>/cli/minipower.mjs init
# sau install:  node .minipower/bin/minipower init
```

CLI hỏi từng bước. Thiếu trường → CLI FAIL, **không** đệm bằng LLM.

Hướng dẫn người: [README.md](README.md).
