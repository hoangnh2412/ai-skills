// Đích: src/features/{feature}/routes/paths.ts — MỘT nguồn path cho page, menu và route của host.
export const {FEATURE}_ROUTES = {
  list: '/{features}',
  create: '/{features}/create',
  detail: '/{features}/:id',
  edit: '/{features}/:id/edit',
} as const

export type {Feature}RouteKey = keyof typeof {FEATURE}_ROUTES

function withId(pattern: string, id: string) {
  return pattern.replace(':id', encodeURIComponent(id))
}

export function get{Feature}ListPath() {
  return {FEATURE}_ROUTES.list
}

export function get{Feature}CreatePath() {
  return {FEATURE}_ROUTES.create
}

export function get{Feature}DetailPath(id: string) {
  return withId({FEATURE}_ROUTES.detail, id)
}

export function get{Feature}EditPath(id: string) {
  return withId({FEATURE}_ROUTES.edit, id)
}
