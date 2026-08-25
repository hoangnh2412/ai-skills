# Minipower — Định vị "spine tổng hợp, wrap-not-build" (đối chiếu 4 công cụ SDLC)

| | |
|---|---|
| **Ngày** | 2026-07-28 |
| **Trạng thái** | 📋 **Phân tích — CHƯA quyết.** Kiểu `deliberation` (Premise Check → verdict → borrow plan). Người quyết đã khẳng định 3 định hướng (§5); còn câu hỏi §8 trước khi có ADR triển khai. |
| **Phạm vi** | Định vị toàn `minipower/` — đối chiếu Superpowers · OpenSpec · BMAD · SpecKit; chốt "học lại cái gì, wrap cái gì, không xây lại cái gì". **Chưa** chạm code. |
| **Nối tiếp** | [đánh giá 2026-07-17](ADR-001-2026-07-17-danh-gia-minipower-va-chien-luoc-phat-trien.md) (moat + "co lại trước khi mở rộng") · [định hướng 2026-07-20](ADR-002-2026-07-20-dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md) (AI Project Intelligence) · [gated-fanout](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) · [orchestrator-analysis](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) · [senior-junior](ADR-013-2026-07-26-minipower-senior-junior-execution.md) |
| **Mục đích** | Trả lời dứt điểm "Minipower có đang làm lại cái đã có không"; chốt định vị tổng hợp; lập **bảng borrow cụ thể** từ 4 công cụ, ánh xạ vào `rules.json`/skill/gate; đối chiếu-revise các ADR execution đang treo. |
| **Ảnh hưởng** *(nếu accepted)* | [AGENTS.md](../AGENTS.md) §0 (định vị "spine tổng hợp, wrap-not-build" bổ sung cho "AI Project Intelligence") · revise phần lộ trình của [gated-fanout §4](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) + [orchestrator §5/§9](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) + [senior-junior §3](ADR-013-2026-07-26-minipower-senior-junior-execution.md) cho khớp mô hình "giao code, trợ lý theo vai". |

---

## 📖 Bảng thuật ngữ (đọc trước)

Nhiều thuật ngữ trong ADR là tiếng Anh/ngành nghề. Bảng này giải thích ngắn gọn, xếp theo nhóm.

