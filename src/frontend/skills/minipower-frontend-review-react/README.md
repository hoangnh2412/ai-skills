# minipower-frontend-review-react

Skill review code **TypeScript / React** trước khi mở PR/MR hoặc trước khi người review xem. Checklist đầy đủ — React, bất đồng bộ, form, bảo mật, hiệu năng và luật kit `@platform/core` — trong [SKILL.md](./SKILL.md).

## Khi nào dùng

- Trước khi tạo PR/MR frontend
- Xong feature / fix, muốn bắt bug và rủi ro production sớm
- Cần ý kiến thứ hai về effect, race condition, form, quyền, hợp đồng page của kit

**Không dùng cho:** format, đặt tên, import sai chiều — `tsc` + ESLint gác ([convention](../minipower-frontend-convention-react/README.md) · [architecture](../minipower-frontend-architecture-react/README.md)) · review code C# → [backend review](../../../backend/skills/minipower-backend-review-dotnet/README.md).

## Cách gọi

```text
Review code trước PR theo @.opencode/skills/minipower-frontend-review-react/SKILL.md
Base branch: develop
```

```text
Review các file sau theo skill minipower-frontend-review-react:
- src/features/employee/pages/EmployeeList/EmployeeListPage.tsx
- src/features/employee/services/employee.ts
```

## Chuẩn bị

| Việc | Lý do |
|---|---|
| Commit hoặc stage thay đổi | Agent lấy diff từ git |
| Biết base branch | Mặc định `<base>...HEAD` |
| `npm run typecheck` + `npm run lint` đã xanh | Review không lặp việc của máy |

## Đọc kết quả

| Section | Ý nghĩa |
|---|---|
| **Critical Issues** | Phải sửa trước merge — bảo mật, mất dữ liệu, race, logic luồng chính, phá contract |
| **Suggestions** | Nên sửa — lỗi / edge case, validate lệch backend, perf có bằng chứng, thiếu test |
| **Best Practices & Improvements** | Có giá trị, không khẩn |
| **Summary** | Theo file + `overall`: `merge-ready` / `needs changes` / `blocked` |

Không có vấn đề: **No significant issues found**. Thiếu ngữ cảnh: **Need more context**.

## Liên quan

- [minipower-frontend-convention-react](../minipower-frontend-convention-react/README.md) — lớp máy gác style
- [minipower-frontend-customization-react](../minipower-frontend-customization-react/README.md) — hợp đồng page của kit
- Bản đồ module: [frontend/README.md](../../README.md)
