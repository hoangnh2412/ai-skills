# Tiêu chí đánh giá ứng viên

> Pass/fail theo 9 level, meta đánh giá ngầm và red flags tổng hợp.  
> **Form chấm điểm:** [14-form-phong-van.md](./14-form-phong-van.md)

---

## Pass / Fail theo điểm tổng

> Tối đa **285 điểm**. Dưới **90** = chưa đạt Junior 1.  
> Đạt level nghĩa là thỏa **yêu cầu tích lũy** đến level đó (xem [01-tong-quan.md](./01-tong-quan.md)).

| Level | Điểm gợi ý | Điều kiện |
|-------|------------|-----------|
| **Junior 1** | 90 – 109 | Hiểu core React/JS, cần mentor sát |
| **Junior 2** | 110 – 129 | Làm task UI đơn giản ổn định, học nhanh |
| **Junior 3** | 130 – 149 | Tự code end-to-end CRUD page, gọi API, routing, UI theo design |
| **Mid 1** | 150 – 169 | Research thư viện theo hướng dẫn, phối hợp QA/BA |
| **Mid 2** | 170 – 189 | Độc lập 1 feature frontend, trade-off cơ bản |
| **Mid 3** | 190 – 209 | Thiết kế module UI, mentor, xử lý bug production |
| **Senior 1** | 210 – 229 | Thiết kế giải pháp feature/system frontend |
| **Senior 2** | 230 – 259 | System thinking, dẫn dắt kỹ thuật frontend |
| **Senior 3** | 260 – 285 | Kiến trúc frontend, strategy, leadership |

## Format chấm từng câu hỏi

| Thành phần | Mô tả |
|------------|--------|
| **Mục tiêu đánh giá** | Kỹ năng/knowledge cần đo |
| **Đáp án kỳ vọng** | Nội dung trả lời đúng (có thể kèm code mẫu) |
| **Band rubric** | Tiêu chí +1 điểm theo band **có trong file** (xem [01-tong-quan.md](./01-tong-quan.md)); Senior có điều kiện tiên quyết đạt Mid khi file có cả hai band |
| **Red flags** | Dấu hiệu fail hoặc nghi ngờ học vẹt |
| **Pass criteria** | Ngưỡng theo band trong file (vd. Junior 5/8 · Mid 14/18 · Senior 24/30 · hoặc Mid 9/10 · Senior 18/22 · hoặc Senior 9/12) |
| **Follow-up** | Câu hỏi khai thác sâu / phân biệt level |

**Thang kỹ thuật:** 8 / 10 / 12 tiêu chí (+1 mỗi tiêu chí).  
**Thang soft-skill:** 6 / 8 / 10 tiêu chí.

**File theo band phỏng vấn:** Junior → **03** · Mid → **03, 04, 05, 07, 08, 09, 10, 11** · Senior → **03–12** (06, 12 chỉ band Senior).

## Meta đánh giá ngầm (interviewer)

| Dấu hiệu | Ý nghĩa |
|----------|---------|
| Trả lời textbook | Có thể học thuộc |
| Có ví dụ production | Có thực chiến |
| Phân tích trade-off | Tư duy senior |
| Quan tâm maintainability | Từng maintain app lớn |
| Nói về testing (RTL, E2E) | Engineering mindset |
| Nói về a11y, perf, bundle | Frontend mature |

## Red flags tổng hợp

| Loại | Dấu hiệu |
|------|----------|
| Học vẹt | Textbook, không ví dụ thực tế |
| Fake senior | Chỉ nói pattern, không hooks/effect/perf thực chiến |
| CRUD only | Không production mindset, không hiểu re-render/effect deps |
| Senior giấy | "Luôn Redux", không biết khi nào local state đủ |
| Tutorial dev | Copy Stack Overflow effect deps `[]` mọi nơi |
