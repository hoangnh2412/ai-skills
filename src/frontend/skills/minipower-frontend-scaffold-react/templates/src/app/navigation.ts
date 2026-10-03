import { LayoutDashboard } from 'lucide-react'
import type { AdminNavItem } from '@platform/core'

/**
 * Menu chính — thay menu demo của kit (DEFAULT_ADMIN_MAIN_NAV trỏ /users, /templates… chưa có route).
 * Thêm feature: minipower-frontend-navigation-react (add-menu); cần lọc quyền thì chuyển sang buildMainNav(grants).
 */
export const mainNav: AdminNavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: LayoutDashboard, path: '/' },
]

/** Menu phụ (cài đặt, trợ giúp) — rỗng tới khi có route thật */
export const secondaryNav: AdminNavItem[] = []
