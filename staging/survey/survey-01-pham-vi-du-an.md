# Vietnam Airlines · Lakehouse

# Phiếu khảo sát 01 — Phạm vi dự án

> **Mục đích:** Xác định mục tiêu, phạm vi, ưu tiên, hiện trạng tích hợp ở mức tổng thể, định hướng ODS / Golden Zone / Data Mart và các yêu cầu governance ở mức dự án.
>
> **Đối tượng trả lời:** PM / chủ đầu tư / đầu mối kiến trúc dữ liệu của VNA.
>
> **Cách dùng:** Điền trực tiếp vào ô **Trả lời**. Không yêu cầu mỗi hệ thống trả lời toàn bộ bộ câu hỏi. Dùng **Question Matrix** ([`survey-question-matrix.md`](survey-question-matrix.md)) để xác định câu hỏi `Required / Conditional / N/A` theo từng hệ thống.

## Bộ tài liệu khảo sát

| File | Nội dung |
|---|---|
| `survey-01-pham-vi-du-an.md` | Phạm vi dự án (phiếu này) |
| `survey-question-matrix.md` | Question Matrix – 32 hệ thống |
| `survey-02-ha-tang-moi-truong.md` | Hạ tầng, môi trường hệ thống nguồn |
| `survey-03-nghiep-vu-he-thong-nguon.md` | Nghiệp vụ hệ thống nguồn |
| `survey-04-quan-tri-du-lieu.md` | Nhu cầu quản trị dữ liệu |

## Quy ước điền

| Ký hiệu | Ý nghĩa |
|---|---|
| ☐ | Đánh dấu lựa chọn. Có thể chọn nhiều nếu câu hỏi cho phép. |
| **Trả lời** | Ô nhập nội dung tự do. Ghi `Chưa xác định` nếu chưa có thông tin. |

*Không tự suy diễn tên viết tắt hoặc quan hệ giữa các hệ thống nếu chưa được xác nhận.*


## 0. Thông tin phiên khảo sát

| Trường | Nội dung |
|---|---|
| Dự án | Data Warehouse / Data Platform — Vietnam Airlines |
| Phiên bản phiếu | 1.0 |
| Ngày khảo sát | |
| Hình thức | ☐ Họp trực tiếp · ☐ Online · ☐ Email / tài liệu · ☐ Khác: ________ |
| Người khảo sát | Họ tên: ________ · Đơn vị: ________ |
| Người trả lời | Họ tên: ________ · Chức danh: ________ · Đơn vị: ________ |
| Người tham dự khác | |
| Tài liệu đính kèm | |

**Ghi chú phiên:**

_điền_


## 1. Mục tiêu và phạm vi

### Q01. Mục tiêu chính của dự án xây dựng Data Warehouse / Data Platform lần này là gì?

**Trả lời:**

_điền_

### Q02. Những vấn đề hiện tại mà VNA muốn giải quyết bằng kho dữ liệu mới?

**Trả lời:**

_điền_

### Q03. Những hệ thống / phòng ban nào nằm trong phạm vi giai đoạn hiện tại?

**Trả lời:**

| Hệ thống / phòng ban | Domain | Giai đoạn | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

### Q04. Những hệ thống nào chắc chắn nằm ngoài phạm vi?

**Trả lời:**

| Hệ thống | Lý do loại khỏi phạm vi | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q05. Có phân chia phạm vi theo các khối nghiệp vụ không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có, các khối nghiệp vụ:**

_điền_

### Q06. Khối nghiệp vụ nào được ưu tiên triển khai trước?

**Trả lời:**

| Thứ tự | Khối nghiệp vụ | Lý do ưu tiên |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Q07. Có yêu cầu về thời gian hoàn thành cho từng nhóm dữ liệu không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có:**

| Nhóm dữ liệu | Thời hạn mong muốn | Ràng buộc |
|---|---|---|
| | | |
| | | |

### Q08. Có những use case / report / dashboard nào được xem là business-critical?

**Trả lời:**

| Use case / report / dashboard | Owner | Mức độ critical | Ghi chú |
|---|---|---|---|
| | | ☐ Rất cao · ☐ Cao · ☐ Trung bình | |
| | | ☐ Rất cao · ☐ Cao · ☐ Trung bình | |
| | | ☐ Rất cao · ☐ Cao · ☐ Trung bình | |

