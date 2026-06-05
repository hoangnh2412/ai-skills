# DOC-07 — Acceptance Criteria

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** **Gherkin (Given/When/Then)** — BDD; align User Story + AC (Agile).

---

## 1. Mục đích

[Phase / release / module; trace tới DOC-06 SRS]

## 2. Acceptance Criteria Catalog

| AC ID | FR ID | UC ID | Mô tả ngắn | Priority |
|-------|-------|-------|------------|----------|
| AC-001 | FR-001 | UC-001 | | Must |

## 3. Gherkin Scenarios

### AC-[ID] — [Tên] (FR-xxx)

```gherkin
Feature: [Tên feature]
  As a [actor]
  I want [capability]
  So that [business value]

  Scenario: [Happy path — tên scenario]
    Given [context / preconditions]
    And [additional context]
    When [action]
    Then [expected outcome]
    And [additional outcome]

  Scenario: [Negative path — tên scenario]
    Given [context]
    When [invalid action / edge case]
    Then [expected error / rejection]
```

## 4. Checklist AC (cho non-functional hoặc manual)

| AC ID | Criteria | Pass / Fail | Tester | Date |
|-------|----------|-------------|--------|------|
| AC-NFR-001 | Response time < 2s @ 100 users | | | |

## 5. Definition of Done (DoD) — tham chiếu

- [ ] AC pass 100% Must-have
- [ ] Regression suite pass
- [ ] Sign-off PO / Business Owner

## 6. Traceability

| AC ID | FR | UC | Test Case (DOC-16) |
|-------|----|----|---------------------|
| AC-001 | FR-001 | UC-001 | TC-001 |
