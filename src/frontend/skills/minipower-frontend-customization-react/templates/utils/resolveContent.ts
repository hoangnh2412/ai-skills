// Đích: src/features/{feature}/utils/resolveContent.ts — helper slot `content` cho page của feature.
import type { ReactNode } from 'react'

/** ReactNode = thay hẳn phần nội dung; (ctx) => ReactNode = dựng lại từ ctx (DefaultContent, DefaultTable…) */
export type {Feature}SlotContent<TContext> = ReactNode | ((ctx: TContext) => ReactNode)

export function resolve{Feature}Content<TContext>(
  content: {Feature}SlotContent<TContext> | undefined,
  ctx: TContext,
  fallback: ReactNode,
): ReactNode {
  if (content == null) return fallback
  if (typeof content === 'function') {
    return (content as (ctx: TContext) => ReactNode)(ctx)
  }
  return content
}
