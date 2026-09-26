---
name: csharp-source-code-reading
description: Phương pháp luận đọc và reverse-engineer C#/.NET source code theo business flow, architecture, dependency, data flow và runtime behavior.
---

# C# Source Code Reading Skill

## 1. Mục tiêu

Skill này cung cấp phương pháp luận để đọc và reverse-engineer một C#/.NET codebase, đặc biệt phù hợp với hệ thống enterprise hoặc codebase lớn.

Mục tiêu không phải là đọc toàn bộ source code theo thứ tự file, mà là xây dựng mô hình hiểu hệ thống theo chuỗi:

```text
Context
  ↓
Architecture
  ↓
Module
  ↓
Execution Flow
  ↓
Implementation
  ↓
Runtime / Data / Side Effects
  ↓
Knowledge Model
```

Nguyên tắc cốt lõi:

> Không đọc code theo file. Hãy đọc behavior theo flow.

---

## 2. Nguyên tắc chung

### 2.1. Xác định scope trước khi đọc

Trước khi mở source, xác định câu hỏi cần trả lời:

- Hệ thống này làm gì?
- Một business flow cụ thể chạy như thế nào?
- Tính năng nằm ở đâu?
- Dependency của module là gì?
- Data đi qua những đâu?
- External system nào được gọi?
- Transaction boundary nằm ở đâu?
- Error và retry được xử lý như thế nào?

Không cố gắng hiểu toàn bộ repository nếu câu hỏi chỉ liên quan đến một flow hoặc module.

### 2.2. Phân biệt fact và inference

Trong quá trình reverse-engineering, phân loại thông tin thành:

**Observed** — thông tin trực tiếp quan sát được từ source.

**Documented** — thông tin được mô tả trong README, architecture document, comment, configuration hoặc deployment manifest.

**Inferred** — kết luận được suy ra từ nhiều bằng chứng. Gắn nhãn `[Suy luận]`.

**Unknown** — chưa đủ bằng chứng để kết luận. Gắn nhãn `[Chưa xác minh]`.

Không chuyển `Inferred` hoặc `Unknown` thành fact.

---

## 3. Mô hình đọc source 6 tầng

```text
L0 Context
    ↓
L1 Architecture
    ↓
L2 Module
    ↓
L3 Execution Flow
    ↓
L4 Implementation
    ↓
L5 Runtime / Data / Side Effects
```

### L0 — Context

Trả lời:

```text
System làm gì?
Ai sử dụng?
Input là gì?
Output là gì?
Business capability nào?
External systems nào?
```

Kết quả:

```text
System Context
├── Users / Clients
├── Business Capabilities
├── APIs
├── Databases
├── Message Brokers
├── External Services
└── Infrastructure
```

---

## 4. L1 — Architecture

Khảo sát repository trước khi đọc implementation.

Với C#/.NET, ưu tiên nhận diện:

```text
*.sln
*.slnx
*.csproj
Directory.Build.props
Directory.Build.targets
Directory.Packages.props
global.json
NuGet.config
src/
tests/
```

Nếu dùng ASP.NET Core, tìm:

```text
Program.cs
Startup.cs
WebApplication
IServiceCollection
IApplicationBuilder
IHostBuilder
```

Tìm entry point:

```text
Controller
Minimal API
MapGet / MapPost / MapPut / MapDelete
IHostedService
BackgroundService
Hangfire Job
MediatR Handler
Message Consumer
gRPC Service
SignalR Hub
```

Xác định:

- API layer
- Application/service layer
- Domain layer
- Persistence layer
- Integration layer
- Messaging
- Background processing
- Configuration
- Authentication/Authorization
- Observability

Kết quả cần đạt: **Architecture Map**.

Ví dụ:

```text
Client
  ↓
ASP.NET Core Middleware
  ↓
Controller / Minimal API
  ↓
Application Service / Handler
  ↓
Domain
  ↓
Repository
  ↓
Database

Application Service
  ↓
Message Producer
  ↓
RabbitMQ / Kafka
  ↓
Consumer
  ↓
Another Service
```

