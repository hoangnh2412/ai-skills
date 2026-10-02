---
name: minipower-frontend-crud-react-route-pages
description: Mẫu CRUD theo route của kit @platform/core — {Feature}ListPage · {Feature}FormPage (mode create/edit, tự nạp bản ghi khi sửa) · {Feature}DetailPage, điều hướng giữa màn bằng navigate{Feature}(get{Feature}*Path(id)), host bọc wrapper useParams. Dùng khi thực thể nhiều trường, cần URL riêng cho tạo/sửa/chi tiết.
---

# Mẫu theo route — List · Form · Detail

## Copy

| Template | Đích |
|---|---|
| [../../templates/shared/components/](../../templates/shared/components/) | `src/features/{feature}/components/` |
| [../../templates/route-pages/pages/{Feature}List/](../../templates/route-pages/pages/{Feature}List/) | `pages/{Feature}List/` |
| [../../templates/route-pages/pages/{Feature}Form/](../../templates/route-pages/pages/{Feature}Form/) | `pages/{Feature}Form/` |
| [../../templates/route-pages/pages/{Feature}Detail/](../../templates/route-pages/pages/{Feature}Detail/) | `pages/{Feature}Detail/` |

Barrel export cả ba page — [architecture templates/index.ts](../../../minipower-frontend-architecture-react/templates/index.ts) đã kèm sẵn.

## Ba page nối nhau thế nào

```text
{Feature}ListPage ──Thêm mới──▶ navigate{Feature}(get{Feature}CreatePath())        ─▶ {Feature}FormPage mode="create"
      │          ──Xem────────▶ navigate{Feature}(get{Feature}DetailPath(id))      ─▶ {Feature}DetailPage {feature}Id
      │          ──Sửa────────▶ navigate{Feature}(get{Feature}EditPath(id))        ─▶ {Feature}FormPage mode="edit" {feature}Id
      └── xoá / đổi trạng thái: tại chỗ (ConfirmDialog · handleAction) rồi reload
{Feature}FormPage ──lưu xong / Hủy──▶ navigate{Feature}(get{Feature}ListPath())
```

Mọi điều hướng mặc định tắt được bằng `useRoutes={false}` (host tự truyền `onCreate` / `onView` / `onEdit` / `onCancel`).

## Host gắn route

`id` đọc ở host bằng wrapper `useParams` — page không import router:

```tsx
function {Feature}EditRoute() {
  const { id = '' } = useParams()
  return <{Feature}FormPage mode="edit" {feature}Id={id} />
}
```

Mẫu đủ bốn route + wrapper: [navigation templates/app/routes/{feature}.tsx](../../../minipower-frontend-navigation-react/templates/app/routes/{feature}.tsx). Route `create` tĩnh đứng cạnh `:id` vẫn khớp đúng — React Router xếp đoạn tĩnh trước đoạn động.

## Chỉnh theo DOC-19

| Muốn | Sửa |
|---|---|
| Thêm cột | `{Feature}Table`: thêm `THeadCell` + `Cell`, tăng `COLUMN_COUNT` |
| Thêm bộ lọc (phòng ban, khoảng ngày) | `{Feature}ListPage`: state lọc → `buildQuery` → control trong `toolbar` → về trang 1 khi đổi |
| Form nhiều khối | `{Feature}Form`: chia `Card` / `Tabs` bên trong component, page giữ nguyên |
| Chi tiết có resource con | `{Feature}DetailPage`: thêm `Card` + nút sang route con (`get{Feature}…Path(id)`), resource con là page riêng |

## Validate

Chạy `npm run dev`: `/{features}` tải danh sách → **Thêm mới** sang `/{features}/create` → lưu về danh sách có bản ghi mới → menu dòng **Chỉnh sửa** mở form có dữ liệu cũ → **Xem chi tiết** → **Xoá** qua hộp xác nhận.
