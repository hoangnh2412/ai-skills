# Hợp đồng page — props · callback · ctx của slot `content`

Không load mặc định — mở khi tuỳ biến page có sẵn của kit, hoặc khi dựng page mới cần đúng hợp đồng (template [crud](../../minipower-frontend-crud-react/README.md) đã theo). Luật hành động ở [SKILL.md](../SKILL.md). Kiểu chính xác: `*PageProps` · `*PageContentContext` export kèm từng page.

## 1. Props chung

| Prop | Mặc định | Ý nghĩa |
|---|---|---|
| `locale` | `'vi'` | Ngôn ngữ text của page |
| `title` · `description` · `className` · `headerActions` | theo messages | Khung page; `headerActions` chèn nút cạnh nút mặc định |
| `items` · `total` · `loading` (danh sách) / `item` (chi tiết) | — | **Controlled**: có prop dữ liệu ⇒ page không tự gọi API |
| `onQueryChange(query)` | — | Danh sách controlled: page báo query khi tìm / lọc / đổi trang. **Phải ổn định** (`useCallback`) — hàm inline ⇒ nạp lặp vô hạn |
| `defaultValues` | — | Form: giá trị ban đầu; **giữ tham chiếu ổn định** — đổi tham chiếu là form bị reset |
| `{feature}Id` | — | Form sửa / chi tiết: id do host đọc từ URL (wrapper `useParams`) |
| `onCreate` · `onView` · `onEdit` · `onCancel` | điều hướng mặc định | Thay điều hướng; nút chỉ hiện khi có handler |
| `useRoutes` | `true` | `false` ⇒ không gắn điều hướng mặc định — host tự truyền handler |
| `callback` | — | Thay API / chèn logic quanh thao tác ghi (mục 2) |
| `content` | — | Slot (mục 3) |
| `withShell` | `true` | `false` ⇒ bỏ khung (tiêu đề, footer). **Form: `<form>` nằm trong khung** — bỏ khung thì host tự bọc `<form onSubmit={ctx.submit} noValidate>` |
| `withDialogs` | `true` | `false` ⇒ không render dialog mặc định — dựng lại từ `ctx.pendingDelete` / `ctx.confirmDelete` / `ctx.DefaultDialogs` |

## 2. `callback` — vòng đời một thao tác ghi

```text
before(ctx)                  ── trả false ⇒ HUỶ: không gọi API, không success/error/complete, không toast
onSubmit(payload)            ── thay API mặc định; payload = getPayload(ctx) (bảng dưới)
  ├─ OK  ─▶ onSuccess của page (reload / điều hướng — không thay được) ─▶ success(ctx + result)
  └─ lỗi ─▶ error(ctx + error) ─▶ lỗi ném tiếp ─▶ page toast getErrorMessage(error, fallback)
complete(ctx)                ── luôn chạy sau khi đã gọi onSubmit (OK hoặc lỗi)
```

- Lỗi trong `onSubmit`: ném `Error('câu hiển thị')` hoặc để body lỗi API đi tiếp — page lo toast.
- `success` chạy **sau** điều hướng mặc định của page. Muốn tự điều hướng ⇒ `useRoutes={false}`.
- Page có nhiều thao tác nhận `callback` dạng object theo tên thao tác (`{ delete, toggleStatus }`); page một thao tác nhận thẳng `ActionProps`.

| Page | Thao tác | `ctx` | `payload` của `onSubmit` | Kết quả |
|---|---|---|---|---|
| `TenantListPage` | `delete` · `toggleStatus` | `{ tenant }` | `Tenant` | — |
| `TenantFormPage` | (một) | `{ data, mode }` | `TenantFormData` | — |
| `RoleListPage` | `create` | `{ data }` | `RoleFormData` | `Role` |
| | `update` | `{ role, data }` | `{ id, data }` | `Role` |
| | `delete` | `{ role }` | `Role` | — |
| | `updatePermissions` | `{ role, permissions }` | `{ id, permissions }` | `Role` |
| `LoginPage` | (một) | `{ data }` | `LoginFormData` | — |
| `ImportPage` | `validate` · `commit` | `{ file }` | `{ file }` | `ImportValidationResult` · `ImportCommitResult` |
| Template `{Feature}ListPage` (route) | `delete` · `toggleStatus` | `{ item }` | `{Feature}` | — |
| Template `{Feature}FormPage` | (một) | `{ data, mode }` | `{Feature}FormData` | — |
| Template `{Feature}ListPage` (dialog) | `create` · `update` · `delete` · `toggleStatus` | `{ data }` · `{ item, data }` · `{ item }` | `FormData` · `{ id, data }` · `{Feature}` | — |

Page khác của kit: đọc kiểu `callback` trong `*PageProps` — cùng khuôn `ActionProps<ctx, payload, result>`.

## 3. `content` — slot

`content` là `ReactNode` (thay hẳn phần thân) hoặc `(ctx) => ReactNode` (dựng lại từ ctx). Khung (`withShell`) và dialog (`withDialogs`) vẫn giữ trừ khi tắt.

| Page | ctx có |
|---|---|
| Danh sách | `items` · `total` · `loading` · `query` · `page` / `size` / `totalPages` + setter · bộ lọc + setter · `reload` · `onCreate` / `onView` / `onEdit` · `requestDelete` · `onToggleStatus` · `pendingDelete` · `deleting` · `cancelDelete` · `confirmDelete` · `DefaultToolbar` · `DefaultTable` · `DefaultPagination` · `DefaultContent` |
| Form | `mode` · id · `register` · `control` · `errors` · `isSubmitting` · `submit` · `onCancel` · `DefaultContent` |
| Chi tiết | `item` · `loading` · `reload` · `onEdit` · `onToggleStatus` · `DefaultContent` |

Ghép thường gặp: chèn trước / sau `ctx.DefaultContent`; thay riêng bảng bằng component bảng export của feature (`TenantTable`…) truyền handler đã lọc quyền.

## 4. Giới hạn đã biết của page trong kit

Đối chiếu kit `@platform/core` bản `develop` 33a023f (2026-10-03). Gặp giới hạn ⇒ vòng qua bằng hợp đồng trên, ghi nợ, đề xuất lên kit — **không fork**.

| Page | Giới hạn | Vòng qua |
|---|---|---|
| `TenantListPage` | `withQueryBuilder` mặc định bật; nút "Áp dụng" gọi API thử nghiệm `company/employees` và `console.log`, không lọc tenant | `withQueryBuilder={false}` |
| `TenantListPage` | Nút xoá luôn gắn trong bảng mặc định | Slot `content` dựng lại `TenantTable` không truyền `onDelete` |
| `TenantFormPage` | `showAttachments` mặc định bật — khối upload chỉ là UI, không gửi API | `showAttachments={false}` |
| `RoleListPage` | Danh sách luôn nạp từ mock; không có `callback.list`, không phát `onQueryChange` | Controlled (`items` / `total` / `loading`) + nạp lại trong `success` — chưa phân trang server |
| `LoginPage` | Thành công luôn `navigate('/')` | Điều hướng lại trong `success` |
| Account (`callLogin`…) | Dùng axios instance riêng `accountHttp` — interceptor gắn lên `platformHttp` không chạm tới | Gắn cả hai — [api templates/app/auth.ts](../../minipower-frontend-api-react/templates/app/auth.ts) |
