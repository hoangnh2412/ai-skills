# Bộ câu hỏi — Phân tích & giải quyết vấn đề

> 2 câu: API chậm, trade-off giải pháp.
>
> **Dành cho Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Senior only.** Chỉ chấm band Senior/câu.

| # | Câu hỏi | Senior (max) |
|---|--------|:------------:|
| 21 | [Nếu API chạy chậm, bạn sẽ phân tích như thế nào?](#câu-21-nếu-api-chạy-chậm-bạn-sẽ-phân-tích-như-thế-nào) | 10 |
| 22 | [Có hai cách giải quyết cùng một vấn đề, bạn chọn theo tiêu chí nào?](#câu-22-có-hai-cách-giải-quyết-cùng-một-vấn-đề-bạn-chọn-theo-tiêu-chí-nào) | 10 |
| | **Tổng điểm tối đa** | **20** |
| | **Tổng ngưỡng đạt (gợi ý)** | **14** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *16* |

---

### Câu 21 — Nếu API chạy chậm, bạn sẽ phân tích như thế nào?

#### Mục tiêu đánh giá

- Systematic troubleshooting
- Observability tools
- Phân tách bottleneck
- Production mindset

#### Đáp án kỳ vọng tổng quát

**Bước:** định nghĩa chậm (p95, endpoint nào) → đo end-to-end (APM: App Insights, Datadog) → chia layer: network, gateway, app, DB, cache, downstream → correlation id trace → kiểm tra log error, timeout, retry storm → DB: slow query, lock, missing index → app: allocation, sync-over-async, N+1 → fix có metric before/after.

**Không:** đoán và tối ưu random; thêm cache mù quáng.

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân tích theo impact (critical path) | +1 |
| Capacity planning / load test | +1 |
| Circuit breaker, bulkhead | +1 |
| Graceful degradation design | +1 |
| Cross-team escalation có data | +1 |
| SLO/error budget mindset | +1 |
| Prevent recurrence (alert, test perf) | +1 |
| Trade-off perf vs correctness | +1 |
| Architecture change proposal | +1 |
| Lead war room incident | +1 |

**Pass criteria:** Senior 7/10

#### Follow-up

1. **Chỉ chậm 9h sáng — nghĩ gì?** → traffic, batch job, cold start
2. **p50 OK nhưng p99 rất chậm — ý nghĩa?** → tail latency, outlier
3. **Sau deploy mới chậm — bước đầu?** → diff, rollback decision

---

### Câu 22 — Có hai cách giải quyết cùng một vấn đề, bạn chọn theo tiêu chí nào?

#### Mục tiêu đánh giá

- Trade-off thinking
- Alignment với business
- Technical debt awareness
- Decision documentation

#### Đáp án kỳ vọng tổng quát

**Tiêu chí so sánh:** correctness, time-to-market, complexity, maintainability, scalability, cost vận hành, rủi ro, team skill, phù hợp roadmap.

**Quy trình:** làm rõ yêu cầu & constraint → liệt kê option → score hoặc pros/cons → POC nhỏ nếu uncertain → quyết định có người accountable → document ADR.

**Senior:** không tìm "best absolute" — tìm **fit-for-context**.

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Business impact là trọng số đầu | +1 |
| Technical debt quantified | +1 |
| Reversibility / migration path | +1 |
| Team capability & bus factor | +1 |
| Compliance/security constraint | +1 |
| Long-term roadmap alignment | +1 |
| Facilitate decision meeting | +1 |
| ADR cho quyết định quan trọng | +1 |
| Biết khi nào "good enough" | +1 |
| Học từ quyết định sai trước | +1 |

**Pass criteria:** Senior 7/10

#### Follow-up

1. **Option A nhanh nhưng nợ kỹ thuật — khi chọn?** → deadline, prototype
2. **Team split 50/50 hai hướng — ai quyết?** → DACI, tech lead, spike
3. **Sau 6 tháng chứng minh chọn sai — làm gì?** → refactor plan, blameless

---

