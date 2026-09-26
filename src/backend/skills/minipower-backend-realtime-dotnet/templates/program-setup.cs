using Jarvis.Authentication;
using Jarvis.Multitenancy;
using Jarvis.Realtime.Extensions;
using Jarvis.Realtime.SignalR.Extensions;

builder.AddCoreRealtime()
    .UseSignalR();

// Pipeline:
// app.MapRealtimeHub<CurrentUserInfo, CurrentTenantInfo>();
