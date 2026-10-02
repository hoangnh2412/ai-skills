// Đích: src/features/{feature}/permission/hasPermission.ts
/** Kiểm quyền phía UI — chỉ để ẩn/hiện. Backend vẫn PHẢI chặn ở API. */
export function has{Feature}Permission(grants: readonly string[], key: string): boolean {
  return grants.includes(key)
}
