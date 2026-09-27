# Bỏ lời nhắc trùng — harness và AGENTS.md đã làm

| | |
|---|---|
| **Ngày** | 2026-09-27 |
| **Trạng thái** | Đề xuất — chờ Confirm §6 |
| **Phạm vi** | Lời nhắc agent / rule Cursor-OpenCode đang lặp việc client harness hoặc `AGENTS.md` dự án đã mang. Xoá bản chữ thừa. Giữ hook máy kiểm được |
| **Ngoài phạm vi** | Skill nghề (deliberation, readiness, SRS, SAD, .NET, kênh MCP, `*-review`) · hook `token-guard` / `profile-guard` / `auto-routing` / `prereq-gate` / `baseline-guard` · SOP Lark IM còn trong `lark-work-assistant` (trùng skill `minipower-chat-lark`, không phải harness — [ADR-036](ADR-036-2026-09-26-agent-skill-lark-tasks.md)) · persona `src/tasks/agents/minipower-tasks-lark.md` (trùng skill tasks) · mở lại skill `fan-out` |
| **Nối tiếp** | [ADR-033](../doing/ADR-033-2026-09-25-dispatcher-role-channel-ssot-provider.md) C5 · [ADR-034](../done/ADR-034-2026-09-26-minipower-marker-always-on-dispatch.md) QĐ-4 (route = LLM) · [ADR-037](../done/ADR-037-2026-09-26-xoa-folder-sdlc-dot-e.md) Q4 (fan-out = harness, đã xoá skill) · [ADR-031](../doing/ADR-031-2026-09-01-cli-install-init-thay-llm-thi-hanh.md) (init = CLI) · mẫu [SAMPLE-agents.md](../../src/router/templates/SAMPLE-agents.md) |
| **Mục đích** | Một lời nhắc một nhà. Không viết lại cơ chế hay đoạn chữ mà harness đã thực thi |
| **Ảnh hưởng** | `src/router/agents/` (xoá các file §5a) · `cli/cursor/rules/minipower-token-guard.mdc` · `minipower-doc-editing.mdc` · `minipower-profile.mdc` · `cli/opencode/rules/minipower-profile.md` · `src/router/hooks/gen-agents-doc.js` · `src/router/hooks/lib/rules.json` (`context_chain`, `approval_gates`) · `src/router/hooks/lib/auto-routing.js` (path lá chết) · `src/router/templates/TPL-agent-profile.md` (import Claude) · `src/router/docs/token-guard.md` · href trong skill/role/pipeline/README cài · test gen / soft-layer / rules |

---

## §1. Bối cảnh

Đọc repo 2026-09-27, sau khi `src/sdlc/` đã xoá (ADR-037) và `AGENTS.md` dự án được viết theo [SAMPLE-agents.md](../../src/router/templates/SAMPLE-agents.md).

Harness ở đây là client (Cursor / Claude / OpenCode): nó spawn subagent, review một chiều hoặc một module, dedup finding, đọc file, hỏi khi thiếu scope. ADR-033 C5 đã cấm làm lại fan-out / QC loop / retry. Skill `fan-out` không còn.

Việc còn lại là **lời nhắc**. Cùng một đoạn đang nằm ở ba chỗ, và client nạp hơn một chỗ mỗi phiên:

| Việc | Harness / `AGENTS.md` đã có | Bản thứ hai, thứ ba |
|------|-----------------------------|---------------------|
| Một slice, tối đa ba file, không đọc cả baseline / trace | SAMPLE mục 2–3 | `agents/token-guard.md` **nguyên văn** với `cli/cursor/rules/minipower-token-guard.mdc` (`alwaysApply`) |
| Version `—`, cross-ref bằng ID | SAMPLE mục 5 | `agents/doc-editing.md` **nguyên văn** với `minipower-doc-editing.mdc` |
| Đọc `profile.user.json`, không lấy tên từ `profile.json` | SAMPLE mục 0 | `agents/profile-guard.md` + `minipower-profile.mdc` + `cli/opencode/rules/minipower-profile.md` |
| Thứ tự đọc DOC | SAMPLE mục 2 (đủ hơn) | `agents/context-load.md` — bảng gen từ `context_chain`, không hook nào đọc |
| Điểm người chốt + soạn DEC | SAMPLE mục 6 | `agents/approval-gate.md` — bảng gen từ `approval_gates`, không hook nào đọc |
| Phase → vai | Hook `auto-routing` nhét `State:` / `Role:` từ `phase_meta` | `agents/project-state.md` chỉ render lại bảng |
| Chọn một skill | ADR-034 + rule `minipower-always-on.mdc` + SAMPLE mục 3 | Đoạn “khi không có hook” trong `agents/auto-routing.md` |

`TPL-agent-profile.md` còn `@import` token-guard, auto-routing, profile-guard vào `CLAUDE.md`, trong khi thân `CLAUDE.md` đã là cùng khối với `AGENTS.md`.

