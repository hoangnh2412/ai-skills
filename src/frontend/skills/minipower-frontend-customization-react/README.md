# minipower-frontend-customization-react

Skill tuỳ biến **page có sẵn của kit** `@platform/core` (tenant, role, login, import…) mà không copy source về sửa — qua slot `content`, `callback` và chế độ controlled. Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Xem |
|------------|-----|
| Thêm nút / banner vào page kit, giữ UI mặc định | [templates/examples/tenant-list-toolbar.tsx](./templates/examples/tenant-list-toolbar.tsx) |
| Page kit đang chạy mock — nối API thật | [templates/examples/role-list-real-api.tsx](./templates/examples/role-list-real-api.tsx) |
| Nối màn đăng nhập với backend (cookie hoặc Bearer) | [templates/examples/login-with-api.tsx](./templates/examples/login-with-api.tsx) |
| Ẩn tạo / sửa / xoá theo quyền | [templates/examples/tenant-list-permission.tsx](./templates/examples/tenant-list-permission.tsx) |
| Host tự nạp dữ liệu | [templates/examples/tenant-list-controlled.tsx](./templates/examples/tenant-list-controlled.tsx) |
| Nhúng form của page kit vào dialog | [templates/examples/tenant-form-no-shell.tsx](./templates/examples/tenant-form-no-shell.tsx) |

Mọi ví dụ đã được biên dịch + lint với kit thật (bản `develop` 33a023f).

**Không dùng cho:** dựng page CRUD mới cho nghiệp vụ của mình → [crud](../minipower-frontend-crud-react/README.md) · gắn page kit vào app lần đầu (peer, CSS, route) → [scaffold › add](../minipower-frontend-scaffold-react/workflows/add.md).

## Cách gọi

```text
@.opencode/skills/minipower-frontend-customization-react/SKILL.md

RoleListPage đang chạy mock — nối API v1/roles thật, sau khi lưu nạp lại danh sách
```

## Ba điểm mở rộng

```text
content   ReactNode | (ctx) => ReactNode       thay / ghép UI — ctx có dữ liệu, handler, Default*
callback  before → onSubmit → success | error → complete    thay API, chèn logic
controlled  items / total / loading / onQueryChange          host tự nạp dữ liệu
```

Giới hạn đã biết của từng page kit (vd. `TenantListPage` cần `withQueryBuilder={false}`) và bảng payload `callback`: [reference/page-contract.md](./reference/page-contract.md).

## Liên quan

- [minipower-frontend-crud-react](../minipower-frontend-crud-react/README.md) — page mới theo cùng hợp đồng
- [minipower-frontend-navigation-react](../minipower-frontend-navigation-react/README.md) — route, bridge, menu theo quyền
- Bản đồ module: [frontend/README.md](../../README.md)
