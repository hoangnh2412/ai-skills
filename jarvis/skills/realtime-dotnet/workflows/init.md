# Workflow: Khởi tạo Realtime

Áp dụng khi Host **chưa** có `AddCoreRealtime()`.

## Checklist

```text
- [ ] 1. AddCurrentUser + AddCurrentTenant + store
- [ ] 2. Package Jarvis.Realtime + Jarvis.Realtime.SignalR
- [ ] 3. AddCoreRealtime().UseSignalR()
- [ ] 4. MapRealtimeHub<TUser, TTenant>()
- [ ] 5. dotnet build
```

[templates/program-setup.cs](../templates/program-setup.cs)

Inbox tiếp theo: [notifications-module-dotnet](../../notifications-module-dotnet/workflows/init.md).
