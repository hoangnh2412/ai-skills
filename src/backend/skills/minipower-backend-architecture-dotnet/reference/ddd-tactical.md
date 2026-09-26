# Tham chiếu — DDD trên .NET (Jarvis)

Quy tắc thiết kế và triển khai DDD: strategic + tactical, bổ sung cho phân lớp ở [clean-architecture.md](clean-architecture.md).

**Không load mặc định** — mở khi cần tra một mục. Cấu trúc solution và folder: [scaffold/reference/solution-structure.md](../../minipower-backend-scaffold-dotnet/reference/solution-structure.md).

Placeholder `{Context}` = tên bounded context; trong monolith **một** context có thể đồng nhất với `{Product}`.

| Mục | Nội dung |
|---|---|
| 6.A | Strategic DDD — bounded context & context map |
| 6.B | Domain layer — entity, value object, aggregate |
| 6.C | Repository & persistence |
| 6.D | Domain events |
| 6.E | Application layer — use cases |
| 6.F | Specification pattern (tuỳ chọn) |
| 6.G | Testing |
| 6.H | Cấm kỵ |
| 6.I | Đặt tên & thư mục |

---

## 6.A. Strategic DDD — bounded context & context map

| Quy tắc | Giải thích |
|---|---|
| Mỗi bounded context có **một bộ project** riêng | Không trộn nhiều context trong cùng solution **trừ khi** cùng mô hình và cùng ubiquitous language. Điển hình: `{Context}.Domain`, `{Context}.Application`, `{Context}.Infrastructure`, `{Context}.Host` |
| Xác định rõ **context map** | Ghi quan hệ: Partnership, Shared Kernel, Customer–Supplier, Conformist, Anticorruption Layer, Open Host Service, Published Language |
| **Anticorruption Layer (ACL)** khi tích hợp legacy / hệ ngoài | Đặt trong `{Context}.Infrastructure/AntiCorruption/`. ACL chuyển mô hình ngoài sang mô hình của context hiện tại |
| **Shared kernel** chỉ khi hai context thật sự chia chung mô hình **và** cùng đội | Shared kernel phải ổn định; mọi thay đổi có đồng thuận. Trong .NET là `{Product}.Domain.Shared` |

**Ranh giới service = ranh giới bounded context.** Tách microservice thì mỗi service vẫn là đúng 5 layer — xem mục *Một service hay nhiều service* trong [SKILL.md](../SKILL.md).

## 6.B. Domain layer — entity, value object, aggregate

| Quy tắc | Ví dụ |
|---|---|
| **Entity** có identity bất biến suốt vòng đời | `OrderId`, `CustomerId` — value object hoặc `Guid`/`long` tuỳ quy ước |
| **Value Object** không identity; bằng nhau theo **toàn bộ thuộc tính** | `Address`, `Money`, `DateRange`. `Equals`/`GetHashCode` theo mọi thành phần có nghĩa |
| Value Object **immutable** | Chỉ `get` + `init` hoặc `private set`; thay đổi ⇒ trả **instance mới** |
| **Aggregate Root** là entity duy nhất lớp ngoài tham chiếu trực tiếp | `Order` là root; `OrderLineItem` là entity con — truy cập qua `Order` |
| Aggregate root **bảo toàn invariant** cho cả aggregate | Tổng tiền không âm; không thêm dòng khi đơn đã thanh toán — kiểm trong **method của root** |
| Aggregate tham chiếu aggregate khác bằng **ID** | `Order.CustomerId`, không `Order.Customer` — giảm coupling, tránh lazy load xuyên aggregate |
| Một transaction ưu tiên sửa **một** aggregate root | Xuyên aggregate ⇒ **domain event** + eventual consistency |
| **Domain service** stateless, cho logic không thuộc riêng entity/VO nào | `TransferService` giữa hai tài khoản. Đặt ở `Domain/Services/` |

**Sửa entity con mà không muốn load cả root?** Cùng aggregate: mọi thay đổi vẫn đi qua **root** (method trên root gọi xuống con); ở persistence được phép tải tối thiểu (include chọn lọc, split query) miễn invariant của root vẫn được kiểm — **không** thêm API repository kiểu `UpdateChildDirectly`. Khác aggregate: tách transaction hoặc domain event. Nếu chi phí load không chấp nhận được thì **xem lại ranh giới aggregate** (con có invariant độc lập ⇒ có thể là root mới?) hoặc tách CQRS (read model nhẹ để tra cứu; phần ghi vẫn đủ domain để giữ rule).

## 6.C. Repository & persistence

| Quy tắc | Chi tiết |
|---|---|
| **Interface repository ở `Domain`** | `IOrderRepository` trong `{Product}.Domain/Repositories/` — khớp `Jarvis.DDD.Domain/Repositories/` |
| **Interface `IUnitOfWork` ở `Domain`** | `IAppUnitOfWork : IUnitOfWork` (`Jarvis.DDD.Domain.Repositories`) trong `{Product}.Domain.Repositories` |
| Repository làm việc với **aggregate root**, không API riêng cho entity con | `GetById`, `Add`, `Delete` trên `Order`; không `GetOrderLineItemById` public |
| Method async, biểu diễn "không có" rõ ràng | `Task<Order?>` — tránh `null` không quy ước |
| **Không** trả `IQueryable` từ interface domain | Lộ query model vào Domain; thay bằng method có tên: `GetActiveByCustomer` |
| **Implementation ở `Infrastructure`** | EF Core, Dapper… — bọc `DbSet` sau interface domain để test và thay thế |

