# Tổng quan — Skill phỏng vấn C# Developer

> Khái niệm level, mục tiêu năng lực, trọng số, cấu trúc bộ tài liệu và luồng sử dụng dự kiến.  
> Lịch sử trao đổi yêu cầu: [../brainstoming.md](../brainstoming.md) · Danh sách file: [README.md](./README.md)

---

## Vấn đề & mục tiêu sản phẩm

### Nỗi đau cần giải quyết

1. **Phỏng vấn tốn thời gian, kém hiệu quả** — ứng viên yếu khó lọc sớm từ CV.
2. **Bài test IQ / test ngoài chiếm slot** — ít thời gian cho phỏng vấn kỹ thuật sâu (cơ bản, nâng cao, live code, review code).
3. **Phụ thuộc AI** — thiếu nền tảng, kém phân tích / debug / xử lý lỗi khi không có AI.

### Luồng sử dụng dự kiến

| Bước | Ai | Việc |
|------|-----|------|
| 1 | Ứng viên | Trả lời bộ câu hỏi & bài (theo rubric trong `interview/`) |
| 2 | AI | Tự chấm điểm theo tiêu chí đã xây dựng (Junior/Mid/Senior, red flag, pass criteria) |
| 3 | HR | Kiểm tra kết quả; chỉ xếp lịch tech lead nếu đạt ngưỡng |
| 4 | Tech lead | Phỏng vấn sâu — **không lặp** hàng chục câu lý thuyết đã có trong skill |

**Trạng thái:** Đã có **33 câu hỏi + rubric + form + live/review**. Bước **AI tự chấm + luồng online** — *chưa triển khai*.

---

## Mục đích skill

Đánh giá ứng viên **C# / .NET backend** theo thang **9 level** (Junior 1–3, Mid 1–3, Senior 1–3), dựa trên:

| Nhóm | Nội dung |
|------|----------|
| **Cơ bản** | C# OOP, async, collection/LINQ; khái niệm ORM, database, index, caching |
| **Nâng cao** | EF Core, DI, ASP.NET Core, cache/DB thực chiến, performance, query, message broker, file |
| **Research** | Quy trình tìm hiểu, đánh giá nguồn tin |
| **Phân tích** | API chậm, trade-off giải pháp |
| **Teamwork** | Code review, bất đồng kỹ thuật, QA/BA/DevOps |
| **Quy trình** | Git, CI/CD, DoD |
| **Kiến trúc** | SOLID, technical debt, Clean Architecture vs Microservices |
| **Bảo mật** | Auth/Authz, password, JWT/OAuth/OIDC |
| **Thực hành** | Live design (email), review code có lỗi cố ý |

---

## Thang điểm & format chấm

### Thang ý nghĩa (tham chiếu)

| Điểm | Ý nghĩa |
|------|---------|
| 1 | Không biết / trả lời sai hoàn toàn |
| 2 | Biết khái niệm cơ bản nhưng mơ hồ |
| 3 | Trả lời đúng mức làm việc được |
| 4 | Hiểu tốt, có kinh nghiệm thực tế |
| 5 | Hiểu sâu, phân tích trade-off, tư duy kiến trúc/dẫn dắt |

### Format mỗi câu hỏi (file 03–10, 11–12)

Mục tiêu đánh giá → Đáp án kỳ vọng → **band rubric** (+1 điểm/tiêu chí) → Red flags → Pass criteria → Follow-up.

Mỗi file chỉ giữ **band rubric áp dụng** cho level phỏng vấn (không lặp band thấp hơn):

| Band phỏng vấn | File sử dụng | Band rubric trong file |
|----------------|--------------|-------------------------|
| **Junior** | 03 | Junior + Mid + Senior |
| **Mid** | 03, 04, 05, 07, 08, 09, 10, 11 | 03: đủ 3 band; còn lại: **Mid + Senior** |
| **Senior** | 03, 04, 05, 06, 07, 08, 09, 10, 11, 12 | 03–05, 07–11: Mid + Senior; **06, 12: Senior only** |

- **Kỹ thuật (8/10/12):** pass gợi ý **5/8 · 14/18 · 24/30** (tích lũy) hoặc **9/10 · 18/22** (Mid/Senior) hoặc **9/12** (Senior only).
- **Soft-skill (6/8/10):** pass gợi ý **4/6 · 9/14 · 16/24** hoặc **7/8 · 16/18** hoặc **7/10**.

