# Phase 1 Discovery — ERP doanh nghiệp Luật (Việt Nam)

**Trạng thái:** Draft — chờ sponsor sign-off exit criteria Phase 1  
**Ngày:** 2026-05-31  
**Tham chiếu:** `ba-skill.md`, `brainstom.md`

---

## 1. Problem statement

**Vấn đề:** Tập đoàn luật vận hành nhiều **pháp nhân** với nhân sự chuyên trách từng pháp nhân, nhưng **dự án/vụ việc** thường mobilize nhân sự chéo pháp nhân. Thiếu một nền tảng ERP thống nhất khiến HRM–CRM–vụ việc tách rời, khó kiểm soát quyền truy cập theo vai trò **và** theo từng vụ việc, khó truy vết tài liệu/sản phẩm dịch vụ pháp lý.

**Impact (giả định cần đo):** trùng dữ liệu khách hàng, lộ thông tin vụ việc, chậm billing/thu phí, sai lệch payroll đa pháp nhân, khó báo cáo quản trị.

**Ràng buộc đã biết:**
- Thị trường Việt Nam (thuế, BHXH, lao động, hóa đơn).
- Đa pháp nhân + staffing matrix.
- **RBAC** (chức danh) + **ABAC** (theo vụ việc / phạm vi dữ liệu).
- **Matter-centric:** module Vụ việc là trung tâm; Product & Document dùng chung.

**Out of scope Phase 1 (đề xuất):** FI/CO đầy đủ, kho vật tư sản xuất, MES — trừ phần tích hợp tối thiểu (hóa đơn, thanh toán).

---

## 2. Kiến trúc nghiệp vụ (khái niệm)

```text
                    ┌─────────────────────┐
                    │  Shared: Product    │
                    │  Shared: Document   │
                    └──────────┬──────────┘
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
      ┌─────────┐         ┌─────────┐       ┌──────────┐
      │   HRM   │         │   CRM   │◄─────►│  Matter  │
      │(nhân sự)│         │(kinh doanh)      │(vụ việc) │
      └────┬────┘         └────┬────┘       └────┬─────┘
           │                   │                  │
           └───────────────────┴──────────────────┘
                         Pháp nhân (Legal Entity)
                    RBAC (role) + ABAC (matter membership)
```

**Nguyên tắc:** Mọi giao dịch “có khách hàng / có phí / có bí mật” gắn **Matter ID** + **Legal Entity** + **Security context**.

---

## 3. Ranh giới module (CRM vs Matter)

