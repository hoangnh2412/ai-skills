// Đích: src/features/{feature}/index.ts — public API CÓ CHỦ ĐÍCH: chỉ thứ host / feature khác cần.
// KHÔNG export: utils/apiData · components/fieldStyles · mock* · FAKE_* (nội bộ, đổi tự do).
// Mẫu dialog (crud): bỏ {Feature}FormPage · {Feature}DetailPage và các path create/detail/edit.

// Pages
export { {Feature}ListPage } from './pages/{Feature}List'
export type { {Feature}ListPageProps, {Feature}ListPageContentContext } from './pages/{Feature}List'
export { {Feature}FormPage } from './pages/{Feature}Form'
export type { {Feature}FormPageProps, {Feature}FormPageContentContext } from './pages/{Feature}Form'
export { {Feature}DetailPage } from './pages/{Feature}Detail'
export type { {Feature}DetailPageProps, {Feature}DetailPageContentContext } from './pages/{Feature}Detail'

// Components dùng lại được (vd. host dựng lại bảng qua slot content)
export { {Feature}Table } from './components/{Feature}Table'
export type { {Feature}TableProps } from './components/{Feature}Table'
export { {Feature}Form } from './components/{Feature}Form'
export type { {Feature}FormProps } from './components/{Feature}Form'

// Types
export { {Feature}Status, {FEATURE}_STATUS_LABEL, {FEATURE}_STATUS_OPTIONS } from './types'
export type {
  {Feature},
  {Feature}StatusValue,
  {Feature}ListResult,
  Create{Feature}Payload,
  Update{Feature}Payload,
  Set{Feature}StatusPayload,
  Get{Feature}ListParams,
} from './types'

// Services — API thật
export {
  callGet{Feature}List,
  callGet{Feature},
  callCreate{Feature},
  callUpdate{Feature},
  callDelete{Feature},
  callSet{Feature}Status,
} from './services'

// Validation · hooks
export { {feature}FormSchema, {feature}FormDefaultValues, to{Feature}FormValues } from './validation'
export type { {Feature}FormData } from './validation'
export { use{Feature}Form } from './hooks'
export type { Use{Feature}FormOptions } from './hooks'

// Routes · menu · permission · localization · slot
export {
  {FEATURE}_ROUTES,
  get{Feature}ListPath,
  get{Feature}CreatePath,
  get{Feature}DetailPath,
  get{Feature}EditPath,
  configure{Feature}Navigate,
  navigate{Feature},
} from './routes'
export type { {Feature}RouteKey, {Feature}NavigateFn } from './routes'
export { {feature}MenuItems } from './menu'
export type { {Feature}MenuItem } from './menu'
export { {FEATURE}_PERMISSIONS, has{Feature}Permission } from './permission'
export type { {Feature}PermissionKey } from './permission'
export { get{Feature}Messages } from './localization'
export type { {Feature}Locale, {Feature}Messages } from './localization'
export { resolve{Feature}Content } from './utils'
export type { {Feature}SlotContent } from './utils'
