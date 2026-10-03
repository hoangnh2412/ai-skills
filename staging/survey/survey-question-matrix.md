# Survey Question Matrix

> Tham chiếu cho người khảo sát. Không phải phần người trả lời điền.
>
> Dùng ma trận này để xác định câu hỏi `Required / Conditional / N/A` theo từng hệ thống trước khi phát phiếu `survey-02` · `survey-03` · `survey-04`.

## 1. Quy ước

| Giá trị | Ý nghĩa |
|---|---|
| Required (R) | Bắt buộc khảo sát |
| Conditional (C) | Chỉ hỏi nếu hệ thống có đặc điểm tương ứng |
| N/A | Không áp dụng |

## 2. Nhóm câu hỏi và file tương ứng

| Code | Nhóm | File khảo sát |
|---|---|---|
| SYS | System Information | `survey-02-ha-tang-moi-truong.md` |
| DB | Database | `survey-02-ha-tang-moi-truong.md` |
| CDC | CDC / Incremental | `survey-02-ha-tang-moi-truong.md` |
| NRT | Near-real-time | `survey-02-ha-tang-moi-truong.md` |
| FILE | File / SFTP | `survey-02-ha-tang-moi-truong.md` |
| MQ | MQ | `survey-02-ha-tang-moi-truong.md` |
| ARC | Data Architecture | `survey-02-ha-tang-moi-truong.md` |
| INT | Data Integration | `survey-02-ha-tang-moi-truong.md` |
| BUS | Business Semantics | `survey-03-nghiep-vu-he-thong-nguon.md` |
| DM | Data Model | `survey-03-nghiep-vu-he-thong-nguon.md` |
| ODS | ODS Scope | `survey-03-nghiep-vu-he-thong-nguon.md` |
| DS | Downstream | `survey-03-nghiep-vu-he-thong-nguon.md` |
| DQ | Data Quality | `survey-04-quan-tri-du-lieu.md` |
| MDM | Master Data | `survey-04-quan-tri-du-lieu.md` |
| RET | Retention | `survey-04-quan-tri-du-lieu.md` |
| SEC | Security | `survey-04-quan-tri-du-lieu.md` |

## 3. Ma trận theo hệ thống nguồn

> Điền một dòng cho mỗi hệ thống nguồn trong phạm vi dự án. Phân loại `R / C / N/A` sau khi đã có danh sách hệ thống từ phiếu `survey-01`.

| Hệ thống | SYS | BUS | DB | DM | ODS | CDC | NRT | FILE | MQ | DQ | MDM | RET | SEC | DS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| _(điền tên hệ thống)_ | | | | | | | | | | | | | | |

> **Lưu ý:** Các giá trị trong ma trận là phân loại khảo sát, **không phải xác nhận kỹ thuật của từng hệ thống**.
