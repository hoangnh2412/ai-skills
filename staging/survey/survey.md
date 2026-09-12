# Vietnam Airlines · Lakehouse

# Bộ câu hỏi khảo sát Data Warehouse / Data Platform – Vietnam Airlines

> **Mục đích:** Tài liệu khảo sát phục vụ phân tích hiện trạng, thiết kế mô hình dữ liệu, kiến trúc Logical/Physical Data Warehouse, luồng tích hợp, Data Governance và API.
>
> **Nguyên tắc khảo sát:** Không yêu cầu mỗi hệ thống trả lời toàn bộ bộ câu hỏi. Sử dụng **Question Matrix** để xác định câu hỏi `Required / Conditional / N/A` theo từng hệ thống.

## Quy ước

- **[Đã xác nhận]**: Thông tin đã được xác nhận trong quá trình khảo sát/tài liệu nguồn.
- **[Suy luận]**: Nhận định hoặc đề xuất được suy ra từ thông tin khảo sát.
- **[Chưa xác nhận]**: Thông tin cần tiếp tục xác minh với VNA/SME.
- Các tên hệ thống và công nghệ trong tài liệu này được giữ theo inventory hiện tại; không tự suy diễn các tên viết tắt hoặc quan hệ giữa các hệ thống nếu chưa được xác nhận.

---

# 1. TẦNG 1 – PM / QUẢN LÝ DỰ ÁN

## 1.1. Mục tiêu và phạm vi

1. Mục tiêu chính của dự án xây dựng Data Warehouse/Data Platform lần này là gì?
2. Những vấn đề hiện tại mà VNA muốn giải quyết bằng kho dữ liệu mới?
3. Những hệ thống/phòng ban nào nằm trong phạm vi giai đoạn hiện tại?
4. Những hệ thống nào chắc chắn nằm ngoài phạm vi?
5. Có phân chia phạm vi theo các khối nghiệp vụ không?
6. Khối nghiệp vụ nào được ưu tiên triển khai trước?
7. Có yêu cầu về thời gian hoàn thành cho từng nhóm dữ liệu không?
8. Có những use case/report/dashboard nào được xem là business-critical?
9. Có những use case nào cần dữ liệu near-real-time?
10. Có yêu cầu về lịch sử dữ liệu cần lưu trữ không?

## 1.2. Hệ thống nguồn và System of Record

11. Hiện VNA có những hệ thống nguồn chính nào cần đưa dữ liệu vào ODS?
12. Hệ thống nào là hệ thống nghiệp vụ chính/master system cho từng domain?
13. Hệ thống nào đang được xem là nguồn dữ liệu chính thức (System of Record)?
14. Có hệ thống nào đang tổng hợp dữ liệu từ nhiều nguồn khác không?
15. Có hệ thống nào đang được thay thế/rebuild/migrate trong thời gian tới?
16. Có hệ thống nào dự kiến thay đổi nền tảng/công nghệ trong thời gian tới?
17. Có hệ thống nào đang trong quá trình triển khai nhưng vẫn cần đưa vào phạm vi khảo sát?
18. Các hệ thống nguồn hiện đang tích hợp với nhau bằng những phương thức nào?
19. VNA có danh mục chính thức các hệ thống và owner của từng hệ thống không?

## 1.3. Hiện trạng tích hợp và dữ liệu

20. Hiện tại dữ liệu đang được tập trung tại những kho nào?
21. Những hệ thống nào đang lấy dữ liệu trực tiếp từ database của hệ thống nguồn?
22. Những hệ thống nào đang lấy dữ liệu thông qua MQ?
23. Những hệ thống nào sử dụng file/SFTP?
24. Những hệ thống nào sử dụng API?
25. Hiện tại DIH/MIS đang thực hiện những chức năng gì?
26. Có những luồng ETL/ELT hiện hữu nào đang được sử dụng?
27. Có những luồng dữ liệu nào đang tổng hợp từ nhiều nguồn trước khi đưa vào báo cáo?
28. Những dữ liệu nào đang được coi là “Golden Data” hoặc dữ liệu chuẩn của VNA?
29. Hiện tại có Data Catalog/Data Dictionary tập trung không?
30. Có cơ chế quản lý Data Lineage hiện tại không?

