# [INC-YYYY-NNN] Tiêu đề sự cố ngắn gọn

> **Mẫu báo cáo sự cố** — dùng khi điều tra lỗi production / staging.  
> Tham chiếu ví dụ đã điền một phần: [`sign-error-currency.md`](./sign-error-currency.md)  
> **Trạng thái tài liệu:** `Draft` | `Investigating` | `Mitigated` | `Resolved` | `Closed`

---

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Mã sự cố** | INC-YYYY-NNN |
| **Ngày phát hiện** | YYYY-MM-DD HH:mm (TZ) |
| **Ngày kết thúc / đóng** | YYYY-MM-DD HH:mm (TZ) |
| **Môi trường** | Production / Staging / UAT |
| **Dịch vụ / module** | Ví dụ: `EInvoice.Web`, External API |
| **Mức độ (Severity)** | SEV-1 / SEV-2 / SEV-3 / SEV-4 |
| **Mức ưu tiên xử lý** | P0 / P1 / P2 / P3 |
| **Người điều tra (IC)** | Tên — vai trò |
| **Người duyệt / sign-off** | Tên — vai trò |
| **Liên kết** | Ticket Jira/Linear, PR, TraceId mẫu, dashboard |

### Trạng thái điền tài liệu

| Phần | Trạng thái |
|------|------------|
| Phân tích & truy vết (§2–§5) | ☐ Chưa / ☐ Đang / ☐ Xong |
| Kết quả trace & kết luận lỗi (§6) | ☐ Chưa / ☐ Đang / ☐ Xong |
| Nguyên nhân gốc (§7) | ☐ Chưa / ☐ Đang / ☐ Xong |
| Xử lý ngay (§8) | ☐ Chưa / ☐ Đang / ☐ Xong |
| Xử lý triệt để (§9) | ☐ Chưa / ☐ Đang / ☐ Xong |
| Bài học & phòng ngừa (§10–§11) | ☐ Chưa / ☐ Đang / ☐ Xong |

---

## 1. Tóm tắt điều hành

> Viết sau khi đã có kết luận; đọc trong 2 phút là nắm được sự cố.

| Hạng mục | Nội dung |
|----------|----------|
| **Chuyện gì đã xảy ra?** | Mô tả 1–2 câu (triệu chứng người dùng / hệ thống) |
| **Ảnh hưởng** | Số tenant / request / HĐ; có mất dữ liệu không? |
| **Nguyên nhân gốc (1 câu)** | *(điền sau §7)* |
| **Đã xử lý thế nào?** | Mitigation ngắn + fix dài hạn (nếu có) |
| **Trạng thái hiện tại** | Đang lỗi / đã giảm thiểu / đã khắc phục |
| **Cần làm gì tiếp?** | Action item quan trọng nhất + owner |

---

## 2. Triệu chứng & phạm vi ảnh hưởng

### 2.1. Triệu chứng

- **API / endpoint:** `METHOD /path`
- **HTTP / mã lỗi:** Ví dụ 500, `RemoteServiceError`
- **Exception:** Tên class + message điển hình
- **Hành vi client / tích hợp:** Mô tả cách phía kế toán / đối tác nhận lỗi
- **Tần suất:** Thỉnh thoảng / thường xuyên / chỉ khi gọi song song

### 2.2. Phạm vi ảnh hưởng (Impact)

| Khía cạnh | Mô tả |
|-----------|--------|
| **Tenant / khách hàng** | MST, tên, số lượng ước tính |
| **Chức năng** | Ký HĐ, phát hành, gửi CQT, … |
| **Khối lượng** | Số request lỗi / ngày; % so với tổng |
| **SLA / KPI** | Có vi phạm cam kết không? |
| **Dữ liệu** | Có HĐ trạng thái lệch (đã ký một phần nhưng API báo lỗi)? |
| **Tài chính / pháp lý** | Có rủi ro tuân thủ hóa đơn điện tử không? |

### 2.3. Điều kiện tái hiện (nếu biết)

- Payload mẫu (ẩn dữ liệu nhạy cảm)
- Điều kiện: song song, retry, tenant cụ thể, seri/kỳ, …

---

## 3. Dấu vết log & metadata (Trace — thu thập)

> **Giai đoạn truy vết:** ghi nhận bằng chứng trước khi kết luận.  
> *Ví dụ cấu trúc: `sign-error-currency.md` §2.*

