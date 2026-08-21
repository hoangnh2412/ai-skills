# ADR Index — trạng thái & việc còn lại

Chỉ mục mọi quyết định định hướng của repo. **Đọc bảng này trước** khi hỏi "ADR nào đang mở / còn phải làm gì". Trạng thái đã **đối chiếu repo thật** (skills/, `rules.json`, router, templates), không chép lại header ADR.

**Tên file:** `ADR-NNN-yyyy-MM-dd-slug.md` — mã `ADR-NNN` **bất biến**, cấp theo thứ tự thời gian, **không** đổi khi trạng thái đổi. Trạng thái sống ở bảng này, không nằm trong tên file. Gọi nhau bằng mã: *"ADR-008 làm trước"*, *"Q2 của ADR-009 đã được ADR-014 trả lời"*.

**Trạng thái:** 🟡 **Doing** — đang làm dở, chưa xong 100% · ⚪ **Todo** — chưa làm gì · 🔴 **Pending** — tạm thời chưa làm (hoãn có chủ đích) · 🟢 **Done** — đã làm 100% · 🟣 **Cancel** — bỏ, không làm nữa (ghi rõ ADR nào thay).

Bảng xếp theo **thứ tự ưu tiên hành động**: Doing → Todo → Pending → Done → Cancel.

