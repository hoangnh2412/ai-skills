---
name: authentication-dotnet-jwt
description: Đăng ký Jarvis JWT Bearer AddCoreJwtBearer trong callback AddJarvisAuthentication, section Authentication:Jwt:{scheme}. Dùng khi API cần xác thực Bearer token (OIDC hoặc symmetric key).
dependencies:
  - Jarvis.Authentications.Jwt
---

# JWT Bearer

## Package

```xml
<PackageReference Include="Jarvis.Authentications.Jwt" Version="1.0.1" />
```

## Program.cs

Đăng ký **trong callback** của `AddJarvisAuthentication` (không gọi `AddAuthentication()` trực tiếp):

```csharp
using Jarvis.Authentication;          // AddJarvisAuthentication
using Jarvis.Authentication.Jwt;      // AddCoreJwtBearer
using Microsoft.AspNetCore.Authentication.JwtBearer;

builder.Services.AddJarvisAuthentication(builder.Configuration, auth =>
{
    auth.AddCoreJwtBearer(builder.Configuration, JwtBearerDefaults.AuthenticationScheme);
});
```

Scheme mặc định `"Bearer"`. Bind từ `Authentication:Jwt:{scheme}`.

## Hai chế độ validate

| Chế độ | Điều kiện | Dùng cho |
|--------|-----------|----------|
| **OIDC metadata** | có `Authority` | OpenIddict, Cognito, Azure AD — validate qua issuer metadata |
| **Symmetric key** | không `Authority`, có `IssuerSigningKeys` | dev/test |

Validator startup yêu cầu **`Authority` HOẶC `IssuerSigningKeys`** (khi `ValidateIssuerSigningKey`). `ClockSkew = 0`.
`MaxExpireMinutes > 0` → giới hạn lifetime token theo policy.

## Revoke / blacklist — IJwtTokenAccessChecker

Mặc định `AllowAllJwtTokenAccessChecker` (cho tất cả). Override để chặn token bị thu hồi:

```csharp
auth.AddCoreJwtBearer<RedisJwtRevocationChecker>(builder.Configuration, "Bearer");
```

Checker đăng ký **Singleton**, gọi trong `OnTokenValidated` sau khi chữ ký + lifetime OK.
Tra DB → dùng `IDbContextFactory` / `IServiceScopeFactory` (không inject scoped `DbContext`).

## appsettings.json

```json
{
  "Authentication": {
    "Jwt": {
      "Bearer": {
        "Authority": "",
        "Audience": "",
        "IssuerSigningKeys": [],
        "ValidateAudience": true,
        "ValidateIssuer": false,
        "MaxExpireMinutes": 0
      }
    }
  }
}
```

Signing key / secret — env / secret store, không commit.

## Swagger

[swashbuckle-dotnet/providers/jwt-security](../../../swashbuckle-dotnet/providers/jwt-security/SKILL.md) — `SecuritySchemes: ["JWT"]`.

## Validate

- Endpoint `[Authorize]` → 401 khi thiếu token
- Token symmetric hợp lệ → 200
- (nếu có checker) token bị revoke → 401 dù chữ ký đúng
