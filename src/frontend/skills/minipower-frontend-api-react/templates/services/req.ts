// Đích: src/features/{feature}/services/req.ts
// MỘT axios instance cho cả app — host cấu hình một lần bằng configurePlatformHttp ở bootstrap.
// Không axios.create trong feature: mất baseURL, API key và chuẩn hoá lỗi của kit.
export { platformHttp as default } from '@platform/core'