| Mã | Ngày | ADR | Trạng thái | Ghi chú — việc còn lại / khối chặn |
|---|---|---|---|---|
| **ADR-011** | 2026-07-26 | [Plugin Claude Code (`minipower-dev`)](ADR-011-2026-07-26-minipower-claude-code-plugin.md) | 🟡 Doing | Triển khai xong: 223 test, `gen:check` xanh. Còn **1 việc:** smoke `claude --plugin-dir ./minipower` — interactive, chủ repo tự chạy |
| **ADR-020** | 2026-08-20 | [3 chế độ dự án, điều kiện cứng bằng hook](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) | ⚪ Todo | **ADR định hướng hiện hành** — giữ kiến trúc pipeline + **một cấu trúc folder duy nhất cho cả 3 mode** (mode chỉ đổi *nội dung được điền*, không cắt folder — tương thích ngược, không phải di trú khi lên `standard`); thêm `project_mode` (mvp · standard · maintain) + `approval_source` (local · openproject · gitlab) vào `rules.json` + `profile.json` v2. Nguyên tắc **"cứng bằng máy, mềm bằng lời"**: điều kiện cứng là hook/CI (3 hook mới `prereq-gate`/`dec-gate`/`baseline-guard`, bỏ `permissions.deny` tĩnh), **test viết trước hook** (QĐ-10). Phê duyệt: local hôm nay → MCP ngày mai bằng back-ref, đổi một trường (QĐ-9). Skill mới `as-built` — người trigger, **wrap codegraph** (optional). `memory/` **không** cấu trúc lại (§3c). Huỷ ADR-019. **12 việc** ở §8. **Chặn:** Q1 (mức block prereq-gate) · Q2 (format DEC + back-ref — chốt trước khi viết hook) |
| **ADR-008** | 2026-07-25 | [Proposal Suite (GPKT · Báo giá · Timeline)](ADR-008-2026-07-25-minipower-proposal-suite.md) | ⚪ Todo | **Làm được ngay — hướng đã chốt, không câu hỏi chặn.** Repo chưa có gì: không `skills/proposal-*`, không `catalog-default.json`/`quotation-calc.js`; router + `rules.json` 0 hit "proposal". Lộ trình §6: **R2** catalog + `quotation-calc.js` + test (ROI cao nhất, làm trước) → **R3** skill quotation → **R4** `milestones[]` + `timeline-to-mermaid.js` (song song R2) → **R5** TPL GPKT + `gpkt-assemble.js` → **R6** wire router + `prereq_by_intent` (đụng `rules.json` ⇒ `gen → test → gen:check`) |
| **ADR-014** | 2026-07-28 | [Spine "wrap-not-build"](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) | ⚪ Todo | Chưa có `constitution.md`, chưa sharded step-file. **Chặn — cần người quyết:** Q1 vai wedge đợt đầu · **Q2 thứ tự borrow S1→B1→S2→O1→P2→B2** · Q3–Q6 |
| **ADR-016** | 2026-08-02 | [Discovery — tóm tắt tài liệu nguồn lớn](ADR-016-2026-08-02-minipower-discovery-tom-tat-tai-lieu-lon.md) | ⚪ Todo | `discovery/SKILL.md` chưa có Bước 0 Ingest. **Chặn — cần người quyết:** Q1–Q8 (chunk boundary/size, ngưỡng bật fan-out, có tạo skill `source-ingest` không) |
| **ADR-012** | 2026-07-26 | [Cursor Plugin](ADR-012-2026-07-26-minipower-cursor-plugin.md) | 🔴 Pending | Hoãn có chủ đích — không làm gì. Chặn bởi M1/M2 (Cursor thiếu local-dev install + biến plugin-root). Tái xét khi team cần Cursor marketplace **hoặc** Cursor ra docs |
| **ADR-010** | 2026-07-25 | [Checkpoint tạm dừng gated-fanout](ADR-010-2026-07-25-tam-dung-gated-fanout-checkpoint.md) | 🟢 Done | Checkpoint đã ghi xong; **đã xác minh 2026-08-20:** branch `feature/minipower-pm-project` đã merge `main` (0 commit ahead) → mục "chưa merge" hết hiệu lực. Đọc trước khi resume ADR-003 |
| **ADR-001** | 2026-07-17 | [Đánh giá Minipower & chiến lược phát triển](ADR-001-2026-07-17-danh-gia-minipower-va-chien-luoc-phat-trien.md) | 🟢 Done | P0–P4 + R1–R6 xong, đã merge main. Q4/Q5 chốt. Không còn việc |
| **ADR-002** | 2026-07-20 | [Định hướng — AI hỗ trợ ra quyết định](ADR-002-2026-07-20-dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md) | 🟢 Done | N1–N6 đã triển khai. §0 bị **ADR-003** supersede; §1–§6 vẫn còn giá trị tham chiếu |
| **ADR-004** | 2026-07-25 | [Proposal skills — chỉ mục cha](ADR-004-2026-07-25-minipower-proposal-skills.md) | 🟢 Done | Khép hồ sơ: đã gộp vào **ADR-008**, không cập nhật tiếp. *Việc thực thi proposal theo dõi ở ADR-008 (Todo), không phải ở đây* |
| **ADR-005** | 2026-07-25 | [`proposal-quotation`](ADR-005-2026-07-25-proposal-quotation.md) | 🟢 Done | Khép hồ sơ: gộp vào **ADR-008 §3**. Giữ schema JSON §4 để tra cứu |
| **ADR-006** | 2026-07-25 | [`proposal-technical`](ADR-006-2026-07-25-proposal-technical.md) | 🟢 Done | Khép hồ sơ: gộp vào **ADR-008 §4** |
| **ADR-007** | 2026-07-25 | [`proposal-timeline`](ADR-007-2026-07-25-proposal-timeline.md) | 🟢 Done | Khép hồ sơ: gộp vào **ADR-008 §5** |

