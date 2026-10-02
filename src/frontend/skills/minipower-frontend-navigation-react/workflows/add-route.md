# Workflow: Gắn feature vào URL

Áp dụng khi feature có page cần route. App chưa có router / AdminLayout → [scaffold](../../minipower-frontend-scaffold-react/workflows/scaffold.md) trước.

## Checklist

```text
- [ ] 1. routes/paths.ts + navigation.ts + index.ts trong feature
- [ ] 2. src/app/routes/{feature}.tsx — <Route> + wrapper useParams
- [ ] 3. NavigateBridge — thêm configure{Feature}Navigate
- [ ] 4. App.tsx — chèn {feature}Routes vào khối AdminLayout (hoặc ngoài)
- [ ] 5. Thử: menu / nút / URL trực tiếp
```

## Bước 1 — Phía feature

| Template | Đích |
|---|---|
| [templates/routes/paths.ts](../templates/routes/paths.ts) | `routes/paths.ts` |
| [templates/routes/navigation.ts](../templates/routes/navigation.ts) | `routes/navigation.ts` |
| [templates/routes/index.ts](../templates/routes/index.ts) | `routes/index.ts` |

Path theo DOC-19 (URL màn hình), số nhiều kebab: `/{features}`, `/{features}/create`, `/{features}/:id`, `/{features}/:id/edit`. Mẫu dialog chỉ giữ `list`. `withId` đã `encodeURIComponent` id.

## Bước 2 — Route + wrapper ở host

Copy [templates/app/routes/{feature}.tsx](../templates/app/routes/{feature}.tsx) → `src/app/routes/{feature}.tsx`. Wrapper đọc `:id` bằng `useParams` rồi đưa vào prop `{feature}Id` — đây là chỗ **duy nhất** chạm router cho feature này.

## Bước 3 — NavigateBridge

Lần đầu: copy [templates/app/NavigateBridge.tsx](../templates/app/NavigateBridge.tsx) → `src/app/NavigateBridge.tsx`, mount trong `App.tsx` cùng cấp `<Routes>`:

```tsx
<>
  <NavigateBridge />
  <Routes>…</Routes>
</>
```

Feature sau: thêm **một dòng** trong effect:

```ts
configure{Feature}Navigate(go)
```

Page của kit đang mount cũng cần dòng của nó (`configureTenantNavigate`, `configureRoleNavigate`, `configureCraftPdfNavigate`, `configureFileManagerNavigate`, `configureImportNavigate`, `configurePlannerNavigate`…). Thiếu ⇒ nút trong page đổi URL nhưng màn hình không đổi đúng cách (đường lùi `pushState`, không qua router).

## Bước 4 — App.tsx

```tsx
<Route element={<AdminLayout mainNav={mainNav} secondaryNav={secondaryNav} />}>
  <Route index element={<HomePage />} />
  {{feature}Routes}
</Route>
```

Màn toàn màn hình (editor, đăng nhập) đặt **ngoài** khối AdminLayout.

## Bước 5 — Validate

```bash
npm run typecheck && npm run lint
npm run dev
```

- Mở `/{features}` từ menu và gõ thẳng URL — cùng kết quả.
- Nút **Thêm mới** / **Sửa** / **Xem** trong page chuyển đúng màn, nút Back của trình duyệt quay lại được.
- Gõ thẳng `/{features}/{id}/edit` — form nạp đúng bản ghi.

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| `useParams` / `useNavigate` trong page của feature | Feature dính router của host — lint R1 đỏ |
| Mỗi feature một component bridge riêng rải trong App | Dễ quên khi thêm feature; một bridge, mỗi feature một dòng |
| Gõ path tay trong `<Route path="/employees/:id">` | Lệch với path page dùng để điều hướng — dùng `{FEATURE}_ROUTES` |
| Route editor toàn màn hình nằm trong AdminLayout | Sidebar + header chiếm chỗ, layout vỡ |
