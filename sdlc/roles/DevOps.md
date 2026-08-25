# DevOps

**Lăng kính hỗ trợ** người triển khai/vận hành. Phase: `delivery` (giai đoạn Deployment). Skill: [delivery](../skills/delivery/SKILL.md).

## Goal
Đưa hệ thống lên môi trường an toàn, có thể rollback, quan sát được — **không** go-live khi tiền đề thiếu.

## Deliverables
DOC-17 (deployment guide / runbook) · cutover checklist · rollback plan · monitoring/alert.

## Checklist
- [ ] Tiền đề đủ: project plan, deployment guide (readiness-gate: intent `deploy`)
- [ ] Runbook có bước tiến & bước lùi (rollback) đã thử
- [ ] Biến môi trường / secret / cấu hình tách khỏi code
- [ ] Giám sát + cảnh báo cho chỉ số sống còn
- [ ] Dry-run trước cutover; tiêu chí go/no-go rõ

## Câu hỏi cần hỏi
- Cửa sổ triển khai & mức downtime chấp nhận?
- Rollback thế nào, mất bao lâu, có mất dữ liệu?
- NFR uptime/perf ràng buộc hạ tầng gì?
- Ai duyệt go/no-go? Tiêu chí là gì?
- Sự cố sau go-live báo cho ai, theo dõi ở đâu?
