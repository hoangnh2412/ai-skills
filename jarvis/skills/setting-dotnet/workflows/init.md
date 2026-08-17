# Workflow: Khởi tạo Setting

Áp dụng khi Host **chưa** có `AddCoreSetting()`.

## Checklist

```text
- [ ] 1. AddJarvisCaching + AddCurrentTenant (prereq)
- [ ] 2. Package Setting + EF + API
- [ ] 3. AddCoreSetting().UseEntityFramework<,>().UseHttpApi().AddProvider<>
- [ ] 4. Cache:Items:Setting + Encryption
- [ ] 5. dotnet build
```

## Packages

```xml
<PackageReference Include="Jarvis.Modules.Setting" Version="1.0.0" />
<PackageReference Include="Jarvis.Modules.Setting.EntityFramework" Version="1.0.0" />
<PackageReference Include="Jarvis.Modules.Setting.API" Version="1.0.0" />
```

## Registration

[templates/program-setup.cs](../templates/program-setup.cs)

## Anti-patterns

- Gọi Setting trước caching / trước `AddCurrentTenant`
- Dạy package Abstractions (chưa có code)
- Bật Authorize mặc định trong module — Host tự quyết