| **ADR-019** | 2026-08-20 | [Harness đa vai, không gate nội bộ](ADR-019-2026-08-20-minipower-harness-khong-gate.md) | 🟣 Cancel | Huỷ 2026-08-20 (cùng ngày viết) — thay bởi **ADR-020**: "không block bước nào" bỏ luôn khả năng gate cứng cho dự án chuẩn chỉnh; ADR-020 giữ kiến trúc + tham-số-hoá gate theo 3 chế độ dự án. Kế thừa: QĐ-5 advisory (→ hành vi mode mvp/maintain) · QĐ-6 `trace:check` CI · §3 ánh xạ vai→công cụ (Gitlab) · §2 phân loại 6 loại gate |
| **ADR-003** | 2026-07-20 | [Gated Fan-out Execution](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) | 🟣 Cancel | Huỷ 2026-08-20 — lấy "gated" làm lõi, trái **ADR-019**. Kế thừa: cơ chế fan-out per-module (skill `fan-out` vẫn dùng, bỏ điều kiện DEC cổng trước), thứ tự requirements, DOC-19 |
| **ADR-013** | 2026-07-26 | [Senior/Junior execution](ADR-013-2026-07-26-minipower-senior-junior-execution.md) | 🟣 Cancel | Huỷ 2026-08-20 — lõi là QC loop **chặn** ≤3 + cổng nghiệm thu. Kế thừa: hợp đồng 7 trường + governance test-case như **khuyến nghị** |
| **ADR-017** | 2026-08-20 | [7 vai + toolchain (Github)](ADR-017-2026-08-20-minipower-toolchain-openproject-github-outline-slack.md) | 🟣 Cancel | Huỷ cùng ngày viết — sai công cụ (Github → **Gitlab**) + vẫn giữ khung gate. Kế thừa: ánh xạ vai→công cụ, L1/L2/L3 |
| **ADR-018** | 2026-08-20 | [Phê duyệt OpenProject + Outline](ADR-018-2026-08-20-minipower-phe-duyet-openproject-publish-outline.md) | 🟣 Cancel | Huỷ cùng ngày viết — viết theo kiểu "chưa duyệt = không qua cổng". Kế thừa: mô hình 3 mặt phẳng + publish Outline + back-ref DEC |
| **ADR-009** | 2026-07-25 | [Orchestrator analysis](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) | 🟣 Cancel | Huỷ 2026-08-20 — câu hỏi chặn đã được **ADR-017** trả lời (Q2 = wrap MCP 4 công cụ · Q3 = cả 7 vai · Q6 = bỏ Calendar/Zoom). Phân loại **L1/L2/L3** và ranh giới "không agent-tự-bàn-giao" kế thừa vào ADR-017 |
| **ADR-015** | 2026-07-29 | [Phê duyệt Jira/Lark + Outline](ADR-015-2026-07-29-minipower-phe-duyet-jira-lark-publish-outline.md) | 🟣 Cancel | Huỷ 2026-08-20 — Jira/Lark rời lộ trình (ADR-017 QĐ-3), Q1 "Jira hay Lark" mất nghĩa. Mô hình 3 mặt phẳng viết lại tại **ADR-018** |

*Cập nhật lần cuối: 2026-08-20 · 20 ADR · mã kế tiếp: **ADR-021***

---

## Bảo trì

File này **viết tay** — không phải vùng generated.

- **Thêm ADR:** lấy **mã kế tiếp** ghi ở dòng trên (không tái sử dụng mã đã cấp, kể cả khi ADR bị gộp/thay thế), tạo `ADR-NNN-yyyy-MM-dd-slug.md`, thêm **một dòng** vào bảng + tăng "mã kế tiếp" trong **cùng commit**.
- **Đổi trạng thái:** sửa cột Trạng thái + chuyển dòng cho đúng thứ tự ưu tiên. **Không đổi tên file, không đổi mã** — đó là lý do trạng thái không nằm trong tên.
- **"Gộp / bị thay thế" không phải trạng thái** mà là ghi chú: ADR đó khép hồ sơ (🟢 Done) và ghi rõ trỏ sang mã nào; việc còn lại theo dõi ở ADR đích.
- **🟣 Cancel** dùng khi việc **bị bỏ, không làm nữa** (đổi định hướng, công cụ rời lộ trình). Không xoá file — ghi rõ ADR nào thay và phần nào được kế thừa.
- **Tham chiếu chéo:** trong ADR và trong hội thoại, gọi bằng mã (`ADR-014`) thay vì tên file.
- Mã `ADR-NNN` ở đây là **quyết định định hướng của repo `ai-skills`**; đừng nhầm với `ADR-NNN` trong `docs/` của **dự án đích** (hai không gian tên tách biệt).
- **Không** chép nội dung ADR vào đây — chi tiết quyết định, trade-off và mục **Ảnh hưởng** nằm trong từng ADR.
- Liên quan: [AGENTS.md](../AGENTS.md) (quy ước ADR) · [COORDINATION.md](../COORDINATION.md) (handoff H1–H6) · [minipower/SKILL.md](../minipower/SKILL.md) (router).
