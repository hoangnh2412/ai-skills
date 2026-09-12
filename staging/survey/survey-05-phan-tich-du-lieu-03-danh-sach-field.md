# Vietnam Airlines · Lakehouse

## 05.3 — Phân tích dữ liệu · Danh sách field

**Hệ thống:**
> Ví dụ: NETLINE

**Tên DB:**
> Ví dụ: SCHEDOPS

**Schema:**
> Ví dụ: SCHEDOPS

**Tên bảng / view:**
> Ví dụ: LEG

Copy **một file này cho một bảng hoặc view**. Đổi tên file thành `survey-05-phan-tich-du-lieu-03-{schema}.{ten-bang}.xlsx`. Hướng dẫn bộ phiếu: [`survey-05-phan-tich-du-lieu-01-tong-quan-du-lieu-nguon.md`](survey-05-phan-tich-du-lieu-01-tong-quan-du-lieu-nguon.md).

---

## 1. Identity

| Trường | Nội dung |
| ------ | -------- |
| Ngày khảo sát |  |
| Người điền |  |
| Loại đối tượng | ☐ table · ☐ view |
| Loại nghiệp vụ | ☐ master · ☐ transaction · ☐ snapshot · ☐ history · ☐ audit · ☐ other |
| File 02 tương ứng | `survey-05-phan-tich-du-lieu-02-danh-sach-bang-view-________.xlsx` |
| Tên trên DWH / staging (nếu đã map) |  |
| Mô tả ý nghĩa bảng |  |
| Primary key (cột, đúng thứ tự) |  |
| Business key (nếu khác PK kỹ thuật) |  |
| Unique / index nghiệp vụ khác |  |

> Ví dụ business key: `FLT_NO` + `FLT_DATE` + `DEP` + `ARR`

---

## 2. Từ điển cột

*Điền **mọi cột** của bảng — không chỉ cột dùng cho KPI.*

**Quy ước cột**

| Cột | Cách điền |
| --- | --------- |
| Kiểu dữ liệu | Đúng nguồn: `VARCHAR2(22)`, `NUMBER(18,2)`, `DATE`, … |
| Allow Null | `Y` · `N` |
| PK/FK | `PK` · `FK` · `PK+FK` · để trống nếu không |
| Bảng FK | `schema.bang.cot` — để trống nếu không phải FK |
| PII | `Y` · `N` · `Chưa rõ` |
| Loại PII | `họ tên` · `định danh` · `liên lạc` · `tài chính` · `sức khỏe` · `khác: …` — để trống nếu PII = `N` |
| Logic masking/encrypt PII | Cách che / mã hoá trên nguồn hoặc yêu cầu khi tích hợp. VD: `mask 4 số cuối` · `hash SHA-256` · `encrypt AES` · `tokenize` · `N/A` nếu PII = `N` |
| Bắt buộc nghiệp vụ | `Y` · `N` — khác NOT NULL kỹ thuật |
| Công thức tính | Công thức bằng **tên cột nguồn**; `N/A` nếu cột nhập/lưu sẵn |
| Ghi chú | Cột JSON/XML/CLOB cần giữ nguyên bản: ghi `JSON` · `XML` · `CLOB/BLOB` (hoặc định dạng khác). Ghi chú khác của cột. |
| Trạng thái xác nhận | `Chưa xác nhận` · `Đã xác nhận` · `Cần làm rõ` |

| STT | Tên cột | Kiểu dữ liệu | Allow Null | PK/FK | Bảng FK | Giá trị mặc định | PII | Loại PII | Logic masking/encrypt PII | Bắt buộc nghiệp vụ | Công thức tính | Ghi chú | Trạng thái xác nhận |
| --- | ------- | ------------ | ---------- | ----- | ------- | ---------------- | --- | -------- | ------------------------- | ------------------ | -------------- | ------- | ------------------- |
| 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 10 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 11 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 12 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 13 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 14 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 15 |  |  |  |  |  |  |  |  |  |  |  |  |  |

*Thêm dòng cho đủ số cột.*
