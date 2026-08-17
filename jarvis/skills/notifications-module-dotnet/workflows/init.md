# Workflow: Khởi tạo inbox in-app

Áp dụng khi Host **chưa** có `AddNotificationModule` / `UseRedisInboxStore`.

## Checklist

```text
- [ ] 1. realtime-dotnet init (AddCoreRealtime + UseSignalR)
- [ ] 2. Package Notifications + Redis + Api
- [ ] 3. AddNotificationModule()
- [ ] 4. UseRedisInboxStore() + AddNotificationAppServiceWithRealtime<,>()
- [ ] 5. Cache:DistributedGroups:Redis:Notifications
- [ ] 6. MapRealtimeHub
- [ ] 7. (tuỳ chọn) AddProvider inbox trên setting-dotnet
```

[templates/program-setup.cs](../templates/program-setup.cs)

## Anti-patterns

- Gộp vào `notification-dotnet` (SMTP)
- Nhét store inbox vào `Jarvis.Realtime`
- Dùng connection backplane cho inbox
