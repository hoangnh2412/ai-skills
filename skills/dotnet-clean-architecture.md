# Skill Clean Architecture — .NET

Tài liệu mô tả **quy tắc phụ thuộc**, tổ chức project, pattern code và kiểm tra theo Clean Architecture. Đối chiếu **cây project, thứ tự reference, folder scaffold**: `skills/architechture-dotnet.md` (mục 4, 5).

---

## 3. Clean Architecture — quy tắc phụ thuộc, project, code và kiểm tra

### 3.1. Quy tắc Dependency Rule (lõi Clean Architecture)

Đây là quy tắc quan trọng nhất: **mọi phụ thuộc mã nguồn chỉ được hướng từ ngoài vào trong**. Các layer bên trong (Domain) **không** được biết về layer bên ngoài (Infrastructure, UI, framework gắn với delivery).

| Layer | Được phép phụ thuộc vào | Không được phụ thuộc vào (mã nguồn / ý đồ thiết kế) |
|-------|-------------------------|-----------------------------------------------------|
| **Domain** | Primitive .NET (`string`, `int`, `Exception`, `List<T>`…), API BCL tối thiểu; `Domain.Shared` (shared kernel) | `Microsoft.EntityFrameworkCore`, `Newtonsoft.Json`, `System.Net.Http`, `Microsoft.Extensions.*` (trừ trường hợp đặc biệt team thống nhất), `System.IO` nếu làm lộ chi tiết hạ tầng vào domain |
| **Application** | `Domain`, `Domain.Shared` (thường qua chuỗi từ `Domain`) | `Infrastructure`, EF Core, ASP.NET Core, `System.Data.SqlClient` / provider DB cụ thể |
| **Infrastructure** | `Domain` (và **tuỳ chọn** `Application` nếu port/interface chỉ tồn tại trong Application — ưu tiên đặt port ở Domain khi có thể), các package adapter (EF, HTTP client…) | Không “phá vỡ” rule: phải **implement** interface do layer trong định nghĩa, không để domain phụ thuộc ngược vào implementation |
| **Presentation / Host** | `Application`, `Infrastructure` (composition root / DI) | `Domain` **trực tiếp** (luồng nghiệp vụ qua Application); **không** inject hay gọi repository concrete từ controller |

**Lưu ý quan trọng:** Quy tắc này **không** cấm Web API → Infrastructure hoàn toàn. Nếu `Program.cs` / `Host` chỉ reference `Infrastructure` để **đăng ký dependency injection** (composition root), điều đó **chấp nhận được**. Vấn đề chỉ rõ khi có `using …Infrastructure` (hoặc tương đương) **bên trong** Controller, Application service, hoặc handler để lệ thuộc trực tiếp vào kiểu hạ tầng — lúc đó đã vi phạm hướng phụ thuộc.

### 3.2. Quy tắc cấu trúc project (.NET)

| Quy tắc | Giải thích |
|---------|------------|
| Project **Domain** không reference project nào ngoài **Domain.Shared** (shared kernel) | Giữ domain thuần, không bị kéo theo thay đổi ở tầng ngoài |
| **Application** chỉ reference **Domain** (`Domain.Shared` theo chuỗi từ `Domain` nếu cần) | Command/query/DTO/handler nằm trong cùng project; use case không “biết” database hay web framework |
| **Infrastructure** implement interface do **Application** hoặc **Domain** định nghĩa | Đảo ngược phụ thuộc; dễ đổi công nghệ (ví dụ SQL Server → PostgreSQL) |
| **Web API / Host** reference **Application** + **Infrastructure** | Lớp mỏng: endpoint + DI; controller gọi handler qua interface, **không** nhồi logic nghiệp vụ |
| **Domain.Shared** (shared kernel; có thể đặt tên project `SharedKernel`) | Chỉ phần dùng chung cực mỏng — **architechture-dotnet.md mục 5.3**. **Không** logic nghiệp vụ, entity, aggregate, DTO use case, command/query; chỉ package `System.*` / BCL tối thiểu. |

*(Đối chiếu cây project và thứ tự reference chi tiết: **architechture-dotnet.md** mục 4 và mục 5.2.)*

### 3.3. Quy tắc code và implementation pattern

| Quy tắc | Ví dụ cụ thể |
|---------|----------------|
| Dependency Inversion qua interface | `IEmailSender` trong `Application`, `SendGridEmailSender` trong `Infrastructure` |
| Entity không dùng public setter bừa bãi; đổi state qua method có ý nghĩa | `order.AddItem(product, quantity)` thay vì `order.Items.Add(...)` từ ngoài |
| Domain không gọi `DateTime.Now` / `DateTime.UtcNow` trực tiếp nếu cần test/khớp thời gian | Inject `IDateTimeProvider` (interface ở Application hoặc Domain tuỳ team), implementation ở Infrastructure |
| Command/Query handler chỉ inject **interface**, không inject class concrete | Tuân Dependency Inversion; mock được trong test Application |
| Interface repository đặt ở **Domain** hoặc **Application** | Implementation repository ở **Infrastructure** |
| Unit of Work — interface thường ở **Application** | EF `DbContext` thường đóng vai UoW; implement cụ thể ở **Infrastructure** |

### 3.4. Kiểm tra (testing) và automation

| Quy tắc | Công cụ / phương pháp gợi ý |
|---------|-----------------------------|
| **Domain** unit test **không** cần mock hạ tầng | xUnit, NUnit |
| **Application** test với mock interface hạ tầng (repository, clock, bus…) | Moq, NSubstitute |
| **Infrastructure** integration test với DB/container thật khi cần | Testcontainers (SQL Server, PostgreSQL, …) |
| Kiểm tra **dependency rule** tự động | NetArchTest, ArchUnitNET, NDepend (hoặc tương đương) |

*(Cấu trúc thư mục test mirror `src`: **architechture-dotnet.md** mục 5.8.)*
