# Bộ câu hỏi khảo sát phạm vi và khối lượng dữ liệu — SmartX / MBF

> **Mục đích:** Thu thập số liệu **production** của toàn bộ dữ liệu 3 hệ thống nguồn, phục vụ sizing hạ tầng Big Data. Không dùng số liệu demo làm đầu vào thiết kế.
>
> **Cách dùng:** Phần 0 không hỏi lại. Các câu hỏi còn lại ưu tiên số liệu **toàn bộ** SmartF + SmartW + mPCBL, không chỉ phần đang demo. Câu đánh **(quan trọng)** là số liệu sizing bắt buộc phải thu về.

---

## 0. Thông tin đã nắm — không hỏi lại

| Hạng mục | Đã biết |
| --- | --- |
| Dự án | SmartX thay thế **SmartF**, **SmartW**, **mPCBL** |
| Phân vai | Foxsoft: SmartW + SSO. VNS / Minvoice: SmartF + mPCBL |
| Hệ thống cũ | Hoạt động từ **2018** |
| Hạ tầng | On-premise do MBF cung cấp (có GPU). **Không đưa dữ liệu lên cloud**; LLM self-host |
| Thu thập | File log / text qua **SFTP/FTP** |
| SLA xử lý (theo loại dữ liệu) | **15 phút · 1 giờ · 1 ngày** |
| UI | Thời gian load trang mong muốn **5 giây** |
| Hạ tầng thô đã nêu | 10 server chứa dữ liệu thô, mỗi server disk 2 TB. Server DB: Disk 4 TB, RAM 64 GB, CPU 16 cores — **chưa rõ số lượng** |

### Số liệu demo — chỉ tham chiếu, không dùng để sizing

| Metric | Giá trị demo | Ghi chú |
| --- | --- | --- |
| File đang demo | 2,5 triệu file/ngày | Phạm vi demo, không phải toàn bộ |
| File / dung lượng / bản ghi (ước lượng demo) | 5 triệu file/ngày · ~200 KB/file · ~1 TB/ngày · 2 tỷ bản ghi/ngày | Cần xác nhận số **production toàn bộ** |

Tổng dung lượng 3 hệ thống nguồn **chưa đo chi tiết**.

---

## 1. Phạm vi dữ liệu theo hệ thống nguồn

Không hỏi lại tên 3 hệ thống. Cần làm rõ **toàn bộ** dữ liệu từng hệ — kể cả phần chưa đưa vào demo.

1. Mỗi hệ thống SmartF / SmartW / mPCBL gồm những **loại dữ liệu / luồng log** nào? Loại nào **đã** nằm trong demo, loại nào **chưa**?
2. Ngoài file log/text trên SFTP/FTP, còn nguồn nào khác cần xử lý không (database OLTP, API, message queue, …)? Nếu có, thuộc hệ thống nào?
3. Có bao nhiêu **database / schema** trên các server DB hiện tại? Phân bố theo SmartF / SmartW / mPCBL?
4. Có bao nhiêu **Data Center / site** cần kết nối? File SFTP và DB có cùng site không?
5. Việc đọc file / đọc DB có giới hạn gì không (cửa sổ giờ, rate limit, không được đọc giờ cao điểm, …)?

---

## 2. Khối lượng production hiện tại

Hỏi **dữ liệu đang có trên hệ thống nguồn**, không phải phần đang demo. Nếu chưa đo được, ghi rõ cách ước lượng (dung lượng disk đã dùng, số file, …).

1. **(quan trọng)** Tổng dung lượng dữ liệu hiện tại của **cả 3 hệ thống** là bao nhiêu TB? (dùng / allocated)
2. **(quan trọng)** Phân bố theo hệ thống:

| Hệ thống | Loại dữ liệu (file / DB / khác) | Dung lượng đang dùng | Số bản ghi (nếu có) | Ghi chú (đã đo / ước lượng) |
| --- | --- | ---: | ---: | --- |
| SmartF | | | | |
| SmartW | | | | |
| mPCBL | | | | |
| **Tổng** | | | | |

