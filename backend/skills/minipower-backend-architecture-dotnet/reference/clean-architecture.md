# Tham chiếu — Clean Architecture trên .NET (Jarvis)

Quy tắc phụ thuộc, tổ chức project, pattern implementation và chiến lược test theo layer.

**Không load mặc định** — mở khi cần tra một mục. Tổng quan + bảng *Đặt file ở đâu*: [SKILL.md](../SKILL.md). Cây thư mục và thứ tự tạo project: [scaffold/reference/solution-structure.md](../../minipower-backend-scaffold-dotnet/reference/solution-structure.md). Quy tắc DDD chiến thuật: [ddd-tactical.md](ddd-tactical.md).

> **Nguồn chân lý là repo framework Jarvis** (`hoangnh2412/jarvis`, nhánh `develop`), không phải tài liệu Clean Architecture chung. Chỗ nào lý thuyết nghịch Jarvis thì Jarvis thắng — các mục dưới đã hiệu chỉnh theo csproj thật.

## 1. Dependency Rule

**Mọi phụ thuộc mã nguồn hướng từ ngoài vào trong.** Layer trong (Domain) không biết layer ngoài (Infrastructure, Host).

| Layer | Được phụ thuộc vào | Không được phụ thuộc vào |
|---|---|---|
| **Domain.Shared** | BCL, `Newtonsoft.Json` | mọi project khác trong solution |
| **Domain** | `Domain.Shared`, `Jarvis.DDD.Domain`, `Microsoft.Extensions.*.Abstractions` | `Application`, `Infrastructure`, `Host`, **`Microsoft.EntityFrameworkCore`** |
| **Application** | `Domain` (và `Domain.Shared` theo chuỗi), `Jarvis.DDD.Application(.Contracts)` | `Infrastructure`, `Host`, `Microsoft.AspNetCore.Mvc` / `.Http`, provider DB cụ thể |
| **Infrastructure** | `Domain`, package adapter (EF, HTTP client…) | phải **implement** interface do layer trong định nghĩa, không đảo ngược |
| **Host** | `Application`, `Infrastructure`, `Jarvis.Mvc`, `Jarvis.DDD.Domain` | *(xem lưu ý 1.2)* |

### 1.1. Ba điều cấm KHÔNG áp dụng ở đây

Tài liệu Clean Architecture chung hay cấm ba thứ dưới đây trong Domain. Framework Jarvis dùng chúng, nên cấm là **đỏ oan**:

| Thứ | Jarvis dùng ở đâu |
|---|---|
| `Newtonsoft.Json` | `Jarvis.DDD.Domain.Shared` → `PackageReference Newtonsoft.Json` |
| `Microsoft.Extensions.*` | `Jarvis.DDD.Domain` → `Configuration`/`DependencyInjection`/`Hosting`.Abstractions |
| Interface UoW ở Application | `IUnitOfWork` nằm ở `Jarvis.DDD.Domain/Repositories/` ⇒ **Domain** |

Điều **đúng và giữ**: Domain không chạm EF Core — `Jarvis.DDD.Domain` không reference EF; `Jarvis.ORM.EntityFramework` reference ngược vào Domain.

### 1.2. Host → Domain: được, nhưng có giới hạn

`Host` **được phép** reference `Domain` ở cấp project — Jarvis bắt buộc (`AddCoreDomain()` đăng ký `IWorkContext`, enricher tenant). Vi phạm là ở **cấp kiểu**: Controller dùng entity domain làm tham số hoặc kiểu trả về. Trả DTO.

Tương tự, `Host` reference `Infrastructure` để **đăng ký DI** (composition root) là bình thường. Vấn đề chỉ khi Controller/handler lệ thuộc trực tiếp vào kiểu hạ tầng.

## 2. Ranh giới project

| Quy tắc | Vì sao |
|---|---|
| `Domain` không reference project nào ngoài `Domain.Shared` | Giữ lõi không bị kéo theo thay đổi tầng ngoài |
| `Application` chỉ reference `Domain` | Use case không "biết" database hay web framework |
| `Application` **không** cần `<FrameworkReference Microsoft.AspNetCore.App />` | `Jarvis.DDD.Application` không có — thêm vào là mở cửa cho `Microsoft.AspNetCore.Mvc` lọt vào use case |
| `Infrastructure` implement interface do `Domain` định nghĩa | Đảo ngược phụ thuộc; đổi PostgreSQL → SQL Server không đụng Domain |
| `Host` reference `Application` + `Infrastructure` | Lớp mỏng: endpoint + DI |
| `Domain.Shared` cực mỏng | Chỉ enum, constant, extension primitive, exception marker. **Không** entity, aggregate, DTO, command/query |

Solution giữ **một** project `Application` — không tách `Application.Contracts` ở phía product (`Jarvis.DDD.Application.Contracts` là package của framework, chuyện khác).

## 3. Pattern implementation

| Quy tắc | Ví dụ |
|---|---|
| Dependency Inversion qua interface | `IEmailSender` ở `Application`, `SmtpEmailSender` ở `Infrastructure` |
| Entity đổi state qua method có tên nghiệp vụ | `order.AddItem(product, quantity)`, không `order.Items.Add(...)` từ ngoài |
| Domain không gọi `DateTime.Now` trực tiếp khi cần test | Inject `IDateTimeProvider`; implementation ở Infrastructure |
| Handler chỉ inject **interface**, không class concrete | Mock được trong test Application |
| **Interface repository ở `Domain`** | Implementation ở `Infrastructure` — khớp `Jarvis.DDD.Domain/Repositories/` |
| **Interface `IUnitOfWork` ở `Domain`** | `IAppUnitOfWork : IUnitOfWork` trong `{Product}.Domain.Repositories`; implement ở `Infrastructure.Persistence` |

## 4. Test theo layer

| Layer | Cách test | Công cụ |
|---|---|---|
| Domain | Unit test, **không** mock hạ tầng | xUnit |
| Application | Mock repository / port; kiểm luồng điều phối handler | Moq, NSubstitute |
| Infrastructure | Integration test với DB thật khi cần | Testcontainers |
| **Hướng phụ thuộc** | **Architecture test — tự động, chạy mọi lần `dotnet test`** | **ArchUnitNET** ([add-arch-test.md](../workflows/add-arch-test.md)) |

Cây thư mục test mirror `src/`: [scaffold/reference/solution-structure.md](../../minipower-backend-scaffold-dotnet/reference/solution-structure.md).
