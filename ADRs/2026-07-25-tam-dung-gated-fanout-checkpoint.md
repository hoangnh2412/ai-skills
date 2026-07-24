# Tạm dừng Gated Fan-out — checkpoint & chuyển ưu tiên

| | |
|---|---|
| **Ngày** | 2026-07-25 |
| **Trạng thái** | ✅ Checkpoint đã lưu — **tạm dừng** triển khai tiếp trên lộ trình A→E |
| **Phạm vi** | `minipower/` — nhánh công việc [Gated Fan-out Execution](2026-07-20-minipower-gated-fanout-execution.md) |
| **Nối tiếp** | [ADR gated-fanout 2026-07-20](2026-07-20-minipower-gated-fanout-execution.md) · branch `feature/minipower-pm-project` |
| **Mục đích** | Ghi lại trạng thái hiện tại trước khi chuyển sang công việc ưu tiên khác; làm mốc khi mở lại |

---

## §0. Quyết định

**Tạm dừng** mọi triển khai tiếp theo của lộ trình Gated Fan-out (giai đoạn D, E, wireframe MCP, fan-out mở rộng, hook runtime cho approval gate) cho đến khi có quyết định mở lại rõ ràng.

| # | Nội dung | Ghi chú |
|---|---|---|
| **QĐ-1** | **Không abandon** pivot §0 và phần đã merge vào branch | A/B/C là tài sản đã có; không revert |
| **QĐ-2** | **Không làm D/E “cho xong”** khi chưa có SOP Lark | Giữ nguyên ranh giới ADR gated-fanout §4 |
| **QĐ-3** | **Checkpoint tại HEAD branch** dưới đây | Mở lại từ đây, không đoán lại trạng thái |
| **QĐ-4** | Công việc ưu tiên khác **không bắt buộc** nằm trên branch này | Có thể làm trên branch/repo khác; branch này giữ nguyên như mốc |

Triết lý §0 (người chốt tại cổng, AI fan-out giữa hai cổng) **vẫn hiệu lực** — chỉ **tạm dừng triển khai**, không đổi hướng.

---

## §1. Checkpoint kỹ thuật (2026-07-25)

| Mục | Giá trị |
|---|---|
| **Branch** | `feature/minipower-pm-project` (đồng bộ `origin`) |
| **HEAD** | `7dbf584` — *feat: Add initial documentation for AI SDLC Pipeline agent* |
| **Commits ahead of `main`** | 3 (`28565fe` → `bddbaf3` → `7dbf584`) |
| **Diff vs `main`** | 44 files · +1.581 / −78 dòng |
| **Test** | **204 pass** (`npm test` trong `minipower/hooks/`) |
| **gen:check** | xanh (lần xác minh cuối khi hoàn thành A/B/C) |
| **Untracked (ngoài checkpoint)** | `minipower-academy/` — **không** nằm trong 3 commit |

### Lịch sử commit trên branch

| SHA | Tóm tắt |
|---|---|
| `28565fe` | Mở rộng `rules.json` / `rules.js` (doc_short, phase_meta, roles, prereq_by_intent, context_chain); role markdown 7 vai trò; TPL incident/meeting/postmortem/RFC |
| `bddbaf3` | Gated fan-out A/B/C: ADR pivot, approval_gates, DOC-19, skill fan-out + readiness-gate wiring |
| `7dbf584` | `AGENTS.md` + `CLAUDE.md` — tài liệu agent cấp repo |

---

## §2. Đã hoàn thành (giai đoạn A / B / C)

Chi tiết kỹ thuật: [ADR gated-fanout §3–§3′](2026-07-20-minipower-gated-fanout-execution.md).

| GĐ | Deliverable chính | Trạng thái |
|---|---|---|
| **A1** | Pivot §0 — Gated Fan-out Execution | ✅ |
| **A2** | `approval_gates` trong `rules.json` + [approval-gate.md](../minipower/agents/approval-gate.md) | ✅ |
| **A3** | DOC-19 Prototype; thứ tự BR → Prototype → SRS; routing `prototype` / `implement` | ✅ |
| **B** | Skill [fan-out](../minipower/skills/fan-out/SKILL.md) — Business Rules (DOC-04) + SRS (DOC-06) | ✅ |
| **C (khung)** | Fan-out Prototype (DOC-19) — màn hình/luồng/mermaid; **chưa** HTML wireframe | ✅ khung |

**Artifact đáng kể đã có trên branch:**

- ADR: [2026-07-20-minipower-gated-fanout-execution.md](2026-07-20-minipower-gated-fanout-execution.md) (cập nhật trạng thái ⏸️)
- Skills: `fan-out`, `readiness-gate` (mở rộng `requirements`)
- Agents: `approval-gate`, `context-load`, `project-state`
- Template: `DOC-19-prototype.md` + 4 TPL phụ trợ
- Roles: `BA`, `PM`, `SA`, `DEV`, `QC`, `DevOps`, `Support`
- Hooks: `rules.json` / `gen-agents-doc.js` / golden test mở rộng