| Thuật ngữ | Nghĩa dễ hiểu |
|-----------|---------------|
| **verdict** | Kết luận/phán quyết cuối của một lượt phân tích — bắt buộc chọn 1 trong các nhãn cố định |
| **PROCEED / RESHAPE / STOP** | 3 nhãn verdict: **PROCEED** = đáng làm, đi tiếp · **RESHAPE** = vấn đề thật nhưng phát biểu/phạm vi sai, phải nắn lại · **STOP** = không đáng làm, dừng |
| **PROCEED-reshape** | Đi tiếp **nhưng** phải định hình lại cách làm (hướng đúng, cần nắn lại) |
| **premise check / premise-gate** | "Cổng 0": kiểm tra *việc này có đáng làm không* trước khi bỏ công |
| **readiness-gate** | Cổng kiểm *tiền đề đã đủ để bắt đầu thực thi chưa* |
| **deliberation** | Skill "nghị luận đa góc nhìn" trước khi cam kết — mỗi góc nói một lượt |
| **gate / cổng · go/no-go** | Điểm chặn cần con người duyệt mới đi tiếp · go = được đi, no-go = chưa |
| **HITL** (human-in-the-loop) | Có con người trong vòng quyết định (không để AI tự chạy hết) |
| **reinvent** (làm lại) | Tự xây lại thứ người khác đã làm tốt → tốn công vô ích |
| **moat** | "Hào nước" — lợi thế cạnh tranh khó sao chép |
| **spine** | "Xương sống" — lớp lõi kết nối mọi thứ lại |
| **engine** | "Cỗ máy" — phần thực thi nặng (vd: sinh code, chạy agent, tích hợp tool) |
| **wrap-not-build** | **Bọc/tận dụng** cái có sẵn thay vì **tự xây** từ đầu (wrap = bọc, build = xây) |
| **spec → code** | Từ đặc tả yêu cầu (spec) sinh ra code |
| **ROI** | Lợi ích thu về so với chi phí bỏ ra |
| **wedge** (vai wedge) | "Mũi nhọn" — chọn **một** vai làm trước để chứng minh giá trị rồi mới nhân ra |
| **hallucination** (ảo giác) | AI **bịa** thông tin sai một cách tự tin |
| **trace / traceability** (truy vết) | Lần được ngược: code ↔ yêu cầu ↔ quyết định |
| **trace spine** | Chuỗi truy vết chuẩn: UC (use case) → FR (yêu cầu chức năng) → AC (tiêu chí chấp nhận) → Test |
| **baseline** | Bản tài liệu đã ký/đóng băng làm mốc |
| **CR** (Change Request) | Yêu cầu thay đổi **sau khi** đã baseline |
| **spec-delta · ADDED/MODIFIED/REMOVED** | Cách ghi "thêm / sửa / bỏ" so với baseline để máy đọc + truy vết được |
| **constitution** | "Hiến pháp dự án" — bộ luật bất biến AI **phải** tuân ở mọi bước |
| **`[NEEDS CLARIFICATION]` marker** | Dấu AI **phải cắm** vào chỗ mơ hồ (thay vì đoán bừa) |
| **TDD · RED-GREEN-REFACTOR · test-first** | Viết test **trước** (đỏ = fail) → code cho pass (xanh) → dọn code; "test-first" = duyệt test trước khi code |
| **over-engineering / anti-abstraction** | Làm phức tạp quá mức cần / chống trừu-tượng-hoá sớm |
| **MCP** (Model Context Protocol) | Chuẩn kết nối AI với công cụ ngoài (Jira, Lark, Slack…) |
| **fork / upstream** | fork = bản sao tự sửa của dự án ngoài (phải tự bảo trì) · upstream = dự án gốc |
| **adapter** | Lớp bọc **mỏng** nối hai hệ với nhau |
| **L1 / L2 / L3 · side-effect** | Mức tác động ra ngoài: L1 = soạn nháp · L2 = nháp-rồi-người-gửi · L3 = ghi thẳng hệ ngoài · side-effect = tác động ra thế giới thật (gửi mail, tạo ticket) |
| **sharded / step-files** | Chẻ nhỏ skill thành từng bước rời (`step-XX`), chỉ nạp bước đang cần |
| **fresh-context · "lost in the middle"** | Nạp ngữ cảnh mới mỗi bước; "lost in the middle" = AI hay quên phần giữa của hội thoại dài |
| **role-agent** | "Agent" đóng vai (BA/PM/SA…) = gói skill + persona — **không** phải bot tự chạy |
| **story file / dispatch contract** | Gói giao việc **đủ thông tin** để làm độc lập một mình |
| **fan-out** | Toả việc ra làm **song song** nhiều nhánh cùng lúc |
| **one-owner-per-module** | Mỗi module một chủ sở hữu — không đè lên file của nhau |
| **SSOT** (Single Source of Truth) | Một **nguồn chân lý duy nhất** (ở đây: `rules.json`) |
| **CI / golden test** | CI = tự động chạy test mỗi lần đổi code · golden test = so kết quả với đáp án chuẩn đã chốt |
| **rules-as-data** | Để luật trong file **dữ liệu** (`rules.json`), không viết cứng trong code |
| **locale-swappable / i18n** | Đổi ngôn ngữ = thay **dữ liệu**, không viết lại code |
| **token / token-guard** | token = đơn vị chi phí AI · token-guard = hook kiểm soát chi phí/ngữ cảnh |
| **jarvis** | Framework code **riêng của repo** cho .NET/ReactJS — ép code theo base chung, người-đọc-được |
| **WBS · `[P]` marker** | WBS = bảng chẻ nhỏ công việc · `[P]` = dấu task chạy-song-song-được |

---

## §0. TL;DR — Verdict: **PROCEED-reshape**

