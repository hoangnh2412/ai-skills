# DOC-11 — Data Model

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** **UML Class Diagram** · **ERD (Entity-Relationship Diagram)** · master data governance

---

## 1. Introduction

### 1.1 Purpose & Scope

[Domain / module; tham chiếu DOC-06, DOC-08]

### 1.2 Naming Conventions

| Quy ước | Ví dụ |
|---------|-------|
| Table / Entity | snake_case / PascalCase |
| PK | id |
| FK | {entity}_id |

## 2. Conceptual Model (ERD — high level)

```text
[Entity A] 1───* [Entity B]
    │
    *───* [Entity C]
```

## 3. Logical Model

### Entity: [EntityName]

| Column | Type | PK/FK | Nullable | Description |
|--------|------|-------|----------|-------------|
| id | UUID | PK | N | |
| created_at | timestamp | | N | |

**Indexes:**

| Name | Columns | Unique |
|------|---------|--------|
| | | |

**Business rules:** BR-xxx

### Entity: [Next entity]

…

## 4. Master Data Domains

| Domain | Golden record | Source of truth | Sync to |
|--------|---------------|-----------------|---------|
| Customer | CRM | CRM | ERP |
| Employee | HRM | HRM | — |

## 5. Data Dictionary

| Entity.Attribute | Business definition | Allowed values | Sensitive (Y/N) |
|------------------|---------------------|----------------|-----------------|
| | | | |

## 6. Retention & Lifecycle

| Entity | Retention | Archive | Legal hold |
|--------|-----------|---------|------------|
| | 7 years | | |

## 7. Migration (nếu có)

| Source | Target | Rules | Volume | Owner |
|--------|--------|-------|--------|-------|
| Legacy | New | Cleanse rules | | |

## 8. Trace

| FR ID | INT ID |
|-------|--------|
| | |
