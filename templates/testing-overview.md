# Tổng Hợp Kiến Thức Kiểm Thử Phần Mềm

## 1. Các khái niệm cơ bản

### Test Strategy

Là tài liệu cấp cao mô tả:

- Mục tiêu kiểm thử
- Phạm vi kiểm thử
- Phương pháp kiểm thử
- Công cụ sử dụng
- Tiêu chí chất lượng

Ví dụ:

```text
Kiểm thử hệ thống E-Commerce

- Unit Test: xUnit
- API Test: Postman
- UI Test: Playwright
- Performance Test: JMeter
- Security Test: OWASP ZAP
```

---

### Test Plan

Là kế hoạch cho một đợt kiểm thử cụ thể.

Bao gồm:

- Phạm vi test
- Môi trường test
- Lịch trình
- Nhân sự
- Tiêu chí pass/fail

Ví dụ:

```text
Release 1.5

- Test từ 01/07 - 05/07
- Test module Order
- Test module Payment
```

---

### Test Scenario

Mô tả tình huống nghiệp vụ cần kiểm tra.

Ví dụ:

```text
SC_LOGIN_001

Người dùng đăng nhập thành công
```

```text
SC_ORDER_001

Người dùng mua hàng thành công
```

---

### Test Case

Mô tả chi tiết:

- Điều kiện
- Bước thực hiện
- Dữ liệu
- Kết quả mong đợi

Ví dụ:

```text
TC_LOGIN_001

Input:
username=admin
password=123456

Expected:
HTTP 200
Token != null
```

---

### Test Script

Code tự động hóa thực hiện Test Case.

Ví dụ:

```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
```

---

### Test Suite

Là tập hợp các Test Case được chạy cùng nhau.

Ví dụ:

```text
Smoke Suite

TC_LOGIN_001
TC_ORDER_001
TC_PAYMENT_001
```

---

# 2. Mối quan hệ các khái niệm

```text
Test Strategy
    ↓
Test Plan
    ↓
Test Scenario
    ↓
Test Case
    ↓
Test Script
```

Test Suite không nằm trong chuỗi trên.

Test Suite chỉ là tập hợp các Test Case.

```text
Smoke Suite
 ├── TC_LOGIN_001
 ├── TC_ORDER_001
 └── TC_PAYMENT_001

Regression Suite
 ├── TC_LOGIN_001
 ├── TC_LOGIN_002
 ├── TC_ORDER_001
 └── ...
```

---

# 3. Các cấp độ kiểm thử (Testing Levels)

## Unit Test

Kiểm tra:

- Function
- Method
- Class

Ví dụ:

```csharp
CalculateVAT()
```

Công cụ:

- xUnit
- NUnit
- MSTest

---

## Integration Test

Kiểm tra sự tương tác giữa nhiều thành phần.

Ví dụ:

```text
API
 ↓
Redis
 ↓
RabbitMQ
 ↓
PostgreSQL
```

Công cụ:

- xUnit
- TestContainers

---

## System Test

Kiểm tra toàn bộ hệ thống.

Ví dụ:

```text
Frontend
 ↓
API
 ↓
Redis
 ↓
RabbitMQ
 ↓
Database
```

---

## Acceptance Test (UAT)

Người dùng nghiệp vụ xác nhận hệ thống đáp ứng yêu cầu.

---

# 4. Các loại kiểm thử (Testing Types)

## Functional Test

Kiểm tra chức năng.

Ví dụ:

```text
Login Success
Login Failed
Create Order
```

---

## Performance Test

Kiểm tra hiệu năng.

Ví dụ:

```text
1000 requests/sec
Response < 500ms
```

---

## Load Test

Kiểm tra tải dự kiến.

Ví dụ:

```text
500 users
1000 users
5000 users
```

---

## Stress Test

Kiểm tra vượt ngưỡng thiết kế.

Ví dụ:

```text
10000 users
20000 users
```

---

## Security Test

Kiểm tra bảo mật.

Ví dụ:

```text
SQL Injection
XSS
JWT Validation
Role Validation
```

---

# 5. Smoke Test và Regression Test

## Smoke Test

Mục tiêu:

```text
Build có còn hoạt động cơ bản không?
```

Ví dụ:

```text
Login
Create Order
Payment
```

Thời gian:

```text
1 - 5 phút
```

---

## Regression Test

Mục tiêu:

```text
Code mới có làm hỏng chức năng cũ không?
```

Ví dụ:

```text
Login
User
Product
Order
Payment
Report
```

