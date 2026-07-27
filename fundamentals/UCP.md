# HƯỚNG DẪN TÍNH GIÁ TRỊ PHẦN MỀM THEO CÔNG VĂN 3364/BTTTT-ƯDCNTT

## 1. Mục đích

Công văn 3364 hướng dẫn xác định giá trị phần mềm theo phương pháp Use Case Point (UCP) đối với:

- Phát triển mới phần mềm
- Nâng cấp phần mềm
- Chỉnh sửa phần mềm

sử dụng vốn ngân sách nhà nước.

---

# 2. Quy trình tổng thể

## Bước 1. Thu thập hồ sơ

Chuẩn bị:

- Quy trình nghiệp vụ
- Danh sách yêu cầu chức năng
- Danh sách yêu cầu phi chức năng
- Use Case Diagram
- Activity Diagram (nếu có)

---

## Bước 2. Lập danh sách yêu cầu chức năng

Theo Phụ lục I:

Mỗi yêu cầu cần:

- Mô tả chi tiết
- Phân loại
- Mức độ phức tạp

### Phân loại

- Input
- Output
- Query
- Database
- Lookup

---

## Bước 3. Chuyển yêu cầu chức năng thành Use Case

Theo Phụ lục II.

Ví dụ:

| Chức năng |
|------------|
| Đăng nhập |
| Tạo hóa đơn |
| Ký hóa đơn |
| Tra cứu hóa đơn |

=> 4 Use Case.

---

# 3. Tính UUCP

UUCP là điểm Use Case trước hiệu chỉnh.

## Công thức

UUCP = TAW + TBF

Theo Công văn 3364.

Trong đó:

- TAW = Total Actor Weight
- TBF = Total Use Case Weight

---

# 4. Tính điểm Actor (TAW)

## Theo UCP chuẩn Karner

[Cần đối chiếu tiếp với Phụ lục III]

| Loại Actor | Điểm |
|------------|-------|
| Simple | 1 |
| Average | 2 |
| Complex | 3 |

### Simple Actor

Giao tiếp qua API đơn giản.

Ví dụ:

- File CSV
- Batch Interface

### Average Actor

Giao tiếp qua protocol.

Ví dụ:

- REST API
- SOAP
- MQ

### Complex Actor

Người sử dụng có giao diện GUI.

Ví dụ:

- Kế toán
- Quản trị viên
- Khách hàng

### Công thức

TAW = Σ(Số lượng Actor × Trọng số)

Ví dụ:

| Actor | Loại | Điểm |
|---------|---------|---------|
| Kế toán | Complex | 3 |
| Admin | Complex | 3 |
| ERP | Average | 2 |

TAW = 8

---

# 5. Tính điểm Use Case (TBF)

## Theo UCP chuẩn Karner

[Cần đối chiếu tiếp với Phụ lục IV]

### Đếm Transaction

Một transaction là:

- Một luồng xử lý hoàn chỉnh
- Có dữ liệu vào/ra rõ ràng

---

### Phân loại

| Transaction | Loại | Điểm |
|------------|---------|---------|
| <=4 | Simple | 5 |
| 5-7 | Average | 10 |
| >=8 | Complex | 15 |

---

### Ví dụ

Use Case: Tạo hóa đơn

Transactions:

1. Chọn khách hàng
2. Nhập hàng hóa
3. Tính thuế
4. Kiểm tra dữ liệu
5. Lưu hóa đơn
6. Sinh XML
7. Trả kết quả

=> 7 transaction

=> Average

=> 10 điểm

---

### Công thức

TBF = Σ(Use Case Weight)

---

# 6. Tính TCF

Theo Công văn:

TCF = 0.6 + (0.01 × TFW)

---

## Technical Factor

[Theo UCP chuẩn Karner - cần đối chiếu Phụ lục V]

| STT | Factor | Weight |
|-------|----------|----------|
| T1 | Distributed System | 2 |
| T2 | Performance | 1 |
| T3 | End-user Efficiency | 1 |
| T4 | Complex Processing | 1 |
| T5 | Reusable Code | 1 |
| T6 | Easy Install | 0.5 |
| T7 | Easy Use | 0.5 |
| T8 | Portability | 2 |
| T9 | Easy Change | 1 |
| T10 | Concurrent Use | 1 |
| T11 | Security | 1 |
| T12 | Third-party Access | 1 |
| T13 | Training Need | 1 |

---

Mỗi yếu tố chấm:

0 → 5

TFW = Σ(Weight × Rating)

---

# 7. Tính EF

Theo Công văn:

EF = 1.4 - (0.03 × EFW)

---

## Environmental Factor

[Theo UCP chuẩn Karner - cần đối chiếu Phụ lục VI]

| Factor | Weight |
|----------|----------|
| E1 Familiar Process | 1.5 |
| E2 Experience | 0.5 |
| E3 OO Experience | 1 |
| E4 Lead Analyst | 0.5 |
| E5 Motivation | 1 |
| E6 Stable Requirement | 2 |
| E7 Part-time Staff | -1 |
| E8 Difficult Language | -1 |

---

Chấm:

0 → 5

EFW = Σ(Weight × Rating)

---

# 8. Tính AUCP

Theo Công văn:

AUCP = UUCP × TCF × EF

---

# 9. Tính Giá trị Nỗ lực E

Theo Công văn:

E = (10/6) × AUCP

---

# 10. Xác định P

Theo Công văn:

P = thời gian lao động cho 1 UCP sau hiệu chỉnh.

P được xác định bằng:

- Nội suy kinh nghiệm
- Bảng Phụ lục VI

[Cần đọc tiếp để lấy bảng chính xác]

---

## Tạm dùng chuẩn UCP phổ biến

| Chất lượng nhóm | Person-hour/UCP |
|----------------|-----------------|
| Rất tốt | 15 |
| Tốt | 20 |
| Trung bình | 28 |
| Kém | 36 |

---

# 11. Xác định H

Theo Công văn:

H = Đơn giá giờ công × (1 + f)

Trong đó:

- Lương cơ bản
- Phụ cấp
- Lương phụ
- Điều chỉnh thị trường

---

Ví dụ:

Lương tháng = 30.000.000

Giờ làm việc tháng = 176

=> Đơn giá giờ:

30.000.000 / 176

= 170.454 VNĐ

---

# 12. Tính giá trị phần mềm

Theo Công văn:

G = 1.4 × E × P × H × 1.1

---

# 13. Ví dụ nhanh

Giả sử:

TAW = 20

TBF = 180

UUCP = 200

TFW = 35

TCF = 0.95

EFW = 20

EF = 0.8

AUCP = 200 × 0.95 × 0.8

= 152

E = 152 × 10/6

= 253.33

P = 20 giờ/UCP

H = 200.000 VNĐ

G = 1.4 × 253.33 × 20 × 200.000 × 1.1

≈ 1.56 tỷ VNĐ

---

# 14. Công thức Excel

UUCP
=TAW+TBF

TCF
=0.6+0.01*TFW

EF
=1.4-0.03*EFW

AUCP
=UUCP*TCF*EF

E
=AUCP*10/6

G
=1.4*E*P*H*1.1
