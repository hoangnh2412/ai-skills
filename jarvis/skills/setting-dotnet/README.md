# setting-dotnet

Skill module **Jarvis.Modules.Setting** — Group/Key, Manager, HTTP. Agent đọc [SKILL.md](./SKILL.md).

## Cách gọi

```text
@.opencode/skills/setting-dotnet/workflows/init.md

Init Setting + EF + HTTP API cho MyApp.Host.
```

## Entry (khớp Sample)

```csharp
builder.AddCoreSetting()
    .UseEntityFramework<IMasterUnitOfWork, CurrentTenantInfo>()
    .UseHttpApi()
    .AddProvider<EmailSettingDefinition>();
```

## Liên quan

- [multitenancy-dotnet](../multitenancy-dotnet/README.md) — tenant + UoW
- [caching-dotnet](../caching-dotnet/README.md)
- [notifications-module-dotnet](../notifications-module-dotnet/README.md) — inbox khai báo setting qua `AddProvider`
