# Workflow: Thêm tính năng mới — lát cắt dọc

Áp dụng khi thêm một use case/API mới vào solution đã scaffold. Một tính năng **chạm 4 layer**; làm thiếu layer nào thì lỗi lộ ra ở chỗ khác.

## Checklist

```text
- [ ] 0. Xác định feature name + aggregate liên quan (mới hay đã có?)
- [ ] 1. Domain         — entity/aggregate + repository interface (nếu chưa có)
- [ ] 2. Application    — command/query + DTO + handler
- [ ] 3. Infrastructure — implement repository + EF configuration + migration
- [ ] 4. Host           — controller gọi dispatcher
- [ ] 5. DI             — AddScoped handler + repository
- [ ] 6. dotnet build && dotnet test -c Debug
```

## Bước 0 — Trước khi viết dòng nào

| Hỏi | Nếu… |
|---|---|
| Aggregate đã tồn tại? | Có → chỉ thêm method vào root, **không** tạo entity mới · Chưa → bước 1 |
| Đây là **ghi** hay **đọc**? | Ghi → `Command` · Đọc → `Query` (không đi qua aggregate cũng được, đọc thẳng read model) |
| Có chạm aggregate thứ hai? | Có → **domain event**, không sửa hai root trong một transaction |

## Bước 1 — Domain

```text
{Product}.Domain/
├── Entities/Order.cs                    # aggregate root — invariant nằm ở đây
├── ValueObjects/Money.cs                # nếu có giá trị không identity
└── Repositories/IOrderRepository.cs     # chỉ aggregate root, không entity con
```

- Đổi state qua **method có tên nghiệp vụ** (`order.AddItem(...)`), không public setter.
- Repository interface **không** trả `IQueryable`.
- Aggregate khác tham chiếu bằng **ID**: `Order.CustomerId`, không `Order.Customer`.

Chi tiết: [reference/ddd-tactical.md](../reference/ddd-tactical.md) mục 6.B, 6.C.

## Bước 2 — Application

```text
{Product}.Application/
├── Commands/Orders/CreateOrderCommand.cs
├── DTOs/Orders/OrderDto.cs
└── Features/Orders/CreateOrder/CreateOrderHandler.cs
```

Mẫu: [templates/command-handler.cs](../templates/command-handler.cs).

- Handler **chỉ điều phối**: load aggregate → gọi method domain → lưu qua UoW.
- Inject **interface** (`IOrderRepository`, `IAppUnitOfWork`), **không** `DbContext`.
- Validation kỹ thuật (null/format) ở đây; rule nghiệp vụ ở Domain.
- Trả **DTO**, không trả entity.

## Bước 3 — Infrastructure

```text
{Product}.Infrastructure/Persistence/
├── Repositories/OrderRepository.cs      # implement IOrderRepository
├── Configurations/OrderConfiguration.cs # EF Fluent API
└── Migrations/
```

Chi tiết EF/multitenancy: [minipower-backend-entityframework-dotnet](../../minipower-backend-entityframework-dotnet/README.md).

## Bước 4 — Host

```csharp
public class OrdersController(ICommandDispatcher commands) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderCommand cmd, CancellationToken ct)
        => Ok(await commands.SendAsync(cmd, ct));
}
```

- Controller **mỏng**: nhận request → dispatcher → trả kết quả.
- Không inject `DbContext`, không inject repository, không dùng type `{Product}.Domain.*`.
- Job chạy nền cùng use case → `Host/Workers/`, cũng chỉ gọi handler.

## Bước 5 — Đăng ký DI

```csharp
// ApplicationLayerExtension.cs
builder.Services.AddScoped<ICommandHandler<CreateOrderCommand, Guid>, CreateOrderHandler>();

// InfrastructureLayerExtension.cs
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
```

Quên `AddScoped` ⇒ DI fail **lúc chạy**, không phải lúc build.

## Bước 6 — Validate

```bash
dotnet build
dotnet test -c Debug
```

`{Product}.ArchitectureTests` đỏ nghĩa là file đặt sai layer hoặc reference sai chiều — đọc message, đừng sửa test.

## Anti-patterns

- Handler chứa `if` kiểm tra invariant nghiệp vụ (thuộc entity)
- Controller inject `DbContext` hoặc repository
- Trả entity domain thẳng ra API response
- Tạo entity mới thay vì thêm method vào aggregate root đã có
- `BackgroundService` đặt trong project `Application`