## 1.4. ODS, Golden Zone và Data Mart

31. VNA xác định ODS sẽ đóng vai trò gì trong kiến trúc dữ liệu tương lai?
32. Có thống nhất nguyên tắc đưa dữ liệu nguồn vào ODS trước, sau đó mới ETL/ELT sang Data Mart không?
33. ODS cần lưu dữ liệu ở mức độ nào: raw, normalized hay business-transformed?
34. Có cần giữ nguyên dữ liệu gốc từ hệ thống nguồn không?
35. Có yêu cầu lưu cả lịch sử thay đổi dữ liệu không?
36. Các Data Mart dự kiến được phân chia theo domain nào?
37. Những Mart nào dự kiến triển khai đầu tiên?
38. Ai là owner của từng Data Mart?
39. Có yêu cầu xây dựng Enterprise Data Model dùng chung giữa các domain không?
40. VNA có định nghĩa chính thức về Staging Zone và Golden Zone chưa?
41. Sau khi ODS được xây dựng, các hệ thống MIS/DIH hiện tại có được phép tiếp tục sử dụng Staging không?
42. Những hệ thống nào cần cơ chế chuyển tiếp từ nguồn cũ → Staging → Golden Zone?
43. Tiêu chí nào để một hệ thống được chuyển từ Staging sang Golden Zone?
44. Ai chịu trách nhiệm phê duyệt dữ liệu khi chuyển sang Golden Zone?
45. Có yêu cầu duy trì song song hệ thống cũ và ODS trong một khoảng thời gian không?

## 1.5. Data Integration

46. VNA ưu tiên những phương thức tích hợp nào: MQ, CDC, DB replication, SFTP, API, JDBC...?
47. Có tiêu chuẩn chung cho việc tích hợp dữ liệu vào ODS không?
48. Có yêu cầu near-real-time đối với domain nào?
49. Những domain nào chỉ cần batch?
50. Có yêu cầu SLA/SLO cho từng luồng dữ liệu không?
51. Khi hệ thống nguồn bị mất kết nối, yêu cầu xử lý dữ liệu như thế nào?
52. Có yêu cầu replay/reprocess dữ liệu không?
53. Có yêu cầu kiểm tra completeness/accuracy của dữ liệu sau khi tích hợp không?

## 1.6. Data Governance và Data Quality

54. Ai chịu trách nhiệm về chất lượng dữ liệu của từng domain?
55. VNA đã có Data Owner/Data Steward cho từng domain chưa?
56. Có quy định chung về naming convention cho database/table/column không?
57. Có quy định về phân loại dữ liệu nhạy cảm không?
58. Có yêu cầu masking/encryption đối với PII hoặc dữ liệu nhạy cảm không?
59. Có yêu cầu audit dữ liệu không?
60. Có yêu cầu Data Lineage từ nguồn → ODS → Mart → báo cáo/API không?
61. Có quy trình xử lý Data Quality Issue hiện tại không?

## 1.7. Downstream / Consumer

62. Những hệ thống nào sẽ lấy dữ liệu từ Data Warehouse/Data Platform?
63. Những hệ thống nào cần truy cập trực tiếp database?
64. Những hệ thống nào bắt buộc phải sử dụng API?
65. Những hệ thống nào dự kiến truy cập dữ liệu thông qua JDBC hoặc phương thức kết nối trực tiếp tương tự?
66. Có yêu cầu API phục vụ realtime không?
67. Có yêu cầu phân quyền dữ liệu theo user/department/role không?
68. Có yêu cầu quota/rate limit đối với API không?

## 1.8. System Priority Matrix

Không khảo sát bằng câu hỏi riêng cho từng hệ thống. Sử dụng ma trận xác nhận:

