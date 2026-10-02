// Ví dụ host: chế độ controlled — host tự nạp dữ liệu, page chỉ hiển thị và báo query qua onQueryChange.
// onQueryChange PHẢI ổn định (useCallback): page gọi lại khi tham chiếu đổi ⇒ hàm inline gây nạp lặp vô hạn.
import { useCallback, useState } from 'react'
import {
  TenantListPage,
  callGetTenantList,
  getErrorMessage,
  notify,
  type GetTenantListParams,
  type Tenant,
} from '@platform/core'

export function TenantListControlled() {
  const [items, setItems] = useState<Tenant[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleQueryChange = useCallback(async (query: GetTenantListParams) => {
    setLoading(true)
    try {
      const res = await callGetTenantList(query)
      const body = res.data as { items?: Tenant[]; total?: number }
      setItems(body.items ?? [])
      setTotal(body.total ?? 0)
    } catch (error) {
      notify.error(getErrorMessage(error, 'Không tải được danh sách tenant'))
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <TenantListPage
      withQueryBuilder={false}
      items={items}
      total={total}
      loading={loading}
      onQueryChange={handleQueryChange}
    />
  )
}
