// Đích: src/features/index.ts — barrel tầng module. Host (App.tsx, src/app/*) chỉ import feature qua đây (luật R4).
// Mỗi feature export tên có tiền tố {Feature} ⇒ `export *` không đụng tên nhau.
export * from './{feature}'