| STT | Hệ thống | Domain | Trong phạm vi | Ưu tiên | ODS | Data Mart | Near-real-time | Integration chính | Owner | Ghi chú |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Flight OPS | Khai thác | | | | | | | | |
| 2 | FMS | Khai thác | | | | | | | | |
| 3 | AVES | Khai thác | | | | | | | | |
| 4 | LIDO FLIGHT4D | Khai thác | | | | | | | | |
| 5 | CrewTrip | Khai thác | | | | | | | | |
| 6 | ANCM | Khai thác | | | | | | | | |
| 7 | ETL | Khai thác | | | | | | | | |
| 8 | ACARS | Khai thác | | | | | | | | |
| 9 | MVT | Khai thác | | | | | | | | |
| 10 | Schedule Management | Thương mại | | | | | | | | |
| 11 | PSS | Thương mại | | | | | | | | |
| 12 | CLM | Thương mại | | | | | | | | |
| 13 | CargoSpot | Thương mại | | | | | | | | |
| 14 | RODB | Thương mại | | | | | | | | |
| 15 | PSS Logfile | Thương mại | | | | | | | | |
| 16 | DCS FM | Dịch vụ | | | | | | | | |
| 17 | DCS CM | Dịch vụ | | | | | | | | |
| 18 | LMS | Dịch vụ | | | | | | | | |
| 19 | Qualtrics | Dịch vụ | | | | | | | | |
| 20 | World Tracer | Dịch vụ | | | | | | | | |
| 21 | SPS | Dịch vụ | | | | | | | | |
| 22 | CentralHub | Dịch vụ | | | | | | | | |
| 23 | BSM | Dịch vụ | | | | | | | | |
| 24 | MRO | Kỹ thuật | | | | | | | | |
| 25 | TIMS | Kỹ thuật | | | | | | | | |
| 26 | AQD | An toàn | | | | | | | | |
| 27 | AGS | An toàn | | | | | | | | |
| 28 | PMS | Quản lý chung | | | | | | | | |
| 29 | Revera | Quản lý chung | | | | | | | | |
| 30 | GAS | Quản lý chung | | | | | | | | |
| 31 | SkyHR | Quản lý chung | | | | | | | | |
| 32 | CMS | Quản lý chung | | | | | | | | |

---

# 2. TẦNG 2 – SYSTEM QUESTIONNAIRE

> **Nguyên tắc:** SME hệ thống chỉ trả lời các nhóm câu hỏi được đánh dấu `Required` hoặc `Conditional` trong Question Matrix.

## A. System Information

1. Tên hệ thống?
2. Tên viết tắt?
3. Domain nghiệp vụ?
4. Đơn vị sở hữu hệ thống?
5. Đơn vị vận hành?
6. Đầu mối nghiệp vụ?
7. Đầu mối kỹ thuật?
8. Vendor/nhà cung cấp?
9. Hệ thống đang Production hay Development?
10. Công nghệ sử dụng?
11. Database engine?
12. Version database?
13. Hệ thống đang triển khai On-premise hay Cloud?
14. Hệ thống có kế hoạch upgrade/migration/replacement không?

## B. Business Semantics

15. Ý nghĩa nghiệp vụ của từng nhóm dữ liệu là gì?
16. Business key là gì?
17. Các trạng thái của entity là gì?
18. Khi nào một record được xem là valid?
19. Khi nào record được xem là cancelled/deleted?
20. Các nghiệp vụ nào làm thay đổi dữ liệu?
21. Có nghiệp vụ nào được xử lý ngoài hệ thống không?
22. Có trường hợp một nghiệp vụ xuất hiện ở nhiều hệ thống không?
23. Nếu hai hệ thống có dữ liệu khác nhau, hệ thống nào được xem là source of truth?

## C. Database

24. Database hiện tại là Oracle/PostgreSQL/MySQL/MariaDB/...?
25. Có bao nhiêu database/schema?
26. Có bao nhiêu table?
27. Tổng dung lượng database hiện tại?
28. Dung lượng tăng trưởng trung bình mỗi ngày/tháng?
29. Những table nào có dữ liệu lớn nhất?
30. Có partition không?
31. Có View/Materialized View không?
32. Có Stored Procedure/Function phục vụ nghiệp vụ không?
33. Có bảng nào chứa dữ liệu lịch sử không?

## D. Data Model

