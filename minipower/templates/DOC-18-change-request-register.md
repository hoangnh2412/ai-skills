# DOC-18 — Đăng ký Yêu cầu Thay đổi

| Phiên bản | Ngày | Tác giả | Trạng thái |
|-----------|------|---------|------------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** Change Management (PMBOK, ITIL); Request for Change (RFC) templates

> **Quy tắc:** Mọi thay đổi sau baseline DOC-01–07 phải có CR. Không sửa trực tiếp baseline — revise version + ghi CR.

---

## 1. Tổng quan đăng ký

| Mục | Giá trị |
|-----|---------|
| **Current baseline** | DOC-06 SRS v1.0 (YYYY-MM-DD) |
| **Change authority** | CCB / Sponsor / PM |
| **CR prefix** | CR- |

## 2. Nhật ký yêu cầu thay đổi

| CR ID | Title | Type | Requester | Date | Priority | Status | Baseline after |
|-------|-------|------|-----------|------|----------|--------|----------------|
| CR-001 | | add / modify / remove | | | H/M/L | Open / Approved / Rejected / Deferred | v1.1 |

## 3. Chi tiết yêu cầu thay đổi — CR-[ID]

### CR-[ID] — [Title]

| Mục | Nội dung |
|-----|----------|
| **CR ID** | CR-xxx |
| **Date submitted** | |
| **Requester** | |
| **Approver(s)** | |
| **Status** | Proposed \| Under review \| Approved \| Rejected \| Deferred \| Implemented |
| **Change type** | add \| modify \| remove |
| **Priority** | Critical / High / Medium / Low |

### Mô tả

[Mô tả thay đổi — business justification]

### Yêu cầu bị ảnh hưởng

| Req ID | Type | Current | Proposed |
|--------|------|---------|----------|
| FR-001 | modify | … | … |
| UC-002 | add | — | … |
| BR-003 | remove | … | — |

### Tài liệu bị ảnh hưởng

| DOC | Current ver | New ver | Change summary |
|-----|-------------|---------|----------------|
| DOC-06 SRS | v1.0 | v1.1 | FR-001 updated |
| DOC-07 AC | v1.0 | v1.1 | AC-002 added |
| DOC-14 WBS | v1.0 | v1.1 | +3 SP |
| DOC-09 ADR | — | ADR-005 new | Architecture decision |

### Phân tích tác động

| Dimension | Impact | Detail |
|-----------|--------|--------|
| **Scope** | Yes / No | |
| **Schedule** | +X days | |
| **Cost** | +X | |
| **Quality / Regression** | Test cases affected: TC-xxx | |
| **Risk** | New risk RK-xxx | |
| **NFR / Security** | NFR-xxx affected | |

### Phạm vi regression test

| TC ID | Must re-run |
|-------|-------------|
| TC-001 | Yes |

### Quyết định

| Decision | Approved / Rejected / Deferred |
|----------|----------------------------------|
| **Decision date** | |
| **Decision by** | |
| **Comments** | |

### Triển khai

| Mục | Nội dung |
|-----|----------|
| **Implemented in release** | vX.Y / Sprint N |
| **Implemented date** | |
| **Verified by** | QA / Business |
| **New baseline version** | DOC-06 v1.1 (YYYY-MM-DD) |

---

## 4. Lịch sử baseline

| Baseline ID | Date | SRS ver | CRs included | Sign-off |
|-------------|------|---------|--------------|----------|
| BL-1.0 | YYYY-MM-DD | v1.0 | Initial | Sponsor |
| BL-1.1 | YYYY-MM-DD | v1.1 | CR-001, CR-002 | Sponsor |

## 5. Biên bản họp CCB (tùy chọn)

| Date | CRs reviewed | Decisions |
|------|--------------|-----------|
| | CR-001 | Approved |

## 6. Chỉ số (tùy chọn)

| Metric | Value |
|--------|-------|
| Open CRs | |
| Avg approval time | |
| Scope creep index | |
