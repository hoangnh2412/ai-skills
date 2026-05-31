# Use Case Point (UCP)

Bao gồm các tiêu chí:
- Số lượng Actor
- Số lượng Use Case
- Độ phức tạp
- Yếu tố kỹ thuật
- Yếu tố môi trường

UCP giúp công ty thực hiện việc:
- Định lượng công việc trước khi code
- Tính chi phí minh bạch
- Kiểm soát scope
- So sánh hiệu suất giữa các dự án

## 1. Quy trình tính UCP
Bộ công thức 6 bước tính TCP, EF chỉ áp úng cho BA và Ban giám đốc để định giá TỔNG NGÂN SÁCH DỰ ÁN

### 1.1. Bước 1. Xác định Actor

| Loại Actor | Mô tả | Trọng số |
|--|--|--|
|Simple|API khác, hệ thống khác|1|
|Average|Người dùng qua giao diện|2|
|Complex|Giao tiếp phức tạp, nhiều giao diện|3|

Điểm UAW = Tổng số Actor x Trọng số

Ví dụ:
- 2 Actor Average => 2 x 2 = 4
- 1 Actor Complex => 1 x 3 = 3
Điểm UAW = 7

### 1.2. Bước 2. Xác định Use case

| Loại Actor | Mô tả | Trọng số |
|--|--|--|
|Simple|< 3 bước|5|
|Average|4 - 7 bước|10|
|Complex|>= 8 bước|15|

Điểm UUCW = Tổng số Use Case x Trọng số

Ví dụ:
- 3 Use Case Simple => 3 x 5 = 15
- 2 Use Case Complex => 2 x 15 = 30
Điểm UUCW = 45

### 1.3. Bước 3. Tính UUCP
Điểm UUCP = UAW + UUCW
Ví dụ:
- UAW = 7
- UUCW = 45
Điểm UUCP = 52

### 1.4. Bước 4. TÍnh hệ số kỹ thuật (TCF)
Có 13 yếu tố kỹ thuật. Ví dụ
- Phân tán hệ thống
- Hiệu năng cao
- Bảo mật
- Xử lý song song
- Backup
- Transaction phức tạp
Mỗi yếu tố chấm từ 0 - 5
Tính tổng: TF = Tổng trọng số x mức độ
Sau đó TCF = 0.6 + (0.01 x TF)
Ví dụ: TF = 30 ta sẽ có TCF = 0.6 + (0.01 x 30) = 0.9

### 1.5. Bước 5. Tính hệ số môi trường (EF)
Cố 8 yếu tố môi trường
- Kinh nghiệm team
- Ổn định yêu cầu
- Động lực
- Kỹ năng công cụ
- Khả năng phân tích
Mỗi yếu tố chấm từ 0 - 5
TÍnh: EF = 1.4 + (-0.03 x Tổng điểm môi trường)
Ví dụ: Tổng điểm môi trường = 20 ta sẽ có EF = 1.4 + (-0.03 x 20) = 0.8

Đánh giá hệ số môi trường của đội ngũ IT cả năm
Đội hình DEV dc đánh giá theo 8 tiêu chí
- F1: Hiểu biết quy trình Agile: Điểm 2 x 1.5 = 3
- F2: Kinh nghiệm làm app: Điểm 4 x 0.5 = 2
- F3: Kinh nghiệm hướng đối tượng OOP: Điểm 3 x 1.0 = 3
- F4: Năng lực leader: Điểm 4 x 0.5 = 2
- F5: Động lực làm việc: Điểm 3 x 1.0 = 3
- F6: Độ ổn định yêu cầu, hay đổi spec: Điểm 2 x 2.0 = 4
- F7: Sử dụng part-time: Điểm 0 x -1.0 = 0
- F8: Ngôn ngữ lập trình: Điểm 3 x -1.0 = -3

Tổng EFW = 14 điểm. Hệ số EF = 1.4 + (-0.03 x 14) = 0.98

