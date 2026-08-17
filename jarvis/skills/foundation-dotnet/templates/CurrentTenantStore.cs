using Jarvis.DDD.Domain.Services;
using Jarvis.Multitenancy;

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