- **Câu hỏi gốc:** "Minipower có đang làm lại (reinvent) Superpowers / OpenSpec / BMAD / SpecKit không?"
- **Trả lời:** **Ở lõi — không.** 4 công cụ đều là engine *spec → code*; Minipower là **spine kỷ luật** (trace UC→FR→AC→Test · premise-gate · baseline/CR · cổng người · code người-đọc-được qua jarvis) — thứ cả 4 chỉ làm *từng mảnh*, không cái nào **tổng hợp** dưới một trục trace + cổng người.
- **Nhưng CÓ rủi ro reinvent ở *cách làm*:** nếu tự xây codegen-engine / MCP-integration / agent-runtime từ đầu → làm lại đồ chợ, thua ở sân đối thủ mạnh. ADR 07-17 đã tự nhận Minipower "**yếu kỹ thuật**".
- **Reshape = định vị lại thành "spine tổng hợp, wrap-not-build":** *mượn cơ chế* hay nhất của 4 công cụ (§4), *wrap* engine có sẵn (jarvis cho code, MCP cho tool), **chỉ tự xây** phần không mua được: **kỷ luật trace + gate + constitution**.
- **Điều chỉnh so với ADR 07-28 lượt phân tích trước** (nội bộ): sau khi người quyết xác nhận **tiếng Việt KHÔNG phải moat** (§5.1) và **sản phẩm cuối là code** (§1), khuyến nghị cũ "sở hữu thượng nguồn, buông hạ nguồn" **bị loại** — hạ nguồn *là* đích, nhưng đạt bằng **wrap**, không **build**.

---

## §1. Bối cảnh — 3 khẳng định định hướng của người quyết (2026-07-28)

Người quyết (chủ repo) chốt bối cảnh, làm tiền đề cho mọi phân tích dưới:

1. **Sản phẩm cuối = code / sản phẩm chạy.** Tài liệu chỉ là **chất kết dính** để bàn giao + giúp con người đọc-hiểu trong lúc xử lý vấn đề. → Trả lời dứt điểm câu hỏi T1 (mô hình kinh doanh) của deliberation Sponsor/Finance.
2. **Minipower phục vụ nhiều vai như trợ lý cá nhân:** BA (chuẩn bị + tổng hợp biên bản) · SA (vẽ sơ đồ giải pháp) · PM (timeline, quản trị qua MCP Lark/Jira…) · DEV (code qua **jarvis**) · QC (lưu test case/scenario + chạy automation) · DevOps (vận hành, theo dõi, phân tích dashboard).
3. **Tiếng Việt không phải thế mạnh** — chỉ để chính người quyết đọc-hiểu; sẵn sàng dịch toàn bộ sang tiếng Anh khi mở rộng.

Hai khẳng định kỹ thuật kèm theo (§5): **connector = wrap MCP sẵn có** (không tự build); **jarvis = framework .NET/ReactJS** ép code AI theo base chung, người-đọc-được, trace được nguyên nhân khi sự cố — **không phụ thuộc hoàn toàn AI** (rủi ro hallucination, mất data khách).

---

## §2. So sánh khách quan — 4 công cụ vs Minipower

Đọc source/doc thật, không dừng ở README (nguồn §10).

| Trục | **Minipower** | Superpowers | OpenSpec | BMAD | SpecKit |
|------|---------------|-------------|----------|------|---------|
| **Điểm cuối** | **Code** (qua jarvis) + tài liệu kết dính | Code (TDD) | Code | Code (agile) | Code |
| **Đơn vị tổ chức** | Phase + role + gate, rules-as-data | Skills library | Change folder | **Role-agent + sharded Skill** | Spec + constitution |
| **Chống hallucination** | **premise-gate · readiness-gate · trace · jarvis** | TDD | scenario | Implementation-Readiness review | **Constitution + [NEEDS CLARIFICATION]** |
| **Trace chính thức** | **UC→FR→AC→Test + ma trận** | ✗ | scenario-level | nhẹ | constitutional gate |
| **Baseline / CR delta** | **có (02-baseline, CR)** | git branch | **ADDED/MODIFIED/REMOVED** | ✗ | ✗ |
| **Human gate** | **cổng người tại mỗi boundary** | autonomous + checkpoint | HITL | HITL mạnh | human-directed |
| **Tool integration** | **wrap MCP** (Jira/Lark/OpenProject/Outline/Slack) | ✗ | ✗ | ✗ | ✗ |
| **Codegen guardrail** | **jarvis (base chung, người-đọc-được, trace ID)** | subagent 2-tầng | tasks.md | per-story dev loop | template + test-first |
| **Kỷ luật kỹ thuật (SSOT/CI)** | **rules.json + golden test + CI** | ✗ CI (ADR 07-17 §3.4) | — | sharded micro-file | template-as-constraint |

