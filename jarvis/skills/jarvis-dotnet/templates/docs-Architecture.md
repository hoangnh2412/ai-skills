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

| Layer | Package / API | Skill mở rộng (`ai-skills/jarvis/skills/`) |
|-------|----------------|---------------------------------------------|
| Application | `Jarvis.DDD.Application` — CQRS | `application-dotnet` |
| Infrastructure | `Jarvis.Caching` → `Jarvis.ORM.EntityFramework` | `caching-dotnet`, `multitenancy-dotnet` |
| Host | Mvc, CurrentUser/Tenant, Swashbuckle, HealthChecks, OTEL + DDD | `foundation-dotnet`, `swashbuckle-dotnet`, `healthcheck-dotnet`, `telemetry-dotnet` |

Chưa có trong scaffold — thêm khi cần: `authentication-dotnet`, `notification-dotnet`, `blobstoring-dotnet`.

Bản đồ đầy đủ: skill `jarvis-dotnet` → `templates/SKILLS.md`.

## DI entry points

- `Host.AddHostLayer()` → `Application.AddApplicationLayer()` + `Infrastructure.AddInfrastructureLayer()`
- `Infrastructure.AddInfrastructureLayer()` → `Domain.AddDomainLayer()` + persistence

Chi tiết scaffold: skill `jarvis-dotnet` → `workflows/scaffold.md`.
