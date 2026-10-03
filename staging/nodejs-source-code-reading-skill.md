---
name: nodejs-source-code-reading
description: Phương pháp luận đọc và reverse-engineer Node.js source code theo business flow, architecture, dependency, data flow và runtime behavior.
---

# Node.js Source Code Reading Skill

## 1. Mục tiêu

Skill này cung cấp phương pháp luận để đọc và reverse-engineer một Node.js codebase, đặc biệt phù hợp với API service, worker, BFF hoặc monorepo lớn.

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

JavaScript trên Node chạy trên một event loop. `async/await` là nhường lượt cho I/O, không phải bằng chứng code chạy song song. Framework chỉ là cách đăng ký handler; behavior nằm ở thứ tự middleware, handler, và side effect thực sự được gọi.

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
- Worker / cron / queue có tham gia flow không?

Không cố gắng hiểu toàn bộ repository nếu câu hỏi chỉ liên quan đến một flow hoặc module. Không đọc `node_modules/` để hiểu nghiệp vụ.

### 2.2. Phân biệt fact và inference

Trong quá trình reverse-engineering, phân loại thông tin thành:

**Observed** — thông tin trực tiếp quan sát được từ source.

**Documented** — thông tin được mô tả trong README, architecture document, comment, configuration hoặc deployment manifest.

**Inferred** — kết luận được suy ra từ nhiều bằng chứng. Gắn nhãn `[Suy luận]`.

**Unknown** — chưa đủ bằng chứng để kết luận. Gắn nhãn `[Chưa xác minh]`.

Không chuyển `Inferred` hoặc `Unknown` thành fact.

Ví dụ Observed:

```text
invoice.controller.ts gọi invoiceService.create(), rồi queue.add("invoice.created", payload).
```

Ví dụ Inferred:

```text
[Suy luận]
Job có thể chạy ở process khác vì có file worker.ts tạo Worker của BullMQ,
trong khi HTTP server chỉ gọi queue.add().
```

`package.json` dependencies chỉ chứng minh package **có mặt**. Behavior chỉ thành fact khi có chỗ import và gọi.

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
Process nào đang chạy (API, worker, cron, serverless)?
```

Kết quả:

```text
System Context
├── Users / Clients
├── Business Capabilities
├── HTTP / GraphQL / gRPC APIs
├── Databases
├── Message Brokers / Queues
├── Workers / Cron
├── External Services
└── Infrastructure
```

---

## 4. L1 — Architecture

Khảo sát repository trước khi đọc implementation.

Với Node.js, ưu tiên nhận diện:

```text
package.json
package-lock.json / pnpm-lock.yaml / yarn.lock / bun.lock
pnpm-workspace.yaml
turbo.json
nx.json
lerna.json
tsconfig.json / jsconfig.json
nest-cli.json
.eslintrc* / eslint.config.*
Dockerfile
docker-compose*.yml
serverless.yml / template.yaml
apps/
packages/
services/
src/
prisma/
migrations/
```

Đọc `package.json` theo thứ tự:

```text
name / private
type            ("module" hay CommonJS)
engines.node
scripts         (start, dev, worker, migrate — đây mới là entry thật của app)
main / exports  (entry của library, không phải lúc nào cũng là HTTP server)
workspaces
dependencies
devDependencies
```

Script `start` hoặc `dev` trỏ tới file nào thì file đó là entry của process đó. Một repo có thể có nhiều process: `start:api`, `start:worker`, `start:scheduler`.

Nếu là TypeScript, kiểm tra `tsconfig` `paths` và tool chạy thật (`tsx`, `ts-node`, `nest start`, build ra `dist/`). Đường import `@app/...` chỉ resolve được khi biết `paths` hoặc bundler.

Nhận diện framework từ dependency và bootstrap, không từ tên folder:

```text
express          app.use / app.get / app.listen
fastify          fastify() / register / listen
@nestjs/core     NestFactory.create / @Module
koa              new Koa() / app.use
hono             new Hono() / app.get
next             app/api hoặc pages/api (server của Next)
apollo / mercurius / graphql-yoga
@grpc/grpc-js
@trpc/server
```

Tìm entry point:

```text
HTTP route / controller
GraphQL resolver
tRPC procedure
gRPC service method
Queue consumer / Worker
Cron / scheduler
CLI command
Serverless handler (exports.handler)
WebSocket connection handler
Process bootstrap (main.ts, server.ts, index.js)
```

Xác định:

- HTTP / API layer
- Application / use-case layer
- Domain layer
- Persistence layer
- Integration layer
- Messaging / job queue
- Background processing
- Configuration
- Authentication / Authorization
- Observability

Kết quả cần đạt: **Architecture Map**.

Ví dụ:

```text
Client
  ↓
HTTP server (Express / Fastify / Nest)
  ↓
Middleware / Guard / Pipe
  ↓
Route handler / Controller
  ↓
Application service
  ↓
Domain
  ↓
Repository / Prisma / TypeORM
  ↓
Database

Application service
  ↓
Queue.add / producer.send
  ↓
Redis / RabbitMQ / Kafka
  ↓
Worker process
  ↓
