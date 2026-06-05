# DOC-13 — Non-Functional Requirements (NFR)

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** **ISO/IEC 25010** (quality model); van Lamsweerde goal-oriented NFR; phần NFR trong ISO/IEC/IEEE 29148

---

## 1. Introduction

[Phạm vi; tham chiếu DOC-06 SRS §5, DOC-08 SAD]

## 2. NFR Summary Matrix

| NFR ID | Category | Requirement (measurable) | Priority | Verification | Owner |
|--------|----------|--------------------------|----------|--------------|-------|
| NFR-001 | Performance | Response ≤ 2s @ 100 concurrent users | Must | Load test | |

## 3. Categories

### 3.1 Performance

| NFR ID | Metric | Target | Measurement method | Environment |
|--------|--------|--------|--------------------|-------------|
| NFR-P01 | Response time (p95) | ≤ 2s | JMeter / k6 | Staging |
| NFR-P02 | Throughput | 500 TPS | | |

### 3.2 Availability & Reliability

| NFR ID | Requirement | Target |
|--------|-------------|--------|
| NFR-A01 | SLA uptime | 99.9% / month |
| NFR-A02 | RTO | 4 hours |
| NFR-A02 | RPO | 1 hour |

### 3.3 Security

| NFR ID | Requirement | Standard / control |
|--------|-------------|------------------|
| NFR-S01 | Authentication | SSO + MFA for admin |
| NFR-S02 | Authorization | RBAC + ABAC |
| NFR-S03 | Encryption at rest | AES-256 |
| NFR-S04 | Encryption in transit | TLS 1.2+ |
| NFR-S05 | Audit log | Immutable, 7-year retention |

### 3.4 Maintainability & Operability

| NFR ID | Requirement |
|--------|-------------|
| NFR-M01 | Deploy without downtime (blue-green) |
| NFR-M02 | Structured logging (JSON) |

### 3.5 Scalability

| NFR ID | Requirement |
|--------|-------------|
| NFR-SC01 | Horizontal scale to 500 users |

### 3.6 Compliance & Legal

| NFR ID | Regulation / policy |
|--------|---------------------|
| NFR-C01 | PDPA / data residency VN |

### 3.7 Usability & Accessibility

| NFR ID | Requirement |
|--------|-------------|
| NFR-U01 | WCAG 2.1 AA (nếu áp dụng) |

## 4. NFR Detail Template

### NFR-[ID] — [Tên]

| Mục | Nội dung |
|-----|----------|
| **Statement** | The system shall … |
| **Rationale** | |
| **Acceptance criteria** | → DOC-07 AC-NFR-xxx |
| **Architectural impact** | → DOC-08, ADR-xxx |
| **Test approach** | Load / Pen test / Audit |

## 5. Traceability

| NFR ID | SAD section | AC ID | Test (DOC-16) | Monitoring |
|--------|-------------|-------|---------------|------------|
| NFR-001 | Deployment view | AC-NFR-001 | TC-perf-001 | APM dashboard |

## 6. Approval

| Vai trò | Ngày |
|---------|------|
| Architect | |
| Security | |
