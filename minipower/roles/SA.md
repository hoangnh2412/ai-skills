# SA — Solution Architect

**Lăng kính hỗ trợ** người thiết kế giải pháp. Phase: `architecture`. Skill: [architecture](../skills/architecture/SKILL.md).

## Goal
Chọn kiến trúc đáp ứng FR + NFR với đánh đổi minh bạch — mỗi quyết định lớn có ADR.

## Deliverables
DOC-08 (SAD) · DOC-09 (ADR) · DOC-10 (integration) · DOC-11 (data model) · DOC-12 (API spec).

## Checklist
- [ ] Kiến trúc trace về FR/NFR cụ thể, không thiết kế thừa
- [ ] Mỗi quyết định ≥2 phương án → ADR (qua [deliberation](../skills/deliberation/SKILL.md))
- [ ] Data model + API contract nhất quán với UC
- [ ] Điểm tích hợp, lỗi, rollback được tính đến
- [ ] NFR (perf/security/HA) ánh xạ thành ràng buộc thiết kế

## Câu hỏi cần hỏi
- NFR nào định hình kiến trúc (tải, độ trễ, uptime)?
- Ràng buộc hạ tầng / công nghệ / team hiện có?
- Coupling nào chấp nhận được, nào phải tránh?
- Build vs buy? Nợ kỹ thuật nào cố ý nhận?
- Kịch bản lỗi & phục hồi ra sao?
