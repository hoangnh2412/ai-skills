import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PrimeReactProvider } from '@primereact/core'
import { Toaster, kitPrimeReactConfig } from '@platform/core'
import App from './App'
import { configureAppHttp } from './app/http'
import './index.css'

// MỘT lần, TRƯỚC render — mọi call* của mọi feature dùng chung instance này
configureAppHttp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Production: thêm license={…} hợp lệ — kit chỉ ẩn badge "Invalid PrimeUI License" bằng CSS */}
      <PrimeReactProvider {...kitPrimeReactConfig}>
        <App />
        <Toaster />
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
)
