---
name: blobstoring-dotnet-minio
description: Đăng ký Jarvis BlobStoring MinIO — UseMinIO sau AddCoreBlobStoring. Dùng khi lưu file S3-compatible object storage.
dependencies:
  - Jarvis.BlobStoring
  - Jarvis.BlobStoring.MinIO
---

# MinIO provider

S3-compatible; bucket = tên bucket MinIO, `fileName` = object key.

## appsettings

```json
{
  "BlobStoring": {
    "DefaultProvider": "MinIO",
    "MinIO": {
      "Endpoint": "localhost:9000",
      "AccessKey": "minioadmin",
      "SecretKey": "minioadmin",
      "UseSsl": false,
      "AutoSelectPriority": 30
    }
  }
}
```

Production: secret qua env / vault — không commit file.

## Registration

```csharp
using Jarvis.BlobStoring;
using Jarvis.BlobStoring.Extensions;
using Jarvis.BlobStoring.MinIO.Extensions;

builder.AddCoreBlobStoring(o => o.DefaultProvider = nameof(BlobStoringType.MinIO))
    .UseMinIO(minio =>
    {
        minio.Endpoint = "localhost:9000";
        minio.AccessKey = "minioadmin";
        minio.SecretKey = "minioadmin";
    });
```

## Inject

```csharp
public sealed class DocumentService(
    [FromKeyedServices("MinIO")] IBlobStoringService blobStorage)
{
    public async Task<string?> GetPresignedViewUrlAsync(string objectKey, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        return await blobStorage.ViewAsync(bucket: "documents", fileName: objectKey, expireTime: 1800);
    }
}
```

## Lưu ý

- Bucket phải tồn tại (hoặc tạo qua MinIO console / policy auto-create).
- `ViewAsync` — presigned URL (expire seconds).

## Validate

- `UploadAsync` → `DownloadAsync` bytes khớp
- Endpoint reachable từ pod/container network
