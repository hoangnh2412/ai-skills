# DOC-01 — Vision & Business Case

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | 2026-05-31 | minipower / discovery | Draft |

**Nguồn:** [discovery/phase1-law-firm-vn.md](../../discovery/phase1-law-firm-vn.md) · **Dự án:** ERP doanh nghiệp Luật — Việt Nam

---

## 1. Executive Summary

Tập đoàn luật vận hành **đa pháp nhân** với nhân sự gắn pháp nhân home nhưng **mobilize chéo** theo vụ việc. Hệ thống rời rạc (HRM, CRM, vụ việc) gây trùng dữ liệu, lộ thông tin, chậm billing và khó báo cáo. Dự án xây **nền tảng ERP thống nhất**, **matter-centric**, bảo mật **RBAC + ABAC**, tuân thủ bối cảnh Việt Nam (lao động, BHXH, TNCN, hóa đơn điện tử).

## 2. Vision Statement

**Tầm nhìn:** Một nền tảng ERP nơi mọi giao dịch có khách hàng, phí hoặc bí mật nghề luật đều gắn **Matter ID + Legal Entity + Security context** — nhân sự, kinh doanh và thực thi vụ việc cùng một luồng dữ liệu tin cậy.

**Mission liên quan:** Vận hành minh bạch đa pháp nhân; kiểm soát truy cập theo vai trò và theo từng vụ việc; truy vết tài liệu và sản phẩm dịch vụ pháp lý.

## 3. Business Problem

| Mục | Nội dung |
|-----|----------|
| **Vấn đề hiện tại** | HRM–CRM–vụ việc tách rời; khó kiểm soát quyền theo vai trò **và** theo vụ việc; staffing matrix chéo pháp nhân không được hệ thống hóa |
| **Root cause (giả định)** | Thiếu hub nghiệp vụ (Matter) và mô hình bảo mật ABAC thống nhất |
| **Impact** | Trùng dữ liệu KH; lộ thông tin vụ việc; chậm billing/thu phí; sai lệch payroll đa pháp nhân; khó báo cáo quản trị *(cần đo baseline — Assumption)* |

## 4. Business Goals & Success Metrics

| Goal ID | Mục tiêu | KPI / Success Criteria | Target | Timeline |
|---------|----------|------------------------|--------|----------|
| G-001 | Matter-centric vận hành Wave 1 | % vụ việc mở trên hệ thống; ABAC pass audit mẫu | TBD | Wave 1 |
| G-002 | Giảm trùng master khách hàng | Số bản ghi party trùng / conflict | TBD | 12 tháng |
| G-003 | Kiểm soát truy cập vụ việc | 0 sự cố lộ dữ liệu critical (audit log) | 0 critical | Ongoing |
| G-004 | HRM phục vụ assignment | NS có home entity + assignment Matter | 100% NS active | Wave 1 |
| G-005 | CRM → Matter | Pre-matter → Mở Matter 1 luồng | TBD | Wave 1 |

## 5. Proposed Solution (High Level)

```text
Shared (Product, Document)
        │
   HRM ─┼─ CRM ─── Matter (hub)
        │
   Legal Entity × RBAC + ABAC
```

- **Phase 1 ưu tiên:** HRM (12 cap.) · CRM (11 cap.) · Matter (9 cap.) · Shared Product & Document
- **Nguyên tắc:** Matter-centric; đa pháp nhân; RBAC chức năng + ABAC dữ liệu theo vụ việc

## 6. Business Case

### 6.1 Benefits

| Benefit | Loại | Ước lượng |
|---------|------|-----------|
| Giảm rủi ro lộ hồ sơ bí mật | Intangible | Cao |
| Một master khách hàng / party | Tangible | Giảm duplicate |
| Vận hành vụ việc xuyên pháp nhân | Intangible | Cao |
| Nền tảng payroll/BHXH đa pháp nhân (Wave 2) | Tangible | TBD |

### 6.2 Costs

| Hạng mục | Năm 1 | Năm 2+ | Ghi chú |
|----------|-------|--------|---------|
| License / build ERP | TBD | TBD | Chưa chọn package |
| Tích hợp e-invoice | TBD | | Assumption |
| Hypercare | TBD | | Post go-live |

### 6.3 ROI / Payback

| Chỉ số | Giá trị |
|--------|---------|
| ROI | TBD — chờ business case số |
| Payback period | TBD |

## 7. Assumptions & Constraints

| ID | Loại | Mô tả |
|----|------|-------|
| C-001 | Constraint | Thị trường VN: thuế, BHXH, lao động, hóa đơn |
| C-002 | Constraint | RBAC + ABAC bắt buộc |
| C-003 | Constraint | Matter-centric hub |
| A1 | Assumption | Một Person = một định danh xuyên pháp nhân |
| A2 | Assumption | Matter có một **owning** legal entity |
| A3 | Assumption | Chưa yêu cầu time billing chi tiết Phase 1 |

## 8. High-Level Risks

| ID | Rủi ro | Mức | Mitigation |
|----|--------|-----|------------|
| R1 | Trùng “Vụ việc” CRM vs Matter — 2 master | H | Pre-matter → Matter 1 luồng (DOC-03) |
| R2 | ABAC phức tạp — performance & audit | H | Policy outline; pilot Wave 1 |
| R3 | Payroll đa pháp nhân — sai pháp nhân BHXH | H | Wave 2; home entity rõ |

## 9. Recommendation & Decision

| Quyết định | Proceed Phase 1 discovery → requirements *(draft)* |
|------------|-----------------------------------------------------|
| **Approver** | Sponsor — *chờ sign-off* |
| **Date** | |

## 10. Approval

| Vai trò | Họ tên | Chữ ký | Ngày |
|---------|--------|--------|------|
| Sponsor | | | |
| Business Owner | | | |