---

## 5. L2 — Module

Xác định responsibility của từng project/namespace/module.

Ví dụ:

```text
src/
├── Invoice.Api
├── Invoice.Application
├── Invoice.Domain
├── Invoice.Infrastructure
└── Invoice.Worker
```

Với mỗi module, xác định:

```text
Responsibility
Dependencies
Entry Points
Outputs
External Dependencies
```

Đồng thời đặt câu hỏi:

> Module này không nên chịu trách nhiệm về việc gì?

Điều này giúp phát hiện coupling và boundary.

---

## 6. L3 — Execution Flow

Đây là tầng quan trọng nhất.

Không bắt đầu bằng việc đọc một class lớn từ trên xuống dưới.

Hãy chọn một business flow và trace:

```text
Entry
  ↓
Transformation
  ↓
Decision
  ↓
Business Logic
  ↓
Persistence / Integration
  ↓
Side Effects
  ↓
Output
```

Ví dụ:

```text
POST /api/invoices
    ↓
InvoiceController.CreateAsync()
    ↓
CreateInvoiceHandler.Handle()
    ↓
InvoiceValidator.ValidateAsync()
    ↓
InvoiceFactory.Create()
    ↓
InvoiceRepository.AddAsync()
    ↓
UnitOfWork.SaveChangesAsync()
    ↓
InvoiceEventPublisher.PublishAsync()
    ↓
RabbitMQ
```

---

## 7. Trace theo 5 câu hỏi

### 7.1. Entry

Tìm:

```csharp
[ApiController]
[Route]
[HttpGet]
[HttpPost]
[HttpPut]
[HttpDelete]
```

Minimal API:

```csharp
app.MapGet(...)
app.MapPost(...)
app.MapPut(...)
app.MapDelete(...)
```

Background / messaging:

```text
BackgroundService
IHostedService
IConsumer
IRequestHandler
INotificationHandler
```

Câu hỏi:

```text
Ai gọi?
Input là gì?
Request DTO nào?
Command nào?
Message nào?
```

### 7.2. Transformation

Trace:

```text
HTTP Request
    ↓
Request DTO
    ↓
Command
    ↓
Domain Object
    ↓
Persistence Entity
```

Tìm:

```text
Mapper
AutoMapper
Mapster
Converter
Factory
Adapter
Serializer
Deserializer
```

Không dừng ở mapper; tiếp tục trace tới handler/domain.

### 7.3. Decision

Tìm:

```csharp
if
else
switch
switch expression
?:
```

và:

```text
Validator
Specification
Policy
Authorization
Feature Flag
Configuration
State Machine
Business Rule
```

Với mỗi decision:

```text
Condition
    ↓
Possible Branches
    ↓
Business Meaning
```

### 7.4. Side Effect

Tìm:

```text
Database write
Database transaction
Cache update
Message publish
Message consume
HTTP call
gRPC call
File write
Object storage
Email
Notification
Event
```

Ví dụ:

```text
CreateInvoice
├── INSERT invoice
├── UPDATE customer
├── Redis SET
├── RabbitMQ Publish
└── HTTP → Tax Service
```

### 7.5. Error / Recovery

Tìm:

```text
try/catch
ExceptionHandler
Middleware
Retry
Timeout
Circuit Breaker
Rollback
Transaction
Dead Letter Queue
Compensation
Idempotency
Fallback
```

Kiểm tra cả failure flow, ví dụ:

```text
DB success
    ↓
Message publish failed
```

hoặc:

```text
External API timeout
    ↓
Retry
    ↓
Retry failed
```

Chỉ kết luận behavior từ source/configuration thực tế.

---

## 8. L4 — Implementation

Sau khi hiểu flow mới đọc sâu implementation.

Đọc theo semantic blocks:

```csharp
await ValidateRequestAsync();

var customer = await LoadCustomerAsync();

var amount = CalculateAmount();

var invoice = CreateInvoice();

await repository.AddAsync(invoice);

await unitOfWork.SaveChangesAsync();

await eventPublisher.PublishAsync(invoice);
```

Với mỗi block:

```text
What does it do?
Why is it needed?
What data does it consume?
What data does it produce?
Does it have side effects?
Can it fail?
```

Nếu chưa xác định được "Why" từ source, đánh dấu `Unknown`.

---

## 9. L5 — Runtime / Data / Side Effects

Map source với runtime architecture:

```text
ASP.NET Core Application
    ↓
Dependency Injection
    ↓
EF Core / Dapper / ADO.NET
    ↓
PostgreSQL / SQL Server / Oracle
```

hoặc:

```text
Service
├── PostgreSQL
├── Redis
├── RabbitMQ
├── Kafka
├── MinIO / S3
└── External REST API
```

Tìm configuration trong:

```text
appsettings.json
appsettings.{Environment}.json
secrets.json
Environment Variables
IOptions<T>
IOptionsSnapshot<T>
IOptionsMonitor<T>
User Secrets
Azure App Configuration
Key Vault
Docker Compose
Kubernetes
Helm
```

Không giả định configuration chỉ nằm trong source C#.

---

## 10. C#/.NET-specific reading order

Ưu tiên:

```text
1. README / documentation
2. *.sln / *.slnx
3. *.csproj
4. Directory.Build.props / Directory.Packages.props
5. Program.cs / Startup.cs
6. Dependency Injection registrations
7. Middleware / Filters
8. Authentication / Authorization
9. Controllers / Minimal APIs / gRPC
10. Message Consumers / Producers
11. Application Services / MediatR Handlers
12. Domain Services / Entities / Aggregates
13. Repositories
14. EF Core / Dapper / ADO.NET
15. External clients
16. BackgroundService / HostedService / Hangfire
17. Configuration
18. Tests
19. Docker / Kubernetes / deployment
```

---

## 11. Dependency Injection

Ví dụ:

```csharp
public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _repository;

    public InvoiceService(IInvoiceRepository repository)
    {
        _repository = repository;
    }
}
```

Trace:

```text
IInvoiceService
    ↓
InvoiceService
```

và:

```text
IInvoiceRepository
    ↓
Concrete implementation
    ↓
DI registration
```

Tìm:

```csharp
services.AddTransient(...)
services.AddScoped(...)
services.AddSingleton(...)
builder.Services.AddScoped(...)
builder.Services.AddKeyedScoped(...)
```

Đặc biệt chú ý:

```text
Multiple implementations
Keyed Services
Factory registration
Open generic registration
Environment-specific registration
Decorators
```

---

## 12. ASP.NET Core pipeline

Với HTTP request:

```text
HTTP
 ↓
Middleware
 ↓
Authentication
 ↓
Authorization
 ↓
Routing
 ↓
Endpoint
 ↓
Controller / Minimal API
 ↓
Application
 ↓
Response
```

Tìm:

```csharp
app.UseMiddleware<T>()
app.UseAuthentication()
app.UseAuthorization()
app.UseExceptionHandler()
app.UseRouting()
app.MapControllers()
```

Kiểm tra:

```text
Authentication
Authorization
Validation
Exception Handling
Logging
Tracing
Correlation ID
Rate Limiting
CORS
Request/Response transformation
```

Khi flow phụ thuộc vào pipeline, phải ghi nhận thứ tự middleware thực tế.

---

## 13. Controller / Minimal API

Controller:

```csharp
[HttpPost]
public async Task<IActionResult> Create(CreateInvoiceRequest request)
```

Trace:

```text
HTTP
 ↓
Model Binding
 ↓
Validation
 ↓
Controller
 ↓
Application Handler
```

Minimal API:

```csharp
app.MapPost("/invoices", async (
    CreateInvoiceRequest request,
    IInvoiceService service) =>
{
    ...
});
```

