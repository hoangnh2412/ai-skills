# Bộ câu hỏi khảo sát phạm vi và khối lượng dữ liệu

## 1. Tổng quan nguồn dữ liệu

1. Hiện tại doanh nghiệp có những **hệ thống nguồn dữ liệu (Data Source Systems)** nào?
2. Mỗi hệ thống thuộc loại nào?

   * OLTP Database
   * Data Warehouse
   * Data Lake
   * File
   * API
   * Message Queue / Streaming
   * Log
   * IoT
   * Khác
3. Có bao nhiêu **source system** cần tích hợp?
4. Có bao nhiêu database/schema/table cần thu thập?
5. Có hệ thống nào được xem là **Source of Truth (SSOT)** không?
6. Dữ liệu nằm ở đâu?

   * On-premise
   * Cloud
   * Hybrid
7. Có bao nhiêu Data Center / Region cần kết nối?
8. Các hệ thống nguồn có giới hạn về việc đọc dữ liệu không?

---

## 2. Khối lượng dữ liệu hiện tại

### Database / Table

1. Tổng số bảng cần xử lý là bao nhiêu?
2. Với mỗi bảng:

   * Số lượng record hiện tại?
   * Kích thước hiện tại?
   * Số lượng cột?
3. Tổng dung lượng dữ liệu hiện tại là bao nhiêu **TB**?
4. Dung lượng dữ liệu được phân bố như thế nào?

| Source  | Database   | Table    | Records |   Size |
| ------- | ---------- | -------- | ------: | -----: |
| Billing | PostgreSQL | Invoice  |    500M | 800 GB |
| CRM     | Oracle     | Customer |    100M | 200 GB |
| Network | Files      | CDR      |     20B |  15 TB |

### Câu hỏi bổ sung

5. Có bao nhiêu bảng lớn hơn:

   * 1 GB?
   * 10 GB?
   * 100 GB?
   * 1 TB?
6. Bảng lớn nhất hiện tại có bao nhiêu record?
7. Bảng lớn nhất có dung lượng bao nhiêu?

---

## 3. Tốc độ phát sinh dữ liệu

### Batch

1. Mỗi ngày có bao nhiêu dữ liệu mới?
2. Trung bình bao nhiêu GB/TB dữ liệu phát sinh mỗi ngày?
3. Peak data volume trong ngày là bao nhiêu?
4. Thời điểm nào phát sinh dữ liệu nhiều nhất?

### Streaming

5. Hệ thống có dữ liệu streaming không?
6. Nếu có, throughput trung bình là bao nhiêu **events/sec**?
7. Peak throughput là bao nhiêu **events/sec**?
8. Event size trung bình bao nhiêu bytes?
9. Event size lớn nhất bao nhiêu bytes?
10. Peak throughput kéo dài trong bao lâu?

---

## 4. Tăng trưởng dữ liệu

1. Data volume tăng bao nhiêu % mỗi tháng?
2. Tăng bao nhiêu GB/TB mỗi ngày?
3. Có xu hướng tăng trưởng đột biến theo:

   * Tháng
   * Quý
   * Năm
   * Campaign
   * Billing cycle
   * Holiday
4. Dự kiến data volume sau:

   * 1 năm?
   * 3 năm?
   * 5 năm?
5. Có cần giữ **historical data** không?
6. Thời gian retention là bao lâu?

### Ví dụ

```text
Current data: 50 TB
Growth:       2 TB/month
Retention:    7 years
```

---

## 5. Data Freshness / Latency

1. Dữ liệu cần được cập nhật với tần suất nào?

   * Real-time
   * < 1 phút
   * < 5 phút
   * < 15 phút
   * Hourly
   * Daily
   * Weekly

2. SLA tối đa cho việc dữ liệu từ source xuất hiện ở hệ thống đích là bao lâu?

3. Có workload nào yêu cầu real-time không?

4. Có workload nào có thể xử lý batch không?

5. Có workload nào yêu cầu **micro-batch** không?

---

## 6. Loại dữ liệu

1. Có những loại dữ liệu nào?

   * Customer
   * Subscriber
   * SIM
   * Device
   * CDR
   * Billing
   * Payment
   * Network
   * Location
   * Usage
   * Product
   * CRM
   * Complaint
   * IoT
   * Logs
   * Khác

