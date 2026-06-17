# DOC-16 — Test Strategy

| Version | Date | Author | Status |
|---------|------|--------|--------|
| — | YYYY-MM-DD | | Draft |

> Quy tắc versioning: [`doc-versioning.md`](../docs-skeleton/00-governance/doc-versioning.md).

**Tiêu chuẩn tham khảo:** **ISTQB** — test levels (Component, Integration, System, Acceptance); test types (Functional, Non-functional)

---

## 1. Introduction

### 1.1 Purpose

### 1.2 Scope

[In-scope modules; reference DOC-06 SRS baseline]

### 1.3 References

| Doc | Role |
|-----|------|
| DOC-07 | Acceptance criteria |
| DOC-13 | NFR verification |

## 2. Test Objectives

| Objective | Metric |
|-----------|--------|
| Verify FR coverage | 100% Must-have FR |
| Verify NFR | Per DOC-13 targets |
| Regression safety | 0 critical defect at go-live |

## 3. Test Scope

### 3.1 In Scope

| Area | Test levels |
|------|-------------|
| Module A | Unit, Integration, UAT |

### 3.2 Out of Scope

- [Third-party internal testing]
- [ ]

## 4. Test Levels

| Level | Owner | Tools | Entry criteria | Exit criteria |
|-------|-------|-------|----------------|---------------|
| **Unit** | Dev | xUnit / Jest | Code complete | Coverage ≥ X% critical paths |
| **Integration** | Dev / QA | Postman / Testcontainers | Unit pass | All INT-xxx pass |
| **System** | QA | Automated + manual | Integration pass | SRS FR pass |
| **UAT** | Business | Manual scripts | System pass | DOC-07 AC sign-off |

## 5. Test Types

| Type | Scope | Approach |
|------|-------|----------|
| Functional | FR, UC | Positive + negative paths |
| Regression | Baseline suite | Auto on each release |
| Performance | NFR-Pxx | Load test staging |
| Security | NFR-Sxx | SAST, pen test |
| Compatibility | Browsers, devices | Matrix below |

### Compatibility Matrix (example)

| Browser | Version | Pass |
|---------|---------|------|
| Chrome | Latest - 1 | |

## 6. Test Environment

| Env | Purpose | Data | URL |
|-----|---------|------|-----|
| DEV | Dev test | Synthetic | |
| STAGING | UAT, perf | Anonymized prod-like | |
| PROD | Smoke post-deploy | | |

## 7. Traceability Matrix

| FR ID | UC | AC ID | TC ID | Level | Type | Status |
|-------|----|----|-------|-------|------|--------|
| FR-001 | UC-001 | AC-001 | TC-001 | System | Functional | Pass/Fail |

## 8. Test Case Template

### TC-[ID] — [Title]

| Mục | Nội dung |
|-----|----------|
| **Trace** | FR-xxx, AC-xxx |
| **Preconditions** | |
| **Steps** | 1. … 2. … |
| **Expected result** | |
| **Actual result** | |
| **Status** | Pass / Fail / Blocked |

## 9. Defect Management

| Severity | Definition | SLA fix |
|----------|------------|---------|
| Critical | Production blocker | 24h |
| High | Major feature broken | 3 days |
| Medium | Workaround exists | Next sprint |
| Low | Cosmetic | Backlog |

## 10. UAT Plan

| Scenario | Business owner | Schedule | Sign-off |
|----------|----------------|----------|----------|
| CRP-1 | | | |

## 11. Entry / Exit — Go-live

**Go-live test exit:**
- [ ] 100% Must AC pass
- [ ] 0 open Critical / High
- [ ] Performance NFR pass
- [ ] Security scan pass
- [ ] Regression suite green

## 12. Roles

| Role | Responsibility |
|------|----------------|
| QA Lead | Strategy, trace matrix |
| Dev | Unit / integration |
| BA | UAT scripts from AC |
| Business | UAT sign-off |
