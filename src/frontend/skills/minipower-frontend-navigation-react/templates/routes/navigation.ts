// Đích: src/features/{feature}/routes/navigation.ts — feature KHÔNG import react-router (luật R1).
// Host gắn navigate của router một lần qua NavigateBridge; page gọi navigate{Feature}(path).
export type {Feature}NavigateFn = (to: string) => void

let navigateImpl: {Feature}NavigateFn | null = null

export function configure{Feature}Navigate(fn: {Feature}NavigateFn) {
  navigateImpl = fn
}

export function navigate{Feature}(to: string) {
  if (navigateImpl) {
    navigateImpl(to)
    return
  }
  // Host chưa gắn bridge: đổi URL + phát popstate (không đi qua router — chỉ là đường lùi)
  if (typeof window === 'undefined') return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
