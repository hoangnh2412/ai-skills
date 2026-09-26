# Workflow: Thêm {provider/pattern}

Áp dụng khi **đã có** core và cần thêm một biến thể.

## Checklist

```text
- [ ] 1. Chọn biến thể trong providers/ (hoặc patterns/)
- [ ] 2. Đọc providers/{name}/SKILL.md — CHỈ một file
- [ ] 3. Package theo frontmatter dependencies
- [ ] 4. Config section
- [ ] 5. Registration
- [ ] 6. Validate
```

## Bước 1 — Chọn biến thể

Không load toàn bộ thư mục `providers/` — chỉ file cần dùng cho task hiện tại.

| Biến thể | Khi nào |
|---|---|
| {Tên} | {điều kiện chọn} |

## Bước 6 — Validate

- `dotnet build` xanh
- {kiểm chứng chạy được}

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| {…} | {…} |
