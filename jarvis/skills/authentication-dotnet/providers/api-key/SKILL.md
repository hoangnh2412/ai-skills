---
name: authentication-dotnet-api-key
description: Đăng ký Jarvis API Key AddCoreApiKey trong callback AddJarvisAuthentication — mặc định ConfigApiKeyProvider đọc config, hoặc custom IApiKeyProvider cho DB. Dùng khi client gửi key qua header X-API-KEY.
dependencies:
  - Jarvis.Authentications.ApiKey
---

# API Key

## Package

```xml
<PackageReference Include="Jarvis.Authentications.ApiKey" Version="1.0.1" />
```

## Program.cs

Đăng ký **trong callback** `AddJarvisAuthentication`. Provider truyền qua generic — mặc định `ConfigApiKeyProvider` (đọc config):

```csharp
using Jarvis.Authentication;          // AddJarvisAuthentication
using Jarvis.Authentication.ApiKey;   // AddCoreApiKey, ConfigApiKeyProvider

builder.Services.AddJarvisAuthentication(builder.Configuration, auth =>
{
    auth.AddCoreApiKey<ConfigApiKeyProvider>(builder.Configuration);
});
```

Scheme mặc định `"Default"` (`JarvisAuthenticationSchemes.ApiKey`) — trùng section `Authentication:ApiKey:Default`.

## Custom provider (DB / Redis / vault)

```csharp
auth.AddCoreApiKey<MyDbApiKeyProvider>(builder.Configuration);
```

- Implement `AspNetCore.Authentication.ApiKey.IApiKeyProvider` (`ProvideAsync(string key)`).
- **Đăng ký Singleton** (tự động qua `AddCoreApiKey`) — **không** cần `AddScoped`. Tra DB → `IDbContextFactory` / `IServiceScopeFactory`.
- `ConfigApiKeyProvider` bắt buộc `Key` trong config; custom provider chỉ bắt buộc `KeyName` (cờ `RequireConfigKey` tự set theo type, tách **theo từng realm**).

## Multi-realm

Một scheme, nhiều realm qua prefix `realm:secret` trong header; không prefix → realm `Default`.

```
X-API-KEY: my-secret                 → realm Default
X-API-KEY: Integration:partner-key   → realm Integration
```

## appsettings.json

Mỗi realm là một section con — `KeyName` (tên header) + `Key` (secret):

```json
{
  "Authentication": {
    "ApiKey": {
      "Default":     { "KeyName": "X-API-KEY", "Key": "" },
      "Integration": { "KeyName": "X-API-KEY", "Key": "" }
    }
  }
}
```

`Key` — env / secret store, không commit. (Không phải `Keys: []`.)

## Swagger

[swashbuckle-dotnet/providers/api-key-security](../../../swashbuckle-dotnet/providers/api-key-security/SKILL.md).

## Validate

- Request thiếu/sai header → 401
- Key hợp lệ (realm Default) → 200
- `Integration:secret` khớp realm Integration → 200
