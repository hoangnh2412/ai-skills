# Vietnam Airlines · Lakehouse

# Khảo sát 3 — Nghiệp vụ hệ thống nguồn

> **Mục đích:** Làm rõ ngữ nghĩa nghiệp vụ, mô hình dữ liệu, phạm vi đưa vào ODS, transformation nghiệp vụ và các hệ thống downstream đang phụ thuộc.
>
> **Đối tượng trả lời:** SME nghiệp vụ + đầu mối nghiệp vụ của hệ thống, có sự tham gia của Data Analyst.
>
> **Nguyên tắc:** SME hệ thống chỉ trả lời các nhóm câu hỏi được đánh dấu `Required` hoặc `Conditional` trong Question Matrix (xem [`survey-question-matrix.md`](survey-question-matrix.md)). Nhóm áp dụng cho file này: **BUS · DM · ODS · DS**.

## Bộ tài liệu khảo sát

| File | Nội dung |
|---|---|
| `survey-01-pham-vi-du-an.md` | Phạm vi dự án |
| `survey-question-matrix.md` | Question Matrix – 32 hệ thống |
| `survey-02-ha-tang-moi-truong.md` | Hạ tầng, môi trường hệ thống nguồn |
| `survey-03-nghiep-vu-he-thong-nguon.md` | Nghiệp vụ hệ thống nguồn (tài liệu này) |
| `survey-04-quan-tri-du-lieu.md` | Nhu cầu quản trị dữ liệu |

## Quy ước

- **[Đã xác nhận]**: Thông tin đã được xác nhận trong quá trình khảo sát/tài liệu nguồn.
- **[Suy luận]**: Nhận định hoặc đề xuất được suy ra từ thông tin khảo sát.
- **[Chưa xác nhận]**: Thông tin cần tiếp tục xác minh với VNA/SME.
- Các tên hệ thống và công nghệ trong tài liệu này được giữ theo inventory hiện tại; không tự suy diễn các tên viết tắt hoặc quan hệ giữa các hệ thống nếu chưa được xác nhận.

---

## B. Business Semantics

1. Ý nghĩa nghiệp vụ của từng nhóm dữ liệu là gì?
2. Business key là gì?
3. Các trạng thái của entity là gì?
4. Khi nào một record được xem là valid?
5. Khi nào record được xem là cancelled/deleted?
6. Các nghiệp vụ nào làm thay đổi dữ liệu?
7. Có nghiệp vụ nào được xử lý ngoài hệ thống không?
8. Có trường hợp một nghiệp vụ xuất hiện ở nhiều hệ thống không?
9. Nếu hai hệ thống có dữ liệu khác nhau, hệ thống nào được xem là source of truth?

## D. Data Model

10. Hệ thống có ERD hiện tại không?
11. Có Data Dictionary không?
12. Có tài liệu mô tả từng table/column không?
13. Primary Key của từng bảng là gì?
14. Foreign Key/relationship giữa các bảng như thế nào?
15. Có business key nào ngoài technical key không?
16. Có bảng master/reference data nào không?
17. Có bảng transaction nào không?
18. Có bảng snapshot nào không?
19. Có bảng audit/history nào không?
20. Có dữ liệu được denormalize không?
21. Có dữ liệu JSON/XML trong database không?

## E. ODS Scope

22. Toàn bộ table của hệ thống có cần đưa vào ODS không?
23. Nếu không, tiêu chí lựa chọn table là gì?
24. Những table nào là dữ liệu nghiệp vụ chính?
25. Những table nào chỉ phục vụ technical/system processing?
26. Những table nào chứa dữ liệu nhạy cảm?
27. Những table nào có thể loại bỏ?
28. Có yêu cầu đưa nguyên bản dữ liệu source vào ODS không?
29. Có cần giữ tên column giống source không?
30. Có cần giữ cấu trúc JSON/XML nguyên bản không?
31. Dữ liệu nào cần transform trước khi đưa vào ODS?
32. Transformation nào là bắt buộc về mặt nghiệp vụ?

## N. Downstream

33. Hiện những hệ thống nào đang lấy dữ liệu từ hệ thống này?
34. MIS đang lấy dữ liệu như thế nào?
35. DIH đang lấy dữ liệu như thế nào?
36. Có báo cáo nào query trực tiếp database không?
37. Có ETL riêng nào đang đọc database không?
38. Có hệ thống nào đang tổng hợp dữ liệu từ hệ thống này với nguồn khác không?
39. Có API nào đang expose dữ liệu không?
40. Có JDBC consumer nào không?
41. Những hệ thống downstream nào bắt buộc phải tiếp tục hoạt động khi ODS triển khai?
42. Những downstream nào có thể chuyển ngay sang ODS?
43. Những downstream nào cần giai đoạn chuyển tiếp qua Staging?

---

## Transformation Inventory

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

## Downstream Inventory

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
