---
name: foundation-dotnet
description: Thiết lập Jarvis foundation — Domain.Shared, Domain, Mvc (Json, WebApi, Cors, ApiResponseWrapper), AddCurrentUser + AddCurrentTenant trên Host. Dùng khi bootstrap API ASP.NET Core với response chuẩn BaseResponse.
metadata:
  audience: hoangnh
  workflow: github
---

# Jarvis Foundation — Orchestrator

Skill điều phối lớp nền: `Jarvis.DDD.Domain.Shared`, `Jarvis.DDD.Domain`, `Jarvis.Mvc` trên ASP.NET Core. Identity ambient: `Jarvis.Authentications` + `Jarvis.Multitenancy`.

Hướng dẫn người dùng: [README.md](README.md).

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Host chưa có Json/CORS/WebApi/middleware Jarvis | [workflows/init.md](workflows/init.md) |
| Đã có foundation, chỉnh CORS / wrapper / JSON | [workflows/add.md](workflows/add.md) |

## Quy tắc cốt lõi

- `Jarvis.Mvc` kéo transitive `Jarvis.Common`, `Jarvis.DDD.Domain.Shared`, `Jarvis.OpenTelemetry` — cân nhắc khi chỉ cần domain thuần.
- Thứ tự đăng ký: `AddCoreJson` → `AddCoreCors` → `AddCoreDomain` → `AddCurrentUser<T>` → `AddCurrentTenant<T>` → store → `AddCoreWebApi`.
- `AddCoreDomain()` là **no-op** (không đăng ký user/tenant). Host **bắt buộc** `AddCurrentUser<T>()` + `AddCurrentTenant<T>()` + `ICurrentUserStore<T>` / `ICurrentTenantStore<T>` (`TryAddSingleton`).
- Pipeline: `UseCoreCors` → `UseCoreMiddleware<ApiResponseWrapperMiddleware>` → `MapControllers`.
- SPA Host: **một dòng** `app.UseCoreSpa()` — không dạy React/kit (ADR frontend).
- Section `Middlewares:ApiResponseWrapper` — `Includes` regex path (vd. `^/api`).
- Encryption AES-GCM: `services.AddEncryptionOptions()` (`Jarvis.Common.Encryption`, section `Encryption`) khi cần — không bắt buộc scaffold.

## Packages

| PackageId | Layer |
|---|---|
| `Jarvis.DDD.Domain.Shared` | Domain.Shared |
| `Jarvis.DDD.Domain` | Host (contracts user/tenant — không impl) |
| `Jarvis.Mvc` | Host |
| `Jarvis.Authentications` | Host (`AddCurrentUser`) |
| `Jarvis.Multitenancy` | Host (`AddCurrentTenant`) |

## Templates

- [templates/program-setup.cs](templates/program-setup.cs)
- [templates/CurrentUserStore.cs](templates/CurrentUserStore.cs)
- [templates/CurrentTenantStore.cs](templates/CurrentTenantStore.cs)
- [templates/appsettings-foundation.json](templates/appsettings-foundation.json)

## Liên quan

- Tenant + EF: [multitenancy-dotnet](../multitenancy-dotnet/README.md)
- Scaffold toàn solution: [jarvis-dotnet](../jarvis-dotnet/README.md)
- Scheme JWT/API Key: [authentication-dotnet](../authentication-dotnet/README.md)
- Swagger sau foundation: [swashbuckle-dotnet](../swashbuckle-dotnet/README.md)
- OTEL user/tenant: [telemetry-dotnet](../telemetry-dotnet/README.md)

## Output bắt buộc

- Extensions `AddCore*` / `UseCore*` trên Host
- `AddCurrentUser` + `AddCurrentTenant` + store
- `appsettings`: `Json`, `Cors`, `Middlewares`
- API trả `BaseResponse` cho path trong `Includes` (nếu bật wrapper)
