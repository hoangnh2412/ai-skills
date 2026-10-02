// Đích: src/features/{feature}/services/{feature}Mock.ts — NHÁNH MOCK TẠM, không phải prototype.
// Chỉ khi DOC-12 đã có contract mà backend chưa chạy được; xoá khi backend chạy (CI chặn page còn gọi mock* — luật M1).
// Cùng tham số và cùng shape kết quả (sau unwrap) với call* ⇒ đổi sang API thật chỉ sửa chỗ gọi trong page.
// Lỗi nghiệp vụ: throw new Error('…') — page hiện qua getErrorMessage như lỗi API thật.
import { FAKE_{FEATURE}S } from '../constants'
import {
  {Feature}Status,
  type Create{Feature}Payload,
  type Get{Feature}ListParams,
  type {Feature},
  type {Feature}ListResult,
  type Set{Feature}StatusPayload,
  type Update{Feature}Payload,
} from '../types'

let seq = 1000
const store: {Feature}[] = FAKE_{FEATURE}S.map((item) => ({ ...item }))

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

const clone = (item: {Feature}): {Feature} => ({ ...item })

function findOrThrow(id: string): {Feature} {
  const found = store.find((item) => item.id === id)
  if (!found) throw new Error('Không tìm thấy bản ghi')
  return found
}

function assertUniqueCode(code: string, exceptId?: string) {
  const key = code.trim().toLowerCase()
  if (store.some((item) => item.id !== exceptId && item.code.toLowerCase() === key)) {
    throw new Error('Mã đã tồn tại')
  }
}

export async function mockGet{Feature}List(params: Get{Feature}ListParams = {}): Promise<{Feature}ListResult> {
  await delay()
  const search = params.search?.trim().toLowerCase() ?? ''
  let items = store.map(clone)
  if (search) {
    items = items.filter(
      (item) => item.code.toLowerCase().includes(search) || item.name.toLowerCase().includes(search),
    )
  }
  if (params.status != null) {
    items = items.filter((item) => item.status === params.status)
  }
  const page = params.page ?? 1
  const size = params.size ?? 10
  const start = (page - 1) * size
  return { items: items.slice(start, start + size), total: items.length, page, size }
}

export async function mockGet{Feature}(id: string): Promise<{Feature}> {
  await delay(80)
  return clone(findOrThrow(id))
}

export async function mockCreate{Feature}(data: Create{Feature}Payload): Promise<{Feature}> {
  await delay()
  assertUniqueCode(data.code)
  const item: {Feature} = {
    id: `mock-${++seq}`,
    code: data.code.trim(),
    name: data.name.trim(),
    description: data.description ?? null,
    status: data.status ?? {Feature}Status.Active,
    createdAt: new Date().toISOString(),
  }
  store.push(item)
  return clone(item)
}

export async function mockUpdate{Feature}(id: string, data: Update{Feature}Payload): Promise<{Feature}> {
  await delay()
  const item = findOrThrow(id)
  assertUniqueCode(data.code, id)
  item.code = data.code.trim()
  item.name = data.name.trim()
  item.description = data.description ?? null
  item.updatedAt = new Date().toISOString()
  return clone(item)
}

export async function mockDelete{Feature}(id: string): Promise<void> {
  await delay()
  const index = store.findIndex((item) => item.id === id)
  if (index < 0) throw new Error('Không tìm thấy bản ghi')
  store.splice(index, 1)
}

export async function mockSet{Feature}Status(id: string, data: Set{Feature}StatusPayload): Promise<{Feature}> {
  await delay()
  const item = findOrThrow(id)
  item.status = data.status
  item.updatedAt = new Date().toISOString()
  return clone(item)
}

/** Đưa store về dữ liệu giả ban đầu — tiện cho demo / test */
export function mockReset{Feature}s(): void {
  store.length = 0
  store.push(...FAKE_{FEATURE}S.map((item) => ({ ...item })))
}
