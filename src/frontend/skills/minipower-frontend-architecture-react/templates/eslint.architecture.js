// Luật kiến trúc R1–R7 + M1 — đặt ở gốc repo frontend, cạnh eslint.config.js (convention spread file này).
// Mỗi luật FAIL `npm run lint` khi import sai chiều. Message nêu đúng mã luật — đọc message, đừng tắt luật.
// Flat config: hai khối cùng khớp một file thì khối SAU thay hẳn `no-restricted-imports` của khối trước
// ⇒ mọi khối feature đều mang lại BASE, rồi mới cộng luật riêng của folder.

const FOLDERS =
  'pages|components|hooks|services|validation|types|constants|mocks|routes|menu|permission|localization|theme|utils'

const R1 = {
  regex: '^react-router(-dom)?(/|$)',
  caseSensitive: true,
  message:
    'R1: feature không import react-router — điều hướng qua routes/navigation.ts (configure*Navigate), đọc :id ở host bằng useParams.',
}

const R2 = {
  regex: '^axios(/|$)',
  caseSensitive: true,
  message: 'R2: feature không import axios — gọi API qua services/req.ts (platformHttp dùng chung).',
}

const R3 = {
  regex: '^@platform/core/(?!.*\\.css$)',
  caseSensitive: true,
  message: 'R3: không deep-import kit — chỉ import từ entry "@platform/core" (subpath CSS được phép).',
}

const R4_FEATURE = {
  regex: `^(\\.\\./)+(?!\\.)[^/]+/(${FOLDERS})(/|$)`,
  caseSensitive: true,
  message: 'R4: không import ruột feature khác — chỉ qua barrel của nó (vd. "../../../{feature}").',
}

const R4_HOST = {
  regex: '(^|/)features/[^/]+/',
  caseSensitive: true,
  message: 'R4: host chỉ import feature qua barrel (vd. "./features" hoặc "./features/{feature}").',
}

const R5 = [
  {
    regex: '^(react|react-dom|primereact|@primereact/[^/]+)(/|$)',
    caseSensitive: true,
    message: 'R5: services/ thuần I/O — không import React/UI.',
  },
  {
    regex: '(^|/)(pages|components|hooks)(/|$)',
    caseSensitive: true,
    message: 'R5: services/ không import pages/ components/ hooks/.',
  },
]

const R6_COMPONENTS = {
  regex: '(^|/)(pages|services)(/|$)',
  caseSensitive: true,
  message: 'R6: components/ trình bày thuần — nhận props, không gọi services/, không import pages/.',
}

const R6_HOOKS = {
  regex: '(^|/)(pages|components)(/|$)',
  caseSensitive: true,
  message: 'R6: hooks/ không import pages/ components/.',
}

const R7 = {
  regex: '(^|/)(pages|components|hooks|services)(/|$)',
  caseSensitive: true,
  message: 'R7: tầng lá (types · validation · constants · mocks · routes · menu · permission · localization · theme · utils) không import pages/ components/ hooks/ services/.',
}

// M1 — page còn gọi mock* (nhánh mock tạm khi backend chưa chạy). Máy dev: cảnh báo, vẫn làm việc được.
// CI (runner GitLab/GitHub tự đặt CI=true): lỗi ⇒ chặn merge cho tới khi page đổi sang call*.
const M1 = {
  selector: 'ImportDeclaration > ImportSpecifier[imported.name=/^mock[A-Z]/]',
  message:
    'M1: page đang gọi mock* — chỉ dùng tạm khi DOC-12 đã có mà backend chưa chạy. Đổi sang call* trước khi merge (CI coi là lỗi).',
}

const LEAF = 'types,validation,constants,mocks,routes,menu,permission,localization,theme,utils'

const FEATURE_BASE = [R1, R2, R3, R4_FEATURE]

const restrict = (files, extra = []) => ({
  files,
  rules: { 'no-restricted-imports': ['error', { patterns: [...FEATURE_BASE, ...extra] }] },
})

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: [R3, R4_HOST] }] },
  },
  restrict(['src/features/**/*.{ts,tsx}']),
  restrict(['src/features/*/services/**/*.{ts,tsx}'], R5),
  restrict(['src/features/*/components/**/*.{ts,tsx}'], [R6_COMPONENTS]),
  restrict(['src/features/*/hooks/**/*.{ts,tsx}'], [R6_HOOKS]),
  restrict([`src/features/*/{${LEAF}}/**/*.{ts,tsx}`], [R7]),
  {
    files: ['src/features/*/pages/**/*.{ts,tsx}'],
    rules: { 'no-restricted-syntax': [process.env.CI ? 'error' : 'warn', M1] },
  },
]
