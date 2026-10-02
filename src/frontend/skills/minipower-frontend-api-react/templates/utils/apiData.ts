// Đích: src/features/{feature}/utils/apiData.ts — nội bộ feature, KHÔNG export qua barrel.
// call* trả AxiosResponse, mock* trả thẳng dữ liệu — unwrap* nhận cả hai.
// Backend bọc envelope `{ data: {...} }` (xem DOC-12) ⇒ unwrapData thêm một lần ở hàm tương ứng, đừng đoán.
import type { {Feature}, {Feature}ListResult } from '../types'

/** AxiosResponse → body; giá trị không có `data` (mock) → giữ nguyên */
export function unwrapData<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function pickNumber(record: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number') return value
  }
  return undefined
}

/** Danh sách: nhận `items | data`, `total | totalCount`, `size | pageSize`, hoặc mảng trần */
export function unwrap{Feature}ListResult(payload: unknown): {Feature}ListResult {
  const body = unwrapData<unknown>(payload)
  if (Array.isArray(body)) {
    return { items: body as {Feature}[], total: body.length }
  }
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    const list = Array.isArray(record.items) ? record.items : Array.isArray(record.data) ? record.data : []
    const items = list as {Feature}[]
    return {
      items,
      total: pickNumber(record, 'total', 'totalCount') ?? items.length,
      page: pickNumber(record, 'page'),
      size: pickNumber(record, 'size', 'pageSize'),
    }
  }
  return { items: [], total: 0 }
}

export function unwrap{Feature}(payload: unknown): {Feature} {
  return unwrapData<{Feature}>(payload)
}
