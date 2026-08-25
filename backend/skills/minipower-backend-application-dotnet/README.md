# minipower-backend-application-dotnet

Skill tích hợp **Jarvis.DDD.Application** — CQRS dispatcher (`ICommand` / `IQuery`).

Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Layer Application chưa có Jarvis CQRS | [workflows/init.md](./workflows/init.md) |
| Thêm command/query handler | [workflows/add.md](./workflows/add.md) |

## Cách gọi

```text
@.opencode/skills/minipower-backend-application-dotnet/workflows/init.md

Init Jarvis.DDD.Application cho MyApp.Application — AddCoreApplication + mẫu handler.
```

## Extension

| Extension | Mục đích |
|-----------|----------|
| `AddCoreApplication` | `AddCommandQuery()` — dispatcher |
| `AddCommandQuery` | Chỉ dispatcher (nếu không cần wrapper khác) |

Handler: `ICommandHandler<TCommand>`, `IQueryHandler<TQuery, TResult>` — đăng ký `AddScoped` trong Application hoặc Host module.

Mẫu: [templates/application-extension.cs](./templates/application-extension.cs).

## Liên quan

- [minipower-backend-scaffold-dotnet](../minipower-backend-scaffold-dotnet/README.md) — scaffold Application project
- [minipower-backend-entityframework-dotnet](../minipower-backend-entityframework-dotnet/README.md) — handler dùng UoW/repository
