---
name: telemetry-dotnet-enrich
description: Đăng ký AddUserContextTelemetryEnrichment và IEnrich* trong AddJarvisOpenTelemetry. Dùng khi cần tag user/tenant trên trace/log.
dependencies:
  - Jarvis.OpenTelemetry
  - Jarvis.OpenTelemetry.DDD
---

# Enrich trace / log

User/tenant mặc định — `Jarvis.OpenTelemetry.DDD` (Host đã `AddCurrentUser` + `AddCurrentTenant`):

```csharp
using Jarvis.OpenTelemetry.DDD.Extensions;

builder.Services
    .AddJarvisOpenTelemetry(builder.Configuration, services =>
    {
        services.AddUserContextTelemetryEnrichment<CurrentUserInfo, CurrentTenantInfo>();
        services.AddScoped<IEnrichLogService, EnrichLogService>();
        services.AddScoped<IEnrichTraceService, EnrichTraceService>();
        services.AddScoped<IEnrichmentSource, AppSharedEnrichmentSource>();
    });

app.UseJarvisOpenTelemetry();
```

`IEnrich*` / `IEnrichmentSource` implement trực tiếp — **không** kế thừa base Domain đã xóa.

```csharp
public sealed class EnrichTraceService : IEnrichTraceService
{
    public Task<Dictionary<string, string>> ExtractAsync()
        => Task.FromResult(new Dictionary<string, string>());
}
```

Mẫu: [templates/enrich-service.cs](../../templates/enrich-service.cs).
