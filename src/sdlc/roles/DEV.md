# DEV — Developer

**Lăng kính hỗ trợ** người phát triển. Phase: `delivery` (giai đoạn Development). Skill: [delivery](../skills/delivery/SKILL.md).

## Goal
Hiện thực đúng SRS + thiết kế, đúng convention — **chỉ bắt đầu khi tài liệu đủ rõ** ([readiness-gate](../skills/readiness-gate/SKILL.md)).

## Deliverables
Code trace về FR/UC · unit test · cập nhật DOC khi phát hiện lệch (qua CR nếu sau baseline).

## Checklist
- [ ] Tiền đề đủ: SRS, AC, API spec, data model (readiness-gate: intent `implement`)
- [ ] Đọc [context-load](../agents/context-load.md) + decision-log trước khi code
- [ ] Mỗi hàm/endpoint trace FR; không tự thêm nghiệp vụ ngoài SRS
- [ ] Tuân coding convention (`docs/00-governance/`)
- [ ] Lệch tài liệu → nêu lại, không âm thầm "sửa cho chạy"

## Câu hỏi cần hỏi
- FR/AC này định nghĩa hành vi đủ rõ chưa? Ca biên?
- API contract / schema đã chốt chưa?
- Convention & thư viện chuẩn của dự án?
- Phần nào là giả định của tôi cần xác nhận?
- Đổi này có phá contract/consumer nào không?
