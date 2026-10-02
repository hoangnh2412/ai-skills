// Đích: src/features/{feature}/routes/index.ts
export {
  {FEATURE}_ROUTES,
  get{Feature}ListPath,
  get{Feature}CreatePath,
  get{Feature}DetailPath,
  get{Feature}EditPath,
} from './paths'
export type { {Feature}RouteKey } from './paths'

export { configure{Feature}Navigate, navigate{Feature} } from './navigation'
export type { {Feature}NavigateFn } from './navigation'
