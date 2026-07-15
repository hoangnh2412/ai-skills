---
name: authentication-dotnet-cognito
description: Tích hợp Jarvis AWS Cognito qua Jarvis.Authentications.Cognito — CognitoClient và IAuthenticationService. Dùng khi auth qua user pool Cognito.
dependencies:
  - Jarvis.Authentications.Cognito
---

# AWS Cognito

## Package / ProjectReference

```xml
<PackageReference Include="Jarvis.Authentications.Cognito" Version="1.0.1" />
```

Hoặc ProjectReference `Jarvis.Authentication.Cognito` (monorepo).

## Cấu hình

Section `Authentication:Cognito` — pool id, region, client id theo implementation Jarvis.

```json
{
  "Authentication": {
    "Type": "Cognito",
    "Cognito": { }
  }
}
```

## Sử dụng

- Đăng ký **trong callback** `AddJarvisAuthentication` như các scheme khác (không gọi `AddAuthentication()` trực tiếp).
- `CognitoClient` / `IAuthenticationService` theo package.
- Chi tiết extension Cognito xem source `Jarvis.Authentication.Cognito` (chưa cover đầy đủ trong skill này).

## Secrets

AWS credentials / client secret — IAM role trên host hoặc env, không commit.

## Validate

- Login / token exchange flow theo app
- Protected API với token Cognito hợp lệ
