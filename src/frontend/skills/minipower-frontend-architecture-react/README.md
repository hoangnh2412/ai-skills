# minipower-frontend-architecture-react

Skill giữ **kiến trúc** frontend React theo kit `@platform/core`: file nằm ở folder nào, folder nào được import folder nào, và một feature mới đi qua những đâu.

Agent đọc [SKILL.md](./SKILL.md).

## Skill này khác convention thế nào

| Skill | Trả lời câu hỏi | Cổng cứng |
|---|---|---|
| **architecture** | **File nằm ở đâu? Import thế nào?** | `npm run lint` — luật R1–R7 + M1 |
| [**convention**](../minipower-frontend-convention-react/README.md) | **Code trong file viết thế nào?** | `npm run typecheck` + `npm run lint` |

Hai skill bổ sung nhau, không chồng lấn.

## Khi nào dùng

| Tình huống | Workflow |
|------------|----------|
| Thêm feature mới (màn hình + API) | [workflows/add-feature.md](./workflows/add-feature.md) |
| Repo chưa có lint kiến trúc tự động | [workflows/add-arch-lint.md](./workflows/add-arch-lint.md) |

**Không dùng cho:** dựng app từ folder trống → [scaffold](../minipower-frontend-scaffold-react/README.md) · chỉ viết một form → [form](../minipower-frontend-form-react/README.md) · chỉ nối một endpoint → [api](../minipower-frontend-api-react/README.md).

Skill tự kích hoạt theo mô tả việc — nói *"thêm màn quản lý phòng ban"* hoặc *"file này đặt ở đâu?"* là đủ.

## Cách gọi

```text
@.opencode/skills/minipower-frontend-architecture-react/workflows/add-feature.md

Thêm feature Department: danh sách + tạo/sửa trong dialog, API v1/hrm/departments theo DOC-12 §3.2
```

## Lát cắt dọc — một feature đi qua đâu

```text
1. types/ · services/ · utils/apiData.ts      kiểu DOC-12 + call* (DOC-12 chưa có ⇒ dừng)
2. localization/ · components/fieldStyles.ts  text vi/en + class Tailwind
3. validation/ · hooks/ · {Feature}Form       Zod + react-hook-form
4. routes/ · menu/ · permission/              path, điều hướng tiêm từ host, quyền
5. pages/ + {Feature}Table · {Feature}PageShell
6. index.ts (barrel) → src/features/index.ts → host: route + NavigateBridge + menu
```

Bảng *Đặt file ở đâu* và bộ placeholder dùng chung cho mọi template nằm trong [SKILL.md](./SKILL.md).

## Kiểm tra

```bash
npm run typecheck
npm run lint
```

Import sai chiều ⇒ `npm run lint` đỏ, message nêu đúng mã luật (R1–R7). Page còn gọi `mock*` ⇒ cảnh báo M1 trên máy dev, lỗi khi `CI=true` — không merge được.

Dữ liệu giả (mock) **không** nằm trong luồng thêm feature: chỉ là nhánh tạm khi DOC-12 đã có mà backend chưa chạy ([api › add-mock](../minipower-frontend-api-react/workflows/add-mock.md)), không dùng làm prototype.

## Liên quan

- [minipower-frontend-scaffold-react](../minipower-frontend-scaffold-react/README.md) — app mới đã kèm sẵn lint kiến trúc
- [minipower-frontend-convention-react](../minipower-frontend-convention-react/README.md) — quy ước viết code
- [minipower-frontend-review-react](../minipower-frontend-review-react/README.md) — review PR
- Bản đồ module: [frontend/README.md](../../README.md)