**Đọc bảng:** không ô nào của Minipower là "trắng so với cả 4". Chỗ Minipower **một mình một cột** = *trace + baseline-delta + wrap-MCP + jarvis-guardrail + CI*. Chỗ Minipower **nên học lại** = *sharded role-agent (BMAD) · constitution + clarification-marker (SpecKit) · spec-delta (OpenSpec) · review 2-tầng + test-first (Superpowers)*.

---

## §3. Định vị chốt lại — "bộ não dự án có kỷ luật, wrap-not-build"

Minipower **không** là công cụ thứ 5 làm-lại. Nó là **spine tổng hợp**: mượn cơ chế tốt nhất của 4 công cụ, ràng buộc dưới một trục **trace + cổng người**, đẩy tới code qua **jarvis** và tới quản trị qua **MCP**.

```text
   Constitution (mượn SpecKit) ── luật bất biến cấp dự án + jarvis base + test-first + cấm huỷ-data
              │
   Role-agent sharded (mượn BMAD) ── thực thi theo vai, fresh-context mỗi bước/story
              │
   Trace spine + premise-gate (moat gốc Minipower) ── kháng thể hallucination
              │
   Spec-delta baseline/CR (mượn OpenSpec) ── "đổi gì so baseline", máy đọc + trace được
              │
   Test-first gate + review 2-tầng (mượn Superpowers) ── trước khi jarvis sinh code
              │
   ├─ code  → jarvis (.NET/React · người-đọc-được · mang ID trace ngược FR/AC)
   └─ tool  → wrap MCP (Jira/Lark/OpenProject/Outline/Slack) · GHI qua cổng người
```

**Ranh giới bất biến giữ nguyên từ ADR trước:** người là người quyết định cuối · không nền tảng thứ tư (wrap, không build) · co lại trước khi mở rộng · mọi thứ mới có SSOT + test/CI. **Định vị dài hạn không đổi:** *AI Project Intelligence* — model là engine (thay được), Knowledge + Memory + **kỷ luật trace** là tài sản model-agnostic.

---

## §4. Bảng borrow — cơ chế cụ thể, ánh xạ vào máy Minipower

Nguyên tắc: **mượn cơ chế, không mượn quy mô** (ADR 07-17: Superpowers ship skill 435 dòng, không CI, drift — lấy cái hay, tránh cái bệnh).

### 🥇 BMAD — mô hình role-agent

| ID | Cơ chế | Ánh xạ Minipower | Ưu tiên |
|----|--------|------------------|:---:|
| **B1** | **Sharded step-files**: Skill = `SKILL.md` entrypoint + `step-XX-name.md` + metadata; agent **chỉ nạp bước đang chạy** (chống "lost in the middle", giảm token) | Skill hiện monolithic → tách entrypoint + step rời; `rules.json` dispatch tới **step**, không chỉ phase. Cộng hưởng [token-guard](../minipower/docs/token-guard.md) | 🔴 Cao |
| **B2** | **Story file = gói handoff hoàn chỉnh, mỗi story chạy fresh-context** | Trùng khít **hợp đồng 7-trường** senior→junior ([senior-junior §3.1](ADR-013-2026-07-26-minipower-senior-junior-execution.md)) + one-owner-per-module ([parallel-work](../minipower/docs/parallel-work.md)). Ép fresh-context mỗi junior | 🔴 Cao |
| **B3** | **Handoff artifact-tên-rõ mỗi ranh giới** (Analyst→PM→Architect + **Implementation Readiness review**→Dev→Review) | = [COORDINATION.md](../contracts/README.md) H1–H6 + [readiness-gate](../minipower/skills/readiness-gate/SKILL.md). BMAD xác nhận gate-model đúng | 🟡 Đối chiếu |
| **B4** | **Scale-adaptive** depth theo cỡ dự án | Đã có [complexity-rubric](../minipower/skills/planning/complexity-rubric.md) + micro/light/full → nâng: tier quyết **step nào nạp** (nối B1) | 🟢 Nối B1 |

