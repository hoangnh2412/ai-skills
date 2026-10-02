// Đích: src/features/{feature}/pages/{Feature}List/{Feature}ListPage.tsx — mẫu THEO ROUTE (tạo/sửa/chi tiết là page riêng).
// Page = điều phối: state + gọi API qua handleAction + ghép component. Hợp đồng props/ctx: customization/reference/page-contract.md
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  FieldSelect,
  InputText,
  ListPagination,
  getErrorMessage,
  handleAction,
  notify,
  useListPagination,
  type ActionProps,
} from '@platform/core'
import { {Feature}PageShell } from '../../components/{Feature}PageShell'
import { {Feature}Table } from '../../components/{Feature}Table'
import { btnPrimaryClass, fieldInputClass } from '../../components/fieldStyles'
import { get{Feature}Messages, type {Feature}Locale } from '../../localization'
import {
  get{Feature}CreatePath,
  get{Feature}DetailPath,
  get{Feature}EditPath,
  navigate{Feature},
} from '../../routes'
import { callDelete{Feature}, callGet{Feature}List, callSet{Feature}Status } from '../../services'
import {
  {FEATURE}_STATUS_OPTIONS,
  {Feature}Status,
  type Get{Feature}ListParams,
  type {Feature},
  type {Feature}StatusValue,
} from '../../types'
import { resolve{Feature}Content, type {Feature}SlotContent } from '../../utils'
import { unwrap{Feature}ListResult } from '../../utils/apiData'

type StatusFilter = {Feature}StatusValue | 'all'

export type {Feature}ListPageContentContext = {
  items: {Feature}[]
  total: number
  loading: boolean
  query: Get{Feature}ListParams
  page: number
  size: number
  totalPages: number
  searchInput: string
  statusFilter: StatusFilter
  setSearchInput: (value: string) => void
  setStatusFilter: (value: StatusFilter) => void
  setPage: (page: number) => void
  setSize: (size: number) => void
  reload: () => Promise<void>
  onCreate?: () => void
  onView?: (item: {Feature}) => void
  onEdit?: (item: {Feature}) => void
  requestDelete: (item: {Feature}) => void
  onToggleStatus: (item: {Feature}) => Promise<void>
  pendingDelete: {Feature} | null
  deleting: boolean
  cancelDelete: () => void
  confirmDelete: () => Promise<void>
  DefaultToolbar: ReactNode
  DefaultTable: ReactNode
  DefaultPagination: ReactNode
  DefaultContent: ReactNode
}

export type {Feature}ListPageProps = {
  /** Truyền `items` ⇒ controlled: page không tự gọi API, báo query qua onQueryChange */
  items?: {Feature}[]
  loading?: boolean
  total?: number
  /** Controlled: PHẢI ổn định (useCallback) — hàm inline làm page gọi lại vô hạn */
  onQueryChange?: (query: Get{Feature}ListParams) => void
  initialQuery?: Partial<Get{Feature}ListParams>
  defaultPageSize?: number
  locale?: {Feature}Locale
  title?: string
  description?: string
  className?: string
  headerActions?: ReactNode
  onCreate?: () => void
  onView?: (item: {Feature}) => void
  onEdit?: (item: {Feature}) => void
  /** `false` = không gắn điều hướng mặc định cho tạo / xem / sửa @default true */
  useRoutes?: boolean
  /** Vòng đời thao tác: before → onSubmit (thay API) → success / error → complete */
  callback?: {
    delete?: ActionProps<{ item: {Feature} }, {Feature}>
    toggleStatus?: ActionProps<{ item: {Feature} }, {Feature}>
  }
  content?: {Feature}SlotContent<{Feature}ListPageContentContext>
  /** @default true */
  withShell?: boolean
  /** `false` = không render ConfirmDialog mặc định (tự dựng bằng ctx.pendingDelete / confirmDelete) @default true */
  withDialogs?: boolean
}

function buildQuery(input: { search: string; status: StatusFilter; page: number; size: number }) {
  const query: Get{Feature}ListParams = { page: input.page, size: input.size }
  const search = input.search.trim()
  if (search) query.search = search
  if (input.status !== 'all') query.status = input.status
  return query
}