Another handler
```

Monorepo: xác định package nào là deployable (`apps/*`) và package nào là library (`packages/*`). Đọc library trước khi biết app nào import nó sẽ lẫn boundary.

---

## 5. L2 — Module

Xác định responsibility của từng package, folder hoặc Nest module.

Ví dụ app đơn:

```text
src/
├── modules/invoice
├── modules/customer
├── common
├── infra
└── main.ts
```

Ví dụ monorepo:

```text
apps/
├── api
├── worker
└── scheduler
packages/
├── domain
├── db
└── contracts
```

Với mỗi module, xác định:

```text
Responsibility
Dependencies
Entry Points
Outputs
External Dependencies
Process nào load module này
```

Đồng thời đặt câu hỏi:

> Module này không nên chịu trách nhiệm về việc gì?

Điều này giúp phát hiện coupling và boundary.

Với NestJS, một `@Module` không tự là boundary runtime. Provider mặc định là singleton trong application context. `imports` / `exports` mới quyết định module khác có inject được không. `@Global()` phá boundary đó — phải ghi nhận.

---

## 6. L3 — Execution Flow

Đây là tầng quan trọng nhất.

Không bắt đầu bằng việc đọc một file lớn từ trên xuống dưới.

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
invoice.routes.ts  router.post(...)
    ↓
createInvoiceHandler
    ↓
validateCreateInvoice (zod / joi / class-validator)
    ↓
invoiceService.create
    ↓
invoiceRepository.insert
    ↓
prisma.$transaction / COMMIT
    ↓
invoiceQueue.add("invoice.created")
    ↓
Redis (BullMQ)
```

Worker là một flow khác, có entry riêng:

```text
Worker process boot
    ↓
new Worker("invoice", processor)
    ↓
invoiceCreatedProcessor
    ↓
taxClient.submit
    ↓
invoiceRepository.markSubmitted
```

Không gộp HTTP handler và worker processor thành một call stack nếu chúng không chạy trong cùng một lần gọi.

---

## 7. Trace theo 5 câu hỏi

### 7.1. Entry

HTTP, tùy framework đang dùng:

```text
Express     app.get / app.post / router.METHOD / app.use
Fastify     fastify.get / fastify.post / fastify.route
Nest        @Controller @Get @Post @Put @Delete @Patch
Koa         router.get / router.post
Hono        app.get / app.post
Next        route.ts GET/POST, pages/api
```

Các entry không phải HTTP:

```text
GraphQL resolver / @Query @Mutation
tRPC procedure
gRPC server.addService
exports.handler          (Lambda, Cloud Functions)
queue.process / new Worker / @Process / @Processor
cron.schedule / @Cron / @Interval
socket.io connection / ws
commander / yargs action
```

Câu hỏi:

```text
Ai gọi?
Input là gì?
Body / query / params / headers nào được đọc?
Command / DTO / zod schema nào?
Message / job payload nào?
Process nào nhận entry này?
```

`app.listen` chứng minh có HTTP server. Nó không chứng minh route nào tồn tại — route nằm ở chỗ `register` / `use` / decorator được load lúc boot.

### 7.2. Transformation

Trace:

```text
HTTP Request / Job payload
    ↓
Parsed body (JSON, form, multipart)
    ↓
Validated DTO / schema
    ↓
Command / domain input
    ↓
Domain object
    ↓
Persistence row / document
```

Tìm:

```text
zod / joi / yup / valibot
class-validator + class-transformer
ValidationPipe (Nest)
ajv (Fastify schema)
Mapper thủ công
plainToInstance
JSON.parse
multer / busboy
```

Schema khai báo kiểu không đủ. Phải thấy schema được gọi (`schema.parse`, `ValidationPipe`, Fastify `schema`) trên đúng route. DTO type của TypeScript bị xóa lúc runtime.

Không dừng ở mapper; tiếp tục trace tới service/domain.

### 7.3. Decision

Tìm:

```javascript
if
else
switch
? :
??
?.
```

và:

```text
Validator
Guard / policy function
Permission check
Feature flag
Configuration branch
State machine
Business rule trong domain
early return
```

Với mỗi decision:

```text
Condition
    ↓
Possible Branches
    ↓
Business Meaning
```

Nhánh đọc `process.env` ngay trong handler là decision theo cấu hình. Ghi cả giá trị mặc định (`|| "false"`, `??`) vì nó đổi behavior khi env thiếu.

### 7.4. Side Effect

Tìm:

```text
Database write
Database transaction
Cache set / del
queue.add / producer.send
Job consume
HTTP / fetch / axios
gRPC call
File write / stream
Object storage (S3, MinIO)
Email
Notification
EventEmitter.emit (trong process)
```

Ví dụ:

```text
createInvoice
├── INSERT invoice
├── UPDATE customer
├── Redis SET cache
├── BullMQ add job
└── fetch → Tax Service
```

Phân biệt side effect **trong process** và **ra ngoài process**:

```text
eventEmitter.emit("invoice.created")     cùng process, synchronous listeners
queue.add("invoice.created")             process khác, hoặc cùng process nhưng job sau
await taxClient.submit()                 gọi ra ngoài, nằm trong request hiện tại
```

`EventEmitter` không phải message broker. Listener đăng ký sau khi emit sẽ không nhận event cũ.

### 7.5. Error / Recovery

Tìm:

```text
try/catch
Express error middleware (err, req, res, next)
Fastify setErrorHandler
Nest ExceptionFilter
Koa try/catch quanh await next()
process.on("unhandledRejection")
process.on("uncaughtException")
retry / backoff
timeout (AbortSignal, axios timeout)
circuit breaker
rollback / transaction
dead letter
compensation
idempotency key
fallback
```

Kiểm tra cả failure flow, ví dụ:

```text
DB commit thành công
    ↓
queue.add thất bại
```

hoặc:

```text
External API timeout
    ↓
Retry
    ↓
Retry failed
    ↓
Job chuyển sang failed / DLQ
```

Với Express 4, lỗi throw trong `async` handler **không** tự vào error middleware trừ khi có wrapper hoặc bản Express bắt promise rejection. Phải đọc version và chỗ bắt lỗi trước khi kết luận "mọi exception đều thành HTTP 500".

Chỉ kết luận behavior từ source/configuration thực tế.

---

## 8. L4 — Implementation

Sau khi hiểu flow mới đọc sâu implementation.

Đọc theo semantic blocks:

```javascript
await validateCreateInvoice(input);

const customer = await customerRepository.findById(input.customerId);

const amount = calculateAmount(input.lines);

const invoice = createInvoice({ customer, amount, lines: input.lines });

await invoiceRepository.insert(invoice);

await publishInvoiceCreated(invoice);
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

Khi gặp callback hoặc stream, đọc đến chỗ kết thúc thật (`callback(err)`, `stream.on("end")`, `pipeline`, promise wrapper). Return sớm của hàm ngoài không có nghĩa là side effect đã xong.

---

## 9. L5 — Runtime / Data / Side Effects

Map source với runtime architecture:

```text
Node.js process
    ↓
HTTP framework
    ↓
Application code
    ↓
Driver / ORM
    ↓
PostgreSQL / MySQL / MongoDB
```

hoặc nhiều process:

```text
api process
├── PostgreSQL
├── Redis
└── HTTP → Tax Service

worker process
├── Redis (BullMQ)
├── PostgreSQL
└── HTTP → Tax Service
```

Tìm configuration trong:

```text
process.env
.env / .env.local / .env.{NODE_ENV}
dotenv / dotenv-flow
node-config (config/default.json, config/production.json)
@nestjs/config
convict / envalid / zod env schema
Docker Compose environment
Kubernetes ConfigMap / Secret
serverless.yml environment
```

Không giả định configuration chỉ nằm trong file `.env` được commit. Giá trị thật ở runtime có thể đến từ secret của nền tảng, và file `.env` trong repo chỉ là mẫu.

Không ghi secret values vào tài liệu.

---

## 10. Node.js-specific reading order

Ưu tiên:

```text
1. README / documentation
2. package.json scripts và dependencies
3. Workspace (pnpm-workspace, turbo, nx) nếu là monorepo
4. "type": module và tsconfig paths
5. File mà script start/dev/worker trỏ tới
6. Bootstrap: tạo app, listen, tạo Worker
7. Đăng ký middleware / plugin / module — đúng thứ tự
8. Authentication / Authorization
9. Routes / controllers / resolvers / procedures
10. Queue consumers / producers
11. Application services / use cases
12. Domain
13. Repository / Prisma / TypeORM / Drizzle / Mongoose
14. External clients
15. Cron / scheduler / worker_threads
16. Configuration
17. Tests
18. Docker / Kubernetes / serverless / CI
```

Bỏ qua `dist/`, `build/`, `.next/` khi source TypeScript còn nằm cạnh. Nếu repo chỉ deploy JS đã build và không có source map, đọc `dist/` và ghi nhận đó là artifact build.

---

## 11. Dependency Injection và composition

Node không có DI container mặc định. Cách lắp dependency nằm ở một trong các kiểu sau. Xác định kiểu nào **trước** khi trace implementation.

### Truyền tay / factory

```javascript
function createInvoiceService({ invoiceRepository, queue }) {
  return {
    async create(input) { /* dùng invoiceRepository, queue */ },
  };
}
```

Trace:

```text
createInvoiceService({ ... })
    ↓
