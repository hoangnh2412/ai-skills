# Scaffold → skill `*-dotnet`

Template scaffold **đã wire tối thiểu** (F5 Swagger). **Không** nhân đôi hướng dẫn module — mở skill độc lập khi init/add/bổ sung.

Hub: [.opencode/README.md](../../../README.md) (repo Jarvis gốc).

## Đã có trong template (chỉ chỉnh khi cần)

| Vùng code | Skill | File template |
|-----------|-------|----------------|
| `AddCoreJson` / CORS / WebApi / wrapper | *(scaffold sở hữu — chỉnh `Cors` / `Json` / `Middlewares` trong `appsettings`)* | [layers/HostLayerExtension.cs](layers/HostLayerExtension.cs) |
| `AddCoreApplication` + chỗ đặt handler | [minipower-backend-architecture-dotnet](../../minipower-backend-architecture-dotnet/README.md) | [layers/ApplicationLayerExtension.cs](layers/ApplicationLayerExtension.cs) |
| Luật kiến trúc R1–R7 (`dotnet test`) | [minipower-backend-architecture-dotnet](../../minipower-backend-architecture-dotnet/README.md) | [architecture templates/ArchitectureTests/](../../minipower-backend-architecture-dotnet/templates/ArchitectureTests/) |
| `AddJarvisCaching` → `AddEntityFramework` → `AddCoreDbContext` | [minipower-backend-caching-dotnet](../../minipower-backend-caching-dotnet/README.md) · [minipower-backend-entityframework-dotnet](../../minipower-backend-entityframework-dotnet/README.md) | [layers/InfrastructureLayerExtension.cs](layers/InfrastructureLayerExtension.cs) |
| `AddJarvisOpenTelemetry` / enricher | [minipower-backend-telemetry-dotnet](../../minipower-backend-telemetry-dotnet/README.md) | HostLayerExtension, Enrich*Service.cs |
| `AddCoreSwagger` | [minipower-backend-swashbuckle-dotnet](../../minipower-backend-swashbuckle-dotnet/README.md) | HostLayerExtension |
| `AddHealthChecks` | [minipower-backend-healthcheck-dotnet](../../minipower-backend-healthcheck-dotnet/README.md) | HostLayerExtension |
| `.editorconfig` + `Directory.Build.props` (analyzer ép convention lúc build) | [minipower-backend-convention-dotnet](../../minipower-backend-convention-dotnet/README.md) | [convention templates/](../../minipower-backend-convention-dotnet/templates/) |

## Chưa wire — thêm qua skill

| Nhu cầu | Skill | Workflow |
|---------|-------|----------|
| Thêm tính năng mới xuyên 5 layer | [minipower-backend-architecture-dotnet](../../minipower-backend-architecture-dotnet/README.md) | `workflows/add-feature.md` |
| JWT / API Key / Cognito | [minipower-backend-authentication-dotnet](../../minipower-backend-authentication-dotnet/README.md) | `workflows/init.md` + `providers/*` |
| SMTP email | [minipower-backend-notification-dotnet](../../minipower-backend-notification-dotnet/README.md) | `providers/mailkit-smtp/SKILL.md` |
| Redis cache / invalidation | [minipower-backend-caching-dotnet](../../minipower-backend-caching-dotnet/README.md) | `workflows/add.md` |
| EF đổi pattern (single / dedicated / hybrid) | [minipower-backend-entityframework-dotnet](../../minipower-backend-entityframework-dotnet/README.md) | `patterns/*` |
| Blob FileSystem / MinIO | [minipower-backend-blobstoring-dotnet](../../minipower-backend-blobstoring-dotnet/README.md) | `workflows/init.md` |
| Swagger security scheme | [minipower-backend-swashbuckle-dotnet](../../minipower-backend-swashbuckle-dotnet/README.md) | `providers/jwt-security`, `api-key-security` |
| OTEL Redis / EF trace | [minipower-backend-telemetry-dotnet](../../minipower-backend-telemetry-dotnet/README.md) | `providers/redis`, `entityframework` |
| Observability pipeline OTEL → Grafana → alert | [minipower-backend-observability-dotnet](../../minipower-backend-observability-dotnet/README.md) | `workflows/setup.md` |
| Troubleshoot metric từ dashboard | [minipower-ops-metrics](../../../../ops/skills/minipower-ops-metrics/README.md) | `SKILL.md` |

## Prompt sau scaffold (copy)

```text
@.opencode/skills/minipower-backend-authentication-dotnet/providers/jwt/SKILL.md
Thêm JWT cho {Product}.Host
```

```text
@.opencode/skills/minipower-backend-caching-dotnet/workflows/add.md
Bật Redis distributed + memory invalidation cho {Product}.Host
```

```text
@.opencode/skills/minipower-backend-entityframework-dotnet/patterns/single-db/SKILL.md
Đổi EF sang single DB multitenancy cho {Product}
```

Orchestrator solution: [minipower-backend-scaffold-dotnet](../README.md) → `workflows/add.md`.