`Question`: Chưa có tiêu chí chấm điểm, đang theo cảm tính

### 1.6. Bước 6. Tính UCP
UCP = UUCP x TCF x EF
Ví dụ: UUCP = 52, TCP = 0.9, EF = 0.8
Điểm UCP = 52 x 0.9 x 0.8 = 37.44
Làm tròn: 37 UCP

## 2. Quy đổi UCP sang giờ công
Quy ước: 1 UCP = 4 giơ
Ví dụ: 37 UCP x 4 giờ = 48 giờ

## 3. Quy đổi giờ sang chi phí dự toán và chi phí thực trả cho team

### 3.1. TÍnh chi phí cơ sở (dự toán ban đầu)
Công thức: Chi phí cơ sở = UCP x P x H
Trong đó:
- P = 4 giờ
- H = 50.000 VND (đơn giá thực tế) / 200.000 VND (đơn giá giờ công thương mại)

Chi phí cơ sở:
Giá nội bộ = 37 x 4 x 50.000 = 7.400.000 VND
Giá thương mại = 37 x 4 x 200.000 = 29.600.000 VND

### 3.2. Tính quỹ thực trả cho team (K_Nhóm)
Đối với quỹ khoán nọi bộ, số tiền 7.400.000 VND chưa phải con số cuối cùng. Khi release module, technical manager sẽ đánh gái Hệ số hiệu suất nhóm để chốt phí thực trả
Công thức: Quỹ thực trả team = Chi phí cơ sở nội bộ x K_Nhóm
- Nếu xuất sắc K = 1.1: Team nhận 7.400.000 x 1.1 = 8.140.000 VND (thưởng thêm vì xong sớm, ko bug)
- Nếu đạt chuẩn K = 1.0: Team nhận 7.400.000 VND
- Nếu ko đạt K = 0.8: Team nhận 7.400.000 x 0.8 = 5.920.000 VND (bị trừ tiền vì trễ hạn hoặc lọt bug High/Critical)

## 4. Áp dụng hệ số quản lý doanh nghiệp
Dùng để tính giá chố với khách hàng/tính doanh thu
G = 1.4 x Chi phí cơ sở thương mại = 1.4 x 29.600.000 = 41.440.000 VND

## 5. Cơ cấu tổ chức
Chia thành nhiều nhóm nhỏ, mỗi nhóm gồm:
- Mid dev làm trưởng nhóm (leader)
- 1 junior dev
- một số thành viên khác bao gồm intern dev, tester
Việc bổ sung thành viên sẽ do leader đề xuất, giám gốc bộ phận phê duyệt
Business Analysis sẽ đóng vai trò hỗ trợ chung cho các nhóm

## 6. Vai trò trách nhiệm

### 6.1. Technical Manager (TM)
- Định hướng kiến trúc tổng thể
- Phê duyệt tiêu chuẩn coding, logging, security
- Checklist công việc và coding
- Duyệt release ở cấp Epic, Story, Bug (ko duyệt từng task nhỏ)
- Quyết định capacity team và phân bổ ngồn lực
- Đánh giá KPI cấp leader
Ngoài ra, TM chịu trách nhiệm trc ban giám đốc về việc phân bổ UCP tương ứng cho các team

### 6.2. Team Leader (TL)
- Review code 100% theo checklist chuẩn
- Đảm bảo mỗi task có: Unit test, ko warning, log đúng tiêu chuẩn
- Phân rã task hợp ký để Dev đạt KPI
- Đảm bảo sprint đạt đủ UCP cam kết
- Mentor và đánh giá tiến độ junior

### 6.3. Business Analysis (BA)
- Viết spec rõ ràng theo format: Actor, Use Case, Acceptance Criteria
- Xác định UCP ban đầu
- Lock scope
- Chịu trách nhiệm nếu yêu cầu mơ hồ gây rework 
`Question`: Yêu cầu cần đánh giá từ Technical mà BA ko nắm dc thì sao? Technical sẽ mất thêm thời gian để hỗ trợ phân tích, định hướng giải pháp để đàm phán scope

