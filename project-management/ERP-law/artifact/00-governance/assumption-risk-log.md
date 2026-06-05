# Assumption & Risk Log

| Version | Date | Status |
|---------|------|--------|
| 0.1 | 2026-05-31 | Draft |

**Nguồn:** discovery/phase1-law-firm-vn.md §9 · DOC-01 · DOC-03

---

## Risks

| ID | Loại | Mô tả | Mức | Mitigation | Owner |
|----|------|-------|-----|------------|-------|
| R1 | Business | Trùng “Vụ việc” CRM vs Matter — 2 master | H | Pre-matter → Matter 1 luồng | BA |
| R2 | Technical | ABAC phức tạp — performance & audit | H | Policy outline; pilot | SA / Security |
| R3 | Business | Payroll đa pháp nhân — sai pháp nhân BHXH | H | Home entity; Wave 2 critical | HR + BA |

## Assumptions

| ID | Giả định | Ảnh hưởng nếu sai | Cần xác nhận |
|----|----------|-------------------|--------------|
| A1 | Một Person = một định danh xuyên pháp nhân | Master data HRM | HR |
| A2 | Matter thuộc một **owning** legal entity | Báo cáo, billing | Legal / Finance |
| A3 | Chưa yêu cầu time billing chi tiết Phase 1 | Scope Matter task | Sponsor |
| A4 | KPI baseline chưa đo (DOC-01) | Business case | Sponsor |
| A5 | Stakeholder register (DOC-02) — tên vai trò suy ra | RACI sai | PM |

## Changelog

| Date | ID | Thay đổi |
|------|-----|----------|
| 2026-05-31 | — | Initial từ discovery |
