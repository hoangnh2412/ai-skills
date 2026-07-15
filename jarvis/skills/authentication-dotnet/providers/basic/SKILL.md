---
name: authentication-dotnet-basic
description: Đăng ký Jarvis HTTP Basic AddCoreBasic trong callback AddJarvisAuthentication — mặc định ConfigBasicCredentialProvider đọc config Users, hoặc custom IBasicCredentialProvider cho DB. Dùng khi client gửi Authorization Basic.
dependencies:
  - Jarvis.Authentications.Basic
---

# HTTP Basic

## Package

```xml
<PackageReference Include="Jarvis.Authentications.Basic" Version="1.0.1" />
```

## Program.cs

Đăng ký **trong callback** `AddJarvisAuthentication`. Provider truyền qua generic — mặc định `ConfigBasicCredentialProvider` (đọc config):

```csharp
using Jarvis.Authentication;         // AddJarvisAuthentication
using Jarvis.Authentication.Basic;   // AddCoreBasic, ConfigBasicCredentialProvider

builder.Services.AddJarvisAuthentication(builder.Configuration, auth =>
{
    auth.AddCoreBasic<ConfigBasicCredentialProvider>(builder.Configuration);
});
```

Scheme mặc định `"Basic"`. Handler `JarvisBasicAuthenticationHandler` giải mã `Authorization: Basic base64(user:pass)` rồi ủy xác thực cho provider. Challenge trả `WWW-Authenticate: Basic realm="..."`.

## Custom provider (DB có password hash)

```csharp
auth.AddCoreBasic<MyDbBasicCredentialProvider>(builder.Configuration);
```

- Implement `IBasicCredentialProvider.AuthenticateAsync(scheme, user, password, ct)` → `BasicValidationResult?` (null = fail).
- **Đăng ký Singleton** (tự động) — tra DB → `IDbContextFactory` / `IServiceScopeFactory`.

## appsettings.json

Section `Authentication:Basic:{realm}` — `Realm` (header challenge) + `Users` (dict user → Password, Roles):

```json
{
  "Authentication": {
    "Basic": {
      "Default": {
        "Realm": "Jarvis API",
        "Users": {
          "demo": { "Password": "", "Roles": [ "User" ] }
        }
      }
    }
  }
}
```

⚠️ `Password` plain-text trong config — **chỉ dev/test** hoặc service-to-service nội bộ.
Production dùng custom `IBasicCredentialProvider` với password đã hash. Password — env / secret store.

## Validate

- Thiếu / sai credential → 401 (+ header `WWW-Authenticate: Basic`)
- `Authorization: Basic base64(demo:pass)` hợp lệ → 200, claims gồm Name + Roles
