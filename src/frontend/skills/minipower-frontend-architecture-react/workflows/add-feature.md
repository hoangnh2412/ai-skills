# Workflow: Thêm feature mới — lát cắt dọc

Áp dụng khi thêm một nhóm màn hình + API mới (vd. quản lý nhân viên). Một feature **chạm 6 skill** của module; làm thiếu tầng nào thì lỗi lộ ra ở tầng khác. Thứ tự đi **từ lá lên**: kiểu → API → form → điều hướng → page → host.

## Checklist

```text
- [ ] 0. Đầu vào: tên + placeholder, DOC-12 (endpoint · payload · enum), DOC-19 (màn hình), mẫu route hay dialog
- [ ] 1. types/ + services/ + utils/apiData.ts                       — api
- [ ] 2. localization/ + components/fieldStyles.ts                    — convention
- [ ] 3. validation/ + hooks/ + components/{Feature}Form/            — form
- [ ] 4. routes/ + menu/ + permission/                                — navigation
- [ ] 5. utils/resolveContent.ts + utils/index.ts                      — customization
- [ ] 6. components/{Feature}PageShell · {Feature}Table + pages/      — crud (một mẫu)
- [ ] 7. index.ts của feature + src/features/index.ts                 — skill này
- [ ] 8. Host: src/app/routes/{feature}.tsx · NavigateBridge · menu   — navigation
- [ ] 9. npm run typecheck && npm run lint && npm run build
```

## Bước 0 — Trước khi viết dòng nào

Hỏi **một lượt** mọi thứ còn thiếu, không hỏi nhỏ giọt:

| Hỏi | Lấy từ | Nếu chưa có |
|---|---|---|
| Endpoint list / get / create / update / delete / đổi trạng thái, path tương đối | DOC-12 | **Dừng** — chưa có contract thì chưa viết UI, hỏi ở cổng readiness |
| Trường DTO, enum (số hay chuỗi), trường bắt buộc, độ dài tối đa | DOC-12 · DOC-11 | Hỏi — **không đoán** độ dài/enum |
| Màn hình: danh sách cột nào, form trường nào, có trang chi tiết không | DOC-19 · FR/AC của module | Mặc định: mã · tên · trạng thái |
| Mẫu CRUD: route (List/Form/Detail riêng) hay dialog (một màn) | Người quyết — [crud § Chọn mẫu](../../minipower-frontend-crud-react/SKILL.md#chọn-mẫu) | Ít trường, thao tác nhanh → dialog |
| Khoá quyền backend trả về | Backend / DOC-12 | Dùng `{feature}.view` … và ghi nợ đối chiếu |

DOC-12 đã có nhưng backend chưa chạy được ⇒ luồng này vẫn đi bằng `call*`; muốn có dữ liệu để chạy thử thì rẽ nhánh tuỳ chọn [api › add-mock](../../minipower-frontend-api-react/workflows/add-mock.md) — cần người duyệt hoãn, ghi nợ, CI chặn merge khi page còn gọi `mock*` (M1). Mock không phải prototype — prototype là DOC-19 của analyst.

Điền bảng placeholder: [SKILL.md § Placeholder](../SKILL.md#placeholder-trong-template).

## Bước 1–6 — Copy template theo thứ tự

Mỗi dòng: copy file, thay placeholder trong **tên file và nội dung**. Đích tương đối với `src/features/{feature}/`.

| Bước | Template | Đích |
|---|---|---|
| 1 | [api/templates/types/index.ts](../../minipower-frontend-api-react/templates/types/index.ts) | `types/index.ts` |
| 1 | [api/templates/services/](../../minipower-frontend-api-react/templates/services/) | `services/` — `req.ts` · `{feature}.ts` · `index.ts` |
| 1 | [api/templates/utils/apiData.ts](../../minipower-frontend-api-react/templates/utils/apiData.ts) | `utils/apiData.ts` |
| 2 | [convention/templates/localization/](../../minipower-frontend-convention-react/templates/localization/) | `localization/` |
| 2 | [convention/templates/fieldStyles.ts](../../minipower-frontend-convention-react/templates/fieldStyles.ts) | `components/fieldStyles.ts` |
| 3 | [form/templates/validation/](../../minipower-frontend-form-react/templates/validation/) · [hooks/](../../minipower-frontend-form-react/templates/hooks/) · [components/](../../minipower-frontend-form-react/templates/components/) | cùng tên |
| 4 | [navigation/templates/routes/](../../minipower-frontend-navigation-react/templates/routes/) · [menu/](../../minipower-frontend-navigation-react/templates/menu/) · [permission/](../../minipower-frontend-navigation-react/templates/permission/) | cùng tên |
| 5 | [customization/templates/utils/](../../minipower-frontend-customization-react/templates/utils/) | `utils/` |
| 6 | [crud/templates/shared/components/](../../minipower-frontend-crud-react/templates/shared/components/) | `components/` |
| 6 | [crud/templates/route-pages/pages/](../../minipower-frontend-crud-react/templates/route-pages/pages/) **hoặc** [crud/templates/dialog/pages/](../../minipower-frontend-crud-react/templates/dialog/pages/) | `pages/` |

Sau khi copy: chỉnh trường thật theo DOC-12 ở **types → validation → form component → table → detail**, theo đúng thứ tự đó — `tsc` chỉ ra chỗ còn lệch.

## Bước 7 — Barrel

| Template | Đích |
|---|---|
| [templates/index.ts](../templates/index.ts) | `src/features/{feature}/index.ts` — mẫu dialog: bỏ `FormPage` · `DetailPage` |
| [templates/features-index.ts](../templates/features-index.ts) | `src/features/index.ts` — thêm **một dòng** `export * from './{feature}'` |

Trùng tên export giữa hai feature ⇒ `tsc` báo `TS2308` — đổi tên có tiền tố feature, **không** bỏ `export *`.

## Bước 8 — Host

Theo [navigation › add-route](../../minipower-frontend-navigation-react/workflows/add-route.md) và [add-menu](../../minipower-frontend-navigation-react/workflows/add-menu.md): `src/app/routes/{feature}.tsx` (route + wrapper `useParams`) · một dòng `configure{Feature}Navigate` trong `NavigateBridge` · một mục menu.

## Bước 9 — Validate

```bash
npm run typecheck
npm run lint
npm run build
```

Chạy `npm run dev`, mở `/{features}`: danh sách tải được (hoặc toast lỗi có nghĩa khi backend chưa chạy), nút **Thêm mới** chuyển trang, lưu xong về danh sách.

Trước khi merge: `CI=true npm run lint` xanh — page còn gọi `mock*` thì M1 báo lỗi.

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| Page gọi `axios` / `fetch` trực tiếp | Mất baseURL, API key, chuẩn hoá lỗi của kit — R2 đỏ |
| Page đọc `useParams` / gọi `useNavigate` | Feature dính router của host — R1 đỏ; id đi vào qua prop, điều hướng qua `navigate{Feature}` |
| Copy `TenantListPage` của kit rồi sửa | Kéo theo code thử nghiệm của kit; dùng template ở đây hoặc **dùng** page kit qua [customization](../../minipower-frontend-customization-react/README.md) |
| Một feature cho cả ba thực thể không liên quan | Feature = một nhóm màn hình + API cùng vòng đời; tách feature, nối qua barrel |
| Tạo đủ 13 folder "cho chuẩn" | Folder rỗng là lời hứa — chưa cần thì không tạo |
| Dựng feature trên dữ liệu giả khi DOC-12 chưa có, hoặc dùng làm prototype | Viết code trước tiền đề; prototype là DOC-19 của analyst |