`context_chain` và `approval_gates` trong `rules.json` chỉ để `gen-agents-doc.js` đổ vào hai file markdown. `phase_meta` thì hook thật sự đọc — giữ.

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Ba bản cùng một lời nhắc (agent md, rule IDE, AGENTS.md) | Phiên Cursor nạp AGENTS.md và rule `alwaysApply` — hai lần cùng luật, dễ lệch |
| P2 | `profile-guard.md` còn bảo “không có hook thì ghi `profile.json` bằng tay” | Trái ADR-031 và SAMPLE mục 3: init là CLI |
| P3 | Bảng gen `auto-routing.md` trỏ `skills/planning`, `skills/delivery`, `skills/change-control` | Path kho `sdlc/` đã chết. Hook `skillPath()` rơi về `router/skills/{phase}/SKILL.md` cho ba phase đó — file không có |
| P4 | Viết lại fan-out hoặc “cơ chế subagent” | ADR-037 Q4 đã xoá skill. `parallel-work.md` giao việc đó cho harness |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | Không agent runtime, không spawn pack (ADR-022 QĐ-1, ADR-033 QĐ-1) |
| C2 | Cứng bằng máy, mềm bằng lời (ADR-020). Xoá lời nhắc không được xoá hook |
| C3 | Route = LLM chọn một skill (ADR-034). Keyword không thay LLM |
| C4 | Init = CLI (ADR-031). Không hồi hướng “agent ghi profile” |
| C5 | Đụng `rules.json` / `lib/*.js` thì `gen` → `npm test` → `gen:check` |
| C6 | Chữ ADR cũ giữ; chỉ sửa href khi path mất (ADR-022 QĐ-11) |

## §4. Phương án

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | Giữ mọi agent md “phòng khi không cài rule” | Có fallback | P1 còn; ba SSOT | ❌ |
| O2 | Xoá lời nhắc trùng. Một nhà chữ = `AGENTS.md` dự án (mẫu SAMPLE). Hook giữ việc máy làm được | Hết nạp đôi; khớp C2 | Sửa gen, test, href, import Claude | ✅ chọn |
| O3 | Xoá luôn hook token / profile / auto-routing vì “model tự biết” | Ít file | Mất cái FAIL được bằng máy (C2) | ❌ |

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **Không làm lại cơ chế harness** | Cấm skill hoặc mục “cơ chế subagent” cho fan-out, retry, QC loop. Song song theo module = client + quy tắc owner trong `parallel-work.md`. Đã xoá skill `fan-out` — không mở lại |
| **QĐ-2** | **Một lời nhắc một nhà** | Nhà chữ cho dự án đích = `AGENTS.md` / `CLAUDE.md` sinh theo SAMPLE. Không bản agent md và không rule IDE lặp cùng đoạn |
| **QĐ-3** | **Xoá lời nhắc trùng — lý do từng file** | Bảng §5a |
| **QĐ-4** | **Giữ hook** | `token-guard`, `profile-guard`, `auto-routing` (chặn nhiều phase / gắn `State:` `Role:`), `prereq-gate`, `baseline-guard`. Máy vẫn FAIL được khi người làm sai |
| **QĐ-5** | **Bỏ key JSON không còn ai đọc** | Xoá `context_chain` và `approval_gates` khỏi `rules.json`. Nội dung chữ đã ở SAMPLE mục 2 và mục 6. **Giữ `phase_meta`** — hook đọc |
| **QĐ-6** | **Hook auto-routing trỏ lá thật** | `planning` → `minipower-pm-plan`. `delivery` → `minipower-qa-strategy` (DOC-16) và `minipower-ops-deploy` (DOC-17). `change-control` → `minipower-analyst-cr`. Không còn `router/skills/{phase}/SKILL.md` |
| **QĐ-7** | **Không xoá skill nghề dưới nhãn này** | Deliberation, readiness, review pack, checklist .NET: harness không có verdict và tiêu chí đó. Bốn lá `*-review` đang mỏng — thiếu checklist là lỗ nội dung, không phải trùng harness |
| **QĐ-8** | **Giữ rule always-on** | `cli/cursor/rules/minipower-always-on.mdc` nói việc khi **không** có `.minipower/`. `AGENTS.md` chỉ tồn tại sau init, không thay rule này |

### §5a. Lý do xoá

