---
name: blobstoring-dotnet-filesystem
description: FileSystem built-in Jarvis.BlobStoring — AddCoreBlobStoring tự UseFileSystem. Dùng khi lưu file trên disk local hoặc volume mount.
dependencies:
  - Jarvis.BlobStoring
---

# FileSystem provider

Nằm **trong** `Jarvis.BlobStoring` — không có package FileSystem riêng. `AddCoreBlobStoring()` đã gọi `UseFileSystem()`.

Path vật lý: `{RootPath}/{SubPath}/{bucket}/{fileName}`.

## appsettings

```json
{
  "BlobStoring": {
    "FileSystem": {
      "RootPath": "/var/app/storage",
      "SubPath": "uploads",
      "AutoSelectPriority": 10
    }
  }
}
```

## Registration

```csharp
using Jarvis.BlobStoring;
using Jarvis.BlobStoring.Extensions;

builder.AddCoreBlobStoring(o => o.DefaultProvider = nameof(BlobStoringType.FileSystem))
    .UseFileSystem(fs =>
    {
        fs.RootPath = @"D:\uploads";
        fs.SubPath = "tenant-1";
    });
```

**Không** `AddKeyedSingleton<IBlobStoringService, FileSystemService>`.

## Inject

```csharp
public sealed class LocalFileService(IBlobStoringService storage)
{
    public Task UploadAsync(string path, byte[] data, CancellationToken ct = default)
        => storage.UploadAsync(bucket: "documents", fileName: path, data);
}
```

## Lưu ý

- `ViewAsync` trả chuỗi rỗng — không presigned URL.
- Đảm bảo process có quyền ghi `RootPath` (container: mount volume).

## Validate

- Upload + download cùng `bucket` + `fileName`
- Path traversal: không cho `fileName` chứa `..` ở tầng application