**KHÔNG lấy:** "Party mode" (persona tranh luận cùng lúc) — trái [deliberation](../minipower/skills/deliberation/SKILL.md) "mỗi góc một lượt". Không lấy vòng dev tự trị bỏ cổng người.

### 🥈 SpecKit — Constitution là viên ngọc

| ID | Cơ chế | Ánh xạ Minipower | Ưu tiên |
|----|--------|------------------|:---:|
| **S1** | **Constitution** (`memory/constitution.md`) — rulebook bất biến cấp dự án; article = go/no-go gate (test-first · chống over-engineering · integration-first) | Dự án đích **thiếu constitution**. Tạo `constitution.md` per-project mã hoá **luật jarvis + code người-đọc-được + test-first + cấm huỷ-data**; AI check tuân thủ tại mỗi gate. Chỗ triết lý jarvis **có răng** | 🔴 Cao |
| **S2** | **Marker `[NEEDS CLARIFICATION]`** ép AI đánh dấu mơ hồ thay vì bịa | Nâng `TBD`/open-questions rời rạc thành **marker hạng-nhất, đếm được, CHẶN baseline** khi còn sót. Nối readiness-gate "hỏi trọn gói" | 🔴 Cao |
| **S3** | **Gate nhúng template** (Simplicity / Anti-Abstraction / Integration-First) làm checkpoint | Nhét gate chống-over-engineering vào readiness-gate/[doc-review](../minipower/skills/doc-review/SKILL.md) | 🟡 Vừa |
| **S4** | **`[P]` đánh dấu task song-song-hoá-được** | Đánh dấu module/task fan-out-được trong WBS → [fan-out](../minipower/skills/fan-out/SKILL.md) biết cái gì chạy song song | 🟢 Nhỏ |

**KHÔNG lấy nguyên:** Article I "mọi feature là standalone library" — quá giáo điều cho .NET/React enterprise. Constitution phải **project-defined** (SpecKit cũng để slot tự định).

### 🥉 OpenSpec — change-as-folder + spec delta

| ID | Cơ chế | Ánh xạ Minipower | Ưu tiên |
|----|--------|------------------|:---:|
| **O1** | **Spec delta `## ADDED / MODIFIED / REMOVED Requirements`** so baseline | Formalize CR: delta trên FR/BR đã baseline → "đổi gì" **máy đọc + trace được**. Gắn `docs/06-changes/` + [change-control](../minipower/skills/change-control/SKILL.md) | 🔴 Cao |
| **O2** | **Change folder tự chứa** (`proposal + specs/ + design + tasks`) | `docs/06-changes/CR-xxx/` áp layout này → mỗi CR tự đủ | 🟡 Vừa |
| **O3** | **archive → merge ngược `specs/`** (một nguồn chân lý) | = baseline vX.Y sau CR duyệt; mượn kỷ luật archive-có-ngày | 🟢 Siết cơ học |

### Superpowers — lấy cơ chế, tránh bệnh (ADR 07-17 đã mổ)

| ID | Cơ chế | Ánh xạ Minipower | Ưu tiên |
|----|--------|------------------|:---:|
| **P1** | **Review 2-tầng tách bạch**: (a) khớp spec/AC → (b) chất lượng code | Sắc hoá QC senior→junior: pass1 "khớp hợp đồng/AC?", pass2 "code tốt?" | 🟡 Vừa |
| **P2** | **TDD RED-GREEN-REFACTOR** trước code | = governance test-case §3.2; ghép S1/Article-III: **"test đã duyệt & đang FAIL" = cổng cứng trước khi jarvis sinh code** | 🔴 Cao |
| **P3** | Task 2–5 phút + git isolation mỗi unit | Fan-out per-module + worktree isolation | 🟢 Nhỏ |

**KHÔNG lấy:** skill dài dòng · không-CI · invariant-giữ-bằng-kỷ-luật. Deliberation đã mạnh hơn premise-check 38-dòng của họ.

**Thứ tự borrow khuyến nghị** (đòn bẩy/chi phí): **S1 → B1 → S2 → O1 → P2 → B2**. Ba đầu rẻ, đổi chất ngay; ba sau gắn nhánh execution khi mở lại.

---

## §5. Ba khẳng định định hướng + điều kiện siết (phản biện đã thống nhất)

