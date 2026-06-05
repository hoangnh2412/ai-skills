# DOC-03 — Business Requirements Document (BRD)

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | 2026-05-31 | minipower / discovery | Draft |

**Nguồn:** [discovery/phase1-law-firm-vn.md](../../discovery/phase1-law-firm-vn.md)

---

## 1. Document Control

| Version | Ngày | Author | Thay đổi |
|---------|------|--------|----------|
| 0.1 | 2026-05-31 | minipower | Initial từ discovery Phase 1 |

## 2. Executive Summary

ERP Phase 1 cho **doanh nghiệp luật VN**, đa pháp nhân, **matter-centric**. Module: **HRM**, **CRM**, **Matter**, **Shared** (Product, Document). Bảo mật **RBAC + ABAC**. MoSCoW Wave 1–3 đề xuất — **chờ user confirm**.

## 3. Business Objectives

| ID | Objective | Success Metric | Priority |
|----|-----------|----------------|----------|
| BO-001 | Hub Matter vận hành Wave 1 | Vụ việc mở trên hệ thống + ABAC | Must |
| BO-002 | CRM Pre-matter → Matter một luồng | Không 2 master vụ việc | Must |
| BO-003 | HRM phục vụ staffing matrix | Home entity + assignment | Must |
| BO-004 | Shared Product & Document | Catalog + DMS dùng chung | Must |
| BO-005 | Payroll/BHXH/TNCN đa pháp nhân | Chính xác theo pháp nhân | Should (Wave 2) |
| BO-006 | Billing e-invoice VN | Hóa đơn điện tử | Should (Wave 2) |

## 4. Scope

### 4.1 In Scope (Phase 1 program)

- Module **Matter** (9 capability — theo MoSCoW từng wave)
- Module **CRM** (11 capability)
- Module **HRM** (12 capability)
- **Shared:** Quản lý sản phẩm, Quản lý tài liệu
- **Đa pháp nhân:** Legal entity, home entity, assignment
- **Bảo mật:** RBAC + ABAC, audit log (outline)
- **Compliance touchpoint VN:** lao động, BHXH, TNCN, e-invoice *(chi tiết Wave 2+)*

### 4.2 Out of Scope (Phase 1 — đề xuất)

- FI/CO đầy đủ
- Kho vật tư sản xuất, MES
- Time billing chi tiết *(Assumption A3 — chờ confirm)*
- Cost/revenue allocation chéo pháp nhân *(Phase sau)*

### 4.3 Boundaries & Interfaces

```text
                    Shared: Product, Document
                              │
         HRM ────────────────┼─────────────── CRM
                              │
                           Matter (hub)
                              │
                    Legal Entity × RBAC/ABAC
```

| Interface | Mô tả |
|-----------|-------|
| CRM → Matter | Pre-matter / Mở vụ việc |
| CRM / Matter → Shared Product | Line items, catalog |
| CRM / Matter / HRM → Shared Document | DMS, phân quyền ABAC |
| HRM → Matter | Team assignment, cross-entity |
| CRM → E-invoice *(Wave 2)* | Nhà cung cấp TBD |

## 5. Module index

| Module ID | MOD prefix | Priority Phase 1 | Folder |
|-----------|------------|------------------|--------|
| hrm | HRM | 12 capabilities | `03-modules/hrm/` |
| crm | CRM | 11 capabilities | `03-modules/crm/` |
| matter | MAT | 9 capabilities — **hub** | `03-modules/matter/` |
| shared | SHR | Product + Document | `03-modules/shared/` |

## 6. Ranh giới CRM vs Matter

| Khía cạnh | CRM | Matter |
|-----------|-----|--------|
| JTBD | Pipeline, chăm sóc, chốt cơ hội | Thực thi vụ việc, nghiệm thu, thanh lý |
| “Vụ việc” CRM #5 | **Pre-matter** (đề xuất đổi tên) | Vụ việc chính thức sau Mở hồ sơ |
| Khách hàng | Master party CRM | Chủ thể hồ sơ (sync CRM) |
| Billing | Proforma, intent *(Wave 2)* | Milestone, nghiệm thu |

**Đề xuất BA:** CRM “Vụ việc” → **Pre-matter**; **Mở vụ việc** → sinh Matter (1:1 hoặc 1:n phase).

## 7. Capability map (tóm tắt)

### HRM — 12 capability

Thông tin NS · Vị trí · Quá trình công tác · Thuế · Bảo hiểm · Lương · Chế độ phúc lợi · Khen thưởng/kỷ luật · Tuyển dụng · KPI · Đào tạo · Tài sản

### CRM — 11 capability

Khách hàng · Hóa đơn · Đơn hàng · Chứng từ · Vụ việc (Pre-matter) · Thanh toán · Trao đổi · Sản phẩm/dịch vụ · Cơ hội · Kinh doanh · Tài liệu

