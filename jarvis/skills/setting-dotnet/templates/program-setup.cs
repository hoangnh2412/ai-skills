using Jarvis.Modules.Setting.API.Extensions;
using Jarvis.Modules.Setting.EntityFramework.Extensions;
using Jarvis.Modules.Setting.Extensions;
using Jarvis.Multitenancy;

public static IHostApplicationBuilder AddAppSettings(this IHostApplicationBuilder builder)
{
  builder.AddCoreSetting()
    .UseEntityFramework<IAppUnitOfWork, CurrentTenantInfo>()
    .UseHttpApi()
    .AddProvider<AppSettingDefinition>();
  return builder;
}
