# Workflow: Khởi tạo Jarvis foundation

Áp dụng khi Host **chưa** có `AddCoreJson` / `Jarvis.Mvc`.

## Checklist

```text
- [ ] 1. Package Jarvis.DDD.Domain.Shared, Jarvis.DDD.Domain, Jarvis.Mvc trên Host
- [ ] 2. AddCoreJson → AddCoreCors → AddCoreDomain → AddCoreWebApi
- [ ] 3. appsettings Json, Cors, Middlewares
- [ ] 4. UseCoreCors → UseCoreMiddleware<ApiResponseWrapperMiddleware> → MapControllers
- [ ] 5. dotnet build + gọi API /api/*
```

## Bước 1 — Packages

```xml
<PackageReference Include="Jarvis.DDD.Domain.Shared" Version="1.0.0" />
<PackageReference Include="Jarvis.DDD.Domain" Version="1.1.1" />
<PackageReference Include="Jarvis.Mvc" Version="1.1.0" />
```

## Bước 2 — Program.cs

[templates/program-setup.cs](../templates/program-setup.cs)

## Bước 3 — appsettings

[templates/appsettings-foundation.json](../templates/appsettings-foundation.json)

## Bước 4 — Validate

- Controller trả JSON camelCase; null ignore nếu `Json:IgnoreNull`
- Path khớp `Middlewares:ApiResponseWrapper:Includes` bọc `BaseResponse`
- CORS preflight OK nếu đã cấu hình `Cors`

## Sau init

- Swagger: [minipower-backend-swashbuckle-dotnet](../../minipower-backend-swashbuckle-dotnet/workflows/init.md)
- OTEL: [minipower-backend-telemetry-dotnet](../../minipower-backend-telemetry-dotnet/workflows/init.md)
