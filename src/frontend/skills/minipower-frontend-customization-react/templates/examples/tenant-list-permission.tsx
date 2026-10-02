// Ví dụ host: ẩn thao tác theo quyền trên page kit.
// Nút hiện khi handler tồn tại ⇒ tắt điều hướng mặc định (useRoutes={false}) rồi chỉ truyền handler được phép.
// Xoá / đổi trạng thái luôn gắn trong bảng mặc định ⇒ dựng lại bảng qua slot `content`.
// Quyền ở UI chỉ để ẩn/hiện — backend vẫn phải chặn.
import {
  TENANT_PERMISSIONS,
  TenantListPage,
  TenantTable,
  getTenantCreatePath,
  getTenantDetailPath,
  getTenantEditPath,
  hasTenantPermission,
  navigateTenant,
  type Tenant,
} from '@platform/core'

export type TenantListByPermissionProps = {
  /** Quyền của user hiện tại — host lấy từ API người dùng */
  grants: string[]
}

export function TenantListByPermission({ grants }: TenantListByPermissionProps) {
  const can = (key: string) => hasTenantPermission(grants, key)

  return (
    <TenantListPage
      withQueryBuilder={false}
      useRoutes={false}
      onCreate={can(TENANT_PERMISSIONS.tenantCreate) ? () => navigateTenant(getTenantCreatePath()) : undefined}
      onView={
        can(TENANT_PERMISSIONS.tenantView)
          ? (tenant: Tenant) => navigateTenant(getTenantDetailPath(tenant.id))
          : undefined
      }
      onEdit={
        can(TENANT_PERMISSIONS.tenantEdit)
          ? (tenant: Tenant) => navigateTenant(getTenantEditPath(tenant.id))
          : undefined
      }
      content={(ctx) => (
        <>
          <TenantTable
            items={ctx.items}
            loading={ctx.loading}
            onView={ctx.onView}
            onEdit={ctx.onEdit}
            onDelete={can(TENANT_PERMISSIONS.tenantDelete) ? ctx.requestDelete : undefined}
            onToggleStatus={can(TENANT_PERMISSIONS.tenantStatus) ? ctx.onToggleStatus : undefined}
          />
          {ctx.DefaultPagination}
        </>
      )}
    />
  )
}