object thật được truyền vào
    ↓
chỗ gọi create (composition root: main.ts, container.ts)
```

Closure giữ dependency. Không có decorator nào để grep. Composition root là nơi sự thật nằm.

### NestJS

```text
NestFactory.create(AppModule)
    ↓
@Module({ imports, controllers, providers, exports })
    ↓
@Injectable() constructor(private readonly repo: InvoiceRepository)
```

Trace:

```text
InvoiceService
    ↓
provider token (class hoặc string hoặc symbol)
    ↓
useClass / useFactory / useExisting / useValue
    ↓
module nào exports token đó
```

Đặc biệt chú ý:

```text
Scope.DEFAULT (singleton) / Scope.REQUEST / Scope.TRANSIENT
@Global()
Dynamic module: forRoot / forRootAsync / register
forwardRef (circular)
custom provider token
APP_GUARD / APP_INTERCEPTOR / APP_PIPE / APP_FILTER
```

`forRootAsync` có thể đọc config lúc boot và chọn implementation theo env. Đọc factory, không chỉ chữ `imports: [InvoiceModule]`.

### Container thư viện

```text
awilix        createContainer / asClass / asFunction / injectionMode
tsyringe      @injectable / container.resolve
inversify     @injectable / @inject / Container
typedi        @Service / Container.get
```

Lifetime (`SINGLETON`, `SCOPED`, `TRANSIENT`) đổi việc một instance có bị chia sẻ giữa các request hay không.

### Module cache của Node

`require()` và `import` cache module. Object export mutable là singleton tình cờ trong **một process**.

```text
module.exports = new PrismaClient()
```

được mọi file trong process đó dùng chung. Process khác (cluster, PM2 instance, worker riêng) có instance khác. Không gọi đây là distributed cache.

TypeScript `interface` và `type` không tồn tại lúc runtime. Luôn trace giá trị được import hoặc được nhét vào constructor.

---

## 12. HTTP pipeline

Xác định framework, rồi đọc **đúng** pipeline của framework đó. Thứ tự đăng ký là behavior.

### Express

```text
HTTP
 ↓
middleware app.use theo thứ tự source
 ↓
router
 ↓
route-level middleware
 ↓
route handler
 ↓
res.json / res.send / res.end