3. **(quan trọng)** Trên 10 server thô (2 TB/server): dung lượng **đã dùng** bao nhiêu? Còn trống bao nhiêu?
4. **(quan trọng)** Có bao nhiêu **server DB** (mỗi máy Disk 4 TB / RAM 64 GB / CPU 16 cores)? Disk DB đã dùng bao nhiêu?
5. Tập dữ liệu / bảng / thư mục file **lớn nhất**: dung lượng và số bản ghi (hoặc số file) là bao nhiêu?

---

## 3. Tốc độ phát sinh hàng ngày (production)

Số 5 triệu file / 1 TB / 2 tỷ bản ghi là ước lượng demo. Cần số **production toàn bộ**.

1. **(quan trọng)** Production: mỗi ngày phát sinh bao nhiêu **file**, bao nhiêu **GB/TB**, bao nhiêu **bản ghi** — theo từng hệ thống SmartF / SmartW / mPCBL?
2. **(quan trọng)** Trong đó, phần đang dùng cho demo chiếm bao nhiêu % so với toàn bộ?
3. **(quan trọng)** Peak trong ngày: GB/hour hoặc file/hour cao nhất? Thời điểm nào (giờ / chu kỳ billing / cuối tháng)?
4. **(quan trọng)** File size: trung bình / nhỏ nhất / lớn nhất? (tham chiếu demo ~200 KB — xác nhận production)
5. **(quan trọng)** Format file thực tế là gì (plain text, CSV, JSON, XML, …)? Một file chứa một loại log hay lẫn nhiều loại?

---

## 4. Tăng trưởng

1. **(quan trọng)** Data volume tăng khoảng bao nhiêu % mỗi tháng, hoặc bao nhiêu GB/TB mỗi ngày?
2. Có đợt tăng đột biến theo tháng / quý / chu kỳ billing / campaign không? Mức tăng khoảng bao nhiêu lần so với ngày thường?
3. Dự kiến volume sau 1 năm và 3 năm (nếu có kế hoạch tăng thuê bao / sản phẩm)?

---

## 5. SLA xử lý theo loại dữ liệu

Đã biết 3 mức **15 phút · 1 giờ · 1 ngày**. Không hỏi lại có cần real-time hay không.

1. **(quan trọng)** Map từng loại dữ liệu / luồng (câu 1.1) vào một trong 3 mức trên.
2. SLA tính từ lúc nào: file xuất hiện trên SFTP, hay giao dịch phát sinh ở hệ thống nguồn?
3. Với mức 15 phút: cửa sổ xử lý thực tế còn lại bao lâu sau khi file sẵn sàng (copy, decode, transform)?
4. **(quan trọng)** Có luồng nào **ngoài** 3 mức trên không (ví dụ cần nhanh hơn 15 phút)? Nếu có, latency tối đa chấp nhận được?

---

## 6. Thu thập file SFTP/FTP

Đã biết phương thức là SFTP/FTP. Không hỏi CDC / Kafka / API trừ khi câu 1.2 xác nhận còn nguồn khác.

1. Cấu trúc thư mục / naming convention trên SFTP? File được đẩy theo batch nào (mỗi N phút, hourly, daily)?
2. Số file/ngày production (toàn bộ, không phải demo), peak file/hour?
3. File được **xoá / archive** trên SFTP sau bao lâu? Có thể đọc lại file cũ trong bao lâu?
4. Có cơ chế báo file đã ghi xong (done-file, naming `.complete`, …) không?
5. Nếu câu 1.2 có nguồn **không phải file**: phương thức nào, volume (bản ghi/ngày hoặc events/sec), giới hạn đọc?

---

## 7. Chuyển đổi & xử lý

