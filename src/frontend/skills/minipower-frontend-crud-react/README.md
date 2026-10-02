# minipower-frontend-crud-react

Skill dựng màn quản lý (danh sách · tạo/sửa · chi tiết · xoá) theo kit `@platform/core`, theo một trong hai mẫu của chính kit: **theo route** (như `tenant`) hoặc **theo dialog** (như `role`). Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Đọc |
|------------|-----|
| Thực thể nhiều trường, cần URL riêng cho tạo / sửa / chi tiết | [patterns/route-pages/SKILL.md](./patterns/route-pages/SKILL.md) |
| Danh mục nhỏ, thao tác nhanh trong popup | [patterns/dialog/SKILL.md](./patterns/dialog/SKILL.md) |

**Không dùng cho:** chỉ thêm trường vào form → [form](../minipower-frontend-form-react/README.md) · chỉ nối endpoint → [api](../minipower-frontend-api-react/README.md) · dùng page CRUD **có sẵn** trong kit (tenant, role) → [customization](../minipower-frontend-customization-react/README.md) · cả feature từ đầu (kiểu + API + form + page + route) → [architecture › add-feature](../minipower-frontend-architecture-react/workflows/add-feature.md).

## Cách gọi

```text
@.opencode/skills/minipower-frontend-crud-react/patterns/route-pages/SKILL.md

Dựng màn Employee theo route: danh sách cột mã · họ tên · phòng ban · trạng thái, lọc theo phòng ban
```

## Page làm sẵn những gì

- Tự nạp danh sách hoặc chạy **controlled** khi host đưa dữ liệu (`items` + `onQueryChange`).
- Tìm kiếm debounce, lọc trạng thái, phân trang server, chặn response về muộn.
- Thao tác dòng qua `RowActions`, xoá qua `ConfirmDialog`, đổi trạng thái — đều qua `handleAction` nên host thay API được bằng `callback`.
- Slot `content` để host chèn / thay UI, `withShell` / `withDialogs` để nhúng page vào khung khác.

## Liên quan

- [minipower-frontend-form-react](../minipower-frontend-form-react/README.md) · [minipower-frontend-api-react](../minipower-frontend-api-react/README.md) · [minipower-frontend-navigation-react](../minipower-frontend-navigation-react/README.md)
- Hợp đồng props / ctx / callback: [customization/reference/page-contract.md](../minipower-frontend-customization-react/reference/page-contract.md)
- Bản đồ module: [frontend/README.md](../../README.md)
