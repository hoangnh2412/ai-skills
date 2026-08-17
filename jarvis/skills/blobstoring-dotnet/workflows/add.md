# Workflow: Thêm blob provider

Áp dụng khi **đã có** `AddCoreBlobStoring()` và cần thêm MinIO hoặc AwsS3.

## Checklist

```text
- [ ] 1. Chọn provider: minio | awss3
- [ ] 2. Đọc providers/<name>/SKILL.md
- [ ] 3. Thêm PackageReference satellite
- [ ] 4. UseMinIO() / UseAwsS3() trên fluent builder
- [ ] 5. appsettings BlobStoring:MinIO | AwsS3
- [ ] 6. Validate
```

## Bước 1 — Chọn provider

- [providers/filesystem/SKILL.md](../providers/filesystem/SKILL.md)
- [providers/minio/SKILL.md](../providers/minio/SKILL.md)
- [providers/awss3/SKILL.md](../providers/awss3/SKILL.md)

## Anti-patterns

- Tự `AddKeyedSingleton` FileSystem thay vì `AddCoreBlobStoring`
- Package FileSystem riêng (không tồn tại)
- Commit `SecretKey` vào repo
