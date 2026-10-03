// Đích: src/features/{feature}/mocks/index.ts — NHÁNH MOCK TẠM. Seed JSON chép ĐÚNG hình response trong DOC-12.
// Một file / một lời gọi, tên theo lời gọi: get-{feature}-list.json ↔ callGet{Feature}List.
// Dùng cho mock in-memory (constants/fake*.ts) và cho middleware mock HTTP của host nếu có.
export { default as get{Feature}ListMock } from './get-{feature}-list.json'
