// Đích: src/features/{feature}/constants/fake{Feature}s.ts — NHÁNH MOCK TẠM: dữ liệu giả cho mock*, không import vào page.
// Nguồn duy nhất là seed JSON (mocks/) — sửa dữ liệu giả ở JSON, không sửa ở đây.
import listMock from '../mocks/get-{feature}-list.json'
import type { {Feature} } from '../types'

export const FAKE_{FEATURE}S: {Feature}[] = listMock.items as {Feature}[]
