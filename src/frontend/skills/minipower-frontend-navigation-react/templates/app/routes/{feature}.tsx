// Đích: src/app/routes/{feature}.tsx — route của feature + wrapper đọc :id (feature không import react-router).
// Mẫu dialog (một màn danh sách): chỉ giữ route `list`, bỏ hai wrapper.
import { Route, useParams } from 'react-router-dom'
import {
  {FEATURE}_ROUTES,
  {Feature}DetailPage,
  {Feature}FormPage,
  {Feature}ListPage,
} from '../../features'

function {Feature}DetailRoute() {
  const { id = '' } = useParams()
  return <{Feature}DetailPage {feature}Id={id} />
}

function {Feature}EditRoute() {
  const { id = '' } = useParams()
  return <{Feature}FormPage mode="edit" {feature}Id={id} />
}

/** Đặt bên trong <Route element={<AdminLayout … />}> của App.tsx */
export const {feature}Routes = (
  <>
    <Route path={{FEATURE}_ROUTES.list} element={<{Feature}ListPage />} />
    <Route path={{FEATURE}_ROUTES.create} element={<{Feature}FormPage mode="create" />} />
    <Route path={{FEATURE}_ROUTES.detail} element={<{Feature}DetailRoute />} />
    <Route path={{FEATURE}_ROUTES.edit} element={<{Feature}EditRoute />} />
  </>
)
