# Skill DDD — .NET

Tài liệu mô tả **quy tắc thiết kế và triển khai** theo DDD (strategic + tactical), bổ sung cho phân lớp Clean Architecture. Đối chiếu **cấu trúc solution và folder**: `skills/architechture-dotnet.md`; **Dependency Rule và layer**: `skills/dotnet-clean-architecture.md`.

Placeholder **`{Context}`** = tên bounded context; trong monolith **một** context có thể đồng nhất với `{Product}` (theo quy ước trong skill cấu trúc solution).

## Mục lục

| Mục | Nội dung |
|-----|----------|
| **6.A** | [Strategic DDD — Bounded context & context map](#6a-strategic-ddd--bounded-context--context-map) |
| **6.B** | [Domain layer — Entity, Value Object, Aggregate](#6b-domain-layer--entity-value-object-aggregate) |
| **6.C** | [Repository & persistence](#6c-repository--persistence) |
| **6.D** | [Domain events](#6d-domain-events) |
| **6.E** | [Application layer — Use cases](#6e-application-layer--use-cases) |
| **6.F** | [Specification pattern (tuỳ chọn)](#6f-specification-pattern-tuỳ-chọn) |
| **6.G** | [Testing trong DDD](#6g-testing-trong-ddd) |
| **6.H** | [Cấm kỵ — anti-patterns](#6h-cấm-kỵ--anti-patterns) |
| **6.I** | [Đặt tên & cấu trúc thư mục (.NET)](#6i-đặt-tên--cấu-trúc-thư-mục-net) |

---

## 6. Quy tắc DDD (Strategic, Tactical, Application, Testing)

### 6.A. Strategic DDD — Bounded context & context map

| Quy tắc | Giải thích & căn cứ |
|---------|---------------------|
| Mỗi bounded context có **một bộ project** (hoặc module) riêng | Không trộn nhiều bounded context trong cùng một solution **trừ khi** chúng thực sự cùng mô hình và cùng ubiquitous language. Mỗi context điển hình: `{Context}.Domain`, `{Context}.Application`, `{Context}.Infrastructure`, `{Context}.Host` (và `{Context}.Domain.Shared` nếu có shared kernel riêng của context). |
| Xác định rõ **context map** | Ghi lại quan hệ giữa các bounded context: Partnership, Shared Kernel, Customer–Supplier, Conformist, Anticorruption Layer, Open Host Service, Published Language, … |
| Dùng **Anticorruption Layer (ACL)** khi tích hợp legacy hoặc external bounded context | Đặt ACL trong `{Context}.Infrastructure` (ví dụ folder/module `AntiCorruption/`) hoặc service riêng. ACL chuyển mô hình phía ngoài sang mô hình của context hiện tại. |
| **Shared kernel** chỉ khi hai context thực sự chia chung một phần mô hình **và** cùng đội / quy trình thay đổi | Shared kernel phải **ổn định**; mọi thay đổi có đồng thuận. Trong .NET thường là project `{Product}.Domain.Shared` hoặc `{Shared}.Kernel` — xem thêm **architechture-dotnet.md mục 5.3**. |

### 6.B. Domain layer — Entity, Value Object, Aggregate

| Quy tắc | Ví dụ / minh họa |
|---------|------------------|
| **Entity** có **identity** bất biến suốt vòng đời | `OrderId`, `CustomerId` có thể là value object hoặc `Guid`/`long` tùy quy ước. |
| **Value Object** không identity; bằng **toàn bộ thuộc tính** | `Address`, `Money`, `DateRange`. `Equals` / `GetHashCode` theo tất cả thành phần có ý nghĩa. |
| Value Object **immutable** | Chỉ `get` + `init` hoặc `private set`; thay đổi → method trả về **instance mới**. |
| **Aggregate Root** là entity **duy nhất** mà lớp ngoài tham chiếu trực tiếp | `Order` là root; `OrderLineItem` là entity con — truy cập qua `Order`. |
| Aggregate root **bảo toàn invariant** cho cả aggregate | Ví dụ: tổng tiền không âm; không thêm dòng khi đơn đã thanh toán — kiểm tra trong **method của root**. |
| Aggregate chỉ tham chiếu aggregate khác bằng **ID** (không reference object) | `Order.CustomerId` thay vì `Order.Customer` (entity) — giảm coupling, tránh “lazy load” xuyên aggregate/context. |
| Trong **một transaction**, ưu tiên thay đổi **một** aggregate root | Tránh cập nhật nhiều root trong cùng UoW; xử lý xuyên aggregate bằng **domain events** + eventual consistency khi cần. |
| Cần sửa **entity con** (vd. B, C thuộc root A) hoặc vừa con của **hai root** (B, C thuộc A và Y thuộc X) mà **không** muốn load “cả” A và X | **Cùng một aggregate:** Mọi thay đổi B/C vẫn phải đi qua **root A** (method trên A gọi xuống con). Ở persistence được phép **tải tối thiểu** (graph/include có chọn lọc, split query, v.v.) miễn là **invariant của A** vẫn được kiểm tra — **không** thêm API repository public kiểu `UpdateBTrựcTiếp` nếu phá encapsulation (xem **6.C**). **Hai aggregate khác nhau:** Tài liệu này đã hướng dẫn **tách transaction** hoặc **domain event** (các dòng trên + **6.E**); không có mô hình “chỉ patch con chéo hai root” mà bỏ qua root. Nếu không chấp nhận load A hoặc X vì chi phí: xem lại **ranh giới aggregate** (B/C/Y có lifecycle invariant độc lập → có thể là **aggregate root** mới?) hoặc tách **CQRS** (read model nhẹ cho tra cứu; phần ghi vẫn phải đủ domain để giữ rule). |
| **Domain service** **stateless**, logic không tự nhiên thuộc một entity/VO | Ví dụ `TransferService` giữa hai tài khoản (hai root). Đặt trong `Domain` (namespace `Services` / tương đương). |

### 6.C. Repository & persistence

| Quy tắc | Chi tiết |
|---------|----------|
| **Interface repository** trong **Domain** | Ví dụ `IOrderRepository` trong `{Product}.Domain` (folder `Repositories/` hoặc theo aggregate). |
| Repository làm việc với **Aggregate Root**, không API riêng cho entity con | `GetById`, `Add`, `Delete` trên `Order`; không `GetOrderLineItemById` public. |
| Method async / biểu diễn “không có” rõ ràng | `Task<Order?>` hoặc `Maybe`/`Option` — tránh `null` không có quy ước. |
| **Không** trả về `IQueryable` từ interface domain (trừ ngoại lệ có kiểm soát) | `IQueryable` lộ persistence và query model vào Domain; thay bằng method có tên: `GetActiveByCustomer`, … |
| **Implementation** trong **Infrastructure** | EF Core, Dapper, MongoDB, … — bọc `DbSet` bằng interface domain để test và thay thế. |
| **Unit of Work** (nếu tách interface) — interface thường **Application**, implement **Infrastructure** | Ví dụ `SaveChangesAsync`; với EF, `DbContext` thường đóng vai UoW. |

### 6.D. Domain events

| Quy tắc | Ví dụ |
|---------|--------|
| Domain event **immutable**, tên **quá khứ** | `OrderPlaced`, `CustomerAddressChanged`, `InventoryReserved`. |
| Chứa dữ liệu **đủ mô tả** sự kiện | `public record OrderPlaced(Guid OrderId, DateTime OccurredOn, decimal TotalAmount);` |
| Raise từ **aggregate root** (hoặc domain service), tích luỹ trong aggregate | `List<IDomainEvent>`, `AddDomainEvent`, `ClearDomainEvents` sau persist. |
| **Handler** phản ứng sự kiện đặt **Application** | Gọi repository khác, gửi mail, publish integration event — qua **interface** (ports). |
| Không xử lý side-effect nặng **đồng bộ trong cùng transaction** nếu không cần | Thường **dispatch sau commit** (outbox / dispatcher sau `SaveChanges`). |
| Handler **không** gọi trực tiếp infrastructure cụ thể | Chỉ qua abstraction đã inject (`IEmailSender`, …). |

### 6.E. Application layer — Use cases

| Quy tắc | Áp dụng .NET |
|---------|----------------|
| Mỗi use case ≈ **một command hoặc query** (CQRS) | Handler / application service đăng ký trực tiếp trong DI (**architechture-dotnet.md mục 5.5**) — **không** dùng MediatR theo convention tài liệu này. Map DTO bằng **AutoMapper** khi cần (**architechture-dotnet.md mục 5.9 Q4**, folder `Mappings/`). |
| Handler chỉ **điều phối**: load aggregate → gọi method domain → lưu | **Không** nhồi business invariant (thuộc entity/root). |
| Handler inject **repository interface**, domain service, **ports** | **Không** inject `DbContext`, `SqlConnection`, `IHttpClientFactory` trực tiếp. |
| Tránh sửa **aggregate khác** qua repository trong cùng transaction | Ưu tiên **domain event** + xử lý sau (eventual consistency). |
| Validation **kỹ thuật** (null, format) ở Application (FluentValidation, data annotations, …) | Rule **nghiệp vụ** nằm trong **domain** (method trên entity/root). |
| **Không** trả domain entity ra Host/API | Trả **DTO** / primitive / ID — đặt trong `Application` (`DTOs/`, record kèm use case) hoặc type projection tối thiểu. |

### 6.F. Specification pattern (tuỳ chọn)

| Quy tắc | Mục đích |
|---------|----------|
| Gói logic truy vấn **tái sử dụng** | `ActiveOrdersSpec`, `OrdersByCustomerSpec`. |
| Định nghĩa **Domain**; biểu diễn EF/query ở **Infrastructure** | `Specification<T>`, visitor hoặc thư viện (vd. Ardalis.Specification). |
| Ưu điểm: reuse, test, tránh repository “quá nhiều method” | Không bắt buộc; dự án nhỏ có thể chỉ vài method repository. |

### 6.G. Testing trong DDD

| Loại test | Quy tắc |
|-----------|---------|
| **Domain** unit test | Invariant entity, equality VO, logic domain service — **không** mock, chạy nhanh. |
| **Repository** integration | DB thật (Testcontainers) hoặc in-memory (nhận thức khác biệt hành vi). |
| **Application** | Mock repository / port; kiểm tra **luồng điều phối** handler. |
| **Domain events** | Aggregate raise đúng lúc; handler gọi đúng dependency. |

### 6.H. Cấm kỵ — anti-patterns

| Hành vi | Lý do |
|---------|--------|
| **Public setter** bừa bãi trên entity | Phá encapsulation, bỏ qua invariant. |
| Entity chứa logic **truy cập DB** | Trái SRP, khó test. |
| Repository trả `IQueryable` ra domain | Leak abstraction, phụ thuộc query model. |
| **Một transaction** cập nhật **nhiều** aggregate root | Contention, khó scale; trái “một aggregate một consistency boundary” (trừ chiến lược rõ ràng). |
| Value object cho phép **null** thuộc tính cốt lõi | VO nên **luôn hợp lệ** khi tạo (validate constructor/factory). |
| Domain service **inject** repository ở constructor | Thường tránh: domain service không “sở hữu” persistence; có thể nhận port qua **tham số method** hoặc để Application điều phối. |

### 6.I. Đặt tên & cấu trúc thư mục (.NET)

| Thành phần | Ví dụ namespace / vị trí |
|-------------|----------------------------|
| Aggregate root | `{Product}.Domain.Entities.Order` hoặc `{Product}.Domain.Orders.Order` |
| Value object | `{Product}.Domain.ValueObjects.Address` hoặc `{Product}.Domain.Orders.ValueObjects.Money` |
| Domain event | `{Product}.Domain.Events.OrderPlaced` hoặc `{Product}.Domain.Orders.Events.OrderPlaced` |
| Repository interface | `{Product}.Domain.Repositories.IOrderRepository` |
| Domain service | `{Product}.Domain.Services.TransferService` |
| Application command | `{Product}.Application.Commands.Orders.PlaceOrderCommand` |
| Application handler | `{Product}.Application.Features.Orders.PlaceOrder.PlaceOrderHandler` |

*(Đối chiếu cây folder gợi ý: **architechture-dotnet.md** mục 5.4, mục 5.5.)*
