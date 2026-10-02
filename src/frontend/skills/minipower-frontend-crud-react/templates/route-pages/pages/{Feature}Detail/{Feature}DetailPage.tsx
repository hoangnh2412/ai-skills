// Đích: src/features/{feature}/pages/{Feature}Detail/{Feature}DetailPage.tsx
// Truyền `item` ⇒ controlled (host đã có dữ liệu); không truyền ⇒ page tự nạp theo {feature}Id.
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Pencil, Power } from 'lucide-react'
import { Button, Card, Loading, getErrorMessage, handleAction, notify, type ActionProps } from '@platform/core'
import { {Feature}PageShell } from '../../components/{Feature}PageShell'
import { btnOutlinedClass, btnPrimaryClass } from '../../components/fieldStyles'
import { get{Feature}Messages, type {Feature}Locale } from '../../localization'
import { get{Feature}EditPath, navigate{Feature} } from '../../routes'
import { callGet{Feature}, callSet{Feature}Status } from '../../services'
import { {FEATURE}_STATUS_LABEL, {Feature}Status, type {Feature} } from '../../types'
import { resolve{Feature}Content, type {Feature}SlotContent } from '../../utils'
import { unwrap{Feature} } from '../../utils/apiData'

export type {Feature}DetailPageContentContext = {
  item: {Feature} | null
  loading: boolean
  reload: () => Promise<void>
  onEdit?: () => void
  onToggleStatus: () => Promise<void>
  DefaultContent: ReactNode
}

export type {Feature}DetailPageProps = {
  {feature}Id?: string
  /** Controlled — host đã có bản ghi */
  item?: {Feature}
  loading?: boolean
  locale?: {Feature}Locale
  title?: string
  description?: string
  className?: string
  headerActions?: ReactNode
  onEdit?: () => void
  /** `false` = không gắn điều hướng mặc định cho nút Sửa @default true */
  useRoutes?: boolean
  callback?: {
    toggleStatus?: ActionProps<{ item: {Feature} }, {Feature}>
  }
  content?: {Feature}SlotContent<{Feature}DetailPageContentContext>
  /** @default true */
  withShell?: boolean
}

function MetaRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-line/70 py-3.5 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-mute">{term}</dt>
      <dd className="m-0 text-sm text-ink">{children}</dd>
    </div>
  )
}

const formatDateTime = (value?: string | null) => (value ? new Date(value).toLocaleString('vi-VN') : '—')

export function {Feature}DetailPage({
  {feature}Id,
  item: itemProp,
  loading: loadingProp,
  locale = 'vi',
  title,
  description,
  className,
  headerActions,
  onEdit,
  useRoutes = true,
  callback,
  content,
  withShell = true,
}: {Feature}DetailPageProps) {
  const messages = get{Feature}Messages(locale)
  const controlled = itemProp != null

  const [internalItem, setInternalItem] = useState<{Feature} | null>(null)
  const [internalLoading, setInternalLoading] = useState(!controlled && Boolean({feature}Id))

  const item = controlled ? itemProp : internalItem
  const loading = controlled ? Boolean(loadingProp) : internalLoading

  const reload = useCallback(async () => {
    if (controlled || !{feature}Id) return
    setInternalLoading(true)
    try {
      setInternalItem(unwrap{Feature}(await callGet{Feature}({feature}Id)))
    } catch (error) {
      notify.error(getErrorMessage(error, messages.form.loadError))
    } finally {
      setInternalLoading(false)
    }
  }, [controlled, {feature}Id, messages])

  useEffect(() => {
    void reload()
  }, [reload])

  const onToggleStatus = async () => {
    if (!item) return
    const next = item.status === {Feature}Status.Active ? {Feature}Status.Inactive : {Feature}Status.Active
    try {
      const outcome = await handleAction({
        ctx: { item },
        callback: callback?.toggleStatus,
        defaultSubmit: async (target: {Feature}) => {
          await callSet{Feature}Status(target.id, { status: next })
        },
        getPayload: ({ item: target }) => target,
        onSuccess: () => reload(),
      })
      if (outcome.status === 'cancelled') return
      notify.success(next === {Feature}Status.Active ? messages.status.activated : messages.status.deactivated)
    } catch (error) {
      notify.error(getErrorMessage(error, messages.status.toggleError))
    }
  }

  const editId = item?.id ?? {feature}Id
  const handleEdit = onEdit ?? (useRoutes && editId ? () => navigate{Feature}(get{Feature}EditPath(editId)) : undefined)

  const defaultContent =
    loading || !item ? (
      <Loading label={messages.form.loading} className="min-h-[200px]" />
    ) : (
      <Card.Root className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <Card.Body className="px-5">
          <dl className="m-0">
            <MetaRow term={messages.fields.code}>
              <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[13px]">{item.code}</code>
            </MetaRow>
            <MetaRow term={messages.fields.name}>{item.name}</MetaRow>
            <MetaRow term={messages.fields.description}>{item.description || '—'}</MetaRow>
            <MetaRow term={messages.fields.status}>{{FEATURE}_STATUS_LABEL[item.status]}</MetaRow>
            <MetaRow term={messages.fields.createdAt}>{formatDateTime(item.createdAt)}</MetaRow>
            <MetaRow term={messages.fields.updatedAt}>{formatDateTime(item.updatedAt)}</MetaRow>
          </dl>
        </Card.Body>
      </Card.Root>
    )

  const ctx: {Feature}DetailPageContentContext = {
    item,
    loading,
    reload,
    onEdit: handleEdit,
    onToggleStatus,
    DefaultContent: defaultContent,
  }

  const resolved = resolve{Feature}Content(content, ctx, defaultContent)

  if (!withShell) return <>{resolved}</>

  return (
    <{Feature}PageShell
      title={title ?? item?.name ?? messages.routes.detail}
      description={description ?? messages.routes.detail}
      className={className}
      headerActions={
        <>
          {headerActions}
          {item && (
            <Button type="button" unstyled className={btnOutlinedClass} onClick={() => void onToggleStatus()}>
              <Power className="size-4" aria-hidden />
              {messages.actions.toggleStatus}
            </Button>
          )}
          {handleEdit && (
            <Button type="button" unstyled className={btnPrimaryClass} onClick={handleEdit}>
              <Pencil className="size-4" aria-hidden />
              {messages.actions.edit}
            </Button>
          )}
        </>
      }
    >
      {resolved}
    </{Feature}PageShell>
  )
}
