// Ví dụ host: LoginPage nối backend thật.
// Cookie phiên (HttpOnly): giữ callLogin mặc định — không cần callback.
// Bearer: onSubmit gọi callLogin, lấy token theo contract (DOC-12), giao cho kho token của app;
// installBearerAuth (minipower-frontend-api-react/templates/app/auth.ts) gắn header cho request sau.
// Thành công ⇒ page luôn điều hướng về "/"; cần đích khác ⇒ điều hướng lại trong `success`.
import { LoginPage, callLogin, type LoginFormData, type LoginResult } from '@platform/core'

export type AppLoginPageProps = {
  /** Lưu access token — host quyết nơi lưu */
  onAuthenticated?: (accessToken: string) => void
}

export function AppLoginPage({ onAuthenticated }: AppLoginPageProps) {
  return (
    <LoginPage
      showRegisterLink={false}
      callback={{
        // Lỗi ném ra (body lỗi API hoặc Error) ⇒ page hiện toast bằng getErrorMessage
        onSubmit: async (data: LoginFormData) => {
          const response = await callLogin(data)
          const result = response.data as LoginResult
          const token = result.tokens?.accessToken
          if (token) onAuthenticated?.(token)
          return result
        },
      }}
    />
  )
}
