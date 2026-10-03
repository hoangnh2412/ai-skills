# Lộ trình học Insomnia cho Automation Test (Có AI hỗ trợ)

## Mục tiêu

Sau khi hoàn thành lộ trình này, bạn có thể:

- Thành thạo Insomnia để kiểm thử API
- Xây dựng API Automation Test
- Tổ chức Environment và Workflow chuyên nghiệp
- Chạy test bằng CLI trong CI/CD
- Tận dụng AI để tăng tốc phát triển test lên 5–10 lần

> Đối tượng: Backend Developer, QA Automation, Tester, DevOps

---

# Tổng quan lộ trình

| Giai đoạn | Nội dung | Thời gian |
|-----------|----------|-----------|
| 1 | Làm quen Insomnia | 1 ngày |
| 2 | Request Chaining | 1 ngày |
| 3 | Test Script | 2–3 ngày |
| 4 | Environment nâng cao | 1 ngày |
| 5 | Workflow | 1 ngày |
| 6 | Data Driven Test | 1 ngày |
| 7 | CLI Automation | 1 ngày |
| 8 | Report | 0.5 ngày |
| 9 | AI Workflow | 1 ngày |
| 10 | Kiến thức Testing | Liên tục |

---

# Giai đoạn 1 - Thành thạo Insomnia

## Mục tiêu

Biết sử dụng Insomnia như một API Client.

## Cần học

- Workspace
- Collection
- Folder
- Request
- Import OpenAPI
- Import Postman Collection
- Environment
- Variables
- Authentication
    - Basic
    - Bearer Token
    - OAuth2
- History

---

## Ví dụ Environment

```json
{
    "base_url": "https://api-dev.company.com",
    "client_id": "...",
    "client_secret": "...",
    "token": ""
}
```

Sử dụng

```text
{{ _.base_url }}

{{ _.token }}
```

---

# Giai đoạn 2 - Request Chaining

Automation không phải là gửi từng request riêng lẻ.

Ví dụ:

```
Login
    ↓
Lấy Token
    ↓
Create Member
    ↓
Create Subscription
    ↓
Create Ticket
    ↓
Verify Ticket
```

## Cần học

- Response Body
- Response Header
- Cookie
- Variable
- Extract Data

Ví dụ

```
Login

↓

access_token

↓

Authorization:
Bearer {{ _.token }}
```

---

# Giai đoạn 3 - Test Script

Đây là phần quan trọng nhất.

Insomnia sử dụng JavaScript để kiểm tra kết quả.

Ví dụ

```javascript
expect(response.status).to.equal(200);

const body = JSON.parse(response.body);

expect(body.id).to.not.equal(null);
expect(body.title).to.equal("Bug");
expect(body.createdDate).to.exist;
```

---

## Chỉ cần biết JavaScript cơ bản

- const
- let
- if
- for
- Array
- Object
- JSON.parse()

Không cần học JavaScript chuyên sâu.

AI sẽ viết gần như toàn bộ.

---

## Prompt AI

```
Viết test script Insomnia.

Yêu cầu:

- Status = 200
- body.id khác null
- body.title = "Bug"
- body.createdDate tồn tại
```

---

# Giai đoạn 4 - Environment nâng cao

Ví dụ

```
Base Environment

↓

DEV

↓

SIT

↓

UAT

↓

PRODUCTION
```

Ví dụ

```json
{
    "base_url": "...",
    "client_id": "...",
    "client_secret": "...",
    "token": ""
}
```

Học:

- Parent Environment
- Child Environment
- Secret
- Variable Reference

---

# Giai đoạn 5 - Workflow

Ví dụ

```
Login

↓

Create Member

↓

Create Subscription

↓

Create Ticket

↓

Approve Ticket

↓

Cancel Ticket

↓

Delete Ticket
```

AI có thể sinh toàn bộ Workflow.

Prompt

```
Đây là OpenAPI.

Hãy tạo Workflow:

Login

↓

Create Member

↓

Create Subscription

↓

Create Ticket

↓

Approve Ticket

↓

Delete toàn bộ dữ liệu.
```

---

# Giai đoạn 6 - Data Driven Test

Ví dụ Input

| Title | TicketType | Priority |
|--------|------------|----------|
| A | Bug | High |
| B | Feature | Medium |
| C | Support | Low |

AI có thể sinh hàng trăm request.

Prompt

```
Sinh 100 bộ dữ liệu test cho API Create Ticket.

Bao gồm:

- Happy Case
- Boundary
- Invalid Data
- Duplicate
```

---

# Giai đoạn 7 - Chạy Automation

Sử dụng CLI

```bash
inso run test
```

Hoặc

```bash
inso run collection
```

Sau đó tích hợp

- Azure DevOps
- GitHub Actions
- GitLab CI
- Jenkins

Ví dụ Pipeline

```
Checkout Source

↓

Restore

↓

Run Insomnia Test

↓

Publish Report
```

---

# Giai đoạn 8 - Báo cáo

Có thể xuất

- JSON
- HTML
- JUnit XML

CI sẽ hiển thị:

- Passed
- Failed
- Duration
- Logs

---

# Giai đoạn 9 - AI hỗ trợ

Đây là phần giúp tiết kiệm thời gian nhiều nhất.

---

## AI sinh Collection

Prompt