34. Hệ thống có ERD hiện tại không?
35. Có Data Dictionary không?
36. Có tài liệu mô tả từng table/column không?
37. Primary Key của từng bảng là gì?
38. Foreign Key/relationship giữa các bảng như thế nào?
39. Có business key nào ngoài technical key không?
40. Có bảng master/reference data nào không?
41. Có bảng transaction nào không?
42. Có bảng snapshot nào không?
43. Có bảng audit/history nào không?
44. Có dữ liệu được denormalize không?
45. Có dữ liệu JSON/XML trong database không?

## E. ODS Scope

46. Toàn bộ table của hệ thống có cần đưa vào ODS không?
47. Nếu không, tiêu chí lựa chọn table là gì?
48. Những table nào là dữ liệu nghiệp vụ chính?
49. Những table nào chỉ phục vụ technical/system processing?
50. Những table nào chứa dữ liệu nhạy cảm?
51. Những table nào có thể loại bỏ?
52. Có yêu cầu đưa nguyên bản dữ liệu source vào ODS không?
53. Có cần giữ tên column giống source không?
54. Có cần giữ cấu trúc JSON/XML nguyên bản không?
55. Dữ liệu nào cần transform trước khi đưa vào ODS?
56. Transformation nào là bắt buộc về mặt nghiệp vụ?

## F. CDC / Incremental

57. Hệ thống có cột CreatedDate/UpdatedDate không?
58. Có cơ chế xác định record INSERT/UPDATE/DELETE không?
59. Có CDC không?
60. Có database transaction log/binlog/WAL có thể sử dụng không?
61. Có thể sử dụng database replication không?
62. Có thể tạo read replica cho ODS không?
63. Có thể truy cập trực tiếp database production không?
64. Nếu không, có database replica/read-only database không?
65. Có giới hạn tải lên database production không?
66. Có maintenance window cho việc đồng bộ dữ liệu không?

## G. Near-real-time

67. Dữ liệu nào yêu cầu near-real-time?
68. Mức latency yêu cầu là bao nhiêu?
69. Có yêu cầu event-driven không?
70. Hệ thống có phát event không?
71. Có Kafka/RabbitMQ/MQ/Message Queue không?
72. Có thể sử dụng CDC không?
73. Có thể sử dụng PostgreSQL logical replication không?
74. Nếu không thể near-real-time, batch nhỏ nhất có thể chạy là bao lâu?

## H. File / SFTP

75. Dữ liệu được xuất thành file định dạng gì?
76. File được tạo với tần suất bao lâu?
77. File được đặt ở đâu?
78. SFTP server nằm ở đâu?
79. Ai quản lý SFTP?
80. Naming convention của file?
81. File có timestamp không?
82. Có sequence number không?
83. Có checksum không?
84. Có cơ chế xác nhận file đã nhận đầy đủ không?
85. Nếu file bị thiếu/mất/corrupt thì xử lý như thế nào?
86. Có thể nhận lại file cũ không?
87. File có chứa dữ liệu trùng lặp không?

## I. MQ

88. MQ đang sử dụng loại Message Queue nào?
89. MQ nằm ở đâu?
90. Queue nào chứa dữ liệu cần lấy?
91. Message format là gì?
92. Message có schema/documentation không?
93. Message có unique ID không?
94. Có sequence number không?
95. Có timestamp/event timestamp không?
96. Có cơ chế retry không?
97. Có cơ chế dead-letter queue không?
98. Có thể replay message không?
99. Có yêu cầu đảm bảo không mất message không?
100. Có yêu cầu ordering message không?

## J. Data Quality

101. Hiện tại hệ thống có quy tắc kiểm tra chất lượng dữ liệu không?
102. Những field nào bắt buộc?
103. Những field nào có thể NULL?
104. Có dữ liệu duplicate không?
105. Có master data/reference data để validate không?
106. Có business rule nào để xác định record hợp lệ không?
107. Có reconciliation giữa source và ODS không?
108. Có yêu cầu đối soát record count không?
109. Có yêu cầu đối soát tổng tiền/số lượng không?
110. Ai xác nhận dữ liệu trong ODS là đúng?

## K. Master Data

111. Những master data nào hệ thống sử dụng?
112. Master data được quản lý ở hệ thống nào?
113. Có mã định danh dùng chung giữa các hệ thống không?
114. Nếu cùng một entity nhưng các hệ thống sử dụng mã khác nhau thì mapping ở đâu?
115. VNA đã có Master Data Management chưa?
116. Có cần xây dựng Golden Record không?