## 6.D. Domain events

| Quy tắc | Ví dụ |
|---|---|
| Event **immutable**, tên ở **thì quá khứ** | `OrderPlaced`, `CustomerAddressChanged` |
| Chứa dữ liệu đủ mô tả sự kiện | `public record OrderPlaced(Guid OrderId, DateTime OccurredOn, decimal TotalAmount);` |
| Raise từ **aggregate root**, tích luỹ trong aggregate | `List<IDomainEvent>`, `AddDomainEvent`, `ClearDomainEvents` sau persist |
| **Handler đặt ở `Application`** | Gọi repository khác, gửi mail — qua interface (ports) |
| Không xử lý side-effect nặng đồng bộ trong cùng transaction | Dispatch **sau commit** |
| Handler không gọi thẳng infrastructure cụ thể | Chỉ qua abstraction đã inject |

> Outbox/inbox và integration event: framework Jarvis khai **roadmap, chưa ship** — chưa có skill, đừng tự chế cơ chế riêng.

## 6.E. Application layer — use cases

| Quy tắc | Áp dụng .NET |
|---|---|
| Mỗi use case ≈ **một command hoặc query** | Handler đăng ký trực tiếp trong DI (`AddApplicationLayer`) — **không** MediatR. Map DTO bằng **AutoMapper** khi cần, profile ở `Mappings/` |
| Handler chỉ **điều phối**: load aggregate → gọi method domain → lưu | **Không** nhồi business invariant (thuộc entity/root) |
| Handler inject **repository interface**, domain service, ports | **Không** inject `DbContext`, `SqlConnection`, `IHttpClientFactory` |
| Tránh sửa aggregate khác qua repository trong cùng transaction | Ưu tiên domain event |
| Validation **kỹ thuật** (null, format) ở Application | Rule **nghiệp vụ** ở Domain |
| **Không** trả domain entity ra Host/API | Trả DTO / primitive / ID |
| `BackgroundService` **không** đặt ở Application | Đặt `Host/Workers/`, mỏng, gọi vào handler — cùng vai Controller |

## 6.F. Specification pattern (tuỳ chọn)

| Quy tắc | Mục đích |
|---|---|
| Gói logic truy vấn tái sử dụng | `ActiveOrdersSpec`, `OrdersByCustomerSpec` |
| Định nghĩa ở `Domain`; biểu diễn EF ở `Infrastructure` | `Specification<T>` tự viết hoặc thư viện |
| Ưu: reuse, test được, tránh repository phình method | Không bắt buộc — dự án nhỏ vài method repository là đủ |

## 6.G. Testing

| Loại | Quy tắc |
|---|---|
| Domain unit test | Invariant entity, equality VO, domain service — **không** mock, chạy nhanh |
| Repository integration | DB thật (Testcontainers) hoặc in-memory (biết rõ khác biệt hành vi) |
| Application | Mock repository/port; kiểm luồng điều phối handler |
| Domain events | Aggregate raise đúng lúc; handler gọi đúng dependency |

## 6.H. Cấm kỵ

| Hành vi | Lý do |
|---|---|
| Public setter bừa bãi trên entity | Phá encapsulation, bỏ qua invariant |
| Entity chứa logic truy cập DB | Trái SRP, khó test |
| Repository trả `IQueryable` ra domain | Leak abstraction |
| Một transaction cập nhật nhiều aggregate root | Contention, khó scale; trái "một aggregate một consistency boundary" |
| Value object cho phép null thuộc tính cốt lõi | VO phải **luôn hợp lệ** khi tạo |
| Domain service inject repository ở constructor | Domain service không "sở hữu" persistence — nhận port qua tham số method, hoặc để Application điều phối |

Nhóm này là **advisory** — [review-dotnet](../../minipower-backend-review-dotnet/README.md) soát khi review PR, architecture test không bắt (dễ đỏ oan với EF).

## 6.I. Đặt tên & thư mục

| Thành phần | Namespace ví dụ |
|---|---|
| Aggregate root | `{Product}.Domain.Entities.Order` hoặc `{Product}.Domain.Orders.Order` |
| Value object | `{Product}.Domain.ValueObjects.Address` |
| Domain event | `{Product}.Domain.Events.OrderPlaced` |
| Repository interface | `{Product}.Domain.Repositories.IOrderRepository` |
| Domain service | `{Product}.Domain.Services.TransferService` |
| Application command | `{Product}.Application.Commands.Orders.PlaceOrderCommand` |
| Application handler | `{Product}.Application.Features.Orders.PlaceOrder.PlaceOrderHandler` |

Cả hai kiểu (`Entities/` theo loại · `Orders/` theo feature) đều hợp lệ, kể cả `Features/<Context>/` khi nhiều bounded context. Architecture test ép **assembly**, không ép namespace con — chọn kiểu nào là việc của đội.
