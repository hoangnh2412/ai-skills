# DOC-10 — Integration Specification

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** Integration patterns; adjunct của SAD (DOC-08); enterprise integration (Hohpe)

---

## 1. Overview

### 1.1 Integration Landscape

```text
[Central System] ←→ [ERP] ←→ [CRM]
       ↕
    [SSO] [Email] [SMS]
```

### 1.2 Integration Principles

| Principle | Mô tả |
|-----------|-------|
| Idempotency | |
| Retry policy | |
| Error handling | |

## 2. Integration Catalog

| INT ID | Hệ thống ngoài | Mục đích | Direction | Pattern | Protocol | Frequency | Owner |
|--------|----------------|----------|-----------|---------|----------|-----------|-------|
| INT-001 | ERP | Đồng bộ master data | Outbound | Batch / Event | REST | Daily | |

**Direction:** Inbound · Outbound · Bidirectional

**Pattern:** Point-to-point · Hub-spoke · Event-driven · ETL · API Gateway

## 3. Integration Detail — INT-[ID]

### INT-[ID] — [Tên]

| Mục | Nội dung |
|-----|----------|
| **Source system** | |
| **Target system** | |
| **Trigger** | Schedule / Event / Real-time |
| **Data scope** | [Entities, fields] |
| **Volume** | Records / day |
| **SLA** | Latency, availability |
| **Auth** | OAuth2 / API Key / mTLS |
| **Error handling** | Retry, DLQ, alert |
| **Mapping** | → DOC-11 Data Model |

### Sequence (tùy chọn)

```text
System A → API Gateway → System B
    │                         │
    └── auth ─────────────────┘
```

## 4. Message / Payload Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| | | | |

→ REST detail: **DOC-12 API Specification**

## 5. Security

| Mục | Yêu cầu |
|-----|---------|
| Transport | TLS 1.2+ |
| Secrets | Vault / env |
| PII | Masking / encryption |

## 6. Monitoring & Support

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Error rate | | |

## 7. Trace

| FR ID | UC ID | ADR ID |
|-------|-------|--------|
| | | |
