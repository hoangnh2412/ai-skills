# Workflow: Thêm scheme authentication

Áp dụng khi **đã có** một scheme và cần thêm scheme thứ hai, hoặc đổi provider.

## Checklist

```text
- [ ] 1. Đọc provider mới (jwt | api-key | basic | cognito)
- [ ] 2. Thêm package Jarvis.Authentications.* nếu chưa có
- [ ] 3. Thêm AddCore* vào callback AddJarvisAuthentication hiện có
- [ ] 4. Bật Composite: auth.AddJarvisCompositeScheme(includeBasic: ...) + DefaultAuthenticateScheme = "Composite"
- [ ] 5. Cập nhật Swagger SecuritySchemes nếu cần
- [ ] 6. Controller [Authorize] (Composite) hoặc [Authorize(AuthenticationSchemes = "...")] theo scheme cụ thể
```

## Multi-scheme + Composite

Khi có ≥ 2 scheme, thêm `AddJarvisCompositeScheme` — một policy scheme forward theo header:

```csharp
auth.AddJarvisCompositeScheme(includeBasic: true);   // ưu tiên X-API-KEY → Basic → Bearer
```

Ưu tiên: header **API key** → **Basic** (nếu `includeBasic`) → **Bearer**.
Đặt `Authentication:DefaultAuthenticateScheme = "Composite"`. Endpoint dùng `[Authorize]` sẽ chấp nhận
mọi scheme đang bật. `bearerScheme` mặc định `"Bearer"` — truyền tên khác nếu JWT đăng ký dưới scheme riêng.

Dùng hằng `JarvisAuthenticationSchemes` (`Composite` / `ApiKey` = `"Default"` / `Basic` / `Bearer`) thay vì hard-code string.

## Khoá endpoint theo scheme

```csharp
[Authorize(AuthenticationSchemes = JarvisAuthenticationSchemes.ApiKey)]  // chỉ API Key
```

⚠️ Scheme phải **đã đăng ký**, nếu không → lỗi "No authentication handler for scheme".

## Provider tùy chỉnh

- API Key: [providers/api-key/SKILL.md](../providers/api-key/SKILL.md) — `IApiKeyProvider` (Singleton).
- Basic: [providers/basic/SKILL.md](../providers/basic/SKILL.md) — `IBasicCredentialProvider` (Singleton).
- JWT revoke: `IJwtTokenAccessChecker` — [providers/jwt/SKILL.md](../providers/jwt/SKILL.md).
- Cognito: [providers/cognito/SKILL.md](../providers/cognito/SKILL.md).
