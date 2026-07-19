# Bộ câu hỏi — Teamwork

> 3 câu: code review, bất đồng kỹ thuật, phối hợp QA/BA/DevOps.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 23 | [Khi review code của đồng đội, bạn góp ý như thế nào?](#câu-23-khi-review-code-của-đồng-đội-bạn-góp-ý-như-thế-nào) | 8 | 18 |
| 24 | [Khi bất đồng kỹ thuật với đồng đội, bạn xử lý ra sao?](#câu-24-khi-bất-đồng-kỹ-thuật-với-đồng-đội-bạn-xử-lý-ra-sao) | 8 | 18 |
| 25 | [Phối hợp với QA, BA, DevOps như thế nào?](#câu-25-phối-hợp-với-qa-ba-devops-như-thế-nào) | 8 | 18 |
| | **Tổng điểm tối đa** | **24** | **54** |
| | **Tổng ngưỡng đạt (gợi ý)** | **21** | **48** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *24* | |

---

### Câu 23 — Khi review code của đồng đội, bạn góp ý như thế nào?

#### Mục tiêu đánh giá

- Communication kỹ thuật
- Code quality mindset
- Constructive feedback
- Team culture

#### Đáp án kỳ vọng tổng quát

**Nguyên tắc:** tập trung code không phải người; nêu **vấn đề + impact + gợi ý**; phân loại must-fix vs nitpick; khen điểm tốt; dùng câu hỏi ("Có cân nhắc X không?") thay mệnh lệnh.

**Nội dung review:** correctness, security, test, naming, performance risk, maintainability, scope creep PR.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Review có trọng tâm (critical first) | +1 |
| Nêu lý do kỹ thuật rõ | +1 |
| Đề xuất alternative code | +1 |
| Phân biệt blocker vs suggestion | +1 |
| Kiểm tra test coverage | +1 |
| PR size hợp lý feedback | +1 |
| Follow-up khi author fix | +1 |
| Tôn trọng thời gian author | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Bike-shedding style nhỏ, bỏ qua security | Sai ưu tiên |
| Gatekeeping kiến thức | Toxic senior behavior |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết lập team review guideline | +1 |
| Mentor qua review (dạy tư duy) | +1 |
| Cân bằng velocity vs quality | +1 |
| Escalate architectural issue trong PR | +1 |
| Giảm repeated comment (lint, template) | +1 |
| Review security/perf chủ động | +1 |
| Tạo psychological safety | +1 |
| Metrics: review turnaround time | +1 |
| Pair review cho change lớn | +1 |
| Blameless khi miss bug shipped | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Author không đồng ý comment — xử lý?** → discuss, rule, escalate
2. **PR 2000 dòng — làm gì?** → split, review strategy
3. **Review bot vs human — phân工?** → automate style, human logic

---

### Câu 24 — Khi bất đồng kỹ thuật với đồng đội, bạn xử lý ra sao?

#### Mục tiêu đánh giá

- Conflict resolution
- Evidence-based discussion
- Ego management
- Delivery vs principle

#### Đáp án kỳ vọng tổng quát

**Quy trình:** align mục tiêu chung → nghe hết quan điểm → đưa dữ kiện (metric, POC, docs) → time-box thảo luận → nếu không chốt: escalate tech lead / architect → **disagree and commit** sau quyết định.

**Tránh:** cãi cảm tính, im lặng nuối ý kiến, block PR passive-aggressive.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Tranh luận bằng dữ kiện | +1 |
| POC để so sánh option | +1 |
| Tách vấn đề kỹ thuật vs cảm xúc | +1 |
| Document pros/cons | +1 |
| Biết khi nhượng bộ hợp lý | +1 |
| Disagree and commit | +1 |
| Escalate đúng lúc | +1 |
| Retrospective sau conflict | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Cố thắng bằng chức danh | Toxic |
| Block tiến độ vì ego | Delivery risk |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Facilitate meeting hiệu quả | +1 |
| Chốt quyết định có accountability | +1 |
| Giữ quan hệ lâu dài | +1 |
| Phát hiện conflict sớm 1-1 | +1 |
| Align với business không chỉ tech | +1 |
| Thiết lập decision framework team | +1 |
| De-escalate căng thẳng | +1 |
| Mentor mid trong conflict | +1 |
| Biết khi cần thay đổi ý kiến | +1 |
| Post-decision review | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Senior sai nhưng junior biết — nói thế nào?** → respect, data, private first
2. **Deadline ép chọn giải pháp tệ — xử lý?** → document debt, communicate risk
3. **Hai team backend vs frontend đổ lỗi — vai trò senior?** → facilitate, trace

---

### Câu 25 — Phối hợp với QA, BA, DevOps như thế nào?

#### Mục tiêu đánh giá

- Cross-functional collaboration
- Requirement clarity
- Release readiness
- Communication proactive

#### Đáp án kỳ vọng tổng quát

**BA:** làm rõ acceptance criteria, edge case, mock data, thay đổi requirement sớm báo impact.

**QA:** cung cấp test note, test data, API contract; fix bug có repro; không "works on my machine"; hỗ trợ automation hook.

**DevOps:** Dockerfile, env var, migration script, health check; CI pass; rollback plan; không throw-over-wall deploy Friday.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Viết test case gợi ý cho QA | +1 |
| Tham gia refinement meeting | +1 |
| Estimate có buffer integration | +1 |
| CI pipeline hiểu cơ bản | +1 |
| Environment parity awareness | +1 |
| Release note / changelog | +1 |
| Hotfix process biết | +1 |
| DevOps ticket (infra) chủ động | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Throw bug qua lại không log | Waste |
| Deploy không báo QA | Regression miss |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế handoff giảm lỗi | +1 |
| Definition of Ready/Done tham gia | +1 |
| Shift-left testing advocate | +1 |
| Production readiness review | +1 |
| Incident collaboration blameless | +1 |
| Stakeholder communication risk | +1 |
| Cross-team dependency map | +1 |
| Mentor junior collaboration | +1 |
| Process improvement initiative | +1 |
| Metrics defect escape rate | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **BA đổi requirement giữa sprint — xử lý?** → impact, re-prioritize
2. **QA báo cannot reproduce — làm gì?** → log, video, env spec
3. **DevOps từ chối deploy vì security scan — phản ứng?** → fix, waive process?

---

