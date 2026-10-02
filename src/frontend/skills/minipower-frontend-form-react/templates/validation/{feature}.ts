// Đích: src/features/{feature}/validation/{feature}.ts — schema + kiểu form + giá trị mặc định + map entity → form.
// Ràng buộc (bắt buộc, độ dài) khớp backend theo DOC-12 / DOC-11 — lệch là form cho qua mà API trả 400.
import { z } from 'zod'
import { {Feature}Status, type {Feature} } from '../types'

export const {feature}FormSchema = z.object({
  code: z.string().trim().min(1, 'Vui lòng nhập mã').max(64, 'Mã tối đa 64 ký tự'),
  name: z.string().trim().min(1, 'Vui lòng nhập tên').max(256, 'Tên tối đa 256 ký tự'),
  description: z.string().trim().max(1000, 'Mô tả tối đa 1000 ký tự').nullable().optional(),
  status: z.union([z.literal({Feature}Status.Inactive), z.literal({Feature}Status.Active)]),
})

export type {Feature}FormData = z.infer<typeof {feature}FormSchema>

export const {feature}FormDefaultValues: {Feature}FormData = {
  code: '',
  name: '',
  description: null,
  status: {Feature}Status.Active,
}

/** Bản ghi API → giá trị form (khi sửa). Một chỗ map — page và dialog cùng dùng. */
export function to{Feature}FormValues(item: {Feature}): {Feature}FormData {
  return {
    code: item.code,
    name: item.name,
    description: item.description ?? null,
    status: item.status,
  }
}