| Khía cạnh | CRM | Matter (trung tâm) |
|-----------|-----|---------------------|
| **JTBD** | Tìm kiếm, chăm sóc, chốt cơ hội, hợp đồng dịch vụ | Thực thi vụ việc, công việc, nghiệm thu, thanh lý |
| **Vụ việc (CRM #5)** | Tiền vụ việc: lead, đánh giá sơ bộ, conflict check? | Vụ việc chính thức sau khi mở hồ sơ |
| **Khách hàng** | Master CRM (party) | Chủ thể trên hồ sơ (có thể sync từ CRM) |
| **Hóa đơn / thanh toán** | Proforma, billing intent | Gắn milestone vụ việc, nghiệm thu |
| **Trao đổi / tài liệu** | Sales comms | Work product, version, privilege |

**Đề xuất:** CRM “Vụ việc” đổi tên nghiệp vụ thành **Cơ hội / Hồ sơ tiềm năng** hoặc **Pre-matter**; khi **Mở vụ việc** → sinh Matter record (1:1 hoặc 1:n nếu tách phase).

---

## 4. Capability map Phase 1 (từ input user)

### A. HRM — 12 capability

| # | Capability | Ghi chú BA VN | Phụ thuộc |
|---|------------|---------------|-----------|
| 1 | Thông tin nhân sự | Hồ sơ lao động, hợp đồng, pháp nhân **home** + assignment | Master Person |
| 2 | Vị trí làm việc | Job/position catalog; mapping RBAC | Org structure |
| 3 | Quá trình công tác | Lịch sử pháp nhân, bộ phận, chức danh | #1, đa pháp nhân |
| 4 | Thuế | TNCN, khấu trừ, quyết toán — **critical** Volere | Payroll |
| 5 | Bảo hiểm | BHXH/BHYT/BHTN — **critical** | #4 |
| 6 | Lương | Đa pháp nhân, có thể khác thang lương | #4, #5 |
| 7 | Chế độ, phúc lợi | Policy theo pháp nhân | #1 |
| 8 | Khen thưởng, kỷ luật | Workflow phê duyệt | RBAC |
| 9 | Tuyển dụng | Req → offer → onboard → #1 | CRM (optional) |
| 10 | KPI | Gắn cá nhân/phòng; có thể link Matter workload | Matter (sau) |
| 11 | Đào tạo | Competency luật | HRM |
| 12 | Tài sản | Cấp phát TS cho nhân sự (≠ Matter tài liệu) | Fixed asset lite |

### B. CRM — 11 capability (user liệt kê thiếu #11)

| # | Capability | Ghi chú |
|---|------------|---------|
| 1 | Khách hàng | Party: cá nhân/tổ chức; đa pháp nhân view |
| 2 | Hóa đơn | VAT, e-invoice VN — **critical** |
| 3 | Đơn hàng | Gói dịch vụ / engagement letter |
| 4 | Chứng từ | Phiếu thu/chi liên quan bán hàng |
| 5 | Vụ việc | **Pre-matter** — cần làm rõ với Matter |
| 6 | Thanh toán | Thu tiền, công nợ |
| 7 | Trao đổi | Email/call log sales |
| 8 | Sản phẩm, dịch vụ | → Shared Product catalog |
| 9 | Cơ hội | Pipeline |
| 10 | Kinh doanh | Báo cáo, chỉ tiêu BD |
| 12 | Tài liệu | → Shared Document (CRM folder) |

### C. Matter — 9 capability

| # | Capability | Ghi chú |
|---|------------|---------|
| 1 | Hồ sơ, tài liệu | Matter workspace + DMS |
| 2 | Chủ thể | Client, đối tác, tòa án, bên thứ ba |
| 3 | Công việc | Task, có thể time entry (phase sau?) |
| 4 | Timeline | Milestone, deadline pháp lý |
| 5 | Sản phẩm, dịch vụ | Line items từ Product |
| 6 | Trao đổi | Internal + shared external |
| 7 | Nghiệm thu | Deliverable sign-off |
| 8 | Thanh lý | Đóng vụ việc, archive, retention |
| 9 | Nhân sự | Team + **cross-entity** + share read/advise |

### Shared

| Module | Consumers |
|--------|-----------|
| Quản lý sản phẩm | CRM, Matter, (HRM phúc lợi?) |
| Quản lý tài liệu | CRM, Matter, HRM (hồ sơ NS) |

---

## 5. Đa pháp nhân & staffing matrix

| Khái niệm | Định nghĩa đề xuất |
|-----------|---------------------|
| **Legal Entity (Pháp nhân)** | Đơn vị pháp lý tách bạch (MST, BHXH, hợp đồng lao động) |
| **Home Entity** | Pháp nhân “sở hữu” hồ sơ nhân sự |
| **Assignment** | Nhân sự tham gia Matter thuộc pháp nhân X hoặc Y |
| **Cost/Revenue allocation** | Phase sau — ghi assumption |

**Hot spot:** Lương tại A, làm Matter của B → quy tắc cost charge, approval, ABAC “xem lương” vs “xem vụ việc”.

---

## 6. RBAC + ABAC

| Lớp | Trả lời câu hỏi | Ví dụ |
|-----|----------------|-------|
| **RBAC** | *Được làm gì trên hệ thống?* | Giám đốc, Kế toán, Chuyên viên — menu/action |
| **ABAC** | *Được xem/sửa dữ liệu nào?* | Chỉ Matter mình tham gia; field-level (lương, hồ sơ bí mật) |

**Thuộc tính ABAC đề xuất:** `user_id`, `roles[]`, `home_legal_entity`, `matter_id`, `matter_role` (owner, member, advisor, read-only), `party_relationship`, `data_classification`, `legal_entity_of_record`.

**Chia sẻ vụ việc:** Grant theo pháp nhân hoặc user — loại quyền: **Advise** (comment, không sửa core), **Collaborate**, **Full** (hiếm).

---

## 7. MoSCoW Phase 1 (đề xuất BA — chờ user confirm)

**Must (Wave 1 — “chạy được vụ việc”):**
- Matter: hồ sơ, chủ thể, công việc, timeline, nhân sự team, ABAC cơ bản
- Shared: Document, Product (tối thiểu)
- CRM: Khách hàng, Cơ hội → Pre-matter → Mở Matter
- HRM: Thông tin NS, vị trí, quá trình công tác (phục vụ assignment)

**Should (Wave 2):**
- Matter: trao đổi, nghiệm thu, thanh lý; CRM hóa đơn/thanh toán
- HRM: Lương, thuế, BHXH (critical path VN)

**Could (Wave 3):**
- HRM: Tuyển dụng, KPI, đào tạo, khen thưởng, tài sản
- CRM: Kinh doanh analytics đầy đủ

**Won't (Phase 1):** (điền khi chốt)

---

## 8. Compliance VN (touchpoint — chi tiết Phase 3)

- **Lao động:** Hợp đồng, thời hạn, nghỉ phép, kỷ luật.
- **BHXH:** Đăng ký, mức đóng, biến động — theo pháp nhân.
- **TNCN:** Kê khai, khấu trừ, người phụ thuộc.
- **Hóa đơn điện tử / VAT:** CRM billing.
- **Bảo mật / nghề luật:** Lưu trữ hồ sơ, phân quyền, log truy cập — **critical**.

---

## 9. Rủi ro & assumption (top)

| ID | Loại | Nội dung |
|----|------|----------|
| R1 | Rủi ro | Trùng “Vụ việc” CRM vs Matter gây 2 master |
| R2 | Rủi ro | ABAC phức tạp — performance & audit |
| R3 | Rủi ro | Payroll đa pháp nhân sai pháp nhân đóng BHXH |
| A1 | Assumption | Một Person = một định danh xuyên pháp nhân |
| A2 | Assumption | Matter thuộc một **owning** legal entity |
| A3 | Assumption | Chưa yêu cầu time billing chi tiết Phase 1 |

---

## 10. Câu hỏi elicitation (ưu tiên workshop)

1. Luật sư **cộng sự / hợp danh** vs nhân viên — mô hình lương khác nhau?
2. **Conflict check** trước mở Matter — ai làm, ở CRM hay Matter?
3. CRM #5 “Vụ việc” = Pre-matter hay đồng bộ 2 chiều với Matter?
4. **Time & billing** (giờ billable) có trong Phase 1 không?
5. Tích hợp **hóa đơn điện tử** nhà cung cấp nào?
6. Retention tài liệu vụ việc — bao lâu, theo loại án?
7. Danh sách **pháp nhân** và quy tắc share Matter giữa pháp nhân?
8. Field nào **tuyệt đối ABAC** (lương, hợp đồng, chiến lược)?

---

## 11. Phase 1 exit criteria — checklist

- [ ] Problem statement — sponsor sign-off
- [ ] Capability MoSCoW — user confirm Wave 1/2/3
- [ ] Ranh giới CRM/Matter/Shared — signed
- [ ] Mô hình pháp nhân + assignment — signed
- [ ] RBAC/ABAC policy outline — security/IT review
- [ ] Top 10 risks — accepted or mitigated
- [ ] Glossary — baseline trong `brainstom.md`