## L. Retention

117. Hệ thống hiện lưu dữ liệu bao nhiêu năm?
118. ODS cần giữ bao nhiêu năm?
119. Data Mart cần giữ bao nhiêu năm?
120. Có cần historical snapshot không?
121. Có cần lưu trạng thái dữ liệu tại từng thời điểm không?
122. Có yêu cầu archive dữ liệu không?
123. Có yêu cầu purge dữ liệu không?

## M. Security

124. Dữ liệu có chứa PII không?
125. Có dữ liệu hành khách không?
126. Có dữ liệu nhân viên không?
127. Có dữ liệu tài chính nhạy cảm không?
128. Có dữ liệu cần masking không?
129. Ai được phép truy cập?
130. Có phân quyền theo domain/đơn vị không?
131. Có yêu cầu row-level security không?
132. Có yêu cầu audit access log không?
133. Có yêu cầu encryption at rest/in transit không?

## N. Downstream

134. Hiện những hệ thống nào đang lấy dữ liệu từ hệ thống này?
135. MIS đang lấy dữ liệu như thế nào?
136. DIH đang lấy dữ liệu như thế nào?
137. Có báo cáo nào query trực tiếp database không?
138. Có ETL riêng nào đang đọc database không?
139. Có hệ thống nào đang tổng hợp dữ liệu từ hệ thống này với nguồn khác không?
140. Có API nào đang expose dữ liệu không?
141. Có JDBC consumer nào không?
142. Những hệ thống downstream nào bắt buộc phải tiếp tục hoạt động khi ODS triển khai?
143. Những downstream nào có thể chuyển ngay sang ODS?
144. Những downstream nào cần giai đoạn chuyển tiếp qua Staging?

---

# 3. TẦNG 3 – DATA SOURCE INVENTORY

## 3.1. System Inventory

| Field | Mô tả |
|---|---|
| System ID | Mã hệ thống |
| System Name | Tên hệ thống |
| Domain | Domain nghiệp vụ |
| Business Owner | Đơn vị/người sở hữu nghiệp vụ |
| Technical Owner | Đơn vị/người sở hữu kỹ thuật |
| Vendor | Nhà cung cấp |
| Environment | Production/Development/UAT... |
| Technology | Công nghệ chính |
| Database | Database engine |
| Hosting | On-premise/Cloud |
| Criticality | Mức độ quan trọng |
| Replacement Plan | Kế hoạch thay thế/migration |
| ODS Scope | Phạm vi đưa vào ODS |

## 3.2. Database Inventory

| Field | Mô tả |
|---|---|
| Database | Tên database |
| Engine | Oracle/PostgreSQL/MySQL/... |
| Version | Phiên bản |
| Schema | Schema |
| Size | Dung lượng |
| Growth/day | Tăng trưởng/ngày |
| Growth/month | Tăng trưởng/tháng |
| HA | High Availability |
| Replica | Có replica hay không |
| Replication | Cơ chế replication |
| Access Method | Cách truy cập |
| ODS Connectivity | Phương thức kết nối ODS |

> **Không đưa vào Basic Data Source Inventory:** Host, Port, số lượng index, số lượng procedure/function, Backup, DR, RPO/RTO. Các thông tin này thuộc nhóm khảo sát Infrastructure/Architecture.

## 3.3. Table Inventory

| Field | Mô tả |
|---|---|
| System | Hệ thống |
| Database | Database |
| Schema | Schema |
| Table | Tên table |
| Business Name | Tên nghiệp vụ |
| Business Description | Mô tả nghiệp vụ |
| Table Type | Master/Transaction/Snapshot/History/... |
| Primary Key | Khóa chính |
| Record Count | Số record |
| Data Size | Dung lượng |
| Growth/day | Tăng trưởng/ngày |
| Created Column | Cột tạo record |
| Updated Column | Cột cập nhật |
| Delete Indicator | Cờ/xác định delete |
| CDC Support | Khả năng CDC |
| Historical Data | Có lịch sử |
| Retention | Thời gian lưu |
| Sensitive Data | Dữ liệu nhạy cảm |
| Source of Truth | Nguồn chính thức |
| Required in ODS | Có cần vào ODS |
| Required in Data Mart | Có cần vào Mart |
| Transformation Required | Có transformation |
| Data Quality Rule | Quy tắc DQ |
| Downstream Consumer | Hệ thống sử dụng |

