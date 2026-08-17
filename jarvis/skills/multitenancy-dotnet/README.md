# multitenancy-dotnet

Skill **tenant + EF mặc định** — `AddCurrentTenant`, `Jarvis.ORM.EntityFramework`, UoW. Dedicated DB opt-in. Agent đọc [SKILL.md](./SKILL.md).

Thay thế `entityframework-dotnet` (stub redirect).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Chưa có tenant / EF Jarvis | [workflows/init.md](./workflows/init.md) |
| Đổi mô hình DB / custom resolver | [workflows/add.md](./workflows/add.md) + [patterns/](./patterns/) |

## Cách gọi

```text
@.opencode/skills/multitenancy-dotnet/workflows/init.md

Init tenant + EF single DB cho MyApp.
```

## Mặc định (shared DB)

```csharp
builder.AddCurrentTenant<CurrentTenantInfo>();
builder.Services.TryAddSingleton<ICurrentTenantStore<CurrentTenantInfo>, CurrentTenantStore>();

builder.AddJarvisCaching();
builder.AddEntityFramework();
builder.Services.AddCoreDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("AppDbContext")!));
```

Dedicated: `AddMultitenancyEntityFramework()` + `AddCoreDbContext<T, TResolver>` — [patterns/separate-tenant-db](./patterns/separate-tenant-db/SKILL.md).

## Liên quan

- [foundation-dotnet](../foundation-dotnet/README.md) — `AddCurrentUser` / store user
- [caching-dotnet](../caching-dotnet/README.md)
- [setting-dotnet](../setting-dotnet/README.md) — cần tenant + cache
- [jarvis-dotnet](../jarvis-dotnet/README.md)