### Q09. Có những use case nào cần dữ liệu near-real-time?

**Trả lời:**

| Use case | Latency mong muốn | Domain | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q10. Có yêu cầu về lịch sử dữ liệu cần lưu trữ không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có:**

| Nhóm dữ liệu | Thời gian lưu yêu cầu | Snapshot / lịch sử thay đổi | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |


## 2. Hệ thống nguồn và System of Record

### Q11. Hiện VNA có những hệ thống nguồn chính nào cần đưa dữ liệu vào ODS?

**Trả lời:**

_điền_

*(Có thể đối chiếu với ma trận mục 8.)*

### Q12. Hệ thống nào là hệ thống nghiệp vụ chính / master system cho từng domain?

**Trả lời:**

| Domain | Master system | Ghi chú |
|---|---|---|
| Khai thác | | |
| Thương mại | | |
| Dịch vụ | | |
| Kỹ thuật | | |
| An toàn | | |
| Quản lý chung | | |
| Khác: ________ | | |

### Q13. Hệ thống nào đang được xem là nguồn dữ liệu chính thức (System of Record)?

**Trả lời:**

| Domain / entity | System of Record | Ghi chú |
|---|---|---|
| | | |
| | | |
| | | |

### Q14. Có hệ thống nào đang tổng hợp dữ liệu từ nhiều nguồn khác không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**

| Hệ thống tổng hợp | Nguồn đầu vào | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q15. Có hệ thống nào đang được thay thế / rebuild / migrate trong thời gian tới?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**

| Hệ thống hiện tại | Hệ thống / nền tảng đích | Thời điểm dự kiến | Ảnh hưởng tới ODS |
|---|---|---|---|
| | | | |
| | | | |

### Q16. Có hệ thống nào dự kiến thay đổi nền tảng / công nghệ trong thời gian tới?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**

| Hệ thống | Thay đổi dự kiến | Thời điểm | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q17. Có hệ thống nào đang trong quá trình triển khai nhưng vẫn cần đưa vào phạm vi khảo sát?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**

| Hệ thống | Tình trạng triển khai | Lý do cần khảo sát |
|---|---|---|
| | | |
| | | |

### Q18. Các hệ thống nguồn hiện đang tích hợp với nhau bằng những phương thức nào?

**Trả lời:** (đánh dấu các phương thức đang dùng)

- ☐ DB / JDBC · ☐ CDC / replication · ☐ MQ · ☐ API · ☐ File / SFTP · ☐ Khác: ________

**Chi tiết:**

| Nguồn | Đích | Phương thức | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

### Q19. VNA có danh mục chính thức các hệ thống và owner của từng hệ thống không?

- Quyết định: ☐ Có · ☐ Không · ☐ Có nhưng chưa đầy đủ

**Nếu có, vị trí tài liệu / hệ thống quản lý danh mục:**

_điền_


## 3. Hiện trạng tích hợp và dữ liệu

### Q20. Hiện tại dữ liệu đang được tập trung tại những kho nào?

**Trả lời:**

| Kho dữ liệu | Vai trò hiện tại | Ghi chú |
|---|---|---|
| | | |
| | | |
| | | |

### Q21. Những hệ thống nào đang lấy dữ liệu trực tiếp từ database của hệ thống nguồn?

**Trả lời:**

| Consumer | Hệ thống nguồn | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q22. Những hệ thống nào đang lấy dữ liệu thông qua MQ?

**Trả lời:**

| Consumer | Hệ thống nguồn | Loại MQ | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q23. Những hệ thống nào sử dụng file / SFTP?

**Trả lời:**

| Consumer | Hệ thống nguồn | Định dạng file | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q24. Những hệ thống nào sử dụng API?

**Trả lời:**

| Consumer | Hệ thống nguồn | Loại API | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q25. Hiện tại DIH / MIS đang thực hiện những chức năng gì?

**Trả lời:**

- ☐ Thu thập dữ liệu nguồn · ☐ Transform / ETL · ☐ Lưu trữ tập trung · ☐ Cung cấp báo cáo
- ☐ Cung cấp API · ☐ Khác: ________

**Mô tả chi tiết:**

_điền_

### Q26. Có những luồng ETL / ELT hiện hữu nào đang được sử dụng?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**

| Luồng | Nguồn | Đích | Công cụ | Tần suất | Ghi chú |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |

