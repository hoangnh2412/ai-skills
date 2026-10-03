# Workflow: Thêm command/query handler

Áp dụng khi aggregate và repository **đã có**, chỉ thêm một use case. Nếu tính năng còn cần entity/bảng mới → dùng [add-feature.md](add-feature.md).

## Checklist

```text
- [ ] 1. Command/query trong Application (immutable record)
- [ ] 2. Handler implement ICommandHandler<> / IQueryHandler<>
- [ ] 3. AddScoped trong ApplicationLayerExtension
- [ ] 4. Controller/Worker gọi dispatcher
- [ ] 5. Unit test handler (mock repository)
- [ ] 6. dotnet test -c Debug
```

## Đặt file

```text
{Product}.Application/
├── Commands/<Feature>/{UseCase}Command.cs     # hoặc Queries/<Feature>/
├── DTOs/<Feature>/{UseCase}Dto.cs             # khi trả dữ liệu có cấu trúc
└── Features/<Feature>/{UseCase}/{UseCase}Handler.cs
```

Mẫu: [templates/command-handler.cs](../templates/command-handler.cs).

## Contract Jarvis

| Interface | Ở đâu |
|---|---|
| `ICommand` / `IQuery` | `Jarvis.DDD.Domain.Shared` — `Messaging/` |
| `ICommandHandler<>` / `IQueryHandler<>` + bản async | `Jarvis.DDD.Application.Contracts` |
| `ICommandDispatcher` / `IQueryDispatcher` | `Jarvis.DDD.Application.Contracts`, đăng ký bởi `AddCoreApplication()` |

`AddCoreApplication()` chỉ đăng ký **dispatcher**. Handler của product **app tự `AddScoped`** — quên là DI fail lúc chạy.

## Đăng ký

```csharp
builder.Services.AddScoped<ICommandHandler<CreateOrderCommand, Guid>, CreateOrderHandler>();
```

## Handler đúng vai

```text
load aggregate  →  gọi method domain  →  lưu qua IAppUnitOfWork  →  map DTO
```

- Inject **interface**, không `DbContext` / `SqlConnection` / `IHttpClientFactory`.
- Không nhồi invariant nghiệp vụ — thuộc entity/root.
- Cần sửa aggregate thứ hai → **domain event**, không gọi repository thứ hai trong cùng transaction.
- Job dùng multitenancy: `SwitchDbContextAsync` trước khi query — [entityframework-dotnet](../../minipower-backend-entityframework-dotnet/README.md).

## Anti-patterns

- Đăng ký handler trong Domain layer
- Handler trả entity domain thay vì DTO
- Handler gọi thẳng kiểu của `{Product}.Infrastructure`
