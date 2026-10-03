// Ví dụ host: RoleListPage mặc định chạy MOCK (dữ liệu giả, mất khi reload).
// Nối API thật: thao tác ghi qua callback.*.onSubmit; danh sách qua chế độ controlled (items/total/loading).
// Entry kit không export call*Role ⇒ host gọi platformHttp theo path trong DOC-12.
// Giới hạn hiện tại của page: chưa phát onQueryChange ⇒ controlled chỉ nạp được một lần, chưa phân trang server.
import { useCallback, useEffect, useState } from 'react'
import {
  RoleListPage,
  getErrorMessage,
  notify,
  platformHttp,
  type Role,
  type RoleFormData,
} from '@platform/core'

const ROLES = 'v1/roles'

const roleApi = {
  list: async (): Promise<Role[]> => {
    const res = await platformHttp.get(ROLES, { params: { page: 1, size: 100 } })
    const body = res.data as { items?: Role[] }
    return body.items ?? []
  },
  create: async (data: RoleFormData): Promise<Role> => (await platformHttp.post(ROLES, data)).data as Role,
  update: async (id: string, data: RoleFormData): Promise<Role> =>
    (await platformHttp.put(`${ROLES}/${id}`, data)).data as Role,
  remove: async (id: string): Promise<void> => {
    await platformHttp.delete(`${ROLES}/${id}`)
  },
  setPermissions: async (id: string, permissions: string[]): Promise<Role> =>
    (await platformHttp.put(`${ROLES}/${id}/permissions`, { permissions })).data as Role,
}

export function RoleListWithApi() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      setRoles(await roleApi.list())
    } catch (error) {
      notify.error(getErrorMessage(error, 'Không tải được danh sách vai trò'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  // Controlled: page không tự nạp lại sau khi ghi ⇒ host nạp lại trong `success`
  return (
    <RoleListPage
      items={roles}
      total={roles.length}
      loading={loading}
      callback={{
        create: { onSubmit: roleApi.create, success: () => reload() },
        update: { onSubmit: ({ id, data }) => roleApi.update(id, data), success: () => reload() },
        delete: { onSubmit: (role) => roleApi.remove(role.id), success: () => reload() },
        updatePermissions: {
          onSubmit: ({ id, permissions }) => roleApi.setPermissions(id, permissions),
          success: () => reload(),
        },
      }}
    />
  )
}
