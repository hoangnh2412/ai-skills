# blobstoring-dotnet

Skill tích hợp **Jarvis.BlobStoring** — `AddCoreBlobStoring` + FileSystem / MinIO / AwsS3. Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Chưa có blob storing | [workflows/init.md](./workflows/init.md) |
| Thêm MinIO / AwsS3 khi đã có core | [workflows/add.md](./workflows/add.md) + [providers/](./providers/) |

**Không dùng cho:** scaffold toàn solution → [jarvis-dotnet](../jarvis-dotnet/README.md) (template đã gọi `AddCoreBlobStoring`).

## Cách gọi

```text
@.opencode/skills/blobstoring-dotnet/workflows/init.md

Đăng ký AddCoreBlobStoring + UseMinIO cho MyApp.Infrastructure.
```

## Quy tắc (tóm tắt)

- `builder.AddCoreBlobStoring()` — FileSystem mặc định
- Fluent: `.UseMinIO()` / `.UseAwsS3()`
- Config: `BlobStoring:*`
- Inject: `IBlobStoringService` (default) hoặc `[FromKeyedServices("MinIO")]`

## Providers

| Provider | SKILL |
|----------|-------|
| FileSystem | [providers/filesystem/SKILL.md](./providers/filesystem/SKILL.md) |
| MinIO | [providers/minio/SKILL.md](./providers/minio/SKILL.md) |
| AwsS3 | [providers/awss3/SKILL.md](./providers/awss3/SKILL.md) |

## Liên quan

- [reference/iblob-api.md](./reference/iblob-api.md) — contract đầy đủ
- [caching-dotnet](../caching-dotnet/README.md) — cache blob/metadata qua `GetOrSetAsync`
- [jarvis-dotnet](../jarvis-dotnet/README.md) — layer Infrastructure