Tìm thêm:

```text
IEndpointFilter
ActionFilter
Authorization Filter
Model Validation
ProblemDetails
Exception Handler
```

---

## 14. MediatR / CQRS

Nếu có MediatR:

```text
HTTP
 ↓
Controller
 ↓
IMediator.Send(command)
 ↓
IRequestHandler<TRequest, TResponse>
 ↓
Pipeline Behavior
 ↓
Handler
 ↓
Domain / Repository
```

Tìm:

```text
IRequest
IRequestHandler
INotification
INotificationHandler
IPipelineBehavior
IStreamRequest
```

Đặc biệt kiểm tra:

```text
Validation behavior
Transaction behavior
Logging behavior
Authorization behavior
Caching behavior
Retry behavior
```

Trace registration và generic constraints khi cần xác định behavior thực tế.

---

## 15. Domain / DDD

Nếu codebase sử dụng DDD, tìm:

```text
Entity
Aggregate Root
Value Object
Domain Service
Domain Event
Repository
Specification
Factory
```

Cần xác định:

```text
Who owns the state?
Where can the state change?
Where are invariants enforced?
Who creates the aggregate?
Who persists it?
```

Đặc biệt chú ý mutation:

```csharp
invoice.Issue();
invoice.Cancel();
invoice.AddLine(...);
```

thay vì chỉ nhìn property setters.

---

## 16. EF Core

Flow:

```text
Application
 ↓
Repository / DbContext
 ↓
LINQ
 ↓
EF Core
 ↓
SQL
 ↓
Database
```

Tìm:

```csharp
DbContext
DbSet<T>
OnModelCreating
IEntityTypeConfiguration<T>
HasKey
HasOne
HasMany
OwnsOne
HasIndex
HasQueryFilter
```

Trace:

```text
Entity
 ↓
Entity Configuration
 ↓
Table
 ↓
Column
 ↓
Relationship
 ↓
Query
 ↓
Transaction
```

Đặc biệt kiểm tra:

```text
AsNoTracking
Include
ThenInclude
Lazy Loading
Explicit Loading
Global Query Filter
Concurrency Token
RowVersion
Owned Entity
Value Converter
Interceptors
```

Không suy luận database behavior chỉ từ entity class nếu mapping nằm ở Fluent API hoặc configuration khác.

---

## 17. Dapper / ADO.NET / Raw SQL

Dapper:

```text
Repository
 ↓
Connection
 ↓
SQL
 ↓
Dapper
 ↓
Database
```

Tìm:

```text
Query
QueryAsync
Execute
ExecuteAsync
QuerySingle
QueryFirst
DynamicParameters
```

ADO.NET:

```text
DbConnection
DbCommand
DbParameter
ExecuteReader
ExecuteNonQuery
```

Cần xác định:

```text
SQL
Parameters
Transaction
Connection lifetime
Mapping
Stored Procedure
```

---

## 18. Transaction

Tìm:

```text
TransactionScope
BeginTransactionAsync()
Database.BeginTransactionAsync()
Unit of Work
Transactional middleware / behavior
```

Trace:

```text
Transaction Begin
    ↓
Operation A
    ↓
Operation B
    ↓
Message / External call
    ↓
Commit / Rollback
```

Kiểm tra:

```text
Transaction boundary
Isolation
Nested transaction
Retry
Rollback behavior
Outbox
Unit of Work
```

Không mặc định rằng nhiều DB operations trong cùng method thuộc cùng transaction.

---

## 19. Messaging

### RabbitMQ

```text
Producer
    ↓
Exchange
    ↓
Binding
    ↓
Queue
    ↓
Consumer
    ↓
Handler
```

Kiểm tra:

```text
Exchange
Queue
Routing Key
Consumer
Retry
Dead Letter
Prefetch
Acknowledgement
Concurrency
Idempotency
```

### Kafka

```text
Producer
    ↓
Topic
    ↓
Partition
    ↓
Consumer Group
    ↓
Consumer
    ↓
Handler
```

