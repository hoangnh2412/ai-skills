# Workflow: Redis backplane

Áp dụng khi **đã có** `UseSignalR` và cần scale-out nhiều node.

## Checklist

```text
- [ ] 1. Realtime:SignalR:UseRedisBackplane = true
- [ ] 2. Realtime:SignalR:Redis (connection)
- [ ] 3. UseRedisBackplane() — UseSignalR tự gọi nếu options bật
```

**Không** dùng connection inbox (`Cache:DistributedGroups:Redis:Notifications`) cho backplane.
