---
name: ba-discovery
description: >-
  [minipower] Khám phá bài toán, stakeholder, scope — bước 1–2,
  DOC-01–03. Dùng khi brainstorm, business case, stakeholder, in/out scope.
---

# BA Discovery

**Pack:** minipower · **Phase:** 1–2 · **Không** UC/FR chi tiết / thiết kế kỹ thuật.

**Template:** [DOC-01–03](../../templates/) · **Folder:** `{project}/docs/01-project/`

## Bước 1 — Khám phá bài toán

| Hạng mục | Thu thập | Ví dụ |
|----------|----------|-------|
| Business Goal | Mục tiêu kinh doanh | Tăng doanh số · Tự động hóa |
| Stakeholder | Bên liên quan | User · Manager · Admin · Đối tác |
| Success Criteria | Đo lường được | Giảm 50% thao tác thủ công |

**Artifact:** DOC-01 · DOC-02 · DOC-03 (draft)

**Exit criteria:**
- [ ] Goal + Success Criteria — sponsor xác nhận
- [ ] Stakeholder register + RACI sơ bộ
- [ ] Assumption log
- [ ] DOC-01 có ROI / success metrics

## Bước 2 — Phân tích phạm vi

| Loại | Mô tả |
|------|-------|
| In Scope | Thuộc dự án |
| Out of Scope | Không thuộc dự án |

**Artifact:** DOC-03 (scope) · Module index → `03-modules/{module-id}/`

**Exit criteria:**
- [ ] In/out scope review · danh sách module

## Chế độ Brainstorm

**Trước bước 1** — chạy [deliberation](../deliberation/SKILL.md): Premise Check (có đáng làm?) + nghị luận đa góc nhìn để khung lại vấn đề. Có verdict PROCEED/RESHAPE mới elicit tiếp.

- Tối đa **10 câu hỏi** — phạm vi · chi phí · kiến trúc
- **Đã rõ** · **Chưa rõ** · **Chưa đề cập** · gắn `Assumption`

## Format phản hồi

1. Đã hiểu · 2. Còn thiếu · 3. Câu hỏi (≤10) · 4. Problem statement · 5. Stakeholder · 6. Scope · 7. Assumptions · 8. Rủi ro · 9. DOC 01–03 · 10. Tiếp → [requirements](../requirements/SKILL.md)

## Anti-patterns

- UC/SRS trước scope sign-off · tự bịa nghiệp vụ · thiếu success metrics
