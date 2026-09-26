---
name: minipower-router
description: Phân loại intent Minipower rồi gợi ý đúng một pack nghề hoặc kênh. Dùng khi làm gì tiếp, chọn skill, dispatcher, không biết mở pack nào — không tự gọi MCP L3, không spawn agent.
metadata:
  audience: hoangnh
  workflow: github
---

# minipower-router

Dispatcher, không orchestrator runtime.

## Bảng intent → pack (một phiên = một pack)

| Intent (gõ) | Pack / skill |
|---|---|
| init project, khởi tạo, project_mode | `minipower-router-init` |
| premise, có nên làm, nghị luận | `minipower-router-deliberation` |
| soát tiền đề trước code/test/deploy | `minipower-router-readiness` |
| khảo sát, DOC-01/02/03, painpoint | `discovery/` |
| UC FR BR AC SRS NFR prototype CR nội dung | `analyst/` |
| SAD ADR API data integration giải pháp bán SOL | `architecture/` |
| WBS kế hoạch rủi ro ticket CR | `pm/` |
| registry họp nhắc thiếu publish chỉ đạo kênh | `support/` |
| test strategy TEST autotest | `qa/` |
| DOC-17 deploy incident metrics | `ops/` |
| báo giá ULNL estimate quotation trước ký | `presales/` |
| Outline wiki publish docs | `docs/` |
| task Lark / OpenProject | `tasks/` |
| tin nhắn Slack/Lark | `chat/` |
| MR GitLab commit push | `vcs/` |
| code .NET Jarvis | `backend/` |

Thiếu input tối thiểu của pack → **hỏi một lượt**, không bịa, không làm hộ pack trước (QĐ-19). Bảng máy: [`intent-dispatch.js`](../../lib/intent-dispatch.js) — ví dụ *Khởi tạo dự án sample* → `minipower-router-init`.

## Gọi chung

Người không cần nhớ tên lá. Prompt kiểu *minipower* · *làm gì tiếp* · mô tả việc trong Agent là đủ.

1. Map intent → **một** dòng bảng trên (pack, rồi lá nếu đã rõ).
2. **Thông báo rồi mới chạy** — một dòng, không chờ OK:

   `Sẽ chạy \`minipower-…\` để xử lý {việc}.`

3. Đọc `SKILL.md` của đúng lá đó. Không spawn pack thứ hai. Không L3 hộ nghề.

Hai pack đều khớp → hỏi người. Loader Cursor có thể tự gắn lá theo `description` nếu đã cài symlink; dispatcher vẫn bắt buộc bước 2 khi bạn đang ở skill này.

Workflow phase cũ (kho chuyển): [sdlc/skills/](../../../sdlc/skills/README.md).

Hướng dẫn người: [README.md](README.md).
