# Bộ câu hỏi — Phân tích & giải quyết vấn đề

> 2 câu: UI chậm/jank, trade-off hai hướng UI.
>
> **Dành cho Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.
>
> **Tham chiếu:** [brainstoming-reactjs.md](../brainstoming-reactjs.md) · [14-form-phong-van.md](./14-form-phong-van.md)

---

## Mục lục

> **Senior only.** Chỉ chấm band Senior/câu.

| # | Câu hỏi | Senior (max) |
|---|--------|:------------:|
| 21 | [Nếu UI chậm/jank, bạn sẽ phân tích như thế nào?](#câu-21-nếu-ui-chậmjank-bạn-sẽ-phân-tích-như-thế-nào) | 10 |
| 22 | [Có hai cách giải quyết cùng một vấn đề UI, bạn chọn theo tiêu chí nào?](#câu-22-có-hai-cách-giải-quyết-cùng-một-vấn-đề-ui-bạn-chọn-theo-tiêu-chí-nào) | 10 |
| | **Tổng điểm tối đa** | **20** |
| | **Tổng ngưỡng đạt (gợi ý)** | **14** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *16* |

---

### Câu 21 — Nếu UI chậm/jank, bạn sẽ phân tích như thế nào?

#### Mục tiêu đánh giá

- Systematic frontend troubleshooting
- Observability và profiling tools
- Phân tách bottleneck (network, JS, render, layout)
- Production mindset (Core Web Vitals)

#### Đáp án kỳ vọng tổng quát

**Bước phân tích:**

1. **Định nghĩa chậm:** user report vs metric — LCP, INP, CLS, TTFB; trang/route/action nào (p95)
2. **Đo end-to-end:** Lighthouse, WebPageTest, RUM (Vercel Speed Insights, Datadog RUM)
3. **Network:** waterfall (API chậm, asset lớn, thiếu cache, không gzip/brotli)
4. **JavaScript:** bundle size (analyzer), long tasks, main thread block
5. **React:** DevTools Profiler — component re-render nhiều, commit duration, why did this render?
6. **Layout/Paint:** Chrome Performance panel — forced reflow, layout thrashing
7. **Fix có before/after metric** — không đoán memo random

```text
User: "Filter product lag"
→ Profiler: ProductList re-render 500 row mỗi keystroke
→ Fix: debounce + virtualize + memo row
→ Verify: INP giảm, Profiler commit < 16ms
```

**Không:** thêm `useMemo` mù; blame API mà chưa xem waterfall.

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân tích theo impact user journey (critical path) | +1 |
| React DevTools Profiler đọc flamegraph | +1 |
| Bundle analyzer + code split decision | +1 |
| Core Web Vitals (LCP, INP, CLS) liên hệ fix | +1 |
| Network vs render vs layout tách bước | +1 |
| RUM/production data trước local guess | +1 |
| Prevent recurrence (perf budget CI, alert) | +1 |
| Trade-off perf vs correctness/feature | +1 |
| Cross-team escalation có data (API vs FE) | +1 |
| Lead investigation / war room frontend | +1 |

**Red flags Senior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Chỉ nói "thêm memo" không profile | Fake senior |
| Không biết INP/LCP | Thiếu production frontend |

**Pass criteria:** Senior 7/10

#### Follow-up

1. **Chỉ chậm mobile — nghĩ gì?** → CPU yếu, bundle lớn, touch handler, image size
2. **Sau deploy mới jank — bước đầu?** → diff bundle, rollback, feature flag
3. **p50 OK p99 chậm — ý nghĩa?** → outlier device, long task tail

---

### Câu 22 — Có hai cách giải quyết cùng một vấn đề UI, bạn chọn theo tiêu chí nào?

#### Mục tiêu đánh giá

- Trade-off thinking frontend
- Alignment với business và UX
- Technical debt awareness
- Decision documentation

#### Đáp án kỳ vọng tổng quát

**Ví dụ cặp trade-off:**

| Vấn đề | Option A | Option B |
|--------|----------|----------|
| Product filter | Client filter (đã load hết data) | Server filter + pagination |
| Styling | CSS Modules | Tailwind / CSS-in-JS |
| State | Context + useReducer | Zustand + React Query |
| Render list | Pagination | Infinite scroll + virtualize |

**Tiêu chí so sánh:** UX (latency perceived), time-to-market, complexity team, maintainability, scalability data size, a11y, SEO, cost vận hành, skill team, roadmap.

**Quy trình:** làm rõ constraint (10k SKU? mobile first?) → pros/cons có số liệu (POC, bundle KB, Lighthouse) → quyết định accountable → ADR ngắn.

**Senior:** không "best absolute" — **fit-for-context** (startup MVP vs enterprise catalog).

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Business/UX impact là trọng số đầu | +1 |
| Technical debt quantified | +1 |
| Reversibility / migration path | +1 |
| Team capability & design system fit | +1 |
| Data size / perf constraint explicit | +1 |
| a11y và i18n trong decision | +1 |
| Facilitate decision meeting có data | +1 |
| ADR cho quyết định quan trọng | +1 |
| Biết khi nào "good enough" ship | +1 |
| Học từ quyết định sai (postmortem) | +1 |

**Red flags Senior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Luôn chọn công nghệ team thích | Bias |
| Không xét data scale | Short-sighted |

**Pass criteria:** Senior 7/10

#### Follow-up

1. **Client filter nhanh ship nhưng catalog 50k item — khi chấp nhận A?** → MVP ngắn hạn + plan migrate server filter
2. **Design muốn animation nặng — perf budget?** → negotiate, reduced motion, measure
3. **Sau 6 tháng chọn sai CSS-in-JS — làm gì?** → strangler migrate, không big bang

---
