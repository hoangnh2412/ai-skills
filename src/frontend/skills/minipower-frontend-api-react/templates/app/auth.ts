// Đích: src/app/auth.ts — CHỈ khi backend xác thực bằng Bearer token.
// Kit mặc định: cookie (withCredentials) + API key tuỳ chọn, CHƯA có Bearer ⇒ host gắn interceptor
// lên instance của kit — KHÔNG tạo axios instance riêng (mất baseURL / API key / chuẩn hoá lỗi).
// Hai instance: platformHttp (mọi feature) + accountHttp (feature account dùng instance riêng).
// Lưu token ở đâu (memory / sessionStorage / cookie) là quyết định bảo mật của dự án — getToken do host cấp.
import { accountHttp, platformHttp } from '@platform/core'

/** Gọi MỘT lần ở main.tsx, sau configureAppHttp. */
export function installBearerAuth(getToken: () => string | null | undefined) {
  for (const instance of [platformHttp, accountHttp]) {
    instance.interceptors.request.use((config) => {
      const token = getToken()
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
      return config
    })
  }
}