---

## Sanity Test

Kiểm tra nhanh một khu vực vừa thay đổi.

Ví dụ:

```text
Dev sửa Payment

→ Test Payment
```

---

# 6. E2E Test

## Khái niệm

Kiểm tra toàn bộ luồng nghiệp vụ từ đầu đến cuối.

Ví dụ:

```text
Login
 ↓
Get Product
 ↓
Add To Cart
 ↓
Checkout
 ↓
Payment
 ↓
Verify Order
```

---

## Happy Path

```text
TC_E2E_001

Login Success
 ↓
Create Order
 ↓
Payment Success
 ↓
Order = PAID
```

---

## Critical Business Path

Ví dụ:

### Payment Failed

```text
Login
 ↓
Create Order
 ↓
Payment Failed
 ↓
Order = WAITING_PAYMENT
```

### Refund

```text
Login
 ↓
Create Order
 ↓
Payment
 ↓
Refund
 ↓
Order = REFUNDED
```

---

## Không nên đưa vào E2E

Ví dụ:

```text
Login Wrong Password
```

Vì luồng dừng ngay bước đầu.

Nên để trong Functional Test.

---

# 7. Assertions trong Postman

Ví dụ:

```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
```

---

## Status Validation

```javascript
pm.response.to.have.status(200);
```

---

## Field Validation

```javascript
pm.expect(body).to.have.property("token");
```

---

## Type Validation

```javascript
pm.expect(body.userId).to.be.a("number");
```

---

## Value Validation

```javascript
pm.expect(body.status).to.eql("SUCCESS");
```

---

## Schema Validation

```javascript
pm.response.to.have.jsonSchema(schema);
```

---

## Performance Validation

```javascript
pm.expect(pm.response.responseTime)
    .to.be.below(500);
```

---

# 8. Tổ chức Postman Test Data

## Không nên

```text
Smoke
 ├── Login Success
 └── Login Fail

Regression
 ├── Login Success
 └── Login Fail
```

Dẫn tới duplicate.

---

## Nên

### Collection

```text
Auth
 └── Login

Order
 └── Create Order
```

---

### Test Data

```json
[
  {
    "testCaseId": "TC_LOGIN_001",
    "suite": ["smoke", "regression"],
    "username": "admin",
    "password": "123456",
    "expectedStatus": 200
  }
]
```

---

# 9. Tổ chức E2E trên Postman

```text
E2E

├── Login
├── Get Products
├── Add To Cart
├── Create Order
├── Payment
└── Verify Order
```

Dùng:

```javascript
postman.setNextRequest(...)
```

để chuyển bước.

---

# 10. Bộ công cụ đề xuất

## Unit Test

```text
xUnit
FluentAssertions
Moq
```

---

## Integration Test

```text
xUnit
TestContainers
```

Kiểm tra:

```text
Redis
RabbitMQ
PostgreSQL
```

---

## Functional API Test

```text
Postman
Newman
```

---

## E2E API Test

```text
Postman
Newman
```

---

## E2E UI Test

```text
Playwright
```

---

## Performance Test

```text
JMeter
```

---

## Security Test

```text
OWASP ZAP
```

---

# 11. Quy trình kiểm thử sau khi Deploy

## CI/CD

```text
Unit Test
 ↓
Integration Test
```

---

## Sau Deploy

### Bước 1

```text
Smoke Test
```

Mục tiêu:

```text
Build có chạy được không?
```

---

### Bước 2

```text
Regression Test
```

Mục tiêu:

```text
Chức năng cũ có bị ảnh hưởng không?
```

---

### Bước 3

```text
E2E Test
```

Mục tiêu:

```text
Luồng nghiệp vụ chính có hoạt động không?
```

---

## Quy trình đề xuất

```text
CI/CD

Unit Test
 ↓
Integration Test

Deploy

Smoke Test
 ↓
Regression Test
 ↓
E2E Test
```

---

# 12. Kiến trúc kiểm thử hoàn chỉnh

```text
Unit Test
│
└── xUnit

Integration Test
│
└── xUnit + TestContainers

Functional API
│
└── Postman + Newman

E2E API
│
└── Postman + Newman

E2E UI
│
└── Playwright

Performance Test
│
└── JMeter

Security Test
│
└── OWASP ZAP
```

Đây là một kiến trúc kiểm thử thực tế, cân bằng giữa chi phí triển khai, khả năng bảo trì và độ bao phủ cho các hệ thống .NET + PostgreSQL + Redis + RabbitMQ.










