using Jarvis.OpenTelemetry.Abstractions;

namespace {Product}.Host.Services;

/// <summary>
/// Enrich tùy chọn (tag ổn định). User/tenant mặc định: AddUserContextTelemetryEnrichment trên Host.
/// </summary>
public sealed class EnrichTraceService : IEnrichTraceService
{
  public Task<Dictionary<string, string>> ExtractAsync()
    => Task.FromResult(new Dictionary<string, string>());
}
