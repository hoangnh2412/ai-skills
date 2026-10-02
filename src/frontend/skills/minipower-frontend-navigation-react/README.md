# minipower-frontend-navigation-react

Skill gắn feature vào URL, sidebar và quyền theo kit `@platform/core`: path khai một chỗ, feature không đụng router, host tiêm điều hướng qua một `NavigateBridge`. Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Thêm route cho page mới, route có `:id` | [workflows/add-route.md](./workflows/add-route.md) |
| Thêm mục sidebar, ẩn menu theo quyền | [workflows/add-menu.md](./workflows/add-menu.md) |
| Bấm nút trong page mà không chuyển trang | Thiếu `configure*Navigate` trong `NavigateBridge` — [add-route.md](./workflows/add-route.md) |

**Không dùng cho:** ẩn nút **trong** page kit theo quyền → [customization](../minipower-frontend-customization-react/README.md) · dựng app chưa có router → [scaffold](../minipower-frontend-scaffold-react/README.md).

## Cách gọi

```text
@.opencode/skills/minipower-frontend-navigation-react/workflows/add-route.md

Gắn route cho feature Employee (list/create/detail/edit) và mục menu "Nhân viên", lọc theo quyền employee.view
```

## Ba mảnh

```text
feature  routes/paths.ts · routes/navigation.ts · menu/ · permission/
host     src/app/NavigateBridge.tsx · src/app/routes/{feature}.tsx · src/app/navigation.ts
layout   <AdminLayout mainNav secondaryNav>  — luôn thay menu demo của kit
```

## Liên quan

- [minipower-frontend-crud-react](../minipower-frontend-crud-react/README.md) — page được gắn route
- [minipower-frontend-architecture-react](../minipower-frontend-architecture-react/README.md) — luật R1 (feature không import router)
- Bản đồ module: [frontend/README.md](../../README.md)
