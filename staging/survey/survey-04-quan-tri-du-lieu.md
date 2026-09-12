# Vietnam Airlines · Lakehouse

## Phiếu khảo sát 04 — Nhu cầu quản trị dữ liệu

**Mục lục**
1. [Hướng dẫn khảo sát (GUIDE)](#1-hướng-dẫn-khảo-sát-guide)
2. [Thông tin khảo sát (INF)](#2-thông-tin-khảo-sát-inf)
3. [Thông tin hệ thống (SYS)](#3-thông-tin-hệ-thống-sys)
4. [Chất lượng dữ liệu (DQ)](#4-chất-lượng-dữ-liệu-dq)
5. [Master data (MDM)](#5-master-data-mdm)
6. [Lưu trữ / Retention (RET)](#6-lưu-trữ--retention-ret)
7. [Bảo mật (SEC)](#7-bảo-mật-sec)

## 1. Hướng dẫn khảo sát (GUIDE)
Phiếu này thu thập yêu cầu quản trị dữ liệu ở mức **một hệ thống nguồn**: chất lượng dữ liệu (DQ), master data (MDM), retention / archive (RET) và bảo mật (SEC) — làm đầu vào Data Governance và Data Quality Catalog.

**Đối tượng điền:** Data Owner / Data Steward của domain, SME nghiệp vụ, đầu mối bảo mật.

**Cách dùng:**
1. Điền **một phiếu cho một hệ thống** (cùng hệ thống với phiếu 02 nếu đã khảo sát hạ tầng).
2. Điền **INF**, **SYS**, rồi lần lượt **DQ · MDM · RET · SEC**.
3. Các câu DQ về reconciliation / đối soát đã **điền sẵn Quyết định: Có** (yêu cầu dự án); SME không cần trả lời lại.
4. Không ghi mật khẩu / secret trong phiếu này.

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
> Ví dụ: Business Analyst / Data Steward
- Đơn vị:
> Ví dụ: IT / Data Platform
- Email:
> Ví dụ: nguyen.van.a@example.com
- Số điện thoại:
> Ví dụ: 09xx xxx xxx

**Người trả lời:**
- Họ tên:
> Ví dụ: Trần Thị B
- Chức danh:
> Ví dụ: Data Owner / SME
- Đơn vị:
> Ví dụ: Trung tâm Khai thác bay
- Email:
> Ví dụ: tran.thi.b@example.com
- Số điện thoại:
> Ví dụ: 09xx xxx xxx

## 3. Thông tin hệ thống (SYS)

### Q01. Tên hệ thống?
> Ví dụ: Flight OPS

### Q02. Tên viết tắt?
> Ví dụ: FOPS

### Q03. Domain nghiệp vụ liên quan?
- ☐ Khai thác · ☐ Thương mại · ☐ Dịch vụ · ☐ Kỹ thuật · ☐ An toàn · ☐ Quản lý chung
> Nhập nếu là Domain nghiệp vụ khác

## 4. Chất lượng dữ liệu (DQ)

### Q04. Hiện tại hệ thống có quy tắc kiểm tra chất lượng dữ liệu chưa?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả ngắn / vị trí tài liệu:**
> Ví dụ: Rule validate mã sân bay · tài liệu DQ-FOPS-v1.pdf

### Q05. Có dữ liệu duplicate không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả / cách nhận biết:**
> Ví dụ: Trùng theo số hiệu chuyến + ngày trong một số luồng nhập tay

### Q06. Có master data / reference data để validate không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — liệt kê loại (hoặc trỏ sang mục MDM):**
> Ví dụ: Danh mục sân bay · loại tàu bay

### Q07. Có business rule nào để xác định record hợp lệ không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả ngắn / tài liệu:**
> Ví dụ: Record hợp lệ khi có flight_no, std, status ∈ {…}

### Q08. Ai xác nhận dữ liệu trên hệ thống đích là đúng?
| Vai trò | Họ tên | Chức danh | Đơn vị | Email | Số điện thoại | Ghi chú |
| ------- | ------ | --------- | ------ | ----- | ------------- | ------- |
| Người xác nhận chính |  |  |  |  |  |  |
| Người xác nhận khác |  |  |  |  |  |  |

### Q09. Có reconciliation giữa nguồn và hệ thống đích không?
- Quyết định: ☑ Có · ☐ Không · ☐ Chưa rõ
*Đã điền sẵn theo yêu cầu dự án. Chi tiết kỹ thuật → tài liệu DQ / thiết kế.*

### Q10. Có yêu cầu đối soát record count không?
- Quyết định: ☑ Có · ☐ Không · ☐ Chưa rõ
*Đã điền sẵn theo yêu cầu dự án. Chi tiết ngưỡng / lịch → tài liệu DQ / vận hành.*

### Q11. Có yêu cầu đối soát tổng tiền / số lượng không?
- Quyết định: ☑ Có · ☐ Không · ☐ Chưa rõ
*Đã điền sẵn theo yêu cầu dự án (khi có chỉ tiêu số). Chi tiết công thức / phạm vi → tài liệu DQ / vận hành.*

## 5. Master data (MDM)

### Q12. Những master data nào hệ thống sử dụng?
> Ví dụ: Sân bay · loại tàu bay · mã chuyến · mã nhân viên

### Q13. Master data được quản lý ở hệ thống nào?
> Ví dụ: Danh mục sân bay ở hệ thống X; mã nhân viên ở HR

### Q14. Có mã định danh dùng chung giữa các hệ thống không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả mã / phạm vi:**
> Ví dụ: Mã sân bay IATA dùng chung toàn VNA

### Q15. Nếu cùng một entity nhưng các hệ thống dùng mã khác nhau thì mapping ở đâu?
- Quyết định: ☐ Có mapping · ☐ Không có · ☐ Không áp dụng · ☐ Chưa rõ

**Vị trí / tài liệu mapping:**
> Ví dụ: Bảng map trên hệ thống Y · file Excel quản lý bởi BA domain

### Q16. Hệ thống hiện tại đã có quy tắc quản lý dữ liệu chưa?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — cung cấp / chỉ vị trí tài liệu:**
> Ví dụ: Data management policy nội bộ · link wiki

## 6. Lưu trữ / Retention (RET)

### Q17. Hệ thống nguồn hiện lưu dữ liệu bao nhiêu năm?
> Ví dụ: 7 năm online · 3 năm archive

### Q18. Hệ thống đích cần giữ bao nhiêu năm?
> Ví dụ: 7 năm · theo quy định nội bộ

### Q19. Data Mart cần giữ bao nhiêu năm?
> Ví dụ: 3–5 năm · hoặc theo từng mart

### Q20. Có cần historical snapshot không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: Snapshot cuối ngày cho trạng thái chuyến bay

### Q21. Có cần lưu trạng thái dữ liệu tại từng thời điểm không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: SCD Type 2 cho thông tin tàu bay

### Q22. Có yêu cầu archive dữ liệu không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: Archive sau 3 năm sang cold storage

### Q23. Có yêu cầu purge dữ liệu không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: Purge PII sau hết thời hạn lưu theo chính sách

## 7. Bảo mật (SEC)

### Q24. Dữ liệu có chứa PII không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — loại PII:**
> Ví dụ: Họ tên hành khách · số giấy tờ · điện thoại · email

### Q25. Có dữ liệu nhạy cảm của hành khách cần bảo mật không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả:**
> Ví dụ: Thông tin hành trình · đặc thù y tế / hỗ trợ đặc biệt

### Q26. Có dữ liệu nhạy cảm của nhân viên cần bảo mật không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả:**
> Ví dụ: Mã nhân viên · lịch bay tổ bay · đánh giá nội bộ

### Q27. Có dữ liệu tài chính nhạy cảm cần bảo mật không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có — mô tả:**
> Ví dụ: Doanh thu theo chuyến · giá vé · công nợ

### Q28. Ai được phép truy cập dữ liệu (sau khi vào hệ thống đích)?
| Vai trò / nhóm | Phạm vi dữ liệu | Ghi chú |
| -------------- | --------------- | ------- |
|                |                 |         |
|                |                 |         |

### Q29. Có phân quyền theo domain / đơn vị không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: Domain Khai thác chỉ xem dữ liệu khai thác

### Q30. Có yêu cầu row-level security không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: Lọc theo mã sân bay / đơn vị người dùng

### Q31. Có yêu cầu audit access log không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — mô tả:**
> Ví dụ: Ghi log ai đọc / xuất PII · giữ 1 năm

### Q32. Có yêu cầu encryption dữ liệu không?
- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có — phạm vi:**
- ☐ At-rest · ☐ In-transit · ☐ Cả hai · ☐ Chưa rõ
> Nhập nếu là yêu cầu mã hóa khác

*Phiên bản 1.0*
