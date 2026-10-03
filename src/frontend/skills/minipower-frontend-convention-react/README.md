# minipower-frontend-convention-react

Quy ước code TypeScript / React theo kit `@platform/core` — dùng khi **viết hoặc sửa file `.ts` / `.tsx`**, và khi cần dựng lớp `tsc` + ESLint để convention tự ép lúc CI. Agent đọc [SKILL.md](./SKILL.md); toàn văn quy ước ở [reference/coding-convention.md](./reference/coding-convention.md).

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Repo chưa có `tsconfig` strict + `eslint.config.js` | [workflows/init.md](./workflows/init.md) |
| Repo mới dựng bằng scaffold | Đã có sẵn — [scaffold](../minipower-frontend-scaffold-react/workflows/scaffold.md) |
| Đang viết code, cần tra một mục | [reference/coding-convention.md](./reference/coding-convention.md) |

**Không dùng cho:** file đặt ở đâu / import chiều nào → [architecture](../minipower-frontend-architecture-react/README.md) · review rủi ro của PR → [review](../minipower-frontend-review-react/README.md).

## Vì sao là skill chứ không phải một file tài liệu

| | Ai gác | Sai thì sao |
|---|---|---|
| **Cứng** — strict null, `import type`, cấm `enum`, rules-of-hooks, exhaustive-deps, `any`, `console.log`, `en.ts` thiếu key | `tsc` + ESLint | CI **đỏ** |
| **Mềm** — hệ đặt tên, PrimeReact 11 compound, text qua localization, dùng sẵn của kit | Agent nhắc lúc viết · người review | Nhắc, người quyết |

Phần cứng không cần ai nhớ. Phần mềm không giả vờ là bắt buộc.

## Bẫy hay gặp nhất

- **PrimeReact 11 ≠ v10.** Kit dùng API compound (`DataTable.Root`, `Dialog.Root`, `Select.Root`…). Code kiểu v10 (`<DataTable value>` + `<Column>`, `<Dialog visible onHide>`) không chạy.
- **Preset React Compiler của react-hooks v7 không bật** — nó đánh đỏ mẫu nạp dữ liệu chuẩn của kit.
- **TypeScript giữ `~6.0`** — `typescript-eslint` chưa hỗ trợ TypeScript 7.

## Cách gọi

```text
@.opencode/skills/minipower-frontend-convention-react/workflows/init.md

Dựng tsconfig strict + ESLint cho repo acme-web, codebase có sẵn ~200 file .tsx
```

Khi viết code thì không cần gọi tên: mô tả việc như bình thường — skill sinh code tương ứng đã trỏ về đây ở *Output bắt buộc*.

## Ranh giới với review

[minipower-frontend-review-react](../minipower-frontend-review-react/README.md) **không** comment style — đó là việc của `tsc` + ESLint. Review lo rủi ro production: bảo mật, race condition, mất dữ liệu, logic.

## Liên quan

- [minipower-frontend-scaffold-react](../minipower-frontend-scaffold-react/README.md) — nơi các template được đặt vào repo mới
- [minipower-frontend-architecture-react](../minipower-frontend-architecture-react/README.md) — file nằm ở đâu
- Bản đồ module: [frontend/README.md](../../README.md)
