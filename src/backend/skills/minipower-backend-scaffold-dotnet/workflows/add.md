# Workflow: Thêm module Jarvis

Áp dụng khi project **đã có** foundation Jarvis và cần bổ sung một module.

## Checklist

```text
- [ ] 1. Xác định module (entityframework | authentication | caching | …)
- [ ] 2. Đọc skill `*-dotnet` (bảng [templates/SKILLS.md](../templates/SKILLS.md))
- [ ] 3. Thêm ProjectReference / PackageReference
- [ ] 4. Đăng ký extension trong Program.cs
- [ ] 5. Thêm section appsettings
- [ ] 6. Validate
```

## Bước 1 — Chọn module

| Module | Skill |
|------|-----|
| Kiến trúc / tính năng mới | [minipower-backend-architecture-dotnet/SKILL.md](../../minipower-backend-architecture-dotnet/SKILL.md) |
| Authentication | [minipower-backend-authentication-dotnet/SKILL.md](../../minipower-backend-authentication-dotnet/SKILL.md) |
| Notification | [minipower-backend-notification-dotnet/SKILL.md](../../minipower-backend-notification-dotnet/SKILL.md) |
| Caching | [minipower-backend-caching-dotnet/SKILL.md](../../minipower-backend-caching-dotnet/SKILL.md) |
| Entity Framework | [minipower-backend-entityframework-dotnet/SKILL.md](../../minipower-backend-entityframework-dotnet/SKILL.md) |
| Swashbuckle | [minipower-backend-swashbuckle-dotnet/SKILL.md](../../minipower-backend-swashbuckle-dotnet/SKILL.md) |
| Blob storing | [minipower-backend-blobstoring-dotnet/SKILL.md](../../minipower-backend-blobstoring-dotnet/SKILL.md) |
| OpenTelemetry | [minipower-backend-telemetry-dotnet/SKILL.md](../../minipower-backend-telemetry-dotnet/SKILL.md) |
| Health checks | [minipower-backend-healthcheck-dotnet/SKILL.md](../../minipower-backend-healthcheck-dotnet/SKILL.md) |

Không thêm package không dùng (giảm dependency surface).

## Bước 2 — Thêm package

Ví dụ thêm JWT auth:

```xml
<PackageReference Include="Jarvis.Authentications.Jwt" Version="1.0.1" />
```

Hoặc ProjectReference tới `Jarvis.Authentication.Jwt`.

## Bước 3 — Registration

Copy snippet từ skill `*-dotnet` (workflow hoặc provider) vào `Program.cs` đúng vị trí:

| Module | Thường đăng ký khi |
|---|---|
| Caching | **`AddJarvisCaching()` trước EntityFramework** (Infrastructure) |
| EntityFramework | sau `AddJarvisCaching()` |
| Authentication | `builder.Services.AddAuthentication()` chain |
| OpenTelemetry | đầu `Program.cs`, trước `Build()` |
| HealthChecks | trước `Build()`, `UseHealthChecks()` cuối pipeline |
| Swashbuckle | sau `AddCoreWebApi` |

## Bước 4 — Config

Thêm section appsettings theo module (xem từng SKILL).

## Bước 5 — Skill chuyên sâu

Mỗi module có `workflows/init.md` / `workflows/add.md` và `providers/` riêng — xem README skill tương ứng trong [.opencode/README.md](../../../README.md).

## Anti-patterns

- Reference `Jarvis.Mvc` mà không có `Jarvis.DDD.Domain.Shared` (Mvc phụ thuộc shared)
- `AddCoreDbContext` mà chưa `AddEntityFramework()` / chưa đăng ký `ITenantConnectionStringResolver`
- Copy toàn bộ Sample.csproj cho microservice chỉ cần API + DB
