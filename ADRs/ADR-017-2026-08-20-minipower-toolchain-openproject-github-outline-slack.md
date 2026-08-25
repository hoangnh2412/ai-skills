# Minipower — 7 vai + toolchain OpenProject · Github · Outline · Slack (wrap MCP)

| | |
|---|---|
| **Ngày** | 2026-08-20 |
| **Trạng thái** | 🟣 **CANCEL** (2026-08-20, cùng ngày viết) — thay bởi [ADR-019](ADR-019-2026-08-20-minipower-harness-khong-gate.md): công cụ đổi **Github → Gitlab**, và định vị đổi từ *pipeline có cổng* sang *harness không gate*. **Kế thừa:** ánh xạ vai→công cụ (§1), phân loại L1/L2/L3, ranh giới §4. |
| **Phạm vi** | Định vị toàn `minipower/` — mở rộng phục vụ **7 vai** (PM · BA · SA · DEV · DevOps · QC · Operation) và chốt **bộ 4 công cụ** làm mặt tích hợp duy nhất. Chạm §0 (ranh giới side-effect) |
| **Nối tiếp** | [ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) §5.2 (wrap-not-build) · **thay** [ADR-009](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) (cancel) · **thay** [ADR-015](ADR-015-2026-07-29-minipower-phe-duyet-jira-lark-publish-outline.md) (cancel → [ADR-018](ADR-018-2026-08-20-minipower-phe-duyet-openproject-publish-outline.md)) |
| **Mục đích** | Chốt: Minipower phục vụ **mọi vai trong SDLC**, và **mọi tương tác ra hệ ngoài đi qua đúng 4 công cụ** — thay cho cụm Jira/Lark/Calendar/Zoom bàn rải rác ở các ADR trước |
| **Ảnh hưởng** | [AGENTS.md](../AGENTS.md) §0 (bổ sung mặt tích hợp) · [ADR-003](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) GĐ-C/D/E (đổi đích tích hợp) · [minipower/agents/lark-work-assistant.md](../minipower/agents/lark-work-assistant.md) (thành legacy — xem §3.3) · [minipower/SKILL.md](../minipower/SKILL.md) bảng trigger · `rules.json` (khai vai + công cụ, khi có ADR con) |

---

## §0. Quyết định

| # | Nội dung |
|---|---|
| **QĐ-1** | **Minipower phục vụ 7 vai:** PM · BA · SA · DEV · DevOps · QC · Operation. Không còn giới hạn ở cụm BA+SA+TPM |
| **QĐ-2** | **Toolchain duy nhất = OpenProject · Github · Outline · Slack.** Mọi tương tác/quản lý ra hệ ngoài đi qua đúng bốn công cụ này |
| **QĐ-3** | **Jira và Lark rời khỏi lộ trình.** Mọi hạng mục neo vào Jira/Lark bị bỏ hoặc viết lại theo QĐ-2 |
| **QĐ-4** | **Wireframe HTML bỏ khỏi minipower** — năng lực này chuyển sang skill **`jarvis-frontend`** (pack `jarvis/`). Minipower chỉ giữ DOC-19 làm *đặc tả* màn hình/luồng, không sinh HTML |
| **QĐ-5** | **Cơ chế tích hợp = wrap MCP**, không tự viết SDK/adapter trong repo — giữ nguyên [ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) §5.2 |

**Ranh giới §0 không đổi:** `AI = trợ lý ra quyết định · Con người = người quyết định cuối cùng`. **Đọc** hệ ngoài tự do; **ghi** ra hệ ngoài (tạo/sửa work package, push/merge, publish, gửi tin) **luôn dừng ở cổng người**.

---

## §1. Ánh xạ vai → công cụ → mức tác động

Mức L1/L2/L3 kế thừa từ ADR-009 §4 (phần còn giá trị của ADR đã cancel): **L1** soạn nháp/phân tích · **L2** nháp rồi người gửi · **L3** đọc/ghi hệ ngoài.

| Vai | Công việc chính (L1 — đã có hoặc mở rộng skill) | Mặt tích hợp (L2/L3) |
|-----|--------------------------------------------------|----------------------|
| **PM** | Kế hoạch, WBS, ước tính, báo cáo tiến độ/rủi ro, change request | **OpenProject** (work package, milestone) · **Slack** (báo cáo, nhắc) |
| **BA** | Biên bản → BR/FR/NFR/UC/AC → DOC-03/04/05/06/07/13/19 | **Outline** (publish bản đã duyệt) · **OpenProject** (cổng duyệt) |
| **SA** | SAD, ERD, API spec, integration spec (DOC-08/10/11/12) | **Outline** · **Github** (ADR/spec trong repo code) |
| **DEV** | Code + unit test theo AC, trace về FR | **Github** (branch/PR/review) · **OpenProject** (cập nhật trạng thái task) |
| **DevOps** | Deployment guide, pipeline, vận hành (DOC-17) | **Github** (Actions) · **Slack** (cảnh báo) |
| **QC** | Test strategy, test case per-FR, kết quả kiểm thử (DOC-16) | **Github** (test trong repo) · **OpenProject** (defect) |
| **Operation** | Incident, postmortem, runbook, theo dõi vận hành | **Slack** (kênh sự cố) · **OpenProject** (ticket) · **Outline** (runbook) |

