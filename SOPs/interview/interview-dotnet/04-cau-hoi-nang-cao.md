# Bộ câu hỏi C# — Nâng cao

> 9 câu: DI, EF Core, ASP.NET Core, cache/DB thực chiến, performance, query, message broker, file.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 10 | [Dependency Injection (DI) là gì?](#câu-10-dependency-injection-di-là-gì) | 10 | 22 |
| 11 | [Entity Framework Core: DbContext, migrations, tracking, N+1](#câu-11-entity-framework-core-dbcontext-migrations-tracking-n1) | 10 | 22 |
| 12 | [ASP.NET Core: middleware, pipeline, filters](#câu-12-aspnet-core-middleware-pipeline-filters) | 10 | 22 |
| 13 | [Caching thực chiến: Redis, `IMemoryCache`, distributed cache](#câu-13-caching-thực-chiến-redis-imemorycache-distributed-cache) | 10 | 22 |
| 14 | [Transaction database và tối ưu query cơ bản](#câu-14-transaction-database-và-tối-ưu-query-cơ-bản) | 10 | 22 |
| 15 | [Performance .NET và Garbage Collector (GC)](#câu-15-performance-net-và-garbage-collector-gc) | 10 | 22 |
| 16 | [Index và tối ưu query thực chiến](#câu-16-index-và-tối-ưu-query-thực-chiến) | 10 | 22 |
| 17 | [Message broker (RabbitMQ/Kafka): khái niệm và khi nào dùng?](#câu-17-message-broker-rabbitmqkafka-khái-niệm-và-khi-nào-dùng) | 10 | 22 |
| 18 | [Xử lý upload file: validation, streaming, bảo mật](#câu-18-xử-lý-upload-file-validation-streaming-bảo-mật) | 10 | 22 |
| | **Tổng điểm tối đa** | **90** | **198** |
| | **Tổng ngưỡng đạt (gợi ý)** | **81** | **162** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *72* | |

---

### Câu 10 — Dependency Injection (DI) là gì?

#### Mục tiêu đánh giá

- Design pattern và loose coupling
- Testability (mock/stub)
- ASP.NET Core DI container
- Service lifetime và production pitfalls

#### Đáp án kỳ vọng tổng quát

**DI:** cung cấp dependency từ bên ngoài thay vì class tự `new` cứng. **Constructor injection** là chuẩn ưu tiên.

```csharp
public class OrderService
{
    private readonly IOrderRepository _repo;
    public OrderService(IOrderRepository repo) => _repo = repo;
}

// Startup
services.AddScoped<IOrderRepository, OrderRepository>();
services.AddScoped<OrderService>();
```

**Lifetime ASP.NET Core:** `Singleton` (một instance app), `Scoped` (một request), `Transient` (mỗi lần resolve). **Anti-pattern:** Service Locator, `new` service trong domain.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Hiểu loose coupling | +1 |
| Biết test/mock dễ hơn | +1 |
| Phân biệt Singleton/Scoped/Transient | +1 |
| Biết Scoped trong web request | +1 |
| Biết circular dependency là vấn đề | +1 |
| Hiểu lifetime impact | +1 |
| Biết anti-pattern Service Locator | +1 |
| `IOptions<T>` configuration injection | +1 |
| Factory / `IServiceProvider` có kiểm soát | +1 |
| Đưa ví dụ module registration | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết Scoped | Chưa backend thực chiến |
| Singleton inject Scoped | Bug subtle |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Phân tích memory leak do singleton state | +1 |
| Composition root / assembly scanning | +1 |
| Modular monolith DI boundaries | +1 |
| `IHostedService` lifetime | +1 |
| Keyed services (.NET 8+) | +1 |
| Decorator pattern với DI | +1 |
| Tránh over abstraction | +1 |
| Team convention document | +1 |
| Refactor God service case | +1 |
| Test container integration | +1 |
| Trade-off third-party container (Autofac) | +1 |
| Impact startup time many registrations | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Singleton inject DbContext — sao sai?** → not thread-safe, stale state
2. **Circular dependency A→B→A — fix?** → refactor, lazy, events
3. **Khi nào không cần interface cho DI?** → pragmatic YAGNI

---

### Câu 11 — Entity Framework Core: DbContext, migrations, tracking, N+1

#### Mục tiêu đánh giá

- Thực chiến EF Core
- Schema evolution an toàn
- Performance ORM
- Debug production data access

#### Đáp án kỳ vọng tổng quát

**DbContext:** unit of work + session; quản lý `DbSet`, change tracker, transaction. **Scope:** thường Scoped per HTTP request.

**Migrations:** version schema (`Add-Migration`, `dotnet ef database update`); review SQL trước production.

**Change tracking:** `AsNoTracking()` cho read-only; tracked entity sửa property → `SaveChanges` generate UPDATE.

**N+1:** 1 query load parent + N query load children. Fix: `.Include()`, projection `Select`, split query, explicit loading có kiểm soát.

```csharp
// N+1 risk
var orders = await _db.Orders.ToListAsync();
foreach (var o in orders) { var lines = o.Lines; } // lazy if enabled

// Better
var orders = await _db.Orders.Include(o => o.Lines).ToListAsync();
```

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Giải thích N+1 và cách fix | +1 |
| `AsNoTracking` khi nào | +1 |
| Fluent API vs attribute config | +1 |
| Eager vs explicit loading | +1 |
| Transaction `BeginTransaction` | +1 |
| Concurrency token | +1 |
| Raw SQL / `ExecuteSql` | +1 |
| Interceptor/logging SQL | +1 |
| Split query `AsSplitQuery` | +1 |
| Seed data migration | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Lazy loading bật global không kiểm soát | N+1 trap |
| Không review migration SQL prod | Incident risk |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Compiled queries | +1 |
| Global query filter multi-tenant | +1 |
| Owned types / value objects | +1 |
| Resiliency execution strategy | +1 |
| Migration zero-downtime expand-contract | +1 |
| DbContext pooling | +1 |
| Hybrid Dapper + EF | +1 |
| Test: InMemory vs Testcontainers trade-off | +1 |
| Bulk insert third-party | +1 |
| Observability slow query | +1 |
| Team EF guideline | +1 |
| Refactor legacy EF6 → EF Core | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Detached entity update — pattern?** → attach, `Update`, or DTO
2. **`Include` quá nhiều — cartesian explosion?** → split query, projection
3. **Migration conflict trên branch — xử lý?** → merge, idempotent script

---

### Câu 12 — ASP.NET Core: middleware, pipeline, filters

#### Mục tiêu đánh giá

- Hiểu request pipeline
- Cross-cutting concerns (auth, logging, exception)
- Filter vs middleware placement
- Kinh nghiệm API production

#### Đáp án kỳ vọng tổng quát

**Pipeline:** chuỗi middleware xử lý `HttpContext` theo thứ tự đăng ký — request đi vào, response đi ngược (onion).

```csharp
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

**Middleware:** mọi request (logging, correlation id, rate limit). **Filters:** gắn MVC/API layer (action, exception, authorization attribute).

| Thành phần | Vị trí |
|------------|--------|
| Middleware | Sớm, global HTTP |
| Authorization filter | Trước action |
| Action filter | Quanh action method |
| Exception filter | Bắt exception action |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Vẽ/diễn tả pipeline order | +1 |
| Custom middleware `RequestDelegate` | +1 |
| Action/exception/result filters | +1 |
| Model validation filter | +1 |
| CORS middleware placement | +1 |
| Endpoint routing vs conventional | +1 |
| ProblemDetails RFC 7807 | +1 |
| Request logging + correlation id | +1 |
| Minimal API vs Controller trade-off | +1 |
| Đưa ví dụ production pipeline | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Logic business trong middleware dày | SRP violation |
| Double exception handling | Swallow bug |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Branching pipeline `MapWhen` | +1 |
| Forwarded headers behind reverse proxy | +1 |
| Rate limiting middleware (.NET 7+) | +1 |
| Health checks `/health` | +1 |
| Security headers middleware | +1 |
| Observability OpenTelemetry | +1 |
| Test `WebApplicationFactory` | +1 |
| Performance middleware overhead | +1 |
| Multi-tenant resolution middleware | +1 |
| Team template `Program.cs` | +1 |
| YARP / gateway concept | +1 |
| Graceful shutdown | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Exception xảy ra trong middleware — ai bắt?** → outer exception handler
2. **Filter có chạy với Minimal API không?** → endpoint filters
3. **Đặt JWT validation ở đâu?** → authentication handler vs middleware

---

### Câu 13 — Caching thực chiến: Redis, `IMemoryCache`, distributed cache

#### Mục tiêu đánh giá

- Triển khai cache production
- Chọn loại cache phù hợp
- Invalidation và consistency
- Observability

#### Đáp án kỳ vọng tổng quát

| Loại | Phạm vi | Khi dùng |
|------|---------|----------|
| `IMemoryCache` | Trong process | Single instance, config, reference data nhỏ |
| Distributed (Redis) | Multi instance | Scale horizontal, shared session/cache |
| CDN | Edge | Static asset, public API response |

```csharp
// IMemoryCache
_cache.Set("categories", data, TimeSpan.FromMinutes(10));

// IDistributedCache (Redis)
await _distributed.SetStringAsync(key, json, new DistributedCacheEntryOptions {
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
});
```

**Redis thêm:** pub/sub invalidation, distributed lock (cẩn thận), data structure (hash, set). **Không:** dùng Redis làm source of truth chính cho transactional data.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Cache-aside implement đúng | +1 |
| Stampede mitigation | +1 |
| Versioned cache key | +1 |
| `IDistributedCache` vs direct StackExchange.Redis | +1 |
| Session state Redis | +1 |
| Cache tag invalidation pattern | +1 |
| Monitor hit/miss | +1 |
| JSON serializer choice impact | +1 |
| Local L1 + Redis L2 | +1 |
| Failure Redis fallback behavior | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không handle Redis down | Outage cascade |
| Lock Redis không có expiry | Deadlock |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Redis cluster/sentinel HA | +1 |
| Eviction `allkeys-lru` tuning | +1 |
| Cache consistency event bus | +1 |
| Rate limit sliding window Redis | +1 |
| Security TLS, ACL Redis | +1 |
| Hot key sharding | +1 |
| Load test cache layer | +1 |
| Financial data policy | +1 |
| Multi-region cache invalidation | +1 |
| Team playbook cache incident | +1 |
| Compare Memcached vs Redis | +1 |
| Cost/ops trade-off | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **`IMemoryCache` trên 3 pod — vấn đề gì?** → inconsistent → Redis
2. **Cache user permission — invalidate khi đổi role?** → event, TTL, version
3. **Redis làm message queue luôn — ổn không?** → separation of concerns

---

### Câu 14 — Transaction database và tối ưu query cơ bản

#### Mục tiêu đánh giá

- ACID và transaction scope
- Tránh partial update
- Query plan cơ bản
- EF transaction integration

#### Đáp án kỳ vọng tổng quát

**Transaction:** nhóm thao tác **all-or-nothing** (ACID). **Isolation levels** (concept): Read Uncommitted → Serializable; trade-off dirty read vs concurrency.

```csharp
await using var tx = await _db.Database.BeginTransactionAsync();
try {
    // multiple operations
    await _db.SaveChangesAsync();
    await tx.CommitAsync();
} catch { await tx.RollbackAsync(); throw; }
```

**Tối ưu cơ bản:** filter sớm, select đúng cột, index FK/WHERE, tránh `SELECT *`, pagination, tránh function trên indexed column (`WHERE YEAR(date)`).

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Isolation level ảnh hưởng | +1 |
| Deadlock detection/retry | +1 |
| Idempotency trong retry | +1 |
| Projection thay load full entity | +1 |
| Batch insert/update | +1 |
| Read execution plan | +1 |
| Timeout command | +1 |
| Unit of work pattern | +1 |
| Outbox pattern (concept) | +1 |
| Đưa ví dụ fix slow report | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Transaction dài giữ lock | Throughput kill |
| Retry không idempotent payment | Double charge |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Distributed transaction saga (concept) | +1 |
| 2PC limitations | +1 |
| Read committed vs snapshot isolation thực tế | +1 |
| Optimistic concurrency business rule | +1 |
| Connection pooling tuning | +1 |
| Read replica routing | +1 |
| Long-running transaction anti-pattern | +1 |
| Database lock monitoring | +1 |
| Zero-downtime data fix | +1 |
| Payment idempotency key design | +1 |
| Team SQL review checklist | +1 |
| Incident postmortem deadlock | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **EF `SaveChanges` + raw SQL cùng transaction?** → same connection
2. **Nested transaction — có thật không?** → savepoints
3. **Cross-service transfer money — 2PC hay saga?** → distributed design

---

### Câu 15 — Performance .NET và Garbage Collector (GC)

#### Mục tiêu đánh giá

- Hiểu managed memory
- Giảm allocation hot path
- Profiling mindset
- Production troubleshooting

#### Đáp án kỳ vọng tổng quát

**GC** thu hồi object không còn reachable. **Generational:** Gen0 (ngắn hạn) → Gen1 → Gen2 (lâu dài); promote khi survive collection.

**Tối ưu:** giảm allocation trong hot path, dùng `IDisposable` cho unmanaged (file, socket), tránh boxing, `StringBuilder` cho concat loop, `ArrayPool`, async I/O thay block thread.

**Đo lường:** dotnet-counters, dotMemory, PerfView, Application Insights — **đo trước khi tối ưu**.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Gen0/1/2 conceptual | +1 |
| LOH large object | +1 |
| Finalizer vs dispose pattern | +1 |
| Boxing/unboxing tránh | +1 |
| `Span<T>`, `stackalloc` awareness | +1 |
| Thread pool starvation link | +1 |
| Profiler đọc allocation | +1 |
| `IAsyncEnumerable` streaming | +1 |
| HttpClient reuse (`IHttpClientFactory`) | +1 |
| BenchmarkDotNet mindset | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| `new HttpClient()` mỗi request | Socket exhaustion |
| Micro-optimize không đo | Waste time |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| GC mode Server vs Workstation | +1 |
| POH pinned object impact | +1 |
| Datadog/AI GC pause alert | +1 |
| Memory leak managed (event handler) | +1 |
| Native AOT / trimming awareness | +1 |
| Container memory limit OOMKilled | +1 |
| Gen2 frequent — diagnose | +1 |
| Performance budget per endpoint | +1 |
| Load test + profile correlation | +1 |
| Team perf guideline | +1 |
| Trade-off immutability allocation | +1 |
| Incident GC pause case study | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Event handler không unsubscribe — leak?** → yes, rooted delegate
2. **`ConfigureAwait(false)` giảm GC không?** → context, not GC directly
3. **Container 512MB — GC tuning?** → memory pressure, DATAS

---

### Câu 16 — Index và tối ưu query thực chiến

#### Mục tiêu đánh giá

- Đọc execution plan
- Thiết kế index có căn cứ
- Fix slow query production
- Phối hợp EF + SQL

#### Đáp án kỳ vọng tổng quát

**Quy trình:** xác định slow query (log, APM) → EXPLAIN/actual plan → kiểm tra seek vs scan → index/filter/order phù hợp → đo lại.

**EF tips:** projection `Select`, filter trước `ToList`, `AsNoTracking`, tránh client eval, compiled query, đúng `Include`.

```sql
-- Before: scan
SELECT * FROM Orders WHERE Status = 1 ORDER BY CreatedAt DESC;

-- Index support filter + sort
CREATE INDEX IX_Orders_Status_CreatedAt ON Orders(Status, CreatedAt DESC);
```

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Đọc execution plan operators | +1 |
| Key lookup, bookmark lookup | +1 |
| Covering index | +1 |
| Parameter sniffing (concept) | +1 |
| Update statistics | +1 |
| OR vs UNION rewrite | +1 |
| EF tag `TagWith` debug | +1 |
| Split heavy report to read replica | +1 |
| Hint chỉ khi có data | +1 |
| Regression test query perf | +1 |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Index advisor automation | +1 |
| Partition elimination | +1 |
| Columnstore for analytics | +1 |
| Query store baseline | +1 |
| Kill switch feature flag slow query | +1 |
| Archival cold data | +1 |
| Cross-db query anti-pattern | +1 |
| Team SQL guild review | +1 |
| SLA p95 latency budget | +1 |
| Blameless postmortem missing index | +1 |
| Trade-off ORM vs stored proc report | +1 |
| Capacity forecast index size | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Index mới nhưng plan vẫn scan — vì sao?** → stats, implicit cast, function
2. **Offset pagination deep page chậm — alternative?** → keyset pagination
3. **EF `Count()` trên bảng 100M row?** → approximate, cache, summary table

---

### Câu 17 — Message broker (RabbitMQ/Kafka): khái niệm và khi nào dùng?

#### Mục tiêu đánh giá

- Async integration giữa service
- Decoupling và scale
- Delivery semantics
- Chọn công cụ phù hợp

#### Đáp án kỳ vọng tổng quát

**Message broker:** hàng đợi trung gian — producer gửi message, consumer xử lý bất đồng bộ.

| | RabbitMQ (queue-oriented) | Kafka (log-oriented) |
|---|---------------------------|---------------------|
| Mô hình | Queue, exchange routing | Topic partition log |
| Throughput | Tốt | Rất cao, replay |
| Replay | Hạn chế (TTL) | Consumer offset rewind |
| Use case | Task queue, RPC async | Event stream, analytics |

**Khi dùng:** tách service, peak shaving, background job, event notification. **Không dùng khi:** cần strong sync consistency đơn giản — có thể overkill.

**Concepts:** at-least-once, at-most-once, exactly-once (khó), idempotent consumer, dead-letter queue.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Exchange types Rabbit (direct, topic) | +1 |
| Kafka partition ordering | +1 |
| Idempotent consumer | +1 |
| Dead-letter queue | +1 |
| Outbox pattern với broker | +1 |
| MassTransit / Rebus / Raw client | +1 |
| Poison message handling | +1 |
| Schema versioning event | +1 |
| Monitoring queue depth | +1 |
| Chọn Rabbit vs Kafka có lý do | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không handle duplicate message | Data corrupt |
| Message quá lớn (full blob) | Broker choke |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Event-driven architecture boundaries | +1 |
| Saga choreography vs orchestration | +1 |
| Kafka exactly-once semantics trade-off | +1 |
| Ordering global vs per-partition | +1 |
| Multi-tenant topic design | +1 |
| Schema registry (Avro/Protobuf) | +1 |
| Backpressure consumer lag alert | +1 |
| Disaster replay strategy | +1 |
| Compliance audit event log | +1 |
| Cost ops Kafka cluster | +1 |
| Team event contract governance | +1 |
| Migration sync → async case | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Consumer crash sau xử lý nhưng trước ack — sao?** → at-least-once duplicate
2. **Order event phải đúng thứ tự — thiết kế?** → partition key
3. **RabbitMQ vs Azure Service Bus — chọn nào?** → cloud, ops, feature

---

### Câu 18 — Xử lý upload file: validation, streaming, bảo mật

#### Mục tiêu đánh giá

- API design file upload
- Security (type, size, path traversal)
- Performance streaming
- Storage pattern cloud

#### Đáp án kỳ vọng tổng quát

**Validation:** max size, whitelist extension/MIME (magic byte), scan virus (enterprise), rename file (UUID), không tin client filename.

**Streaming:** `IFormFile` / multipart; stream to disk/blob — **không** load hết RAM. **Chunked upload** cho file lớn.

**Security:** auth upload, private bucket, signed URL download, không serve upload folder trực tiếp, CSP cho web.

```csharp
[RequestSizeLimit(10 * 1024 * 1024)]
public async Task<IActionResult> Upload(IFormFile file, CancellationToken ct)
{
    if (file.Length == 0) return BadRequest();
    await using var stream = file.OpenReadStream();
    var key = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    await _storage.UploadAsync(key, stream, ct);
    return Ok(new { key });
}
```

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Stream to Azure Blob/S3 | +1 |
| Magic byte validation | +1 |
| Virus scan hook | +1 |
| Presigned URL pattern | +1 |
| Metadata DB + blob storage | +1 |
| Resume/chunk upload | +1 |
| Rate limit upload | +1 |
| Content-Disposition download | +1 |
| Image resize pipeline | +1 |
| Error handling partial upload | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Public bucket mọi file | Data leak |
| Base64 file lớn trong JSON body | Memory blow |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Direct-to-cloud upload bypass API | +1 |
| Malware zero-day policy | +1 |
| WAF + CDN integration | +1 |
| Encryption at rest KMS | +1 |
| GDPR delete file cascade | +1 |
| Antivirus async queue | +1 |
| Multi-tenant isolation prefix | +1 |
| SLA large file 5GB design | +1 |
| Cost lifecycle tier storage | +1 |
| Pen test finding remediation | +1 |
| Team upload standard | +1 |
| Incident leaked bucket postmortem | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Client gửi `Content-Type: image/png` nhưng file exe — phòng?** → magic byte
2. **Upload 5GB qua API server — thiết kế?** → presigned multipart
3. **Xóa user — file blob xử lý?** → lifecycle, async purge

---

