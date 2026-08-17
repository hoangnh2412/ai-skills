# Scaffold → skill `*-dotnet`

Template scaffold **đã wire tối thiểu** (F5 Swagger). **Không** nhân đôi hướng dẫn module — mở skill độc lập khi init/add/bổ sung.

Hub: [jarvis/README.md](../../../README.md) (SSOT = `ai-skills/jarvis/`).

## Đã có trong template (chỉ chỉnh khi cần)

| Vùng code | Skill | File template |
|-----------|-------|----------------|
| `AddCoreJson` / CORS / WebApi / wrapper / `AddCurrentUser` / `AddCurrentTenant` | [foundation-dotnet](../../foundation-dotnet/README.md) | [layers/HostLayerExtension.cs](layers/HostLayerExtension.cs) |
| `AddCoreApplication` | [application-dotnet](../../application-dotnet/README.md) | [layers/ApplicationLayerExtension.cs](layers/ApplicationLayerExtension.cs) |
| `AddJarvisCaching` → `AddCoreBlobStoring` → `AddEntityFramework` → `AddCoreDbContext<T>` | [caching-dotnet](../../caching-dotnet/README.md) · [blobstoring-dotnet](../../blobstoring-dotnet/README.md) · [multitenancy-dotnet](../../multitenancy-dotnet/README.md) | [layers/InfrastructureLayerExtension.cs](layers/InfrastructureLayerExtension.cs) |
| `AddJarvisOpenTelemetry` / OTEL.DDD | [telemetry-dotnet](../../telemetry-dotnet/README.md) | HostLayerExtension, Enrich*Service.cs |
| `AddCoreSwagger` | [swashbuckle-dotnet](../../swashbuckle-dotnet/README.md) | HostLayerExtension |
| `AddHealthChecks` | [healthcheck-dotnet](../../healthcheck-dotnet/README.md) | HostLayerExtension |

## Chưa wire — thêm qua skill

| Nhu cầu | Skill | Workflow |
|---------|-------|----------|
| JWT / API Key / Cognito | [authentication-dotnet](../../authentication-dotnet/README.md) | `workflows/init.md` + `providers/*` — **không** gọi `AddAuthentication()` trực tiếp |
| SMTP email | [notification-dotnet](../../notification-dotnet/README.md) | `providers/mailkit-smtp/SKILL.md` — **không** gộp inbox |
| Inbox in-app | [notifications-module-dotnet](../../notifications-module-dotnet/README.md) | `workflows/init.md` |
| Setting Group/Key | [setting-dotnet](../../setting-dotnet/README.md) | `workflows/init.md` |
| Realtime / SignalR | [realtime-dotnet](../../realtime-dotnet/README.md) | `workflows/init.md` |
| Redis cache / invalidation | [caching-dotnet](../../caching-dotnet/README.md) | `workflows/add.md` |
| Tenant + EF (single / dedicated / hybrid) | [multitenancy-dotnet](../../multitenancy-dotnet/README.md) | `patterns/*` |
| Blob MinIO / AwsS3 | [blobstoring-dotnet](../../blobstoring-dotnet/README.md) | `workflows/add.md` |
| Swagger security scheme | [swashbuckle-dotnet](../../swashbuckle-dotnet/README.md) | `providers/jwt-security`, `api-key-security` |
| OTEL Redis / EF trace | [telemetry-dotnet](../../telemetry-dotnet/README.md) | `providers/redis`, `entityframework` |
| Observability pipeline | [observability-dotnet](../../observability-dotnet/README.md) | `workflows/setup.md` |
| Troubleshoot metric | [troubleshooting-dotnet](../../troubleshooting-dotnet/README.md) | `SKILL.md` |

Dapper / Querying = mục (chưa skill riêng). `entityframework-dotnet` = [redirect](../../entityframework-dotnet/README.md).

## Prompt sau scaffold (copy)

```text
@.opencode/skills/authentication-dotnet/providers/jwt/SKILL.md
Thêm JWT cho {Product}.Host
```

```text
@.opencode/skills/multitenancy-dotnet/patterns/single-db/SKILL.md
Đổi EF sang single DB multitenancy cho {Product}
```

Orchestrator: [jarvis-dotnet](../README.md) → `workflows/add.md`.