lỗi: next(err) → error middleware (4 tham số), đặt sau route
```

Tìm:

```javascript
app.use(...)
router.use(...)
express.json()
express.urlencoded()
cookieParser
cors
helmet
morgan / pino-http
```

Kiểm tra body parser có chạy **trước** handler cần `req.body`. Route gắn trước `express.json()` sẽ không thấy body.

Express 4 không bắt rejection của async handler. Express 5 có. Đọc version trong lockfile khi kết luận error flow.

### Fastify

Lifecycle một request:

```text
onRequest
 ↓
preParsing
 ↓
preValidation
 ↓
preHandler
 ↓
handler
 ↓
preSerialization
 ↓
onSend
 ↓
onResponse
```

`fastify.register(plugin)` tạo encapsulation context. Hook, decorator và route đăng ký trong plugin không nhìn thấy decorator của plugin anh em. Đọc `server.ts` không đủ nếu route nằm trong plugin được register.

Tìm `schema` trên route (ajv) — validation của Fastify nằm ở khai báo route, không phải một class DTO.

### NestJS

```text
Request
 ↓
Middleware
 ↓
Guards
 ↓
Interceptors (trước)
 ↓
Pipes (validation, transform)
 ↓
Controller method
 ↓
Interceptors (sau)
 ↓
Exception Filters   (khi throw)
```

Guards quyết định có vào handler không. Pipes chạy trước handler nên DTO trong controller đã qua transform nếu `ValidationPipe` được gắn global hoặc trên tham số.

Middleware Nest không đi qua exception filter theo cùng cách với lỗi throw trong controller. Khi lỗi "biến mất", kiểm tra nó throw ở tầng nào.

### Koa

Onion: middleware chạy xuống tới `await next()`, rồi chạy phần sau `next()` lúc đi lên.

```text
middleware A (trước next)
  middleware B (trước next)
    handler
  middleware B (sau next)
middleware A (sau next)
```

Thứ tự `app.use` là thứ tự đi xuống. Gán `ctx.body` ở tầng trong có thể bị tầng ngoài sửa khi đi lên.

### Kiểm tra chung cho mọi framework

```text
Authentication
Authorization
Validation
Exception handling
Logging
Tracing
Correlation ID / AsyncLocalStorage
Rate limiting
CORS
Request/Response transformation
Body size limit
Timeout
```

Khi flow phụ thuộc vào pipeline, phải ghi nhận thứ tự đăng ký thực tế trong file bootstrap.

---

## 13. Route, controller, resolver

Controller / route handler:

```javascript
router.post("/invoices", async (req, res, next) => {
  const invoice = await invoiceService.create(req.body);
  res.status(201).json(invoice);
});
```

Trace:

```text
HTTP
 ↓
Body parser
 ↓
Auth middleware / guard
 ↓
Validation
 ↓
Handler
 ↓
Application service
 ↓
HTTP response
```

Nest:

```typescript
@Post()
create(@Body() dto: CreateInvoiceDto) {
  return this.invoiceService.create(dto);
}
```

`return` một Promise là đủ để Nest gửi response. Không cần `res.json` trừ khi dùng `@Res()` — khi dùng `@Res()`, Nest không tự gửi response nữa. Phải đọc xem handler có tự `res.send` hay không.

GraphQL:

```text
Operation (query / mutation)
 ↓
Resolver
 ↓
DataLoader (nếu có — gom N+1)
 ↓
Service / repository
```

Mỗi field resolver là một entry nhỏ. Đọc resolver của field đó, không chỉ resolver của type cha.

tRPC: procedure là entry. `input()` là validation. Middleware của procedure (`.use`) chạy trước handler.

gRPC: method trong `addService` / `@GrpcMethod` là entry. Deadline và metadata là một phần input.

---

## 14. CQRS và command bus

Chỉ áp dụng khi source thật sự có bus. Nhiều codebase Node gọi thẳng service.

Nếu có `@nestjs/cqrs` hoặc bus tự viết:

```text
HTTP
 ↓
Controller
 ↓
CommandBus.execute(command) / QueryBus.execute(query)
 ↓
CommandHandler / QueryHandler
 ↓
Domain / Repository

EventBus.publish
 ↓
EventHandler / Saga
```

Tìm:

```text
CommandBus
QueryBus
EventBus
@CommandHandler
@QueryHandler
@EventsHandler
Saga
```

Saga và event handler có thể chạy sau khi HTTP đã trả response, trong cùng process. Đó vẫn không phải queue bền: process chết là event trong bộ nhớ mất. Phân biệt với `queue.add`.

Nếu bus tự viết (`commands[name](payload)`), trace bảng đăng ký handler. Tên command string sai là fail im lặng hoặc throw — đọc nhánh default.

---

## 15. Domain

Nếu codebase tách domain, tìm:

```text
entity / aggregate
value object
domain service
domain event
repository interface (port)
factory
invariant trong constructor hoặc method
```

Cần xác định:

```text
Who owns the state?
Where can the state change?
Where are invariants enforced?
Who creates the object?
Who persists it?
```

Đặc biệt chú ý mutation có chủ đích:

```javascript
invoice.issue();
invoice.cancel();
invoice.addLine(line);
```

thay vì chỉ nhìn chỗ gán `invoice.status = "issued"`.

Trong JavaScript, object mặc định mutable. Gán property bên ngoài aggregate vẫn xảy ra nếu không có khóa thật (`Object.freeze`, class có field private `#`, hoặc convention). Nếu invariant chỉ nằm trong method nhưng caller sửa property trực tiếp, ghi đó là fact: invariant không được cưỡng chế.

Không suy ra DDD chỉ vì folder tên `domain/`.

---

## 16. ORM và document mapper

Đọc mapper đang được dùng. Một repo có thể dùng hai cơ chế (Prisma cho module mới, Knex cho module cũ).

### Prisma

