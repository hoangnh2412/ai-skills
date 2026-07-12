# DOC-04 — Quy tắc nghiệp vụ

| Phiên bản | Ngày | Tác giả | Trạng thái |
|-----------|------|---------|------------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** Business Rules catalog; có thể tham khảo DMN (Decision Model and Notation) cho rule phức tạp.

---

## 1. Mục đích & phạm vi

[Module / domain áp dụng]

## 2. Danh mục quy tắc nghiệp vụ

| ID | Tên | Mô tả rule | Loại | Priority | Trace (UC/FR) | Owner |
|----|-----|------------|------|----------|---------------|-------|
| BR-001 | | [Điều kiện] → [Hành động / kết quả] | Validation / Calculation / Authorization / Inference | Must | UC-xxx, FR-xxx | |

**Loại rule:**
- **Validation** — kiểm tra dữ liệu / điều kiện
- **Calculation** — công thức, tính toán
- **Authorization** — ai được làm gì
- **Inference** — suy luận từ fact

## 3. Chi tiết quy tắc (mẫu từng item)

### BR-[ID] — [Tên]

| Mục | Nội dung |
|-----|----------|
| **Statement** | [Rule dạng câu rõ ràng, có thể test] |
| **Condition** | IF … |
| **Action** | THEN … |
| **Exception** | UNLESS … |
| **Source** | [Luật, SOP, stakeholder] |
| **Effective date** | |
| **Trace** | UC- · FR- · BRQ- |

## 4. Bảng quyết định (tùy chọn — rule phức tạp)

| Condition 1 | Condition 2 | Outcome |
|-------------|-------------|---------|
| Yes | > 100M | Trưởng phòng duyệt |
| Yes | ≤ 100M | Tự động duyệt |

## 5. Nhật ký thay đổi

| Phiên bản | BR ID | Thay đổi | CR Ref |
|-----------|-------|----------|--------|
| | | | CR-xxx |
