# Bộ câu hỏi — Kiến trúc & thiết kế

> 3 câu: SOLID, technical debt, Clean Architecture vs Microservices.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 28 | [SOLID là gì? Bạn áp dụng như thế nào?](#câu-28-solid-là-gì-bạn-áp-dụng-như-thế-nào) | 8 | 18 |
| 29 | [Bạn đánh giá và xử lý technical debt như thế nào?](#câu-29-bạn-đánh-giá-và-xử-lý-technical-debt-như-thế-nào) | 8 | 18 |
| 30 | [Clean Architecture vs Microservices: khi nào chọn gì?](#câu-30-clean-architecture-vs-microservices-khi-nào-chọn-gì) | 8 | 18 |
| | **Tổng điểm tối đa** | **24** | **54** |
| | **Tổng ngưỡng đạt (gợi ý)** | **21** | **48** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *24* | |

---

### Câu 28 — SOLID là gì? Bạn áp dụng như thế nào?

#### Mục tiêu đánh giá

- Design principles
- Practical application vs học thuộc
- Balance pragmatism
- Code maintainability

#### Đáp án kỳ vọng tổng quát

| Chữ | Nguyên tắc | Ý ngắn |
|-----|------------|--------|
| S | Single Responsibility | Một class một lý do thay đổi |
| O | Open/Closed | Mở rộng bằng extension, hạn chế sửa core |
| L | Liskov Substitution | Subtype thay thế base không phá hành vi |
| I | Interface Segregation | Interface nhỏ, chuyên biệt |
| D | Dependency Inversion | Phụ thuộc abstraction, không concrete |

**Áp dụng thực tế:** tách service theo use case, inject interface, tránh God class — **không** tạo interface cho mọi class.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Nêu đúng 5 chữ SOLID và ý ngắn | +1 |
| Ví dụ SRP trong code thực tế | +1 |
| Hiểu OCP — mở rộng không sửa core | +1 |
| Hiểu DIP — phụ thuộc interface | +1 |
| Áp dụng ≥ 2 nguyên tắc vào project đã làm | +1 |
| Phân biệt khi dùng interface vs abstract | +1 |
| Tránh God class / fat class | +1 |
| Không over-abstraction (YAGNI) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Học thuộc định nghĩa, không ví dụ | Học vẹt |
| "Luôn phải interface mọi class" | Over-engineering |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| SOLID ở mức module/bounded context | +1 |
| Cân bằng SOLID vs YAGNI/KISS | +1 |
| Code review enforce principle | +1 |
| Anti-pattern God service refactor lead | +1 |
| Link SOLID → testability, change cost | +1 |
| Team coding standard document | +1 |
| Trade-off performance vs purity | +1 |
| Teach junior qua ví dụ thật | +1 |
| Architectural decision không chỉ class | +1 |
| Legacy incremental improve | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **LSP ví dụ Square/Rectangle — lesson?** → inheritance risk
2. **Fat interface `IUserService` 20 methods — fix?** → ISP split
3. **Startup cần SOLID full không?** → pragmatism, evolve

---

### Câu 29 — Bạn đánh giá và xử lý technical debt như thế nào?

#### Mục tiêu đánh giá

- Long-term system health
- Prioritization
- Communication với business
- Pragmatic delivery

#### Đáp án kỳ vọng tổng quát

**Technical debt:** đánh đổi ngắn hạn (tốc độ, workaround) lấy chi phí bảo trì/rủi ro tương lai. **Nhận diện:** code smell, test thiếu, deploy khó, bug lặp, onboarding chậm.

**Xử lý:** inventory debt → đánh giá impact × likelihood → allocate % sprint (ví dụ 20%) → boy scout rule → không chỉ "big bang rewrite" trừ khi có business case.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Định nghĩa technical debt đúng | +1 |
| Nhận diện debt (smell, thiếu test, deploy khó) | +1 |
| Ưu tiên theo impact / risk | +1 |
| Dành thời gian fix trong sprint | +1 |
| Boy scout rule (dọn dần) | +1 |
| Tránh rewrite toàn bộ không căn cứ | +1 |
| Trao đổi với PO/team về rủi ro | +1 |
| Ví dụ debt đã xử lý | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Bỏ qua debt vô hạn | Delivery-only mindset |
| Refactor không đo impact | Waste |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Quantify risk (incident, velocity) | +1 |
| Negotiate debt sprint với PO | +1 |
| Technical roadmap alignment | +1 |
| Strangler fig migration | +1 |
| Prevent debt (standards, arch review) | +1 |
| Metrics: lead time, defect rate | +1 |
| Cost of delay argument | +1 |
| Team tech radar | +1 |
| Stop bleeding trước optimize | +1 |
| Postmortem debt root cause | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **PO nói không có thời gian debt — phản hồi?** → risk language, data
2. **Debt trong module sắp xóa — refactor?** → sunk cost
3. **Làm sao đo debt giảm?** → velocity, bug rate, survey

---

### Câu 30 — Clean Architecture vs Microservices: khi nào chọn gì?

#### Mục tiêu đánh giá

- Architectural literacy
- Scale và team topology
- Trade-off distributed system
- Tránh hype-driven design

#### Đáp án kỳ vọng tổng quát

**Clean Architecture (monolith modular):** tách layer Domain/Application/Infrastructure; dependency inward; phù hợp team nhỏ-vừa, deploy đơn giản, transaction ACID dễ.

**Microservices:** service độc lập deploy, DB riêng, scale riêng; chi phí: network, distributed trace, eventual consistency, DevOps cao.

**Chọn microservices khi:** team lớn cần autonomously scale, domain rõ bounded context, load/scale khác biệt mạnh. **Không chọn khi:** team nhỏ, domain chưa rõ — **distributed monolith** trap.

```
Monolith modular → tách service khi có pain measured (deploy, scale, team)
```

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt monolith vs microservice | +1 |
| Biết layer Clean Architecture (Domain/App/Infra) | +1 |
| Hiểu chi phí network / deploy microservice | +1 |
| Khi **không** nên tách microservice sớm | +1 |
| Bounded context (khái niệm) | +1 |
| Team nhỏ → ưu tiên modular monolith | +1 |
| Tránh distributed monolith | +1 |
| Ví dụ trade-off thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "Microservice vì trendy" | Hype-driven |
| Không biết monolith vẫn scale được | Thiếu thực chiến |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Strangler migration path | +1 |
| Saga vs 2PC trade-off | +1 |
| Team Conway's law alignment | +1 |
| Observability distributed | +1 |
| Failure domain isolation | +1 |
| Cost ops microservice honest | +1 |
| When to extract service checklist | +1 |
| Anti-pattern: nano services | +1 |
| Case study split/merge service | +1 |
| Stakeholder explain không buzzword | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **2 team 1 monolith DB — vấn đề?** → coupling, release train
2. **Microservice 50 service 3 dev —?** → ops nightmare
3. **Clean Architecture quá nhiều layer — symptom?** → over-abstraction

---

