# Workflow: Mount module có sẵn của kit

Áp dụng khi app đã chạy (scaffold / init) và cần dùng **page có sẵn** của kit thay vì tự viết. Tuỳ biến page sau khi mount → [customization](../../minipower-frontend-customization-react/README.md).

## Checklist

```text
- [ ] 1. Chọn module (bảng dưới)
- [ ] 2. CSS riêng của module (nếu có) vào index.css
- [ ] 3. <Route> dùng hằng *_ROUTES; route có :id bọc wrapper useParams
- [ ] 4. configure*Navigate vào NavigateBridge (nếu module có)
- [ ] 5. Mục menu trong mainNav
- [ ] 6. Nối API thật / tắt phần demo theo ghi chú của module
```

## Bước 1 — Danh mục module (kit `develop` 33a023f)

| Module | Page | Hằng route | Bridge | CSS thêm | Ghi chú khi mount |
|---|---|---|---|---|---|
| Đăng nhập & tài khoản | `LoginPage` · `RegisterPage` · `ForgotPasswordPage` · `AccountProfilePage` · `ChangePasswordPage` | `ACCOUNT_ROUTES` | — (dùng router trực tiếp) | — | Ba trang đầu **ngoài** AdminLayout. Mặc định gọi `v1/account/*`; thành công về `/` |
| Tenant | `TenantListPage` · `TenantFormPage` · `TenantDetailPage` · `TenantConnectionsPage` · `TenantDomainsPage` | `TENANT_ROUTES` | `configureTenantNavigate` | — | `withQueryBuilder={false}` · `showAttachments={false}` (phần thử nghiệm) |
| Vai trò | `RoleListPage` | `ROLE_ROUTES` | `configureRoleNavigate` | — | Mặc định **mock** — nối API: [customization › role](../../minipower-frontend-customization-react/templates/examples/role-list-real-api.tsx) |
| Dashboard | `DashboardPage` | `DASHBOARD_ROUTES` | — | `@platform/core/dashboard.css` | API lỗi / rỗng ⇒ hiện chart giả |
| Planner | `PlannerPage` | `PLANNER_ROUTES` | `configurePlannerNavigate` | `@platform/core/planner.css` | |
| Timesheet | `TimesheetPage` | `TIMESHEET_ROUTES` | `configureTimesheetNavigate` | `@platform/core/timesheet.css` | |
| Form động | `DynamicFormBuilderPage` | `DYNAMIC_FORM_ROUTES` | `configureDynamicFormNavigate` | `@platform/core/dynamicForm.css` | Lưu ở localStorage tới khi nối service thật |
| Craft PDF | `CraftPdfTemplateListPage` · `CraftPdfEditorPage` | `CRAFT_PDF_ROUTES` | `configureCraftPdfNavigate` | — | Editor **ngoài** AdminLayout; Vite cần `define` cho `process.env.DRAGGABLE_DEBUG` |
| Craft DOCX | `CraftDocBuilderPage` | `CRAFT_DOC_ROUTES` | `configureCraftDocNavigate` | `@platform/core/craftDoc.css` | |
| File manager | `FileManagerPage` | `FILE_MANAGER_ROUTES` | `configureFileManagerNavigate` | — | Mặc định mock — nối qua `callback` |
| Import Excel | `ImportPage` | `IMPORT_ROUTES` | `configureImportNavigate` | — | Mặc định mock — `callback.validate` / `callback.commit` |
| Bộ lọc nâng cao | `QueryBuilder` (component nhúng) | — | — | — | Dựng `filter` cho API — [api › list-query](../../minipower-frontend-api-react/reference/list-query.md) |

Kit là **một bundle**: mọi peer (FullCalendar, AG Grid, chart.js, gridstack, react-pdf, quill, docx…) phải resolve được kể cả khi app chỉ mount một module. Cài từ registry: npm ≥ 7 tự cài peer. Link `file:`: lấy từ `node_modules` của kit.

## Bước 2 — CSS

```css
@import "@platform/core/theme.css";
@import "@platform/core/styles.css";
@import "@platform/core/planner.css";   /* chỉ module đang dùng */
```

## Bước 3–4 — Route + bridge

```tsx
function TenantDetailRoute() {
  const { id = '' } = useParams()
  return <TenantDetailPage tenantId={id} />
}

<Route element={<AdminLayout mainNav={mainNav} secondaryNav={secondaryNav} />}>
  <Route path={TENANT_ROUTES.list} element={<TenantListPage withQueryBuilder={false} />} />
  <Route path={TENANT_ROUTES.detail} element={<TenantDetailRoute />} />
</Route>
```

Thêm `configureTenantNavigate(go)` vào `NavigateBridge` — mẫu: [navigation › add-route](../../minipower-frontend-navigation-react/workflows/add-route.md).

Craft PDF — thêm vào `vite.config.ts`:

```ts
define: {
  'process.env.DRAGGABLE_DEBUG': 'undefined',
},
```

## Đăng nhập & tài khoản

```tsx
<Route path={ACCOUNT_ROUTES.login} element={<LoginPage />} />
<Route path={ACCOUNT_ROUTES.register} element={<RegisterPage />} />
<Route path={ACCOUNT_ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
<Route element={<AdminLayout … />}>
  <Route path={ACCOUNT_ROUTES.profile} element={<AccountProfilePage />} />
  <Route path={ACCOUNT_ROUTES.changePassword} element={<ChangePasswordPage />} />
</Route>
```

- Endpoint khác `v1/account/login`, hoặc backend trả Bearer: [customization › login-with-api](../../minipower-frontend-customization-react/templates/examples/login-with-api.tsx) + [api › auth.ts](../../minipower-frontend-api-react/templates/app/auth.ts).
- Account dùng axios instance riêng (`accountHttp`) — interceptor Bearer phải gắn cả hai instance (template `auth.ts` đã làm).
- Kit **chưa có** route guard (chặn vào trang khi chưa đăng nhập) — host tự làm nếu cần; ghi nợ, đừng tự bịa cơ chế phiên.

## Bước 6 — Validate

`npm run typecheck && npm run lint && npm run build`, rồi `npm run dev`: mục menu mở page, nút trong page chuyển trang, không lỗi console. Page còn chạy mock ⇒ ghi nợ ([api › add-mock](../../minipower-frontend-api-react/workflows/add-mock.md)).
