# minipower-frontend-scaffold-react

Skill dựng **app frontend** React + Vite + Tailwind v4 + PrimeReact 11 gắn kit `@platform/core`, hoặc gắn kit vào app có sẵn, hoặc mount module có sẵn của kit. Agent đọc [SKILL.md](./SKILL.md) và workflow tương ứng.

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Folder trống → app chạy được ngay | [workflows/scaffold.md](./workflows/scaffold.md) |
| App Vite + React có sẵn → gắn kit | [workflows/init.md](./workflows/init.md) |
| Dùng page có sẵn của kit (đăng nhập, tenant, vai trò, dashboard, planner…) | [workflows/add.md](./workflows/add.md) |
| UI trắng, *Invalid hook call*, lỗi kiểu trùng bản React… | [reference/troubleshooting.md](./reference/troubleshooting.md) |

**Không dùng cho:** thêm màn hình nghiệp vụ → [architecture › add-feature](../minipower-frontend-architecture-react/workflows/add-feature.md) · tuỳ biến page kit đã mount → [customization](../minipower-frontend-customization-react/README.md).

## Cách gọi

```text
@.opencode/skills/minipower-frontend-scaffold-react/workflows/scaffold.md

Dựng frontend:
- app: acme-web · tiêu đề: Acme
- kit: link file:../../platform/frameworks/frontend
- backend dev: https://localhost:7006, xác thực Bearer
```

## Chuẩn bị

| Việc | Scaffold | Init / Add |
|---|---|---|
| Node `^20.19` hoặc `≥ 22.13` (Vite 8 + ESLint 10) | ✓ | ✓ |
| Biết cách cài kit: registry hay `file:` (đường dẫn repo kit) | ✓ | ✓ |
| Kit đã build (`npm run build`) nếu link `file:` | ✓ | ✓ |
| Backend dev chạy được (cho proxy `/api`) | khuyến nghị | khuyến nghị |

## Kết quả sau scaffold

| Kiểm tra | Kỳ vọng |
|---|---|
| `npm run typecheck` · `lint` · `build` | xanh |
| `npm run dev` → `http://localhost:5173/` | AdminLayout, sidebar chỉ có menu của app, trang chủ |
| `/api/*` | Proxy sang backend `VITE_API_PROXY_TARGET` |

## Lưu ý

- Link `file:` cần ba lớp chống trùng bản React (Vite `dedupe` + `alias`, tsconfig `paths`) — template đã có.
- Kit là một bundle — app kéo toàn bộ kit (~3 MB) dù dùng ít module; tối ưu thuộc kit.
- TypeScript giữ `~6.0` cho tới khi `typescript-eslint` hỗ trợ bản 7.

## Liên quan

- [minipower-frontend-architecture-react](../minipower-frontend-architecture-react/README.md) — thêm feature sau scaffold
- [minipower-frontend-navigation-react](../minipower-frontend-navigation-react/README.md) — route, menu, bridge
- [minipower-backend-scaffold-dotnet](../../../backend/skills/minipower-backend-scaffold-dotnet/README.md) — backend Jarvis phía sau proxy
- Bản đồ module: [frontend/README.md](../../README.md)
