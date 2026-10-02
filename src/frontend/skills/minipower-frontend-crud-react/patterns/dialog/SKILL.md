---
name: minipower-frontend-crud-react-dialog
description: Mẫu CRUD theo dialog của kit @platform/core — một {Feature}ListPage duy nhất, tạo/sửa/xem trong FeatureDialog dùng chung một instance react-hook-form (reset mỗi lần mở), xoá qua ConfirmDialog, chỉ một route. Dùng khi danh mục ít trường, thao tác nhanh, không cần URL riêng cho từng bản ghi.
---

# Mẫu theo dialog — một màn danh sách

## Copy

| Template | Đích |
|---|---|
| [../../templates/shared/components/](../../templates/shared/components/) | `src/features/{feature}/components/` |
| [../../templates/dialog/pages/{Feature}List/](../../templates/dialog/pages/{Feature}List/) | `pages/{Feature}List/` |

Rút gọn theo mẫu này:

- `routes/paths.ts` chỉ giữ `list` (+ `get{Feature}ListPath`); bỏ `create` / `detail` / `edit`.
- Barrel feature bỏ `{Feature}FormPage` · `{Feature}DetailPage` và các `get{Feature}*Path` đã bỏ.
- Host chỉ một route: `<Route path={{FEATURE}_ROUTES.list} element={<{Feature}ListPage />} />` — không wrapper `useParams`.

## Một form, ba trạng thái dialog

```text
dialogMode: null | 'create' | 'edit' | 'view'
openCreate()  → reset({feature}FormDefaultValues)       → 'create'
openEdit(x)   → reset(to{Feature}FormValues(x))         → 'edit'
openView(x)   → (không đụng form)                       → 'view'   FeatureDialog không onSubmit ⇒ chỉ nút đóng
onSave = handleSubmit(data ⇒ handleAction(create | update) ⇒ onSuccess: đóng dialog + reload)
```

`FeatureDialog` có `onSubmit` thì tự bọc `<form>` + nút Lưu / Hủy; `submitting={isSubmitting}` khoá nút khi đang gửi.

## Khi nào chuyển sang mẫu route

Dialog bắt đầu cuộn dài, cần tab, cần dán link một bản ghi cho người khác, hoặc có resource con ⇒ chuyển [route-pages](../route-pages/SKILL.md): giữ `{Feature}Table` · `{Feature}Form` · services, chỉ thay page.

## Validate

Chạy `npm run dev`: `/{features}` → **Thêm mới** mở dialog → submit trống hiện lỗi → nhập đủ, lưu → dialog đóng, danh sách có bản ghi mới → menu dòng **Chỉnh sửa** mở dialog có dữ liệu cũ → **Xoá** qua hộp xác nhận.