1. Log có cần parse / cleansing / chuẩn hoá schema trước khi dùng không? Tỷ lệ file lỗi / sai format roughly bao nhiêu?
2. **(quan trọng)** Có cần **join / correlate** giữa SmartF, SmartW, mPCBL không? Key join là gì (số hợp đồng, CIF, số điện thoại, …)?
3. Có cần dedup không? Grain của một bản ghi nghiệp vụ là gì?
4. Aggregation cần theo chiều nào (khách hàng, sản phẩm, ngày, giờ, chi nhánh, …)?
5. **(quan trọng)** Workload AI/ML dự kiến dùng GPU / LLM self-host cho việc gì (phân loại log, phát hiện bất thường, …)? Chạy trên dữ liệu raw, dữ liệu đã tổng hợp, hay cả hai? Volume đưa vào model mỗi ngày roughly bao nhiêu?

---

## 8. Cửa sổ xử lý & reprocess

1. **(quan trọng)** Với luồng **1 ngày**: batch bắt đầu / kết thúc lúc mấy giờ? Phải xong trước giờ nào?
2. Có bao nhiêu pipeline / job chạy song song trong cùng cửa sổ?
3. Có cần **reprocess** 1 ngày dữ liệu không? Thời gian tối đa chấp nhận được khi reprocess 1 ngày (theo volume production, không theo demo)?
4. **(quan trọng)** Historical từ 2018: có cần backfill / migrate vào SmartX không? Toàn bộ hay một phần (bao nhiêu năm, bao nhiêu TB)? Deadline?

---

## 9. Khai thác (UI / báo cáo)

Đã biết load trang **5 giây**. Không hỏi lại response time.

1. **(quan trọng)** Bao nhiêu user, peak concurrent users? Bao nhiêu màn hình / dashboard / report chính?
2. Dữ liệu trên UI lấy từ lớp nào (chi tiết giao dịch, bảng tổng hợp, hay cả hai)?
3. Có truy vấn ad-hoc ngoài màn hình cố định không? Ai được phép (analyst, vận hành, …)?

---

## 10. Lưu trữ, chất lượng, bảo mật

1. **(quan trọng)** Retention: raw / processed / aggregated giữ bao lâu? Archive sau đó thế nào?
2. Backup / DR: RPO, RTO yêu cầu (nếu MBF đã có chuẩn)?
3. Vấn đề chất lượng hiện tại: duplicate, thiếu field, sai format — mức độ roughly? Có cần đối soát source ↔ đích không?
4. **(quan trọng)** Có PII / dữ liệu nhạy cảm không? Yêu cầu masking, mã hoá, phân quyền (phòng ban / chi nhánh / vai trò)? Audit truy cập?

---

## 11. Bảng sizing — số liệu production cần thu về

Điền số **toàn bộ 3 hệ thống**. Cột demo chỉ để đối chiếu, không copy sang thiết kế.

| Metric | Demo (tham chiếu) | Production — SmartF | Production — SmartW | Production — mPCBL | Production — Tổng |
| --- | --- | --- | --- | --- | --- |
| Dung lượng hiện tại (TB đã dùng) | chưa đo | | | | |
| File/ngày | 2,5 triệu (đang demo) / 5 triệu (ước lượng) | | | | |
| GB–TB/ngày | ~1 TB (ước lượng) | | | | |
| Bản ghi/ngày | ~2 tỷ (ước lượng) | | | | |
| File size TB / TB / max | ~200 KB | | | | |
| Peak (file/hour hoặc GB/hour) | | | | | |
| Tăng trưởng %/tháng | | | | | |
| Retention | | | | | |
| Historical cần nạp (TB / số năm) | từ 2018, chưa đo | | | | |
| Số DB server / dung lượng DB đã dùng | spec 4 TB/máy, chưa rõ số máy | | | | |
| Số user / peak concurrent | | | | | |
| Số pipeline song song | | | | | |