### Q27. Có những luồng dữ liệu nào đang tổng hợp từ nhiều nguồn trước khi đưa vào báo cáo?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa rõ

**Nếu có:**

| Báo cáo / luồng | Các nguồn | Nơi tổng hợp | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q28. Những dữ liệu nào đang được coi là “Golden Data” hoặc dữ liệu chuẩn của VNA?

**Trả lời:**

| Nhóm dữ liệu | Hệ thống chuẩn hiện tại | Ghi chú |
|---|---|---|
| | | |
| | | |
| | | |

### Q29. Hiện tại có Data Catalog / Data Dictionary tập trung không?

- Quyết định: ☐ Có, tập trung · ☐ Có, phân tán theo hệ thống · ☐ Không · ☐ Chưa rõ

**Nếu có, vị trí / công cụ:**

_điền_

### Q30. Có cơ chế quản lý Data Lineage hiện tại không?

- Quyết định: ☐ Có · ☐ Một phần · ☐ Không · ☐ Chưa rõ

**Nếu có, công cụ / quy trình:**

_điền_


## 4. ODS, Golden Zone và Data Mart

### Q31. VNA xác định ODS sẽ đóng vai trò gì trong kiến trúc dữ liệu tương lai?

**Trả lời:**

_điền_

### Q32. Có thống nhất nguyên tắc đưa dữ liệu nguồn vào ODS trước, sau đó mới ETL / ELT sang Data Mart không?

- Quyết định: ☐ Có, thống nhất · ☐ Không thống nhất · ☐ Chưa quyết · ☐ Có ngoại lệ

**Giải thích / ngoại lệ:**

_điền_

### Q33. ODS cần lưu dữ liệu ở mức độ nào: raw, normalized hay business-transformed?

- ☐ Raw · ☐ Normalized · ☐ Business-transformed · ☐ Kết hợp · ☐ Chưa quyết

**Giải thích:**

_điền_

### Q34. Có cần giữ nguyên dữ liệu gốc từ hệ thống nguồn không?

- Quyết định: ☐ Có · ☐ Không · ☐ Một phần · ☐ Chưa quyết

**Phạm vi / điều kiện:**

_điền_

### Q35. Có yêu cầu lưu cả lịch sử thay đổi dữ liệu không?

- Quyết định: ☐ Có · ☐ Không · ☐ Một phần · ☐ Chưa quyết

**Phạm vi:**

_điền_

### Q36. Các Data Mart dự kiến được phân chia theo domain nào?

**Trả lời:**

| Data Mart | Domain | Ghi chú |
|---|---|---|
| | | |
| | | |
| | | |

### Q37. Những Mart nào dự kiến triển khai đầu tiên?

**Trả lời:**

| Thứ tự | Data Mart | Lý do |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Q38. Ai là owner của từng Data Mart?

**Trả lời:**

| Data Mart | Business Owner | Technical Owner | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q39. Có yêu cầu xây dựng Enterprise Data Model dùng chung giữa các domain không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Phạm vi / ghi chú:**

_điền_

### Q40. VNA có định nghĩa chính thức về Staging Zone và Golden Zone chưa?

- Quyết định: ☐ Có, đủ rõ · ☐ Có, chưa đầy đủ · ☐ Chưa có · ☐ Chưa rõ

**Định nghĩa hiện tại (nếu có):**

_điền_

### Q41. Sau khi ODS được xây dựng, các hệ thống MIS / DIH hiện tại có được phép tiếp tục sử dụng Staging không?

- Quyết định: ☐ Được phép · ☐ Không được phép · ☐ Chỉ trong giai đoạn chuyển tiếp · ☐ Chưa quyết

**Điều kiện:**

_điền_

### Q42. Những hệ thống nào cần cơ chế chuyển tiếp từ nguồn cũ → Staging → Golden Zone?

**Trả lời:**

| Hệ thống | Cần chuyển tiếp? | Ghi chú |
|---|---|---|
| | ☐ Có · ☐ Không · ☐ TBD | |
| | ☐ Có · ☐ Không · ☐ TBD | |
| | ☐ Có · ☐ Không · ☐ TBD | |

### Q43. Tiêu chí nào để một hệ thống được chuyển từ Staging sang Golden Zone?

**Trả lời:**

_điền_

