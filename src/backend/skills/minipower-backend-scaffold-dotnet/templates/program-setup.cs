// Program.cs — single-project bootstrap (legacy / Sample-style)
// Solution phân lớp: dùng templates/layers/Program.cs + HostLayerExtension thay file này.
// Replace {App} with your application namespace.

using Jarvis.Authentication;
using Jarvis.BlobStoring.Extensions;
using Jarvis.Caching.Extensions;
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
using Jarvis.ORM.EntityFramework;
using Jarvis.Swashbuckle;
using Microsoft.Extensions.DependencyInjection.Extensions;
using {App}.Persistence;
using {App}.Services;

var builder = WebApplication.CreateBuilder(args);

// --- OpenTelemetry (optional — see telemetry-dotnet skill) ---
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

// --- Foundation ---
builder.AddCoreJson();
builder.AddCoreCors();
builder.AddCoreDomain();
builder.AddCurrentUser<CurrentUserInfo>();
builder.AddCurrentTenant<CurrentTenantInfo>();
builder.Services.TryAddSingleton<ICurrentUserStore<CurrentUserInfo>, CurrentUserStore>();
builder.Services.TryAddSingleton<ICurrentTenantStore<CurrentTenantInfo>, CurrentTenantStore>();
builder.AddCoreWebApi();

builder.AddJarvisCaching();
builder.AddCoreBlobStoring();

// --- EF Core (shared DB). Dedicated tenant DB: AddMultitenancyEntityFramework + AddCoreDbContext<T, TResolver> ---
builder.AddEntityFramework();
builder.Add{App}DbContext();

// --- Swagger ---
builder.AddCoreSwagger();

// --- Health checks (optional — see healthcheck-dotnet skill) ---
builder.AddHealthChecks();
// builder.Add{App}ReadinessHealthChecks();

var app = builder.Build();

app.UseCoreSwagger();
app.UseHttpsRedirection();
app.UseCoreSpa();
app.UseCoreCors();
app.UseJarvisOpenTelemetry();
app.UseCoreMiddleware<ApiResponseWrapperMiddleware>();
app.MapControllers();
app.UseHealthChecks();

app.Run();
