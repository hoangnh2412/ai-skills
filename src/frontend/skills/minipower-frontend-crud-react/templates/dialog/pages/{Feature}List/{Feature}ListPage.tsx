// Đích: src/features/{feature}/pages/{Feature}List/{Feature}ListPage.tsx — mẫu THEO DIALOG:
// một route duy nhất; tạo / sửa / xem trong FeatureDialog; MỘT form instance, reset mỗi lần mở dialog.
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  FeatureDialog,
  InputText,
  ListPagination,
  getErrorMessage,
  handleAction,
  notify,
  useListPagination,
  type ActionProps,
} from '@platform/core'
import { {Feature}Form } from '../../components/{Feature}Form'
import { {Feature}PageShell } from '../../components/{Feature}PageShell'
import { {Feature}Table } from '../../components/{Feature}Table'
import { btnPrimaryClass, fieldInputClass } from '../../components/fieldStyles'
import { use{Feature}Form } from '../../hooks'
import { get{Feature}Messages, type {Feature}Locale } from '../../localization'
import {
  callCreate{Feature},
  callDelete{Feature},
  callGet{Feature}List,
  callSet{Feature}Status,
  callUpdate{Feature},
} from '../../services'
import {
  {FEATURE}_STATUS_LABEL,
  {Feature}Status,
  type Get{Feature}ListParams,
  type {Feature},
} from '../../types'
import { resolve{Feature}Content, type {Feature}SlotContent } from '../../utils'
import { unwrap{Feature}ListResult } from '../../utils/apiData'
import {
  {feature}FormDefaultValues,
  to{Feature}FormValues,
  type {Feature}FormData,
} from '../../validation'

type DialogMode = 'create' | 'edit' | 'view' | null

export type {Feature}ListPageContentContext = {
  items: {Feature}[]
  total: number
  loading: boolean
  searchInput: string
  setSearchInput: (value: string) => void
  reload: () => Promise<void>
  openCreate: () => void
  openEdit: (item: {Feature}) => void
  openView: (item: {Feature}) => void
  requestDelete: (item: {Feature}) => void
  onToggleStatus: (item: {Feature}) => Promise<void>
  DefaultToolbar: ReactNode
  DefaultTable: ReactNode
  DefaultPagination: ReactNode
  DefaultDialogs: ReactNode
  DefaultContent: ReactNode
}

export type {Feature}ListPageProps = {
  /** Truyền `items` ⇒ controlled; onQueryChange PHẢI ổn định (useCallback) */
  items?: {Feature}[]
  loading?: boolean
  total?: number
  onQueryChange?: (query: Get{Feature}ListParams) => void
  defaultPageSize?: number
  locale?: {Feature}Locale
  title?: string
  description?: string
  className?: string
  headerActions?: ReactNode
  callback?: {
    create?: ActionProps<{ data: {Feature}FormData }, {Feature}FormData>
    update?: ActionProps<{ item: {Feature}; data: {Feature}FormData }, { id: string; data: {Feature}FormData }>
    delete?: ActionProps<{ item: {Feature} }, {Feature}>
    toggleStatus?: ActionProps<{ item: {Feature} }, {Feature}>
  }
  content?: {Feature}SlotContent<{Feature}ListPageContentContext>
  /** @default true */
  withShell?: boolean
  /** `false` = không render dialog mặc định (dùng ctx.DefaultDialogs ở chỗ khác) @default true */
  withDialogs?: boolean
}