| Xoá | Lý do |
|-----|--------|
| `src/router/agents/token-guard.md` | Cùng chữ với rule Cursor `alwaysApply` và với SAMPLE mục 2–3 (một slice, ba file, không đọc baseline / cả trace). Hook `token-guard.js` mới là cổng |
| `cli/cursor/rules/minipower-token-guard.mdc` | Bản IDE của file trên. Sau QĐ-2, Cursor đã đọc `AGENTS.md` — rule này nạp lần hai |
| `src/router/agents/doc-editing.md` | Ba bullet đã ở SAMPLE mục 5 (Version `—`, cross-ref ID) và ở `minipower-doc-editing.mdc` |
| `cli/cursor/rules/minipower-doc-editing.mdc` | Bản glob `docs/**/*.md` của cùng ba bullet |
| `src/router/agents/profile-guard.md` | SAMPLE mục 0 + rule profile đã nói đọc user file, cấm tên trên `profile.json`. Đoạn fallback “ghi profile bằng tay” trái ADR-031. Hook `profile-guard.js` giữ |
| `cli/cursor/rules/minipower-profile.mdc` | Lời nhắc trùng SAMPLE mục 0; file còn trỏ agent sắp xoá |
| `cli/opencode/rules/minipower-profile.md` | Cùng lời với rule Cursor |
| `src/router/agents/context-load.md` | “Tự nạp ngữ cảnh” là việc model làm khi `AGENTS.md` mục 2 đã chỉ file nào mở. Bảng 9 dòng là tập con của mục 2. Không hook đọc `context_chain` |
| `src/router/agents/approval-gate.md` | SAMPLE mục 6 đã liệt kê cổng DOC-03 → DOC-16 và giao thức DEC nháp, người ký. Không hook đọc `approval_gates` (ADR-020 QĐ-11: verdict không khoá máy) |
| `src/router/agents/project-state.md` | Hook đã chèn state/role từ `phase_meta`. File này chỉ là bảng in ra. SAMPLE mục 2 có bảng vai → file đọc thêm |
| `src/router/agents/auto-routing.md` | Bảng DOC → phase là render của `rules.json`; hook và LLM route không đọc file md. Đoạn “khi không có hook” lặp ADR-034. Path skill trong bảng đã gãy (P3) |
| Import Claude trong `TPL-agent-profile.md` (`@…/token-guard.md`, `auto-routing.md`, `profile-guard.md`) | Thân `CLAUDE.md` đã chứa các mục đó. Import kéo bản đã xoá |

**Sửa, không xoá:** `src/router/docs/token-guard.md` — bỏ lớp “agent rules” trùng; giữ mô tả hook.

**Giữ trong `src/router/agents/`:** `lark-work-assistant.md` (wiki / Base / Drive — chưa có lá; phần IM là nợ ADR-036, không xoá cả file ở ADR này) · `README.md` (sửa bảng cho khớp file còn lại).

## §6. Confirm

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…8 (xoá lời nhắc §5a, giữ hook, bỏ `context_chain` + `approval_gates`, sửa path lá trong auto-routing)? | |
| Q2 | Rule Cursor `minipower-token-guard.mdc` và `minipower-doc-editing.mdc` xoá hẳn (O2), không giữ một bản IDE song song với `AGENTS.md`? | |

## §7. Việc triển khai

| Bước | Việc | Done khi | Phụ thuộc |
|------|------|----------|-----------|
| 1 | Xoá file §5a; sửa README agent, TPL import, href skill/role/pipeline/docs | Không còn link tới file đã xoá (ngoài ADR/CHANGELOG) | Q1 |
| 2 | `gen-agents-doc.js` thôi ghi auto-routing / project-state / context-load / approval-gate | `gen:check` không đòi bốn file | Q1 |
| 3 | Xoá `context_chain`, `approval_gates` trong `rules.json`; sửa test schema | `npm test` xanh | Q1, QĐ-5 |
| 4 | `auto-routing.js` map ba phase còn lại sang lá § QĐ-6 | Test route không trỏ `skills/planning` | Q1 |
| 5 | Sửa `docs/token-guard.md`: còn hook, hết lớp agent md | Đọc một trang là đủ | Bước 1 |

## §8. Xác minh

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | Cài Cursor trên dự án có `AGENTS.md`: không còn rule token-guard / doc-editing / profile trong `.cursor/rules/` của fragment | Chỉ còn always-on (+ hook) | 🔴 |
| T2 | Regression | `npm test` + `gen:check` + `link:check` 0 gãy mới | xanh | 🔴 |
| T3 | Mới | Grep `agents/token-guard.md` `agents/doc-editing.md` `agents/context-load.md` `agents/approval-gate.md` `agents/project-state.md` `agents/auto-routing.md` ngoài `ADRs/` và CHANGELOG | 0 | 🔴 |
| T4 | Mới | `auto-routing` với DOC-14 / DOC-16 / DOC-17 / DOC-18 | path lá pm / qa / ops / analyst-cr, không path `skills/{phase}` | 🔴 |

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| Tốt | Hết nạp đôi. Lời nhắc dự án sửa ở SAMPLE / AGENTS.md. Cơ chế song song không có skill để mà gọi nhầm |
| Xấu / chi phí | Dự án đã init giữ `AGENTS.md` cũ cho đến khi người viết lại; rule IDE gỡ ở lần cài sau. Href trong ADR lịch sử còn tên file cũ |
| Trung lập | Hook và skill nghề không đổi vai. `phase_meta` vẫn trong `rules.json` |
| Không làm | Xoá hook · xoá deliberation/readiness/`*-review` · xoá `lark-work-assistant.md` cả file · mở lại `fan-out` |
