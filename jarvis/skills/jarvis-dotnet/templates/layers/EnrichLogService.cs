using Jarvis.OpenTelemetry.Abstractions;

namespace {Product}.Host.Services;

/// <summary>
/// Enrich tùy chọn. User/tenant mặc định: AddUserContextTelemetryEnrichment trên Host.
/// </summary>
public sealed class EnrichLogService : IEnrichLogService
{
  public Task<Dictionary<string, string>> ExtractAsync()
    => Task.FromResult(new Dictionary<string, string>());
}
