# Test requirement
Tổ chức collection, test case, environment, script trên Insomnia (tương tự Postman) để: Functional test, Smoke test, Regression test, E2E test. Yêu cầu:

1. Mỗi request sẽ nằm trong chức năng độc lập
2. Request ko dc trùng giữa các chức năng, môi trường, kịch bản, phải tái sử dụng dc. Ví dụ: Request tìm kiếm sản phẩm ko dc trùng tại các kịch bản E2E, hoặc ko dc trùng giữa các môi trường
3. Data test cover dc các tình huống happy case, unhappy case của functional test trong 1 lần chạy
4. Data test cover dc các case của smoke test trong 1 lần chạy
5. Data test cover dc các case của regession test trong 1 lần chạy
6. Mỗi lần chạy lưu lại kết quả tại folder riêng
7. Kết quả test có thể chuyển đổi thành dạng CSV để phục vụ báo cáo cho khách hàng. Tất nhiên đáp ứng dc câu hỏi phỏng vấn: Khi có 3 khách mỗi ông 1 kiểu thì lưu thế nào tối ưu nhất


1. e2e_single_signature.csv

| ID | Name |
| -- | -- |
| Auth01 | ... |
| Sign01 | ... |
| Verify01 | ... |

Output: JSON collection
Newman import collection
Report https://www.npmjs.com/package/newman-reporter-htmlextra


Test strategy
Định hướng kiểm thử
- Công nghệ
- Trình duyệt, thiết bị
- Con người
- Phạm vi
- Rủi ro
- Mục tiêu

Test scenario
Chiến lược kiểm thử
- E2E
- Smoke
- Regession


Test plan
Kế hoạch kiểm thử
- Mục tiêu
- Có những lần test nào?
- Mỗi lần sẽ test những gì?
- Mỗi lần test thời điểm nào? Kéo dài trong bao lâu?
- Chuẩn bị những dữ liệu gì?
- Kết quả kỳ vọng



Test case







## A. Các loại kiểm thử

┌─────────────────────────────────────────────────────┐
│                     SYSTEM TEST                     │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                   E2E TEST                    │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │             FUNCTIONAL TEST             │  │  │
│  │  │                                         │  │  │
│  │  │  ┌───────────────────────────────────┐  │  │  │
│  │  │  │         INTEGRATION TEST          │  │  │  │
│  │  │  │                                   │  │  │  │
│  │  │  │  ┌─────────────────────────────┐  │  │  │  │
│  │  │  │  │         UNIT TEST           │  │  │  │  │
│  │  │  │  └─────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘






1. Unit test
Dev code để test các Service, Domain Logic, Business Rule, Helper, Validator cụ thể nhằm kiểm tra logic code với các thành phần infra đều giả lập
- Không truy cập hạ tầng thật
- Không phụ thuộc môi trường









2. Integration test
Dev code kiểm tra sự tương tác giữa nhiều thành phần với nhau.
- Dùng hạ tầng thật
- Không mock thành phần đang kiểm tra








3. Functional test
Tester Kiểm tra chức năng có đáp ứng yêu cầu nghiệp vụ hay không. Bao gồm cả happy case và unhappy case
- UI
- API
- Mobile










4. E2E test
Kiểm tra toàn bộ luồng nghiệp vụ từ điểm bắt đầu tới điểm kết thúc.
- Có thể chỉ cần happy case
















5. System test
Test toàn bộ hệ thống như một sản phẩm hoàn chỉnh. (tất cả functional test)











## B. Quan hệ
+--------------------------------------------------------+
|                    SYSTEM TEST                         |
|                                                        |
|  User -> UI -> API -> Service -> DB -> Queue -> Email  |
|                                                        |
+--------------------------------------------------------+

         ▲
         │

+--------------------------------------------+
|                 E2E TEST                   |
|                                            |
| Login                                      |
|   -> Tạo đơn hàng                          |
|      -> Thanh toán                         |
|         -> Xuất hóa đơn                    |
|            -> Gửi email                    |
+--------------------------------------------+

         ▲
         │

+-------------------------------+
|        FUNCTIONAL TEST        |
|                               |
| Login                         |
| Quản lý khách hàng            |
| Quản lý đơn hàng              |
| Thanh toán                    |
| Báo cáo                       |
+-------------------------------+

         ▲
         │

+-------------------------------+
|       INTEGRATION TEST        |
|                               |
| API -> PostgreSQL             |
| API -> Redis                  |
| API -> Kafka                  |
| Kafka -> Consumer             |
| Background Job -> DB          |
+-------------------------------+

         ▲
         │

+-------------------------------+
|          UNIT TEST            |
|                               |
| Service Method                |
| Domain Rule                   |
| Validator                     |
| Helper                        |
| Calculator                    |
+-------------------------------+

## C. Smoke test
Một tập test nhỏ nhất để xác nhận bản build có đủ ổn định để test tiếp hay không.
Có thể chỉ cần happy case, ít test case, cần kết quả nhanh

Smoke Test Suite

✓ Login
✓ Tạo khách hàng
✓ Tạo đơn hàng
✓ Xuất hóa đơn
✓ Logout

Functional Test Cases
├─ Login Success           ✓ Smoke
├─ Login Wrong Password
├─ Login Lock User
├─ Login Expired Password

Order Test Cases
├─ Create Order            ✓ Smoke
├─ Cancel Order
├─ Refund Order
├─ Split Order

## D. Regression Test
Các test đã từng pass để đảm bảo thay đổi mới không gây lỗi cho chức năng cũ. Bao gồm cả happy case và unhappy case

Regression Suite

Functional Tests
├─ Login
├─ Customer
├─ Order
├─ Invoice

E2E Tests
├─ Order Flow
├─ Payment Flow

API Tests
├─ Auth API
├─ Invoice API