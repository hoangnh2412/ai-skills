# minipower-backend-architecture-dotnet

Skill giữ **kiến trúc** của backend .NET theo framework Jarvis: file nằm ở layer nào, layer nào được reference layer nào, và một tính năng mới đi qua những đâu.

Agent đọc [SKILL.md](./SKILL.md).

## Skill này khác convention thế nào

| Skill | Trả lời câu hỏi | Cổng cứng |
|---|---|---|
| **architecture** | **File nằm ở đâu? Reference thế nào?** | `dotnet test` — architecture test |
| [**convention**](../minipower-backend-convention-dotnet/README.md) | **Code trong file viết thế nào?** | `dotnet build` + `dotnet format` — analyzer |

Hai skill bổ sung nhau, không chồng lấn.

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Thêm tính năng mới (API / use case) chạm nhiều layer | [workflows/add-feature.md](./workflows/add-feature.md) |
| Thêm một command/query handler vào feature có sẵn | [workflows/add-handler.md](./workflows/add-handler.md) |
| Solution chưa có kiểm tra kiến trúc tự động | [workflows/add-arch-test.md](./workflows/add-arch-test.md) |

Skill tự kích hoạt theo mô tả việc — không cần gõ tên. Nói *"thêm API tạo đơn hàng"* hoặc *"đặt entity này ở đâu?"* là đủ.

## Cách gọi

```text
@.opencode/skills/minipower-backend-architecture-dotnet/workflows/add-feature.md

Thêm tính năng tạo đơn hàng cho Acme: POST /api/orders, lưu PostgreSQL.
```

## Lát cắt dọc — một tính năng đi qua đâu

```text
1. Domain          Order.cs · IOrderRepository.cs
2. Application     CreateOrderCommand.cs · CreateOrderHandler.cs · OrderDto.cs
3. Infrastructure  OrderRepository.cs · OrderConfiguration.cs · migration
4. Host            OrdersController.cs
5. Đăng ký DI      AddScoped trong ApplicationLayerExtension / InfrastructureLayerExtension
```

Bảng *Đặt file ở đâu* đầy đủ nằm trong [SKILL.md](./SKILL.md).

## Tham chiếu

| File | Nội dung | Khi nào mở |
|---|---|---|
| [reference/clean-architecture.md](./reference/clean-architecture.md) | Dependency Rule, ranh giới project, pattern implementation, chiến lược test theo layer | Phân vân "layer này được reference layer kia không" |
| [reference/ddd-tactical.md](./reference/ddd-tactical.md) | Bounded context, entity/VO/aggregate, repository, domain event, use case, anti-pattern, đặt tên | Thiết kế domain model |

Cả hai **không load mặc định** — mở khi cần tra một mục cụ thể.

## Kiểm tra

```bash
dotnet test -c Debug
```

Architecture test chạy ở cấu hình **Debug** để ArchUnitNET đọc đủ bytecode. Vi phạm hướng phụ thuộc ⇒ test đỏ, message nêu đúng luật bị vi phạm.

## Liên quan

- [minipower-backend-scaffold-dotnet](../minipower-backend-scaffold-dotnet/README.md) — scaffold solution, đã kèm sẵn `{Product}.ArchitectureTests`
- [minipower-backend-convention-dotnet](../minipower-backend-convention-dotnet/README.md) — quy ước viết code
- [minipower-backend-review-dotnet](../minipower-backend-review-dotnet/README.md) — review PR