```text
Application
 ↓
PrismaClient
 ↓
schema.prisma
 ↓
SQL
 ↓
Database
```

Tìm:

```text
schema.prisma
model / enum / @@map / @map
datasource / generator
prisma/migrations
new PrismaClient()
include / select
$transaction
$extends
```

`@@map` và `@map` làm tên bảng/cột khác tên field TypeScript. Không suy schema DB chỉ từ type generate.

Kiểm tra client có được tạo một lần ở composition root hay `new PrismaClient()` trong từng request. Nhiều client làm cạn connection pool.

### TypeORM

```text
DataSource
 ↓
Entity / Repository / EntityManager
 ↓
QueryBuilder hoặc repository.save
 ↓
Database
```

Tìm:

```text
@Entity @Column @PrimaryGeneratedColumn
@ManyToOne @OneToMany @JoinColumn
DataSource / TypeOrmModule.forRoot
migrations
synchronize
subscribers
```

`synchronize: true` đổi schema lúc boot. Đó là behavior runtime, không phải chi tiết vô hại. Đối chiếu entity với thư mục migration: hai bên có thể lệch.

`save()` có thể INSERT hoặc UPDATE tùy primary key. Đọc dữ liệu truyền vào trước khi gọi tên operation.

### Drizzle

```text
schema TypeScript
 ↓
drizzle(client)
 ↓
db.insert / db.select / db.update
 ↓
SQL
```

Migration nằm ở output của drizzle-kit, không nằm trong schema file. Schema khai báo ý định; migration là thứ đã áp lên database — hai thứ có thể lệch nếu chưa generate.

### Mongoose

```text
Schema
 ↓
model
 ↓
pre / post hook
 ↓
MongoDB
```

Hook `pre("save")` là side effect và decision ẩn. Đọc hook trước khi kết luận `document.save()` chỉ ghi một document.

Transaction Mongoose cần session và replica set. Nếu source gọi `startSession` / `withTransaction`, ghi nhận. Nếu không thấy, đừng giả định multi-document là atomic.

---

## 17. Query builder và driver thô

Knex / Kysely / Slonik / `pg` / `mysql2` / `mongodb` driver:

```text
Repository
 ↓
Connection / pool
 ↓
SQL hoặc command
 ↓
Driver
 ↓
Database
```

Tìm:

```text
knex("invoice").insert
db.selectFrom
pool.query
client.query
BEGIN / COMMIT / ROLLBACK trong SQL string
```

Cần xác định:

```text
SQL
Parameters (placeholder $1, ?, named)
Transaction (client dành riêng hay pool)
Connection lifetime
Mapping hàng → object
Stored procedure
```

SQL trong template string là fact. Tên hàm TypeScript bọc nó không thay thế việc đọc câu SQL.

Placeholder và giá trị phải đi qua parameter. Nối chuỗi SQL với input người dùng là behavior bảo mật, ghi vào phần security của flow.

Pool (`pg.Pool`, Knex pool) chia sẻ connection. Transaction phải giữ **một** client/`trx` cho mọi câu trong cùng đơn vị công việc. Query lấy connection mới từ pool nằm ngoài transaction dù nằm cùng function.

---

## 18. Transaction

Tìm:

```text
prisma.$transaction
dataSource.transaction
queryRunner.startTransaction / commit / rollback
knex.transaction
session.withTransaction
pool.connect + BEGIN/COMMIT
sequelize.transaction
```

Trace:

```text
Transaction begin
    ↓
Operation A
    ↓
Operation B
    ↓
Message / HTTP call
    ↓
Commit / Rollback
```

Kiểm tra:

```text
Transaction boundary
Isolation
Timeout của transaction
Retry
Rollback khi throw
Outbox
Connection nào được dùng
```

Không mặc định rằng nhiều câu query trong cùng function thuộc cùng transaction.

Phân biệt hai dạng Prisma:

```text
$transaction([query1, query2])          tuần tự, một transaction
$transaction(async (tx) => { ... })     interactive, mọi gọi phải dùng tx
```

Gọi `prisma.invoice.create` bên trong interactive transaction nhưng không dùng `tx` thì câu đó **nằm ngoài** transaction. Đây là lỗi đọc source hay gặp.

HTTP call hoặc `queue.add` bên trong transaction giữ connection lâu hơn và có thể publish dù transaction sau đó rollback. Nếu không thấy outbox, ghi nhận khoảng lệch đó thay vì giả định atomic với message.

---

## 19. Messaging và job queue

Xác định công nghệ từ client được import, rồi trace producer và consumer như hai entry.

### BullMQ / Bull (Redis)

```text
Producer (thường là API process)
    ↓
queue.add(name, data, opts)
    ↓
Redis
    ↓
Worker (thường là process khác)
    ↓
processor
```

Kiểm tra:

```text
queue name
job name
attempts / backoff
jobId (idempotency)
concurrency
removeOnComplete / removeOnFail
repeat
Worker file nào được script nào khởi động
```

`queue.add` thành công chỉ có nghĩa job đã vào Redis. Xử lý nghiệp vụ nằm ở processor. Đọc opts: `attempts: 1` là không retry.

### RabbitMQ (amqplib, nest microservices, golevelup)

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
    ↓
ack / nack
```

Kiểm tra:

```text
Exchange / type
Queue
Routing key
prefetch
noAck
Retry
Dead letter
Idempotency
```

`noAck: true` hoặc quên `ack` đổi semantics mất/lặp message. Đọc callback consume đến chỗ ack.

### Kafka (kafkajs, nest microservices)

```text
Producer
    ↓
Topic
    ↓
Partition
    ↓
Consumer group
    ↓
eachMessage / eachBatch
    ↓