### 6.4. Tester
- Viết test case dựa trên DoD
- Regression test
- Kiểm thử: Functional, Performance cơ bản, Security cơ bản
- Có quyền reject nếu: Chưa đủ unit test, ko đạt acceptance criteria, bug severity high

## 7. Cơ chế kiểm tra chéo
|Vai trò|Chịu trách nhiệm kiểm soát|Ghi chú|
|--|--|--|
|Dev|Leader||
|Leader|Technical manager||
|BA|Technical manager||
|Tester|Technical manager||
|Technical Manager|Ban giám đốc|BA và QA chịu trách nhiệm rà soát|

## 8. Quyền lợi

### 8.1. Quyết định bổ nhiệm
Leader bổ nhiệm thời hạn 6 tháng hoặc 1 năm (có review lại)
Việc tái bổ nhiệm dựa trên
- Squad đạt > 95% tổng UCP cam kết trong kỳ
- Ko để xảy ra quá 2 lỗi nghiêm trọng (High/Criteria) trên Production
- Ko vi phạm quy trình 5 bước phát triển phần mềm
Lưu ý: Leader là vị trí quản lý theo hiệu suất, ko phải chức danh cố định

### 8.2. Phụ cấp Leader
Thưởng hiệu suất theo UCP
Cơ chế:
- Mối Squad có định mức nền tảng: Ví dụ 80 UCP/tháng
- Nếu Squad thực hiện
    - < 80 UCP => Ko có thưởng vượt
    - 80 - 100 UCP => Đạt KPI cơ bản
    - 100 UCP => Mở thưởng vượt
Công thức thưởng vượt:
- Thưởng leader = UCP vượt định mức x Đơn giá nội bộ 1 UCP x 10%

### 8.3. Cơ chế phạt gắn với UCP và DoD
Leader bị trừ thưởng vượt, ko trừ phụ cấp cố định nếu:
- Squad ko đạt > 90% UCP cam kết
- Lọt bug High/Critical trên Prod
- Release ko đạt chuẩn DoD
Phụ cấp cố định chỉ bị xem xét lại nếu
- Vi phạm nghiêm tọng quy trình
- 2 tháng liên tiếp ko đạt KPI tối thiểu

`Question`: Chưa thấy trách nhiệm hỗ trợ trong quá trình UAT
`Question`: Chưa thấy tính việc cho Tech Debt. Ví dụ phát hiện cần tối ưu trong quá trình vận hành

## 9. Quy trình phát triển phần mềm

### 9.1. Requirement - Phân tích yêu cầu (BA)
BA là người chịu trách nhiệm đầu vào của hệ thống
- Công việc cụ thể
    - Làm rõ yêu cầu với khách hàng hoặc nội bộ
    - Liệt kê rõ ràng từng chức năng độc lập (Use Case)
    - Xác định Definition of Done (DoD) cho từng chức năng
    - Định lượng sơ bộ khối lượng công việc bằng UCP
- Yêu cầu bắt buộc
    - Spec phải ngắn gọn, rõ ràng, tránh lan man
    - Ko chuyển việc sang bước tiếp theo khi chưa chốt phạm vi
    - Mọi thay đổi sua khi đã chốt phải dc update lại UCP

### 9.2. Design - Thiết kế (Leader)
Sau khi BA chốt yêu cầu, Leader chịu trách nhiệm chuyển yêu cầu thành kế hoạch kỹ thuật
- Công việc cụ thể
    - Phân rã Use Case thành các Task chi tiết
    - Thiết kế kiến trúc hệ thống phù hợp
    - Xác định cấu trúc DB, API, Service
    - Phân bổ UCP hợp lý cho từng thành viên theo năng lực