## 3.4. Column Inventory

### Có thể tự động trích xuất từ database

- Column Name
- Data Type
- Length
- Precision
- Scale
- Nullable
- Default
- PK
- FK

### Cần SME bổ sung

- Business Name
- Business Meaning
- Business Key
- Master Data
- PII
- Sensitive
- Transformation
- DQ Rule
- Target ODS Column
- Target Mart Column

## 3.5. Data Flow Inventory

| Field | Mô tả |
|---|---|
| Source System | Hệ thống nguồn |
| Source Object | Table/API/File/Queue... |
| Source Type | DB/API/File/MQ... |
| Integration Method | JDBC/API/SFTP/MQ/CDC... |
| Target | Hệ thống/kho đích |
| Frequency | Tần suất |
| Latency | Độ trễ |
| Volume | Khối lượng record |
| Error Handling | Xử lý lỗi |
| Retry | Retry |
| Replay | Replay |
| Monitoring | Monitoring |
| Reconciliation | Đối soát |
| Data Quality | DQ |
| Security | Bảo mật |
| SLA | SLA |
| Owner | Owner |

---

# 4. TRANSFORMATION INVENTORY

1. Dữ liệu có transformation ở source không?
2. Dữ liệu có transformation tại DIH không?
3. Dữ liệu có transformation tại MIS không?
4. Có join nhiều source không?
5. Join bằng key nào?
6. Có business rule nào đang được áp dụng?
7. Có aggregation không?
8. Có mapping code không?
9. Có lookup master data không?
10. Có calculation không?
11. Có logic nào chỉ tồn tại trong SQL/report không?
12. Logic đó có cần chuyển vào ODS không?
13. Hay chỉ chuyển transformation vào Data Mart?

---

# 5. DOWNSTREAM INVENTORY

| Field | Mô tả |
|---|---|
| Consumer | Hệ thống sử dụng |
| Owner | Owner |
| Current Data Source | Nguồn dữ liệu hiện tại |
| Method | DB/API/JDBC/MQ/... |
| Data Used | Dữ liệu sử dụng |
| Transformation | Transformation hiện tại |
| Frequency | Tần suất |
| Criticality | Mức độ quan trọng |
| SLA | SLA |
| Future Source | Nguồn tương lai |
| Migration Required | Có cần migration |
| Migration Deadline | Hạn migration |

---

# 6. CROSS-CUTTING – DATA ARCHITECTURE

1. Có yêu cầu Enterprise Data Model không?
2. Domain Model hiện tại đã tồn tại chưa?
3. Có Canonical Data Model không?
4. Có Data Domain Boundary không?
5. Entity nào dùng chung giữa các domain?
6. Có yêu cầu MDM không?
7. ODS dự kiến triển khai trên nền tảng nào?
8. Storage engine/database nào?
9. Có phân tầng Landing → Staging → ODS → Golden Zone → Data Mart hay không?
10. Có yêu cầu HA/DR không?
11. RPO?
12. RTO?
13. Data retention?
14. Backup?
15. Archive?

---

# 7. CROSS-CUTTING – DATA INTEGRATION

Sử dụng **Integration Matrix** thay vì hỏi lặp lại ở nhiều tài liệu.

| Source | Data Owner | Technical Owner | Database | Integration | Frequency | Volume/day | Size/day | Growth/month | Latency/SLA | CDC | History | Delete | DQ | Security | Downstream | Migration | Owner Approval |
|---|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|---|---|---|---|

---

# 8. QUESTION MATRIX – 32 HỆ THỐNG

## 8.1. Quy ước

| Giá trị | Ý nghĩa |
|---|---|
| Required | Bắt buộc khảo sát |
| Conditional | Chỉ hỏi nếu hệ thống có đặc điểm tương ứng |
| N/A | Không áp dụng |

## 8.2. Nhóm câu hỏi

