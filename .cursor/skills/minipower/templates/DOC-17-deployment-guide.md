# DOC-17 — Deployment Guide

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** Runbook / cutover checklist; phụ thuộc hạ tầng cụ thể (cloud, on-prem)

---

## 1. Overview

| Mục | Giá trị |
|-----|---------|
| **System / Release** | vX.Y |
| **Deployment type** | Blue-green / Rolling / Big bang |
| **Maintenance window** | YYYY-MM-DD HH:MM – HH:MM (TZ) |
| **Rollback decision maker** | |

## 2. Environments

| Env | URL | Purpose | Infra |
|-----|-----|---------|-------|
| DEV | | Development | |
| STAGING | | Pre-prod validation | |
| PROD | | Production | |

## 3. Prerequisites

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | UAT sign-off (DOC-16) | Business | ☐ |
| 2 | Migration dry-run pass | DBA | ☐ |
| 3 | Secrets / certs in vault | DevOps | ☐ |
| 4 | Monitoring & alerts configured | Ops | ☐ |
| 5 | Rollback script tested | DevOps | ☐ |
| 6 | Communication sent to users | PM | ☐ |

## 4. Deployment Architecture

→ **DOC-08 SAD** Deployment View

```text
[Load Balancer] → [App nodes] → [DB primary / replica]
```

## 5. Deployment Steps

| Step | Action | Command / Link | Owner | Verify |
|------|--------|----------------|-------|--------|
| 1 | Enable maintenance mode | `...` | DevOps | Page shows banner |
| 2 | Backup database | `...` | DBA | Backup ID recorded |
| 3 | Run DB migration | `flyway migrate` | DBA | Schema version OK |
| 4 | Deploy application | `kubectl apply` / CI pipeline | DevOps | Health check pass |
| 5 | Smoke test | TC-smoke-001 … | QA | All pass |
| 6 | Disable maintenance | | DevOps | Users can login |

## 6. Data Migration (nếu có)

| Step | Action | Reconcile rule | Rollback |
|------|--------|----------------|----------|
| 1 | Export source | Row count match | Restore backup |

## 7. Post-Deployment Verification

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| Health endpoint | 200 OK | | ☐ |
| Critical UC smoke | UC-001 login | | ☐ |
| Integration INT-001 | Sync OK | | ☐ |
| APM / logs | No error spike | | ☐ |

## 8. Rollback Procedure

| Trigger | Action |
|---------|--------|
| Smoke fail | Execute rollback within X min |
| Data corruption | Stop traffic + restore backup |

### Rollback Steps

| Step | Action | Owner |
|------|--------|-------|
| 1 | Revert app to previous version | DevOps |
| 2 | Restore DB (if migrated) | DBA |
| 3 | Verify rollback smoke | QA |
| 4 | Notify stakeholders | PM |

## 9. Hypercare (post go-live)

| Period | Support model | Escalation |
|--------|---------------|------------|
| Day 1–7 | War room 24/7 | On-call roster |

## 10. Contacts

| Role | Name | Phone / Slack |
|------|------|---------------|
| DevOps on-call | | |
| DBA | | |
| PM | | |

## 11. Sign-off

| Vai trò | Go / No-go | Ngày |
|---------|------------|------|
| DevOps Lead | | |
| QA Lead | | |
| PM | | |