2. Có dữ liệu **structured** không?

3. Có dữ liệu **semi-structured** không?

   * JSON
   * XML
   * Avro
   * Parquet

4. Có dữ liệu **unstructured** không?

   * PDF
   * Image
   * Audio
   * Video
   * Document

---

## 7. Telco-specific: CDR / Network Data

1. Có **CDR (Call Detail Record)** không?
2. Có bao nhiêu loại CDR?
3. CDR phát sinh bao nhiêu record/ngày?
4. Average record size?
5. Peak records/sec?
6. Có những loại dữ liệu nào?

   * Call
   * SMS
   * Data session
   * Roaming
   * Location
   * Charging
   * Network event
7. Network event có throughput bao nhiêu events/sec?
8. Dữ liệu có cần xử lý theo:

   * Subscriber
   * MSISDN
   * IMSI
   * IMEI
   * Cell
   * Region
9. Có cần correlation dữ liệu giữa nhiều network system không?

---

## 8. Phương thức thu thập dữ liệu

1. Source hỗ trợ phương thức nào?

   * Full extraction
   * Incremental extraction
   * CDC
   * API
   * File export
   * Kafka
   * Message Queue
   * Database replication

2. Có hỗ trợ **CDC (Change Data Capture)** không?

3. Nếu sử dụng CDC:

   * Change events/sec?
   * Change events/day?
   * Transaction size?

4. Nếu sử dụng API:

   * Requests/sec?
   * Rate limit?
   * Pagination?

5. Nếu sử dụng File:

   * Số file/ngày?
   * Average file size?
   * Peak file size?
   * File format?

---

## 9. Data Transformation

1. Dữ liệu có cần cleansing không?
2. Có cần deduplication không?
3. Có cần enrichment không?
4. Có cần join giữa các source không?
5. Có bao nhiêu bảng cần join?
6. Có transformation phức tạp không?
7. Có cần aggregation không?
8. Aggregation theo:

   * Customer
   * Subscriber
   * Cell
   * Region
   * Day
   * Hour
   * Product
9. Có cần sử dụng window function không?
10. Có cần sessionization không?
11. Có cần Machine Learning / AI processing không?

---

## 10. Processing Window

1. Daily processing phải hoàn thành trong bao lâu?
2. Batch window bắt đầu lúc mấy giờ?
3. Batch window kết thúc lúc mấy giờ?
4. Có workload chạy đồng thời không?
5. Bao nhiêu pipeline có thể chạy parallel?
6. Có workload peak theo giờ không?
7. Có cần reprocess historical data không?
8. Nếu phải reprocess 1 ngày dữ liệu thì thời gian tối đa chấp nhận được là bao lâu?

### Ví dụ

```text
Daily data:             10 TB
Available processing:  2 hours
```

---

## 11. Query / BI Workload

1. Có bao nhiêu người dùng BI?
2. Có bao nhiêu dashboard?
3. Có bao nhiêu report?
4. Số lượng query trung bình/giây?
5. Peak concurrent users?
6. Peak concurrent queries?
7. Query response time yêu cầu bao nhiêu?
8. Dashboard cần:

   * Real-time
   * Near-real-time
   * Hourly
   * Daily
9. Có ad-hoc analytics không?
10. Có Data Scientist / Data Analyst truy cập trực tiếp Data Platform không?

---

## 12. Data Retention & Storage

1. Dữ liệu Raw giữ bao lâu?
2. Dữ liệu Processed giữ bao lâu?
3. Dữ liệu Aggregated giữ bao lâu?
4. Có cần lưu dữ liệu gốc không?
5. Có cần Archive không?
6. Có cần Backup không?
7. Backup retention bao lâu?
8. Có yêu cầu Disaster Recovery không?
9. **RPO** là bao nhiêu?
10. **RTO** là bao nhiêu?

---

## 13. Data Quality

1. Dữ liệu hiện tại có vấn đề gì không?
2. Tỷ lệ duplicate khoảng bao nhiêu?
3. Tỷ lệ missing/null khoảng bao nhiêu?
4. Có dữ liệu sai format không?
5. Có cần data validation không?
6. Có cần data reconciliation giữa source và target không?
7. Có cần data profiling không?
8. Có cần theo dõi **Data Quality Score** không?