```
Đây là file OpenAPI.

Sinh toàn bộ Insomnia Collection.
```

---

## AI sinh Test Script

```
Viết Test Script.

Kiểm tra:

- HTTP Status
- Response Schema
- Business Rule
- Error Message
```

---

## AI sinh Environment

```
Sinh Environment gồm:

base_url

client_id

client_secret

token
```

---

## AI sinh Workflow

```
Login

↓

Create Member

↓

Create Subscription

↓

Create Order

↓

Approve

↓

Verify

↓

Delete
```

---

## AI sinh Test Case

```
API:

POST /tickets

Input:

Title

TicketType

MemberId

SubscriptionId

Sinh:

- 30 Happy Case
- 30 Boundary
- 30 Negative
```

---

## AI Review Collection

Prompt

```
Review Collection này.

Kiểm tra:

- Thiếu Test Case nào?
- Workflow hợp lý chưa?
- Có bị duplicate không?
- Có thể tối ưu gì?
```

---

# Giai đoạn 10 - Kiến thức Testing

AI chỉ giúp viết code.

Khả năng thiết kế Test Case vẫn là quan trọng nhất.

Nên học

## Functional Testing

- Positive Test
- Negative Test
- Boundary Value
- Equivalence Partitioning

---

## Business Testing

- State Transition

Ví dụ

```
Draft

↓

Pending

↓

Approved

↓

Completed
```

Kiểm tra các trạng thái hợp lệ và không hợp lệ.

---

## Security Testing

- Authentication
- Authorization
- Token Expired
- Invalid Token

---

## API Testing

- HTTP Status
- Response Time
- Schema Validation
- Header Validation
- Error Response

---

## Data Testing

- Duplicate
- Null
- Empty
- Unicode
- Emoji
- SQL Injection
- XSS

---

## Reliability

- Retry
- Timeout
- Idempotency

---

## Concurrency

Ví dụ

100 request cùng tạo Ticket.

Kiểm tra

- Duplicate
- Deadlock
- Race Condition

---

## Rate Limit

Ví dụ

1000 request/phút.

Kiểm tra

- HTTP 429
- Retry-After

---

# AI Prompt Library

## Sinh Collection

```
Đây là OpenAPI.

Sinh toàn bộ Collection theo Best Practice.
```

---

## Sinh Workflow

```
Sinh Workflow hoàn chỉnh từ Login đến Delete.
```

---

## Sinh Test Script

```
Viết toàn bộ Test Script.

Kiểm tra:

- Status
- Header
- Body
- Business Rule
- Schema
```

---

## Sinh Test Case

```
API:

POST /tickets

Sinh 100 Test Case.

Bao gồm:

Happy

Boundary

Negative

Authorization

Authentication

Performance
```

---

## Review API

```
Review API này.

Có thiếu Test Case nào không?
```

---

## Review Collection

```
Review Collection.

Đề xuất Best Practice.
```

---

# Best Practice

## Chia Folder

```
Authentication

Member

Subscription

Ticket

Invoice

Payment
```

---

## Đặt tên Request

Thay vì

```
POST 1
```

Hãy dùng

```
Create Ticket
```

---

## Không hard-code

Không nên

```text
Bearer abcdefghijklmn
```

Nên

```text
Bearer {{ _.token }}
```

---

## Dùng Environment

```
DEV

↓

SIT

↓

UAT

↓

PRODUCTION
```

Không sửa URL trong từng Request.

---

## Mỗi Request đều có Test

Ví dụ

```
Status

Schema

Business Rule
```

---

## Mỗi Workflow đều Cleanup

Ví dụ

```
Create

↓

Verify

↓

Delete
```

Không để dữ liệu rác.

---

# Lộ trình dành cho Backend Developer

Nếu đã có kinh nghiệm:

- REST API
- C#
- Postman
- Swagger
- OpenAPI

thì chỉ cần khoảng **1–2 tuần** để thành thạo Insomnia Automation.

## Tuần 1

- Giao diện
- Collection
- Environment
- Variables
- Authentication
- Workflow

---

## Tuần 2

- Test Script
- CLI
- AI Prompt
- CI/CD
- Best Practice

---

# Kỹ năng quan trọng nhất

AI có thể:

✅ Sinh Collection

✅ Sinh Workflow

✅ Sinh JavaScript

✅ Sinh Test Script

✅ Sinh Environment

✅ Sinh Test Case

Nhưng AI **không thể thay thế** khả năng:

- Hiểu nghiệp vụ
- Thiết kế Test Case
- Xác định Boundary
- Tìm Edge Case
- Đánh giá Business Rule

Đó là những kỹ năng tạo nên một Automation Tester hoặc Backend Developer giỏi.

---

# Checklist hoàn thành

- [ ] Biết sử dụng Insomnia
- [ ] Biết tạo Collection
- [ ] Biết dùng Environment
- [ ] Biết Request Chaining
- [ ] Biết viết Test Script
- [ ] Biết dùng Variables
- [ ] Biết Data Driven Test
- [ ] Biết chạy CLI
- [ ] Biết tích hợp CI/CD
- [ ] Biết thiết kế Test Case
- [ ] Biết tận dụng AI để sinh Collection, Workflow và Test Script
- [ ] Áp dụng Best Practice trong tổ chức Collection và Automation Test