// Đích: src/features/{feature}/localization/vi.ts — bản chuẩn. en.ts khai kiểu {Feature}Messages ⇒ thiếu key là tsc đỏ.
export const viMessages = {
  menu: {
    list: '{Label}',
  },
  routes: {
    list: 'Danh sách {label}',
    create: 'Thêm {label}',
    detail: 'Chi tiết {label}',
    edit: 'Cập nhật {label}',
  },
  fields: {
    code: 'Mã',
    name: 'Tên',
    description: 'Mô tả',
    status: 'Trạng thái',
    createdAt: 'Tạo lúc',
    updatedAt: 'Cập nhật lúc',
    actions: 'Thao tác',
  },
  placeholders: {
    code: 'vd. A001',
    name: 'Nhập tên',
    description: 'Mô tả ngắn…',
    status: 'Chọn trạng thái',
  },
  list: {
    description: 'Quản lý danh sách {label}.',
    searchPlaceholder: 'Tìm theo mã hoặc tên…',
    statusAll: 'Tất cả trạng thái',
    create: 'Thêm mới',
    empty: 'Không có dữ liệu',
    loading: 'Đang tải danh sách…',
    loadError: 'Không tải được danh sách. Vui lòng thử lại.',
    deleteSuccess: 'Đã xoá {label}',
    deleteError: 'Không xoá được. Vui lòng thử lại.',
  },
  form: {
    createTitle: 'Thêm {label}',
    editTitle: 'Cập nhật {label}',
    viewTitle: 'Chi tiết {label}',
    createDescription: 'Nhập thông tin {label} mới.',
    editDescription: 'Chỉnh sửa thông tin {label}.',
    createSubmit: 'Thêm mới',
    editSubmit: 'Lưu thay đổi',
    cancel: 'Hủy',
    submitting: 'Đang lưu…',
    loading: 'Đang tải…',
    saveSuccess: 'Thêm {label} thành công',
    updateSuccess: 'Cập nhật {label} thành công',
    saveError: 'Không lưu được. Vui lòng thử lại.',
    loadError: 'Không tải được dữ liệu. Vui lòng thử lại.',
  },
  actions: {
    view: 'Xem chi tiết',
    edit: 'Chỉnh sửa',
    delete: 'Xoá',
    toggleStatus: 'Đổi trạng thái',
  },
  status: {
    activated: 'Đã kích hoạt {label}',
    deactivated: 'Đã ngừng hoạt động {label}',
    toggleError: 'Không đổi được trạng thái. Vui lòng thử lại.',
  },
  confirmDelete: {
    title: 'Xoá {label}?',
    description: (code: string) => `Bản ghi 「${code}」 sẽ bị xoá khỏi danh sách.`,
    confirm: 'Xoá',
  },
}

export type {Feature}Messages = typeof viMessages
