# minipower-backend-swashbuckle-dotnet

Skill tích hợp **Jarvis.Swashbuckle** — Swagger đa version, security schemes. Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Chưa có Swagger Jarvis | [workflows/init.md](./workflows/init.md) |
| Thêm v2, JWT, API Key UI | [workflows/add.md](./workflows/add.md) |

Scaffold `minipower-backend-scaffold-dotnet` đã gọi `AddCoreSwagger` / `UseCoreSwagger` trong Host — dùng skill khi đổi config hoặc project chưa có Jarvis.

## Cách gọi

```text
@.opencode/skills/minipower-backend-swashbuckle-dotnet/workflows/init.md

Bật Swagger Jarvis cho MyApp.Host, versions v1.
```

```text
@.opencode/skills/minipower-backend-swashbuckle-dotnet/providers/jwt-security/SKILL.md

Thêm JWT vào Swagger SecuritySchemes.
```

## Bootstrap tối thiểu

```csharp
builder.AddCoreSwagger();
var app = builder.Build();
app.UseCoreSwagger();
```

API versioning (host):

```csharp
builder.Services.AddApiVersioning(/* … */).AddApiExplorer(/* … */);
```

## Liên quan

- [minipower-backend-scaffold-dotnet/README.md](../minipower-backend-scaffold-dotnet/README.md) — scaffold Host
- [minipower-backend-authentication-dotnet](../minipower-backend-authentication-dotnet/README.md) — JWT/API Key runtime
