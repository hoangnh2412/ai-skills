// Đích: src/features/{feature}/services/{feature}.ts — một file / một nhóm resource, hàm call* path tương đối.
import type {
  Create{Feature}Payload,
  Get{Feature}ListParams,
  Set{Feature}StatusPayload,
  Update{Feature}Payload,
} from '../types'
import http from './req'

/** Path tương đối (không `/` đầu) — nối sau baseURL VITE_API_URL. Nguồn: DOC-12. */
const BASE = '{apiPath}'

/** Trả AxiosResponse — page lấy body bằng unwrap* trong utils/apiData.ts */
export const callGet{Feature}List = async (params?: Get{Feature}ListParams) => {
  return await http.get(BASE, { params })
}

export const callGet{Feature} = async (id: string) => {
  return await http.get(`${BASE}/${id}`)
}

export const callCreate{Feature} = async (data: Create{Feature}Payload) => {
  return await http.post(BASE, data)
}

export const callUpdate{Feature} = async (id: string, data: Update{Feature}Payload) => {
  return await http.put(`${BASE}/${id}`, data)
}

export const callDelete{Feature} = async (id: string) => {
  return await http.delete(`${BASE}/${id}`)
}

export const callSet{Feature}Status = async (id: string, data: Set{Feature}StatusPayload) => {
  return await http.patch(`${BASE}/${id}/status`, data)
}
