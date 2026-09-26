---
name: minipower-router
description: Phân loại intent Minipower rồi gợi ý đúng một pack nghề hoặc kênh. Dùng khi làm gì tiếp, chọn skill, dispatcher, không biết mở pack nào — không tự gọi MCP L3, không spawn agent.
metadata:
  workflow: github
---

# minipower-router

Dispatcher, không orchestrator runtime. **Route = LLM** (ADR-034 QĐ-4). Keyword [`intent-dispatch.js`](../../lib/intent-dispatch.js) chỉ gợi ý / test vàng — *Khởi tạo dự án sample* → lá init **để nhắc CLI**, không để LLM ghi profile.

Bảng `project_mode` (generated): [kho sdlc](../../../sdlc/SKILL.md#chế-độ-dự-án-project_mode).

## Cách chọn lá

1. Đọc catalog lá đã cài (`minipower-*`, `name:` trong SKILL.md).
2. LLM chọn **đúng một** lá khớp việc (đúng pack + đúng capability). Không bịa tên.
3. **Thông báo rồi mới đọc SOP:**

   `Sẽ chạy \`minipower-…\` để xử lý {việc}.`

4. Việc nhiều bước: kế hoạch, **chờ người OK** rồi mới làm. Không spawn pack thứ hai. Không L3 hộ nghề.

Hai lá ngang nhau → hỏi người.

Bảng dưới là **gợi ý pack** khi LLM định hướng, không phải matcher máy thay bước 2.

## Gợi ý pack (một phiên = một pack)

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

Thiếu input tối thiểu của pack → **hỏi một lượt**, không bịa, không làm hộ pack trước (QĐ-19).

## Gọi chung

Người không cần nhớ tên lá. Prompt kiểu *minipower* · *làm gì tiếp* · mô tả việc trong Agent là đủ.

1. LLM map việc → **một** lá catalog (bảng pack chỉ định hướng).
2. **Thông báo** — một dòng `Sẽ chạy \`minipower-…\` để xử lý {việc}.`
3. Đọc `SKILL.md` của đúng lá. Không spawn pack thứ hai. Không L3 hộ nghề.

Loader Cursor có thể tự gắn lá theo `description`; dispatcher vẫn bắt buộc bước 2.

Workflow phase cũ (kho chuyển): [sdlc/skills/](../../../sdlc/skills/README.md).

Hướng dẫn người: [README.md](README.md).
