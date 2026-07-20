# Định hướng Minipower — AI hỗ trợ con người ra quyết định

| | |
|---|---|
| **Ngày** | 2026-07-20 |
| **Trạng thái** | ✅ N1–N6 đã triển khai (2026-07-20, branch `feature/minipower-rules-as-data`) · Q6/Q7 chốt (§6). Test 202 pass, `gen --check` xanh. Nối tiếp [ADR 2026-07-17](2026-07-17-danh-gia-minipower-va-chien-luoc-phat-trien.md) (P0–P4, R1–R6) |
| **Phạm vi** | `minipower/` — lớp Thinking / Workflow / Roles / Memory |
| **Mục đích** | Chốt triết lý sản phẩm và liệt kê việc cần làm cho giai đoạn kế |

---

## §0. Chốt triết lý — ranh giới không đổi

Minipower **không** xây đội Agent tự thực hiện. Định vị dứt khoát:

```
AI = trợ lý ra quyết định + xử lý vấn đề cho con người
Con người = người quyết định cuối cùng
```

**Quy tắc thực thi (bất biến):**

> AI chỉ chuyển sang *thực thi* (sinh code, sinh artifact cuối) **khi toàn bộ tài liệu liên quan đã được viết rõ ràng.**
> Trước ngưỡng đó, AI chỉ làm: discovery, đặt câu hỏi, phản biện, phân tích trade-off, gợi ý — **không tự nhảy vào giải pháp.**

Điều này biến điểm mạnh sẵn có (`deliberation`, `decision-log`) thành trục chính, và loại bỏ hướng "Agent Orchestration tự động" khỏi lộ trình.

**Định vị dài hạn:** *AI Project Intelligence* — Model là engine (thay được), Knowledge + Memory là tài sản (model-agnostic). Không phải Prompt Library.

---

## §1. Đã có (không làm lại — xem ADR 2026-07-17)

Knowledge (18 DOC + trace + baseline/CR) · `deliberation` (Premise Check, 7 góc nhìn, verdict) · `decision-log` (schema DEC + supersede) · auto-routing DOC→phase · complexity-rubric · 3 tầng chi phí · Node SSOT + test/CI · install script · Việt-only.

---

## §2. Kiến trúc mục tiêu & khoảng trống

Tầm nhìn đầy đủ = **7 lớp**: Knowledge · Thinking · Workflow · Roles · Templates · Output · Memory. Bảng dưới gồm cả lớp *Context-aware auto-load* (năng lực xuyên suốt, là lợi thế cạnh tranh cốt lõi) và lớp *Output* để §2 khớp với §3–§4.

| Lớp | Trạng thái | Khoảng trống còn lại | Việc phủ |
|---|---|---|---|
| Knowledge | ✅ mạnh | — | — |
| Thinking | ✅ `deliberation` | **Discovery gate ở mức yêu cầu đầu vào** | N1 |
| Workflow | 🟡 routing→phase | **Nhận thức giai đoạn dự án** | N2 |
| Context-aware auto-load | ❌ chưa | Tự nạp chuỗi ngữ cảnh trước khi đề xuất (§3.4) | N4 |
| Roles | ❌ chưa | Role = lăng kính hỗ trợ (không phải agent tự chạy) | N3 |
| Templates | 🟡 có DOC | Mở rộng ADR/RFC/incident/postmortem | N5 |
| Output | 🟡 gộp vào Templates | Chuẩn hoá đầu ra — **gộp vào Templates (N5)**, không tách task riêng (co lại trước khi mở rộng) | N5 |
| Memory | 🟡 `decision-log` | Liên kết decision ↔ hệ thống ↔ task ↔ release | N6 |

---

## §3. Năm trụ cột định hướng

### §3.1. Readiness Gate — cửa thực thi *(trọng tâm)*
Trước khi sinh giải pháp cuối, AI **soát tài liệu tiền đề**. Nhưng gate **không phải cổng chặn nhị phân** — nó là "đủ ở mức chấp nhận được" do con người quyết, không phải "đủ tuyệt đối" (xem Q7 §6).

**Ba nguyên tắc vận hành (quan trọng):**

1. **Hỏi trọn gói, một lượt.** AI **liệt kê TẤT CẢ câu hỏi/thiếu sót cùng lúc**, không hỏi nhỏ giọt từng câu. (Đây là pain thực tế: hỏi-đáp lắt nhắt làm mất thời gian.)
2. **Ngưỡng "đủ chấp nhận được".** Con người xác nhận mức đủ. Không ép đủ tất cả mới được đi tiếp.
3. **Cho phép hoãn có ghi nợ.** Mục nào con người chọn bỏ qua tạm → ghi vào **sổ nợ tài liệu (open questions)**, đi tiếp bước sau, **bổ sung dần trong lúc thực thi**.

```
Yêu cầu → AI liệt kê TRỌN BỘ tiền đề còn thiếu (một lượt)
            │
   Con người quyết mỗi mục:  [Trả lời ngay] · [Hoãn → ghi nợ] · [Không cần]
            │
   Đủ ở mức chấp nhận được? ──Có──► thực thi (kèm sổ nợ để bổ sung dần)
            └──────────────────Không──► xin thêm phần tối thiểu còn thiếu
```

Đây là kháng thể chống hallucination và "nhảy giải pháp sớm", **nhưng không cản tốc độ**. Khác `deliberation` (soát *một DOC* có đáng viết không) — gate này soát *bộ tiền đề đầu vào* đã đủ để bắt đầu chưa.

