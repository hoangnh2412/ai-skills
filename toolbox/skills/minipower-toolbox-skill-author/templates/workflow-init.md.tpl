# Workflow: Khởi tạo {Module}

Áp dụng khi project **chưa** có `{bootstrap-method}()`.

## Checklist

```text
- [ ] 1. Phân tích layer (Host / Infrastructure)
- [ ] 2. Thêm package
- [ ] 3. Đăng ký DI — đúng thứ tự phụ thuộc
- [ ] 4. Config section
- [ ] 5. Validate
```

## Bước 1 — Package

```xml
<PackageReference Include="{Package}" Version="{x.x.x}" />
```

## Bước 2 — Registration

Dùng [templates/{file}](../templates/{file}):

```csharp
// snippet
```

## Bước 3 — Config

[templates/{appsettings-file}](../templates/{appsettings-file})

## Bước 4 — Validate

- `dotnet build` xanh
- {kiểm chứng chạy được: endpoint, probe, log}

## Sau init

Cần thêm biến thể → [workflows/add.md](add.md).
