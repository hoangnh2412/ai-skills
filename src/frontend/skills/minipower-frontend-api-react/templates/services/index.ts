// Đích: src/features/{feature}/services/index.ts — barrel NỘI BỘ của services (page import từ đây).
export {
  callGet{Feature}List,
  callGet{Feature},
  callCreate{Feature},
  callUpdate{Feature},
  callDelete{Feature},
  callSet{Feature}Status,
} from './{feature}'
