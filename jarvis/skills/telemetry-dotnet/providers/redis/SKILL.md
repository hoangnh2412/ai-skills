---
name: telemetry-dotnet-redis
description: Bật Redis trace qua Jarvis.Caching.Redis (AddJarvisCachingDistributedRedisInstrumentation). IConnectionMultiplexer / cache Redis phải đăng ký trước.
dependencies:
  - Jarvis.Caching.Redis
  - StackExchange.Redis
---

# Redis trace

Instrumentation nằm trong **`Jarvis.Caching.Redis`** — không có package OTEL Redis riêng.

```csharp
using Jarvis.Caching.Redis.Extensions;
using OpenTelemetry.Trace;

builder.AddJarvisCaching()
    .UseRedisDistributedCache()
    .UseRedisMemoryCacheInvalidation();

builder.Services
    .AddJarvisOpenTelemetry(builder.Configuration, _ => { })
    .ConfigureResource()
    .ConfigureTrace(options =>
    {
        options
            .AddJarvisCachingDistributedRedisInstrumentation(builder.Configuration)
            .AddJarvisCachingMemoryInvalidationRedisInstrumentation();
    });
```

`IConnectionMultiplexer` keyed (nếu demo/host tự đăng ký) phải có trước khi build host.

Memory invalidation dùng key riêng (`MemoryCacheInvalidationDefaults.ConnectionServiceKey`) — không trùng `DistributedGroups`.
