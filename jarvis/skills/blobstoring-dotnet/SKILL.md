---
name: blobstoring-dotnet
description: Thiết lập Jarvis.BlobStoring — AddCoreBlobStoring + UseFileSystem / UseMinIO / UseAwsS3, IBlobStoringService. Dùng khi tích hợp blob storage .NET, section BlobStoring.
metadata:
  audience: hoangnh
  workflow: github
---

# Jarvis.BlobStoring — Orchestrator

Skill điều phối `Jarvis.BlobStoring` (FileSystem built-in), `Jarvis.BlobStoring.MinIO`, `Jarvis.BlobStoring.AwsS3` trên ASP.NET Core.

Hướng dẫn người dùng: [README.md](README.md). API interface: [reference/iblob-api.md](reference/iblob-api.md).

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Project chưa có blob storing Jarvis | [workflows/init.md](workflows/init.md) |
| Đã có core, thêm MinIO hoặc AwsS3 | [workflows/add.md](workflows/add.md) |

## Quy tắc cốt lõi

- Entry: `builder.AddCoreBlobStoring()` — tự `UseFileSystem()`. **Không** tự `AddKeyedSingleton` FileSystem.
- Satellite: `.UseMinIO()` / `.UseAwsS3()` trên fluent builder (cần package tương ứng).
- Config section **`BlobStoring`**: `DefaultProvider`, `FileSystem` / `MinIO` / `AwsS3` (`AutoSelectPriority`).
- Empty `DefaultProvider` chọn provider đã đăng ký có `AutoSelectPriority` cao nhất (điển hình MinIO 30 > AwsS3 20 > FileSystem 10).
- Layer thường gặp: **Infrastructure** hoặc **Host**.
- Không commit `SecretKey` — User Secrets / env.

## Packages

| PackageId | Version* | Khi nào |
|---|---|---|
| `Jarvis.BlobStoring` | 1.0.0 | Core + FileSystem built-in |
| `Jarvis.BlobStoring.MinIO` | 1.0.0 | S3-compatible |
| `Jarvis.BlobStoring.AwsS3` | 1.0.0 | AWS S3 |

\*Xem csproj repo Jarvis.

## Providers (atomic)

| Provider | Path |
|---|---|
| FileSystem | [providers/filesystem/SKILL.md](providers/filesystem/SKILL.md) |
| MinIO | [providers/minio/SKILL.md](providers/minio/SKILL.md) |
| AwsS3 | [providers/awss3/SKILL.md](providers/awss3/SKILL.md) |

## Templates

- [templates/program-setup.cs](templates/program-setup.cs) — `AddCoreBlobStoring`
- [templates/appsettings-blob.json](templates/appsettings-blob.json)
- [templates/blob-service-usage.cs](templates/blob-service-usage.cs)

## Output bắt buộc

- PackageReference `Jarvis.BlobStoring` (+ satellite nếu dùng)
- `AddCoreBlobStoring()` (+ `UseMinIO` / `UseAwsS3` khi cần)
- `appsettings` section `BlobStoring`
- `dotnet build` thành công
