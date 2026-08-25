# minipower-backend-scaffold-dotnet

Skill điều phối **scaffold solution .NET 9 phân lớp** và **cài đặt Jarvis framework** trên ASP.NET Core. Agent đọc [SKILL.md](./SKILL.md) và workflow tương ứng khi thực thi.

Hub tất cả skill: [.opencode/README.md](../../README.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Folder trống → backend mới, F5 Swagger | [workflows/scaffold.md](./workflows/scaffold.md) |
| Solution .NET có sẵn → gắn Jarvis theo layer | [workflows/init.md](./workflows/init.md) |
| Đã có Jarvis foundation → thêm module (JWT, Redis cache, …) | [workflows/add.md](./workflows/add.md) |

**Không dùng skill này cho:**

- Chỉ review code trước PR → dùng [minipower-backend-review-dotnet](../minipower-backend-review-dotnet/README.md)
- Chỉ healthcheck readiness provider → dùng [minipower-backend-healthcheck-dotnet](../minipower-backend-healthcheck-dotnet/README.md)
- Chỉ OTEL plug-in / sampling production → dùng [minipower-backend-telemetry-dotnet](../minipower-backend-telemetry-dotnet/README.md)

## Cách gọi skill

Trong OpenCode / Cursor agent chat:

### 1. Tham chiếu workflow (khuyến nghị)

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/scaffold.md

Scaffold backend .NET 9:
- Product: Acme
- product: acme
- Jarvis: NuGet feed nội bộ
```

### 2. Tham chiếu orchestrator

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/SKILL.md

Dùng skill minipower-backend-scaffold-dotnet init — gắn Jarvis vào solution MyApp có sẵn.
```

### 3. Thêm module cụ thể

```text
@.opencode/skills/minipower-backend-authentication-dotnet/providers/jwt/SKILL.md

Thêm JWT vào MyApp.Host.
```

Agent sẽ đọc [SKILL.md](./SKILL.md) và **chỉ** mở file module/workflow cần thiết — không load toàn bộ skill tree.

## Chuẩn bị trước khi chạy

| Việc nên làm | Scaffold | Init / Add |
|--------------|----------|------------|
| Xác định `{Product}` (PascalCase) và `{product}` (kebab) | Bắt buộc | Khuyến nghị |
| Chọn **NuGet feed** hoặc **monorepo** `{JarvisRoot}` | Bắt buộc | Bắt buộc |
| Folder trống hoặc repo mới | Scaffold | — |
| Solution + project Host/Application/Infrastructure đã có | — | Init |
| `dotnet` SDK 9.x cài sẵn | Có | Có |

**Lưu ý develop:** `Jarvis.EntityFramework` yêu cầu `AddJarvisCaching()` **trước** `AddEntityFramework()`. Template scaffold đã wiring đúng thứ tự; khi init/add EF thủ công phải tuân thủ.

**PackageId:** folder repo `Jarvis.Authentication.*` → NuGet **`Jarvis.Authentications.*`** (có chữ **s**).

## Prompt mẫu

### Scaffold từ folder trống (thường dùng nhất)

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/scaffold.md

Scaffold backend .NET 9:
- Product: Acme
- product: acme
- Jarvis: NuGet feed nội bộ
- Mặc định: Swagger + OTEL + health live + ping; chưa bật PostgreSQL readiness

Sau khi xong: dotnet build và báo URL Swagger.
```

### Init — gắn Jarvis vào solution có sẵn

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/init.md

Cài Jarvis vào solution MyApp:
- Host: Jarvis.Mvc, Swashbuckle, HealthChecks, OpenTelemetry
- Application: Jarvis.DDD.Application
- Infrastructure: Jarvis.EntityFramework + Jarvis.Caching
```

### Add — thêm module

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/add.md

Thêm xác thực JWT vào MyApp.Host theo minipower-backend-authentication-dotnet/providers/jwt/SKILL.md
```

```text
@.opencode/skills/minipower-backend-entityframework-dotnet/patterns/single-db/SKILL.md

Cấu hình EF multitenancy single DB cho MyApp.
```

```text
@.opencode/skills/minipower-backend-caching-dotnet/workflows/add.md

Bật Redis distributed cache + memory invalidation cho MyApp.Host
```

### Background worker + OTEL

```text
@.opencode/skills/minipower-backend-telemetry-dotnet/SKILL.md

Thêm HostedService cron kế thừa BaseWorker; job EF multitenancy theo minipower-backend-entityframework-dotnet/README.md
```

## Agent sẽ làm gì

Theo workflow đã chọn:

1. **Scaffold** — tạo repo `{product}-backend`, 5 project + 2 test, layer extensions, copy [templates/layers/](./templates/layers/), cài package Jarvis, `dotnet build`
2. **Init** — thêm package theo layer, tạo `*LayerExtension.cs`, cập nhật `Program.cs` (`AddHostLayer` / `UseHostLayer`)
3. **Add** — [templates/SKILLS.md](./templates/SKILLS.md) + skill `*-dotnet`, thêm package + DI + appsettings

**Output bắt buộc (scaffold):**

- Solution 5 project + 2 test projects
- `*LayerExtension.cs` mỗi layer
- `Program.cs` mỏng (chỉ `AddHostLayer()` / `UseHostLayer()`)
- `appsettings` + `launchSettings`
- `dotnet build` thành công

Chi tiết cấu trúc: [reference/solution-structure.md](./reference/solution-structure.md).

## Kết quả sau scaffold

| Kiểm tra | Kỳ vọng |
|----------|---------|
| Startup project | `{Product}.Host` |
| Swagger | `https://localhost:7006/swagger` (port theo `launchSettings.json`) |
| `GET /api/ping` | 200 — không cần DB |
| `GET /health/live` | 200 |
| `GET /health/ready` | 200 nếu PostgreSQL + readiness đã cấu hình; có thể unhealthy nếu chưa có DB |
| `Program.cs` | Vài dòng — logic trong layer extensions |

```bash
dotnet run --project src/{Product}.Host
```

## Modules Jarvis (skill độc lập)

Chỉ mở skill cần dùng — [workflows/add.md](./workflows/add.md):

| Module | Skill | Ghi chú |
|--------|-------|---------|
| Foundation | [minipower-backend-foundation-dotnet](../minipower-backend-foundation-dotnet/README.md) | Json, CORS, WebApi, middleware |
| Application | [minipower-backend-application-dotnet](../minipower-backend-application-dotnet/README.md) | CQRS dispatcher |
| Authentication | [minipower-backend-authentication-dotnet](../minipower-backend-authentication-dotnet/README.md) | JWT, API Key, Cognito |
| Notification | [minipower-backend-notification-dotnet](../minipower-backend-notification-dotnet/README.md) | SMTP Mailkit |
| Entity Framework | [minipower-backend-entityframework-dotnet](../minipower-backend-entityframework-dotnet/README.md) | **Caching trước EF** |
| Caching | [minipower-backend-caching-dotnet](../minipower-backend-caching-dotnet/README.md) | |
| Blob storing | [minipower-backend-blobstoring-dotnet](../minipower-backend-blobstoring-dotnet/README.md) | |
| Swashbuckle | [minipower-backend-swashbuckle-dotnet](../minipower-backend-swashbuckle-dotnet/README.md) | |
| OpenTelemetry | [minipower-backend-telemetry-dotnet](../minipower-backend-telemetry-dotnet/README.md) | |
| Health checks | [minipower-backend-healthcheck-dotnet](../minipower-backend-healthcheck-dotnet/README.md) | |

## Catalog package (NuGet, develop)

| PackageId | Version | Layer |
|-----------|---------|-------|
| `Jarvis.DDD.Domain.Shared` | 1.0.0 | Domain.Shared |
| `Jarvis.DDD.Domain` | 1.1.1 | Host |
| `Jarvis.DDD.Application` | 1.2.1 | Application |
| `Jarvis.DDD.Application.Contracts` | 1.2.1 | Application |
| `Jarvis.EntityFramework` | 1.0.0 | Infrastructure |
| `Jarvis.Caching` | 1.1.0 | Infrastructure |
| `Jarvis.Caching.Redis` | 1.1.0 | Infrastructure (tùy chọn) |
| `Jarvis.Mvc` | 1.1.0 | Host |
| `Jarvis.Swashbuckle` | 1.0.1 | Host |
| `Jarvis.HealthChecks` | 1.0.0 | Host |
| `Jarvis.OpenTelemetry` | 1.0.1 | Host |
| `Jarvis.Authentications.*` | 1.0.1 | Host |

## Sau khi chạy skill

1. **`dotnet build`** — xác nhận không lỗi compile
2. **`dotnet run --project src/{Product}.Host`** — Swagger + ping
3. Thêm entity/handler theo layer Clean Architecture
4. Readiness DB / Redis → [minipower-backend-healthcheck-dotnet](../minipower-backend-healthcheck-dotnet/README.md)
5. OTEL production (sampling, PII) → [minipower-backend-telemetry-dotnet](../minipower-backend-telemetry-dotnet/README.md)
6. Trước PR → skill [minipower-backend-review-dotnet](../minipower-backend-review-dotnet/README.md)

## Tài liệu liên quan

| File | Nội dung |
|------|----------|
| [SKILL.md](./SKILL.md) | Orchestrator đầy đủ cho agent |
| [reference/solution-structure.md](./reference/solution-structure.md) | Cây thư mục, DI, mapping layer |
| [templates/](./templates/) | Code mẫu scaffold |
| [minipower-backend-entityframework-dotnet/README.md](../minipower-backend-entityframework-dotnet/README.md) | EF multitenancy |
| [minipower-backend-caching-dotnet/README.md](../minipower-backend-caching-dotnet/README.md) | Cache |
| [minipower-backend-swashbuckle-dotnet/README.md](../minipower-backend-swashbuckle-dotnet/README.md) | Swagger |
| [minipower-backend-blobstoring-dotnet/README.md](../minipower-backend-blobstoring-dotnet/README.md) | Blob FileSystem / MinIO |
| [minipower-backend-telemetry-dotnet/README.md](../minipower-backend-telemetry-dotnet/README.md) | OpenTelemetry — kiến trúc & workflow |
| [minipower-backend-healthcheck-dotnet/README.md](../minipower-backend-healthcheck-dotnet/README.md) | Health endpoints & providers |
| [minipower-backend-review-dotnet/README.md](../minipower-backend-review-dotnet/README.md) | Review PR |
| [.opencode/README.md](../../README.md) | Hub tất cả skill |
| [README.md](../../../README.md) | Giới thiệu Jarvis framework |

## Lưu ý

- Skill ưu tiên **scaffold chạy được ngay** (Swagger, ping, liveness) — DB readiness có thể bật sau
- **Không** thêm package không dùng — giảm dependency surface
- Monorepo: thay `PackageReference` bằng `ProjectReference` tới `{JarvisRoot}/frameworks/...` (Mvc, Domain, DDD.Application, …) — xem [templates/layer-csproj/](./templates/layer-csproj/) và [templates/csproj-references.xml](./templates/csproj-references.xml)
- Phiên bản package lấy từ csproj repo Jarvis branch `develop`; cập nhật khi release mới
