---
name: java-source-code-reading
description: Phương pháp luận đọc và reverse-engineer Java source code theo business flow, architecture, dependency, data flow và runtime behavior.
---

# Java Source Code Reading Skill

## 1. Mục tiêu

Skill này cung cấp phương pháp luận để đọc và reverse-engineer một Java codebase, đặc biệt phù hợp với hệ thống enterprise hoặc codebase lớn.

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

# 2. Nguyên tắc chung

## 2.1. Xác định scope trước khi đọc

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

---

## 2.2. Phân biệt fact và inference

Trong quá trình reverse-engineering, phân loại thông tin thành:

### Observed

Thông tin trực tiếp quan sát được từ source.

Ví dụ:

```text
InvoiceService.create() gọi InvoiceRepository.save()
```

### Documented

Thông tin được mô tả trong README, architecture document, comment hoặc configuration.

### Inferred

Kết luận được suy ra từ nhiều bằng chứng.

Ví dụ:

```text
Có Kafka producer và một consumer nhận cùng event.
[Suy luận] Event có khả năng được dùng cho asynchronous processing.
```

### Unknown

Chưa đủ bằng chứng để kết luận.

Ví dụ:

```text
Unknown:
Chưa xác định được consumer có đảm bảo idempotency hay không.
```

Không chuyển `Inferred` hoặc `Unknown` thành fact.

---

# 3. Mô hình đọc source 6 tầng

## L0 — Context

Trả lời:

```text
System làm gì?
Ai sử dụng?
Input là gì?
Output là gì?
Business capability nào?
External systems nào?
```

Kết quả mong muốn:

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

# 4. L1 — Architecture

Khảo sát repository trước khi đọc implementation.

Với Java, ưu tiên nhận diện:

```text
pom.xml
build.gradle
build.gradle.kts
settings.gradle
settings.gradle.kts
src/main/java
src/main/resources
src/test/java
src/test/resources
```

Nếu dùng Spring, tìm thêm:

```text
@SpringBootApplication
@Configuration
@ComponentScan
@EnableConfigurationProperties
@ConfigurationProperties
@Bean
```

Tìm các entry point phổ biến:

```text
@RestController
@Controller
@RequestMapping
@GetMapping
@PostMapping
@KafkaListener
@RabbitListener
@Scheduled
@EventListener
ApplicationRunner
CommandLineRunner
main()
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
- Security
- Observability

Kết quả cần đạt:

```text
Architecture Map
```

Ví dụ:

```text
Client
  ↓
REST Controller
  ↓
Application Service
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
Kafka
  ↓
Consumer
  ↓
Another Service
```

---

# 5. L2 — Module

Xác định responsibility của từng module/package.

Ví dụ:

```text
invoice
├── controller
├── application
├── domain
├── repository
├── messaging
└── integration
```

Hoặc:

```text
com.example.invoice
├── api
├── application
├── domain
├── infrastructure
└── configuration
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

# 6. L3 — Execution Flow

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

Ví dụ Spring Boot:

```text
POST /invoices
    ↓
InvoiceController.create()
    ↓
CreateInvoiceService.execute()
    ↓
InvoiceValidator.validate()
    ↓
InvoiceFactory.create()
    ↓
InvoiceRepository.save()
    ↓
InvoiceEventPublisher.publish()
    ↓
Kafka
```

---

# 7. Trace theo 5 câu hỏi

## 7.1. Entry

Xác định flow bắt đầu ở đâu.

Tìm:

```java
@RestController
@PostMapping
@GetMapping
@KafkaListener
@RabbitListener
@Scheduled
ApplicationRunner
CommandLineRunner
```

Câu hỏi:

```text
Ai gọi?
Input là gì?
Request DTO nào?
Message nào?
```

---

## 7.2. Transformation

