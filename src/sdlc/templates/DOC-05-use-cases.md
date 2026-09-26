# DOC-05 — Kịch bản sử dụng (Use Cases)

| Phiên bản | Ngày | Tác giả | Trạng thái |
|-----------|------|---------|------------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** UML Use Case; Cockburn (Fully Dressed / Casual).

---

## 1. Danh mục tác nhân

| Actor ID | Tên | Mô tả | Loại (Primary / Secondary / System) |
|----------|-----|-------|--------------------------------------|
| ACT-001 | | | Primary |

## 2. Danh sách use case

| UC ID | Tên | Actor chính | Priority | Trace (BRQ/FR) |
|-------|-----|-------------|----------|----------------|
| UC-001 | | | Must | |

## 3. Sơ đồ use case (tùy chọn)

```text
[Actor] ──► (UC-001 Tên use case)
                │
                ▼ include / extend
            (UC-002 ...)
```

## 4. Đặc tả use case (Fully Dressed)

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

#### Luồng chính (Basic Path)

| Step | Actor | Hành động |
|------|-------|-----------|
| 1 | | |
| 2 | Hệ thống | |

#### Luồng thay thế

| ID | Điều kiện | Steps |
|----|-----------|-------|
| AF-1 | | |

#### Luồng ngoại lệ

| ID | Điều kiện | Steps | Kết quả |
|----|-----------|-------|---------|
| EF-1 | | | Error message / rollback |

#### Quy tắc nghiệp vụ

| BR ID | Áp dụng tại step |
|-------|------------------|
| BR-001 | Step 3 |

#### Truy vết

| FR ID | Ghi chú |
|-------|---------|
| FR-001 | |

## 5. Tóm tắt use case (Casual — cho UC đơn giản)

| UC ID | Actor | Mô tả 1 câu |
|-------|-------|-------------|
| UC-00x | | |
