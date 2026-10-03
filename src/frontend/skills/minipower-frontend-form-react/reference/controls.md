# Control trong form — gắn với react-hook-form

Không load mặc định — mở khi form có trường **không phải ô nhập văn bản**. Luật hành động ở [SKILL.md](../SKILL.md).

Nguyên tắc: input gốc (`InputText`, `Textarea`) dùng `{...register('x')}`; mọi control khác bọc `Controller` và nối `field.value` / `field.onChange`. Kiểu Zod phải khớp **giá trị dây** (wire) mà control trả về.

## Bảng tra

| Control (`@platform/core`) | Giá trị dây | Zod | Gắn |
|---|---|---|---|
| `InputText` · `Textarea` | `string` | `z.string().trim()…` | `register` |
| `FieldSelect` | giá trị của option (`number` / `string`) | `z.union([z.literal(A), …])` | `Controller` |
| `SearchableSelect` | `string \| number \| null` | `z.string().uuid().nullable()` (vd. khoá ngoại) | `Controller` |
| `SearchableMultiSelect` | `string[]` | `z.array(z.string())` | `Controller` |
| `KitDatePicker` | `'YYYY-MM-DD'` (ngày địa phương, không giờ) | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)` | `Controller` |
| `KitDateTimePicker` | ISO UTC (`toISOString()`) hoặc `'YYYY-MM-DD'` khi chưa chọn giờ | `z.string()` | `Controller` |
| `KitTimePicker` | `'HH:mm'` | `z.string().regex(/^\d{2}:\d{2}$/)` | `Controller` |
| `ToggleSwitch` (compound) | `boolean` | `z.boolean()` | `Controller` |
| `PasswordInput` | `string` | `z.string().min(…)` | `Controller` |
| `KitFileUpload` | `File[]` | ngoài schema — giữ ở state riêng | `onSelect` |

Ngày **không giờ** (ngày sinh, ngày vào làm) giữ chuỗi `'YYYY-MM-DD'` từ đầu đến API — đừng đổi sang `Date` rồi `toISOString()`: lệch một ngày ở múi giờ +7.

## FieldSelect — danh sách cố định

```tsx
<Controller
  name="status"
  control={control}
  render={({ field }) => (
    <FieldSelect
      id="{feature}-status"
      value={field.value}
      options={{FEATURE}_STATUS_OPTIONS}
      onChange={field.onChange}
      invalid={Boolean(errors.status)}
    />
  )}
/>
```

## SearchableSelect — chọn bản ghi từ API (khoá ngoại)

`loadOptions` nhận `{ search, page, pageSize, signal }` — backend lọc + phân trang; trả mảng option hoặc `{ options, hasMore }`. Hàm này là I/O ⇒ đặt ở `services/`; component form **không** import `services/` (luật R6) — page truyền xuống qua prop.

```ts
// services/departmentOptions.ts
import type { SearchableSelectLoadOptions } from '@platform/core'
import http from './req'

export const loadDepartmentOptions: SearchableSelectLoadOptions = async ({ search, page, pageSize, signal }) => {
  const res = await http.get('v1/hrm/departments', { params: { search, page, size: pageSize }, signal })
  const body = res.data as { items?: { id: string; name: string }[]; total?: number }
  const options = (body.items ?? []).map((d) => ({ value: d.id, label: d.name }))
  return { options, hasMore: page * pageSize < (body.total ?? 0) }
}
```

```tsx
// components/{Feature}Form — nhận prop `loadDepartmentOptions: SearchableSelectLoadOptions` từ page
<Controller
  name="departmentId"
  control={control}
  render={({ field }) => (
    <SearchableSelect
      value={field.value ?? ''}
      loadOptions={loadDepartmentOptions}
      onValueChange={(value) => field.onChange(value == null ? null : String(value))}
      placeholder="Chọn phòng ban"
    />
  )}
/>
```

Danh sách tĩnh nhỏ: truyền `options` thay `loadOptions`, kit tự lọc phía client.

## KitDatePicker / KitDateTimePicker / KitTimePicker

```tsx
<Controller
  name="joinDate"
  control={control}
  render={({ field }) => (
    <KitDatePicker id="{feature}-join-date" value={field.value} onChange={field.onChange} />
  )}
/>
```

Ba picker cùng hình: `value` (chuỗi dây) + `onChange(chuỗi dây)`; `hideClearButton` tắt nút xoá (`KitDatePicker`, `KitTimePicker`).

## ToggleSwitch — compound

```tsx
<Controller
  name="isDefault"
  control={control}
  render={({ field }) => (
    <ToggleSwitch.Root
      checked={Boolean(field.value)}
      onCheckedChange={(e: { checked: boolean }) => field.onChange(e.checked)}
      className="relative inline-flex h-6 w-11 shrink-0"
      inputClassName="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0"
      ariaLabel="Mặc định"
    >
      <ToggleSwitch.Control className="pointer-events-none relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors data-[checked]:bg-teal-700">
        <ToggleSwitch.Handle className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform data-[checked]:translate-x-5" />
      </ToggleSwitch.Control>
    </ToggleSwitch.Root>
  )}
/>
```

## PasswordInput

```tsx
<Controller
  name="password"
  control={control}
  render={({ field }) => (
    <PasswordInput
      id="{feature}-password"
      autoComplete="new-password"
      invalid={Boolean(errors.password)}
      value={field.value ?? ''}
      onValueChange={(e: { value?: string | null }) => field.onChange(e.value ?? '')}
      onBlur={field.onBlur}
    />
  )}
/>
```

## Ô tuỳ chọn → `null`

Backend .NET nhận `null` cho trường trống, không nhận `''`:

```tsx
<Textarea {...register('description', { setValueAs: (v: string | null) => (v?.trim() ? v.trim() : null) })} />
```

Schema tương ứng: `z.string().trim().max(n).nullable().optional()`.
