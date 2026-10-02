// Đích: src/features/{feature}/permission/keys.ts — chuỗi quyền khớp grants backend trả về (đặt tên theo backend, không tự chế).
export const {FEATURE}_PERMISSIONS = {
  view: '{feature}.view',
  create: '{feature}.create',
  edit: '{feature}.edit',
  delete: '{feature}.delete',
  status: '{feature}.status',
} as const

export type {Feature}PermissionKey = keyof typeof {FEATURE}_PERMISSIONS
