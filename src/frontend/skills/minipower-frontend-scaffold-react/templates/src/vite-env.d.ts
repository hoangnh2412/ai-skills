/// <reference types="vite/client" />

// Khai báo biến VITE_* app dùng — thêm biến mới thì thêm dòng ở đây và trong .env.example
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_API_KEY?: string
  readonly VITE_API_KEY_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
