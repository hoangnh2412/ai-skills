// Đích: src/features/{feature}/components/{Feature}Table/{Feature}Table.tsx
// Bảng trình bày thuần: nhận items + handler, KHÔNG gọi API. Thao tác nào không truyền handler thì không hiện.
// Không bật sort/filter cột của DataTable cho dữ liệu phân trang server — nó chỉ xếp TRANG HIỆN TẠI;
// sort/filter thật gửi lên API qua tham số `sort` / `filter` của page.
import { memo } from 'react'
import { Eye, Pencil, Power, Trash2 } from 'lucide-react'
import { DataTable, ProgressSpinner, RowActions, Tag, type RowActionItem } from '@platform/core'
import { get{Feature}Messages, type {Feature}Locale, type {Feature}Messages } from '../../localization'
import { {FEATURE}_STATUS_LABEL, {Feature}Status, type {Feature} } from '../../types'

export type {Feature}TableProps = {
  items: {Feature}[]
  loading?: boolean
  locale?: {Feature}Locale
  emptyMessage?: string
  onView?: (item: {Feature}) => void
  onEdit?: (item: {Feature}) => void
  onDelete?: (item: {Feature}) => void
  onToggleStatus?: (item: {Feature}) => void
  className?: string
}

const COLUMN_COUNT = 4

const headCellClass = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-mute'

function buildActions(
  item: {Feature},
  messages: {Feature}Messages,
  handlers: Pick<{Feature}TableProps, 'onView' | 'onEdit' | 'onDelete' | 'onToggleStatus'>,
): RowActionItem[] {
  const { onView, onEdit, onDelete, onToggleStatus } = handlers
  const actions: RowActionItem[] = []
  if (onView) actions.push({ id: 'view', label: messages.actions.view, icon: Eye, onClick: () => onView(item) })
  if (onEdit) actions.push({ id: 'edit', label: messages.actions.edit, icon: Pencil, onClick: () => onEdit(item) })
  if (onToggleStatus) {
    actions.push({
      id: 'status',
      label: messages.actions.toggleStatus,
      icon: Power,
      onClick: () => onToggleStatus(item),
    })
  }
  if (onDelete) {
    actions.push({
      id: 'delete',
      label: messages.actions.delete,
      icon: Trash2,
      danger: true,
      separatorBefore: actions.length > 0,
      onClick: () => onDelete(item),
    })
  }
  return actions
}

export const {Feature}Table = memo(function {Feature}Table({
  items,
  loading = false,
  locale = 'vi',
  emptyMessage,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  className,
}: {Feature}TableProps) {
  const messages = get{Feature}Messages(locale)

  return (
    <DataTable.Root
      data={items}
      dataKey="id"
      loading={loading}
      className={['relative overflow-hidden rounded-xl border border-line bg-white shadow-sm', className]
        .filter(Boolean)
        .join(' ')}
    >
      <DataTable.TableContainer className="overflow-x-auto">
        <DataTable.Table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <DataTable.THead>
            <DataTable.THeadRow className="border-b border-line bg-slate-50/80">
              <DataTable.THeadCell className={headCellClass}>{messages.fields.code}</DataTable.THeadCell>
              <DataTable.THeadCell className={headCellClass}>{messages.fields.name}</DataTable.THeadCell>
              <DataTable.THeadCell className={headCellClass}>{messages.fields.status}</DataTable.THeadCell>
              <DataTable.THeadCell className={`${headCellClass} text-right`}>
                {messages.fields.actions}
              </DataTable.THeadCell>
            </DataTable.THeadRow>
          </DataTable.THead>

          <DataTable.TBody>
            {({ item }) => {
              const row = item as {Feature}
              const active = row.status === {Feature}Status.Active
              return (
                <DataTable.Row className="border-b border-line/80 transition-colors last:border-b-0 hover:bg-teal-50/30">
                  <DataTable.Cell className="px-4 py-3">
                    <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">
                      {row.code}
                    </code>
                  </DataTable.Cell>
                  <DataTable.Cell className="px-4 py-3 font-medium text-ink">{row.name}</DataTable.Cell>
                  <DataTable.Cell className="px-4 py-3">
                    <Tag
                      severity={active ? 'success' : 'secondary'}
                      rounded
                      className={[
                        'px-2.5 py-1 text-xs font-medium',
                        active ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-600',
                      ].join(' ')}
                    >
                      {{FEATURE}_STATUS_LABEL[row.status]}
                    </Tag>
                  </DataTable.Cell>
                  <DataTable.Cell className="px-4 py-3 text-right">
                    <RowActions
                      ariaLabel={messages.fields.actions}
                      actions={buildActions(row, messages, { onView, onEdit, onDelete, onToggleStatus })}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              )
            }}
          </DataTable.TBody>

          <DataTable.EmptyTBody>
            <tr>
              <td colSpan={COLUMN_COUNT} className="px-2 py-12 text-center">
                {!loading ? <p className="m-0 text-sm text-mute">{emptyMessage ?? messages.list.empty}</p> : null}
              </td>
            </tr>
          </DataTable.EmptyTBody>
        </DataTable.Table>
      </DataTable.TableContainer>

      <DataTable.Loading className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80">
        <ProgressSpinner.Root className="h-8 w-8">
          <ProgressSpinner.Track />
          <ProgressSpinner.Range />
        </ProgressSpinner.Root>
        <span className="text-sm text-mute">{messages.list.loading}</span>
      </DataTable.Loading>
    </DataTable.Root>
  )
})
