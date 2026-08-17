# Workflow: Khởi tạo tenant + EF (mặc định)

Áp dụng khi Host **chưa** có `AddCurrentTenant` và Infrastructure **chưa** có `AddEntityFramework()`.

## Checklist

```text
- [ ] 1. Host: AddCurrentTenant + store (Jarvis.Multitenancy)
- [ ] 2. Caching — AddJarvisCaching
- [ ] 3. Package Jarvis.ORM.EntityFramework + DB provider
- [ ] 4. AddEntityFramework() + AddCoreDbContext<T> (mặc định single DB)
- [ ] 5. AppDbContext, UoW 4 args, entities
- [ ] 6. appsettings ConnectionStrings + Cache + TenantHeaderKey
- [ ] 7. Migrate / EnsureMigrateDb
- [ ] 8. dotnet build
```

## Bước 0 — Host tenant

```csharp
builder.AddCurrentTenant<CurrentTenantInfo>();
builder.Services.TryAddSingleton<ICurrentTenantStore<CurrentTenantInfo>, CurrentTenantStore>();
```

Cùng `AddCurrentUser` — [foundation-dotnet](../../foundation-dotnet/workflows/init.md).

## Bước 1 — Caching trước

[caching-dotnet/workflows/init.md](../../caching-dotnet/workflows/init.md):

```csharp
builder.AddJarvisCaching();
```

## Bước 2 — Packages

```xml
<PackageReference Include="Jarvis.Multitenancy" Version="1.0.0" />
<PackageReference Include="Jarvis.ORM.EntityFramework" Version="1.0.0" />
<PackageReference Include="Jarvis.Caching" Version="1.1.0" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.*" />
```

## Bước 3 — Bootstrap

[templates/infrastructure-extension.cs](../templates/infrastructure-extension.cs):

```csharp
builder.AddJarvisCaching();
builder.AddEntityFramework();
builder.AddAppDbContext(); // theo pattern đã chọn
```

## Bước 4 — Chọn pattern

| Mô hình | SKILL |
|---------|-------|
| Single DB | [patterns/single-db/SKILL.md](../patterns/single-db/SKILL.md) |
| Separate tenant DB | [patterns/separate-tenant-db/SKILL.md](../patterns/separate-tenant-db/SKILL.md) |
| Hybrid | [patterns/hybrid/SKILL.md](../patterns/hybrid/SKILL.md) |

Đọc [reference/setup.md](../reference/setup.md) trước khi code.

## Bước 5 — appsettings

```json
{
  "ConnectionStrings": {
    "AutoMigrate": "true",
    "AppDbContext": "Host=localhost;..."
  },
  "Cache": {
    "Items": {
      "ConnectionString": { "Key": "conn:{dbid}", "MemSeconds": 14400 }
    }
  },
  "TenantHeaderKey": "X-Tenant-Id"
}
```

## Bước 6 — Validate

- `dotnet build`
- HTTP có tenant header → query filter hoạt động (single/hybrid pool)
- Job: `SwitchDbContextAsync` + `GetRepositoryAsync` lại
