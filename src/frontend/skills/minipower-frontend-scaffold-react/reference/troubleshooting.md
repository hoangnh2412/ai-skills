# Sự cố hay gặp sau khi cài / link kit

Không load mặc định — mở khi app lỗi ở tầng host. Luật hành động ở [SKILL.md](../SKILL.md).

| Triệu chứng | Nguyên nhân | Sửa |
|---|---|---|
| UI trắng, mất màu, class của kit không có tác dụng | Tailwind không quét file của kit (mặc định bỏ qua `node_modules`) | `@source "../node_modules/@platform/core/dist"` (hoặc `{KitPath}/src` khi link); import `theme.css` + `styles.css` |
| Style Aura đè class Tailwind, nút sai màu | Import `tailwindcss` đầy đủ (preflight) hoặc sai thứ tự layer | `@layer theme, base, primereact, utilities;` + import riêng `theme.css` / `utilities.css` của Tailwind |
| `Invalid hook call` / provider không nhận | Hai bản React / PrimeReact (kit link `file:` có `node_modules` riêng) | `resolve.dedupe` + `alias` trong `vite.config.ts` |
| `Two different types with this name exist` khi truyền icon lucide / component | Hai bản `@types/react` / `lucide-react` | Khối `paths` trong `tsconfig.json` |
| `Cannot find module '@platform/core'` / thiếu `dist` | Chưa build kit (link `file:`) | `npm run build` trong repo kit |
| Sửa kit mà app không đổi | App vẫn đọc `dist` cũ / cache Vite | Build kit, khởi động lại `npm run dev`; còn lỗi thì xoá `node_modules/.vite` |
| `process is not defined` | `react-rnd` / `react-draggable` (Craft PDF) đọc `process.env` | `define: { 'process.env.DRAGGABLE_DEBUG': 'undefined' }` |
| Badge "Invalid PrimeUI License" | PrimeReact 11 cần license key | Prop `license` của `PrimeReactProvider` — kit chỉ ẩn badge bằng CSS |
| `notify` gọi mà không thấy toast | Thiếu `<Toaster />` ở gốc | Đặt một `<Toaster />` trong `PrimeReactProvider` |
| Nút trong page kit đổi URL mà màn hình không đổi đúng | Thiếu `configure*Navigate` trong `NavigateBridge` | Thêm dòng cho module đó |
| Đăng xuất nhảy về `/` thay vì trang đăng nhập | App chưa có route `ACCOUNT_ROUTES.login` | Mount `LoginPage`, hoặc `onLogout` trả `false` rồi tự điều hướng |
| `/api/...` trả 404 / 504 khi dev | Proxy trỏ sai hoặc backend chưa chạy | `VITE_API_PROXY_TARGET`; backend HTTPS tự ký ⇒ `secure: false` (đã có) |
| Đăng nhập xong gọi API vẫn 401 | Bearer chưa gắn, hoặc chỉ gắn `platformHttp` mà quên `accountHttp` | [api templates/app/auth.ts](../../minipower-frontend-api-react/templates/app/auth.ts) |
| Bundle JS ~3 MB | Kit một bundle, `sideEffects` khai cả `dist` ⇒ không tree-shake | Không sửa được từ app — ghi nợ, đề xuất tách entry lên kit |
| `typescript-eslint` báo không hỗ trợ phiên bản TypeScript | Đã nâng TypeScript 7 | Giữ `typescript ~6.0` |
