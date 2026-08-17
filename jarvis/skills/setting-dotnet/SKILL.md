---
name: setting-dotnet
description: Thiết lập Jarvis.Modules.Setting — AddCoreSetting, UseEntityFramework, UseHttpApi, AddProvider Group/Key. Dùng khi host cần setting code-first, cache item Setting, hoặc REST setting.
metadata:
  audience: hoangnh
  workflow: github
---

# Jarvis.Modules.Setting — Orchestrator

Skill điều phối module Setting trên Host. Hướng dẫn: [README.md](README.md).

SPI `Jarvis.Modules.Setting.Abstractions` **chưa có trên HEAD** — không dạy. Bổ sung sau khi Jarvis implement.

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Host chưa có Setting | [workflows/init.md](workflows/init.md) |
| Thêm Group/Key (`ISettingDefinitionProvider`) | [workflows/add.md](workflows/add.md) |

## Quy tắc cốt lõi

- Trước: `AddJarvisCaching()` + `AddCurrentTenant<T>()` ([multitenancy-dotnet](../multitenancy-dotnet/README.md)).
- Entry: `builder.AddCoreSetting().UseEntityFramework<TUoW, TTenant>().UseHttpApi().AddProvider<T>()`.
- Cache item tên **`Setting`** trong `Cache:Items`. Encryption: `AddEncryptionOptions()` (section `Encryption`) — core tự gọi.
- HTTP API **không** kèm Authorize — Host tự gắn policy nếu cần (xem Sample `SettingHttpApiAuthorizationSample`, không bật mặc định).
- Không UI `@jarvis/setting` — [ADR frontend](../../../ADRs/proposed_2026-08-17_jarvis-skills-frontend.md).

## Packages

| PackageId | Khi nào |
|---|---|
| `Jarvis.Modules.Setting` | Bắt buộc |
| `Jarvis.Modules.Setting.EntityFramework` | Persistence mặc định |
| `Jarvis.Modules.Setting.API` | `UseHttpApi()` |

## Templates

- [templates/program-setup.cs](templates/program-setup.cs)
- [templates/setting-provider.cs](templates/setting-provider.cs)

## Output bắt buộc

- Fluent `AddCoreSetting` trên Host
- Ít nhất một `AddProvider<T>`
- `Cache:Items:Setting` + `Encryption` nếu có secret
- `dotnet build`
