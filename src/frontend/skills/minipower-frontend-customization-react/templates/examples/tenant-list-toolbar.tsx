// Ví dụ host: chèn thêm nút vào page kit bằng slot `content`, GIỮ nguyên UI mặc định.
// ctx mang sẵn dữ liệu + handler của page (items, reload, query…) và các khối Default*.
import { Download } from 'lucide-react'
import { Button, TenantListPage, notify } from '@platform/core'

export function TenantListWithExport() {
  return (
    <TenantListPage
      withQueryBuilder={false}
      content={(ctx) => (
        <>
          <div className="mb-3 flex justify-end">
            <Button
              type="button"
              unstyled
              className="pr-btn-outlined inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium"
              disabled={ctx.loading || ctx.total === 0}
              onClick={() => notify.info(`Xuất ${ctx.total} tenant theo bộ lọc hiện tại`)}
            >
              <Download className="size-4" aria-hidden />
              Xuất Excel
            </Button>
          </div>
          {ctx.DefaultContent}
        </>
      )}
    />
  )
}
