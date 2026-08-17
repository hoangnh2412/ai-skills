// Program.cs — minimal Jarvis OpenTelemetry wiring
// Replace {App} with your application namespace.

using Jarvis.Authentication;
using Jarvis.Multitenancy;
using Jarvis.OpenTelemetry.Abstractions;
using Jarvis.OpenTelemetry.DDD.Extensions;
using Jarvis.OpenTelemetry.Extensions;
using {App}.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddJarvisOpenTelemetry(builder.Configuration, services =>
    {
        services.AddUserContextTelemetryEnrichment<CurrentUserInfo, CurrentTenantInfo>();
        services.AddScoped<IEnrichLogService, EnrichLogService>();
        services.AddScoped<IEnrichTraceService, EnrichTraceService>();
    })
    .ConfigureResource()
    .ConfigureLogging()
    .ConfigureTrace(options =>
    {
        // providers/entityframework, providers/redis
    })
    .ConfigureMetric();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();
app.UseJarvisOpenTelemetry();

app.Run();