### Matter — 9 capability

Hồ sơ/tài liệu · Chủ thể · Công việc · Timeline · Sản phẩm/dịch vụ · Trao đổi · Nghiệm thu · Thanh lý · Nhân sự (cross-entity)

### Shared

Quản lý sản phẩm · Quản lý tài liệu — consumers: CRM, Matter, HRM (hồ sơ NS)

## 8. MoSCoW Phase 1 *(đề xuất — chờ confirm)*

### Must — Wave 1

| Module | Capability |
|--------|------------|
| Matter | Hồ sơ, chủ thể, công việc, timeline, nhân sự team, ABAC cơ bản |
| Shared | Document, Product (tối thiểu) |
| CRM | Khách hàng, Cơ hội → Pre-matter → Mở Matter |
| HRM | Thông tin NS, vị trí, quá trình công tác |

### Should — Wave 2

Matter: trao đổi, nghiệm thu, thanh lý · CRM: hóa đơn/thanh toán · HRM: Lương, thuế, BHXH

### Could — Wave 3

HRM: Tuyển dụng, KPI, đào tạo, khen thưởng, tài sản · CRM: BD analytics

### Won't — Phase 1

*(Chốt khi sponsor sign-off)*

## 9. Đa pháp nhân & staffing

| Khái niệm | Định nghĩa |
|-----------|------------|
| Legal Entity | Đơn vị pháp lý (MST, BHXH, HĐLĐ) |
| Home Entity | Pháp nhân sở hữu hồ sơ nhân sự |
| Assignment | NS tham gia Matter thuộc pháp nhân X hoặc Y |

**Hot spot:** Lương tại A, Matter của B — cost charge, approval, ABAC lương vs vụ việc *(Phase sau)*

## 10. RBAC + ABAC (outline)

| Lớp | Câu hỏi | Ví dụ |
|-----|---------|-------|
| RBAC | Được làm gì? | Giám đốc, Kế toán, Chuyên viên |
| ABAC | Được xem/sửa gì? | Chỉ Matter tham gia; field nhạy cảm |

**Thuộc tính ABAC:** `user_id`, `roles[]`, `home_legal_entity`, `matter_id`, `matter_role`, `data_classification`, …

**Share vụ việc:** Advise · Collaborate · Full

## 11. Business Requirements (high-level)

| ID | Requirement | Rationale | Priority |
|----|-------------|-----------|----------|
| BRQ-001 | Hệ thống quản lý Matter là hub giao dịch có KH/phí/bí mật | Matter-centric | Must |
| BRQ-002 | Một Person một định danh xuyên pháp nhân | A1 | Must |
| BRQ-003 | NS có home entity; assign Matter chéo pháp nhân | D5 | Must |
| BRQ-004 | RBAC menu/action + ABAC row/field theo Matter | D6 | Must |
| BRQ-005 | Pre-matter CRM chuyển thành Matter chính thức | R1 mitigation | Must |
| BRQ-006 | Shared catalog Product cho CRM & Matter | Capability map | Must |
| BRQ-007 | DMS Shared với phân quyền ABAC | Bí mật nghề luật | Must |
| BRQ-008 | Audit log truy cập dữ liệu nhạy cảm | Compliance VN | Must |

## 12. Constraints

| ID | Constraint |
|----|------------|
| C-001 | Quy định lao động, BHXH, TNCN, hóa đơn VN |
| C-002 | Không lộ dữ liệu vụ việc ngoài ABAC |
| C-003 | ERP package TBD — fit-gap sau |

## 13. Assumptions

→ Chi tiết [00-governance/assumption-risk-log.md](../00-governance/assumption-risk-log.md)

## 14. Glossary

→ [`brainstom.md`](../../brainstom.md) · discovery §5–6

## 15. Open questions (workshop)

1. Luật sư cộng sự vs nhân viên — mô hình lương?
2. Conflict check — CRM hay Matter?
3. CRM #5 = Pre-matter hay sync 2 chiều?
4. Time billing Phase 1?
5. Nhà cung cấp e-invoice?
6. Retention tài liệu?
7. Danh sách pháp nhân & share Matter?
8. Field tuyệt đối ABAC?

## 16. Discovery exit checklist

- [ ] Problem statement — sponsor sign-off
- [ ] MoSCoW Wave 1/2/3 — user confirm
- [ ] Ranh giới CRM/Matter/Shared — signed
- [ ] Mô hình pháp nhân + assignment — signed
- [ ] RBAC/ABAC outline — security review
- [ ] Top risks — accepted
- [ ] Glossary — baseline `brainstom.md`

## 17. Approval

| Vai trò | Họ tên | Ngày | Baseline |
|---------|--------|------|----------|
| Business Owner | | | ☐ |
| Sponsor | | | ☐ |