**Nguyên tắc gán:** một công việc chỉ có **một công cụ chủ**. Không ghi cùng một dữ kiện vào hai nơi — chỗ còn lại chỉ **trỏ tham chiếu** (luật cross-repo bridge, [COORDINATION.md](../contracts/README.md) §4).

---

## §2. Vì sao bốn công cụ này thay được cụm cũ

| Nhu cầu | Trước (rải rác nhiều ADR) | Nay |
|---|---|---|
| Đơn vị công việc + phê duyệt | Jira *hoặc* Lark (chưa chốt — ADR-015 Q1) | **OpenProject** — một nơi, hết câu hỏi "ai làm gì" |
| Mã nguồn, review, CI | *(không ai sở hữu)* | **Github** |
| Bản đọc đã duyệt | Outline | **Outline** (giữ nguyên) |
| Thông báo, nhắc việc, kênh sự cố | Lark / Slack / mail | **Slack** |
| Lịch họp, transcript cuộc họp | Calendar/Zoom/Meet (ADR-009) | **Bỏ** — rủi ro riêng tư/pháp lý, không nằm trong 4 công cụ |

---

## §3. Tác động lên các ADR đang mở

### 3.1. Bị huỷ (🟣 Cancel)

| ADR | Vì sao huỷ | Cái gì được kế thừa |
|---|---|---|
| [ADR-009 Orchestrator analysis](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) | Câu hỏi chặn của nó đã được QĐ-1/2/5 trả lời: **Q2** = có, wrap MCP 4 công cụ · **Q3** = cả 7 vai · **Q6** (riêng tư transcript) = không còn vì bỏ Calendar/Zoom | Phân loại **L1/L2/L3** (§4) và ranh giới "không agent-tự-bàn-giao" (§8) → ADR này §1/§4 |
| [ADR-015 Phê duyệt Jira/Lark + Outline](ADR-015-2026-07-29-minipower-phe-duyet-jira-lark-publish-outline.md) | Toàn bộ neo vào Jira/Lark; **Q1 "Jira hay Lark"** mất nghĩa theo QĐ-3 | Mô hình **3 mặt phẳng** (authoring/approval/publish) → viết lại thành [ADR-018](ADR-018-2026-08-20-minipower-phe-duyet-openproject-publish-outline.md) |

### 3.2. Bị sửa phạm vi (vẫn sống)

| ADR | Thay đổi |
|---|---|
| [ADR-003 Gated Fan-out](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) | **GĐ-C:** phần HTML wireframe **bỏ** (QĐ-4) — DOC-19 chỉ còn đặc tả màn hình/luồng, đã có · **GĐ-D:** data model task đổi từ Lark sang **OpenProject work package**; blocker "chờ SOP Lark" → **chờ SOP OpenProject** · **GĐ-E:** "Lark MCP adapter" → **OpenProject + Github MCP**; "code+UT → update task" đi qua Github PR + OpenProject |
| [ADR-014 Spine wrap-not-build](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) | §5.2 thu danh sách công cụ còn **4** (bỏ Jira/Lark). Bảng borrow §4 **không đổi** |
| [ADR-013 Senior/Junior](ADR-013-2026-07-26-minipower-senior-junior-execution.md) | Không đổi bản chất; đích cập nhật task đổi sang **OpenProject**, code qua **Github**. Vẫn phụ thuộc ADR-014 |
| [ADR-008 Proposal Suite](ADR-008-2026-07-25-minipower-proposal-suite.md) | Không ảnh hưởng — làm được ngay, độc lập toolchain |
| [ADR-016 Discovery ingest](ADR-016-2026-08-02-minipower-discovery-tom-tat-tai-lieu-lon.md) | Không ảnh hưởng — thuần nội bộ |

### 3.3. Artifact thành legacy

[minipower/agents/lark-work-assistant.md](../minipower/agents/lark-work-assistant.md) (257 dòng, wrap `user-lark-mcp`, đang wire ở bảng trigger router) **mất căn cứ** theo QĐ-3. Chưa xoá — cần người quyết (§6 Q4). Trong lúc chờ, file vẫn chạy được và **không** vi phạm §0 (nó đã theo luật đọc-tự-do/ghi-qua-cổng).

---

## §4. Ranh giới an toàn (KHÔNG làm)

