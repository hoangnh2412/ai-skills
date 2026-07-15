# Workflow: Khởi tạo authentication Jarvis

Áp dụng khi Host **chưa** có `AddJarvisAuthentication()`.

## Checklist

```text
- [ ] 1. Chọn scheme (jwt | api-key | basic | cognito) — có thể ≥ 1
- [ ] 2. Đọc providers/<name>/SKILL.md tương ứng
- [ ] 3. Thêm package Jarvis.Authentications.* (core + satellite)
- [ ] 4. AddJarvisAuthentication(config, auth => { AddCore* ... }) — KHÔNG gọi AddAuthentication() trực tiếp
- [ ] 5. Nếu ≥ 2 scheme: auth.AddJarvisCompositeScheme() + DefaultAuthenticateScheme = "Composite"
- [ ] 6. appsettings section Authentication (Type, Schemes, per-scheme)
- [ ] 7. UseAuthentication → UseAuthorization (trước MapControllers)
- [ ] 8. Validate 401/200
```

## Bước 1 — Chọn scheme

| Nhu cầu | Provider |
|---------|----------|
| Bearer JWT | [providers/jwt/SKILL.md](../providers/jwt/SKILL.md) |
| Header API key | [providers/api-key/SKILL.md](../providers/api-key/SKILL.md) |
| HTTP Basic | [providers/basic/SKILL.md](../providers/basic/SKILL.md) |
| AWS Cognito | [providers/cognito/SKILL.md](../providers/cognito/SKILL.md) |

## Bước 2 — Entry point

Luôn `builder.Services.AddJarvisAuthentication(configuration, auth => { ... })`. Satellite `AddCore*`
đăng ký **trong callback**. Xem [templates/program-auth.cs](../templates/program-auth.cs).

## Bước 3 — appsettings

[templates/appsettings-authentication.json](../templates/appsettings-authentication.json).
`Authentication:Schemes:*:Enabled` là cờ toggle do **host** đọc (Sample) — bind vào core options nhưng core không tự bật.

## Bước 4 — Swagger (tùy chọn)

[swashbuckle-dotnet/providers/jwt-security](../../swashbuckle-dotnet/providers/jwt-security/SKILL.md) hoặc api-key-security.

## Anti-patterns

- Gọi `services.AddAuthentication()` trực tiếp thay vì `AddJarvisAuthentication`
- Quên `UseAuthorization` sau `UseAuthentication`
- Đăng ký provider API Key/Basic dạng `Scoped` (phải Singleton — dùng `IDbContextFactory`)
- Hard-code JWT secret / API key / password trong appsettings committed