| Code | Nhóm |
|---|---|
| SYS | System Information |
| BUS | Business Semantics |
| DB | Database |
| DM | Data Model |
| ODS | ODS Scope |
| CDC | CDC / Incremental |
| NRT | Near-real-time |
| FILE | File / SFTP |
| MQ | MQ |
| DQ | Data Quality |
| MDM | Master Data |
| RET | Retention |
| SEC | Security |
| DS | Downstream |
| ARC | Data Architecture |
| INT | Data Integration |

## 8.3. Ma trận ban đầu [Suy luận]

> Đây là ma trận phân loại để giảm số lượng câu hỏi thực tế. Cần xác nhận lại với SME trước khi dùng làm baseline chính thức.

| Hệ thống | SYS | BUS | DB | DM | ODS | CDC | NRT | FILE | MQ | DQ | MDM | RET | SEC | DS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Flight OPS | R | R | R | R | R | C | C | N/A | N/A | R | C | R | R | R |
| FMS | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| AVES | R | R | C | C | R | C | C | N/A | C | R | C | R | R | R |
| LIDO FLIGHT4D | R | R | C | C | R | N/A | C | N/A | N/A | R | C | R | R | R |
| CrewTrip | R | R | R | R | R | C | C | N/A | N/A | R | C | R | R | R |
| ANCM | R | R | R | R | R | C | C | N/A | N/A | R | C | R | R | R |
| ETL | R | R | C | C | R | N/A | C | R | C | R | C | R | R | R |
| ACARS | R | R | C | C | R | N/A | C | R | C | R | C | R | R | R |
| MVT | R | R | C | C | R | N/A | C | R | C | R | C | R | R | R |
| Schedule Management | R | R | R | R | R | C | C | C | C | R | C | R | R | R |
| PSS | R | R | C | R | R | C | C | C | C | R | R | R | R | R |
| CLM | R | R | R | R | R | C | C | N/A | C | R | R | R | R | R |
| CargoSpot | R | R | R | R | R | C | C | C | C | R | C | R | R | R |
| RODB | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| PSS Logfile | R | R | C | C | R | N/A | C | R | N/A | R | C | R | R | R |
| DCS FM | R | R | C | R | R | C | R | N/A | C | R | R | R | R | R |
| DCS CM | R | R | C | R | R | C | R | N/A | C | R | R | R | R | R |
| LMS | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| Qualtrics | R | R | C | C | R | C | C | C | N/A | R | C | R | R | R |
| World Tracer | R | R | C | C | R | C | C | C | C | R | C | R | R | R |
| SPS | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| CentralHub | R | R | C | C | R | C | C | C | C | R | C | R | R | R |
| BSM | R | R | C | C | R | C | R | C | C | R | C | R | R | R |
| MRO | R | R | R | R | R | R | R | N/A | C | R | C | R | R | R |
| TIMS | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| AQD | R | R | C | C | R | C | C | C | C | R | C | R | R | R |
| AGS | R | R | C | C | R | N/A | C | R | N/A | R | C | R | R | R |
| PMS | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| Revera | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| GAS | R | R | R | R | R | C | C | N/A | C | R | C | R | R | R |
| SkyHR | R | R | R | R | R | C | C | N/A | C | R | R | R | R | R |
| CMS | R | R | C | C | R | C | C | C | C | R | C | R | R | R |

> **Lưu ý:** Các giá trị trong ma trận trên là phân loại khảo sát ban đầu, **không phải xác nhận kỹ thuật của từng hệ thống**.

---

# 9. NGUYÊN TẮC TỰ ĐỘNG HÓA THU THẬP METADATA

## 9.1. Nên tự động lấy từ database

- Database/schema
- Table
- Column
- Data type
- Length
- Precision/scale
- Nullable
- Default
- Primary key
- Foreign key
- Record count
- Data size
- Partition
- Index
- View
- Materialized View
- Stored Procedure/Function
- Created/Updated columns nếu xác định được bằng metadata

## 9.2. SME cần xác nhận

- Business meaning
- Business key
- Source of truth
- Business rule
- Master data
- PII/Sensitive data
- ODS scope
- Transformation nghiệp vụ
- Data quality rule
- Historical meaning
- Retention nghiệp vụ
- Downstream usage

