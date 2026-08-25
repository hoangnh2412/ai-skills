# minipower-backend-caching-dotnet

Skill tích hợp **Jarvis.Caching** — memory + Redis, invalidation, cache-aside. Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Chưa có cache Jarvis | [workflows/init.md](./workflows/init.md) |
| Bật Redis / invalidation / OTEL | [workflows/add.md](./workflows/add.md) + [providers/](./providers/) |

Scaffold `minipower-backend-scaffold-dotnet` đã gọi `AddJarvisCaching()` trong Infrastructure — dùng skill này khi bật **Redis** hoặc project chưa có Jarvis.

## Cách gọi

```text
@.opencode/skills/minipower-backend-caching-dotnet/workflows/init.md

Init Jarvis Caching memory-only cho MyApp.Infrastructure.
```

```text
@.opencode/skills/minipower-backend-caching-dotnet/workflows/add.md

Bật Redis distributed + memory invalidation cho MyApp.Host.
```

## Quy tắc

- `MemSeconds > 0` — memory; `DistributedSeconds > 0` — Redis
- `GetOrSetAsync` cho cache-aside; `RemoveAsync` sau write
- `AddJarvisCaching()` **trước** `AddEntityFramework()`

## Providers

| Provider | SKILL |
|----------|-------|
| Redis distributed | [providers/redis-distributed/SKILL.md](./providers/redis-distributed/SKILL.md) |
| Memory invalidation | [providers/redis-invalidation/SKILL.md](./providers/redis-invalidation/SKILL.md) |
| OTEL Redis | [providers/otel-redis/SKILL.md](./providers/otel-redis/SKILL.md) |

## Liên quan

- [minipower-backend-entityframework-dotnet/README.md](../minipower-backend-entityframework-dotnet/README.md) — cache connection string resolver
- [minipower-backend-telemetry-dotnet/README.md](../minipower-backend-telemetry-dotnet/README.md) — OTEL Redis instrumentation
- [minipower-backend-scaffold-dotnet/README.md](../minipower-backend-scaffold-dotnet/README.md) — scaffold