### Q44. Ai chịu trách nhiệm phê duyệt dữ liệu khi chuyển sang Golden Zone?

**Trả lời:**

| Vai trò | Người / đơn vị | Ghi chú |
|---|---|---|
| Phê duyệt nghiệp vụ | | |
| Phê duyệt kỹ thuật | | |
| Phê duyệt cuối | | |

### Q45. Có yêu cầu duy trì song song hệ thống cũ và ODS trong một khoảng thời gian không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có: thời gian song song, phạm vi hệ thống:**

_điền_


## 5. Data Integration

### Q46. VNA ưu tiên những phương thức tích hợp nào: MQ, CDC, DB replication, SFTP, API, JDBC...?

**Thứ tự ưu tiên:**

| Thứ tự | Phương thức | Áp dụng cho | Ghi chú |
|---|---|---|---|
| 1 | ☐ MQ · ☐ CDC · ☐ DB replication · ☐ SFTP · ☐ API · ☐ JDBC · ☐ Khác: ________ | | |
| 2 | ☐ MQ · ☐ CDC · ☐ DB replication · ☐ SFTP · ☐ API · ☐ JDBC · ☐ Khác: ________ | | |
| 3 | ☐ MQ · ☐ CDC · ☐ DB replication · ☐ SFTP · ☐ API · ☐ JDBC · ☐ Khác: ________ | | |

### Q47. Có tiêu chuẩn chung cho việc tích hợp dữ liệu vào ODS không?

- Quyết định: ☐ Có · ☐ Đang xây dựng · ☐ Chưa có · ☐ Chưa rõ

**Nếu có, nội dung / vị trí tài liệu:**

_điền_

### Q48. Có yêu cầu near-real-time đối với domain nào?

**Trả lời:**

| Domain | Cần NRT? | Latency | Ghi chú |
|---|---|---|---|
| | ☐ Có · ☐ Không · ☐ TBD | | |
| | ☐ Có · ☐ Không · ☐ TBD | | |
| | ☐ Có · ☐ Không · ☐ TBD | | |

### Q49. Những domain nào chỉ cần batch?

**Trả lời:**

| Domain | Tần suất batch | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q50. Có yêu cầu SLA / SLO cho từng luồng dữ liệu không?

- Quyết định: ☐ Có · ☐ Một phần · ☐ Không · ☐ Chưa quyết

**Nếu có:**

| Luồng / domain | SLA / SLO | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q51. Khi hệ thống nguồn bị mất kết nối, yêu cầu xử lý dữ liệu như thế nào?

**Trả lời:**

- ☐ Buffer / queue · ☐ Retry tự động · ☐ Tạm dừng luồng · ☐ Cảnh báo vận hành
- ☐ Backfill khi khôi phục · ☐ Khác: ________

**Chi tiết:**

_điền_

### Q52. Có yêu cầu replay / reprocess dữ liệu không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Phạm vi / điều kiện:**

_điền_

### Q53. Có yêu cầu kiểm tra completeness / accuracy của dữ liệu sau khi tích hợp không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Cách kiểm tra mong muốn:**

- ☐ Record count · ☐ Checksum / hash · ☐ Đối soát tổng · ☐ Sampling · ☐ Khác: ________

**Chi tiết:**

_điền_


## 6. Data Governance và Data Quality (mức dự án)

> Chi tiết theo từng hệ thống: xem `survey-04-quan-tri-du-lieu.md`.

### Q54. Ai chịu trách nhiệm về chất lượng dữ liệu của từng domain?

**Trả lời:**

| Domain | Chịu trách nhiệm DQ | Ghi chú |
|---|---|---|
| Khai thác | | |
| Thương mại | | |
| Dịch vụ | | |
| Kỹ thuật | | |
| An toàn | | |
| Quản lý chung | | |

### Q55. VNA đã có Data Owner / Data Steward cho từng domain chưa?

- Quyết định: ☐ Đã có đủ · ☐ Có một phần · ☐ Chưa có · ☐ Chưa rõ

**Danh sách hiện có:**

| Domain | Data Owner | Data Steward | Ghi chú |
|---|---|---|---|
| | | | |
| | | | |

### Q56. Có quy định chung về naming convention cho database / table / column không?

- Quyết định: ☐ Có · ☐ Có nhưng chưa thống nhất · ☐ Không · ☐ Chưa rõ

**Nếu có, vị trí tài liệu / tóm tắt:**