| ❌ | Vì sao |
|---|---|
| AI tự **ghi** ra OpenProject/Github/Outline/Slack không cổng người | L3 side-effect — trái §0. Đọc tự do, ghi qua gate |
| Tự viết SDK/adapter cho 4 công cụ trong repo | QĐ-5 — wrap MCP; nuôi fork là bẫy bảo trì ([ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) §7) |
| Thêm công cụ thứ 5 vào lộ trình (kể cả Jira/Lark quay lại) | QĐ-2 — mỗi mặt tích hợp mới nhân chi phí drift |
| Sinh HTML wireframe trong minipower | QĐ-4 — thuộc `jarvis-frontend` |
| Ghi âm/lấy transcript cuộc họp | Đã bỏ khỏi phạm vi (§2) — rủi ro riêng tư/pháp lý |
| Làm lại planning/requirements/architecture dưới tên "vai mới" | Trùng SSOT đã có — 7 vai dùng chung 6 phase/19 DOC |
| Bật cả 7 vai cùng lúc | §5 — trái "co lại trước khi mở rộng" |

---

## §5. Phản biện — hai rủi ro phải nói thẳng

**R1 — "7 vai cùng lúc" trái nguyên tắc co lại trước khi mở rộng.** [ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) Q1 khuyến nghị chọn **một vai wedge** để chứng minh ROI trước khi nhân bản. Mở đồng thời 7 vai × 4 công cụ = 28 mặt tích hợp tiềm năng, không đo được cái nào thật sự tiết kiệm giờ.
→ **Đề xuất:** QĐ-1 là *đích*, không phải *đợt đầu*. Thứ tự gợi ý: **BA/SA (đã có moat, chỉ thêm Outline publish) → PM (OpenProject) → DEV (Github) → QC → DevOps → Operation**. Chốt ở §6 Q1.

**R2 — `jarvis-frontend` chưa tồn tại.** Đã kiểm `jarvis/skills/`: có 15 skill, **không** có skill frontend nào. QĐ-4 vì vậy **chuyển năng lực sang một chỗ chưa có**, không phải sang chỗ đã sẵn sàng. Trong lúc `jarvis-frontend` chưa ra đời, DOC-19 dừng ở đặc tả — chấp nhận được (nó vốn đã ở trạng thái đó), nhưng đừng ghi trong tài liệu rằng wireframe "đã có đường đi".

---

## §6. Câu hỏi mở — cần người quyết trước ADR con

| # | Câu hỏi | Đề xuất mặc định |
|---|---|---|
| **Q1** | Thứ tự mở 7 vai — đồng loạt hay theo wedge? | **Theo wedge** (R1): BA/SA → PM → DEV → QC → DevOps → Operation |
| **Q2** | OpenProject: dùng **work package hierarchy** sẵn có hay định nghĩa Epic/Story/Task riêng? | Dùng hierarchy sẵn có, map `{MOD}-FR` vào custom field — không phát minh schema |
| **Q3** | Github: minipower **cùng repo** với code sản phẩm hay repo docs tách riêng? | Tách repo docs, nối bằng pin + back-reference ([COORDINATION.md](../contracts/README.md) §4) |
| **Q4** | [lark-work-assistant.md](../minipower/agents/lark-work-assistant.md): xoá, hay giữ như adapter ngoài lộ trình? | **Gỡ khỏi bảng trigger router**, giữ file làm tham chiếu cho tới khi có bản OpenProject/Slack tương đương |
| **Q5** | Slack: chỉ **thông báo một chiều**, hay nhận cả lệnh từ Slack? | Một chiều trước (thông báo + nhắc); nhận lệnh = bề mặt mới, để sau |
| **Q6** | MCP nào cho từng công cụ — server chính thức hay cộng đồng? Chiến lược suy giảm khi MCP chết? | Ưu tiên server chính thức; thiếu tool → báo thẳng + workaround thủ công, **không** giả lập đã ghi |

---

## §7. ADR con dự kiến (mở sau khi §6 chốt)

| ADR con | Nội dung |
|---|---|
| [ADR-018](ADR-018-2026-08-20-minipower-phe-duyet-openproject-publish-outline.md) | **Đã viết** — phê duyệt trên OpenProject + publish Outline (thay ADR-015) |
| `…-role-pack-topology` | Khai 7 vai + skill/công cụ của từng vai trong `rules.json`; golden test. Gộp luôn phần topology của ADR-013/ADR-014 B1 (tránh sửa schema ba lần) |
| `…-github-dev-loop` | Code + unit test → PR Github → cập nhật OpenProject; nối [ADR-013](ADR-013-2026-07-26-minipower-senior-junior-execution.md) |
| `…-slack-notify` | Báo cáo/nhắc việc một chiều qua Slack |
| `jarvis-frontend` (pack jarvis) | Skill sinh UI/wireframe — **ngoài repo minipower**, điều kiện của QĐ-4 |

---

## §8. Tham chiếu

- [ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) — wrap-not-build, bảng borrow, điều kiện siết 5.2
- [ADR-003](ADR-003-2026-07-20-minipower-gated-fanout-execution.md) — gated fan-out, lộ trình A→E bị sửa đích ở §3.2
- [ADR-009](ADR-009-2026-07-25-minipower-orchestrator-analysis.md) (cancel) — nguồn của phân loại L1/L2/L3
- [COORDINATION.md](../contracts/README.md) — handoff H1–H6, cross-repo bridge
- [minipower/docs/parallel-work.md](../minipower/docs/parallel-work.md) — một-owner-một-module khi fan-out