Xác định input được biến đổi như thế nào:

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
Converter
Factory
Assembler
Adapter
Deserializer
Serializer
```

---

## 7.3. Decision

Tìm các điểm quyết định:

```java
if
else
switch
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

Mỗi decision cần xác định:

```text
Condition
    ↓
Possible Branches
    ↓
Business Meaning
```

---

## 7.4. Side Effect

Tìm mọi operation làm thay đổi state hoặc tương tác với hệ thống khác:

```text
Database write
Database transaction
Cache update
Message publish
Message consume
HTTP call
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
├── Kafka publish
└── HTTP → Tax Service
```

---

## 7.5. Error / Recovery

Không chỉ đọc happy path.

Tìm:

```text
Exception
try/catch
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

Đặc biệt kiểm tra các tình huống:

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

Xác định behavior thực tế từ source.

---

# 8. L4 — Implementation

Chỉ sau khi đã hiểu flow mới đọc sâu implementation.

Không đọc từng dòng.

Đọc theo semantic blocks:

```java
validateRequest();

loadCustomer();

calculateAmount();

createInvoice();

saveInvoice();

publishEvent();
```

Với mỗi block, trả lời:

```text
What does it do?
Why is it needed?
What data does it consume?
What data does it produce?
Does it have side effects?
Can it fail?
```

Nếu "Why" chưa xác định được từ source, đánh dấu:

```text
Unknown
```

Không tự tạo business explanation.

---

# 9. L5 — Runtime / Data / Side Effects

Map source code với runtime architecture.

Ví dụ:

```text
Java Application
    ↓
Spring Configuration
    ↓
Datasource
    ↓
PostgreSQL
```

hoặc:

```text
Service
├── PostgreSQL
├── Redis
├── Kafka
├── S3 / MinIO
└── External REST API
```

Tìm configuration trong:

```text
application.yml
application.yaml
application.properties
bootstrap.yml
bootstrap.properties
.env
Config Server
Environment Variables
Docker
Kubernetes
Helm
```

Không giả định configuration chỉ nằm trong source Java.

---

# 10. Java-specific reading order

Với Java enterprise codebase, ưu tiên đọc theo thứ tự:

```text
1. README / documentation
2. pom.xml / build.gradle
3. Application main class
4. Spring Boot configuration
5. Dependency Injection / Bean registration
6. Middleware / Filters / Interceptors
7. Security configuration
8. Controllers / REST endpoints
9. Message consumers / producers
10. Application Services
11. Domain Services / Entities
12. Repositories
13. JPA / Hibernate mappings
14. SQL / JPQL / native queries
15. External clients
16. Background jobs / schedulers
17. Configuration
18. Tests
```

Nếu không sử dụng Spring, thay bằng framework và infrastructure tương ứng.

---

# 11. Đọc Spring Dependency Injection

Một class sử dụng:

```java
@Service
public class InvoiceService {
    private final InvoiceRepository repository;

    public InvoiceService(InvoiceRepository repository) {
        this.repository = repository;
    }
}
```

Cần trace:

```text
InvoiceService
    ↓
InvoiceRepository interface
    ↓
Concrete implementation
    ↓
Spring Bean registration
```

Không dừng ở interface.

Cần xác định implementation thực tế được inject.

Tìm:

```text
@Service
@Repository
@Component
@Bean
@Configuration
@Primary
@Qualifier
```

Đặc biệt chú ý:

```text
Multiple implementations
@Qualifier
@Primary
Conditional beans
Profiles
Factory methods
```

---

# 12. Đọc Spring AOP

Khi behavior của method không giải thích được chỉ bằng method body, kiểm tra:

```text
@Transactional
@Async
@Cacheable
@CacheEvict
@Retryable
@CircuitBreaker
@PreAuthorize
@Secured
```

và:

```text
Aspect
Interceptor
Filter
HandlerInterceptor
OncePerRequestFilter
BeanPostProcessor
```

Ví dụ:

```java
@Transactional
public void createInvoice(...) {
    ...
}
```

Không chỉ ghi:

```text
Method tạo invoice.
```

Phải kiểm tra transaction boundary:

```text
Transaction Begin
    ↓