_điền_

### Q57. Có quy định về phân loại dữ liệu nhạy cảm không?

- Quyết định: ☐ Có · ☐ Đang xây dựng · ☐ Không · ☐ Chưa rõ

**Nếu có, cấp phân loại / tài liệu:**

_điền_

### Q58. Có yêu cầu masking / encryption đối với PII hoặc dữ liệu nhạy cảm không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Phạm vi:**

- ☐ Masking · ☐ Encryption at rest · ☐ Encryption in transit · ☐ Tokenization · ☐ Khác: ________

**Chi tiết:**

_điền_

### Q59. Có yêu cầu audit dữ liệu không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Phạm vi audit:**

_điền_

### Q60. Có yêu cầu Data Lineage từ nguồn → ODS → Mart → báo cáo / API không?

- Quyết định: ☐ Có, end-to-end · ☐ Có, một phần · ☐ Không · ☐ Chưa quyết

**Phạm vi tối thiểu:**

_điền_

### Q61. Có quy trình xử lý Data Quality Issue hiện tại không?

- Quyết định: ☐ Có · ☐ Có nhưng chưa chính thức · ☐ Không · ☐ Chưa rõ

**Mô tả quy trình / đầu mối:**

_điền_


## 7. Downstream / Consumer (mức dự án)

### Q62. Những hệ thống nào sẽ lấy dữ liệu từ Data Warehouse / Data Platform?

**Trả lời:**

| Consumer | Mục đích sử dụng | Ghi chú |
|---|---|---|
| | | |
| | | |
| | | |

### Q63. Những hệ thống nào cần truy cập trực tiếp database?

**Trả lời:**

| Consumer | Lý do cần truy cập trực tiếp | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q64. Những hệ thống nào bắt buộc phải sử dụng API?

**Trả lời:**

| Consumer | Lý do bắt buộc API | Ghi chú |
|---|---|---|
| | | |
| | | |

### Q65. Những hệ thống nào dự kiến truy cập dữ liệu thông qua JDBC hoặc phương thức kết nối trực tiếp tương tự?

**Trả lời:**

| Consumer | Phương thức | Ghi chú |
|---|---|---|
| | ☐ JDBC · ☐ Khác: ________ | |
| | ☐ JDBC · ☐ Khác: ________ | |

### Q66. Có yêu cầu API phục vụ realtime không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có: use case / latency:**

_điền_

### Q67. Có yêu cầu phân quyền dữ liệu theo user / department / role không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Mô hình phân quyền mong muốn:**

- ☐ User · ☐ Department · ☐ Role · ☐ Row-level · ☐ Column-level · ☐ Khác: ________

**Chi tiết:**

_điền_

### Q68. Có yêu cầu quota / rate limit đối với API không?

- Quyết định: ☐ Có · ☐ Không · ☐ Chưa quyết

**Nếu có, mức quota / rate limit:**

_điền_


## 8. System Priority Matrix

Không khảo sát bằng câu hỏi riêng cho từng hệ thống. Điền ma trận xác nhận dưới đây.

**Cách điền cột:**

| Cột | Giá trị gợi ý |
|---|---|
| Trong phạm vi | Có / Không / TBD |
| Ưu tiên | P1 / P2 / P3 |
| ODS | Có / Không / TBD |
| Data Mart | Có / Không / TBD |
| Near-real-time | Có / Batch / TBD |
| Integration chính | MQ / CDC / JDBC / SFTP / API / Khác |
| Owner | Tên người / đơn vị |
| Ghi chú | Thông tin bổ sung |

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

**Người xác nhận ma trận:** ________ · **Ngày:** ________

**Tài liệu kèm theo phiếu này:**

| File | Nội dung |
|---|---|
| [`survey-question-matrix.md`](survey-question-matrix.md) | Question Matrix – 32 hệ thống |


## Phụ lục. Kết luận thiết kế bộ khảo sát

**[Suy luận]** Bộ khảo sát nên được triển khai theo 3 tầng:

1. **PM Questionnaire** — xác định phạm vi, ưu tiên, kiến trúc và governance (phiếu này).
2. **System Questionnaire** — SME xác nhận nghiệp vụ, dữ liệu, integration, DQ, security và downstream.
3. **Data Source Inventory** — thu thập metadata ở mức database / table / column / data-flow.

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
