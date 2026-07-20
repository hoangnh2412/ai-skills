---
name: readiness-gate
description: >-
  [minipower] Cổng thực thi — soát tài liệu tiền đề trước khi sinh code/artifact
  cuối. Liệt kê TRỌN BỘ thiếu sót một lượt, cho hoãn có ghi nợ, "đủ ở mức chấp
  nhận được" do người quyết. Dùng khi: thiết kế module, viết code, kiểm thử,
  triển khai — hoặc bất kỳ yêu cầu chuyển sang thực thi.
---

# Readiness Gate — Cổng thực thi

**Pack:** minipower · **Loại:** skill cross-phase · **Không** sinh DOC — sinh *checklist tiền đề + verdict đi tiếp*.

Nguyên tắc §0 (ADR 2026-07-20): **AI chỉ chuyển sang thực thi khi tài liệu đủ rõ.** Gate này canh ranh giới đó — nhưng **không chặn cứng**: "đủ" = *đủ ở mức chấp nhận được* do con người quyết, không phải đủ tuyệt đối.

Khác [deliberation](../deliberation/SKILL.md): deliberation soát *có nên làm/viết DOC không*; readiness-gate soát *bộ tiền đề đầu vào đã đủ để bắt đầu thực thi chưa*.

> **Không phải người chọn skill.** Router (SKILL.md + auto-routing) tự kích hoạt khi intent là thực thi. Xem [§6 Q6, ADR](../../../ADRs/2026-07-20-dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md).

---

## Ba nguyên tắc vận hành (bắt buộc)

1. **Hỏi trọn gói, một lượt.** Liệt kê **TẤT CẢ** tiền đề còn thiếu cùng lúc — **không** hỏi nhỏ giọt từng câu.
2. **Ngưỡng "đủ chấp nhận được".** Con người xác nhận mức đủ; không ép đủ tất cả mới cho đi tiếp.
3. **Cho hoãn có ghi nợ.** Mục bị bỏ qua tạm → ghi vào `memory/{phase}/open-questions.md`, đi tiếp, **bổ sung dần khi thực thi**.

```
Yêu cầu thực thi
  → soát intent → tra bảng tiền đề (dưới)
  → LIỆT KÊ trọn bộ tiền đề còn thiếu (một lượt)
      mỗi mục:  [Trả lời ngay] · [Hoãn → ghi nợ] · [Không cần]
  → Đủ ở mức chấp nhận được?
        Có  → thực thi (kèm sổ nợ để bổ sung dần) → [context-load](../../agents/context-load.md)
        Không → xin phần tối thiểu còn thiếu (không tự bịa)
```

## Bảng tiền đề theo intent

**Dữ liệu** ở [hooks/lib/rules.json](../../hooks/lib/rules.json) (`prereq_by_intent`). Bảng dưới **sinh tự động** (`npm run gen`) — thêm intent = sửa rules.json.

<!-- BEGIN generated: prereq-by-intent (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->

| Intent | Tiền đề cần có |
|--------|----------------|
| **Phân tích yêu cầu (UC, FR, SRS, AC)** | DOC-03 (BRD) |
| **Vẽ prototype / wireframe** | DOC-04 (Business Rules) |
| **Thiết kế kiến trúc / giải pháp / module** | DOC-03 (BRD) · DOC-06 (SRS) · DOC-13 (NFR) |
| **Viết code / hiện thực module** | DOC-06 (SRS) · DOC-07 (Acceptance Criteria) · DOC-08 (SAD) · DOC-11 (Data Model) · DOC-12 (API Spec) · DOC-19 (Prototype / Wireframe) |
| **Kiểm thử / viết test case** | DOC-06 (SRS) · DOC-07 (Acceptance Criteria) · DOC-16 (Test Strategy) |
| **Triển khai / go-live / release** | DOC-15 (Project Plan) · DOC-17 (Deployment Guide) |

<!-- END generated: prereq-by-intent -->

**Mặc định vs cấu hình riêng (Q7):** đây là bộ **mặc định**. Đầu phiên gate hỏi *"Dùng bộ tiền đề mặc định, hay dự án có bộ riêng?"* — nếu riêng, đọc `memory/{phase}/` để lấy danh sách tiền đề của dự án thay cho bảng này.

## Sổ nợ tài liệu — `open-questions.md`

Mỗi mục hoãn ghi 1 dòng vào `memory/{phase}/open-questions.md`:

```text
- [ ] {OQ-NNN} <câu hỏi/tiền đề thiếu> · intent: <id> · hoãn ngày YYYY-MM-DD · chặn: <có/không>
```

Khi bổ sung xong → tick `[x]` + trỏ DOC/DEC đã trả lời. **Chặn: có** = tiền đề bắt buộc, chưa có thì artifact sinh ra chỉ là *nháp*, phải quay lại.

## Format phản hồi

1. **Intent nhận diện** (+ tiền đề áp dụng)
2. **Có / Thiếu** — trạng thái từng tiền đề (một bảng, một lượt)
3. **Câu hỏi trọn gói** — mọi mục thiếu, đánh số để người trả lời nhanh
4. **Verdict** — ✅ Đủ (đi tiếp) · ⏸️ Đủ tạm (đi tiếp + ghi nợ) · ⛔ Chưa đủ (xin tối thiểu)
5. **Sổ nợ** — các dòng thêm vào `open-questions.md` (nếu có hoãn)

## Anti-patterns

- Hỏi nhỏ giọt nhiều lượt (đúng ra: trọn gói một lượt) · tự bịa tiền đề thiếu
- Chặn cứng khi người đã chấp nhận "đủ tạm" · quên ghi nợ khi hoãn
- Sinh artifact cuối khi tiền đề **chặn: có** còn trống mà không đánh dấu là nháp
