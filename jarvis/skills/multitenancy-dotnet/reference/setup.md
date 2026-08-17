# EF — Setup chung

Đọc sau [SKILL.md](../SKILL.md). Chọn mô hình: [single-db](../patterns/single-db/SKILL.md) | [separate-tenant-db](../patterns/separate-tenant-db/SKILL.md) | [hybrid](../patterns/hybrid/SKILL.md).

## Thành phần Jarvis

| Thành phần | Package | Vai trò |
|---|---|---|
| `BaseStorageContext<T>` | ORM.EF | Global query filter theo snapshot tenant (`ITenantEntity`) |
| `BaseUnitOfWork<T>` | ORM.EF | 4 args: `services`, `factory`, `ITenantIdResolverFactory`, `ICurrentTenantAccessor` |
| `ITenantIdResolver` / `ITenantIdResolverFactory` | Domain + Multitenancy | Tenant id (keyed: Header, User, Query, Host) — đăng ký qua `AddCurrentTenant` |
| `ITenantConnectionStringResolver` | Domain | `GetConnectionStringAsync(name)` |
| `ConfigConnectionStringResolver` | Domain | `IConfiguration.GetConnectionString` |
| `DbTenantConnectionStringResolver<TMaster, TTenant>` | Multitenancy.EF | Lookup `ITenantManagementEntity` trên Master |
| `TenantDbConnectionInterceptor` | Multitenancy.EF | Ghi connection lúc mở (overload 2 generic) |
| `ITenantManagementEntity` | Domain | Registry Master: `Id`, `ConnectionString` |
| `IStorageContext` | Domain | Chỉ `SetTenantId` — không public getter tenant |

`AddJarvisCaching()` rồi `AddEntityFramework()` → repository + cache wrapper cho `ConfigConnectionStringResolver`. **Không** interceptor. Dedicated DB: thêm `AddMultitenancyEntityFramework()`. Mọi `ITenantConnectionStringResolver` được bọc cache (`Cache:Items:ConnectionString`, `conn:{dbid}`).

## Luồng resolve tenant

1. **UoW / filter:** `_switchedTenantId` → `ITenantIdResolverFactory`. Snapshot vào context qua `SetTenantId`.
2. **Connection (dedicated):** interceptor + `ITenantIdResolverFactory` → keyed `ITenantConnectionStringResolver`.
3. Tenant làm việc ở app = `ICurrentTenant` — **không** đọc tenant từ `IStorageContext`.

**Không có tenant:** `ConnectionStrings:{DbContextName}` (migrate, Master-only job).

## DbContext & UoW

```csharp
using Jarvis.ORM.EntityFramework.DataStorages;
using Jarvis.ORM.EntityFramework.Repositories;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : BaseStorageContext<AppDbContext>(options)
{
    public DbSet<Order> Orders => Set<Order>();
}

public class AppUnitOfWork(
    IServiceProvider services,
    IDbContextFactory<AppDbContext> factory,
    ITenantIdResolverFactory tenantIdResolverFactory,
    ICurrentTenantAccessor currentTenantAccessor)
    : BaseUnitOfWork<AppDbContext>(services, factory, tenantIdResolverFactory, currentTenantAccessor),
      IAppUnitOfWork;
```

## Entity

**`ITenantEntity`** (single DB, hybrid pool):

```csharp
public class Order : BaseEntity<Guid>, ITenantEntity
{
    public Guid TenantId { get; set; }
}
```

**`ITenantManagementEntity`** (Master, mô hình 2 & 3):

```csharp
public class Tenant : BaseEntity<Guid>, ITenantManagementEntity
{
    public required string ConnectionString { get; set; }
}
```

## appsettings.json

```json
{
  "ConnectionStrings": {
    "AutoMigrate": "true",
    "AppDbContext": "Host=localhost;...",
    "MasterDbContext": "Host=localhost;...;Database=master"
  },
  "TenantHeaderKey": "X-Tenant-Id",
  "TenantQueryName": "tenantId"
}
```

Placeholder `AppDbContext` khi dùng interceptor (connection thật từ Master / resolver).

## Migrate

```csharp
app.EnsureMigrateDb<IMasterUnitOfWork>();
app.EnsureMigrateDb<IAppUnitOfWork>();
```

`ConnectionStrings:AutoMigrate` = `true`. Dedicated/hybrid: migrate từng DB tenant ngoài placeholder.

## API tham chiếu

| API | Package | Mục đích |
|---|---|---|
| `AddEntityFramework()` | ORM.EF | Repository + cache wrapper resolver |
| `AddCoreDbContext<TDb>(configure)` | ORM.EF | Connection cố định |
| `AddMultitenancyEntityFramework()` | Multitenancy.EF | Interceptor + factory — opt-in |
| `AddCoreDbContext<TDb, TResolver>(configure)` | Multitenancy.EF | Per-tenant connection |
| `AddCurrentTenant<T>()` | Multitenancy | HTTP resolvers + accessor |
| `EnsureMigrateDb<TUnitOfWork>(app)` | ORM.EF | Auto migrate |
| `SwitchDbContextAsync(tenantId)` | UoW | Job: pin tenant + connection scope |

**Không** truyền `HeaderTenantIdResolver` vào `AddCoreDbContext` — đó là `ITenantIdResolver`.