- Nguyên tắc
    - Ko cho DEV code khi chưa có thiết kế
    - Leader chịu trách nhiệm đảm bảo khối lượng UCP phân bổ là hợp lý và khả thi

`Question`: Bao gồm cả test? Cần có công thức tính tỷ trọng Dev, Test, BA

### 9.3. Develop - Phát triển
Dev chịu trách nhiệm thực thi kỹ thuật
- Công việc cụ thể
    - Coding theo đúng thiết kế
    - Unit test đầy đủ
    - Tự kiểm tra logic trc khi gửi review
- Quy định rõ
    - Ko có unit test là ko dc tính hoàn thành
    - Ko dc tạo PR khi chưa self test

`Question`: Các unit test do dev tự đề xuất?

### 9.4. Validate - Kiểm tra và Review
Đây là bước kiểm soát chất lượng
- Trách nhiệm
    - Leader thực hiện Code review 100%
    - Tester kiểm thử độc lập theo DoD
    - Ghi nhận lỗi và yêu cầu sửa nếu chưa đạt
    - Mọi lỗi bắt buộc phải ghi nhận trên Tasklist, ko nhắc miệng
- Nguyên tắc
    - Ko merge code khi chưa pass QA
    - Ko du di vì áp lực deadline
    - Chất lượng quan trọng hơn tốc độ

### 9.5. Release - Nghiệm thu và Bàn giao
Sau khi hoàn tất kiểm thử
- Technical Manager hoặc Manager xác nhận hoàn thành
- Ghi nhận UCP hoàn thành
- Thực hiện release và bàn giao
- Đánh giá sau khi release, và bài học rút kinh nghiệm

`Question`: Chưa có điểm cho code nền tảng framework, codebase

## 10. Nguyên tắc bảo hành sản phẩm
Giai đoạn nghiệm thu: Phạt theo hệ số
Giai đoạn bảo hành: Đối với các module đã nghiệm thu, chốt UCP và đã chia tiền xong, nếu tháng sau phát sinh bug tiền ẩn trên Prod
- Ko truy thu tiền UCP đã thanh toán của tháng trc
- Cá nhân liên quan phải tạo ticket Fix bug và ko dc nhận UCP
- Tuyệt đối ko tính điểm UCP mới cho việc đi sửa lại lỗi của tính năng đã dc trả tiền để làm đúng từ đầu

`Question`: Nếu bug chỉ sửa tạm để hoạt động dc, và vẫn có rủi ro tương lai phát sinh lỗi khác (có thể chứng minh), để fix bug triệt để cần khối lượng công việc lớn thì có dc đề xuất UCP mới ko? (có thể giải pháp sẽ giúp giảm chi phí vận hành)

## 11. Tỷ lệ phân bổ Quỹ
- Dev trực tiếp: 60 - 65%
- Tester: 16%
- BA: 12%
- DevOps: 2%
- Leader: 5 - 10%

## 12. Cơ chế cốt UCP và khoá scope
1. Sau khi BA xác định UCP và dc duyệt thì UCP sẽ dc chốt và khoá
2. Mọi thay đổi đều phải tạo CR và định lượng lại UCP
- Với thay đổi nhỏ (< 5 UCP): Leader và BA dc toàn quyền tự chốt để đảm bảo tốc độ dự án
- Với thay đổi lớn (>= 5 UCP) hoặc ảnh hưởng đến kiến trúc Core: Phải trình Technical Manager phê duyệt
3. Ko dc yêu cầu Dev làm thêm ngoài UCP đã chốt

## 13. Cơ chế dự phòng kỹ thuật
Dự phòng 5% tổng UCP mỗi quý để đưa vào quỹ cải tiến kỹ thuật. Dùng khi
- Refactor hệ thống cũ
- Tối ưu performance
- Cập nhật bảo mật
- Giảm Tech Debt
Đảm bảo hệ thống ko bị chậm dần khi phát triển dần theo thời gian

