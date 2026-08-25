# Minipower

**Minipower** là **AI Operating Model** của doanh nghiệp — mô hình vận hành viết thành dạng AI thi hành được: chứa **kỹ năng của từng vị trí** và **quy trình của từng phòng ban — kể cả quy trình liên phòng ban**, dưới dạng AI thi hành được; tích hợp với bộ công cụ công ty đang dùng (quản lý việc, wiki, Git, giám sát) để doanh nghiệp **vận hành theo quy trình phát triển phần mềm thống nhất** — từ dự án làm nhanh để demo (`mvp`), làm chuẩn để bàn giao (`standard`), tới tiếp quản hệ đang chạy (`maintain`).

Cách làm dựa trên ba nguyên tắc:

1. **Đặt AI vào quy trình có kỷ luật — con người cầm lái.** AI làm phần chuẩn bị: phỏng vấn khách, soạn tài liệu, phản biện, phân tích trade-off; **con người là người quyết ở từng chặng**. Thiếu thông tin thì ghi `TBD`, không bịa. Mọi sản phẩm — từ yêu cầu tới test — nối nhau bằng ID truy vết được (UC → FR → AC → Test): đổi một yêu cầu là thấy ngay nó chạm tài liệu nào, code nào, test nào.
2. **Đóng gói kinh nghiệm thành skill dùng lại được.** Kinh nghiệm dẫn dự án (BA/SA/PM) và kinh nghiệm dựng code (.NET) không nằm trong đầu ai nữa — nằm trong các module skill, cài thẳng vào công cụ AI đang dùng (Cursor, Claude, OpenCode). Ai cần gì cài phần đó; gõ "minipower" trong ô search là thấy toàn bộ đồ nghề.
3. **Giữ cách làm, không giữ dữ liệu.** minipower chứa quy trình, template và quy tắc truy vết — tức *cách làm việc*; còn tài liệu nghiệp vụ, code và task của từng dự án vẫn nằm ở hệ thống chuyên trách của chúng (wiki, Git, công cụ quản lý việc). minipower không phải kho lưu trữ.

**License:** [MIT](LICENSE) · Copyright (c) 2026 Hoàng Nguyễn

---

## Minipower có gì?

Hai **module** (đơn vị cài, chứa skill) + hai **tầng nền** (đọc trực tiếp, không cần cài). Hướng dẫn cài nằm trong từng module.

| Thành phần | Loại | Giải quyết việc gì | Bắt đầu |
|------------|------|--------------------|---------|
| **Quy trình phát triển** — [`sdlc/`](sdlc/) | Module | Dẫn dự án từ nỗi đau khách hàng → SRS, kiến trúc, kế hoạch, tài liệu bàn giao chuẩn nghề (IEEE 830, BABOK, PMBOK) qua 6 giai đoạn — mỗi chặng con người duyệt rồi mới đi tiếp | [sdlc/README.md](sdlc/README.md) · cài: [sdlc/INSTALL.md](sdlc/INSTALL.md) |
| **Code backend .NET** — [`backend/`](backend/) | Module | Dựng backend .NET theo framework Jarvis chuẩn công ty: scaffold chạy được ngay, gắn auth / cache / EF / observability theo nhu cầu, review PR trước khi merge — 15 skill `minipower-backend-*` | [backend/README.md](backend/README.md) · cài: [§ Cài vào Cursor](backend/README.md#cài-vào-cursor) |
| [`contracts/`](contracts/) | Tầng nền | Luật chơi chung giữa các module và giữa repo tài liệu ↔ repo code: trace spine, điểm bàn giao H1–H6, quy ước chung, schema `PACK.md` | [contracts/README.md](contracts/README.md) |
| [`fundamentals/`](fundamentals/) | Tầng nền | Kiến thức nền .NET / DDD / testing, template viết skill, bộ phỏng vấn kỹ thuật — dùng bằng cách `@` thẳng file trong workspace, không cần cài | [fundamentals/tutorial-index.md](fundamentals/tutorial-index.md) |

---

## Ba chế độ dự án

Không dự án nào cũng cần đủ 19 tài liệu. Quy trình phát triển (`sdlc`) có **`project_mode`**, chọn khi khởi tạo, quyết định *tài liệu nào cần điền* và *cảnh báo nào bật* — nhưng **dùng chung một cấu trúc thư mục**, nên đổi chế độ về sau không phải di trú gì.

| Chế độ | Khi nào chọn | Điền gì | Lên đời |
|--------|--------------|---------|---------|
| **`mvp`** | *"3 tuần nữa demo, làm chạy được trước"* | BRD + FR + AC + hướng dẫn triển khai rút gọn | Trả nợ theo `doc-debt.md` → chốt baseline → `standard` |
| **`standard`** | Outsource, sản phẩm mới, khách nghiệm thu theo tài liệu | Đủ 19 DOC, có baseline, sau baseline đổi gì cũng qua CR | Bàn giao / vận hành |
| **`maintain`** | Tiếp quản hệ chạy nhiều năm, tài liệu thất lạc | Khai quật cái **đang có**: business rule, kiến trúc, data model, runbook | As-built đủ → chốt baseline → `standard` |

Chỉ `standard` có cảnh báo **chặn** (và luôn mở được bằng `BYPASS`); hai chế độ kia chỉ nhắc. Ở mọi chế độ, **con người là người ra lệnh** — hệ cảnh báo, bạn xác nhận là chạy.

Chi tiết: [sdlc/SKILL.md § Chế độ dự án](sdlc/SKILL.md#chế-độ-dự-án-project_mode)

---

## Hướng dẫn bắt đầu

Ba bước từ số 0 tới phiên làm việc đầu tiên:

**1. Cài module cần dùng** vào công cụ AI đang xài (Cursor / Claude / OpenCode):

- **Quy trình phát triển** — một symlink thành skill `minipower-sdlc` + bộ hook: [sdlc/INSTALL.md](sdlc/INSTALL.md)
- **Code backend .NET** — symlink từng skill lá: [backend § Cài vào Cursor](backend/README.md#cài-vào-cursor)

**2. Khởi tạo dự án** — trong workspace dự án, gõ:

```text
/minipower-sdlc
Init project ten-du-an
```

Agent hỏi **trọn gói 7 câu** (tên & xưng hô · vai trò · dự án làm gì · giai đoạn · kinh nghiệm · chế độ dự án · nơi phê duyệt) rồi tự dựng khung `docs/` · `memory/` · `assets/` · `brainstorm/` và sinh `AGENTS.md` / `CLAUDE.md` cá nhân hoá theo chế độ đã chọn — từ đó trợ lý biết bạn là ai, dự án đang ở đâu, và phải dẫn bạn theo hướng nào.

**3. Làm việc** — mỗi prompt khai giai đoạn + phạm vi, agent tự đọc đúng skill:

```text
Phase: requirements
/minipower-sdlc
Viết FR cho luồng đặt hàng, module ORD, DOC-06
```

Việc code .NET chỉ cần mô tả bằng lời — skill tương ứng tự kích hoạt: *"thêm cache Redis cho service đơn hàng"* → `minipower-backend-caching-dotnet` vào việc.

---

## Liên kết nhanh

- [Quy trình phát triển — sdlc hub](sdlc/README.md) · [sdlc router (SKILL.md)](sdlc/SKILL.md) · [19 DOC templates](sdlc/templates/README.md)
- [backend hub](backend/README.md)
- [contracts — hợp đồng liên-pack](contracts/README.md)
- [fundamentals — tutorial index](fundamentals/tutorial-index.md) · [interview](fundamentals/interview/)
