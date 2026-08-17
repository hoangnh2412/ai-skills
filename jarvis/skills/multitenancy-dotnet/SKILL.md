---
name: multitenancy-dotnet
description: Tenant ambient + persistence mặc định Jarvis.ORM.EntityFramework — AddCurrentTenant, AddEntityFramework, AddCoreDbContext, UoW. Dedicated DB opt-in qua Jarvis.Multitenancy.EntityFramework. Dùng khi tích hợp tenant .NET, single DB, separate tenant DB, hybrid, hoặc custom resolver.
metadata:
  audience: hoangnh
  workflow: github
---

# Jarvis.Multitenancy + EF — Orchestrator

Skill điều phối **tenant** trên ASP.NET Core. Persistence **mặc định là EF** (`Jarvis.ORM.EntityFramework`). Hướng dẫn: [README.md](README.md).

`entityframework-dotnet` đã gộp vào đây — prompt cũ chuyển sang skill này.

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Chưa có tenant Host + EF | [workflows/init.md](workflows/init.md) |
| Đổi mô hình DB / resolver | [workflows/add.md](workflows/add.md) |

## Quy tắc cốt lõi

- Host: `AddCurrentTenant<T>()` + `ICurrentTenantStore<T>` (`TryAddSingleton`). Cùng `AddCurrentUser` — [foundation-dotnet](../foundation-dotnet/README.md).
- Persistence mặc định: `AddJarvisCaching()` → `AddEntityFramework()` → `AddCoreDbContext<T>(configure)` (shared / master, connection cố định).
- Dedicated tenant DB (opt-in): `AddMultitenancyEntityFramework()` + `AddCoreDbContext<T, TResolver>`.
- `AddEntityFramework()` không đăng ký interceptor.
- UoW 4 args: `services`, `factory`, `ITenantIdResolverFactory`, `ICurrentTenantAccessor`.
- Sau `SwitchDbContextAsync` → **`GetRepositoryAsync` lại**.
- `IStorageContext` chỉ `SetTenantId` — tenant làm việc = `ICurrentTenant`.
- Query filter/sort: `Jarvis.DDD.Domain.Querying` (mục — chưa skill riêng).
- **Không** `Jarvis.Tenants` CRUD (chưa có code).

## Packages

| PackageId | Layer |
|---|---|
| `Jarvis.Multitenancy` | Host |
| `Jarvis.ORM.EntityFramework` | Infrastructure (mặc định) |
| `Jarvis.Caching` | Infrastructure (trước EF) |
| `Jarvis.Multitenancy.EntityFramework` | Infrastructure (opt-in dedicated DB) |

## Patterns (atomic)

| Mô hình | Path |
|---|---|
| Single DB + `TenantId` (**mặc định**) | [patterns/single-db/SKILL.md](patterns/single-db/SKILL.md) |
| Separate tenant DB | [patterns/separate-tenant-db/SKILL.md](patterns/separate-tenant-db/SKILL.md) |
| Hybrid | [patterns/hybrid/SKILL.md](patterns/hybrid/SKILL.md) |
| Custom DI resolver | [patterns/custom-di/SKILL.md](patterns/custom-di/SKILL.md) |

**Luôn đọc:** [reference/setup.md](reference/setup.md).

## Templates

- [templates/infrastructure-extension.cs](templates/infrastructure-extension.cs)

## Output bắt buộc

- Host: `AddCurrentTenant` + store
- Infrastructure: caching + EF + `AppDbContext` + UoW 4 args
- `appsettings` `ConnectionStrings`, `Cache:Items:ConnectionString`, `TenantHeaderKey`
- `dotnet build`