Kiểm tra:

```text
Topic
Key
Partition
Consumer Group
Offset
Commit
Retry
DLQ
Concurrency
Idempotency
```

### Azure Service Bus

```text
Producer
    ↓
Queue / Topic
    ↓
Subscription
    ↓
Consumer
```

Kiểm tra:

```text
Lock
Settlement
Complete
Abandon
Dead Letter
Retry
Prefetch
Concurrency
```

---

## 20. Background processing

Tìm:

```text
BackgroundService
IHostedService
PeriodicTimer
System.Threading.Timer
Task
Channel<T>
Hangfire
Quartz.NET
MassTransit
```

Flow:

```text
Trigger
    ↓
Scheduler / Worker
    ↓
Execution
    ↓
Task / Worker
    ↓
Transaction
    ↓
Side Effect
```

Kiểm tra:

```text
Concurrency
CancellationToken
Shutdown behavior
Retry
Distributed execution
Lock
Idempotency
```

---

## 21. Async / await và concurrency

Không coi `async/await` là bằng chứng của parallel execution.

Kiểm tra:

```text
Task
ValueTask
CancellationToken
Task.WhenAll
Parallel
Channel<T>
SemaphoreSlim
lock
Monitor
ConcurrentDictionary
IAsyncEnumerable
```

Đặt câu hỏi:

```text
Operation chạy sequential hay parallel?
Có shared mutable state không?
Có cancellation không?
Có concurrency limit không?
Có race condition không?
Có deadlock risk không?
```

---

## 22. Authentication / Authorization

Trace:

```text
Request
 ↓
Authentication
 ↓
Claims
 ↓
Authorization
 ↓
Policy / Requirement
 ↓
Business operation
 ↓
Data access
```

Tìm:

```csharp
AddAuthentication()
AddAuthorization()
AddPolicy()
[Authorize]
[AllowAnonymous]
RequireAuthorization()
IAuthorizationHandler
IAuthorizationRequirement
ClaimsPrincipal
```

Nếu có JWT/OIDC:

```text
Token
 ↓
Authentication Handler
 ↓
Claims
 ↓
Policy
```

Cần trả lời:

```text
Who can call?
How is identity established?
How are permissions checked?
Is authorization at endpoint or business layer?
Is tenant isolation implemented?
```

---

## 23. Error handling

Map:

```text
Exception source
    ↓
Propagation
    ↓
Middleware / Handler
    ↓
Response / Retry / Rollback
```

Tìm:

```text
IExceptionHandler
ProblemDetails
UseExceptionHandler
try/catch
Custom Exception
```

Nếu source đủ evidence, phân biệt:

```text
Business Exception
Validation Exception
Technical Exception
Integration Exception
Infrastructure Exception
```

---

## 24. Observability

Tìm:

```text
ILogger
ILogger<T>
Serilog
NLog
OpenTelemetry
Activity
ActivitySource
Meter
IMeterFactory
Prometheus
Health Checks
```

Trace:

```text
Request
 ↓
Trace
 ↓
Span
 ↓
Service
 ↓
DB / HTTP / Message
```

Kiểm tra:

```text
Trace ID
Span ID
Correlation ID
Structured logging
Metrics
Health checks
```

Nếu dùng OpenTelemetry, xác định:

```text
Instrumentation
Exporter
Resource
ActivitySource
Meter
Sampling
```

---

## 25. External clients

Tìm:

```text
HttpClient
IHttpClientFactory
Typed Client
Refit
GrpcChannel
gRPC Client
Azure SDK
AWS SDK
```

Trace:

```text
Application
 ↓
Client abstraction
 ↓
Concrete client
 ↓
HTTP / gRPC
 ↓
External system
```

Kiểm tra:

```text
Timeout
Retry
Circuit Breaker
Authentication
Headers
Serialization
Error mapping
Idempotency
```

---

## 26. Configuration

Tìm:

