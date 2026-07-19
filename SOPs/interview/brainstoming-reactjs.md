# Brainstorming — Phỏng vấn React / Frontend Developer

> Trao đổi yêu cầu **theo vị trí này**.  
> Bối cảnh chung (nỗi đau, luồng AI, yêu cầu level, phạm vi chung): [brainstoming.md](./brainstoming.md)  
> **Kết quả làm việc (dự kiến):** [interview-reactjs/](./interview-reactjs/)

---

## Vị trí & phạm vi kỹ thuật

| | |
|--|--|
| **Vị trí** | React / Frontend developer |
| **Stack trọng tâm** | JavaScript/TypeScript, React, state, routing, performance, testing, bảo mật frontend |
| **Thư mục skill** | `interview-reactjs/` |

**Phạm vi câu hỏi (dự kiến — chưa chốt danh sách câu):**

| Nhóm | Gợi ý chủ đề |
|------|----------------|
| **Cơ bản** | JS/TS nền, React component, props/state, hooks cơ bản, event, list/key |
| **Nâng cao** | Custom hooks, context, memo/useMemo/useCallback, error boundary, Suspense |
| **State & data** | Redux/Zustand/React Query, server state vs client state, form (controlled) |
| **Routing & app** | React Router, lazy load, code splitting |
| **Performance** | re-render, virtualization, bundle size, Core Web Vitals |
| **Testing** | RTL, Jest/Vitest, mock API |
| **Bảo mật** | XSS, CSRF, token storage, env secrets |
| **Thực hành** | Live: form/feature nhỏ · Review: component có lỗi (hooks, effect, state, a11y) |

*Áp dụng cùng khung level 9 bậc và format chấm (+1/tiêu chí) như .NET — xem [interview-dotnet/](./interview-dotnet/) làm mẫu cấu trúc.*

---

## Lịch sử yêu cầu (React)

### Format chấm điểm (áp dụng chung)

Theo [brainstoming.md](./brainstoming.md): mỗi câu có Junior / Mid / Senior (+ điều kiện tiên quyết), red flags, pass criteria, follow-up.

**Ví dụ chủ đề mẫu (chưa viết file):** *`useState` vs `useReducer` — khi nào dùng gì?*

- **Junior:** biết local state, ví dụ form đơn giản
- **Mid:** quy tắc chọn reducer, tránh prop drilling
- **Senior:** scale form phức tạp, test, performance

### Level 9 bậc — ghi chú riêng Frontend

- **Junior 3:** page CRUD đơn giản, gọi API, routing cơ bản, UI theo design
- **Mid 1:** tích hợp thư viện UI/state theo hướng dẫn; phối hợp QA/design
- **Mid 2+:** feature độc lập, tối ưu bundle/re-render, review code frontend

→ Khi có bộ câu hỏi: ghi chi tiết trong `interview-reactjs/01-tong-quan.md`

### Rubric theo band (dự kiến)

| Band | File (dự kiến) |
|------|----------------|
| **Junior** | Cơ bản JS/React |
| **Mid** | Cơ bản sâu + nâng cao + state + quy trình + live code |
| **Senior** | + phân tích, kiến trúc frontend, review code, bảo mật sâu |

*Chưa tách file — sẽ mirror cấu trúc `interview-dotnet/` khi triển khai.*

### Tái cấu trúc tài liệu

1. **brainstoming.md** — overview + luồng AI (chung)
2. **brainstoming-reactjs.md** — trao đổi riêng vị trí này (file này)
3. **interview-reactjs/** — 14 file: câu hỏi, live/review code, HR, form

→ Đã tách xong: [interview-reactjs/README.md](./interview-reactjs/README.md)

---

## Trạng thái

| Hạng mục | Trạng thái |
|----------|------------|
| Ngân hàng 33 câu + rubric | ✅ [interview-reactjs/](./interview-reactjs/) |
| Live code + review code | ✅ [11-live-code-product-list.md](./interview-reactjs/11-live-code-product-list.md), [12-review-code.md](./interview-reactjs/12-review-code.md) |
| AI tự chấm + luồng online | ⏳ Chưa triển khai (dùng chung luồng [brainstoming.md](./brainstoming.md)) |

**Bước tiếp theo (React):** luồng ứng viên → AI chấm → báo cáo HR theo rubric [02](./interview-reactjs/02-tieu-chi-danh-gia.md).
