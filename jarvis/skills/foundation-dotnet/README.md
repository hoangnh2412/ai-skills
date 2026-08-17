# foundation-dotnet

Skill thiết lập **Jarvis foundation** — JSON chuẩn, CORS, WebApi, middleware `ApiResponseWrapper`, ambient `AddCurrentUser` / `AddCurrentTenant`.

Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Host chưa có Jarvis Mvc/Json | [workflows/init.md](./workflows/init.md) |
| Chỉnh CORS / wrapper / JSON policy | [workflows/add.md](./workflows/add.md) |

Scaffold solution mới → [jarvis-dotnet](../jarvis-dotnet/README.md) (đã wire foundation trong template).

## Cách gọi

```text
@.opencode/skills/foundation-dotnet/workflows/init.md

Init Jarvis foundation cho MyApp.Host — ApiResponseWrapper cho /api.
```

## Extension chính

| Extension | Mục đích |
|-----------|----------|
| `AddCoreJson` | Controllers + JSON/Newtonsoft + BadRequest `BaseResponse` |
| `AddCoreWebApi` | `AddEndpointsApiExplorer`, `HttpContextAccessor` |
| `AddCoreDomain` | No-op — giữ thứ tự; không đăng ký user/tenant |
| `AddCurrentUser<T>` | `ICurrentUser<T>` + accessor (`Jarvis.Authentications`) |
| `AddCurrentTenant<T>` | `ICurrentTenant<T>` + HTTP tenant resolvers (`Jarvis.Multitenancy`) |
| `AddCoreCors` | CORS từ section `Cors` |
| `UseCoreMiddleware<T>` | Pipeline middleware (wrapper, …) |
| `UseCoreSpa()` | Một dòng serve SPA — chi tiết kit: ADR frontend |

Host đăng ký store: `TryAddSingleton<ICurrentUserStore<T>, …>` và `ICurrentTenantStore<T>`.

Mẫu: [templates/program-setup.cs](./templates/program-setup.cs).

## Liên quan

- [authentication-dotnet](../authentication-dotnet/README.md) — scheme (JWT / API Key) sau identity ambient
- [swashbuckle-dotnet](../swashbuckle-dotnet/README.md) — sau `AddCoreWebApi`
- [jarvis-dotnet](../jarvis-dotnet/README.md) — scaffold