Method
    ↓
DB operations
    ↓
Commit / Rollback
```

---

# 13. Đọc Spring Web flow

Với REST API:

```text
HTTP
 ↓
Filter
 ↓
Interceptor
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Response
```

Kiểm tra:

```text
Authentication
Authorization
Validation
Exception Handler
Transaction
Serialization
Logging
Tracing
```

Tìm:

```text
OncePerRequestFilter
HandlerInterceptor
@ControllerAdvice
@ExceptionHandler
@Valid
@Validated
```

---

# 14. Đọc persistence layer

Với JPA/Hibernate:

```text
Entity
 ↓
Repository
 ↓
Hibernate
 ↓
SQL
 ↓
Database
```

Tìm:

```text
@Entity
@Table
@Id
@OneToMany
@ManyToOne
@OneToOne
@ManyToMany
@JoinColumn
@Embedded
@Embeddable
```

Không chỉ xem Entity.

Cần trace:

```text
Entity
 ↓
Repository method
 ↓
JPQL / Criteria / Native SQL
 ↓
Actual table
 ↓
Transaction
```

Đặc biệt kiểm tra:

```text
Lazy / Eager
Cascade
Fetch Join
N+1
Optimistic Lock
Pessimistic Lock
Transaction propagation
Isolation
```

Chỉ ghi nhận nếu source/configuration cho thấy chúng thực sự được sử dụng.

---

# 15. Đọc messaging

Với Kafka:

```text
Producer
    ↓
Topic
    ↓
Consumer
    ↓
Handler
```

Tìm:

```java
KafkaTemplate
@KafkaListener
ProducerRecord
ConsumerRecord
```

Trace:

```text
Event class
Topic
Key
Partition
Headers
Serializer
Consumer group
Retry
DLQ
```

Với RabbitMQ:

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
```

Tìm:

```text
RabbitTemplate
@RabbitListener
Exchange
Queue
Binding
```

---

# 16. Đọc asynchronous processing

Tìm:

```text
@Async
@Scheduled
ScheduledExecutorService
ExecutorService
CompletableFuture
KafkaListener
RabbitListener
Spring Batch
Quartz
```

Xác định:

```text
Trigger
    ↓
Execution
    ↓
Thread / Executor
    ↓
Transaction
    ↓
Side Effect
```

Đặc biệt kiểm tra concurrency:

```text
Single thread?
Thread pool?
Partition concurrency?
Multiple consumers?
Distributed execution?
Lock?
Idempotency?
```

---

# 17. Đọc security

Trace:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Business operation
 ↓
Data access
```

Tìm:

```text
Spring Security
SecurityFilterChain
Authentication
Authorization
GrantedAuthority
@PreAuthorize
@Secured
JWT
OAuth2
OIDC
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

# 18. Đọc error handling

Map:

```text
Exception source
    ↓
Propagation
    ↓
Handler
    ↓
Response / Retry / Rollback
```

Tìm:

```text
@ControllerAdvice
@ExceptionHandler
Global Exception Handler
Custom Exception
Retry
Circuit Breaker
Fallback
```

Cần phân biệt:

```text
Business Exception
Technical Exception
Validation Exception
Integration Exception
Infrastructure Exception
```

Không gán classification nếu source không cung cấp đủ bằng chứng.

---

# 19. Đọc tests

