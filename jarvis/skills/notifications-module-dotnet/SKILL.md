---
name: notifications-module-dotnet
description: Thiết lập inbox in-app Jarvis.Modules.Notifications — AddNotificationModule, UseRedisInboxStore, AddNotificationAppServiceWithRealtime. Dùng khi cần list/mark thông báo. Không phải SMTP.
metadata:
  audience: hoangnh
  workflow: github
---

# Jarvis.Modules.Notifications — Inbox

Skill **inbox in-app** (store + REST + cầu realtime). **Không** SMTP — [notification-dotnet](../notification-dotnet/README.md). Transport thuần — [realtime-dotnet](../realtime-dotnet/README.md).

Hướng dẫn: [README.md](README.md).

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Host chưa có inbox | [workflows/init.md](workflows/init.md) |

## Quy tắc cốt lõi

- Prereq: identity Host + `AddCoreRealtime().UseSignalR()` ([realtime-dotnet](../realtime-dotnet/README.md)).
- `AddNotificationModule()` — ApplicationPart REST; **không** gọi Realtime.
- `UseRedisInboxStore()` — config **`Cache:DistributedGroups:Redis:Notifications`** (`Configuration` + `InstanceName`). Không `SignalR:Store`.
- Cầu: `AddNotificationAppServiceWithRealtime<TUser, TTenant>()` (package SignalR — Q-P2-d).
- Persist-first: Save store → Publish. Push fail ≠ mất data.
- Framework Realtime **không** chứa list/mark/retention.
- Setting inbox: `AddProvider<NotificationInboxSettingDefinition>()` — [setting-dotnet](../setting-dotnet/README.md).
- Không FE `@jarvis/notifications`.

## Packages

| PackageId | Khi nào |
|---|---|
| `Jarvis.Modules.Notifications` | AppService / definitions |
| `Jarvis.Modules.Notifications.Redis` | `UseRedisInboxStore` |
| `Jarvis.Modules.Notifications.Api` | `AddNotificationModule` |
| `Jarvis.Realtime.SignalR` | Cầu `AddNotificationAppServiceWithRealtime` |

## Templates

- [templates/program-setup.cs](templates/program-setup.cs)

## Output bắt buộc

- `AddNotificationModule` + `UseRedisInboxStore` + cầu realtime + `MapRealtimeHub`
- Section Redis inbox
- `dotnet build`
