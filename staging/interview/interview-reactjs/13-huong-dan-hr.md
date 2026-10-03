# Hướng dẫn sử dụng skill phỏng vấn React / Frontend (dành cho HR)

> Tài liệu này giúp HR **điều phối** buổi phỏng vấn kỹ thuật React/Frontend — không cần hiểu sâu code, nhưng cần biết **phỏng vấn ai, bao lâu, dùng file nào, chấm sao**.

---

## 1. Mục đích

- Đánh giá ứng viên React/Frontend theo **9 level** (Junior 1–3 → Senior 1–3)
- Chuẩn hóa câu hỏi và thang điểm giữa các interviewer
- Giảm thiên kiến; tăng khả năng so sánh ứng viên

## 2. Trước buổi phỏng vấn

| Việc | Chi tiết |
|------|----------|
| Xác định **level mục tiêu** | VD: tuyển Mid 2 → phỏng vấn band Mid, có thể kéo sang Senior 1 nếu mạnh |
| Chọn **interviewer** | Dev React/Frontend ≥ level ứng viên + 1 bậc |
| Gửi tài liệu interviewer | Folder [interview-reactjs/](./) — đọc [01-tong-quan.md](./01-tong-quan.md) + bộ câu hỏi theo level |
| Thời lượng gợi ý | Junior: 60–90 ph · Mid: 90–120 ph · Senior: 120–150 ph |
| Chuẩn bị form | [14-form-phong-van.md](./14-form-phong-van.md) — in hoặc copy bảng điểm |

## 3. Cấu trúc buổi phỏng vấn (gợi ý)

| Phần | Thời gian | Tài liệu | Ghi chú |
|------|-----------|----------|---------|
| Giới thiệu & kinh nghiệm | 10 ph | — | HR hoặc tech lead |
| **Cơ bản** | 25–40% thời gian | [03-cau-hoi-co-ban.md](./03-cau-hoi-co-ban.md) | Junior: bắt buộc; Senior: spot-check |
| **Nâng cao** | 0–30% | [04-cau-hoi-nang-cao.md](./04-cau-hoi-nang-cao.md) | Bỏ qua nếu tuyển Junior thuần |
| Research / Phân tích / Teamwork / Quy trình | 20–30% | [05](./05-cau-hoi-research.md)–[08](./08-cau-hoi-quy-trinh.md) | Chọn 2–4 câu phù hợp level |
| Kiến trúc / Bảo mật | 10–25% | [09](./09-cau-hoi-kien-truc.md), [10](./10-cau-hoi-bao-mat.md) | Mid+ |
| **Live code** (product list) | 25–40 ph | [11-live-code-product-list.md](./11-live-code-product-list.md) | Mid+ khuyến nghị |
| **Review code** | 20–35 ph | [12-review-code.md](./12-review-code.md) | Senior khuyến nghị |
| Q&A ứng viên | 10 ph | — | |

### Trọng số theo band (để HR nhắc interviewer)

Xem bảng đầy đủ tại [01-tong-quan.md](./01-tong-quan.md#trọng-số-nhóm-câu-hỏi-theo-band).

- **Junior:** ~55% cơ bản, không bắt nâng cao/kiến trúc sâu
- **Mid:** cân bằng cơ bản + nâng cao + research; live code product list
- **Senior:** nhấn phân tích, kiến trúc, live/review code

## 4. Cách chấm điểm (HR cần biết)

1. Mỗi câu hỏi có **tiêu chí +1 điểm** (Junior / Mid / Senior)
2. **Pass từng câu:** thường Junior ≥ 5/8, tổng Mid+Senior theo rubric trong file
3. **Điểm tổng 285** → map sang 9 level (bảng pass/fail trong [02-tieu-chi-danh-gia.md](./02-tieu-chi-danh-gia.md), form trong [14-form-phong-van.md](./14-form-phong-van.md))
4. **Fail band** nếu thiếu ngưỡng tối thiểu (vd. Junior mà cơ bản < 70% nhóm)

HR **không** cần tự chấm kỹ thuật — chỉ thu form từ interviewer và đối chiếu level đề xuất.

## 5. Sau buổi phỏng vấn

| Việc | Ai |
|------|-----|
| Interviewer điền form điểm + Pass/Consider/Fail | Tech |
| HR tổng hợp feedback gửi hiring manager | HR |
| Lưu form (không chia sẻ đáp án cho ứng viên) | HR / TA |

## 6. Câu hỏi HR có thể hỏi ứng viên (non-tech)

- Quy trình làm việc với BA/QA/Design gần nhất?
- Dự án frontend khó nhất và vai trò của bạn?
- Lý do nghỉ / tìm việc mới?
- Stack React (TypeScript, state lib, testing) bạn quen nhất?

## 7. Red flags HR có thể nhận ra (không cần đọc code)

| Dấu hiệu | Gợi ý |
|----------|--------|
| Interviewer báo “học thuộc lý thuyết” | Consider thấp hơn level |
| Không trả lời được component/state/hooks cơ bản | Dưới Junior 3 |
| Live code product list / review gần như 0 điểm | Không đủ Mid |
| Bất đồng / thái độ kém trong teamwork | Fail culture fit |
| Chỉ biết copy tutorial, không giải thích effect deps | Junior hoặc Consider |

## 8. Liên hệ tài liệu

| File | Khi nào dùng |
|------|----------------|
| [01-tong-quan.md](./01-tong-quan.md) | Hiểu level & trọng số |
| [02-tieu-chi-danh-gia.md](./02-tieu-chi-danh-gia.md) | Pass/fail & rubric |
| [14-form-phong-van.md](./14-form-phong-van.md) | Form chấm điểm |
| [03–10](./03-cau-hoi-co-ban.md) | Câu hỏi lý thuyết |
| [11-live-code-product-list.md](./11-live-code-product-list.md) | Bài thiết kế danh sách sản phẩm |
| [12-review-code.md](./12-review-code.md) | Bài review component `UserList` |
| [brainstoming-reactjs.md](../brainstoming-reactjs.md) | Lịch sử trao đổi yêu cầu (không dùng khi phỏng vấn) |

---