Handler
```

Kiểm tra:

```text
Topic
Key
Consumer group
autoCommit hay commit thủ công
fromBeginning
Session timeout / heartbeat
Retry
DLQ
Concurrency
Idempotency
```

### NATS, SQS/SNS, Google Pub/Sub

Đọc client cụ thể. Các khái niệm cần có trong map: subject hoặc queue URL, ack deadline, visibility timeout, dead letter, group/subscription. Không copy semantics của Kafka sang SQS.

### Redis pub/sub

Pub/sub của Redis không lưu message cho subscriber offline. Đừng gọi nó là queue bền trừ khi source dùng Streams (`XADD` / `XREADGROUP`).

---

## 20. Background processing

Tìm:

```text
node-cron / cron
@nestjs/schedule @Cron @Interval
BullMQ repeatable job
Agenda
setInterval / setTimeout
worker_threads
child_process
cluster
```

Flow:

```text
Trigger
    ↓
Scheduler / Worker boot
    ↓
Execution
    ↓
Transaction
    ↓
Side Effect
```

Kiểm tra:

```text
Process nào chạy scheduler
Concurrency
Số instance (PM2, k8s replicas)
Lock phân tán
Shutdown (SIGTERM, worker.close)
Retry
Idempotency
Overlap: job chạy lâu hơn interval
```

`setInterval` trong API process chạy **mỗi replica**. Ba pod là ba lần tick. Không kết luận "chạy một lần" nếu chưa thấy lock (Redis `SET NX`, advisory lock, BullMQ jobId).

`worker_threads` chia sẻ memory chỉ khi dùng `SharedArrayBuffer`. Message qua `postMessage` là bản sao. Đọc chỗ nào là thread và chỗ nào vẫn là event loop chính.

Serverless: function không phải process nền. Cron của nền tảng (EventBridge, Cloud Scheduler) là trigger bên ngoài, khai ở manifest chứ không ở `setInterval`.

---

## 21. Event loop, async và concurrency

Không coi `async/await` là bằng chứng của thực thi song song.

Mô hình:

```text
Một process Node
    ↓
Một event loop (JavaScript)
    ↓
I/O chờ ở libuv, callback/promise quay lại loop
    ↓
worker_threads hoặc process khác khi cần song song thật
```

Kiểm tra:

```text
await tuần tự
Promise.all / Promise.allSettled
p-limit / p-queue
worker_threads
cluster / PM2 instances
AbortSignal
shared mutable state (object, Map, array module-level)
```

Đặt câu hỏi:

```text
Các bước I/O chạy nối tiếp hay gối nhau?
Có shared mutable state trên heap của process không?
Có cancellation không?
Có giới hạn concurrency không?
Có race giữa hai request không?
CPU-bound có chặn loop không?
```

Hai request có thể xen kẽ tại mỗi `await`. Kiểm tra read-modify-write không transaction:

```text
đọc số dư
    ↓ await
ghi số dư mới
```

Request khác có thể ghi vào giữa hai bước. `await` tạo khoảng xen kẽ, không tạo isolation.

`Promise.all` chạy các promise gối nhau, vẫn trên cùng event loop. Nó không dùng thêm CPU core.

Threadpool libuv (mặc định kích thước 4) phục vụ một phần `fs`, `dns`, `crypto`, nén — không phục vụ JavaScript thuần và không phục vụ phần lớn network I/O. Đừng giải thích mọi `await` bằng threadpool.

`Unhandled rejection` làm process có thể chết tùy phiên bản Node và có hay không handler `unhandledRejection`. Đọc handler đó trước khi kết luận process "nuốt lỗi".

---

## 22. Authentication / Authorization

Trace:

```text
Request
 ↓
Authentication middleware / guard
 ↓
req.user / request.user / context
 ↓
Authorization
 ↓
Policy / role check
 ↓
Business operation
 ↓
Data access (filter theo tenant / owner)
```

Tìm:

```text
passport / passport-jwt
jsonwebtoken / jose
express-jwt
Nest AuthGuard / @UseGuards
@Public / metadata reflector
session middleware (express-session)
cookie
API key header
helmet / cors
```

Nếu có JWT:

```text
Authorization header hoặc cookie
 ↓
verify chữ ký / issuer / audience / exp
 ↓
claims
 ↓
gắn lên request
 ↓
guard hoặc if (user.role)
```

Cần trả lời:

```text
Who can call?
How is identity established?
Chữ ký JWT được kiểm ở đâu?
How are permissions checked?
Is authorization at endpoint or business layer?
Is tenant isolation implemented ở query?
```

Middleware auth gắn sau route thì route đó không được bảo vệ. Đọc thứ tự, không đọc riêng file `auth.ts`.

Ẩn field ở DTO response không phải là phân quyền. Phân quyền là chỗ từ chối thực thi hoặc lọc dữ liệu.

Trust proxy (`trust proxy`) đổi `req.ip` và secure cookie. Chỉ ghi nhận khi source bật nó.

---

## 23. Error handling

Map:

```text
Exception / rejection source
    ↓
Propagation
    ↓
Framework handler
    ↓
