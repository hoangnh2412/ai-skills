# Brainstorming — Phỏng vấn C# / .NET Developer

> Trao đổi yêu cầu **theo vị trí này**.  
> Bối cảnh chung (nỗi đau, luồng AI, yêu cầu level, phạm vi chung): [brainstoming.md](./brainstoming.md)  
> **Kết quả làm việc:** [interview-dotnet/](./interview-dotnet/) — xem [README](./interview-dotnet/README.md)

---

## Vị trí & phạm vi kỹ thuật

| | |
|--|--|
| **Vị trí** | C# / .NET backend developer |
| **Stack trọng tâm** | C#, ASP.NET Core, EF Core, SQL, async, DI, bảo mật API |
| **Thư mục skill** | `interview-dotnet/` |

**Phạm vi câu hỏi (bổ sung so với [brainstoming.md](./brainstoming.md)):**

- OOP C#, async/await, LINQ, ORM, database, index, caching
- EF Core, DI, middleware, performance/GC, message broker, upload file
- Auth/Authz, password hashing, JWT / OAuth2 / OIDC
- Live code: thiết kế gửi email · Review code: `OrderNotificationService` (async, N+1, DI, …)

---

## Lịch sử yêu cầu (.NET)

### Format chấm điểm chi tiết

Ví dụ câu *interface vs abstract* — tiêu chí **+1 từng ý**, tích lũy Junior → Mid → Senior:

- **Junior:** khái niệm, ví dụ đơn giản, …
- **Mid:** use case, multiple interface, …
- **Senior:** test/mock, SOLID, khi nào không cần interface, …

→ Mẫu đầy đủ: [interview-dotnet/03-cau-hoi-co-ban.md](./interview-dotnet/03-cau-hoi-co-ban.md) (Câu 1).

### Chủ đề đã bổ sung

- async/await, LINQ, GC, DI, cache, query/index thực chiến
- Microservice / Clean Architecture (ở mức phỏng vấn)
- **Authentication & authorization** — JWT, OAuth2, OIDC, password hashing → [10-cau-hoi-bao-mat.md](./interview-dotnet/10-cau-hoi-bao-mat.md)

### Level 9 bậc — ghi chú riêng .NET

- **Junior 3:** CRUD end-to-end, danh mục, login/logout
- **Mid 1:** research thư viện theo hướng dẫn Mid 3; phối hợp QA, BA
- **Mid 2+:** feature độc lập, DevOps, thiết kế module

→ Chi tiết & trọng số %: [interview-dotnet/01-tong-quan.md](./interview-dotnet/01-tong-quan.md)

### Rubric theo band phỏng vấn

Mỗi file chỉ giữ band rubric áp dụng (không lặp band thấp hơn):

| Band | File |
|------|------|
| **Junior** | 03 |
| **Mid** | 03, 04, 05, 07, 08, 09, 10, 11 |
| **Senior** | 03–12 (06, 12: Senior only) |

→ [02-tieu-chi-danh-gia.md](./interview-dotnet/02-tieu-chi-danh-gia.md) · Form: [14-form-phong-van.md](./interview-dotnet/14-form-phong-van.md)

### Tái cấu trúc tài liệu

1. **brainstoming.md** — overview + luồng AI (chung mọi vị trí)
2. **brainstoming-dotnet.md** — trao đổi riêng vị trí này (file này)
3. **interview-dotnet/** — 14 file: câu hỏi, live/review code, HR, form

Mỗi câu: mục tiêu → đáp án → tiêu chí band → red flags → pass criteria → follow-up.

---

## Trạng thái

| Hạng mục | Trạng thái |
|----------|------------|
| Ngân hàng 33 câu + rubric | ✅ [interview-dotnet/](./interview-dotnet/) |
| Live code + review code | ✅ 11, 12 |
| AI tự chấm + luồng online | ⏳ Chưa triển khai |

**Bước tiếp theo (.NET):** luồng ứng viên → AI chấm → báo cáo HR theo rubric [02](./interview-dotnet/02-tieu-chi-danh-gia.md).
