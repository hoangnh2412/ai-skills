// Ví dụ host: nhúng form của page kit vào chỗ khác (dialog, panel) với withShell={false}.
// Bẫy: <form> nằm TRONG shell ⇒ bỏ shell thì host phải tự bọc <form onSubmit={ctx.submit}>, không thì nút submit vô tác dụng.
import { Button, TenantFormPage } from '@platform/core'

export type TenantQuickCreateProps = {
  onDone: () => void
}

export function TenantQuickCreate({ onDone }: TenantQuickCreateProps) {
  return (
    <TenantFormPage
      mode="create"
      withShell={false}
      useRoutes={false}
      showAttachments={false}
      callback={{ success: () => onDone() }}
      content={(ctx) => (
        <form onSubmit={ctx.submit} noValidate className="flex flex-col gap-4">
          {ctx.DefaultContent}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              unstyled
              className="pr-btn-outlined inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium"
              onClick={onDone}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              unstyled
              className="pr-btn-primary inline-flex h-10 items-center rounded-xl border-0 px-4 text-sm font-semibold"
              disabled={ctx.isSubmitting}
            >
              {ctx.isSubmitting ? 'Đang lưu…' : 'Tạo tenant'}
            </Button>
          </div>
        </form>
      )}
    />
  )
}
