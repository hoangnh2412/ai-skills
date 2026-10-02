# minipower-frontend-form-react

Skill dựng form theo kit `@platform/core`: Zod schema + react-hook-form + component chỉ có trường, submit qua `handleAction`. Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Thêm form tạo/sửa, thêm trường, thêm validate | [workflows/add-form.md](./workflows/add-form.md) |
| Trường chọn ngày / chọn bản ghi liên kết / bật-tắt / mật khẩu | [reference/controls.md](./reference/controls.md) |

**Không dùng cho:** dựng cả màn danh sách + form → [crud](../minipower-frontend-crud-react/README.md) · đổi API của form đăng nhập / hồ sơ có sẵn trong kit → [customization](../minipower-frontend-customization-react/README.md).

## Cách gọi

```text
@.opencode/skills/minipower-frontend-form-react/workflows/add-form.md

Thêm trường joinDate (ngày vào làm, bắt buộc) và departmentId (chọn phòng ban từ API) vào form Employee
```

## Quy tắc (tóm tắt)

- Ràng buộc schema khớp DOC-12 / DOC-11; message lỗi tiếng Việt ngay trong schema.
- Component form chỉ có trường — page / dialog lo submit, API, điều hướng.
- Control không phải ô nhập văn bản bọc `Controller`; ngày không giờ giữ chuỗi `'YYYY-MM-DD'`.
- Form sửa: nạp dữ liệu rồi `reset`; `defaultValues` truyền vào phải giữ tham chiếu ổn định.

## Liên quan

- [minipower-frontend-crud-react](../minipower-frontend-crud-react/README.md) — page / dialog sở hữu submit
- [minipower-frontend-api-react](../minipower-frontend-api-react/README.md) — payload theo DOC-12
- Bản đồ module: [frontend/README.md](../../README.md)
