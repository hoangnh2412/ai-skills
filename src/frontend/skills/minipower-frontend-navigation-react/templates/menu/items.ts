// Đích: src/features/{feature}/menu/items.ts — metadata menu; icon do host chọn khi map sang AdminNavItem.
import { get{Feature}Messages } from '../localization'
import { {FEATURE}_PERMISSIONS } from '../permission/keys'
import { {FEATURE}_ROUTES } from '../routes/paths'

export type {Feature}MenuItem = {
  path: string
  label: string
  permission: string
}

export const {feature}MenuItems: {Feature}MenuItem[] = [
  {
    path: {FEATURE}_ROUTES.list,
    label: get{Feature}Messages().menu.list,
    permission: {FEATURE}_PERMISSIONS.view,
  },
]