Response / retry / rollback
```

Tìm:

```text
try/catch
next(err)
setErrorHandler
ExceptionFilter
HttpException / custom error class
error middleware 4 tham số
unhandledRejection / uncaughtException
```

Nếu source đủ evidence, phân biệt:

```text
Business error (quy tắc nghiệp vụ, thường 4xx)
Validation error
Technical error (bug, 5xx)
Integration error (upstream timeout, 502/504)
Infrastructure error (DB down)
```

Kiểm tra mapping status code có nằm ở một filter chung hay từng handler tự `res.status`. Hai đường này dễ lệch nhau.

Lỗi trong worker không thành HTTP response. Nó thành job failed, retry, hoặc log. Đọc processor riêng.

`catch (e) {}` rỗng là behavior: lỗi bị nuốt. Ghi nhận, đừng diễn giải thành "có xử lý lỗi".

---

## 24. Observability

Tìm:

```text
pino / winston / bunyan
console.log
pino-http / morgan
@opentelemetry/sdk-node
prom-client
AsyncLocalStorage (correlation id, tenant)
cls-hooked (cũ)
health endpoint / @nestjs/terminus
```

Trace:

```text
Request hoặc job
 ↓
Trace / span
 ↓
Logger child (bindings: requestId, invoiceId)
 ↓
DB / HTTP / queue
```

Kiểm tra:

```text
Trace ID
Span ID
Correlation ID
Structured logging (JSON fields) hay string nối
Metrics
Health checks (liveness khác readiness)
```

Nếu dùng OpenTelemetry, xác định:

```text
SDK được khởi tạo ở đâu (phải trước khi import app nếu dùng auto-instrument)
Instrumentation (http, pg, ioredis, ...)
Exporter
Resource
Sampling
```

Auto-instrument chỉ gắn được nếu SDK load trước module HTTP/DB. Thứ tự import trong `main.ts` là fact về trace có đầy đủ hay không.

`console.log` là log thật. Đừng bỏ qua vì "không phải logger chuẩn".

---

## 25. External clients

Tìm:

```text
fetch (undici, global)
axios
got
undici.request
node:http
@grpc/grpc-js
AWS SDK v3
client bọc trong infra/
```

Trace:

```text
Application
 ↓
Client wrapper
 ↓
HTTP / gRPC
 ↓
External system
```

Kiểm tra:

```text
Timeout
Retry
Circuit breaker (opossum, cockatiel)
Authentication (header, mTLS)
Base URL lấy từ đâu
Serialization
Error mapping
Idempotency key
AbortSignal
```

`fetch` không có timeout mặc định. Không kết luận "có timeout" nếu chưa thấy `AbortSignal.timeout` hoặc agent cấu hình.

Axios `timeout` là timeout của socket, không phải retry. Retry nằm ở interceptor hoặc thư viện khác. Đọc interceptor vì nó sửa mọi request của instance đó.

Wrapper `taxClient.submit` có thể nuốt status 4xx và trả `null`. Đọc mapping lỗi, không dừng ở tên hàm.

---

## 26. Configuration

Tìm:

```text
process.env
dotenv.config()
ConfigModule.forRoot
config package (node-config)
convict
envalid / zod parse env
```

Trace:

```text
File env hoặc secret store
    ↓
process.env
    ↓
schema parse (nếu có)
    ↓
config object
    ↓
service dùng config
```

Đặc biệt kiểm tra:

```text
Connection strings
URLs
Feature flags
Timeouts
Retry settings
Queue / topic names
Cache TTL
Security settings
Giá trị mặc định khi env thiếu
```

Thứ tự ghi đè cần đọc trong source:

```text
dotenv mặc định không đè env đã có
node-config merge default → {NODE_ENV} → local → custom-env
Nest ConfigModule có flag ignoreEnvFile / expandVariables
```

`process.env.X || "default"` làm giá trị rỗng và giá trị thiếu cùng rơi về default. Ghi đúng biểu thức.

Không ghi secret values vào documentation.

---

## 27. Tests

Ưu tiên:

```text
Unit test
Integration test (DB thật hoặc testcontainers)
HTTP test (supertest, inject của Fastify)
Contract test
End-to-end
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
node:test
jest
vitest
mocha
supertest
fastify.inject
@nestjs/testing
nock / msw
testcontainers
mongodb-memory-server
sinon
```

Test cho biết behavior mà tác giả muốn khóa. Test thiếu không chứng minh production không có nhánh đó.

Mock thay repository nghĩa là test không chứng minh SQL. Đọc loại test trước khi dùng nó làm evidence cho persistence.

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

Flow của worker tách file nếu entry khác process với API, ví dụ `consume-invoice-created.md`.

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

Không chỉ ghi danh sách file.

Tạo call graph theo flow:

```text
POST /api/invoices
│
├── createInvoiceHandler
│
├── invoiceService.create
│   │
│   ├── validateCreateInvoice
│   ├── customerRepository.findById
│   ├── createInvoice
│   ├── invoiceRepository.insert
│   └── invoiceQueue.add
│
└── toInvoiceResponse
```

Khi cần deep dive, tiếp tục expand từng node.

Nếu producer và worker tách process, vẽ hai graph và nối bằng queue, không vẽ một stack giả.

```text
invoiceQueue.add("invoice.created")
        │
        │  Redis
        ▼
invoiceCreatedProcessor
├── taxClient.submit
└── invoiceRepository.markSubmitted
```

---

## 30. Data Flow

Theo dõi data thay vì chỉ theo dõi function.

Ví dụ:

```text
HTTP JSON body
    ↓
CreateInvoiceInput (sau zod parse)
    ↓
Invoice (domain)
    ↓
hàng bảng invoice
    ↓
Prisma
    ↓
PostgreSQL
```

Nếu có queue:

```text
Invoice
    ↓
job payload { invoiceId }
    ↓
Redis
    ↓
processor đọc lại invoice từ DB
    ↓
Tax API
```

Ghi rõ payload mang cả aggregate hay chỉ mang id. Hai cách này đổi việc worker có nhìn thấy dữ liệu đã commit hay bản copy lúc enqueue.

---

## 31. Dependency Map

Phân loại dependency:

```text
Workspace package
npm package
Database
Cache
Message broker / queue
External API
File / object storage
Configuration
Runtime (phiên bản Node, số process, serverless)
```

Ví dụ:

```text
invoiceService
├── invoiceRepository
├── customerRepository
├── taxClient
├── invoiceQueue
├── cache
└── objectStorage
```

Sau đó trace implementation:

```text
invoiceRepository
    ↓
