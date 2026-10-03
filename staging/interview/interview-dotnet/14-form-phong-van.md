# Form phỏng vấn

> Mẫu ghi nhận kết quả phỏng vấn / chấm điểm. Ánh xạ level: [02-tieu-chi-danh-gia.md](./02-tieu-chi-danh-gia.md) · Rubric: [01-tong-quan.md](./01-tong-quan.md)

---

## Thông tin ứng viên

| Thông tin | Nội dung |
|-----------|----------|
| Họ tên | |
| Ngày phỏng vấn | |
| Vị trí ứng tuyển | Junior 1–3 / Mid 1–3 / Senior 1–3 |
| Band phỏng vấn (chọn một) | ☐ Junior · ☐ Mid · ☐ Senior |
| Người phỏng vấn | |
| Link CV | |

## File áp dụng theo band

| Band | File chấm |
|------|-----------|
| **Junior** | 03 |
| **Mid** | 03, 04, 05, 07, 08, 09, 10, 11 |
| **Senior** | 03, 04, 05, 06, 07, 08, 09, 10, 11, 12 |

**Tổng điểm tối đa rubric (nếu chấm hết file của band):** Junior **72** · Mid **372** · Senior **768**  
**Cap form (ghi nhận tổng):** **285** — xem cột *Cap form* bên dưới.

## Bảng tổng kết điểm

