import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, PageHeader } from '@platform/core'
import { mainNav, secondaryNav } from './app/navigation'

function HomePage() {
  return <PageHeader title="Trang chủ" description="App đã gắn @platform/core — thêm feature tiếp theo." />
}

export default function App() {
  return (
    <Routes>
      {/* Route trong AdminLayout = có sidebar + header. Login / màn full-screen đặt NGOÀI khối này. */}
      <Route element={<AdminLayout mainNav={mainNav} secondaryNav={secondaryNav} logoTitle="{AppTitle}" />}>
        <Route index element={<HomePage />} />
        {/* {feature}Routes — minipower-frontend-navigation-react */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
