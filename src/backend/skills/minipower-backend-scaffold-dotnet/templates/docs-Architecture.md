# Kiến trúc — {Product}

## Layers

| Project | Trách nhiệm |
|---|---|
| Domain.Shared | Enum, constant shared |
| Domain | Entity, repository interface, domain events |
| Application | Command/query, handler, DTO |
| Infrastructure | EF Core, repository implementation, external adapters |
| Host | Composition root, controllers, middleware pipeline |

## Jarvis integration (scaffold mặc định)

| Layer | Package / API | Skill mở rộng (repo Jarvis `.opencode/skills/`) |
|-------|----------------|--------------------------------------------------|
| Application | `Jarvis.DDD.Application` — CQRS | `minipower-backend-architecture-dotnet` |
| Infrastructure | `Jarvis.Caching` → `Jarvis.EntityFramework` | `minipower-backend-caching-dotnet`, `minipower-backend-entityframework-dotnet` |
| Host | Mvc, Swashbuckle, HealthChecks, OpenTelemetry | `minipower-backend-scaffold-dotnet`, `minipower-backend-swashbuckle-dotnet`, `minipower-backend-healthcheck-dotnet`, `minipower-backend-telemetry-dotnet` |

Chưa có trong scaffold — thêm khi cần: `minipower-backend-authentication-dotnet`, `minipower-backend-notification-dotnet`, `minipower-backend-blobstoring-dotnet`.

Bản đồ đầy đủ: skill `minipower-backend-scaffold-dotnet` → `templates/SKILLS.md`.

## DI entry points

- `Host.AddHostLayer()` → `Application.AddApplicationLayer()` + `Infrastructure.AddInfrastructureLayer()`
- `Infrastructure.AddInfrastructureLayer()` → `Domain.AddDomainLayer()` + persistence

Chi tiết scaffold: skill `minipower-backend-scaffold-dotnet` → `workflows/scaffold.md`.
