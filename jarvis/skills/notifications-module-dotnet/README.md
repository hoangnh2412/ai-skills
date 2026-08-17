# notifications-module-dotnet

Skill **inbox in-app** — không phải email SMTP. Agent đọc [SKILL.md](./SKILL.md).

## Cách gọi

```text
@.opencode/skills/notifications-module-dotnet/workflows/init.md

Init inbox Redis + REST + cầu SignalR cho MyApp.Host.
```

## Entry (khớp Sample)

```csharp
builder.AddNotificationModule();
builder.AddCoreRealtime()
    .UseSignalR()
    .UseRedisInboxStore()
    .AddNotificationAppServiceWithRealtime<CurrentUserInfo, CurrentTenantInfo>();

app.MapRealtimeHub<CurrentUserInfo, CurrentTenantInfo>();
```

SMTP: [notification-dotnet](../notification-dotnet/README.md).