| # | Khẳng định người quyết | Điều kiện siết (bắt buộc kèm) |
|---|------------------------|-------------------------------|
| **5.1** | Tiếng Việt không phải moat; sẽ dịch EN sau | Moat dồn hết vào **kỷ luật trace + premise-gate + jarvis** — đúng chỗ 4 đối thủ yếu nhất. Thiết kế **keyword `rules.json` swappable theo locale (dữ liệu)** ngay, để dịch = thay data-pack, không viết lại |
| **5.2** | Wrap MCP sẵn có (Jira/Lark/OpenProject/Outline/Slack), chỉ sửa khi cần | **Adapter mỏng bọc ngoài / đóng góp upstream — KHÔNG nuôi fork.** Có **chiến lược suy giảm** khi MCP chết giữa chừng. Mọi **ghi** ra hệ ngoài = **L3 → cổng người** (đọc tự do, ghi qua gate) |
| **5.3** | jarvis = framework .NET/React ép code người-đọc-được, trace được, không tin AI mù | "Đọc được" phải **cưỡng chế bằng architecture-test/lint trong CI**, không quy ước. Code jarvis **mang ID trace ngược FR/AC**. Base **cấm thao tác huỷ-data không-reversible nếu chưa qua gate** (chống mất data khách) |

**Nhận định:** cả ba khẳng định **củng cố** định vị §3. jarvis (5.3) chính là **luận điểm lõi Minipower áp xuống tầng code** — moat thật, không đối thủ nào có (Superpowers/SpecKit nghiêng về tin-AI-nhiều-hơn).

---

## §6. Đối chiếu ADR execution đang treo — revise gì

| ADR | Hiện trạng | Revise theo định vị §3 |
|-----|-----------|------------------------|
| [gated-fanout](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) (paused) | Pivot §0 sang fan-out execution; 8 bước tới code+Lark; chờ SOP Lark | **Giữ** fan-out sinh DOC (B/C). Nhánh code (b7) = **wrap jarvis + review 2-tầng (P1/P2)**, không engine tự viết. Nhánh Lark (E) = **wrap MCP + cổng ghi (5.2)**, không adapter tự code |
| [orchestrator-analysis](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) (proposed) | RESHAPE; connector L3 = "nền tảng thứ tư", chờ Q1–Q6 | Q2 chốt: **connector = wrap MCP (5.2)**, không tự build → **hết** lo "nền tảng thứ tư". "Agent = role skill-pack" khớp **B1/B2 sharded** |
| [senior-junior](ADR-013-2026-07-26-minipower-senior-junior-execution.md) (proposed) | PROCEED-reshape; DEV code-gen, junior model-free, QC loop ≤3 | Hợp đồng 7-trường = **story file B2**; QC loop = **review 2-tầng P1** + test-first **P2**; codegen = **jarvis (5.3)**, không tự sinh thô. Giữ **cổng người nghiệm thu cuối** |

**Không** ADR nào bị abandon — chỉ **định hình lại engine từ "build" sang "wrap"**, và bổ sung các borrow §4.

---

## §7. Việc KHÔNG làm (ranh giới)

| ❌ | Vì sao |
|---|--------|
| Tự xây codegen-engine / agent-runtime (LangGraph/CrewAI) / MCP-integration từ đầu | Reinvent đồ chợ; đấu đối thủ ở sân họ; trái "không nền tảng thứ tư" |
| Nuôi fork MCP third-party | Bẫy bảo trì (drift upstream + vá bảo mật) — dùng adapter mỏng (5.2) |
| Auto-ghi Jira/Lark/Slack không cổng người | L3 side-effect — trái §0 + rủi ro thật (5.2) |
| jarvis "đọc được" chỉ bằng quy ước, không CI | ADR 07-17: "không test → drift" (5.3) |
| Bê nguyên Article I SpecKit / Party-mode BMAD / skill-dài-dòng Superpowers | Giáo điều / trái deliberation / trái token-discipline (§4) |
| Làm lại planning/requirements/architecture dưới tên "agent/borrow mới" | Trùng SSOT đã có |

---

## §8. Câu hỏi mở — cần trao đổi tiếp (khối chặn ADR triển khai)