**Về việc "nhiều skill" (Q6):** không tạo skill rời để con người tự chọn. Gate này (và các năng lực khác) do **auto-routing chọn tự động** theo intent/phase — con người **không phải chọn skill**. Nhờ vậy vẫn giữ được nguyên tắc "mỗi skill một nhiệm vụ" mà không gây rối menu (xem §6 Q6).

### §3.2. Project State Awareness — AI biết dự án đang ở đâu
`Requirement → Analysis → Design → Development → Testing → Deployment → Maintenance`.
Mỗi giai đoạn kích hoạt bộ skill + lăng kính vai trò phù hợp (Requirement→BA, Design→SA, Dev→DEV, Test→QC…). Routing hiện map DOC→phase; cần thêm **trạng thái dự án → năng lực nên dùng**.

### §3.3. Roles = lăng kính hỗ trợ con người *(KHÔNG phải agent tự chạy)*
Mỗi vai trò (BA, PM, SA, Architect, DEV, QC, DevOps, Support) là một góc nhìn để AI **hỗ trợ đúng người đó ra quyết định**, gồm: `Goal · Deliverables · Checklist · Câu hỏi cần hỏi`. Không có "BA Agent tự động bàn giao cho SA Agent" — con người điều phối giữa các vai trò.

### §3.4. Context-aware auto-load
Khi tài liệu đã đủ, AI tự nạp chuỗi ngữ cảnh trước khi đề xuất:
`BRD → SRD → Architecture → Database → Coding Convention → Decision Log → Open Issues → Current Sprint`. Đây là lợi thế mà bộ skill coding-centric không có.

### §3.5. Templates & Memory linking
- Mở rộng template ngoài DOC: ADR, RFC, Meeting Minutes, Incident Report, Postmortem.
- Memory: liên kết `Decision → hệ thống bị ảnh hưởng → task → release` để trả lời được "Vì sao API này đổi?" → "Do ADR-14, ngày…".

---

## §4. Việc cần làm

> Nguyên tắc giữ nguyên từ ADR trước: **co lại trước khi mở rộng** — mọi thứ mới đều có SSOT + test/CI, không dựa vào kỷ luật con người. Không thêm nền tảng thứ tư.

| # | Việc | Deliverable | Trạng thái |
|---|------|-------------|-----------|
| **N1** | Readiness Gate (§3.1) | `prereq_by_intent` trong [rules.json](../minipower/hooks/lib/rules.json) + skill [readiness-gate/SKILL.md](../minipower/skills/readiness-gate/SKILL.md) (hỏi trọn gói, hoãn-ghi-nợ, sổ `open-questions.md`) + wire router. Bảng tiền đề sinh qua `npm run gen`. | ✅ |
| **N2** | Project State Awareness (§3.2) | `phase_meta` (state+role) trong rules.json + [agents/project-state.md](../minipower/agents/project-state.md) (bảng generated) + auto-routing nhét `State:/Role:` vào context enrich; test golden. | ✅ |
| **N3** | Roles as lenses (§3.3) | [roles/](../minipower/roles/) — 7 file (BA, PM, SA, DEV, QC, DevOps, Support): Goal · Deliverables · Checklist · Câu hỏi cần hỏi; index sinh từ `roles` trong rules.json. | ✅ |
| **N4** | Context-aware auto-load (§3.4) | `context_chain` trong rules.json + [agents/context-load.md](../minipower/agents/context-load.md) (bảng generated); readiness-gate → context-load sau khi đủ tiền đề. | ✅ |
| **N5** | Templates mở rộng (§3.5) | [templates/](../minipower/templates/) — TPL RFC / Meeting Minutes / Incident / Postmortem (ADR đã là DOC-09); README có mục "Template phụ trợ". | ✅ |
| **N6** | Memory linking (§3.5) | Trường `Affects:` (hệ thống/task/release) vào schema [decision-log](../minipower/docs/decision-log.md) + 6 skeleton; recall "vì sao X đổi" lần ngược `Affects`. | ✅ |

**Xác minh:** 202 test pass (`node --test`, gồm golden rules/auto-routing mới), `npm run gen:check` xanh — mọi bảng doc đồng bộ rules.json. Yêu cầu node ≥18 (`--test` + `||=`).

---

## §5. Việc KHÔNG làm

| ❌ | Vì sao |
|---|---|
| Agent tự thực hiện / bàn giao tự động | Trái triết lý §0 — con người là người quyết định |
| AI sinh code khi tài liệu chưa đủ | Vi phạm quy tắc thực thi §0 |
| Thêm nền tảng thứ tư | Chi phí drift nhân tuyến, giá trị không |
| README "research-backed" marketing | Đánh đổi minimal-context lấy marketing (bài học ADR trước) |

---

## §6. Quyết định — đã chốt

| # | Câu hỏi | Chốt |
|---|---------|------|
| **Q6** | Tạo skill mới sẽ có quá nhiều skill, khó biết dùng cái nào? | **Giữ skill nhỏ single-purpose, NHƯNG con người không chọn skill — auto-routing chọn theo intent/phase.** Sự bùng nổ số lượng chỉ là vấn đề UX *khi người phải chọn*; router che đi thì không. Nguyên tắc: mỗi skill một nhiệm vụ + một lớp dispatch (đã có `rules.json`). Điều kiện đi kèm: mọi skill mới phải khai báo trigger trong `rules.json` để router biết khi nào gọi. |
| **Q7** | Bộ tiền đề cứng hay cấu hình riêng? | **Có bộ mặc định; AI hỏi "dùng mặc định?" — không thì cho cấu hình per-project.** Và "đủ tài liệu" = **đủ ở mức chấp nhận được**, không phải đủ tuyệt đối: hỏi trọn gói một lượt, cho hoãn có ghi nợ, bổ sung dần khi thực thi (§3.1). |
