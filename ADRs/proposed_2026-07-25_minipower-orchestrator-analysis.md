# Phân tích: Minipower thành "Orchestrator" điều phối các agent chuyên trách

| | |
|---|---|
| **Ngày** | 2026-07-25 |
| **Trạng thái** | 📋 **Phân tích — CHƯA quyết.** Kiểu `deliberation` (Premise Check → verdict). Cần người chốt §9 trước khi có bất kỳ ADR triển khai nào. |
| **Phạm vi** | Định hướng toàn `minipower/` — chạm §0 (triết lý bất biến). **Chưa** chạm code. |
| **Nối tiếp** | [ADR 2026-07-20 định hướng §0/§3.3](superseded_2026-07-20_dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md) · [gated-fanout](paused_2026-07-20_minipower-gated-fanout-execution.md) · [proposal-suite](proposed_2026-07-25_minipower-proposal-suite.md) |
| **Mục đích** | Phản biện ý tưởng "Minipower = orchestrator điều phối các domain agent (Meeting/PM/BA/SA/Sale/QC/DEV…)", gợi ý thuật ngữ thị trường, và xác định: **có đáng làm không / làm ở hình dạng nào**. |

---

## §0. TL;DR — Verdict: **RESHAPE (định hình lại)**

- Ý tưởng có lõi đúng và tự nhiên: Minipower **đã là** một orchestrator nhẹ (auto-routing intent→phase, roles = lăng kính, fan-out song song). Việc "gom skill theo vai trò" chỉ là **tổ chức lại topology** — **tương thích** §0.
- Nhưng danh sách skill user liệt kê trộn lẫn **hai trục khác bản chất**:
  - **Trục A — Topology** (agent = gói skill theo vai trò): ✅ hợp §0, là bước tiến hợp lý.
  - **Trục B — Tự trị & tác động ra ngoài** (book Calendar, join Zoom lấy transcript, tạo ticket Jira, gửi biên bản/email tự động): ⚠️ **đây mới là chỗ va §0**. §0 cấm "đội agent tự chạy / tự bàn giao", và các hành động này đúng là loại **side-effect ra thế giới thật** mà con người phải là người bấm nút.
- **Không loại bỏ ý tưởng, cũng không nuốt trọn.** Đề xuất: giữ **orchestrator có người gác cổng** (human-in-the-loop) — agent = **role skill-pack**, mọi hành động ra ngoài đều **dừng ở một gate con người xác nhận**, **không** agent-tự-bàn-giao-agent. Con người vẫn điều phối qua **ID ổn định + memory** như hiện tại.
- **Chưa quyết** ba việc lớn (§9): (1) tên gọi chính thức, (2) có mở "nền tảng connector thứ tư" không, (3) phạm vi đợt đầu.

---

## §1. Ý tưởng như user mô tả (tóm tắt trung thực)

> Minipower nhận yêu cầu → xác định cần **agent chuyên trách** nào → gọi agent đó; mỗi agent sở hữu một **bộ skill đặc thù**.

| Agent | Skill user liệt kê |
|-------|--------------------|
| **Meeting** | Book lịch họp + thông báo các bên · chuẩn bị nội dung theo template + hỏi thông tin điền form · nghe họp (kết nối Google Meet/Teams/Zoom lấy transcript) · tổng kết + next action + gửi biên bản |
| **PM** | Tiếp nhận yêu cầu → tạo ticket Jira/Lark/OpenProject · theo dõi tiến độ + nhắc việc · báo cáo ngày (vấn đề/rủi ro) · báo cáo tuần/tháng · quản lý change request · kế hoạch tổng thể · kế hoạch chi tiết · dự toán chi phí |
| **BA** | Meeting note → phân tích BR/FR/NFR/UC/AC → BRD · viết FRD · vẽ wireframe (HTML/CSS/JS) |
| **SA** | Viết SAD · SRS · ERD · API spec |
| **Sale** | Slide giới thiệu giải pháp (từ SAD/BRD) · proposal |
| *(khác)* | QC, DEV, … |

---

## §2. Thuật ngữ thị trường (trả lời câu "tên khác là gì")

Cái user mô tả — *một điều phối viên trung tâm chọn và gọi các chuyên gia con* — có nhiều tên tuỳ trường phái:

| Thuật ngữ | Nguồn / phái | Ý nghĩa | Hợp §0? |
|-----------|--------------|---------|---------|
| **Orchestrator-workers** | Anthropic, *Building Effective Agents* | LLM trung tâm chia nhỏ task, giao worker, tổng hợp lại | ✅ (nếu người gác cổng) |
| **Manager pattern** (agents-as-tools) | OpenAI, *A Practical Guide to Building Agents* | Agent quản lý gọi các agent chuyên như "công cụ", giữ quyền điều phối | ✅ |
| **Supervisor / Hierarchical teams** | LangGraph | Một supervisor route sang các agent con; có thể phân tầng | ✅ |
| **Router** | Anthropic (pattern đơn giản) | Phân loại input → route sang nhánh chuyên biệt | ✅ (Minipower **đã có**) |
| **Handoffs / Decentralized / Swarm** | OpenAI Swarm, Agents SDK | Agent **tự bàn giao** cho agent khác, phi tập trung | ❌ **trái §0** |
| **Crew** (role-based) | CrewAI | Nhóm agent theo vai trò cùng chạy một "crew" | ⚠️ tuỳ mức tự trị |
| **Multi-agent system / Agentic orchestration / Agent mesh** | chung ngành | Ô dù cho mọi kiểu trên | — |

**Gợi ý tên nên dùng:** *"**Supervisor/Orchestrator điều phối các specialist (role skill-pack), human-in-the-loop**"* — gần nhất với **orchestrator-workers** (Anthropic) + **manager pattern** (OpenAI). **Tránh** nhánh **handoff/swarm/decentralized** vì đó chính là "agent tự bàn giao agent" mà §0 cấm. Nói ngắn gọn đối ngoại: **"agent-assisted orchestration"** / **"co-pilot orchestration"**, **không** phải "autonomous multi-agent".

> Lưu ý định vị: ADR định hướng (§28) đã chốt Minipower = *AI Project Intelligence*. "Orchestrator" nên là **cách tổ chức bên trong**, không phải tái định vị sản phẩm thành "một multi-agent platform".

---

## §3. Va chạm triết lý §0 — tách bạch hai trục

| Trục | Câu hỏi | Kết luận |
|------|---------|----------|
| **A. Topology** | Gom skill rời thành "domain agent" theo vai trò có trái §0 không? | **Không.** Đây chỉ là lớp tổ chức/dispatch. Minipower đã có `roles/` (7 lăng kính) + router. "Agent" ở đây = **role skill-pack có persona**, không phải thực thể tự trị. |
| **B. Tự trị & side-effect** | Để agent **tự thực hiện hành động ra ngoài** (book, gọi Zoom, tạo ticket, gửi mail) và **tự bàn giao** cho agent kế có trái §0 không? | **Có.** §0 dòng 14/26 + §3.3 + §5 ("Agent tự thực hiện / bàn giao tự động → trái triết lý"). Đây là lằn ranh. |

**Chốt phân tích:** ý tưởng **không** vi phạm ở chỗ "có nhiều agent", mà ở chỗ **mức tự trị của từng skill**. Vì vậy phần giá trị nhất của ADR này là **phân loại từng skill theo mức tác động** (§4), rồi quyết mỗi loại đi qua cơ chế nào.

---

## §4. Phân loại skill theo mức tác động *(phần cốt lõi)*

Ba mức, tăng dần độ "chạm thế giới thật":

- **L1 — Trợ lý thuần (soạn nháp/phân tích):** sinh artifact văn bản, không chạm hệ ngoài. Hợp §0 **ngay**, chỉ là thêm skill.
- **L2 — Nháp-rồi-người-gửi:** AI soạn xong (biên bản, email, ticket, báo cáo) nhưng **con người bấm gửi/tạo**. Cần **gate xác nhận**, **không** auto.
- **L3 — Kết nối hệ ngoài (connector):** đọc/ghi Calendar, Zoom/Teams/Meet, Jira/Lark/OpenProject, mail. Cần **nền tảng tích hợp mới** (§7) + gate. Ghi = luôn L3+gate; đọc = cân nhắc riêng.

| Agent | Skill | Mức | Ghi chú |
|-------|-------|-----|---------|
| Meeting | Chuẩn bị nội dung theo template + hỏi điền form | **L1** | Đúng chất Minipower (readiness-gate hỏi trọn gói) |
| Meeting | Tổng kết họp + next action (soạn biên bản) | **L1** | Distill; giống doc-review/decision-log |
| Meeting | Book lịch + thông báo các bên | **L3** | Ghi Calendar + gửi thông báo → connector + gate |
| Meeting | Nghe họp: lấy transcript Meet/Teams/Zoom | **L3** | Connector + **quyền riêng tư/ghi âm** (rủi ro pháp lý) |
| Meeting | Gửi biên bản cho các bên | **L2/L3** | Soạn = L1; gửi = gate |
| PM | Kế hoạch tổng thể / chi tiết · dự toán chi phí | **L1** | Đã có `planning` + `proposal-*` — **trùng lặp, đừng làm lại** |
| PM | Báo cáo ngày/tuần/tháng, vấn đề/rủi ro (soạn) | **L1** | Distill từ memory/decision-log |
| PM | Quản lý change request | **L1** | Đã có `change-control` (luôn Full) |
| PM | Tạo ticket Jira/Lark/OpenProject | **L3** | Ghi hệ ngoài → connector + gate |
| PM | Theo dõi tiến độ + nhắc việc trước hạn | **L3** | Cần trigger theo thời gian (scheduler) + đọc hệ ngoài |
| BA | Meeting note → BR/FR/NFR/UC/AC → BRD · FRD | **L1** | **Đúng lõi hiện có** (`requirements`, roles/BA) |
| BA | Wireframe HTML/CSS/JS | **L1** | Sinh artifact; hợp |
| SA | SAD · SRS · ERD · API spec | **L1** | **Đúng lõi hiện có** (`architecture`, roles/SA) |
| Sale | Slide từ SAD/BRD · proposal | **L1** | Đã có `proposal-*` (2026-07-25) — **mở rộng, đừng tạo mới** |

