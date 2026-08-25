---
name: minipower-backend-application-dotnet
description: Thiết lập Jarvis.DDD.Application — CQRS dispatcher ICommand/IQuery, handler DI. Dùng khi project Application layer dùng pattern command/query với Jarvis.
metadata:
  audience: hoangnh
  workflow: github
---

# Jarvis.DDD.Application — Orchestrator

Skill điều phối `Jarvis.DDD.Application` + `Jarvis.DDD.Application.Contracts` trên layer Application.

Hướng dẫn: [README.md](README.md).

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Project chưa có dispatcher CQRS | [workflows/init.md](workflows/init.md) |
| Thêm handler / đổi đăng ký dispatcher | [workflows/add.md](workflows/add.md) |

## Quy tắc cốt lõi

- `AddCoreApplication()` gọi `AddCommandQuery()` — đăng ký `ICommandDispatcher`, `IQueryDispatcher` (+ async).
- Handler implement `ICommandHandler<>`, `IQueryHandler<>`, … — **app** đăng ký `AddScoped` từng handler.
- Phụ thuộc `Jarvis.DDD.Domain` — Application layer reference Domain, không reference Host trực tiếp.
- Controller gọi dispatcher, không inject DbContext trực tiếp (theo convention Jarvis).

## Packages

| PackageId | Layer |
|---|---|
| `Jarvis.DDD.Application.Contracts` | Application |
| `Jarvis.DDD.Application` | Application |

## Templates

- [templates/application-extension.cs](templates/application-extension.cs)
- [templates/command-handler.cs](templates/command-handler.cs)

## Liên quan

- Scaffold: [minipower-backend-scaffold-dotnet](../minipower-backend-scaffold-dotnet/README.md)
- Foundation (Host gọi Application extension): [minipower-backend-foundation-dotnet](../minipower-backend-foundation-dotnet/README.md)

## Output bắt buộc

- `AddCoreApplication()` trong Application layer extension
- Handler đăng ký DI
- `dotnet build`; ít nhất một command/query end-to-end