## 9.3. [Suy luận] Nguyên tắc giảm tải khảo sát

Không nên yêu cầu SME trả lời các thông tin có thể lấy chính xác bằng metadata extraction. Cách tiếp cận nên là:

```text
Database
   │
   ├── Metadata Extraction
   │      ├── Schema
   │      ├── Table
   │      ├── Column
   │      ├── PK/FK
   │      ├── Data Type
   │      ├── Size
   │      └── Record Count
   │
   └── SME Questionnaire
          ├── Business Meaning
          ├── Business Rule
          ├── Source of Truth
          ├── ODS Scope
          ├── DQ
          ├── Security
          └── Downstream
```

Mục tiêu là biến khảo sát từ **“hỏi mọi thứ”** thành **“tự động thu thập kỹ thuật + SME xác nhận nghiệp vụ”**.

---

# 10. CÁC ĐIỂM CẦN XÁC MINH RIÊNG

Các nội dung sau không nên tự động giả định:

1. Quan hệ/đồng nhất giữa **MRO** và **AMOS** – [Chưa xác nhận].
2. Quan hệ giữa **FMS** và **TOSS**, cũng như thông tin “TOSS ?DB” – [Chưa xác nhận].
3. Ý nghĩa của cột **ODI** trong inventory – [Chưa xác nhận]; không mặc định hiểu là Oracle Data Integrator.
4. Vai trò chính xác của từng hệ thống, nếu chưa có tài liệu/SME xác nhận.
5. Công nghệ tương lai của các hệ thống đang có kế hoạch thay thế/migration.
6. Phương thức tích hợp thực tế của từng hệ thống.
7. Mức độ near-real-time thực tế của từng domain.
8. Owner/Data Steward/Data Owner chính thức của từng domain.

---

# 11. OUTPUT SAU KHẢO SÁT

Kết quả khảo sát nên được chuẩn hóa thành các artefact sau:

### 11.1. System Catalog

```text
System
 ├── Business Owner
 ├── Technical Owner
 ├── Technology
 ├── Database
 ├── Criticality
 ├── ODS Scope
 └── Replacement Plan
```

### 11.2. Data Catalog

```text
System
 └── Database
      └── Schema
           └── Table
                └── Column
```

### 11.3. Data Lineage

```text
Source
   ↓
Landing
   ↓
Staging
   ↓
ODS
   ↓
Golden Zone
   ↓
Data Mart
   ↓
Report / Dashboard / API / Consumer
```

### 11.4. Integration Catalog

```text
Source
   ↓
Integration Method
   ├── DB / JDBC
   ├── CDC
   ├── MQ
   ├── API
   └── SFTP/File
   ↓
Target
```

### 11.5. Data Quality Catalog

```text
Data Element
 ├── Rule
 ├── Validation
 ├── Threshold
 ├── Reconciliation
 ├── Owner
 └── Issue Handling
```

### 11.6. Migration Catalog

```text
Current Source
      ↓
Current Consumer
      ↓
Target Source
      ↓
Migration Method
      ↓
Migration Deadline
      ↓
Validation / Cut-over
```

---

# 12. KẾT LUẬN THIẾT KẾ BỘ KHẢO SÁT

**[Suy luận]** Bộ khảo sát nên được triển khai theo 3 tầng:

1. **PM Questionnaire** – xác định phạm vi, ưu tiên, kiến trúc và governance.
2. **System Questionnaire** – SME xác nhận nghiệp vụ, dữ liệu, integration, DQ, security và downstream.
3. **Data Source Inventory** – thu thập metadata ở mức database/table/column/data-flow.

Không nên phát nguyên bộ 144 câu hỏi cho cả 32 hệ thống. Thay vào đó:

```text
32 Systems
    │
    ▼
Question Matrix
    │
    ├── Required
    ├── Conditional
    └── N/A
    │
    ▼
System-specific Questionnaire
    │
    ▼
Consolidated Data Inventory
```

Cách này giảm đáng kể effort khảo sát, đồng thời vẫn giữ đủ thông tin cần thiết để thiết kế **ODS → Golden Zone → Data Mart**, Data Integration, Data Governance và Data Lineage.
