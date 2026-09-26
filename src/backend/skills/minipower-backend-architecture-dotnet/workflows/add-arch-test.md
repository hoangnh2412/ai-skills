# Workflow: Dựng architecture test

Áp dụng khi solution **chưa có** `{Product}.ArchitectureTests`. Solution scaffold mới đã có sẵn — [minipower-backend-scaffold-dotnet](../../minipower-backend-scaffold-dotnet/workflows/scaffold.md).

## Checklist

```text
- [ ] 1. Tạo tests/{Product}.ArchitectureTests
- [ ] 2. Package TngTech.ArchUnitNET + .xUnit
- [ ] 3. ProjectReference cả 5 layer
- [ ] 4. Copy fixture + luật R1–R7
- [ ] 5. dotnet test -c Debug xanh
- [ ] 6. Thử vi phạm → phải thấy đỏ
- [ ] 7. Wire vào CI (job Debug riêng)
```

## Bước 1–3 — Project

```xml
<!-- tests/{Product}.ArchitectureTests/{Product}.ArchitectureTests.csproj -->
```

Mẫu: [templates/ArchitectureTests/ArchitectureTests.csproj.xml](../templates/ArchitectureTests/ArchitectureTests.csproj.xml).

Test project phải reference **cả 5 layer** — ArchUnitNET nạp assembly để soi kiểu, không đọc file csproj.

## Bước 4 — Luật

| File | Nội dung |
|---|---|
| [templates/ArchitectureTests/ArchitectureFixture.cs](../templates/ArchitectureTests/ArchitectureFixture.cs) | Nạp `Architecture` một lần, khai 5 layer |
| [templates/ArchitectureTests/LayerDependencyTests.cs](../templates/ArchitectureTests/LayerDependencyTests.cs) | R1–R7 |

Bộ luật đợt đầu:

| # | Luật | Cấp |
|---|---|---|
| R1 | Kiểu trong `*.Domain` không phụ thuộc Application / Infrastructure / Host | project |
| R2 | Kiểu trong `*.Domain` không phụ thuộc `Microsoft.EntityFrameworkCore` | kiểu |
| R3 | Kiểu trong `*.Application` không phụ thuộc Infrastructure / Host | project |
| R4 | Kiểu trong `*.Application` không dùng `Microsoft.AspNetCore.Mvc` / `.Http` | kiểu |
| R5 | Controller không inject `DbContext` / kiểu `*.Infrastructure` | kiểu |
| R6 | Controller không dùng kiểu `{Product}.Domain.*` làm tham số / kiểu trả về | kiểu |
| R7 | Cài đặt `ICommandHandler<>` / `IQueryHandler<>` chỉ nằm trong assembly `*.Application` | kiểu |

**R2 cố ý KHÔNG cấm** `Newtonsoft.Json` và `Microsoft.Extensions.*` — framework Jarvis dùng chúng ở `Jarvis.DDD.Domain.Shared` và `Jarvis.DDD.Domain`; cấm là đỏ oan.

**R6 là quy ước minipower**, không rút từ Jarvis (`Sample/` của Jarvis là project đơn). Gây ma sát thì hạ xuống advisory trước khi gỡ luật khác.

## Bước 5–6 — Validate

```bash
dotnet test -c Debug
```

Chạy ở **Debug**: ArchUnitNET đọc bytecode, Release tối ưu đi một số quan hệ.

Thử vi phạm để chắc cổng còn sống:

```text
Thêm ProjectReference {Product}.Domain → {Product}.Infrastructure
và dùng một kiểu của nó trong Domain  ⇒  R1 phải ĐỎ
```

Không đỏ nghĩa là fixture nạp sai assembly — sửa fixture, không sửa luật.

## Bước 7 — CI

Arch test chạy Debug, phần còn lại chạy Release → **job riêng**:

```yaml
architecture:
  script:
    - dotnet test tests/{Product}.ArchitectureTests -c Debug
```

## Khi luật đỏ

Đọc message trước. Ba khả năng, theo thứ tự xác suất:

1. **File đặt sai layer** → chuyển file, đúng bảng *Đặt file ở đâu* trong [SKILL.md](../SKILL.md)
2. **Reference sai chiều** → gỡ `ProjectReference`, đảo phụ thuộc qua interface
3. **Luật sai** → hiếm; sửa luật thì ghi lý do vào commit, đừng xoá lặng lẽ

**Không** tắt test để build xanh.