Tests là một nguồn evidence quan trọng.

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
@Test
@SpringBootTest
@WebMvcTest
@DataJpaTest
@MockBean
Mockito
Testcontainers
WireMock
```

Không mặc định rằng test bao phủ toàn bộ behavior của production code.

---

# 20. Business Flow Map

Mỗi business flow nên được ghi thành một artifact riêng.

Ví dụ:

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

# 21. Call Graph

Không chỉ ghi danh sách class.

Tạo call graph theo flow:

```text
POST /invoices
│
├── InvoiceController.create()
│
├── CreateInvoiceService.execute()
│   │
│   ├── InvoiceValidator.validate()
│   ├── CustomerService.getCustomer()
│   ├── InvoiceFactory.create()
│   ├── InvoiceRepository.save()
│   └── InvoiceEventPublisher.publish()
│
└── ResponseMapper.toResponse()
```

Khi cần deep dive, tiếp tục expand từng node.

---

# 22. Data Flow

Theo dõi data thay vì chỉ theo dõi function.

Ví dụ:

```text
HTTP Request
    ↓
CreateInvoiceRequest
    ↓
CreateInvoiceCommand
    ↓
Invoice
    ↓
InvoiceEntity
    ↓
PostgreSQL
```

Nếu có messaging:

```text
Invoice
    ↓
InvoiceCreatedEvent
    ↓
Kafka
    ↓
InvoiceCreatedConsumer
    ↓
AnotherService
```

---

# 23. Dependency Map

Phân loại dependency:

```text
Internal
External Library
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
├── InvoiceRepository
├── CustomerService
├── TaxClient
├── KafkaPublisher
├── RedisTemplate
└── ObjectStorageClient
```

---

# 24. Three-pass reading strategy

## Pass 1 — Reconnaissance

Mục tiêu:

```text
10–20% effort
```

Tìm:

```text
README
Build files
Application entry point
Configuration
Controllers
Consumers
Repositories
Tests
Deployment files
```

Output:

```text
Architecture Map
Module Map
Entry Point Map
```

---

## Pass 2 — Trace

Mục tiêu:

```text
50–60% effort
```

Chọn 3–5 flow quan trọng.

Ví dụ:

```text
Create
Get
Update
Delete
Background Processing
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

---

## Pass 3 — Deep Dive

Mục tiêu:

```text
20–40% effort
```

Chỉ đọc sâu vùng liên quan:

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

# 25. Chuẩn evidence khi reverse-engineering

Mỗi kết luận quan trọng nên có source reference.

Ví dụ:

```text
Observed:
InvoiceController.create() gọi CreateInvoiceService.execute()
Source:
InvoiceController.java:42
```

Hoặc:

```text
Observed:
CreateInvoiceService được đánh dấu @Transactional.
Source:
CreateInvoiceService.java:18
```

Với inference:

```text
[Suy luận]
Event có khả năng được xử lý asynchronous vì producer publish
và một Kafka consumer subscribe topic tương ứng.
```

Với unknown:

```text
[Chưa xác minh]
Chưa xác định được cơ chế đảm bảo exactly-once.
```

---

# 26. Output artifacts

Khi reverse-engineer một Java repository lớn, nên tạo:

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

Trong đó:

```text
Business Flows
```

là artifact quan trọng nhất khi mục tiêu là hiểu behavior.

---

# 27. Anti-patterns khi đọc source

## Không đọc tuần tự toàn repository

```text
File 1
→ File 2
→ File 3
→ ...
```

Cách này dễ mất context.

## Không bắt đầu từ implementation detail

Không nên bắt đầu bằng:

```text
private method
utility class
DTO
getter/setter
```

nếu chưa biết flow.

## Không suy luận business rule chỉ từ tên method

Ví dụ:

```java
validateInvoice()
```

Tên method không đủ chứng minh chính xác business rule.

Phải đọc implementation, caller, test và configuration liên quan.

## Không chỉ đọc happy path

Luôn kiểm tra:

```text
Exception
Retry
Rollback
Timeout
Concurrency
Idempotency
```

## Không coi interface là implementation

Luôn trace:

```text
Interface
    ↓
Concrete implementation
    ↓
DI configuration
```

---

# 28. Quy trình tổng thể

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

# 29. Definition of Done

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
