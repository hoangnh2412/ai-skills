# DOC-05 — Use Cases

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** UML Use Case; Cockburn (Fully Dressed / Casual).

---

## 1. Actor Catalog

| Actor ID | Tên | Mô tả | Loại (Primary / Secondary / System) |
|----------|-----|-------|--------------------------------------|
| ACT-001 | | | Primary |

## 2. Use Case List

| UC ID | Tên | Actor chính | Priority | Trace (BRQ/FR) |
|-------|-----|-------------|----------|----------------|
| UC-001 | | | Must | |

## 3. Use Case Diagram (tùy chọn)

```text
[Actor] ──► (UC-001 Tên use case)
                │
                ▼ include / extend
            (UC-002 ...)
```

## 4. Use Case Specification (Fully Dressed)

### UC-[ID] — [Tên]

| Mục | Nội dung |
|-----|----------|
| **ID** | UC-xxx |
| **Tên** | |
| **Actor chính** | |
| **Actor phụ** | |
| **Mục tiêu** | [Giá trị nghiệp vụ] |
| **Preconditions** | |
| **Postconditions (success)** | |
| **Postconditions (failure)** | |
| **Trigger** | |
| **Frequency** | |

#### Main Flow (Basic Path)

| Step | Actor | Hành động |
|------|-------|-----------|
| 1 | | |
| 2 | Hệ thống | |

#### Alternative Flows

| ID | Điều kiện | Steps |
|----|-----------|-------|
| AF-1 | | |

#### Exception Flows

| ID | Điều kiện | Steps | Kết quả |
|----|-----------|-------|---------|
| EF-1 | | | Error message / rollback |

#### Business Rules

| BR ID | Áp dụng tại step |
|-------|------------------|
| BR-001 | Step 3 |

#### Trace

| FR ID | Ghi chú |
|-------|---------|
| FR-001 | |

## 5. Use Case Summary (Casual — cho UC đơn giản)

| UC ID | Actor | Mô tả 1 câu |
|-------|-------|-------------|
| UC-00x | | |
