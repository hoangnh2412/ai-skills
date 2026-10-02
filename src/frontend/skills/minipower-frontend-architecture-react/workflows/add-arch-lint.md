# Workflow: Dựng lint kiến trúc R1–R7 + M1

Áp dụng khi repo frontend **chưa có** `eslint.architecture.js`. App dựng bằng [scaffold](../../minipower-frontend-scaffold-react/workflows/scaffold.md) đã có sẵn.

## Checklist

```text
- [ ] 1. ESLint flat config đã có (chưa có → convention › init trước)
- [ ] 2. Copy eslint.architecture.js về gốc repo, spread vào eslint.config.js
- [ ] 3. npm run lint — đếm vi phạm trên code có sẵn
- [ ] 4. Thử vi phạm → phải thấy đỏ
- [ ] 5. Dọn vi phạm (hoặc khoanh vùng legacy có ghi nợ)
- [ ] 6. CI chạy npm run lint
```

## Bước 1–2 — Đặt luật

| Template | Đích |
|---|---|
| [templates/eslint.architecture.js](../templates/eslint.architecture.js) | `eslint.architecture.js` (gốc repo, cạnh `eslint.config.js`) |

`eslint.config.js` của [convention](../../minipower-frontend-convention-react/templates/eslint.config.js) đã có dòng `...architecture` ở cuối. Repo tự viết config thì thêm:

```js
import architecture from './eslint.architecture.js'
export default defineConfig([/* … */, ...architecture])
```

Luật áp theo **đường dẫn** `src/features/**` · `src/app/**` — cấu trúc khác thì sửa glob `files` trong file luật, không sửa regex.

## Bảy luật import + M1

| # | Luật | Áp cho |
|---|---|---|
| R1 | Không import `react-router` / `react-router-dom` — điều hướng qua `routes/navigation.ts` | `src/features/**` |
| R2 | Không import `axios` — gọi API qua `services/req.ts` | `src/features/**` |
| R3 | Không deep-import kit (`@platform/core/dist/…`) — chỉ entry `@platform/core`, subpath `.css` được phép | toàn `src/` |
| R4 | Không import ruột feature khác (`../../../{x}/services`) — chỉ barrel; host chỉ import `./features` hoặc `./features/{x}` | toàn `src/` |
| R5 | `services/` không import React / PrimeReact / `pages` · `components` · `hooks` | `src/features/*/services/**` |
| R6 | `components/` không import `services/` · `pages/`; `hooks/` không import `pages/` · `components/` | hai folder đó |
| R7 | Tầng lá không import `pages` · `components` · `hooks` · `services` | `types` · `validation` · `constants` · `mocks` · `routes` · `menu` · `permission` · `localization` · `theme` · `utils` |
| **M1** | `pages/` import `mock*` (nhánh mock tạm) — **cảnh báo** trên máy dev, **lỗi khi `CI=true`** | `src/features/*/pages/**` |

Mọi pattern bật `caseSensitive: true` — regex của `no-restricted-imports` mặc định **không** phân biệt hoa thường, sẽ bắt oan thư mục kiểu `components/Services/`.

M1 dùng `no-restricted-syntax` (rule riêng) nên mức độ tách khỏi R1–R7: đang dựng UI trên mock vẫn làm việc được, nhưng runner GitLab / GitHub tự đặt `CI=true` ⇒ còn mock là không merge được. CI tự host không đặt biến này thì thêm `CI: "true"` vào job lint.

## Bước 4 — Thử vi phạm để chắc cổng còn sống

```text
Thêm vào một file trong src/features/{feature}/pages/:
  import { useNavigate } from 'react-router-dom'     ⇒ npm run lint phải báo "R1: …"
Thêm vào src/features/{feature}/components/{X}/{X}.tsx:
  import { callGet{Feature}List } from '../../services' ⇒ phải báo "R6: …"
Thêm vào một page:
  import { mockGet{Feature}List } from '../../services'  ⇒ npm run lint: warning "M1: …"; CI=true npm run lint: error
```

Không đỏ ⇒ glob `files` không khớp cấu trúc repo — sửa glob, không sửa luật. Xoá dòng thử sau khi kiểm.

## Bước 5 — Codebase có sẵn

Vi phạm ít: sửa luôn. Vi phạm nhiều: khoanh **folder legacy** sang khối riêng mức `warn`, ghi nợ, dọn dần — **không** tắt luật cho cả repo:

```js
{ files: ['src/legacy/**/*.{ts,tsx}'], rules: { 'no-restricted-imports': 'warn' } },
```

Áp lint này **trong repo kit**: `account/` và `layouts/` của kit dùng `react-router` trực tiếp (thiết kế hiện tại) — loại khỏi R1 bằng `ignores`, ghi nợ, đừng sửa kit chỉ để lint xanh.

## Khi luật đỏ

Đọc message trước — message mang mã luật. Ba khả năng, theo thứ tự xác suất:

1. **File đặt sai folder** → chuyển file, đúng bảng *Đặt file ở đâu* trong [SKILL.md](../SKILL.md)
2. **Import sai chiều** → đảo phụ thuộc: component nhận dữ liệu qua props, host truyền id qua prop, feature khác đi qua barrel
3. **Luật sai** → hiếm; sửa luật thì ghi lý do vào commit, đừng xoá lặng lẽ

**Không** thêm `// eslint-disable` để qua cổng.

## Bước 6 — CI

```yaml
lint:
  variables:
    CI: "true"        # runner GitLab đã đặt sẵn — ghi rõ để M1 chắc chắn là lỗi
  script:
    - npm ci
    - npm run typecheck
    - npm run lint
```