| # | Câu hỏi | Vì sao quan trọng |
|---|---------|-------------------|
| **Q1** | Vai **wedge** đợt đầu để chứng minh ROI? (gợi ý: PM-timeline+Lark, hoặc BA-biên bản→BR/FR, hoặc DEV-jarvis) | Chống ôm đồm 6 vai; đo giờ tiết kiệm thật trước khi nhân bản |
| **Q2** | Borrow trước cái nào? Xác nhận thứ tự **S1→B1→S2→O1→P2→B2** hay đổi | Ba cái đầu (constitution/sharded/marker) rẻ + đổi chất ngay, độc lập nhánh execution |
| **Q3** | `constitution.md` (S1): **một mẫu chung** hay **mỗi dự án tự định** article IV+? | Định hình cưỡng chế jarvis; tránh giáo điều |
| **Q4** | Sharded step-files (B1): refactor **skill nào trước**? (requirements lớn nhất?) | Đổi cấu trúc skill — cần chọn điểm bắt đầu ít rủi ro |
| **Q5** | Locale-swappable `rules.json` (5.1): làm **ngay** hay khi thật sự dịch EN? | Rẻ nếu làm sớm; đắt nếu retrofit sau |
| **Q6** | jarvis: repo `jarvis/` hiện có nối trace-ID FR/AC + architecture-test CI chưa, hay cần thiết kế mới? | Điều kiện 5.3 có thật thi được không |

---

## §9. ADR con dự kiến (mở sau khi §8 chốt)

| ADR con | Nội dung |
|---------|----------|
| `…-constitution-per-project` | Mẫu `constitution.md` + gate check tuân thủ (S1/S3); mã hoá luật jarvis + test-first + cấm huỷ-data |
| `…-sharded-skills` | Tách SKILL.md → entrypoint + step-XX (B1); dispatch step trong `rules.json`; golden test |
| `…-clarification-marker` | Marker `[CẦN LÀM RÕ]` hạng-nhất, đếm được, chặn baseline (S2) |
| `…-cr-spec-delta` | CR = ADDED/MODIFIED/REMOVED trên baseline (O1) + change-folder tự chứa (O2) |
| `…-jarvis-trace-guardrail` | jarvis mang ID trace + architecture-test CI + cấm huỷ-data (5.3) |

---

## §10. Tham chiếu

- ADR nội bộ: [đánh giá 2026-07-17](ADR-001-2026-07-17-danh-gia-minipower-va-chien-luoc-phat-trien.md) · [định hướng 2026-07-20](ADR-002-2026-07-20-dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md) · [gated-fanout](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) · [orchestrator](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) · [senior-junior](ADR-013-2026-07-26-minipower-senior-junior-execution.md)
- Máy Minipower: [rules.json](../minipower/hooks/lib/rules.json) · [deliberation](../minipower/skills/deliberation/SKILL.md) · [readiness-gate](../minipower/skills/readiness-gate/SKILL.md) · [doc-review](../minipower/skills/doc-review/SKILL.md) · [fan-out](../minipower/skills/fan-out/SKILL.md) · [token-guard](../minipower/docs/token-guard.md) · [parallel-work](../minipower/docs/parallel-work.md) · [COORDINATION.md](../contracts/README.md)
- Nghiên cứu ngoài (đọc source/doc, không dừng README):
  - BMAD — [Workflow Architecture (DeepWiki)](https://deepwiki.com/bmad-code-org/BMAD-METHOD/8.1-workflow-architecture) · [repo](https://github.com/bmad-code-org/BMAD-METHOD): sharded Skill (SKILL.md + step-XX), role-agent handoff, per-story fresh-context
  - SpecKit — [spec-driven.md](https://github.com/github/spec-kit/blob/main/spec-driven.md): constitution 9-article, `/specify`·`/plan`·`/tasks`, `[NEEDS CLARIFICATION]`, template-as-constraint
  - OpenSpec — [repo](https://github.com/Fission-AI/OpenSpec): change folder (proposal/specs/design/tasks), spec delta ADDED/MODIFIED/REMOVED, propose→apply→archive
  - Superpowers — [repo](https://github.com/obra/superpowers): review 2-tầng, TDD RED-GREEN-REFACTOR, bite-sized task + git isolation
