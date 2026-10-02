// Đích: src/features/{feature}/components/{Feature}PageShell/{Feature}PageShell.tsx
// Khung page: header (tiêu đề · mô tả · nút) + thân cuộn + footer Hủy/Lưu khi asForm. Thẻ <form> nằm Ở ĐÂY.
import type { FormEventHandler, ReactNode } from 'react'
import { Button, Toolbar } from '@platform/core'
import { btnOutlinedClass, btnPrimaryClass } from '../fieldStyles'

export type {Feature}PageShellProps = {
  title?: string
  description?: string
  headerActions?: ReactNode
  children: ReactNode
  className?: string
  /** Bọc thân trong <form noValidate> + footer Hủy / Lưu */
  asForm?: boolean
  onSubmit?: FormEventHandler<HTMLFormElement>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  submittingLabel?: string
  isSubmitting?: boolean
}

export function {Feature}PageShell({
  title,
  description,
  headerActions,
  children,
  className,
  asForm = false,
  onSubmit,
  onCancel,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
  submittingLabel = 'Đang lưu…',
  isSubmitting = false,
}: {Feature}PageShellProps) {
  const header =
    title || description || headerActions ? (
      <Toolbar.Root className="mb-5 flex w-full shrink-0 flex-col gap-3 border-0 border-b border-line bg-transparent p-0 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <Toolbar.Start className="min-w-0">
          {title && (
            <h2 className="m-0 text-[1.35rem] font-semibold leading-tight tracking-tight text-ink">{title}</h2>
          )}
          {description && (
            <p className="m-0 mt-1.5 max-w-[56ch] text-sm leading-relaxed text-mute">{description}</p>
          )}
        </Toolbar.Start>
        {headerActions && (
          <Toolbar.End className="flex shrink-0 flex-wrap items-center gap-2">{headerActions}</Toolbar.End>
        )}
      </Toolbar.Root>
    ) : null

  const footer = asForm ? (
    <Toolbar.Root className="mt-5 flex w-full shrink-0 justify-end gap-2.5 border-0 border-t border-line bg-transparent p-0 pt-4">
      <Toolbar.End className="flex flex-wrap items-center gap-2.5">
        {onCancel && (
          <Button type="button" unstyled className={btnOutlinedClass} onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" unstyled className={btnPrimaryClass} disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </Toolbar.End>
    </Toolbar.Root>
  ) : null

  const shellClass = [
    'flex h-full min-h-0 w-full animate-slide-up flex-col font-sans text-ink motion-reduce:animate-none',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      {header}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      {footer}
    </>
  )

  if (asForm) {
    return (
      <form onSubmit={onSubmit} noValidate className={shellClass}>
        {body}
      </form>
    )
  }
  return <div className={shellClass}>{body}</div>
}
