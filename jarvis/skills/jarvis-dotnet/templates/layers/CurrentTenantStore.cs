using Jarvis.DDD.Domain.Services;
using Jarvis.Multitenancy;

namespace {Product}.Host.Services;

/// <summary>
/// Store tối thiểu: map tenant id → CurrentTenantInfo. Host thật thay bằng DB/cache.
/// </summary>
public sealed class CurrentTenantStore : ICurrentTenantStore<CurrentTenantInfo>
{
  public Task<CurrentTenantInfo?> FindAsync(Guid tenantId, CancellationToken cancellationToken = default)
  {
    cancellationToken.ThrowIfCancellationRequested();
    return Task.FromResult<CurrentTenantInfo?>(new CurrentTenantInfo
    {
      TenantId = tenantId,
      Name = $"tenant-{tenantId:N}",
    });
  }
}
