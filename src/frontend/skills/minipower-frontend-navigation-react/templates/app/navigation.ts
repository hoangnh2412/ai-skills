// Đích: src/app/navigation.ts — bản LỌC THEO QUYỀN, thay bản tĩnh của scaffold khi app có phân quyền.
// grants (danh sách quyền của user) do host lấy từ API người dùng hiện tại — kit không tự lấy.
import { LayoutDashboard, LayoutList, type LucideIcon } from 'lucide-react'
import type { AdminNavItem } from '@platform/core'
import { {feature}MenuItems, has{Feature}Permission } from '../features'

type MenuSource = {
  items: readonly { path: string; label: string; permission: string }[]
  can: (grants: readonly string[], key: string) => boolean
  /** Icon lucide hợp nghĩa với feature */
  icon: LucideIcon
}

/** Thêm một dòng cho mỗi feature có *MenuItems */
const MENU_SOURCES: MenuSource[] = [
  { items: {feature}MenuItems, can: has{Feature}Permission, icon: LayoutList },
]

export function buildMainNav(grants: readonly string[]): AdminNavItem[] {
  const home: AdminNavItem = { id: 'home', label: 'Trang chủ', icon: LayoutDashboard, path: '/' }
  const featureNav = MENU_SOURCES.flatMap(({ items, can, icon }) =>
    items
      .filter((item) => can(grants, item.permission))
      .map((item) => ({ id: item.path, label: item.label, path: item.path, icon })),
  )
  return [home, ...featureNav]
}

/** Menu phụ (cài đặt, trợ giúp) — rỗng tới khi có route thật */
export const secondaryNav: AdminNavItem[] = []