Chi tiết pass/fail tổng và meta đánh giá: [02-tieu-chi-danh-gia.md](./02-tieu-chi-danh-gia.md) · Form chấm: [14-form-phong-van.md](./14-form-phong-van.md).

---

## Mục tiêu theo level (9 bậc)

> **Junior 1** < **Junior 2** < **Junior 3** < **Mid 1** < **Mid 2** < **Mid 3** < **Senior 1** < **Senior 2** < **Senior 3**  
> Level cao hơn **bao gồm toàn bộ** yêu cầu level ngay bên dưới, cộng thêm phần bổ sung.

| Level | Mục tiêu chính |
|-------|----------------|
| **Junior 1** | *(Nền tảng)* Nắm khái niệm C#/.NET cơ bản (type, OOP, syntax); làm task nhỏ khi có spec và hướng dẫn chi tiết; cần review thường xuyên |
| **Junior 2** | **Junior 1**, cộng thêm: hiểu đúng khái niệm và áp dụng vào code đơn giản; tự hoàn thành task quen thuộc; biết hỏi đúng chỗ khi kẹt; có tư duy học hỏi |
| **Junior 3** | **Junior 2**, cộng thêm: tự code end-to-end tính năng cơ bản (CRUD, danh mục, login, logout); debug lỗi thường gặp; đọc hiểu code team; nắm convention và quy trình làm việc |
| **Mid 1** | **Junior 3**, cộng thêm: tìm hiểu thư viện, công nghệ mới và áp dụng vào task khi có hướng dẫn/chỉ định từ Mid 3; hoàn thành phần việc được giao trong feature; phối hợp làm việc với QA, BA; viết code theo chuẩn team |
| **Mid 2** | **Mid 1**, cộng thêm: làm việc độc lập trong phạm vi 1 feature với requirement rõ; hiểu trade-off cơ bản; viết code dễ đọc, có test; debug có hệ thống; phối hợp thêm DevOps |
| **Mid 3** | **Mid 2**, cộng thêm: thiết kế giải pháp trong phạm vi module; chọn và hướng dẫn Mid 1 áp dụng thư viện/công nghệ; đánh giá technical choice; mentor Junior; xử lý bug/incident production phổ biến |
| **Senior 1** | **Mid 3**, cộng thêm: thiết kế giải pháp feature/system; ra quyết định kỹ thuật có căn cứ (data, POC); hiểu production constraints |
| **Senior 2** | **Senior 1**, cộng thêm: tư duy hệ thống; dẫn dắt kỹ thuật team; thiết lập chuẩn code/review; cân bằng delivery, quality, technical debt |
| **Senior 3** | **Senior 2**, cộng thêm: kiến trúc hệ thống & scale; technical strategy; dẫn dắt nhiều người; onboarding team; đại diện kỹ thuật với stakeholder |

### Ánh xạ điểm tổng → level (tối đa 285)

| Level | Điểm | Ghi chú |
|-------|------|---------|
| Junior 1 | 90 – 109 | Dưới 90 = chưa đạt Junior 1 |
| Junior 2 | 110 – 129 | |
| Junior 3 | 130 – 149 | |
| Mid 1 | 150 – 169 | |
| Mid 2 | 170 – 189 | |
| Mid 3 | 190 – 209 | |
| Senior 1 | 210 – 229 | |
| Senior 2 | 230 – 259 | |
| Senior 3 | 260 – 285 | |

---

## Trọng số nhóm câu hỏi theo band

> Mỗi cột **Junior / Mid / Senior** cộng **100%** — tỷ lệ thời gian/câu hỏi khi phỏng vấn ở band tương ứng.

| Nhóm | File | Junior | Mid | Senior |
|------|------|:------:|:---:|:------:|
| Cơ bản | 03 | **55%** | **25%** | **10%** |
| Nâng cao | 04 | **0%** | **20%** | **15%** |
| Research | 05 | **5%** | **15%** | **10%** |
| Phân tích & giải quyết vấn đề | 06 | **10%** | **15%** | **25%** |
| Teamwork | 07 | **15%** | **10%** | **15%** |
| Quy trình | 08 | **5%** | **5%** | **5%** |
| Kiến trúc & thiết kế | 09 | **0%** | **5%** | **10%** |
| Bảo mật | 10 | **10%** | **5%** | **10%** |
| **Tổng** | | **100%** | **100%** | **100%** |

