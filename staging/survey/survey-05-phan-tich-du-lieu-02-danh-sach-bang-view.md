# Vietnam Airlines · Lakehouse

## 05.2 — Phân tích dữ liệu · Danh sách bảng / view

**Hệ thống:**
> Ví dụ: NETLINE

**Tên DB:**
> Ví dụ: SCHEDOPS

**Loại DB:**
- ☐ PostgreSQL · ☐ Oracle · ☐ SQL Server · ☐ MySQL · ☐ MariaDB
> Nhập nếu là loại DB khác

**Schema trong phạm vi file này:**
> Ví dụ: `SCHEDOPS` · hoặc nhiều schema cùng DB: `APP`, `HIST`

Copy **một file này cho một database**. Nhiều DB → nhiều file, đổi tên `survey-05-phan-tich-du-lieu-02-danh-sach-bang-view-{ten-db}.xlsx`. Từ điển cột từng bảng → file 03. Hướng dẫn bộ phiếu: [`survey-05-phan-tich-du-lieu-01-tong-quan-du-lieu-nguon.md`](survey-05-phan-tich-du-lieu-01-tong-quan-du-lieu-nguon.md).

---

## 1. Identity

| Trường | Nội dung |
| ------ | -------- |
| Ngày khảo sát |  |
| Người điền |  |
| File tổng quan | `survey-05-phan-tich-du-lieu-01-tong-quan-du-lieu-nguon.xlsx` |

---

## 2. Inventory bảng / view

*Mỗi dòng một bảng hoặc view **cần khảo sát**. Bảng / view không khảo sát → ghi ở mục 3, không đưa vào bảng này.*

**Quy ước cột**

| Cột | Cách điền |
| --- | --------- |
| Mô tả | Ý nghĩa nghiệp vụ của bảng/view (1–2 câu) |
| Loại | `table` · `view` |
| Loại nghiệp vụ | `master` · `transaction` · `snapshot` · `history` · `audit` · `other` |
| Số lượng bản ghi | Số hiện tại (hoặc ước, ghi rõ `ước`) |
| Tổng dung lượng | VD: `12 GB` · `350 MB` |
| Phát sinh TB/ngày | Record và/hoặc dung lượng — VD: `~80.000 row` · `~200 MB` |
| Ghi chú | Ghi chú khác (mức bảng) |
| Trạng thái xác nhận | `Chưa xác nhận` · `Đã xác nhận` · `Cần làm rõ` |

**Quy ước tên file 03** — mỗi dòng ở mục 2 có **một file 03**. Tìm theo tên (không liệt kê lại):

```text
survey-05-phan-tich-du-lieu-03-{schema}.{ten-bang}.xlsx
```

`{schema}` và `{ten-bang}` khớp đúng cột Schema và Tên bảng / view. Ví dụ: `SCHEDOPS` · `LEG` → `survey-05-phan-tich-du-lieu-03-SCHEDOPS.LEG.xlsx`.

| STT | Schema | Tên bảng / view | Mô tả | Loại | Loại nghiệp vụ | Số lượng bản ghi | Tổng dung lượng | Dữ liệu phát sinh TB hàng ngày | Ghi chú | Trạng thái xác nhận |
| --- | ------ | --------------- | ----- | ---- | -------------- | ---------------- | --------------- | ------------------------------ | ------- | ------------------- |
| 1 |  |  |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |  |  |  |
| 10 |  |  |  |  |  |  |  |  |  |  |
| 11 |  |  |  |  |  |  |  |  |  |  |
| 12 |  |  |  |  |  |  |  |  |  |  |

*Thêm dòng cho đủ inventory cần khảo sát.*

---

## 3. Bảng / view không khảo sát

Liệt kê bảng hoặc view **có trên database này nhưng không khảo sát** — loại khỏi phạm vi phiếu này và không làm file 03.

Mục 2 = cần khảo sát. Mục 3 = không khảo sát. Không ghi trùng một bảng ở cả hai nơi.

| STT | Schema | Tên bảng / view | Loại | Lý do loại khỏi phạm vi | Ghi chú |
| --- | ------ | --------------- | ---- | ----------------------- | ------- |
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |
| 5 |  |  |  |  |  |
| 6 |  |  |  |  |  |
| 7 |  |  |  |  |  |
| 8 |  |  |  |  |  |

> Ví dụ lý do: bảng hệ thống / kỹ thuật · log · staging tạm · nội bộ vendor · trùng nguồn khác. Loại = `table` · `view`.
