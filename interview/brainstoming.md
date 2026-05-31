# Brainstorming — Overview

> File này **chỉ** lưu trao đổi yêu cầu giữa bạn và AI.  
> **Kết quả làm việc** nằm trong thư mục [interview-/](./interview-*/) — xem [interview-*/README.md](./interview-*/README.md).

---

## A. Nỗi đau (vấn đề hiện tại)

1. **Phỏng vấn tốn thời gian nhưng kém hiệu quả** — ứng viên yếu nhưng khó lọc sớm lúc chọn CV; đến vòng phỏng vấn mới phát hiện không đạt.
2. **Bài test IQ / test ngoài chiếm slot** — ứng viên làm bài lâu, phải chờ; hết thời gian cho phỏng vấn kỹ thuật sâu (cơ bản, nâng cao, live code, review code…).
3. **Ứng viên phụ thuộc AI** — quen hỏi–đáp để sửa lỗi, thiếu nền tảng; kém **phân tích, debug, xử lý lỗi** thực tế khi không có AI.

## B. Mong muốn (định hướng sản phẩm)

Dùng **bộ skill interview** để:

| Bước | Ai | Việc |
|------|-----|------|
| 1 | Ứng viên | Trả lời bộ câu hỏi / bài (theo rubric trong `interview-*/`) |
| 2 | AI | **Tự chấm điểm** theo tiêu chí đã xây dựng sẵn (Junior/Mid/Senior, red flag, pass criteria) |
| 3 | HR | Kiểm tra kết quả; **chỉ gọi tech lead phỏng vấn trực tiếp** nếu đạt ngưỡng |
| 4 | Tech lead (tôi) | Phỏng vấn sâu, tập trung phần **không lặp** — không hỏi lại hàng chục câu lý thuyết đã có trong skill |

**Lợi ích kỳ vọng:**

- Lọc sớm ứng viên không đủ nền / học vẹt / phụ thuộc AI.
- Giảm thời gian tech lead cho câu hỏi lặp đi lặp lại.
- HR có căn cứ điểm số + level đề xuất trước khi xếp lịch.

**Trạng thái hiện tại:** Đã có **ngân hàng câu hỏi + rubric chấm** trong `interview-*/`. Bước **AI tự chấm + luồng ứng viên online** — *chưa triển khai* (cần thiết kế form/flow hoặc tích hợp agent sau).

---

## Yêu cầu ban đầu

Viết các câu hỏi phỏng vấn theo ngôn ngữ cho 3 level **Junior, Mid, Senior**. Mỗi câu có câu trả lời và **tiêu chí đánh giá** theo từng level.

**Phạm vi:**

- Kiến thức nền tảng
- Kiến thức nâng cao
- Khả năng research
- Phân tích và giải quyết vấn đề
- Teamwork

Có thể bổ sung thêm phạm vi nếu phù hợp.

---

## Theo vị trí / ngôn ngữ

Mỗi vị trí có file brainstorming riêng (yêu cầu & lịch sử trao đổi) và thư mục skill tương ứng:

| Vị trí | Brainstorming | Skill |
|--------|---------------|-------|
| **C# / .NET** | [brainstoming-dotnet.md](./brainstoming-dotnet.md) | [interview-dotnet/](./interview-dotnet/) |
| **React / Frontend** | [brainstoming-reactjs.md](./brainstoming-reactjs.md) | [interview-reactjs/](./interview-reactjs/) |

Phần **A–B** và **yêu cầu ban đầu** ở trên áp dụng chung; chi tiết stack, chủ đề câu hỏi, trạng thái triển khai — xem file theo vị trí.