*Live code (11) và Review code (12) tính vào nhóm **Phân tích** khi chấm tổng.*

### Ghi chú áp dụng

- **Junior:** Ưu tiên nền tảng; **không** yêu cầu nâng cao / kiến trúc sâu; bảo mật ở mức login/logout.
- **Mid:** Nền tảng sâu hơn; bật nâng cao + research; kiến trúc module; QA/BA (Mid 1), DevOps (Mid 2).
- **Senior:** Nền tảng/nâng cao là điều kiện cần; trọng tâm phân tích, thiết kế, dẫn dắt.

### Ngưỡng tối thiểu theo nhóm (fail band dù tổng điểm cao)

| Nhóm | Junior | Mid | Senior |
|------|--------|-----|--------|
| Cơ bản | ≥ 70% điểm nhóm | ≥ 65% | ≥ 60% |
| Nâng cao | Không bắt buộc | ≥ 50% | ≥ 55% |
| Phân tích + Kiến trúc* | — | ≥ 50% phân tích | ≥ 60% (phân tích + kiến trúc) |
| Teamwork | ≥ 50% | ≥ 50% | ≥ 65% |

*\*Senior: cộng điểm nhóm Phân tích và Kiến trúc.*

---

## Cấu trúc tài liệu (14 file)

| # | File | Câu / nội dung |
|---|------|----------------|
| 01 | [01-tong-quan.md](./01-tong-quan.md) | Tài liệu này |
| 02 | [02-tieu-chi-danh-gia.md](./02-tieu-chi-danh-gia.md) | Pass/fail, format chấm, meta, red flags |
| 03 | [03-cau-hoi-co-ban.md](./03-cau-hoi-co-ban.md) | **Câu 1–9** — Junior/Mid/Senior |
| 04 | [04-cau-hoi-nang-cao.md](./04-cau-hoi-nang-cao.md) | **Câu 10–18** — Mid/Senior |
| 05 | [05-cau-hoi-research.md](./05-cau-hoi-research.md) | **Câu 19–20** — Mid/Senior |
| 06 | [06-cau-hoi-phan-tich.md](./06-cau-hoi-phan-tich.md) | **Câu 21–22** — Senior only |
| 07 | [07-cau-hoi-teamwork.md](./07-cau-hoi-teamwork.md) | **Câu 23–25** — Mid/Senior |
| 08 | [08-cau-hoi-quy-trinh.md](./08-cau-hoi-quy-trinh.md) | **Câu 26–27** — Mid/Senior |
| 09 | [09-cau-hoi-kien-truc.md](./09-cau-hoi-kien-truc.md) | **Câu 28–30** — Mid/Senior |
| 10 | [10-cau-hoi-bao-mat.md](./10-cau-hoi-bao-mat.md) | **Câu 31–33** — Mid/Senior |
| 11 | [11-live-code-email.md](./11-live-code-email.md) | Live email — Mid/Senior |
| 12 | [12-review-code.md](./12-review-code.md) | Review code — Senior only |
| 13 | [13-huong-dan-hr.md](./13-huong-dan-hr.md) | Hướng dẫn HR |
| 14 | [14-form-phong-van.md](./14-form-phong-van.md) | Form chấm điểm (285 điểm) |

Mỗi file câu hỏi **03–10** có **Mục lục** ở đầu file (link nhảy tới từng câu).

### Phân bổ điểm form (285)

| Nhóm | Điểm tối đa |
|------|-------------|
| Cơ bản (03) | 72 |
| Nâng cao (04) | 72 |
| Research (05) | 16 |
| Phân tích (06) | 16 |
| Teamwork (07) | 24 |
| Quy trình (08) | 16 |
| Kiến trúc (09) | 24 |
| Bảo mật (10) | 24 |
| Live code (11) | 16 |
| Review code (12) | 15 |
| **Tổng** | **285** |

---

## Ai đọc file nào?

| Vai trò | File ưu tiên |
|---------|----------------|
| HR | 01, 13, 14 |
| Interviewer / Tech lead | 01, 02, 03–12 (chọn nhóm theo level ứng viên) |
| Ứng viên (khi có luồng online) | Chỉ đề bài — **không** đưa đáp án / rubric interviewer |
