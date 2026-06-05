# Delivery — Notes

Phase: **Delivery** · Skill: [minipower delivery](../../../.cursor/skills/minipower/skills/delivery/SKILL.md) · DOC đích: **16–17**

**Tiên quyết:** DOC-06 (SRS) + DOC-07 (AC).

## Trạng thái

| Mục | Giá trị |
|-----|---------|
| Phase | **Chưa bắt đầu** |
| Test strategy | — |
| Deployment guide | — |

## DOC mapping

| DOC | Nội dung | Folder |
|-----|----------|--------|
| 16 Test Strategy | Unit → UAT, trace AC | `docs/03-modules/{module-id}/` |
| 17 Deployment Guide | Cutover, go-live, rollback | `docs/04-platform/` |

## Test levels (ISTQB)

| Level | Owner |
|-------|-------|
| Unit / Integration | Dev |
| System | QA |
| UAT | Business (VNA — Ban TCKT, phòng vé, …) |

## Chủ đề delivery dự kiến (VNA)

- UAT theo **6 luồng** + **đối soát kế toán** + **báo cáo thuế**
- Test **HĐ mẫu** (~10 cấu trúc) + ký số CQT (sandbox)
- Test **hoàn/đổi vé**, HĐ âm, multi tax rate
- **Migration** dữ liệu HĐ cũ; tra cứu 10 năm
- Cutover từ PM CT hiện tại — song song / big bang TBD

## Exit go-live

- [ ] Must-have AC pass
- [ ] Trace matrix green
- [ ] Dry-run rollback (DOC-17)

## Danh sách note

| Ngày | File | Nội dung |
|------|------|----------|
| — | *(chưa có)* | |

## Việc tiếp theo

- [ ] Xác định môi trường test CQT với VNA
- [ ] UAT owner theo module (Nga, Việt, Liên, Linh, …)

## Tham chiếu

- [`../planning/README.md`](../planning/README.md)
- [`../requirements/README.md`](../requirements/README.md)