export function {Feature}ListPage({
  items: itemsProp,
  loading: loadingProp,
  total: totalProp,
  onQueryChange,
  defaultPageSize = 10,
  locale = 'vi',
  title,
  description,
  className,
  headerActions,
  callback,
  content,
  withShell = true,
  withDialogs = true,
}: {Feature}ListPageProps) {
  const messages = get{Feature}Messages(locale)
  const controlled = itemsProp != null

  const [internalItems, setInternalItems] = useState<{Feature}[]>([])
  const [internalTotal, setInternalTotal] = useState(0)
  const [internalLoading, setInternalLoading] = useState(!controlled)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selected, setSelected] = useState<{Feature} | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{Feature} | null>(null)
  const [deleting, setDeleting] = useState(false)
  const requestSeq = useRef(0)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = use{Feature}Form()

  const items = controlled ? itemsProp : internalItems
  const total = controlled ? (totalProp ?? items.length) : internalTotal
  const loading = controlled ? Boolean(loadingProp) : internalLoading

  const { page, size, pageInput, totalPages, setPage, setSize, setPageInput, commitPageInput, resetPage } =
    useListPagination({ total, initialSize: defaultPageSize })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput === search) return
      setSearch(searchInput)
      resetPage()
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchInput, search, resetPage])

  const reload = useCallback(async () => {
    const query: Get{Feature}ListParams = { page, size }
    if (search.trim()) query.search = search.trim()
    if (controlled) {
      onQueryChange?.(query)
      return
    }
    const seq = ++requestSeq.current
    setInternalLoading(true)
    try {
      const result = unwrap{Feature}ListResult(await callGet{Feature}List(query))
      if (seq !== requestSeq.current) return
      setInternalItems(result.items)
      setInternalTotal(result.total)
    } catch (error) {
      if (seq === requestSeq.current) notify.error(getErrorMessage(error, messages.list.loadError))
    } finally {
      if (seq === requestSeq.current) setInternalLoading(false)
    }
  }, [controlled, onQueryChange, search, page, size, messages])

  useEffect(() => {
    void reload()
  }, [reload])

  const closeDialog = () => {
    setDialogMode(null)
    setSelected(null)
  }

  const openCreate = () => {
    setSelected(null)
    reset({feature}FormDefaultValues)
    setDialogMode('create')
  }

  const openEdit = (item: {Feature}) => {
    setSelected(item)
    reset(to{Feature}FormValues(item))
    setDialogMode('edit')
  }

  const openView = (item: {Feature}) => {
    setSelected(item)
    setDialogMode('view')
  }

  const onSave = handleSubmit(async (data) => {
    try {
      if (dialogMode === 'create') {
        const outcome = await handleAction({
          ctx: { data },
          callback: callback?.create,
          defaultSubmit: async (payload: {Feature}FormData) => {
            await callCreate{Feature}({
              code: payload.code,
              name: payload.name,
              description: payload.description ?? null,
              status: payload.status,
            })
          },
          getPayload: ({ data: payload }) => payload,
          onSuccess: async () => {
            closeDialog()
            await reload()
          },
        })
        if (outcome.status === 'cancelled') return
        notify.success(messages.form.saveSuccess)
        return
      }
      if (dialogMode === 'edit' && selected) {
        const outcome = await handleAction({
          ctx: { item: selected, data },
          callback: callback?.update,
          defaultSubmit: async ({ id, data: payload }: { id: string; data: {Feature}FormData }) => {
            await callUpdate{Feature}(id, {
              code: payload.code,
              name: payload.name,
              description: payload.description ?? null,
            })
          },
          getPayload: ({ item, data: payload }) => ({ id: item.id, data: payload }),
          onSuccess: async () => {
            closeDialog()
            await reload()
          },
        })
        if (outcome.status === 'cancelled') return
        notify.success(messages.form.updateSuccess)
      }
    } catch (error) {
      notify.error(getErrorMessage(error, messages.form.saveError))
    }
  })

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const outcome = await handleAction({
        ctx: { item: pendingDelete },
        callback: callback?.delete,
        defaultSubmit: async (item: {Feature}) => {
          await callDelete{Feature}(item.id)
        },
        getPayload: ({ item }) => item,
        onSuccess: async () => {
          setPendingDelete(null)
          await reload()
        },
      })
      if (outcome.status === 'cancelled') return
      notify.success(messages.list.deleteSuccess)
    } catch (error) {
      notify.error(getErrorMessage(error, messages.list.deleteError))
    } finally {
      setDeleting(false)
    }
  }

  const onToggleStatus = async (item: {Feature}) => {
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

  const toolbar = (
    <div className="relative mb-4 w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <InputText
        unstyled
        value={searchInput}
        placeholder={messages.list.searchPlaceholder}
        aria-label={messages.list.searchPlaceholder}
        className={`${fieldInputClass} pl-9`}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
      />
    </div>
  )

  const table = (
    <{Feature}Table
      items={items}
      loading={loading}
      locale={locale}
      onView={openView}
      onEdit={openEdit}
      onDelete={setPendingDelete}
      onToggleStatus={onToggleStatus}
    />
  )

  const pagination = (
    <ListPagination
      total={total}
      page={page}
      size={size}
      pageInput={pageInput}
      totalPages={totalPages}
      loading={loading}
      onPageChange={setPage}
      onSizeChange={setSize}
      onPageInputChange={setPageInput}
      onCommitPageInput={commitPageInput}
    />
  )

  const dialogs = (
    <>
      <FeatureDialog
        open={dialogMode === 'create' || dialogMode === 'edit'}
        onClose={closeDialog}
        title={dialogMode === 'edit' ? messages.form.editTitle : messages.form.createTitle}
        onSubmit={onSave}
        submitting={isSubmitting}
        submitLabel={dialogMode === 'edit' ? messages.form.editSubmit : messages.form.createSubmit}
        cancelLabel={messages.form.cancel}
      >
        <{Feature}Form
          register={register}
          control={control}
          errors={errors}
          locale={locale}
          hideStatus={dialogMode === 'edit'}
        />
      </FeatureDialog>

      <FeatureDialog
        open={dialogMode === 'view' && selected != null}
        onClose={closeDialog}
        title={messages.form.viewTitle}
        cancelLabel={messages.form.cancel}
      >
        {selected ? (
          <dl className="m-0 grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-sm">
            <dt className="text-mute">{messages.fields.code}</dt>
            <dd className="m-0 font-mono">{selected.code}</dd>
            <dt className="text-mute">{messages.fields.name}</dt>
            <dd className="m-0">{selected.name}</dd>
            <dt className="text-mute">{messages.fields.description}</dt>
            <dd className="m-0">{selected.description || '—'}</dd>
            <dt className="text-mute">{messages.fields.status}</dt>
            <dd className="m-0">{{FEATURE}_STATUS_LABEL[selected.status]}</dd>
          </dl>
        ) : null}
      </FeatureDialog>

      <ConfirmDialog
        open={pendingDelete != null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        loading={deleting}
        title={messages.confirmDelete.title}
        description={pendingDelete ? messages.confirmDelete.description(pendingDelete.code) : undefined}
        confirmText={messages.confirmDelete.confirm}
      />
    </>
  )

  const defaultContent = (
    <>
      {toolbar}
      {table}
      {pagination}
    </>
  )

  const ctx: {Feature}ListPageContentContext = {
    items,
    total,
    loading,
    searchInput,
    setSearchInput,
    reload,
    openCreate,
    openEdit,
    openView,
    requestDelete: setPendingDelete,
    onToggleStatus,
    DefaultToolbar: toolbar,
    DefaultTable: table,
    DefaultPagination: pagination,
    DefaultDialogs: dialogs,
    DefaultContent: defaultContent,
  }

  const resolved = resolve{Feature}Content(content, ctx, defaultContent)

  if (!withShell) {
    return (
      <>
        {resolved}
        {withDialogs ? dialogs : null}
      </>
    )
  }

  return (
    <>
      <{Feature}PageShell
        title={title ?? messages.routes.list}
        description={description ?? messages.list.description}
        className={className}
        headerActions={
          <>
            {headerActions}
            <Button type="button" unstyled className={btnPrimaryClass} onClick={openCreate}>
              <Plus className="size-4" aria-hidden />
              {messages.list.create}
            </Button>
          </>
        }
      >
        {resolved}
      </{Feature}PageShell>
      {withDialogs ? dialogs : null}
    </>
  )
}
