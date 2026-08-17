# Workflow: Khởi tạo Jarvis Blob Storing

Áp dụng khi project **chưa** gọi `AddCoreBlobStoring()`.

## Checklist

```text
- [ ] 1. Package Jarvis.BlobStoring (+ MinIO / AwsS3 nếu cần)
- [ ] 2. builder.AddCoreBlobStoring()
- [ ] 3. appsettings section BlobStoring
- [ ] 4. Inject IBlobStoringService
- [ ] 5. Validate upload/download
```

## Bước 1 — Packages

```xml
<PackageReference Include="Jarvis.BlobStoring" Version="1.0.0" />
<PackageReference Include="Jarvis.BlobStoring.MinIO" Version="1.0.0" />
<PackageReference Include="Jarvis.BlobStoring.AwsS3" Version="1.0.0" />
```

FileSystem **không** cần package riêng.

## Bước 2 — Extension

[templates/program-setup.cs](../templates/program-setup.cs):

```csharp
builder.AddCoreBlobStoring();
```

Gọi trong `InfrastructureLayerExtension` hoặc `HostLayerExtension`.

## Bước 3 — appsettings

[templates/appsettings-blob.json](../templates/appsettings-blob.json)

## Bước 4 — Sử dụng

[templates/blob-service-usage.cs](../templates/blob-service-usage.cs)

## Bước 5 — Validate

- `dotnet build`
- Upload test file → `DownloadAsync` trả đúng bytes

## Sau init

Thêm MinIO / AwsS3 → [workflows/add.md](add.md).