### 3.1. Định danh request / trace

| Trường | Giá trị |
|--------|---------|
| `TraceId` | |
| `SpanId` | |
| `RequestId` / `ConnectionId` | |
| `ActionName` | |
| `RequestPath` | |
| `service.name` / instance | |
| Thời điểm (timestamp) | |

### 3.2. Nội dung exception

```
[Paste message + stack trace rút gọn]
```

**Điểm nổ trong pipeline (nếu xác định được):**

- [ ] Trong action / AppService
- [ ] `AbpUowActionFilter` / `SaveChanges` cuối request
- [ ] Background job / queue
- [ ] External service (ký số, CQT, …)
- [ ] Khác: ___

### 3.3. Nguồn log đã tra

| Nguồn | Link / query / khoảng thời gian |
|-------|----------------------------------|
| OpenTelemetry / Loki / ELK | |
| ABP `RemoteServiceErrorInfo` | |
| Application log (`EventId`, …) | |
| PostgreSQL slow query / audit | |
| Redis / cache | |
| Queue (Hangfire / Rabbit, …) | |

---

## 4. Luồng code & kiến trúc liên quan

> **Giai đoạn phân tích:** map triệu chứng → code path.  
> *Ví dụ: `sign-error-currency.md` §3.*

### 4.1. Sơ đồ luồng (call chain)

```
[Entry API]
  └─ ...
       └─ [Service / method gây nghi ngờ]
```

### 4.2. File / thành phần chính

| Thành phần | File / class | Ghi chú |
|------------|--------------|---------|
| Entry | | |
| Nghiệp vụ | | |
| Ghi DB | | UoW, repository |
| Hàng đợi / job | | |

### 4.3. So sánh với luồng tương tự (nếu có)

| Luồng A | Luồng B | Khác biệt có thể liên quan lỗi |
|---------|---------|----------------------------------|
| | | Ví dụ: `[UnitOfWork(false)]`, lock cache |

---

## 5. Phân tích chuyên sâu & giả thuyết

> *Ví dụ: `sign-error-currency.md` §4–§5.*

### 5.1. Phân tích kỹ thuật

- Cơ chế lỗi (concurrency, timeout, null, race, …)
- UoW / transaction / change tracker
- Cache / lock / idempotency
- Điểm đua tranh nghiệp vụ

### 5.2. Bảng giả thuyết (chưa chốt RCA)

| ID | Giả thuyết | Khả năng | Cách xác minh | Kết quả xác minh |
|----|------------|----------|---------------|------------------|
| H1 | | Cao / T.Bình / Thấp | | ☐ Đúng ☐ Sai ☐ Chưa kiểm |
| H2 | | | | |
| H3 | | | | |

### 5.3. Hướng tái hiện & kiểm chứng (pre-RCA)

- [ ] Tái hiện trên staging
- [ ] Gọi API song song / retry
- [ ] Log `DbUpdateConcurrencyException.Entries` (hoặc tương đương)
- [ ] Query SQL trạng thái bản ghi sau lỗi
- [ ] Đối chiếu nhiều `TraceId` cùng pattern

```sql
-- Mẫu query kiểm tra trạng thái sau lỗi
-- ...
```

---

## 6. Kết quả trace & kết luận lỗi

> **Điền sau khi đã có bằng chứng runtime** — chuyển từ giả thuyết sang kết luận.

### 6.1. Kết quả trace (Evidence summary)

| # | Phát hiện | Nguồn (log/SQL/code) | Ghi chú |
|---|-----------|----------------------|---------|
| 1 | | | |
| 2 | | | |

**Entity / bảng / dòng dữ liệu liên quan (nếu xác định được):**

| Entity / bảng | Khóa / định danh | Trạng thái trước–sau |
|---------------|------------------|----------------------|
| | | |

**TraceId / request mẫu đã phân tích:**

- `TraceId`: …
- Kết luận: request đơn / song song / retry / …

### 6.2. Kết luận lỗi (Fault conclusion)

| Mục | Nội dung |
|-----|----------|
| **Loại lỗi** | Bug code / Cấu hình / Hạ tầng / Dữ liệu / Tích hợp client / Vận hành |
| **Mô tả chính xác** | Lỗi xảy ra *ở đâu*, *khi nào*, *điều kiện gì* |
| **Không phải nguyên nhân** | Những giả thuyết đã **loại trừ** và vì sao |
| **Độ tin cậy kết luận** | Cao / Trung bình — còn thiếu bằng chứng gì? |

