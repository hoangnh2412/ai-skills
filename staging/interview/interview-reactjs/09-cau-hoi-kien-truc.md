# Bộ câu hỏi — Kiến trúc & thiết kế Frontend

> 3 câu: component architecture, technical debt frontend, micro-frontend vs SPA monolith.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 28 | [Component architecture: bạn tổ chức code React như thế nào?](#câu-28-component-architecture-bạn-tổ-chức-code-react-như-thế-nào) | 8 | 18 |
| 29 | [Bạn đánh giá và xử lý technical debt frontend như thế nào?](#câu-29-bạn-đánh-giá-và-xử-lý-technical-debt-frontend-như-thế-nào) | 8 | 18 |
| 30 | [Micro-frontend vs SPA monolith: khi nào chọn gì?](#câu-30-micro-frontend-vs-spa-monolith-khi-nào-chọn-gì) | 8 | 18 |
| | **Tổng điểm tối đa** | **24** | **54** |
| | **Tổng ngưỡng đạt (gợi ý)** | **21** | **48** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *24* | |

---

### Câu 28 — Component architecture: bạn tổ chức code React như thế nào?

#### Mục tiêu đánh giá

- Component design patterns
- Folder structure thực tế
- Composition vs inheritance
- Maintainability ở scale vừa

#### Đáp án kỳ vọng tổng quát

**Container / Presentational (Smart / Dumb):**

| Loại | Trách nhiệm | Ví dụ |
|------|-------------|-------|
| Container | Fetch data, state logic, orchestration | `ProductListPage`, `useProductList` hook |
| Presentational | Render UI thuần, nhận props | `ProductCard`, `Pagination`, `SearchInput` |

**Feature folders (khuyến nghị cho app vừa-lớn):**

```
src/
  features/
    products/
      components/
      hooks/
      api/
      types/
      ProductListPage.tsx
  shared/
    ui/          # Button, Modal — design system
    lib/         # fetch wrapper, formatDate
  app/           # router, providers
```

**Composition over inheritance:** dùng `children`, render props, compound component (`<Tabs><Tabs.List/>...</Tabs>`) thay extends class.

**Nguyên tắc:**

- Colocation: code gần nơi dùng
- Shared UI tách `shared/ui`; business logic trong feature
- Custom hook tách logic khỏi JSX
- Tránh prop drilling sâu — Context hoặc composition khi cần
- Không over-split component 5 dòng

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt container vs presentational | +1 |
| Feature folder hoặc module theo domain | +1 |
| Composition (`children`, slot) thay inheritance | +1 |
| Custom hook tách logic | +1 |
| Shared UI vs feature component | +1 |
| Colocation file liên quan | +1 |
| Tránh God component (500+ dòng) | +1 |
| Ví dụ cấu trúc project đã làm | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Mọi file trong `components/` phẳng, không domain | Khó scale |
| "Luôn tách 10 component con cho mọi màn" | Over-engineering |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Design system boundary rõ | +1 |
| Public API feature module (barrel export có kiểm soát) | +1 |
| State architecture decision (local/server/global) | +1 |
| Lazy load route theo feature | +1 |
| Enforce structure qua ESLint boundary / CODEOWNERS | +1 |
| Migrate legacy folder → feature incrementally | +1 |
| Teach team qua ADR / guild session | +1 |
| Trade-off colocation vs reuse | +1 |
| Test strategy theo layer (RTL unit vs E2E) | +1 |
| Align với design token / Figma component | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Khi nào không tách presentational?** → component nhỏ, logic gắn chặt, YAGNI
2. **`shared/` phình to thành junk drawer — xử lý?** → audit, promote design system, deprecate
3. **Cross-feature import trực tiếp — rủi ro?** → coupling, circular dep; dùng shared contract

---

### Câu 29 — Bạn đánh giá và xử lý technical debt frontend như thế nào?

#### Mục tiêu đánh giá

- Long-term frontend health
- Prioritization
- Communication với business
- Pragmatic delivery

#### Đáp án kỳ vọng tổng quát

**Technical debt frontend:** đánh đổi ngắn hạn (copy-paste component, hack CSS, effect deps `[]` mọi nơi, thiếu test) lấy chi phí bảo trì/rủi ro tương lai.

**Nhận diện:**

| Dấu hiệu | Ví dụ |
|----------|-------|
| Code smell | Duplicate form logic, inline style lặp, magic string route |
| Perf | Re-render cascade, bundle > budget, LCP chậm |
| DX | Build chậm, onboarding 2 tuần mới hiểu folder |
| Quality | Bug UI lặp sau mỗi release, flaky E2E |
| Dependency | React 17 + lib deprecated, security advisory |

**Xử lý:** inventory debt → impact × likelihood → allocate % sprint (15–20%) → boy scout rule → strangler refactor từng feature → tránh rewrite SPA "big bang" trừ khi có business case (vd. framework EOL).

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Định nghĩa technical debt đúng | +1 |
| Nhận diện debt frontend cụ thể | +1 |
| Ưu tiên theo impact / user / dev velocity | +1 |
| Dành thời gian fix trong sprint | +1 |
| Boy scout rule (dọn khi chạm file) | +1 |
| Tránh rewrite toàn SPA không căn cứ | +1 |
| Trao đổi với PO về rủi ro | +1 |
| Ví dụ debt đã xử lý | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Bỏ qua debt, chỉ ship feature | Delivery-only |
| Refactor không đo (bundle/bug vẫn như cũ) | Waste |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Quantify risk (LCP, error rate, lead time) | +1 |
| Negotiate debt sprint với PO | +1 |
| Frontend technical roadmap | +1 |
| Strangler migration (page-by-page) | +1 |
| Prevent debt (lint rule, arch review, template) | +1 |
| Metrics: bundle size trend, defect rate | +1 |
| Cost of delay argument | +1 |
| Team tech radar (deps, patterns) | +1 |
| Stop bleeding (flaky test, hotfix loop) trước optimize | +1 |
| Postmortem debt root cause | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **PO nói không có thời gian — phản hồi?** → user impact, bug cost, velocity slowdown data
2. **Module sắp xóa — refactor?** → sunk cost, chỉ fix blocker
3. **Đo debt giảm?** → velocity, bug rate, Lighthouse, dev survey

---

### Câu 30 — Micro-frontend vs SPA monolith: khi nào chọn gì?

#### Mục tiêu đánh giá

- Architectural literacy frontend
- Team topology & deploy independence
- Trade-off runtime integration
- Tránh hype-driven design

#### Đáp án kỳ vọng tổng quát

**SPA monolith (single React app):**

- Một codebase, một build, deploy một artifact (`dist/`)
- Routing client-side (React Router)
- Phù hợp team nhỏ-vừa, domain gắn, release đồng bộ
- Code splitting + lazy route đã giải quyết phần lớn scale bundle

**Micro-frontend (MFE):**

- Nhiều app độc lập (Module Federation, iframe, Web Components, single-spa)
- Team autonomously deploy từng shell/sub-app
- Chi phí: shared dependency version, routing cross-app, UX consistency, observability phân tán, performance (load nhiều runtime)

**Chọn MFE khi:**

- Nhiều team lớn (>8–10 dev) cùng một portal
- Release cycle khác nhau mạnh (team A daily, team B monthly)
- Legacy app cần embed dần (strangler)
- Bounded context UI rõ (billing vs catalog vs admin)

**Không chọn MFE khi:**

- Team nhỏ, 1 product — **distributed UI monolith** (phức tạp không cần thiết)
- Chưa có design system / shared auth ổn định

```
SPA modular (feature folder) → MFE khi đo được pain (deploy conflict, bundle, team scale)
```

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt SPA monolith vs micro-frontend | +1 |
| Biết code splitting / lazy route trong SPA | +1 |
| Hiểu chi phí integration MFE (routing, style, auth) | +1 |
| Khi **không** nên tách MFE sớm | +1 |
| Module Federation hoặc shell app (khái niệm) | +1 |
| Team nhỏ → ưu tiên SPA modular | +1 |
| Tránh duplicate React runtime | +1 |
| Ví dụ trade-off thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "Micro-frontend vì trendy" | Hype-driven |
| Không biết SPA vẫn scale được với lazy load | Thiếu thực chiến |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Strangler migration path (iframe → federation) | +1 |
| Shared design system cross MFE | +1 |
| Conway's law alignment | +1 |
| Observability distributed (RUM per app) | +1 |
| Auth/session cross subdomain | +1 |
| Version skew / compatibility strategy | +1 |
| Cost ops MFE honest (build matrix, deploy) | +1 |
| When to extract sub-app checklist | +1 |
| Case study split hoặc merge lại SPA | +1 |
| Stakeholder explain không buzzword | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **2 team 1 SPA, conflict merge liên tục — MFE hay monorepo?** → monorepo + ownership trước; MFE nếu deploy independence là pain chính
2. **Module Federation React version khác nhau — rủi ro?** → singleton shared, alignment release
3. **SEO cần — SPA vs MFE vs SSR?** → Next.js/Remix; MFE không thay SSR

---
