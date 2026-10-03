# Decision Log — lưu "tại sao"

[← README](README.md) · [Pipeline](pipeline.md)

Memory hiện tại lưu **trạng thái**; decision log lưu **lý do**: quyết định gì, **phương án bị loại**, vì sao. Đây là tri thức thật của dự án — thứ người mới join cần, thứ CR cần khi lật lại.

**Ở đâu:** `memory/decision-log.md` (một file cho cả dự án — ADR-035; phase nằm trong ID `DEC-{PHASE}-`). Quyết định kiến trúc nặng → nâng lên **ADR** (DOC-09); decision log là bản nhẹ cho mọi phase và **trỏ tới ADR** khi được formal hóa.

## Schema một entry

```text
### DEC-{PHASE}-NNN — <tiêu đề> · [YYYY-MM-DD]
- Status: proposed | accepted | superseded-by DEC-xxx
- Context: vì sao vấn đề này nổi lên
- Options: A … / B … / C …
- Decision: chọn X
- Why (loại B, C vì): <lý do — quan trọng nhất>
- Consequences: trade-off đã chấp nhận
- Affects: <module/hệ thống bị ảnh hưởng> · <task/CR> · <release/version>
- Trace: DOC-XX · {MOD}-FR-xxx · ADR-xxx (nếu có)
- Confidence: cao | vừa | thấp
```

**`Affects` (N6 — truy vết ngược):** liên kết quyết định → hệ thống/task/release chịu tác động. Nhờ đó trả lời được *"Vì sao API này đổi?"* → lần theo `Affects` ngược về DEC/ADR. `Trace` chỉ *lên* (yêu cầu gốc); `Affects` chỉ *xuống* (hệ quả). Khi một CR/incident đụng quyết định cũ → thêm chính nó vào `Affects` của DEC đó.

**ID:** `DEC-DIS-001` (discovery), `DEC-REQ-…`, `DEC-ARC-…`, `DEC-PLN-…`, `DEC-DLV-…`, `DEC-CHG-…`.

## Ví dụ

```text
### DEC-ARC-003 — Chọn message queue thay vì gọi REST đồng bộ · [2026-07-12]
- Status: accepted
- Context: Module billing ↔ notification cần tách coupling, chịu tải burst.
- Options: A REST sync / B RabbitMQ / C Kafka
- Decision: B — RabbitMQ
- Why (loại A vì mất decoupling khi notification down; loại C vì team chưa vận hành được Kafka, over-engineered cho volume hiện tại).
- Consequences: chấp nhận eventual consistency; cần dead-letter + retry policy.
- Affects: module billing, notification · CR-014 · v1.3
- Trace: DOC-10 §3 · BILL-FR-021 · ADR-005
- Confidence: vừa
```

## Recall — agent làm gì

| Khi | Hành động |
|-----|-----------|
| **Đầu phiên** | Đọc `memory/memory.md` → mở `memory/decision-log.md` khi cần DEC liên quan |
| **Trước khi quyết lại** | Tìm DEC liên quan; nếu đã có → **không** quyết lại từ đầu, kế thừa hoặc supersede |
| **Hỏi "vì sao X đổi?"** | Tìm `Affects:` chứa X (module/API/release) → lần ngược về DEC/ADR gốc + ngày (N6) |
| **Có bằng chứng mới** | Chạy [deliberation](../skills/minipower-router-deliberation/SKILL.md) Premise Check; nếu đổi → thêm DEC mới `superseded-by` |
| **Cuối phiên** | Ghi DEC cho mọi quyết định có phương án bị loại — **không** nhồi vào `memory.md` gốc |

## Staleness

- Mỗi DEC có **ngày** + **Status**. Quyết định trước baseline mà chưa `accepted` → nghi ngờ, xác nhận lại.
- `superseded-by` giữ vết lịch sử — **không xóa** DEC cũ.
- **Hook tự động** — decision-staleness: quét `memory/decision-log.md`, so ngày DEC (còn hiệu lực) với lịch sử git của DOC trong dòng `Trace:`. DOC đổi **sau** ngày quyết định → cảnh báo "cần review / supersede". Advisory, non-blocking. Git thuần, không cần python. SSOT: [`hooks/lib/decision-staleness.js`](../hooks/lib/decision-staleness.js) (một implementation dùng chung).
  - **Claude Code:** `UserPromptSubmit` keyword-gated — [install/claude/README.md](../../../cli/claude/README.md).
  - **Cursor:** `beforeSubmitPrompt` keyword-gated (bàn về quyết định) — [install/cursor/README.md](../../../cli/cursor/README.md).
  - **OpenCode:** message đầu phiên (mô phỏng SessionStart), gọi lib `.js` chung — [install/opencode/README.md](../../../cli/opencode/README.md).
  - *Giới hạn:* ánh xạ `DOC-NN` → file theo tên; DOC-NN dùng ở nhiều module sẽ kiểm mọi file khớp. Chỉ để **nhắc**, không phán quyết — verdict cuối do người/[deliberation](../skills/minipower-router-deliberation/SKILL.md).

## Quan hệ

| Feed vào | Dùng để |
|----------|---------|
| [deliberation](../skills/minipower-router-deliberation/SKILL.md) | Reassessment khi tiền đề đổi |
| [doc-review](#qc-review-trong-pack-nghề) | Kiểm DOC có khớp quyết định đã chốt |
| ADR (DOC-09) | Formal hóa decision kiến trúc |
| Báo cáo / rollup | Lịch sử quyết định cho PM / người mới |
