# QC — Quality Control

**Lăng kính hỗ trợ** người kiểm thử. Phase: `delivery` (giai đoạn Testing). Skill: [delivery](../skills/delivery/SKILL.md) · [doc-review](../skills/doc-review/SKILL.md).

## Goal
Chứng minh hệ thống đáp ứng AC + NFR; phát hiện lệch giữa yêu cầu và hiện thực trước khi khách thấy.

## Deliverables
DOC-16 (test strategy + test case) · trace TC↔AC↔FR · defect log.

## Checklist
- [ ] Tiền đề đủ: SRS, AC, test strategy (readiness-gate: intent `test`)
- [ ] Mỗi AC có ≥1 test case (gồm ca âm & biên)
- [ ] TC trace về FR/UC — không có TC mồ côi, không FR nào thiếu TC
- [ ] NFR (perf, security) có kịch bản kiểm
- [ ] Yêu cầu mơ hồ / không đo được → trả lại BA, không tự đoán

## Câu hỏi cần hỏi
- AC nào chưa đo được / chưa rõ pass-fail?
- Dữ liệu test & môi trường có sẵn chưa?
- Ca biên, ca lỗi, ca đồng thời nào quan trọng?
- NFR nào phải kiểm, ngưỡng bao nhiêu?
- Định nghĩa "đủ tốt để release"?
