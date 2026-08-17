// {Product}.Infrastructure — EF + Caching (đổi pattern trong AddAppDbContext)

using Jarvis.Caching.Extensions;
using Jarvis.ORM.EntityFramework;
using Jarvis.ORM.EntityFramework.DataStorages;
using Microsoft.EntityFrameworkCore;

public static class InfrastructureLayerExtension
{
  public static IHostApplicationBuilder AddInfrastructureLayer(this IHostApplicationBuilder builder)
  {
    builder.AddJarvisCaching();
    builder.AddEntityFramework();

    builder.Services.AddScoped<IAppUnitOfWork, AppUnitOfWork>();

    // Single / shared DB — xem patterns/single-db/SKILL.md
    builder.Services.AddCoreDbContext<AppDbContext>(options =>
      options.UseNpgsql("Host=localhost;Database=placeholder"));

    // Dedicated tenant DB (opt-in):
    // builder.AddMultitenancyEntityFramework();
    // builder.Services.AddCoreDbContext<AppDbContext, ConfigConnectionStringResolver>(...);

    return builder;
  }
}
