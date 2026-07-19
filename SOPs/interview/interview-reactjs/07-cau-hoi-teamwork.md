# Bộ câu hỏi — Teamwork

> 3 câu: review React component, bất đồng kỹ thuật, phối hợp QA/BA/DevOps cho frontend.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 23 | [Khi review React component của đồng đội, bạn góp ý như thế nào?](#câu-23-khi-review-react-component-của-đồng-đội-bạn-góp-ý-như-thế-nào) | 8 | 18 |
| 24 | [Khi bất đồng kỹ thuật với đồng đội, bạn xử lý ra sao?](#câu-24-khi-bất-đồng-kỹ-thuật-với-đồng-đội-bạn-xử-lý-ra-sao) | 8 | 18 |
| 25 | [Phối hợp với QA, BA, DevOps (góc nhìn frontend) như thế nào?](#câu-25-phối-hợp-với-qa-ba-devops-góc-nhìn-frontend-như-thế-nào) | 8 | 18 |
| | **Tổng điểm tối đa** | **24** | **54** |
| | **Tổng ngưỡng đạt (gợi ý)** | **21** | **48** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *24* | |

---

### Câu 23 — Khi review React component của đồng đội, bạn góp ý như thế nào?

#### Mục tiêu đánh giá

- Communication kỹ thuật frontend
- Code quality mindset (component, hooks, state)
- Constructive feedback
- Team culture

#### Đáp án kỳ vọng tổng quát

**Nguyên tắc:** tập trung code không phải người; nêu **vấn đề + impact + gợi ý**; phân loại must-fix vs nitpick; khen điểm tốt; dùng câu hỏi ("Có cân nhắc tách hook không?") thay mệnh lệnh.

**Nội dung review React cụ thể:**

| Hạng mục | Kiểm tra |
|----------|----------|
| Component design | Single responsibility, tách presentational/container, props interface rõ |
| Hooks & state | `useEffect` deps đúng, tránh stale closure, state đặt đúng chỗ (local vs global) |
| Performance | Re-render không cần thiết, `key` ổn định, memo có căn cứ |
| UX & a11y | Loading/error/empty state, label, keyboard, semantic HTML |
| Testing | RTL test cho logic quan trọng, mock API |
| Security | XSS (`dangerouslySetInnerHTML`), không lộ token/secret |
| Scope PR | Không trộn refactor lớn với feature nhỏ |

**Ví dụ comment tốt:** "Effect fetch user phụ thuộc `userId` nhưng deps `[]` — có thể stale data khi route đổi. Gợi ý thêm `userId` vào deps hoặc dùng React Query với `queryKey`."

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Review có trọng tâm (bug/security trước style) | +1 |
| Nêu lý do kỹ thuật rõ (hooks, re-render, deps) | +1 |
| Đề xuất alternative code hoặc pattern | +1 |
| Phân biệt blocker vs suggestion | +1 |
| Kiểm tra loading/error/empty state | +1 |
| PR size hợp lý, feedback phù hợp scope | +1 |
| Follow-up khi author fix | +1 |
| Tôn trọng thời gian author | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Chỉ comment format/đặt tên, bỏ qua effect deps sai | Sai ưu tiên |
| Gatekeeping ("phải dùng Redux") không có căn cứ | Toxic senior behavior |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết lập team review guideline (checklist React) | +1 |
| Mentor qua review (dạy tư duy component/hook) | +1 |
| Cân bằng velocity vs quality | +1 |
| Escalate architectural issue trong PR (state global, coupling) | +1 |
| Giảm repeated comment (ESLint, custom rule, PR template) | +1 |
| Review perf/a11y/security chủ động | +1 |
| Tạo psychological safety | +1 |
| Metrics: review turnaround time | +1 |
| Pair review cho change lớn (routing, design system) | +1 |
| Blameless khi miss bug shipped | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Author không đồng ý comment về `useMemo` — xử lý?** → discuss với profiler/data, rule team, escalate nếu cần
2. **PR 1500 dòng refactor toàn bộ folder components — làm gì?** → yêu cầu split PR, review theo module
3. **Review bot (ESLint/TypeScript) vs human — phân công?** → bot style/type; human logic, UX, architecture

---

### Câu 24 — Khi bất đồng kỹ thuật với đồng đội, bạn xử lý ra sao?

#### Mục tiêu đánh giá

- Conflict resolution
- Evidence-based discussion
- Ego management
- Delivery vs principle

#### Đáp án kỳ vọng tổng quát

**Quy trình:** align mục tiêu chung (UX, deadline, maintainability) → nghe hết quan điểm → đưa dữ kiện (Lighthouse, bundle size, POC, docs React) → time-box thảo luận → nếu không chốt: escalate tech lead / architect → **disagree and commit** sau quyết định.

**Ví dụ bất đồng frontend:** Context vs Zustand vs React Query; CSS Modules vs Tailwind; client-side filter vs server-side pagination; inline style vs design system token.

**Tránh:** cãi cảm tính ("cách cũ hay hơn"), im lặng nuối ý kiến, block PR passive-aggressive, ép pattern không phù hợp scale.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Tranh luận bằng dữ kiện (metric, POC) | +1 |
| POC/spike nhỏ để so sánh option | +1 |
| Tách vấn đề kỹ thuật vs cảm xúc | +1 |
| Document pros/cons (ADR ngắn) | +1 |
| Biết khi nhượng bộ hợp lý | +1 |
| Disagree and commit | +1 |
| Escalate đúng lúc | +1 |
| Retrospective sau conflict | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Cố thắng bằng kinh nghiệm cá nhân không data | Toxic |
| Block tiến độ vì ego (refactor không liên quan) | Delivery risk |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Facilitate meeting hiệu quả | +1 |
| Chốt quyết định có accountability | +1 |
| Giữ quan hệ lâu dài | +1 |
| Phát hiện conflict sớm 1-1 | +1 |
| Align với business/UX không chỉ tech | +1 |
| Thiết lập decision framework team (state, styling, testing) | +1 |
| De-escalate căng thẳng | +1 |
| Mentor mid trong conflict | +1 |
| Biết khi cần thay đổi ý kiến | +1 |
| Post-decision review | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Senior chọn pattern state sai nhưng junior biết — nói thế nào?** → respect, data (re-render chart), private trước
2. **Deadline ép dùng thư viện không phù hợp — xử lý?** → document debt, communicate risk PO
3. **Frontend vs backend đổ lỗi API chậm làm UI lag — vai trò senior?** → facilitate, trace waterfall, đề xuất skeleton/pagination

---

### Câu 25 — Phối hợp với QA, BA, DevOps (góc nhìn frontend) như thế nào?

#### Mục tiêu đánh giá

- Cross-functional collaboration
- Requirement clarity (UI/UX)
- Release readiness
- Communication proactive

#### Đáp án kỳ vọng tổng quát

**BA / Design:**

- Làm rõ acceptance criteria theo màn hình, trạng thái UI (loading, empty, error, permission denied)
- Edge case: responsive breakpoint, validation message, empty search
- Mock/wireframe sớm; báo impact khi requirement đổi giữa sprint
- Confirm copy, i18n, date/number format

**QA:**

- Cung cấp test note: route, role, viewport, browser
- `data-testid` hoặc selector ổn định cho automation
- Repro steps kèm network tab / console khi báo bug
- Không "works on my machine" — ghi rõ env, build version
- Hỗ trợ E2E (Playwright/Cypress) hook, seed data

**DevOps:**

- Build Vite/webpack pass; env var (`VITE_*`) document
- Preview deploy URL cho QA/stakeholder
- Source map, cache header static asset
- Feature flag frontend (nếu có)
- Rollback plan; không deploy Friday không monitor
- Bundle size budget trong CI

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Viết test case gợi ý cho QA (happy/edge path UI) | +1 |
| Tham gia refinement / design review | +1 |
| Estimate có buffer integration API/design | +1 |
| CI pipeline frontend hiểu cơ bản (lint, test, build) | +1 |
| Environment parity (staging ≈ prod config) | +1 |
| Release note / changelog UI feature | +1 |
| Hotfix process biết | +1 |
| DevOps ticket (CDN, env, preview) chủ động | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Throw bug qua lại không log/repro | Waste |
| Deploy preview không báo QA | Regression miss |
| Hardcode API URL staging trong code | Env hygiene kém |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế handoff giảm lỗi (design token, component spec) | +1 |
| Definition of Ready/Done tham gia (a11y, perf budget) | +1 |
| Shift-left testing advocate (RTL, visual regression) | +1 |
| Production readiness review (CSP, error tracking) | +1 |
| Incident collaboration blameless | +1 |
| Stakeholder communication risk (scope creep UI) | +1 |
| Cross-team dependency map (API contract, design system) | +1 |
| Mentor junior collaboration | +1 |
| Process improvement initiative | +1 |
| Metrics defect escape rate / Core Web Vitals | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **BA đổi layout giữa sprint — xử lý?** → impact estimate, re-prioritize, không silent rework
2. **QA báo cannot reproduce bug UI — làm gì?** → video, HAR, browser/version, feature flag state
3. **DevOps từ chối deploy vì bundle vượt budget — phản ứng?** → analyze chunk, lazy load, negotiate budget

---
