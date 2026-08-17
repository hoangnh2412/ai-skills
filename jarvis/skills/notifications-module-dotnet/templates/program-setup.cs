using Jarvis.Authentication;
using Jarvis.Modules.Notifications.Redis.Extensions;
using Jarvis.Multitenancy;
using Jarvis.Realtime.Extensions;
using Jarvis.Realtime.SignalR.Extensions;
using Module.Notifications.Extensions;

builder.AddNotificationModule();
builder.AddCoreRealtime()
    .UseSignalR()
    .UseRedisInboxStore()
    .AddNotificationAppServiceWithRealtime<CurrentUserInfo, CurrentTenantInfo>();

// app.MapRealtimeHub<CurrentUserInfo, CurrentTenantInfo>();
