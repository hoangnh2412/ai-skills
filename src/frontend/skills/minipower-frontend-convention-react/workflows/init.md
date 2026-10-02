# Workflow: Dựng lớp ép convention cho repo frontend

Áp dụng khi repo **chưa** có `tsconfig` strict + `eslint.config.js` theo convention. App dựng bằng [scaffold](../../minipower-frontend-scaffold-react/workflows/scaffold.md) đã có sẵn — không chạy lại.

## Checklist

```text
- [ ] 1. Phạm vi: repo mới hay codebase có sẵn (bao nhiêu file .tsx, có code cũ không, CI đang chạy gì)
- [ ] 2. Cài devDependencies ESLint
- [ ] 3. Copy eslint.config.js + eslint.architecture.js, gộp cờ tsconfig
- [ ] 4. Thêm script typecheck + lint
- [ ] 5. Chạy — đếm lỗi, dọn theo thứ tự
- [ ] 6. Đưa hai lệnh vào CI
```

## Bước 1 — Phạm vi

Codebase có sẵn thì **áp dần**: bật hết một lần làm CI đỏ vì code cũ — phạt lịch sử chứ không chặn lỗi mới.

## Bước 2 — devDependencies

```bash
npm i -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks globals typescript@~6.0.3
```

TypeScript giữ `~6.0` — `typescript-eslint` 8.x chỉ hỗ trợ `<6.1`.

## Bước 3 — Template

| Từ | Tới |
|---|---|
| [templates/eslint.config.js](../templates/eslint.config.js) | `eslint.config.js` (gốc repo) |
| [architecture/templates/eslint.architecture.js](../../minipower-frontend-architecture-react/templates/eslint.architecture.js) | `eslint.architecture.js` (gốc repo) |
| [templates/tsconfig.json](../templates/tsconfig.json) | `tsconfig.json` — repo đã có thì **gộp** các cờ: `strict`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `isolatedModules`, `noEmit`, khối `paths` |

Repo dùng `tsconfig.app.json` (khuôn Vite) thì gộp cờ vào file đó, giữ `references`.

## Bước 4 — Script

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "lint": "eslint ."
}
```

Repo dùng project references: `"typecheck": "tsc -b"`.

## Bước 5 — Chạy và dọn

```bash
npm run typecheck
npm run lint
npx eslint . --fix     # tự sửa import type, một phần biến thừa
```

Thứ tự dọn trên codebase có sẵn:

1. `--fix` một lần, commit riêng *"lint --fix only"* — diff to nhưng không đổi hành vi
2. `verbatimModuleSyntax` / `erasableSyntaxOnly` đỏ nhiều → tạm bỏ hai cờ, ghi nợ, bật lại khi dọn xong `enum`
3. `exhaustive-deps` đỏ → sửa từng chỗ, **không** thêm dependency bừa (gây vòng nạp lặp) — đọc kỹ effect
4. Luật kiến trúc R1–R7 + M1 → [architecture › add-arch-lint § Codebase có sẵn](../../minipower-frontend-architecture-react/workflows/add-arch-lint.md#bước-5--codebase-có-sẵn)

## Bước 6 — CI

```yaml
lint:
  script:
    - npm ci
    - npm run typecheck
    - npm run lint
```

Đây là chỗ convention thành điều kiện cứng — trước bước này mọi thứ vẫn chỉ là lời.

## Anti-patterns

- Bật preset `recommended-latest` của react-hooks v7 trên code theo kit — rule React Compiler đánh đỏ mẫu nạp dữ liệu chuẩn, team tắt luôn cả lint.
- Thêm `// eslint-disable-next-line` để qua CI — nợ không ai thấy.
- Nâng TypeScript lên 7 — `typescript-eslint` gãy.
- Sửa style lẫn trong commit có logic — review không phân biệt được đâu là đổi hành vi.
- Thêm rule ngoài [reference/coding-convention.md](../reference/coding-convention.md) theo sở thích cá nhân — muốn đổi thì sửa reference trước.
