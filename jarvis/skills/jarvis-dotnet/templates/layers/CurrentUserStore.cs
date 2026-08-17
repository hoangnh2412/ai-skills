using Jarvis.Authentication;
using Jarvis.DDD.Domain.Services;
using Microsoft.AspNetCore.Http;

namespace {Product}.Host.Services;

/// <summary>
/// Store tối thiểu: dựng CurrentUserInfo từ claims. Host thật thay bằng DB/cache.
/// </summary>
public sealed class CurrentUserStore(IHttpContextAccessor httpContextAccessor)
  : ICurrentUserStore<CurrentUserInfo>
{
  public Task<CurrentUserInfo?> FindAsync(Guid userId, CancellationToken cancellationToken = default)
  {
    cancellationToken.ThrowIfCancellationRequested();
    var principal = httpContextAccessor.HttpContext?.User;
    if (principal?.Identity?.IsAuthenticated != true)
      return Task.FromResult<CurrentUserInfo?>(null);

    return Task.FromResult<CurrentUserInfo?>(new CurrentUserInfo
    {
      UserId = userId,
      UserName = principal.Identity.Name,
    });
  }
}