---

## 14. Data Governance & Security

1. Có dữ liệu PII không?
2. Có dữ liệu nhạy cảm không?
3. Có yêu cầu masking/anonymization không?
4. Có yêu cầu encryption không?
5. Có yêu cầu Row-Level Security không?
6. Có yêu cầu Column-Level Security không?
7. Có yêu cầu audit access không?
8. Có yêu cầu phân quyền theo:

   * Department
   * Region
   * Role
   * Tenant
9. Có yêu cầu Data Residency không?

---

## 15. Migration / Historical Load

1. Có cần migrate historical data không?
2. Historical data hiện tại có dung lượng bao nhiêu TB?
3. Có bao nhiêu năm historical data?
4. Có cần migrate toàn bộ dữ liệu hay chỉ một phần?
5. Có cần **parallel run** giữa hệ thống cũ và mới không?
6. Có cần backfill dữ liệu không?
7. Migration deadline là bao lâu?

---

# 16. Bảng thông tin phục vụ sizing

Đề nghị yêu cầu khách hàng cung cấp các số liệu sau:

| Metric                   |        Value |
| ------------------------ | -----------: |
| Current data volume      |         ? TB |
| Daily data ingestion     |     ? GB/day |
| Peak ingestion           |    ? GB/hour |
| Records/day              |            ? |
| Peak records/sec         |            ? |
| Average record size      |         ? KB |
| Monthly growth           |          ? % |
| Retention                |      ? years |
| Historical data          |         ? TB |
| Batch window             |      ? hours |
| Required latency         |    ? minutes |
| Concurrent BI users      |            ? |
| Peak queries/sec         |            ? |
| Concurrent queries       |            ? |
| Number of source systems |            ? |
| Number of databases      |            ? |
| Number of tables         |            ? |
| Number of pipelines      |            ? |
| CDC throughput           | ? events/sec |

---

# 17. Bộ câu hỏi tối thiểu cho khảo sát nhanh

Nếu questionnaire cần ngắn gọn để gửi khách hàng, có thể sử dụng **15 câu chính**:

1. Có bao nhiêu **source systems** cần tích hợp?
2. Có bao nhiêu database/schema/table cần xử lý?
3. Tổng **data volume hiện tại** là bao nhiêu TB?
4. Bảng lớn nhất có dung lượng bao nhiêu GB/TB?
5. Mỗi ngày phát sinh bao nhiêu GB/TB dữ liệu mới?
6. Peak ingestion là bao nhiêu **records/sec hoặc GB/hour**?
7. Tốc độ tăng trưởng dữ liệu hàng tháng là bao nhiêu %?
8. Có bao nhiêu năm historical data cần xử lý?
9. Retention requirement là bao lâu?
10. Dữ liệu cần **real-time / near-real-time / batch**?
11. Nếu real-time, yêu cầu latency tối đa bao nhiêu giây/phút?
12. Batch processing window là bao lâu?
13. Có bao nhiêu pipeline ETL/ELT cần chạy?
14. Có bao nhiêu BI users và concurrent users?
15. Có yêu cầu AI/ML hoặc workload phân tích dữ liệu lớn không?

---

# 18. Các dimension chính để đánh giá

Từ questionnaire trên, có thể quy về các dimension chính:

| Dimension             | Metrics cần thu thập                        |
| --------------------- | ------------------------------------------- |
| **Volume**            | TB hiện tại, records, table size            |
| **Velocity**          | GB/day, records/sec, events/sec             |
| **Growth**            | %/month, TB/year                            |
| **Variety**           | DB, API, File, Streaming, JSON, CDR...      |
| **Processing**        | ETL/ELT, transformation, join, aggregation  |
| **Latency**           | Real-time, batch, SLA                       |
| **Processing Window** | Thời gian cho phép xử lý                    |
| **Retention**         | Số năm lưu trữ                              |
| **Consumption**       | Users, queries/sec, concurrency             |
| **Historical Load**   | TB cần backfill/migration                   |
| **Data Quality**      | Duplicate, null, validation, reconciliation |
| **Security**          | PII, masking, encryption, access control    |

Các dimension này là cơ sở để chuyển từ **business requirement → workload → sizing hạ tầng Big Data**.
