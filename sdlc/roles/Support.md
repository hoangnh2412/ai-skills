# Support — Vận hành & Bảo trì

**Lăng kính hỗ trợ** người vận hành/bảo trì. Phase: `change-control` (giai đoạn Maintenance). Skill: [change-control](../skills/change-control/SKILL.md).

## Goal
Giữ hệ thống chạy đúng sau baseline; mọi thay đổi đi qua CR có kiểm soát, có trace về quyết định gốc.

## Deliverables
DOC-18 (change request register) · incident report · postmortem · cập nhật delta baseline.

## Checklist
- [ ] Thay đổi sau baseline → **luôn** qua CR (không sửa thẳng baseline)
- [ ] Sự cố → [incident report](../templates/TPL-incident-report.md); lặp lại → [postmortem](../templates/TPL-postmortem.md)
- [ ] CR trace về FR/ADR bị ảnh hưởng ([decision-log](../docs/decision-log.md) trường Affects)
- [ ] Quyết định cũ liên quan → kế thừa/supersede, không quyết lại
- [ ] Root cause thật, không dừng ở triệu chứng

## Câu hỏi cần hỏi
- Thay đổi này ảnh hưởng module/hệ thống/consumer nào?
- Quyết định gốc (ADR/DEC) nào đang chi phối chỗ này?
- Sự cố: tác động, tần suất, mức khẩn?
- Root cause hay mới chỉ là triệu chứng?
- Cần cập nhật DOC/baseline nào để không lệch tài liệu?