### 6.3. Phân loại theo tiêu chí nội bộ (tùy chọn)

- [ ] Lỗi hồi quy (regression) — version / PR: ___
- [ ] Lỗi đã biết — ticket cũ: ___
- [ ] Lỗi mới
- [ ] Liên quan deploy / config gần đây: ___

---

## 7. Nguyên nhân gốc (Root Cause Analysis)

> Phân biệt **nguyên nhân gốc** (root cause) và **yếu tố góp phần** (contributing factors).

### 7.1. Nguyên nhân gốc (RCA)

**Câu tuyên bố RCA (1–3 câu):**

> …

**Chuỗi nhân–quả (5 Whys — tùy chọn):**

| Bước | Vì sao? |
|------|---------|
| 1 | Triệu chứng: … |
| 2 | Vì … |
| 3 | Vì … |
| 4 | Vì … |
| 5 | **Gốc:** … |

### 7.2. Yếu tố góp phần (Contributing factors)

| Yếu tố | Mô tả | Có thể khắc phục? |
|--------|--------|-------------------|
| | | Có / Không / Một phần |

### 7.3. Khoảng trống phát hiện (Detection gap)

| Câu hỏi | Trả lời |
|---------|---------|
| Vì sao không phát hiện sớm hơn? | |
| Monitor/alert thiếu gì? | |
| Test nào lẽ ra bắt được? | |

---

## 8. Hành động xử lý ngay (Immediate / Mitigation)

> **Mục tiêu:** Giảm ảnh hưởng **trong thời gian ngắn** — không nhất thiết sửa gốc.  
> Có thể **không cần deploy** (vận hành, hướng dẫn client, tắt tính năng, …).

### 8.1. Danh sách hành động

| # | Hành động | Owner | Thời hạn | Trạng thái | Ghi chú |
|---|-----------|-------|----------|------------|---------|
| M1 | Ví dụ: Hướng dẫn client không retry blind khi 500 | | | ☐ Todo ☐ Done | |
| M2 | Ví dụ: Kiểm tra & sửa thủ công HĐ trạng thái lệch | | | | |
| M3 | Ví dụ: Tăng log level tạm thời | | | | |
| M4 | | | | | |

### 8.2. Workaround cho tích hợp / vận hành

- **Client / kế toán:** …
- **CS / support:** Script hoặc checklist tra cứu HĐ: …
- **Tạm thời tắt / giới hạn:** Feature flag, rate limit, …

### 8.3. Xác nhận mitigation đã hiệu quả

| Tiêu chí | Trước | Sau mitigation |
|----------|-------|----------------|
| Tỷ lệ lỗi | | |
| Ticket khách hàng | | |
| Không tái phát trong X giờ | | ☐ Đạt |

---

## 9. Hành động xử lý triệt để (Permanent fix / Remediation)

> **Mục tiêu:** Loại bỏ hoặc giảm mạnh khả năng tái diễn — thường cần **PR / deploy / quy trình**.

### 9.1. Giải pháp kỹ thuật đề xuất

| # | Giải pháp | Loại | Effort | Rủi ro | Ưu tiên | Trạng thái |
|---|-----------|------|--------|--------|---------|------------|
| F1 | | Hotfix / Refactor / Kiến trúc | S/M/L | | P0/P1 | ☐ Đề xuất ☐ Approved ☐ Done |
| F2 | | | | | | |
| F3 | | | | | | |

**Phương án đã chọn (sau review):**

> …

**Phương án đã loại và lý do:**

> …

### 9.2. Thay đổi code / cấu hình (khi được phép)

| Thay đổi | PR / commit | Môi trường deploy | Ngày |
|----------|-------------|-------------------|------|
| | | | |

### 9.3. Kiểm thử sau fix

| Loại test | Kịch bản | Kết quả |
|-----------|----------|---------|
| Unit / integration | | ☐ Pass ☐ Fail |
| Tái hiện staging | Gọi song song API | ☐ Pass ☐ Fail |
| Regression | Luồng ký / save+sign | ☐ Pass ☐ Fail |
| Smoke production | | ☐ Pass ☐ Fail |

