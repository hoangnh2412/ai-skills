# authentication-dotnet

Skill tích hợp **Jarvis.Authentication** — JWT, API Key, HTTP Basic, Cognito.

Agent đọc [SKILL.md](./SKILL.md).

## PackageId

Folder repo: `Jarvis.Authentication.*` → NuGet: **`Jarvis.Authentications.*`** (có **s**). Namespace: `Jarvis.Authentication.*` (không s).

## Khi nào dùng

| Tình huống | Workflow / Provider |
|------------|---------------------|
| Bật authentication lần đầu | [workflows/init.md](./workflows/init.md) |
| Thêm scheme / đổi provider | [workflows/add.md](./workflows/add.md) |
| Swagger Authorize | [swashbuckle-dotnet](../swashbuckle-dotnet/providers/jwt-security/SKILL.md) |

## Cách gọi

```text
@ai-skills/jarvis/skills/authentication-dotnet/providers/api-key/SKILL.md

Thêm API Key cho MyApp.Host — header X-API-KEY, đọc key từ config.
```

## Entry point

```csharp
builder.Services.AddJarvisAuthentication(configuration, auth =>
{
    auth.AddJarvisCompositeScheme(includeBasic: true);   // khi ≥ 2 scheme
    auth.AddCoreJwtBearer(configuration, "Bearer");
    auth.AddCoreApiKey<ConfigApiKeyProvider>(configuration);
    auth.AddCoreBasic<ConfigBasicCredentialProvider>(configuration);
});
```

## Providers

| Scheme | SKILL |
|--------|-------|
| JWT | [providers/jwt/SKILL.md](./providers/jwt/SKILL.md) |
| API Key | [providers/api-key/SKILL.md](./providers/api-key/SKILL.md) |
| HTTP Basic | [providers/basic/SKILL.md](./providers/basic/SKILL.md) |
| Cognito | [providers/cognito/SKILL.md](./providers/cognito/SKILL.md) |

## Pipeline

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

Trước `MapControllers`.

## Liên quan

- [swashbuckle-dotnet](../swashbuckle-dotnet/README.md)
- [jarvis-dotnet](../jarvis-dotnet/README.md)
