# DOC-14 — WBS & Estimate

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** **PMBOK WBS**; Agile Epic · Feature · User Story · Story Points

---

## 1. Overview

| Mục | Giá trị |
|-----|---------|
| **Project / Phase** | |
| **Baseline SRS version** | DOC-06 vX.Y |
| **Estimation method** | Story Point / T-shirt / Bottom-up |
| **Velocity assumption** | SP / sprint |

## 2. WBS Structure

```text
1.0 Project
├── 1.1 Module A
│   ├── 1.1.1 Feature A1
│   └── 1.1.2 Feature A2
├── 1.2 Module B
└── 1.3 Non-functional (NFR, security, perf)
```

## 3. Epic · Feature · Story Breakdown

| WBS ID | Epic | Feature | Story ID | Story title | FR trace | SP | Priority |
|--------|------|---------|----------|-------------|----------|----|----------|
| 1.1.1 | EP-01 | FE-01 | US-001 | As a … I want … | FR-001 | 5 | Must |

## 4. Story Detail (mẫu)

### US-[ID] — [Title]

| Mục | Nội dung |
|-----|----------|
| **User story** | As a [role], I want [goal], so that [benefit] |
| **Acceptance criteria** | → DOC-07 AC-xxx |
| **Dependencies** | US-xxx, INT-xxx |
| **Story points** | |
| **Notes** | |

## 5. Complexity Scoring (tham chiếu skill — 0–20 / chiều)

| Module | Functional | Integration | Security | Data | Infra | Total | Size |
|--------|------------|-------------|----------|------|-------|-------|------|
| Module A | 12 | 8 | 10 | 6 | 4 | 40 | Medium |

## 6. Effort Estimate by Role

| Role | Person-days / hours | Ghi chú |
|------|---------------------|---------|
| BA | | |
| Backend | | |
| Frontend | | |
| QA | | |
| DevOps | | |
| PM | | |
| **Total** | | |

## 7. Assumptions & Risks (estimation)

| ID | Assumption / Risk | Impact on estimate |
|----|-------------------|--------------------|
| | | +20% buffer |

## 8. Release / Wave Mapping

| Wave | Stories | Total SP | Target date |
|------|---------|----------|-------------|
| MVP | US-001 … | | |
| Phase 2 | | | |

## 9. Trace

| Story | FR | UC | CR |
|-------|----|----|-----|
| US-001 | FR-001 | UC-001 | |