```csharp
IConfiguration
IOptions<T>
IOptionsSnapshot<T>
IOptionsMonitor<T>
```

Trace:

```text
appsettings.json
    ↓
Environment-specific config
    ↓
Environment variables / secrets
    ↓
Options binding
    ↓
Service
```

Đặc biệt kiểm tra:

```text
Connection strings
URLs
Feature flags
Timeouts
Retry settings
Queue/topic names
Cache settings
Security settings
```

Không ghi secret values vào documentation.

---

## 27. Tests

Ưu tiên:

```text
Unit Test
Integration Test
Repository Test
Controller Test
Contract Test
End-to-End Test
```

Từ test xác định:

```text
Input
Expected output
Business rule
Edge cases
Exception behavior
Integration contract
```

Tìm:

```text
Fact
Theory
TestFixture
WebApplicationFactory
TestServer
Moq
NSubstitute
FakeItEasy
FluentAssertions
Testcontainers
WireMock
```

Không mặc định test bao phủ toàn bộ production code.

---

## 28. Business Flow Map

Mỗi business flow nên là một artifact riêng:

```text
flows/
├── create-invoice.md
├── issue-invoice.md
├── cancel-invoice.md
├── sign-invoice.md
└── sync-tax-result.md
```

Template:

```markdown
# <Business Flow>

## 1. Entry Point

## 2. Trigger

## 3. Input

## 4. Execution Flow

## 5. Business Rules

## 6. Data Read

## 7. Data Write

## 8. External Integrations

## 9. Messaging

## 10. Transaction Boundary

## 11. Error Handling

## 12. Retry / Recovery

## 13. Security

## 14. Observability

## 15. Source References

## 16. Unknowns / Open Questions
```

---

## 29. Call Graph

Không chỉ ghi danh sách class.

Tạo call graph theo flow:

```text
POST /api/invoices
│
├── InvoiceController.CreateAsync()
│
├── CreateInvoiceHandler.Handle()
│   │
│   ├── InvoiceValidator.ValidateAsync()
│   ├── CustomerService.GetAsync()
│   ├── InvoiceFactory.Create()
│   ├── InvoiceRepository.AddAsync()
│   └── InvoiceEventPublisher.PublishAsync()
│
└── InvoiceResponseMapper.Map()
```

Khi cần deep dive, tiếp tục expand từng node.

---

## 30. Data Flow

Theo dõi data thay vì chỉ theo dõi function.

Ví dụ:

```text
HTTP Request
    ↓
CreateInvoiceRequest
    ↓
CreateInvoiceCommand
    ↓
Invoice Aggregate
    ↓
InvoiceEntity
    ↓
EF Core
    ↓
PostgreSQL
```

Nếu có messaging:

```text
Invoice
    ↓
InvoiceCreatedEvent
    ↓
RabbitMQ
    ↓
InvoiceCreatedConsumer
    ↓
AnotherService
```

---

## 31. Dependency Map

Phân loại dependency:

```text
Internal Project
NuGet Package
Database
Cache
Message Broker
External API
File/Object Storage
Configuration
Runtime Infrastructure
```

Ví dụ:

```text
InvoiceService
├── IInvoiceRepository
├── ICustomerService
├── ITaxClient
├── IEventPublisher
├── IDistributedCache
└── IObjectStorage
```

Sau đó trace implementation:

```text
IInvoiceRepository
    ↓
EfInvoiceRepository
    ↓
InvoiceDbContext
    ↓
PostgreSQL
```

---

## 32. Three-pass reading strategy

### Pass 1 — Reconnaissance

Khoảng 10–20% effort.

Tìm:

```text
README
Solution
Projects
Package references
Program.cs
Configuration
Controllers
Consumers
Repositories
Tests
Docker
Kubernetes
CI/CD
```

Output:

```text
Architecture Map
Module Map
Entry Point Map
```

### Pass 2 — Trace

Khoảng 50–60% effort.

Chọn 3–5 flow quan trọng:

