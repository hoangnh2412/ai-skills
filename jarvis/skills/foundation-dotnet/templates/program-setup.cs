// Host — Jarvis foundation (minimal)
using Jarvis.Authentication;
using Jarvis.DDD.Domain;
using Jarvis.DDD.Domain.Services;
using Jarvis.Multitenancy;
using Jarvis.Mvc;
using Jarvis.Mvc.ApplicationBuilders;
using Jarvis.Mvc.ExceptionHandling;
using Microsoft.Extensions.DependencyInjection.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddCoreJson();
builder.AddCoreCors();
builder.AddCoreDomain();
builder.AddCurrentUser<CurrentUserInfo>();
builder.AddCurrentTenant<CurrentTenantInfo>();
builder.Services.TryAddSingleton<ICurrentUserStore<CurrentUserInfo>, CurrentUserStore>();
builder.Services.TryAddSingleton<ICurrentTenantStore<CurrentTenantInfo>, CurrentTenantStore>();
builder.AddCoreWebApi();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCoreSpa();
app.UseCoreCors();
app.UseCoreMiddleware<ApiResponseWrapperMiddleware>();
app.MapControllers();

app.Run();
