// Đích: src/app/NavigateBridge.tsx — mount MỘT lần trong App.tsx, cùng cấp <Routes>.
// Mọi feature có configure*Navigate đều gắn ở đây — kể cả page của kit đang mount (configureTenantNavigate, configureRoleNavigate…).
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { configure{Feature}Navigate } from '../features'

export function NavigateBridge() {
  const navigate = useNavigate()

  useEffect(() => {
    const go = (to: string) => navigate(to)
    configure{Feature}Navigate(go)
  }, [navigate])

  return null
}