PrismaInvoiceRepository
    ↓
PrismaClient
    ↓
PostgreSQL
```

npm package chỉ vào map khi source gọi nó. Dependency khai trong `package.json` nhưng không import là khả năng chưa dùng.

---

## 32. Three-pass reading strategy

### Pass 1 — Reconnaissance

Khoảng 10–20% effort.

Tìm:

```text
README
package.json scripts
Workspace layout
Framework
Bootstrap file
Configuration
Routes / controllers
Workers / consumers
Repositories
Tests
Docker
Kubernetes / serverless
CI/CD
```

Output:

```text
Architecture Map
Module Map
Entry Point Map
Danh sách process
```

### Pass 2 — Trace

Khoảng 50–60% effort.

Chọn 3–5 flow quan trọng:

```text
Create
Get
Update
Delete
Background / cron
Message / job processing
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
Business rules
Transaction
Concurrency / event loop
Security
Performance (N+1, blocking, pool)
Integration
Error handling
```

---

## 33. Chuẩn evidence khi reverse-engineering

Mỗi kết luận quan trọng nên có source reference.

Ví dụ:

```text
Observed:
createInvoiceHandler gọi invoiceService.create rồi invoiceQueue.add.
Source:
src/invoice/invoice.routes.ts:42
src/invoice/invoice.service.ts:88
```

Inference:

```text
[Suy luận]
Job có khả năng được xử lý ở process khác vì apps/worker/main.ts
tạo Worker trên queue "invoice", còn API chỉ gọi queue.add.
```

Unknown:

```text
[Chưa xác minh]
Chưa xác định được jobId có được đặt để chống enqueue trùng hay không.
```

---

## 34. Output artifacts

Khi reverse-engineer một Node.js repository lớn:

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

Trong đó `business-flows/` là artifact quan trọng nhất khi mục tiêu là hiểu behavior.

`09-deployment-runtime.md` nên nói rõ: bao nhiêu process, process nào nghe HTTP, process nào chạy worker, thứ tự migrate lúc boot.

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

Không đọc `node_modules/` để hiểu nghiệp vụ.

### Không bắt đầu từ implementation detail

Không nên bắt đầu bằng:

```text
DTO type
utils/
helpers/
constants
formatter
```

nếu chưa biết flow.

### Không suy luận business rule chỉ từ tên hàm

Ví dụ:

```javascript
validateInvoice()
```

Tên hàm không đủ chứng minh business rule. Phải đọc implementation, caller, test và configuration liên quan.

### Không chỉ đọc happy path

Luôn kiểm tra:

```text
throw / reject
retry
rollback
timeout
concurrency
idempotency
nhánh worker failed
```

### Không coi type hoặc interface là implementation

TypeScript type biến mất lúc chạy. Luôn trace:

```text
Hàm / class được gọi
    ↓
Giá trị thật (import, factory, provider)
    ↓
Chỗ đăng ký ở composition root
```

### Không coi async là song song

`async/await` không tự động chứng minh code chạy song song.

Phải trace:

```text
await tuần tự
Promise.all
worker_threads
cluster / số replica
shared state
transaction
```

### Không bỏ qua thứ tự đăng ký

Middleware, plugin Fastify, guard global và `app.use` chỉ có nghĩa theo thứ tự trong file bootstrap. Đọc từng file middleware riêng rồi ghép theo tên sẽ sai pipeline.

### Không coi heap của process là trạng thái dùng chung

`Map` module-level, cache in-memory và `EventEmitter` thuộc một process. PM2 cluster, nhiều pod, và worker riêng không nhìn thấy chúng. Không kết luận "cache toàn hệ thống" nếu store là bộ nhớ process.

### Không coi queue.add là đã xử lý xong nghiệp vụ

Enqueue là side effect của flow producer. Nghiệp vụ phía sau nằm ở processor, có entry và failure mode riêng.

### Không tin package.json bằng chỗ gọi

Dependency có trong `package.json` chỉ là khả năng. Fact là import và lời gọi. Script không được CMD/Dockerfile hoặc manifest serverless gọi thì không phải entry của môi trường đang xét — ghi đúng môi trường.

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

Bước 4 phải liệt kê mọi process, không chỉ HTTP server.

---

## 37. Definition of Done

Một flow chỉ được xem là đã hiểu tương đối đầy đủ khi có thể trả lời:

```text
□ Flow bắt đầu ở đâu?
□ Process nào chạy flow đó?
□ Ai trigger?
□ Input là gì?
□ Các bước xử lý chính là gì?
□ Business rules nằm ở đâu?
□ Decision points là gì?
□ Data được đọc ở đâu?
□ Data được ghi ở đâu?
□ Transaction boundary ở đâu?
□ Cache có tham gia không? Cache thuộc process hay Redis?
□ Message / job nào được publish hoặc consume?
□ External service nào được gọi?
□ Authentication / Authorization ở đâu?
□ Exception được xử lý thế nào?
□ Retry / timeout / fallback thế nào?
□ Concurrency trên event loop thế nào?
□ Nhiều instance có chạy trùng job không?
□ Idempotency thế nào?
□ Output là gì?
□ Source evidence nằm ở đâu?
□ Những điểm nào vẫn Unknown?
```

Nếu chưa trả lời được một mục, không tự điền bằng giả định; đánh dấu `Unknown` và tiếp tục trace source liên quan.
