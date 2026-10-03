# Workflow: Gắn kit vào app Vite + React có sẵn

Áp dụng khi **đã có** app Vite + React (TypeScript) và chỉ cần cài `@platform/core` + wiring — không dựng lại từ đầu. Folder trống → [scaffold.md](scaffold.md).

## Checklist

```text
- [ ] 1. Kiểm nền: React 19, Vite ≥ 8, TypeScript ~6.0, Tailwind v4 (hoặc v3)
- [ ] 2. Cài kit + peer
- [ ] 3. vite.config.ts: plugin Tailwind, dedupe + alias, proxy /api
- [ ] 4. CSS: layer order + @source + theme.css + styles.css
- [ ] 5. main.tsx: configurePlatformHttp → BrowserRouter → PrimeReactProvider → App + Toaster
- [ ] 6. tsconfig: paths chống trùng bản (khi link file:) + resolveJsonModule
- [ ] 7. Validate
```

## Bước 2 — Cài

```bash
npm i @platform/core@{kitSpec}          # hoặc: npm i file:{KitPath}
npm i react-router-dom primereact @primereact/core @primeuix/themes axios zod react-hook-form @hookform/resolvers lucide-react react-toastify
npm i -D tailwindcss @tailwindcss/vite
```

## Bước 3 — Vite

Gộp từ [templates/vite.config.ts](../templates/vite.config.ts): `tailwindcss()` vào `plugins`, khối `resolve.dedupe` + `alias`, khối `server.proxy['/api']`. App đã có alias riêng ⇒ giữ, thêm năm package của kit.

## Bước 4 — CSS

**Tailwind v4** — đầu file CSS gốc, theo [templates/src/index.css](../templates/src/index.css). Bỏ `@import "tailwindcss";` đầy đủ nếu có — preflight của nó đè theme Aura.

**Tailwind v3** — `tailwind.config.js`:

```js
module.exports = {
  presets: [require('@platform/core/tailwind.preset.cjs')],
  content: ['./index.html', './src/**/*.{ts,tsx}', './node_modules/@platform/core/dist/**/*.{js,cjs}'],
}
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "@platform/core/styles.css";
```

## Bước 5 — Bootstrap

Gộp [templates/src/main.tsx](../templates/src/main.tsx) + [templates/src/app/http.ts](../templates/src/app/http.ts). App đã có `BrowserRouter` / provider khác ⇒ giữ thứ tự: Router ngoài cùng → `PrimeReactProvider` → App + `Toaster`. Toast cũ của app (nếu có) gỡ, chuyển sang `notify` của kit — hai hệ toast chồng nhau.

## Bước 6 — tsconfig

Thêm từ [convention templates/tsconfig.json](../../minipower-frontend-convention-react/templates/tsconfig.json): khối `paths` (bắt buộc khi link `file:`) và `resolveJsonModule`. Các cờ strict còn lại: [convention › init](../../minipower-frontend-convention-react/workflows/init.md).

## Bước 7 — Validate

```bash
npm run build
npm run dev
```

Thử một primitive của kit trong một trang có sẵn (`<Button>` từ `@platform/core`, `notify.success('ok')`) — có style và hiện toast là wiring đúng.
