# realtime-dotnet

Skill **Jarvis.Realtime** — SignalR transport. Agent đọc [SKILL.md](./SKILL.md).

Inbox: [notifications-module-dotnet](../notifications-module-dotnet/README.md).

## Cách gọi

```text
@.opencode/skills/realtime-dotnet/workflows/init.md

Init AddCoreRealtime + UseSignalR + MapRealtimeHub cho MyApp.Host.
```

## Entry

```csharp
builder.AddCoreRealtime()
    .UseSignalR();

app.MapRealtimeHub<CurrentUserInfo, CurrentTenantInfo>();
```

Backplane: [workflows/add.md](./workflows/add.md).