**Nhận xét lớn:** phần lớn skill user muốn là **L1 và đã tồn tại** trong Minipower dưới dạng phase/skill/role (requirements, architecture, planning, change-control, proposal-*). Cái *mới thật sự* chỉ là **cụm L3 — connector** (Calendar, họp, ticket, mail) + **scheduler** (nhắc việc). Đây mới là quyết định nặng ký, không phải "tạo 6 agent".

---

## §5. Ba phương án

| PA | Mô tả | Ưu | Nhược | Verdict |
|----|-------|-----|-------|---------|
| **A. Autonomous multi-agent** | Agent tự chạy, tự bàn giao, tự book/gửi/tạo ticket | Đúng "mơ ước" tự động hoá | **Trái §0 trực diện**; rủi ro pháp lý (ghi âm họp, gửi nhầm KH); mất trace người-quyết; drift không kiểm soát | ❌ **Loại** |
| **B. Orchestrator có người gác cổng** *(reshape)* | Supervisor route → role skill-pack; L1 chạy tự do; **L2/L3 luôn dừng ở gate người xác nhận**; không agent-tự-bàn-giao | Giữ §0; tận dụng router+roles+fan-out sẵn có; connector là tuỳ chọn thêm dần | Cần chuẩn hoá "agent = skill-pack"; connector là nền tảng mới cần cân nhắc (§7) | ✅ **Đề xuất** |
| **C. Giữ flat skills, chỉ thêm vài skill L1** | Không gọi là "agent"; thêm `meeting-notes`, `status-report`… như skill phẳng | Rẻ nhất, zero rủi ro | Không đáp ứng mong muốn "gom theo vai trò"; không có connector | 🟡 **Fallback** nếu chưa muốn đụng connector |

> B và C **không loại nhau**: có thể làm C trước (mấy skill L1 còn thiếu), rồi B khi quyết mở connector. A bị loại trong mọi trường hợp.

---

## §6. Nếu chọn B — hình dạng đề xuất (chưa implement)

```text
             Yêu cầu người dùng
                    │
        ┌───────────▼───────────┐
        │  Supervisor / Router   │  ← đã có: auto-routing intent→phase (rules.json)
        │  chọn role skill-pack  │
        └───────────┬───────────┘
      ┌─────────────┼─────────────┐
   [BA pack]     [PM pack]     [Meeting pack] …   ← agent = gói skill + persona (role hiện có)
      │L1            │L1            │L1
      ▼              ▼              ▼
   artifact       artifact       biên bản (nháp)
      │              │              │
      └──────────────┴──────────────┘
                    │ L2/L3?
          ┌─────────▼──────────┐
          │  GATE con người     │  ← xác nhận trước MỌI hành động ra ngoài
          │  (send/book/create) │     (khớp luôn action-category của harness)
          └─────────┬──────────┘
                    ▼
        connector (Calendar/Zoom/Jira/mail) — tuỳ chọn, §7
```

Nguyên tắc bất biến khi reshape:
1. **Agent = role skill-pack**, không phải thực thể tự trị. Tái dùng `roles/` + `rules.json`, **không** thêm runtime agent framework.
2. **Không agent-tự-bàn-giao-agent.** Con người điều phối giữa các pack qua **ID ổn định** (`{MOD}-FR-`, `DEC-{PHASE}-`, `ADR-`) + memory theo chủ đề — y như [parallel-work](../minipower/docs/parallel-work.md) đang làm.
3. **Mọi L2/L3 dừng ở gate.** Không có auto-send/auto-book/auto-create. Gate này khớp sẵn với **action-category** của harness (send/publish/purchase/settings = cần phép).
4. **Rules-as-data.** "Agent nào có skill nào", trigger, prereq → khai trong `rules.json`, sinh bảng qua `npm run gen`. Không hard-code.

