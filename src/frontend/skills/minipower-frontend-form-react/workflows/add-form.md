# Workflow: Thêm form (hoặc trường mới vào form)

Áp dụng cho form tạo/sửa của một feature. Form đăng nhập / hồ sơ có sẵn trong kit → [customization](../../minipower-frontend-customization-react/README.md), không viết lại.

## Checklist

```text
- [ ] 1. Danh sách trường: kiểu, bắt buộc, độ dài, giá trị hợp lệ — từ DOC-12 / DOC-11 / FR
- [ ] 2. validation/{feature}.ts — schema + FormData + defaults + to{Feature}FormValues
- [ ] 3. hooks/use{Feature}Form.ts
- [ ] 4. components/{Feature}Form — trường + lỗi
- [ ] 5. Page / dialog: submit qua handleAction, map form → payload
- [ ] 6. Sửa: nạp bản ghi → reset
- [ ] 7. typecheck + lint + thử tay
```

## Bước 1 — Danh sách trường

Hỏi **một lượt** các trường còn thiếu số liệu. Bảng nháp:

| Trường | Kiểu dây | Bắt buộc | Ràng buộc | Control |
|---|---|---|---|---|
| `code` | string | ✓ | ≤ 64 | `InputText` |
| `joinDate` | `'YYYY-MM-DD'` | ✓ | — | `KitDatePicker` |
| `departmentId` | uuid | ✓ | tồn tại | `SearchableSelect` (`loadOptions`) |

Cột *Control* tra ở [reference/controls.md](../reference/controls.md).

## Bước 2 — Schema

Copy [templates/validation/{feature}.ts](../templates/validation/{feature}.ts) + [index.ts](../templates/validation/index.ts). Mỗi trường mới thêm **bốn chỗ cùng lúc**: schema · `{feature}FormDefaultValues` · `to{Feature}FormValues` · payload trong `defaultSubmit` của page. Thiếu một chỗ ⇒ `tsc` báo ở ba chỗ đầu; chỗ thứ tư chỉ lộ khi gọi API — soát tay.

## Bước 3 — Hook

Copy [templates/hooks/](../templates/hooks/). `mode: 'onChange'` — lỗi hiện ngay khi gõ, nút lưu phản hồi tức thì.

## Bước 4 — Component trường

Copy [templates/components/{Feature}Form/](../templates/components/{Feature}Form/):

- Nhận `register` · `control` · `errors` (+ `locale`, cờ ẩn/hiện); **không** `handleSubmit`, **không** gọi API.
- Nhãn + placeholder từ `get{Feature}Messages(locale)`; `htmlFor` khớp `id` của control.
- Lỗi dưới trường bằng `FieldError` cục bộ (`Message` của kit).
- Control cần dữ liệu từ API (`SearchableSelect`) nhận `loadOptions` qua **prop** — page import từ `services/`.

## Bước 5 — Submit ở page / dialog

```ts
const submit = handleSubmit(async (data) => {
  try {
    const outcome = await handleAction({
      ctx: { data, mode },
      callback,
      defaultSubmit: async (payload: {Feature}FormData) => {
        await callCreate{Feature}({ code: payload.code, name: payload.name, status: payload.status })
      },
      getPayload: ({ data: payload }) => payload,
      onSuccess: () => goList?.(),
    })
    if (outcome.status === 'cancelled') return
    notify.success(messages.form.saveSuccess)
  } catch (error) {
    notify.error(getErrorMessage(error, messages.form.saveError))
  }
})
```

Gắn `submit` vào `<form onSubmit>` của shell (`asForm`) hoặc `FeatureDialog onSubmit`. Mẫu đầy đủ: [crud › {Feature}FormPage](../../minipower-frontend-crud-react/templates/route-pages/pages/{Feature}Form/{Feature}FormPage.tsx) · [crud › dialog](../../minipower-frontend-crud-react/templates/dialog/pages/{Feature}List/{Feature}ListPage.tsx).

## Bước 6 — Form sửa

| Nguồn dữ liệu cũ | Cách |
|---|---|
| Page tự nạp theo id | `callGet{Feature}(id)` → `to{Feature}FormValues` → state → `reset` (mẫu FormPage) |
| Host truyền `defaultValues` | Effect `reset({ ...defaults, ...defaultValues })` — host giữ tham chiếu ổn định |
| Dialog mở từ dòng bảng | `reset(to{Feature}FormValues(item))` ngay trong hàm mở dialog |

## Bước 7 — Validate

```bash
npm run typecheck
npm run lint
```

Thử tay: submit form trống → lỗi dưới mọi trường bắt buộc; nhập vượt độ dài → lỗi; mở sửa → dữ liệu cũ hiện đủ; lưu → toast + về danh sách.

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| `useState` cho từng ô + tự viết `if` validate | Mất validate thống nhất, mất `isSubmitting`, lệch schema backend |
| Component form gọi `call*` / `platformHttp` | Lint R6 đỏ; component không còn tái dùng được trong dialog |
| `defaultValues={{ … }}` inline khi render page sửa | Tham chiếu mới mỗi render ⇒ form reset khi đang gõ |
| `new Date(value).toISOString()` cho ngày không giờ | Lệch một ngày ở múi giờ +7 |
| Gửi nguyên `data` của form làm payload | Gửi thừa trường; backend đổi contract là vỡ im lặng |
| Bỏ `noValidate` | Bong bóng HTML5 đè thông báo của Zod |
