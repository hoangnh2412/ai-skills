// EnrichTraceService.cs / EnrichLogService.cs — implement IEnrich* trực tiếp.
// User/tenant: AddUserContextTelemetryEnrichment<TUser, TTenant>() (Jarvis.OpenTelemetry.DDD).

using Jarvis.OpenTelemetry.Abstractions;

namespace {App}.Services;

public sealed class EnrichTraceService : IEnrichTraceService
{
    public Task<Dictionary<string, string>> ExtractAsync()
        => Task.FromResult(new Dictionary<string, string>());
}

public sealed class EnrichLogService : IEnrichLogService
{
    public Task<Dictionary<string, string>> ExtractAsync()
        => Task.FromResult(new Dictionary<string, string>());
}

// Đăng ký trong AddJarvisOpenTelemetry callback:
// services.AddUserContextTelemetryEnrichment<CurrentUserInfo, CurrentTenantInfo>();
// services.AddScoped<IEnrichTraceService, EnrichTraceService>();
// services.AddScoped<IEnrichLogService, EnrichLogService>();
