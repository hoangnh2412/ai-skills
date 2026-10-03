// Đích: src/features/{feature}/types/index.ts — kiểu dữ liệu API, khớp DOC-12. Kiểu form ở validation/ (z.infer), không ở đây.

/** Trạng thái — khớp enum backend. Object `as const` thay `enum` (tsconfig erasableSyntaxOnly). */
export const {Feature}Status = {
  Inactive: 0,
  Active: 1,
} as const

export type {Feature}StatusValue = (typeof {Feature}Status)[keyof typeof {Feature}Status]

export const {FEATURE}_STATUS_LABEL: Record<{Feature}StatusValue, string> = {
  [{Feature}Status.Inactive]: 'Ngừng hoạt động',
  [{Feature}Status.Active]: 'Đang hoạt động',
}

export const {FEATURE}_STATUS_OPTIONS = [
  { value: {Feature}Status.Active, label: {FEATURE}_STATUS_LABEL[{Feature}Status.Active] },
  { value: {Feature}Status.Inactive, label: {FEATURE}_STATUS_LABEL[{Feature}Status.Inactive] },
] as const

/** Trường audit backend trả kèm — để nội bộ, không export (tránh trùng tên khi `export *` nhiều feature) */
type AuditedFields = {
  createdAt: string
  createdBy?: string | null
  updatedAt?: string | null
  updatedBy?: string | null
}

/** DTO đọc */
export type {Feature} = AuditedFields & {
  id: string
  code: string
  name: string
  description?: string | null
  status: {Feature}StatusValue
}

export type Create{Feature}Payload = {
  code: string
  name: string
  description?: string | null
  status?: {Feature}StatusValue
}

export type Update{Feature}Payload = {
  code: string
  name: string
  description?: string | null
}

export type Set{Feature}StatusPayload = {
  status: {Feature}StatusValue
}

/** Query danh sách — khớp PagedListRequest của backend */
export type Get{Feature}ListParams = {
  search?: string
  status?: {Feature}StatusValue
  page?: number
  /** Kích thước trang — query `?size=` */
  size?: number
  /** JSON AST cho FilterParser — dựng bằng `toFilterJson` / `toPagedListParams` của kit */
  filter?: string
  /** vd. `"UpdatedAt:desc,Code:asc"` */
  sort?: string
  /** Tên property cần lấy, phân tách dấu phẩy */
  columns?: string
}

export type {Feature}ListResult = {
  items: {Feature}[]
  total: number
  page?: number
  size?: number
}
