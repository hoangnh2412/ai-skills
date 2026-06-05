# Architecture — Notes

Phase: **Architecture** · Skill: [minipower architecture](../../../.cursor/skills/minipower/skills/architecture/SKILL.md) · DOC đích: **08–12**

**Tiên quyết:** DOC-06 (SRS) + DOC-13 (NFR) baseline.

## Trạng thái

| Mục | Giá trị |
|-----|---------|
| Phase | **Chưa bắt đầu** — chờ requirements baseline |
| SAD / ADR | — |
| Folder artifact | `docs/04-platform/` |

## DOC mapping

| DOC | Nội dung | Ghi chú VNA |
|-----|----------|-------------|
| 08 SAD | 4+1 views | 6 luồng nguồn → 1 nền tảng HĐĐT |
| 09 ADR | 1 file / quyết định | Không sửa ADR đã Accepted |
| 10 Integration | Protocol, direction, SLA | 1A, REV, HOT, Cargospot, GAS, SIS, CQT |
| 11 Data Model | ERD, master data | ~10 cấu trúc mẫu HĐ, 20 ký hiệu |
| 12 API | OpenAPI | Payload vé/AWB/billing |

## Chủ đề kiến trúc dự kiến (từ discovery)

- Tích hợp **6 hệ nguồn** + **REV** + **CT hóa đơn hiện tại**
- **Rule engine** validation VAT (Receipt)
- **Batch vs realtime** (Online T+5, ĐL theo kỳ, SIS Advice Day)
- **Đối soát** PRA/CRA accounting table ↔ HĐ (module mới)
- Lưu trữ **10 năm** (5 online), tra cứu **2–3 giây**
- Ký số & truyền **CQT** (NĐ 70/123)

## Exit criteria

- [ ] SAD + ADR reviewed
- [ ] API / Data Model trace FR
- [ ] NFR reflected in architecture

## Danh sách note

| Ngày | File | Nội dung |
|------|------|----------|
| — | *(chưa có)* | |

## Việc tiếp theo

- [ ] Thu thập API spec / Postman mẫu từ VNA (Buổi 2–N)
- [ ] ADR: thay thế vs tích hợp PM CT hiện tại
- [ ] ADR: kiến trúc đối soát kế toán

## Tham chiếu

- [`../requirements/README.md`](../requirements/README.md)
- [`../discovery/2025-06-05-03-phan-tich-qa-khao-sat-v1.md`](../discovery/2025-06-05-03-phan-tich-qa-khao-sat-v1.md)