### 9.4. Tiêu chí đóng sự cố (Resolution criteria)

- [ ] Fix đã deploy lên môi trường bị ảnh hưởng
- [ ] Metric lỗi về ngưỡng chấp nhận được trong ≥ … ngày
- [ ] Không có ticket mới cùng root cause trong ≥ … ngày
- [ ] Action item bắt buộc (P0) đã hoàn thành
- [ ] Tài liệu/API đã cập nhật (nếu có)

---

## 10. Bài học rút ra (Lessons learned)

### 10.1. Điều làm tốt (What went well)

- …

### 10.2. Điều cần cải thiện (What went poorly)

- …

### 10.3. Bài học cụ thể (Takeaways)

| # | Bài học | Áp dụng cho |
|---|---------|-------------|
| L1 | | Team dev / QA / Ops / Client |
| L2 | | |
| L3 | | |

### 10.4. Hành động phòng ngừa (Preventive — không trùng §9)

| # | Hành động | Loại | Owner | Due |
|---|-----------|------|-------|-----|
| P1 | Monitor/alert (metric, log pattern) | Observability | | |
| P2 | Test tự động (concurrency, idempotency) | QA | | |
| P3 | Cập nhật runbook / tài liệu API | Docs | | |
| P4 | Review checklist PR (UoW, tracking) | Process | | |

---

## 11. Theo dõi & đóng sự cố

### 11.1. Action items tổng hợp (tracker)

| ID | Mô tả | Loại | Owner | Due | Trạng thái |
|----|--------|------|-------|-----|------------|
| M1 | Mitigation | | | | |
| F1 | Permanent fix | | | | |
| P1 | Prevention | | | | |

### 11.2. Timeline sự cố (Incident timeline)

| Thời điểm | Sự kiện | Người thực hiện |
|-----------|---------|-----------------|
| | Phát hiện / alert | |
| | Bắt đầu điều tra | |
| | Xác định phạm vi | |
| | Mitigation áp dụng | |
| | RCA chốt | |
| | Fix deploy | |
| | Xác nhận ổn định | |
| | Đóng sự cố | |

### 11.3. Truyền thông (Communication)

| Đối tượng | Nội dung đã thông báo | Thời điểm |
|-----------|------------------------|-----------|
| Nội bộ dev/ops | | |
| Support / CS | | |
| Khách hàng / đối tác | | |

### 11.4. Phê duyệt đóng

| Vai trò | Tên | Ngày | Ý kiến |
|---------|-----|------|--------|
| IC / Tech lead | | | ☐ Đồng ý đóng |
| Product / PO | | | |
| Ops (nếu SEV-1/2) | | | |

---

## 12. Phụ lục

- Log đầy đủ (file / link)
- Payload request (đã mask)
- Screenshot dashboard
- Query SQL đã chạy
- Link postmortem meeting (nếu có)

---

## 13. Lịch sử tài liệu

| Phiên bản | Ngày | Người sửa | Thay đổi |
|-----------|------|------------|----------|
| 0.1 | | | Khởi tạo từ phân tích §2–§5 |
| 0.2 | | | Bổ sung §6 RCA, §8–§9 action |
| 1.0 | | | Đóng sự cố |

---

## Gợi ý ánh xạ từ `sign-error-currency.md`

| Phần trong báo cáo mẫu | Nội dung tương ứng trong `sign-error-currency.md` |
|------------------------|---------------------------------------------------|
| §1 Tóm tắt | §1 Tóm tắt điều hành |
| §2 Triệu chứng & impact | §1 + mở rộng impact |
| §3 Log / trace | §2 Thông tin từ log |
| §4 Luồng code | §3 Luồng code liên quan |
| §5 Phân tích & giả thuyết | §4–§5 |
| §6 Kết quả trace & kết luận | *(bổ sung sau điều tra runtime)* |
| §7 Nguyên nhân gốc | §5 Đánh giá nguyên nhân → chốt RCA |
| §8 Xử lý ngay | §7.1 ngắn hạn (khi chưa deploy) |
| §9 Xử lý triệt để | §7.2–§7.3 + checklist §9 file cũ |
| §10 Bài học | §7 + §10 prevention mới |

---

*Mẫu này không thay thế quy trình incident của công ty; điều chỉnh severity/approval theo policy nội bộ.*