```text
Create
Get
Update
Delete
Background Processing
Message Processing
```

Trace:

```text
Entry
→ Business
→ Data
→ Integration
→ Output
```

Output:

```text
Business Flow Map
Call Graph
Data Flow
Dependency Map
```

### Pass 3 — Deep Dive

Khoảng 20–40% effort.

Chỉ đọc sâu:

```text
Business Rules
Transaction
Concurrency
Security
Performance
Integration
Error Handling
```

---

## 33. Chuẩn evidence khi reverse-engineering

Mỗi kết luận quan trọng nên có source reference.

Ví dụ:

```text
Observed:
InvoiceController.CreateAsync() gọi CreateInvoiceHandler.Handle().
Source:
InvoiceController.cs:42
```

Inference:

```text
[Suy luận]
Event có khả năng được xử lý asynchronous vì producer publish
và một consumer subscribe topic/queue tương ứng.
```

Unknown:

```text
[Chưa xác minh]
Chưa xác định được cơ chế đảm bảo exactly-once.
```

---

## 34. Output artifacts

Khi reverse-engineer một C#/.NET repository lớn:

```text
01-system-context.md
02-architecture.md
03-module-map.md
04-business-flows/
05-data-flow.md
06-integration-map.md
07-security.md
08-observability.md
09-deployment-runtime.md
10-open-questions.md
```

Trong đó `Business Flows` là artifact quan trọng nhất khi mục tiêu là hiểu behavior.

---

## 35. Anti-patterns

### Không đọc tuần tự toàn repository

Không nên:

```text
File 1
→ File 2
→ File 3
→ ...
```

### Không bắt đầu từ implementation detail

Không nên bắt đầu bằng:

```text
DTO
utility class
extension method
helper
getter/setter
```

nếu chưa biết flow.

### Không suy luận business rule chỉ từ tên method

Ví dụ:

```csharp
ValidateInvoice()
```

Tên method không đủ chứng minh chính xác business rule.

Phải đọc implementation, caller, test và configuration liên quan.

### Không chỉ đọc happy path

Luôn kiểm tra:

```text
Exception
Retry
Rollback
Timeout
Concurrency
Idempotency
```

### Không coi interface là implementation

Luôn trace:

```text
Interface
    ↓
Concrete implementation
    ↓
DI registration
```

### Không coi async là concurrency

`async/await` không tự động chứng minh code chạy song song.

Phải trace:

```text
await
Task composition
Task.WhenAll
ThreadPool
Channel
Parallel
Synchronization
```

---

## 36. Quy trình tổng thể

```text
Repository
    │
    ▼
┌─────────────────────┐
│ 1. Repository Scan  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 2. Architecture     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 3. Module Map       │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 4. Entry Points     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 5. Business Flows   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 6. Call Graph       │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 7. Data Flow        │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 8. Integration Map  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 9. Runtime Mapping  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 10. Validate/Test   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Knowledge Model     │
└─────────────────────┘
```

---

## 37. Definition of Done

Một flow chỉ được xem là đã hiểu tương đối đầy đủ khi có thể trả lời:

```text
□ Flow bắt đầu ở đâu?
□ Ai trigger?
□ Input là gì?
□ Các bước xử lý chính là gì?
□ Business rules nằm ở đâu?
□ Decision points là gì?
□ Data được đọc ở đâu?
□ Data được ghi ở đâu?
□ Transaction boundary ở đâu?
□ Cache có tham gia không?
□ Message nào được publish/consume?
□ External service nào được gọi?
□ Authentication/Authorization ở đâu?
□ Exception được xử lý thế nào?
□ Retry/timeout/fallback thế nào?
□ Concurrency thế nào?
□ Idempotency thế nào?
□ Output là gì?
□ Source evidence nằm ở đâu?
□ Những điểm nào vẫn Unknown?
```

Nếu chưa trả lời được một mục, không tự điền bằng giả định; đánh dấu `Unknown` và tiếp tục trace source liên quan.