> **Cách chấm:** Điền **Điểm đạt** theo band đã chọn. Mid/Senior ở file có nhiều band: dùng cột **tích lũy** (vd. Mid max 18 = 8 Junior + 10 Mid trong cùng câu). Cột **—** = không có rubric band đó.  
> **Pass gợi ý** theo từng câu: xem [chi tiết](#chi-tiết-từng-câu-hỏi).

### Tổng hợp theo nhóm

| Nhóm | File | Junior (max) | Mid (max) | Senior (max) | Cap form | Điểm đạt |
|------|------|:------------:|:---------:|:------------:|:--------:|----------:|
| Cơ bản | [03](./03-cau-hoi-co-ban.md) | 72 | 162 | 270 | 72 | |
| Nâng cao | [04](./04-cau-hoi-nang-cao.md) | — | 90 | 198 | 72 | |
| Research | [05](./05-cau-hoi-research.md) | — | 16 | 36 | 16 | |
| Phân tích | [06](./06-cau-hoi-phan-tich.md) | — | — | 20 | 16 | |
| Teamwork | [07](./07-cau-hoi-teamwork.md) | — | 24 | 54 | 24 | |
| Quy trình | [08](./08-cau-hoi-quy-trinh.md) | — | 16 | 36 | 16 | |
| Kiến trúc | [09](./09-cau-hoi-kien-truc.md) | — | 24 | 54 | 24 | |
| Bảo mật | [10](./10-cau-hoi-bao-mat.md) | — | 30 | 66 | 24 | |
| Live code | [11](./11-live-code-email.md) | — | 10 | 22 | 16 | |
| Review code | [12](./12-review-code.md) | — | — | 12 | 15 | |
| **Tổng rubric** | | **72** | **372*** | **768*** | | |
| **Tổng cap form** | | | | | **285** | |

*\*Tổng Mid/Senior rubric = cộng các nhóm trong [file áp dụng](#file-áp-dụng-theo-band) (không phải cộng toàn bộ cột Mid/Senior của mọi file).*

**Level đề xuất (theo điểm tổng cap form):** ☐ Junior 1 · ☐ Junior 2 · ☐ Junior 3 · ☐ Mid 1 · ☐ Mid 2 · ☐ Mid 3 · ☐ Senior 1 · ☐ Senior 2 · ☐ Senior 3

---

## Chi tiết từng câu hỏi

### Cơ bản — [03](./03-cau-hoi-co-ban.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 1 | Interface và Abstract class khác nhau thế nào? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 2 | `class` và `struct` khác nhau như thế nào? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 3 | `Equals()`, `GetHashCode()` và `==` có vai trò gì? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 4 | `async`/`await` hoạt động như thế nào? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 5 | `IEnumerable<T>`, `IQueryable<T>`, `List<T>` khác nhau thế nào? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 6 | ORM là gì? Vì sao dùng ORM? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 7 | Cơ sở dữ liệu: bảng, quan hệ, chuẩn hóa (normalization) là gì? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 8 | Index trong database là gì? Vì sao cần index? | 8 | 18 | 30 | 5 / 14 / 24 | |
| 9 | Caching là gì? Khi nào cache? Trade-off? | 8 | 18 | 30 | 5 / 14 / 24 | |
| | **Tổng** | **72** | **162** | **270** | **45 / 126 / 216** | |

### Nâng cao — [04](./04-cau-hoi-nang-cao.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 10 | Dependency Injection (DI) là gì? | — | 10 | 22 | — / 9 / 18 | |
| 11 | Entity Framework Core: DbContext, migrations, tracking, N+1 | — | 10 | 22 | — / 9 / 18 | |
| 12 | ASP.NET Core: middleware, pipeline, filters | — | 10 | 22 | — / 9 / 18 | |
| 13 | Caching thực chiến: Redis, `IMemoryCache`, distributed cache | — | 10 | 22 | — / 9 / 18 | |
| 14 | Transaction database và tối ưu query cơ bản | — | 10 | 22 | — / 9 / 18 | |
| 15 | Performance .NET và Garbage Collector (GC) | — | 10 | 22 | — / 9 / 18 | |
| 16 | Index và tối ưu query thực chiến | — | 10 | 22 | — / 9 / 18 | |
| 17 | Message broker (RabbitMQ/Kafka): khái niệm và khi nào dùng? | — | 10 | 22 | — / 9 / 18 | |
| 18 | Xử lý upload file: validation, streaming, bảo mật | — | 10 | 22 | — / 9 / 18 | |
| | **Tổng** | **—** | **90** | **198** | **— / 81 / 162** | |

### Research — [05](./05-cau-hoi-research.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 19 | Khi gặp lỗi mới, bạn thường research như thế nào? | — | 8 | 18 | — / 7 / 16 | |
| 20 | Làm sao biết một giải pháp trên Internet có đáng tin? | — | 8 | 18 | — / 7 / 16 | |
| | **Tổng** | **—** | **16** | **36** | **— / 14 / 32** | |

### Phân tích — [06](./06-cau-hoi-phan-tich.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 21 | Nếu API chạy chậm, bạn sẽ phân tích như thế nào? | — | — | 10 | — / — / 7 | |
| 22 | Có hai cách giải quyết cùng một vấn đề, bạn chọn theo tiêu chí nào? | — | — | 10 | — / — / 7 | |
| | **Tổng** | **—** | **—** | **20** | **— / — / 14** | |

### Teamwork — [07](./07-cau-hoi-teamwork.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 23 | Khi review code của đồng đội, bạn góp ý như thế nào? | — | 8 | 18 | — / 7 / 16 | |
| 24 | Khi bất đồng kỹ thuật với đồng đội, bạn xử lý ra sao? | — | 8 | 18 | — / 7 / 16 | |
| 25 | Phối hợp với QA, BA, DevOps như thế nào? | — | 8 | 18 | — / 7 / 16 | |
| | **Tổng** | **—** | **24** | **54** | **— / 21 / 48** | |

### Quy trình — [08](./08-cau-hoi-quy-trinh.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 26 | Git workflow bạn thường dùng? | — | 8 | 18 | — / 7 / 16 | |
| 27 | CI/CD và release: Definition of Done (DoD) gồm những gì? | — | 8 | 18 | — / 7 / 16 | |
| | **Tổng** | **—** | **16** | **36** | **— / 14 / 32** | |

### Kiến trúc — [09](./09-cau-hoi-kien-truc.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 28 | SOLID là gì? Bạn áp dụng như thế nào? | — | 8 | 18 | — / 7 / 16 | |
| 29 | Bạn đánh giá và xử lý technical debt như thế nào? | — | 8 | 18 | — / 7 / 16 | |
| 30 | Clean Architecture vs Microservices: khi nào chọn gì? | — | 8 | 18 | — / 7 / 16 | |
| | **Tổng** | **—** | **24** | **54** | **— / 21 / 48** | |

### Bảo mật — [10](./10-cau-hoi-bao-mat.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| 31 | Authentication và Authorization khác nhau thế nào? | — | 10 | 22 | — / 9 / 18 | |
| 32 | Password nên lưu như thế nào? | — | 10 | 22 | — / 9 / 18 | |
| 33 | Phân biệt JWT, OAuth2, OpenID Connect | — | 10 | 22 | — / 9 / 18 | |
| | **Tổng** | **—** | **30** | **66** | **— / 27 / 54** | |

### Live code (email) — [11](./11-live-code-email.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| — | Thiết kế gửi email (pseudocode) | — | 10 | 22 | — / 9 / 18 | |
| | **Tổng** | **—** | **10** | **22** | **— / 9 / 18** | |

### Review code — [12](./12-review-code.md)

| Câu | Nội dung | Junior (max) | Mid (max) | Senior (max) | Pass gợi ý (J / M / S) | Điểm đạt |
|-----|----------|:------------:|:---------:|:------------:|:----------------------:|----------:|
| — | Review `OrderNotificationService` | — | — | 12 | — / — / 9 | |
| | **Tổng** | **—** | **—** | **12** | **— / — / 9** | |



## Đánh giá cuối

**Ưu điểm:**  
..........................................

**Điểm yếu:**  
..........................................

**Đề xuất:** ☐ Pass · ☐ Consider · ☐ Fail  

**Ghi chú:**  
....................................................................
