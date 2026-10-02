# Workflow: Thêm mục menu — có hoặc không lọc quyền

Áp dụng khi feature đã có route ([add-route.md](add-route.md)) và cần mục trên sidebar `AdminLayout`.

## Checklist

```text
- [ ] 1. permission/ trong feature — khoá quyền đúng chuỗi backend
- [ ] 2. menu/ trong feature — {feature}MenuItems
- [ ] 3. src/app/navigation.ts — thêm mục (tĩnh) hoặc chuyển sang buildMainNav(grants)
- [ ] 4. App.tsx truyền mainNav / secondaryNav cho AdminLayout
- [ ] 5. Thử với user đủ quyền và thiếu quyền
```

## Bước 1–2 — Phía feature

| Template | Đích |
|---|---|
| [templates/permission/](../templates/permission/) | `permission/` — `keys.ts` · `hasPermission.ts` · `index.ts` |
| [templates/menu/](../templates/menu/) | `menu/` — `items.ts` · `index.ts` |

Khoá quyền (`{feature}.view`…) là **giả định** cho tới khi khớp tên quyền backend trả về — hỏi / đối chiếu DOC-12, ghi nợ nếu chưa rõ. Icon **không** nằm trong `*MenuItems` — host chọn khi map.

## Bước 3 — Menu của app

**App chưa phân quyền** — thêm một mục vào `mainNav` tĩnh (bản scaffold):

```ts
import { Users } from 'lucide-react'
import { {FEATURE}_ROUTES } from '../features'

export const mainNav: AdminNavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: LayoutDashboard, path: '/' },
  { id: '{feature}', label: '{Label}', icon: Users, path: {FEATURE}_ROUTES.list },
]
```

**App có phân quyền** — thay file bằng [templates/app/navigation.ts](../templates/app/navigation.ts): mỗi feature một dòng trong `MENU_SOURCES`, `buildMainNav(grants)` lọc theo `has{Feature}Permission`.

## Bước 4 — Truyền vào AdminLayout

```tsx
// tĩnh
<AdminLayout mainNav={mainNav} secondaryNav={secondaryNav} />

// lọc quyền — grants lấy từ API người dùng hiện tại (host quyết cách nạp / cache)
<AdminLayout mainNav={buildMainNav(grants)} secondaryNav={secondaryNav} />
```

Mục có `children` (`AdminNavSubItem[]`) thành menu con.

## Bước 5 — Validate

- User đủ quyền: thấy mục, bấm vào mở đúng page, mục sáng khi đang ở trang con (`/{features}/…`).
- User thiếu quyền: không thấy mục; gõ thẳng URL — **backend** phải trả 403 (UI không phải hàng rào).

## Anti-patterns

- Để `DEFAULT_ADMIN_MAIN_NAV` của kit chạy production — trỏ tới route app không có.
- Ẩn menu theo quyền rồi coi như đã bảo vệ — URL vẫn mở được, API vẫn gọi được.
- Tự đặt tên quyền ở frontend khác backend — lọc sai im lặng, không lỗi nào báo.
