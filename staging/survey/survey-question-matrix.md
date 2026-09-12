# Vietnam Airlines · Lakehouse

# Survey Question Matrix – 32 hệ thống

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

## 3. Ma trận ban đầu [Suy luận]

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
