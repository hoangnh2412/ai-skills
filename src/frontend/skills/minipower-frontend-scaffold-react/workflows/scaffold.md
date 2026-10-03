# Workflow: Dựng app frontend từ folder trống

**Mục tiêu:** repo `{app}` chạy `npm run dev` ra AdminLayout của kit; `typecheck` · `lint` · `build` xanh.

**Đầu vào từ người** (hỏi một lượt, dùng mặc định nếu không chỉ định):

| Hỏi | Mặc định |
|---|---|
| `{app}` (tên package, kebab) · `{AppTitle}` (tên hiển thị) | — bắt buộc |
| Cài kit: registry (`{kitSpec}` = `^x.y.z`) hay link `file:{KitPath}` | registry |
| Backend dev cho proxy `/api` | `https://localhost:7006` (backend scaffold Jarvis) |
| Backend xác thực bằng gì: cookie · API key · Bearer | cookie |

## Checklist

```text
- [ ] 0. Placeholder + câu trả lời ở trên
- [ ] 1. Tạo repo + copy template gốc (package.json · vite.config.ts · index.html · .env.example)
- [ ] 2. src/ (main.tsx · App.tsx · index.css · vite-env.d.ts · app/http.ts · app/navigation.ts)
- [ ] 3. Lớp ép: tsconfig.json · eslint.config.js · eslint.architecture.js
- [ ] 4. npm install
- [ ] 5. Xác thực (chỉ khi Bearer)
- [ ] 6. typecheck · lint · build · dev
```

## Bước 1 — Repo + file gốc

```bash
mkdir {app} && cd {app}
git init
```

| Template | Đích |
|---|---|
| [templates/package.json](../templates/package.json) | `package.json` — thay `{app}`, `{kitSpec}` |
| [templates/vite.config.ts](../templates/vite.config.ts) | `vite.config.ts` |
| [templates/index.html](../templates/index.html) | `index.html` — thay `{AppTitle}` |
| [templates/env.example](../templates/env.example) | `.env.example` và bản chạy `.env.development` |

`.gitignore` tối thiểu: `node_modules`, `dist`, `.env.development`, `.env.local`, `.env.*.local`.

Link `file:` ⇒ build kit trước:

```bash
cd {KitPath} && npm install && npm run build
```

## Bước 2 — src/

Copy cả [templates/src/](../templates/src/) → `src/`, thay `{AppTitle}`.

- `main.tsx`: `configureAppHttp()` **trước** `createRoot().render`; `<Toaster />` trong `PrimeReactProvider`.
- `index.css`: link `file:` mà muốn quét source kit thì đổi dòng `@source` sang `{KitPath}/src` (đường tương đối từ `src/`).
- `app/navigation.ts`: menu chỉ có Trang chủ — feature thêm dần ([navigation › add-menu](../../minipower-frontend-navigation-react/workflows/add-menu.md)).

## Bước 3 — Lớp ép convention + kiến trúc

| Template | Đích |
|---|---|
| [convention templates/tsconfig.json](../../minipower-frontend-convention-react/templates/tsconfig.json) | `tsconfig.json` |
| [convention templates/eslint.config.js](../../minipower-frontend-convention-react/templates/eslint.config.js) | `eslint.config.js` |
| [architecture templates/eslint.architecture.js](../../minipower-frontend-architecture-react/templates/eslint.architecture.js) | `eslint.architecture.js` |

Đặt **trước** khi viết feature đầu tiên — lint bắt lỗi ngay từ file đầu.

## Bước 4 — Cài

```bash
npm install
```

## Bước 5 — Xác thực

| Backend | Việc |
|---|---|
| Cookie phiên | Không làm gì |
| API key | Điền `VITE_API_KEY` / `VITE_API_KEY_NAME` trong `.env.development` |
| Bearer | [api templates/app/auth.ts](../../minipower-frontend-api-react/templates/app/auth.ts) → `src/app/auth.ts`; gọi `installBearerAuth(getToken)` trong `main.tsx` sau `configureAppHttp()`. Nơi lưu token: hỏi người |

Màn đăng nhập: [add.md § Đăng nhập](add.md#đăng-nhập--tài-khoản).

## Bước 6 — Validate

```bash
npm run typecheck
npm run lint
npm run build
npm run dev
```

Mở `http://localhost:5173/`:

- Sidebar chỉ có **Trang chủ** (không còn menu demo của kit), header có tiêu đề, trang chủ hiện `PageHeader`.
- DevTools Console không lỗi; nút PrimeReact có màu teal, bo góc (CSS kit đã nạp).
- Lỗi nào ở trên ⇒ [reference/troubleshooting.md](../reference/troubleshooting.md).

## Sau scaffold

| Việc | Skill |
|---|---|
| Thêm feature nghiệp vụ | [architecture › add-feature](../../minipower-frontend-architecture-react/workflows/add-feature.md) |
| Mount module có sẵn của kit | [add.md](add.md) |
| Route / menu / quyền | [navigation](../../minipower-frontend-navigation-react/README.md) |
| Review trước MR | [review](../../minipower-frontend-review-react/README.md) |
