// Scaffold Host — mở rộng: jarvis-dotnet/templates/SKILLS.md
//   telemetry-dotnet | foundation-dotnet | swashbuckle-dotnet | healthcheck-dotnet
//   authentication-dotnet (scheme — AddJarvisAuthentication, không gọi AddAuthentication trực tiếp)

using {Product}.Application.DependencyInjection;
using {Product}.Infrastructure.DependencyInjection;
using {Product}.Host.Services;
using Asp.Versioning;
using Jarvis.Authentication;
using Jarvis.DDD.Domain;
using Jarvis.DDD.Domain.Services;
using Jarvis.HealthChecks;
using Jarvis.Multitenancy;
using Jarvis.Mvc;
using Jarvis.Mvc.ApplicationBuilders;
using Jarvis.Mvc.ExceptionHandling;
using Jarvis.OpenTelemetry.Abstractions;
using Jarvis.OpenTelemetry.DDD.Extensions;
using Jarvis.OpenTelemetry.Extensions;
using Jarvis.Swashbuckle;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace {Product}.Host.DependencyInjection;

public static class HostLayerExtension
{
  public static IHostApplicationBuilder AddHostLayer(this IHostApplicationBuilder builder)
  {
    builder.Services
      .AddJarvisOpenTelemetry(builder.Configuration, services =>
      {
        services.AddUserContextTelemetryEnrichment<CurrentUserInfo, CurrentTenantInfo>();
        services.AddScoped<IEnrichLogService, EnrichLogService>();
        services.AddScoped<IEnrichTraceService, EnrichTraceService>();
      })
      .ConfigureResource()
      .ConfigureLogging()
      .ConfigureTrace()
      .ConfigureMetric();

    builder.AddApplicationLayer();
    builder.AddInfrastructureLayer();

    builder.AddCoreJson();
    builder.AddCoreCors();
    builder.AddCoreDomain();
    builder.AddCurrentUser<CurrentUserInfo>();
    builder.AddCurrentTenant<CurrentTenantInfo>();
    builder.Services.TryAddSingleton<ICurrentUserStore<CurrentUserInfo>, CurrentUserStore>();
    builder.Services.TryAddSingleton<ICurrentTenantStore<CurrentTenantInfo>, CurrentTenantStore>();
    builder.AddCoreWebApi();

    builder.Services.AddApiVersioning(options =>
    {
      options.DefaultApiVersion = new ApiVersion(1, 0);
      options.AssumeDefaultVersionWhenUnspecified = true;
      options.ReportApiVersions = true;
    }).AddApiExplorer(options =>
    {
      options.GroupNameFormat = "'v'VVV";
      options.SubstituteApiVersionInUrl = true;
    });

    builder.AddCoreSwagger();
    builder.AddHealthChecks();

    return builder;
  }

  public static WebApplication UseHostLayer(this WebApplication app)
  {
    app.UseCoreSwagger();
    app.UseHttpsRedirection();
    app.UseCoreSpa();
    app.UseCoreCors();
    app.UseJarvisOpenTelemetry();
    app.UseCoreMiddleware<ApiResponseWrapperMiddleware>();
    app.MapControllers();
    app.UseHealthChecks();
    return app;
  }
}
