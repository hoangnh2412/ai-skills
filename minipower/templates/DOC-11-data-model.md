# DOC-11 — Mô hình Dữ liệu

| Phiên bản | Ngày | Tác giả | Trạng thái |
|-----------|------|---------|------------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** **UML Class Diagram** · **ERD (Entity-Relationship Diagram)** · master data governance

---

## 1. Giới thiệu

### 1.1 Mục đích & Phạm vi

[Domain / module; tham chiếu DOC-06, DOC-08]

### 1.2 Quy ước đặt tên

| Quy ước | Ví dụ |
|---------|-------|
| Table / Entity | snake_case / PascalCase |
| PK | id |
| FK | {entity}_id |

## 2. Mô hình khái niệm (ERD — cấp cao)

```text
[Entity A] 1───* [Entity B]
    │
    *───* [Entity C]
```

## 3. Mô hình logic

### Thực thể: [EntityName]

| Column | Type | PK/FK | Nullable | Description |
|--------|------|-------|----------|-------------|
| id | UUID | PK | N | |
| created_at | timestamp | | N | |

**Indexes:**

| Name | Columns | Unique |
|------|---------|--------|
| | | |

**Business rules:** BR-xxx

### Thực thể: [Next entity]

…

## 4. Miền dữ liệu chủ (Master Data)

| Domain | Golden record | Source of truth | Sync to |
|--------|---------------|-----------------|---------|
| Customer | CRM | CRM | ERP |
| Employee | HRM | HRM | — |

## 5. Từ điển dữ liệu

| Entity.Attribute | Business definition | Allowed values | Sensitive (Y/N) |
|------------------|---------------------|----------------|-----------------|
| | | | |

## 6. Lưu trữ & Vòng đời

| Entity | Retention | Archive | Legal hold |
|--------|-----------|---------|------------|
| | 7 years | | |

## 7. Di chuyển dữ liệu (nếu có)

| Source | Target | Rules | Volume | Owner |
|--------|--------|-------|--------|-------|
| Legacy | New | Cleanse rules | | |

## 8. Truy vết

| FR ID | INT ID |
|-------|--------|
| | |
