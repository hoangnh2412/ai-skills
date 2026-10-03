// Scaffold Infrastructure — mở rộng: jarvis-dotnet/templates/SKILLS.md
//   caching-dotnet (AddJarvisCaching trước EF) | multitenancy-dotnet (patterns/)
//   blobstoring-dotnet | notification-dotnet (thường Host hoặc Infrastructure)
// Dedicated tenant DB: AddMultitenancyEntityFramework + AddCoreDbContext<T, TResolver>
//   (package Jarvis.Multitenancy.EntityFramework — opt-in, không gộp vào ORM.EF)

using {Product}.Domain.DependencyInjection;
using {Product}.Domain.Repositories;
using {Product}.Infrastructure.Persistence;
using Jarvis.BlobStoring.Extensions;
using Jarvis.Caching.Extensions;
using Jarvis.DDD.Domain.DataStorages;
using Jarvis.ORM.EntityFramework;
using Jarvis.ORM.EntityFramework.DataStorages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace {Product}.Infrastructure.DependencyInjection;

public static class InfrastructureLayerExtension
{
  public static IHostApplicationBuilder AddInfrastructureLayer(this IHostApplicationBuilder builder)
  {
    builder.AddDomainLayer();
    builder.AddJarvisCaching();
    builder.AddCoreBlobStoring();
    builder.AddEntityFramework();

    builder.Services.AddScoped<IAppUnitOfWork, AppUnitOfWork>();

    builder.Services.AddCoreDbContext<AppDbContext>(options =>
      options.UseNpgsql("Host=localhost;Database=placeholder"));

    return builder;
  }
}
