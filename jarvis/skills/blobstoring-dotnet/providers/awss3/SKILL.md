---
name: blobstoring-dotnet-awss3
description: Đăng ký Jarvis BlobStoring AwsS3 — UseAwsS3 sau AddCoreBlobStoring. Dùng khi lưu file trên Amazon S3.
dependencies:
  - Jarvis.BlobStoring
  - Jarvis.BlobStoring.AwsS3
---

# AwsS3 provider

Package `Jarvis.BlobStoring.AwsS3` — đã implement (không còn stub).

## appsettings

```json
{
  "BlobStoring": {
    "DefaultProvider": "AwsS3",
    "AwsS3": {
      "Region": "ap-southeast-1",
      "BucketName": "my-bucket",
      "AccessKey": "",
      "SecretKey": "",
      "AutoSelectPriority": 20
    }
  }
}
```

Credential: env / IAM role — không commit.

## Registration

```csharp
using Jarvis.BlobStoring;
using Jarvis.BlobStoring.AwsS3.Extensions;
using Jarvis.BlobStoring.Extensions;

builder.AddCoreBlobStoring(o => o.DefaultProvider = nameof(BlobStoringType.AwsS3))
    .UseAwsS3();
```

## Validate

- Upload + download cùng bucket/key
- Region + bucket khớp tài khoản