export function {Feature}ListPage({
  items: itemsProp,
  loading: loadingProp,
  total: totalProp,
  onQueryChange,
  initialQuery,
  defaultPageSize = 10,
  locale = 'vi',
  title,
  description,
  className,
  headerActions,
  onCreate,
  onView,
  onEdit,
  useRoutes = true,
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
  const [searchInput, setSearchInput] = useState(initialQuery?.search ?? '')
  const [search, setSearch] = useState(initialQuery?.search ?? '')
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>(initialQuery?.status ?? 'all')
  const [pendingDelete, setPendingDelete] = useState<{Feature} | null>(null)
  const [deleting, setDeleting] = useState(false)
  const requestSeq = useRef(0)

  const items = controlled ? itemsProp : internalItems
  const total = controlled ? (totalProp ?? items.length) : internalTotal
  const loading = controlled ? Boolean(loadingProp) : internalLoading

  const { page, size, pageInput, totalPages, setPage, setSize, setPageInput, commitPageInput, resetPage } =
    useListPagination({
      total,
      initialPage: initialQuery?.page ?? 1,
      initialSize: initialQuery?.size ?? defaultPageSize,
    })

  const query = buildQuery({ search, status: statusFilter, page, size })

  // Gõ tìm kiếm: chờ 350ms rồi mới gửi backend, về trang 1
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput === search) return
      setSearch(searchInput)
      resetPage()
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchInput, search, resetPage])

  const reload = useCallback(async () => {
    const nextQuery = buildQuery({ search, status: statusFilter, page, size })
    if (controlled) {
      onQueryChange?.(nextQuery)
      return
    }
    const seq = ++requestSeq.current
    setInternalLoading(true)
    try {
      const result = unwrap{Feature}ListResult(await callGet{Feature}List(nextQuery))
      if (seq !== requestSeq.current) return // response cũ về muộn — bỏ, không đè dữ liệu mới
      setInternalItems(result.items)
      setInternalTotal(result.total)
    } catch (error) {
      if (seq === requestSeq.current) notify.error(getErrorMessage(error, messages.list.loadError))
    } finally {
      if (seq === requestSeq.current) setInternalLoading(false)
    }
  }, [controlled, onQueryChange, search, statusFilter, page, size, messages])

  useEffect(() => {
    void reload()
  }, [reload])

  const setStatusFilter = (value: StatusFilter) => {
    setStatusFilterState(value)
    resetPage()
  }

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
        onSuccess: async () => {
          await reload()
        },
      })
      if (outcome.status === 'cancelled') return
      notify.success(next === {Feature}Status.Active ? messages.status.activated : messages.status.deactivated)
    } catch (error) {
      notify.error(getErrorMessage(error, messages.status.toggleError))
    }
  }

  const handleCreate = onCreate ?? (useRoutes ? () => navigate{Feature}(get{Feature}CreatePath()) : undefined)
  const handleView =
    onView ?? (useRoutes ? (item: {Feature}) => navigate{Feature}(get{Feature}DetailPath(item.id)) : undefined)
  const handleEdit =
    onEdit ?? (useRoutes ? (item: {Feature}) => navigate{Feature}(get{Feature}EditPath(item.id)) : undefined)

  const statusOptions = [
    { value: 'all' as const, label: messages.list.statusAll },
    ...{FEATURE}_STATUS_OPTIONS,
  ]

  const toolbar = (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
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
      <FieldSelect<StatusFilter>
        value={statusFilter}
        options={statusOptions}
        onChange={setStatusFilter}
        className="sm:w-56"
      />
    </div>
  )

  const table = (
    <{Feature}Table
      items={items}
      loading={loading}
      locale={locale}
      onView={handleView}
      onEdit={handleEdit}
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
    query,
    page,
    size,
    totalPages,
    searchInput,
    statusFilter,
    setSearchInput,
    setStatusFilter,
    setPage,
    setSize,
    reload,
    onCreate: handleCreate,
    onView: handleView,
    onEdit: handleEdit,
    requestDelete: setPendingDelete,
    onToggleStatus,
    pendingDelete,
    deleting,
    cancelDelete: () => setPendingDelete(null),
    confirmDelete,
    DefaultToolbar: toolbar,
    DefaultTable: table,
    DefaultPagination: pagination,
    DefaultContent: defaultContent,
  }

  const resolved = resolve{Feature}Content(content, ctx, defaultContent)

  const dialog = withDialogs ? (
    <ConfirmDialog
      open={pendingDelete != null}
      onClose={() => setPendingDelete(null)}
      onConfirm={() => void confirmDelete()}
      loading={deleting}
      title={messages.confirmDelete.title}
      description={pendingDelete ? messages.confirmDelete.description(pendingDelete.code) : undefined}
      confirmText={messages.confirmDelete.confirm}
    />
  ) : null

  if (!withShell) {
    return (
      <>
        {resolved}
        {dialog}
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
            {handleCreate && (
              <Button type="button" unstyled className={btnPrimaryClass} onClick={handleCreate}>
                <Plus className="size-4" aria-hidden />
                {messages.list.create}
              </Button>
            )}
          </>
        }
      >
        {resolved}
      </{Feature}PageShell>
      {dialog}
    </>
  )
}
