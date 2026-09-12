# Vietnam Airlines · Lakehouse

## Phiếu khảo sát 02 — Hạ tầng và môi trường hệ thống nguồn

**Mục lục**
1. [Hướng dẫn khảo sát (GUIDE)](#1-hướng-dẫn-khảo-sát-guide)
2. [Thông tin khảo sát (INF)](#2-thông-tin-khảo-sát-inf)
3. [Thông tin hệ thống khảo sát (SYS)](#3-thông-tin-hệ-thống-khảo-sát-sys)
4. [Thông tin tài liệu (DOC)](#4-thông-tin-tài-liệu-doc)
5. [Thông tin truy cập (ACC)](#5-thông-tin-truy-cập-acc)
6. [Data source (DS)](#6-data-source-ds)
   - 6.1. [Database (DB)](#61-database-db)
   - 6.2. [File (FILE)](#62-file-file)
   - 6.3. [Messaging (MSG)](#63-messaging-msg)
   - 6.4. [API (API)](#64-api-api)
   - 6.5. [Manual (MANUAL)](#65-manual-manual)

## 1. Hướng dẫn khảo sát (GUIDE)
Phiếu này thu thập hiện trạng kỹ thuật của **một hệ thống nguồn** phục vụ đưa dữ liệu vào hệ thống đích: thông tin hệ thống, loại nguồn dữ liệu, thông tin tài liệu, truy cập / kết nối, và chi tiết theo từng loại nguồn (Database, File, Messaging, API, Manual).

**Đối tượng điền:** đầu mối kỹ thuật hệ thống, DBA, đội hạ tầng / tích hợp.

**Cách dùng:**
1. Điền **một phiếu cho một hệ thống**.
2. Tại mục **SYS**, chọn loại nguồn dữ liệu chính: **Database (DB)** · **File (FILE)** · **Messaging (MSG)** · **API (API)** · **Manual (MANUAL)** (có thể chọn nhiều nếu hệ thống cung cấp nhiều kênh).
3. Điền mục **INF**, **SYS**, **DOC**, **ACC** cho mọi hệ thống.
4. Chỉ điền các mục con trong **Data source (DS)** tương ứng loại nguồn đã chọn. Mục không áp dụng xin bỏ qua.

## 2. Thông tin khảo sát (INF)
**Ngày khảo sát:**
> Ví dụ: 06/09/2026

**Hình thức khảo sát:**
- ☐ Họp trực tiếp · ☐ Online · ☐ Email / tài liệu
> Nhập nếu là hình thức khảo sát khác

**Người khảo sát:**
- Họ tên:
> Ví dụ: Nguyễn Văn A
- Chức danh:
> Ví dụ: Business Analyst
- Đơn vị:
> Ví dụ: IT / Data Platform
- Email:
> Ví dụ: nguyen.van.a@example.com
- Số điện thoại:
> Ví dụ: 09xx xxx xxx

**Người trả lời:**
- Họ tên:
> Ví dụ: Nguyễn Văn A
- Chức danh:
> Ví dụ: DBA / Technical Lead
- Đơn vị:
> Ví dụ: IT / Data Platform
- Email:
> Ví dụ: nguyen.van.a@example.com
- Số điện thoại:
> Ví dụ: 09xx xxx xxx

## 3. Thông tin hệ thống khảo sát (SYS)

### Q01. Tên hệ thống?
> Ví dụ: Flight OPS

### Q02. Tên viết tắt?
> Ví dụ: FOPS

### Q03. Loại nguồn dữ liệu chính cần tích hợp cho hệ thống đích?
*Chọn một hoặc nhiều. Mục Data source (DS) điền theo lựa chọn này.*
- ☐ Database (DB) · ☐ File (FILE) · ☐ Messaging (MSG) · ☐ API (API) · ☐ Manual (MANUAL)
> Nhập nếu là loại nguồn dữ liệu khác

### Q04. Domain nghiệp vụ mà nguồn dữ liệu có liên quan?
- ☐ Khai thác · ☐ Thương mại · ☐ Dịch vụ · ☐ Kỹ thuật · ☐ An toàn · ☐ Quản lý chung
> Nhập nếu là Domain nghiệp vụ khác

### Q05. Đơn vị đang trực tiếp khai thác hệ thống?
> Ví dụ: Trung tâm Khai thác bay

### Q06. Đơn vị đang trực tiếp vận hành hệ thống?
> Ví dụ: IT Operations

### Q07. Đầu mối nghiệp vụ?
*Có thể nhiều người — thêm dòng nếu cần.*

| Vai trò | Họ tên | Chức danh | Đơn vị | Email | Số điện thoại | Ghi chú |
| ------- | ------ | --------- | ------ | ----- | ------------- | ------- |
| Đầu mối chính |  |  |  |  |  |  |
| Đầu mối khác |  |  |  |  |  |  |
| Đầu mối khác |  |  |  |  |  |  |

### Q08. Đầu mối kỹ thuật?
*Có thể nhiều người — thêm dòng nếu cần.*

| Vai trò | Họ tên | Chức danh | Đơn vị | Email | Số điện thoại | Ghi chú |
| ------- | ------ | --------- | ------ | ----- | ------------- | ------- |
| Đầu mối chính |  |  |  |  |  |  |
| Đầu mối khác |  |  |  |  |  |  |
| Đầu mối khác |  |  |  |  |  |  |

### Q09. Đơn vị cung cấp hệ thống trước đó?
> Ví dụ: ABC Vendor / nội bộ

### Q10. Công nghệ sử dụng?
> Ví dụ: Java · Oracle · On-premise

### Q11. Hệ thống đang triển khai On-premise hay Cloud?
- ☐ On-premise · ☐ Cloud · ☐ Hybrid · ☐ Chưa rõ

**Chi tiết (nơi đặt / nhà cung cấp cloud):**
> Ví dụ: Data center nội bộ / AWS ap-southeast-1

### Q12. Hệ thống có kế hoạch upgrade / migration / replacement không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — nền tảng / hệ thống đích?**
> Ví dụ: Oracle → PostgreSQL / sang hệ thống X

**Nếu có — thời điểm dự kiến?**
> Ví dụ: Q2/2027

**Nếu có — ảnh hưởng tới việc lấy dữ liệu cho hệ thống đích?**
> Ví dụ: Schema đổi · cần freeze CDC 2 tuần

## 4. Thông tin tài liệu (DOC)
*Thu thập tài liệu hiện có của hệ thống nguồn (thiết kế, hướng dẫn, sơ đồ luồng…) phục vụ đội tích hợp dữ liệu.*

### Q13. Danh mục tài liệu có thể cung cấp cho đội tích hợp dữ liệu?
| Loại / tên tài liệu | Có? | Vị trí (link / thư mục) | Phiên bản / ngày | Có thể chia sẻ? | Ghi chú |
| ------------------- | --- | ----------------------- | ---------------- | --------------- | ------- |
| Tài liệu thiết kế database | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
| Tài liệu thiết kế hệ thống | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
| Tài liệu hướng dẫn sử dụng | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
| ERD / data dictionary | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
| Tài liệu API / interface | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
| Sơ đồ luồng / kiến trúc tích hợp | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
| Khác: | ☐ Có · ☐ Không |  |  | ☐ Có · ☐ Không · ☐ Cần phê duyệt |  |
> Nhập tên loại tài liệu khác vào cột Loại / tên tài liệu (dòng Khác)

## 5. Thông tin truy cập (ACC)
*Áp dụng cho mọi hệ thống nguồn. Không yêu cầu cung cấp mật khẩu hay secret trong phiếu này. Chi tiết tài khoản theo từng loại nguồn khai ở mục **DS**.*

### Q14. Mô hình truy cập tới hệ thống nguồn là gì?
- ☐ Trực tiếp trong mạng nội bộ · ☐ Remote qua VPN của công ty · ☐ Remote qua máy chủ trung gian
> Nhập nếu là mô hình truy cập khác

### Q15. Trong quá trình phát triển, hệ thống được cấp tài khoản truy cập để lấy dữ liệu từ môi trường nào?
- ☐ Production · ☐ UAT
> Nhập nếu là môi trường khác

### Q16. Người cấp quyền / phê duyệt truy cập dữ liệu hệ thống nguồn?
| Vai trò | Họ tên | Chức danh | Đơn vị | Email | Số điện thoại | Ghi chú |
| ------- | ------ | --------- | ------ | ----- | ------------- | ------- |
| Người cấp quyền |  |  |  |  |  |  |
| Phê duyệt nghiệp vụ |  |  |  |  |  |  |
| Phê duyệt kỹ thuật / DBA / Application Admin |  |  |  |  |  |  |
| Phê duyệt bảo mật / mạng |  |  |  |  |  |  |
| Khác |  |  |  |  |  |  |

## 6. Data source (DS)

*Chỉ điền các mục 6.1–6.5 tương ứng loại nguồn đã chọn ở Q03.*

### 6.1. Database (DB)

### Q17. Cách lấy dữ liệu từ database mà phía nguồn hỗ trợ?
- ☐ Query / pull định kỳ (batch) · ☐ Change Data Capture (CDC)
> Nhập nếu là cách lấy dữ liệu khác

### Q18. Tần suất cho phép query / lấy dữ liệu từ database?
- ☐ Liên tục / theo lịch ngắn (< 5 phút) · ☐ Theo giờ · ☐ Theo ngày · ☐ Theo tuần · ☐ Theo sự kiện · ☐ Chưa quy định
> Nhập nếu là tần suất khác

### Q19. Khung thời gian cho phép mỗi lần lấy dữ liệu?
> Ví dụ: Chỉ 01:00–05:00 hàng ngày · mỗi lần ≤ 30 phút · không chạy cuối tuần cao điểm

### Q20. Có được cấp tài khoản truy cập cơ sở dữ liệu không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

#### 6.1.1. Thông tin database

### Q21. Database engine?
- ☐ Oracle · ☐ PostgreSQL · ☐ MySQL · ☐ MariaDB · ☐ SQL Server · ☐ Không có DB
> Nhập nếu là database engine khác

### Q22. Version database?
> Ví dụ: Oracle 19c

### Q23. Có bao nhiêu database?
> Ví dụ: 3

### Q24. Có bao nhiêu schema?
> Ví dụ: 12

### Q25. Có bao nhiêu table?
> Ví dụ: khoảng 250 bảng

### Q26. Tổng dung lượng database hiện tại?
> Ví dụ: ~2.5 TB

### Q27. Dung lượng tăng trưởng trung bình mỗi ngày?
> Ví dụ: ~5 GB / ngày

### Q28. Dung lượng tăng trưởng trung bình mỗi tháng?
> Ví dụ: ~150 GB / tháng

### Q29. Những table nào có dữ liệu lớn nhất?
| Table | Schema | Dung lượng / số record (ước tính) | Ghi chú |
| ----- | ------ | --------------------------------- | ------- |
|       |        |                                   |         |
|       |        |                                   |         |
|       |        |                                   |         |

#### 6.1.2. Change Data Capture (CDC)

### Q30. Có CDC không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có, công cụ / cơ chế CDC:**
> Ví dụ: Oracle GoldenGate / Debezium

### Q31. Có database transaction log / binlog / WAL có thể sử dụng không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ · ☐ Không được phép dùng
**Loại log:**
- ☐ Redo / archive log · ☐ Binlog · ☐ WAL
> Nhập nếu là loại log khác

**Điều kiện sử dụng:**
> Ví dụ: Chỉ dùng archive log · cần phê duyệt DBA

### Q32. Có thể sử dụng database replication không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Cơ chế replication hiện có:**
> Ví dụ: Data Guard physical standby

### Q33. Có thể tạo / cung cấp read replica để phục vụ lấy dữ liệu tích hợp không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Điều kiện / hạn chế:**
> Ví dụ: Chỉ đọc · ngoài giờ cao điểm · max 2 sessions

### Q34. Có giới hạn kết nối đồng thời / tài nguyên khi truy cập database production không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có, mô tả giới hạn:**
> Ví dụ: 10 CCU

### 6.2. File (FILE)

*Điền nếu Q03 chọn File (FILE).*

### Q35. Phương thức nhận file?
- ☐ SFTP · ☐ FTPS / FTP · ☐ Thư mục chia sẻ / NAS · ☐ Object storage (S3 / tương đương) · ☐ Email đính kèm · ☐ Tải qua API / HTTP
> Nhập nếu là phương thức nhận file khác

### Q36. Dữ liệu được xuất thành file định dạng gì?
- ☐ CSV · ☐ TXT · ☐ XML · ☐ JSON · ☐ Excel · ☐ Word
> Nhập nếu là định dạng file khác

**Chi tiết:**
> Ví dụ: Bổ sung chi tiết nếu cần

### Q37. File được tạo với tần suất bao lâu?
- ☐ Realtime / liên tục · ☐ Theo giờ · ☐ Theo ngày · ☐ Theo sự kiện
> Nhập nếu là tần suất khác

**Chi tiết lịch:**
> Ví dụ: Mỗi ngày 02:00 · file theo chuyến khi đóng

### Q38. File được đặt ở đâu?
> Ví dụ: /data/outbound/flight/

### Q39. Naming convention của file? Mô tả naming convention
> Ví dụ: FOPS_YYYYMMDD_HHMMSS.csv

### Q40. Có cơ chế xác nhận file đã nhận đầy đủ không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Mô tả cơ chế:**
> Ví dụ: File .ok sau khi ghi xong · đối soát record count

### Q41. Nếu file bị thiếu / mất / corrupt thì xử lý như thế nào?
> Ví dụ: Báo alert · yêu cầu re-send file trong 24h

### Q42. Có thể nhận lại file cũ không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Điều kiện / thời hạn lưu file:**
> Ví dụ: Giữ 30 ngày · có thể lấy lại trong cửa sổ này

### Q43. File có chứa dữ liệu trùng lặp không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Cách xử lý trùng:**
> Ví dụ: Dedup theo business key trước khi load hệ thống đích

### 6.3. Messaging (MSG)

*Điền nếu Q03 chọn Messaging (MSG).*

### Q44. Có được cấp tài khoản truy cập nguồn Messaging không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

### Q45. Nền tảng Messaging đang dùng?
- ☐ Kafka · ☐ RabbitMQ · ☐ IBM MQ · ☐ ActiveMQ
> Nhập nếu là nền tảng Messaging khác

### Q46. Messaging nằm ở đâu?
- ☐ Data center nội bộ · ☐ Cloud
> Nhập nếu là vị trí khác

**Chi tiết (DC / nhà cung cấp cloud / region):**
> Ví dụ: DC chính · AWS ap-southeast-1

### Q47. Mô tả các topic / queue cần lấy dữ liệu?
> Ví dụ: topic flight.status.changed — trạng thái chuyến bay; topic booking.created — đặt chỗ mới

### Q48. Message format là gì?
- ☐ JSON · ☐ XML · ☐ Avro · ☐ Protobuf · ☐ Text
> Nhập nếu là message format khác
**Ví dụ / tài liệu schema:**
> Ví dụ: Avro schema registry / link tài liệu

### Q49. Message có schema / documentation không?
- Quyết định: ☐ Có schema · ☐ Có tài liệu · ☐ Cả hai · ☐ Không · ☐ Chưa rõ

### Q50. Message có unique ID không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ
**Tên field:**
> Ví dụ: event_id / event_ts

### Q51. Có sequence number không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ
**Tên field / cách đánh số:**
> Ví dụ: Sequence tăng dần theo ngày · SEQ_001

### Q52. Có timestamp / event timestamp không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ
**Tên field:**
> Ví dụ: event_id / event_ts

### Q53. Có cơ chế retry không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Mô tả retry:**
> Ví dụ: Retry 5 lần · backoff 30s

### Q54. Có cơ chế dead-letter queue không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ
**Tên DLQ / cách xử lý:**
> Ví dụ: topic flight.status.dlq · xử lý thủ công

### Q55. Có thể replay message không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Điều kiện replay:**
> Ví dụ: Replay theo offset trong 7 ngày

### 6.4. API (API)

*Điền nếu Q03 chọn API (API).*

### Q56. Có được cấp tài khoản truy cập nguồn API không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

### Q57. Base URL / endpoint chính (không ghi secret)?
> Ví dụ: https://api.internal.example.com/flight/v1

### Q58. Phương thức xác thực?
- ☐ API key · ☐ OAuth2 · ☐ Basic · ☐ Certificate / mTLS
> Nhập nếu là phương thức xác thực khác

### Q59. Có giới hạn rate limit / quota không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**
> Ví dụ: 100 req/phút · max payload 5 MB

### Q60. API hỗ trợ lấy dữ liệu theo cách nào?
- ☐ Full extract · ☐ Incremental (từ ngày / cursor) · ☐ Theo ID / batch ID · ☐ Pagination
> Nhập nếu là cách lấy dữ liệu khác

### Q61. Định dạng response?
- ☐ JSON · ☐ XML
> Nhập nếu là định dạng response khác

### 6.5. Manual (MANUAL)

*Điền nếu Q03 chọn Manual (MANUAL) — nhập liệu thủ công / form.*

### Q62. Hình thức nhập liệu thủ công?
- ☐ Form web nội bộ · ☐ Microsoft Forms / Google Forms · ☐ Excel / Word nhập tay · ☐ Paper → số hóa
> Nhập nếu là hình thức nhập liệu khác

### Q63. Ai nhập liệu?
> Ví dụ: Nhân viên mặt đất · ca trực

### Q64. Tần suất / khối lượng nhập liệu?
> Ví dụ: ~200 bản ghi/ngày · cao điểm theo chuyến

### Q65. Có validation / bắt buộc trường không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Mô tả ngắn:**
> Ví dụ: Bắt buộc flight_no, date · validate mã sân bay

### Q66. Có thể chỉnh sửa / xóa bản ghi đã gửi không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Cơ chế:**
> Ví dụ: Soft delete · giữ audit log

*Phiên bản 1.0*