---

## §7. Cảnh báo "nền tảng thứ tư" — connector

CLAUDE.md + ADR định hướng §4: **"co lại trước khi mở rộng; không thêm nền tảng thứ tư; mọi thứ mới phải có SSOT + test/CI, không dựa vào kỷ luật con người."**

Cụm **connector L3** (Calendar, Zoom/Teams/Meet, Jira/Lark/OpenProject, mail, scheduler) **chính là một nền tảng mới**: cần auth, cần secret, cần xử lý lỗi mạng, cần quyền riêng tư (ghi âm cuộc họp!), cần rate-limit. Đây là cam kết vận hành lớn, **khác hẳn** bản chất "Markdown skill + hook Node không dependency" hiện tại.

→ **Đề xuất:** tách connector thành **quyết định riêng, không gộp vào ADR này**. Nếu muốn, ưu tiên **MCP/connector chuẩn** (đọc trước, ghi sau; ghi luôn qua gate) thay vì tự viết tích hợp. **Chưa** cam kết cho tới khi trả lời Q2 (§9).

---

## §8. Việc KHÔNG làm (bất kể chọn gì)

| ❌ | Vì sao |
|---|--------|
| Agent tự bàn giao agent (swarm/handoff) | Trái §0 · §3.3 |
| Auto-book lịch / auto-gửi biên bản / auto-tạo ticket / auto-gửi mail | L3 không gate = trái §0 + rủi ro thật |
| Tự ghi âm/lấy transcript cuộc họp không có xác nhận các bên | Rủi ro pháp lý/riêng tư |
| Làm lại planning / proposal / requirements / architecture dưới tên "agent mới" | Trùng lặp; phá SSOT (§4 đã có) |
| Thêm runtime agent framework (LangGraph/CrewAI…) vào repo | Trái "không nền tảng thứ tư"; Minipower là bộ skill markdown |
| Tái định vị sản phẩm thành "multi-agent platform" | Giữ định vị *AI Project Intelligence* (§2) |

---

## §9. Câu hỏi mở — **cần người quyết** (khối chặn)

| # | Câu hỏi | Vì sao quan trọng |
|---|---------|-------------------|
| **Q1** | Chốt **tên gọi**: "orchestrator-workers" / "supervisor" / "manager pattern" / tên riêng? | Ảnh hưởng cách mô tả & README |
| **Q2** | **Có mở cụm connector L3 không** (Calendar/họp/ticket/mail)? Nếu có, qua **MCP** hay tự viết? | Đây là "nền tảng thứ tư" — quyết định nặng nhất (§7) |
| **Q3** | Phạm vi **đợt đầu**: chỉ L1 (PA C) hay cả B? Agent nào trước? | Chống ôm đồm |
| **Q4** | "Agent" là **cách gom rules.json** hay có **persona/prompt riêng**? | Định hình topology (§6.1) |
| **Q5** | Mức tự trị tối đa chấp nhận cho L2 (vd: soạn xong tự lưu nháp Jira "chờ duyệt")? | Vẽ chính xác lằn ranh gate |
| **Q6** | Rủi ro riêng tư khi lấy transcript họp — chính sách xác nhận các bên? | Chặn rủi ro pháp lý sớm |

---

## §10. Nếu verdict = PROCEED-reshape → ADR con nên tách

*(chỉ liệt kê, chưa mở — mở sau khi §9 được chốt)*

| ADR con dự kiến | Nội dung |
|-----------------|----------|
| `…-agent-topology` | Chuẩn "agent = role skill-pack" trong rules.json; supervisor route |
| `…-connector-platform` | Quyết định §7 (nếu Q2 = có): MCP, auth, gate ghi, riêng tư |
| `…-meeting-pack` / `…-pm-pack` … | Từng pack: skill L1 mới + điểm nối connector (nếu có) |

---

## §11. Tham chiếu

- [ADR 2026-07-20 định hướng §0/§3.3/§5](superseded_2026-07-20_dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md) — triết lý bất biến, roles = lăng kính
- [ADR gated-fanout](paused_2026-07-20_minipower-gated-fanout-execution.md) · [proposal-suite](proposed_2026-07-25_minipower-proposal-suite.md) — precedent ADR gộp cha/con
- [`minipower/docs/parallel-work.md`](../minipower/docs/parallel-work.md) — fan-out qua ID, con người điều phối
- [`minipower/roles/`](../minipower/roles/) — 7 lăng kính vai trò (nền cho "role skill-pack")
- Anthropic *Building Effective Agents* (orchestrator-workers, routing) · OpenAI *A Practical Guide to Building Agents* (manager vs decentralized) — thuật ngữ §2