---

## §3. Chưa làm / hoãn (khi mở lại)

### 3.1. Trong lộ trình gated-fanout (ưu tiên khi resume)

| Hạng mục | Giai đoạn | Blocker / ghi chú |
|---|---|---|
| HTML wireframe qua **MCP ngoài** | C (phần còn lại) | Chưa có MCP; DOC-19 chỉ khung + `TBD: wireframe` |
| Epic / Story / Task hierarchy | D | ⏸️ chờ **SOP Lark** |
| Chi phí định lượng + milestone ↔ task | D | ⏸️ chờ SOP Lark |
| Test case chi tiết per-FR + fan-out | D | ⏸️ chờ SOP Lark (hoặc có thể tách nếu không phụ thuộc Lark) |
| **Lark MCP adapter** | E | 0 hit trong repo; làm **sau** chốt data model task (D) |
| Code + unit test → auto cập nhật task | E | ⏸️ chờ Lark MCP + SOP |
| MCP báo cáo PM + nhắc tiến độ | E | Chưa có |
| Fan-out mở rộng: Architecture, test case, code | Sau B/C | Ghi trong skill fan-out — chưa implement |
| Hook runtime **enforce** approval gate (chặn khi thiếu DEC) | Tùy chọn | Hiện chỉ guardrail markdown + `rules.json` |

### 3.2. Ngoài scope gated-fanout (ghi nhận, không block resume)

| Hạng mục | Trạng thái |
|---|---|
| [COORDINATION.md](../COORDINATION.md) | Draft v0.1 — chưa áp dụng vào pack |
| `minipower-academy/` | Untracked — chưa commit |

### 3.3. Mức phủ 8 bước tầm nhìn (snapshot)

| Bước | Phủ ước lượng | Thiếu chính |
|---|---|---|
| 1 BR ∥module | 🟡 ~60% | Enforcement runtime cổng |
| 2 Prototype ∥module | 🔴 ~5% (khung) / wireframe 0% | MCP HTML |
| 3 SRS ∥module | 🟡 ~60% | — |
| 4 Epic/Task → Lark | 🔴 ~20% | SOP + Lark MCP |
| 5 Plan + chi phí | 🟢 ~70% | milestone ↔ task |
| 6 Test case | 🟡 ~50% | per-FR + fan-out |
| 7 Code + UT → task | 🔴 ~15% | lớp thực thi |
| 8 MCP báo cáo | 🔴 ~5% | toàn bộ |

---

## §4. Điều kiện mở lại

Khi quay lại nhánh gated-fanout, làm theo thứ tự:

1. **Đọc lại** ADR này + [ADR gated-fanout](2026-07-20-minipower-gated-fanout-execution.md) §4–§6.
2. **Checkout** `feature/minipower-pm-project` (hoặc merge vào `main` nếu đã review — quyết định riêng).
3. **Xác minh** `cd minipower/hooks && npm test && npm run gen:check` — baseline 204 pass.
4. **Chọn nhánh tiếp theo** (một trong hai, độc lập):
   - **C hoàn thiện:** có MCP/spec wireframe → implement HTML generator.
   - **D mở:** có **SOP Lark** (Epic/Story/Task, trường, trạng thái, báo cáo) → chốt data model → rồi E (adapter).
5. Ghi DEC mới trong `memory/` hoặc ADR follow-up khi bắt đầu lại — **không** tiếp tục âm thầm.

---

## §5. Việc KHÔNG làm trong thời gian tạm dừng

| ❌ | Vì sao |
|---|---|
| Làm D/E “tạm” không SOP Lark | ADR gated-fanout §4 — sẽ phải đập đi |
| Revert A/B/C trên branch | Mất checkpoint; pivot §0 vẫn là hướng đã chốt |
| Nhét Lark/MCP vào core skill | QĐ-3 gated-fanout — adapter riêng |
| Tự động hoá qua cổng không DEC | Trái §0 |

---

## §6. Tham chiếu nhanh

| Tài liệu | Vai trò |
|---|---|
| [2026-07-20-minipower-gated-fanout-execution.md](2026-07-20-minipower-gated-fanout-execution.md) | Kiến trúc + lộ trình A→E (trạng thái ⏸️) |
| [minipower/skills/fan-out/SKILL.md](../minipower/skills/fan-out/SKILL.md) | Cơ chế fan-out đã triển khai |
| [minipower/agents/approval-gate.md](../minipower/agents/approval-gate.md) | Giao thức cổng người-chốt |
| Branch `feature/minipower-pm-project` @ `7dbf584` | Snapshot code |
