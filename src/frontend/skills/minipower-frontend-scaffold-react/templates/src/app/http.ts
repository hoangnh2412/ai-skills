import { configurePlatformHttp } from '@platform/core'

/** Gọi MỘT lần ở main.tsx, trước render. Mọi feature dùng chung axios instance này (platformHttp). */
export function configureAppHttp() {
  configurePlatformHttp({
    baseURL: import.meta.env.VITE_API_URL,
    // Chỉ có hiệu lực khi backend dùng API key — để trống thì không gắn header
    apiKey: import.meta.env.VITE_API_KEY,
    apiKeyHeader: import.meta.env.VITE_API_KEY_NAME,
  })
}