## 14. Cơ chế đánh giá hiệu suất
Ngoài KPI cá nhân, sẽ có KPI Squad
- UCP hoàn thành >= 95%
- Tỷ lệ bug Prod < 3%
- Ko vi phạm quy trình 5 bước
Nếu Squad đạt chuẩn 3 tháng liên tiếp:
- Sẽ xem xét và tiến đến tăng định mức UCP
- Sẽ xem xét và tiến đến tăng đơn giá UCP nội bộ

## 15. Cơ chế tách biệt "hiệu suất" và "năng lực"
- Hiệu suất (performance) = UCP hoàn thành
- Năng lực (Competency) = Kiến thức, kỹ năng, khả năng giải quyết vấn đề
Mỗi Dev có thể đạt KPI nhưng chưa đủ năng lực để lên Leader
Việc bổ nhiệm Leader phải dựa trên:
    - 6 tháng đạt >= 95% KPI
    - Ko để lỗi nghiêm trọng trên Prod
    - Technical Manager đề xuất

## 16. Kiểm soát nội bộ hàng quý
- Rà soát UCP thực tế với cam kết
- So sánh giờ công thực tế với định mức
- Kiểm tra số bug Prod
- Đánh giá chất lượng spec BA

## 17. Công thức tính giá trị công việc cơ sở

### 17.1. Giá trị cơ sở sản xuất
G = K x E x P x H
Trong đó
G = Giá trị chi phí sản xuất phần mềm
K = Hệ số quản lý và rủi ro (mặc định 1.4)
E = Tổng UCP dc duyệt
P = Số giờ tiêu chuẩn cho 1 UCP
H = Đơn giá giờ công bình quân

### 17.1. Cách xác định từng biến
E: Lấy từ tasklist
P: Do Technical Manager ban hành. Ví dụ: 4 giờ/UCP
H: Do BGD phê duyệt. Ví dụ: 200k/giờ
K: Theo loại dự án
    - Nội bộ: 1.3
    - Chuẩn: 1.4
    - Phức tạp: 1.5 - 1.6

## 18. Công thức tính quỹ công việc nội bộ
Quỹ khoán nội bộ là Q = G x R
Trong đó:
R = Tỷ lệ trích quỹ thưởng nộ bộ. Ví dụ 20 - 30%
Ví dụ:
G = 100.000.000
R = 25%
Q = 25.000.000 (quỹ thưởng dự án)

## 19. Công thức chia job nhóm
1. Công thức tính Quỹ khoán và chia Job nhóm
- Quỹ tiêu chuẩn = Q
- Quỹ thực nhận = Q x K_Nhóm (hệ số nhóm: 1.1, 1.0, 0.8)
2. Công thức chia tiền cho từng cá nhân
- Dev = Quỹ thực nhận x (60% - 65%)
- Tester = Quỹ thực nhận x 16%
- BA = Quỹ thực nhận x 12%
- DevOps = Quỹ thực nhận x 2%
- Leader tham gia code = Quỹ thực nhận x (5% - 10%)
Nếu vị trí có nhiều nhân sự: Cá nhân = Quỹ nhóm x (UCP của vị trí / Tổng UCP của nhóm)
3. Công thức thưởng Leader
Nếu Squad vượt định mức
Leader = UCP vượt x Đơn giá UCP x 10%
Trong đó UCP vượt = UCP thực tế - UCP cam kết
4.  Công thức giới hạn an toàn
Để tránh chi vượt kiểm soát: Tổng job addon <= 50% x lương cứng
5. Côgn thức kiểm soát lợi nhuận tối thiểu
Lợi nhuận tối thiểu >= 20% x G
Hoặc:
Giá bán >= G x 1.2
Nếu ko đạt thì ko nhận dự án
`Question`: Dự án dạng SaaS, chạy và vận hành sẽ tính theo cơ chế nào?
