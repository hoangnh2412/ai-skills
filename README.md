# Minipower

**Minipower** là **AI Operating Model** của doanh nghiệp — mô hình vận hành viết thành dạng AI thi hành được: chứa **kỹ năng của từng vị trí** và **quy trình của từng phòng ban — kể cả quy trình liên phòng ban**, dưới dạng AI thi hành được; tích hợp với bộ công cụ công ty đang dùng (quản lý việc, wiki, Git, giám sát) để doanh nghiệp **vận hành theo quy trình phát triển phần mềm thống nhất** — từ dự án làm nhanh để demo (`mvp`), làm chuẩn để bàn giao (`standard`), tới tiếp quản hệ đang chạy (`maintain`).

Cách làm dựa trên ba nguyên tắc:

1. **Đặt AI vào quy trình có kỷ luật — con người cầm lái.** AI làm phần chuẩn bị: phỏng vấn khách, soạn tài liệu, phản biện, phân tích trade-off; **con người là người quyết ở từng chặng**. Thiếu thông tin thì ghi `TBD`, không bịa. Mọi sản phẩm — từ yêu cầu tới test — nối nhau bằng ID truy vết được (UC → FR → AC → Test): đổi một yêu cầu là thấy ngay nó chạm tài liệu nào, code nào, test nào.
2. **Đóng gói kinh nghiệm thành skill dùng lại được.** Kinh nghiệm dẫn dự án (BA/SA/PM) và kinh nghiệm dựng code (.NET) không nằm trong đầu ai nữa — nằm trong các module skill, cài thẳng vào công cụ AI đang dùng (Cursor, Claude, OpenCode). Ai cần gì cài phần đó; gõ "minipower" trong ô search là thấy toàn bộ đồ nghề.
3. **Giữ cách làm, không giữ dữ liệu.** minipower chứa quy trình, template và quy tắc truy vết — tức *cách làm việc*; còn tài liệu nghiệp vụ, code và task của từng dự án vẫn nằm ở hệ thống chuyên trách của chúng (wiki, Git, công cụ quản lý việc). minipower không phải kho lưu trữ.

**License:** [MIT](LICENSE) · Copyright (c) 2026 Hoàng Nguyễn

---

## Minipower có gì?

**Module nghề** + **module kênh** (ADR-033: SOP MCP, không luật UC/FR) + **tầng nền** + **kho tạm**. Pack cài được nằm dưới `src/`; code cài đặt nằm `cli/` (không chứa `hooks/` — hook ở `src/sdlc/hooks/`). Hướng dẫn cài nằm trong từng module.

| Thành phần | Loại | Giải quyết việc gì | Bắt đầu |
|------------|------|--------------------|---------|
| **Quy trình (kho neo)** — [`sdlc/`](src/sdlc/) | Kho chuyển | Hook, skeleton, template 19 DOC, plugin path — đăng ký dispatcher `minipower-router` | [sdlc/README.md](src/sdlc/README.md) · [sdlc/INSTALL.md](src/sdlc/INSTALL.md) |
| **Code backend .NET** — [`backend/`](src/backend/) | Module nghề | Dựng backend .NET theo framework Jarvis chuẩn công ty: scaffold chạy được ngay, gắn auth / cache / EF / observability theo nhu cầu, review PR trước khi merge — 15 skill `minipower-backend-*` | [backend/README.md](src/backend/README.md) · cài: [§ Cài vào Cursor](src/backend/README.md#cài-vào-cursor) |
| **Vận hành hạ tầng** — [`ops/`](src/ops/) | Module nghề | Kỹ năng DevOps/SRE: thu thập metrics Grafana/Prometheus chuẩn hoá cho AI chẩn đoán sự cố; sẽ mở rộng dần sang chẩn đoán theo case (memory leak, deadlock, log flow), cài server, CI/CD — skill `minipower-ops-*` (ADR-023) | [ops/README.md](src/ops/README.md) |
| **Dispatcher** — [`router/`](src/router/) | Dispatcher | Gợi ý đúng một pack; init `project_mode` + provider (`minipower-router`) | [router/README.md](src/router/README.md) |
| **Presales** — [`presales/`](src/presales/) | Module nghề | ULNL + quotation trước ký — không sở hữu khảo sát | [presales/README.md](src/presales/README.md) |
| **Công cụ làm ra Minipower** — [`toolbox/`](src/toolbox/) | Module nghề | Viết/soát skill, mở module — `minipower-toolbox-*`. Không cài workspace khách | [toolbox/README.md](src/toolbox/README.md) |
| **Tài liệu (Outline)** — [`docs/`](src/docs/) | Module kênh | SOP MCP mặt `docs`: tra / publish / migrate Outline (`minipower-docs-outline`) | [docs/README.md](src/docs/README.md) |
| **Việc (Lark Tasks)** — [`tasks/`](src/tasks/) | Module kênh | SOP MCP mặt `tasks` (`minipower-tasks-lark`); `none` thì `memory/tasks/` trên dự án đích | [tasks/README.md](src/tasks/README.md) |
| **Chat (Lark IM)** — [`chat/`](src/chat/) | Module kênh | SOP MCP mặt `chat` (`minipower-chat-lark`) — tách khỏi task | [chat/README.md](src/chat/README.md) |
| **Mã nguồn (GitLab)** — [`vcs/`](src/vcs/) | Module kênh | SOP MCP/git mặt `code` (`minipower-vcs-gitlab`) | [vcs/README.md](src/vcs/README.md) |
| [`contracts/`](contracts/) | Tầng nền | Luật chơi chung giữa các module và giữa repo tài liệu ↔ repo code: trace spine, điểm bàn giao H1–H6, quy ước chung, schema `PACK.md` | [contracts/README.md](contracts/README.md) |
| [`staging/`](staging/) | Kho tạm | Kiến thức nền .NET / DDD / testing, bộ phỏng vấn kỹ thuật — **nội dung cũ viết tạm, đang rút dần thành skill/template**; dùng bằng cách `@` thẳng file trong workspace, không cần cài. *(Kho chứa tài liệu chờ chuẩn hoá — không liên quan tới "môi trường staging" của việc triển khai.)* | [staging/](staging/) |

---

## Ba chế độ dự án

Không dự án nào cũng cần đủ 19 tài liệu. Quy trình phát triển (`sdlc`) có **`project_mode`**, chọn khi khởi tạo, quyết định *tài liệu nào cần điền* và *cảnh báo nào bật* — nhưng **dùng chung một cấu trúc thư mục**, nên đổi chế độ về sau không phải di trú gì.

| Chế độ | Khi nào chọn | Điền gì | Lên đời |
|--------|--------------|---------|---------|
| **`mvp`** | *"3 tuần nữa demo, làm chạy được trước"* | BRD + FR + AC + hướng dẫn triển khai rút gọn | Trả nợ theo `doc-debt.md` → chốt baseline → `standard` |
| **`standard`** | Outsource, sản phẩm mới, khách nghiệm thu theo tài liệu | Đủ 19 DOC, có baseline, sau baseline đổi gì cũng qua CR | Bàn giao / vận hành |
| **`maintain`** | Tiếp quản hệ chạy nhiều năm, tài liệu thất lạc | Khai quật cái **đang có**: business rule, kiến trúc, data model, runbook | As-built đủ → chốt baseline → `standard` |

Chỉ `standard` có cảnh báo **chặn** (và luôn mở được bằng `BYPASS`); hai chế độ kia chỉ nhắc. Ở mọi chế độ, **con người là người ra lệnh** — hệ cảnh báo, bạn xác nhận là chạy.

Chi tiết: [sdlc/SKILL.md § Chế độ dự án](src/sdlc/SKILL.md#chế-độ-dự-án-project_mode)

---

## Hướng dẫn bắt đầu

**1. Cài** — một lệnh, script hỏi thư mục / client / pack (số + Enter). Không tự dò IDE.

```bash
node cli/minipower.mjs install
```

Flag (`--client`, `--with`, `--target`) chỉ khi script/CI. Thêm client sau: chạy `install` lại, chọn client mới.

Hook + dispatcher neo `sdlc/`: [sdlc/INSTALL.md](src/sdlc/INSTALL.md). Pack lá: symlink `*/skills/{tên}/` → `.cursor/skills/{tên}/`.

**2. Init dự án** — một lệnh, script hỏi từng bước (số + Enter = mặc định). Không JSON, không LLM.

Trong folder đã `install` (ví dụ `sample`):

```bash
node .minipower/bin/minipower init
```

Hoặc từ repo factory:

```bash
node cli/minipower.mjs init --target /path/toi/sample
```

`--answers file.json` chỉ cho CI/script. `init --check` soát cây đã ghi.

**3. Làm việc — một phiên một pack** (ADR-033 QĐ-1/QĐ-11)

| Cách | Khi nào | Ví dụ |
|------|---------|--------|
| **Agent / minipower chung** | Không nhớ tên lá | Chat Agent hoặc `/minipower-router` + mô tả việc — [§ Gọi chung](#gọi-chung--tự-chọn-skill) |
| **Mô tả bằng lời** | Lá-rời (`description` kích hoạt) | *thêm cache Redis* → `minipower-backend-caching-dotnet` |
| **`/` + tên skill** | Đã cài symlink, đã biết lá | `/minipower-analyst-srs` |
| **`@` file** | Chỉ định đúng SOP | `@analyst/skills/minipower-analyst-srs/SKILL.md` |

Kênh MCP: **L1 đọc tự do · L3 chỉ sau bảng preview và một lần OK**. Nghề soạn nháp trong chat; `support` chỉ đạo publish, không nuốt schema MCP.

### Gọi chung — tự chọn skill

**Có.** Không cần gõ đúng tên lá. Hai lớp:

1. **Dispatcher Minipower** — `/minipower-router` hoặc câu có *minipower* / *làm gì tiếp*. Agent đọc [bảng intent → pack](src/router/skills/minipower-router/SKILL.md), chọn **đúng một** pack/lá.
2. **Loader Cursor** — chat Agent thường: mô tả việc; Cursor khớp `description` của skill đã symlink. Không phải runtime spawn; độ chính xác phụ thuộc skill đã cài.

**Trước khi đọc SOP / làm việc**, agent **thông báo một dòng** rồi mới chạy (không chờ OK trừ L3 MCP hoặc đụng Git):

> Sẽ chạy **`minipower-…`** để xử lý **…** (pack `…`).

Hai pack cùng lúc → hỏi người, không tự ghép. Không spawn agent khác. Hook `auto-routing` chỉ gắn **phase theo DOC** khi bạn `@` file DOC — không chọn lá nghề.

### Chạy test (toàn Minipower)

Node ≥ 18. Từ **gốc repo** (ủy quyền `src/sdlc/hooks/` — catalog mọi pack, không chỉ sdlc):

```bash
npm test              # mọi skill lá · kho SOP · agents · hook
npm run gen:check     # bảng generated khớp rules.json
npm run link:check    # link markdown gãy mới (ngoài baseline)
```

Cùng lệnh nếu đang ở `src/sdlc/hooks/`. Chạm `rules.json` / `lib/*.js`: `npm run gen` → `npm test` → `npm run gen:check`.

Một file: `node --test test/minipower-catalog.test.js` (cwd `sdlc/hooks`). Trace ID trên **dự án đích**: `npm run trace:check`. CI: [minipower-hooks.yml](.github/workflows/minipower-hooks.yml).

---

## Danh mục skill & cách dùng

Skill **đăng ký loader** = thư mục lá `minipower-…` (có `SKILL.md` + `description`). SOP phase cũ trong [`sdlc/skills/`](src/sdlc/skills/README.md) là **kho** — pack nghề trỏ tới, không còn cửa `/minipower-sdlc`.

Hub: [router](src/router/README.md) · [discovery](src/discovery/README.md) · [analyst](src/analyst/README.md) · [architecture](src/architecture/README.md) · [pm](src/pm/README.md) · [support](src/support/README.md) · [qa](src/qa/README.md) · [presales](src/presales/README.md) · [ops](src/ops/README.md) · [backend](src/backend/README.md) · [toolbox](src/toolbox/README.md) · [docs](src/docs/README.md) · [tasks](src/tasks/README.md) · [chat](src/chat/README.md) · [vcs](src/vcs/README.md).

### Dispatcher — [`router/`](src/router/)

| Skill | Dùng khi (gõ) | Cách dùng |
|-------|----------------|-----------|
| **[minipower-router](src/router/skills/minipower-router/SKILL.md)** | làm gì tiếp, chọn pack | `/minipower-router` + mô tả việc; **không** L3 hộ nghề |
| **[minipower-router-init](src/router/skills/minipower-router-init/SKILL.md)** | init project, khai báo tôi là ai | `/minipower-router-init` · `Init project …` |
| **[minipower-router-deliberation](src/router/skills/minipower-router-deliberation/SKILL.md)** | có nên làm, premise | Trước việc Full; PROCEED/RESHAPE/STOP **do người** |
| **[minipower-router-readiness](src/router/skills/minipower-router-readiness/SKILL.md)** | đủ chưa, trước code/test/deploy | Hỏi **một lượt** mọi thiếu; ghi nợ `doc-debt.md` |

### Discovery — [`discovery/`](src/discovery/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-discovery-survey](src/discovery/skills/minipower-discovery-survey/SKILL.md)** | khảo sát, BRD, DOC-01…03 | *Khảo sát painpoint module X* — dừng trước FR/giá |
| **[minipower-discovery-review](src/discovery/skills/minipower-discovery-review/SKILL.md)** | QC gói khảo sát | *Soi DOC-03 đã nhảy giải pháp chưa* |

### Analyst — [`analyst/`](src/analyst/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-analyst-srs](src/analyst/skills/minipower-analyst-srs/SKILL.md)** | UC, FR, BR, AC, SRS, NFR, prototype | *Viết FR luồng đặt hàng, ORD, DOC-06* |
| **[minipower-analyst-review](src/analyst/skills/minipower-analyst-review/SKILL.md)** | QC BA, trace UC→FR→AC | *Review SRS ORD trước baseline* |
| **[minipower-analyst-cr](src/analyst/skills/minipower-analyst-cr/SKILL.md)** | CR **nội dung** đổi FR/AC | *Soạn CR đổi ORD-FR-012* — ticket = PM |

### Architecture — [`architecture/`](src/architecture/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-architecture-solution-lite](src/architecture/skills/minipower-architecture-solution-lite/SKILL.md)** | giải pháp mức bán, trước ký | *Phương án module cho báo giá* — không ULNL |
| **[minipower-architecture-sad](src/architecture/skills/minipower-architecture-sad/SKILL.md)** | SAD, ADR, API, data | *Viết DOC-08/12 cho ORD* |
| **[minipower-architecture-review](src/architecture/skills/minipower-architecture-review/SKILL.md)** | QC SAD/ADR | *Soi ADR header DOC-09* |
| **[minipower-architecture-as-built](src/architecture/skills/minipower-architecture-as-built/SKILL.md)** | maintain, legacy, CodeGraph | *Khai quật bounded context thanh toán* — người trigger |

### PM — [`pm/`](src/pm/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-pm-plan](src/pm/skills/minipower-pm-plan/SKILL.md)** | WBS, Story Point, DOC-14/15 | *Lập kế hoạch từ FR must-have* — không ULNL |
| **[minipower-pm-cr-track](src/pm/skills/minipower-pm-cr-track/SKILL.md)** | ticket CR, board | *Ghi CR-003 lên Lark/OP* — không soạn lại FR |

### Support — [`support/`](src/support/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-support-registry](src/support/skills/minipower-support-registry/SKILL.md)** | registry, thiếu DOC theo mode | *Rà registry mvp còn thiếu gì* — nhắc, không sửa FR |
| **[minipower-support-publish](src/support/skills/minipower-support-publish/SKILL.md)** | công bố Outline/chat | *Công bố ORD-FR-012 lên Outline* → Read skill kênh, L2/L3 |

### QA — [`qa/`](src/qa/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-qa-strategy](src/qa/skills/minipower-qa-strategy/SKILL.md)** | DOC-16, TEST id | *Viết TEST cho ORD-AC-001* |
| **[minipower-qa-review](src/qa/skills/minipower-qa-review/SKILL.md)** | QC test, không fake pass | *Soi suite ORD còn AC nào thiếu TEST* |

### Presales — [`presales/`](src/presales/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-presales-estimation-ulnl](src/presales/skills/minipower-presales-estimation-ulnl/SKILL.md)** | MH, mã loại, trước ký | Số đếm được → máy `classify`/`sumMH`. Không khảo sát lại |
| **[minipower-presales-quotation](src/presales/skills/minipower-presales-quotation/SKILL.md)** | MD, buffer, ROM, tờ giá | Đọc `estimate-v1.0.json`; `rate_md` local không commit |

### Ops — [`ops/`](src/ops/)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-ops-metrics](src/ops/skills/minipower-ops-metrics/README.md)** | Grafana, Prometheus, spike | *Lấy panel 6h job X* |
| **[minipower-ops-deploy](src/ops/skills/minipower-ops-deploy/README.md)** | DOC-17, cutover | *Soạn runbook deploy staging* |
| **[minipower-ops-incident](src/ops/skills/minipower-ops-incident/README.md)** | SEV, postmortem | *Ghi incident SEV2 + postmortem* |

### Backend .NET — [`backend/`](src/backend/)

Lá-rời: **mô tả việc**. Provider/pattern con chỉ đọc khi skill cha gọi. Cài: [backend § Cài vào Cursor](src/backend/README.md#cài-vào-cursor).

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-backend-scaffold-dotnet](src/backend/skills/minipower-backend-scaffold-dotnet/README.md)** | solution mới | *Scaffold backend Product=Acme* |
| **[minipower-backend-architecture-dotnet](src/backend/skills/minipower-backend-architecture-dotnet/README.md)** | layer DDD, ArchUnit | *Thêm use case cắt dọc 5 layer* |
| **[minipower-backend-convention-dotnet](src/backend/skills/minipower-backend-convention-dotnet/README.md)** | viết/sửa C# | Đi kèm mọi lá backend |
| **[minipower-backend-authentication-dotnet](src/backend/skills/minipower-backend-authentication-dotnet/README.md)** | JWT, API Key, Cognito | *Bật Bearer cho API* |
| **[minipower-backend-caching-dotnet](src/backend/skills/minipower-backend-caching-dotnet/README.md)** | Redis / memory cache | *Thêm cache Redis service đơn hàng* |
| **[minipower-backend-entityframework-dotnet](src/backend/skills/minipower-backend-entityframework-dotnet/README.md)** | EF, multitenancy | *Init CoreDbContext hybrid tenant* |
| **[minipower-backend-swashbuckle-dotnet](src/backend/skills/minipower-backend-swashbuckle-dotnet/README.md)** | Swagger | *Bọc BaseResponse + JWT trên Swagger* |
| **[minipower-backend-healthcheck-dotnet](src/backend/skills/minipower-backend-healthcheck-dotnet/README.md)** | `/health/*` | *Thêm readiness Redis + SQL* |
| **[minipower-backend-telemetry-dotnet](src/backend/skills/minipower-backend-telemetry-dotnet/README.md)** | OTEL | *Bật OTLP + enrich* |
| **[minipower-backend-observability-dotnet](src/backend/skills/minipower-backend-observability-dotnet/README.md)** | Prometheus, Grafana | *Onboard metric service X* |
| **[minipower-backend-notification-dotnet](src/backend/skills/minipower-backend-notification-dotnet/README.md)** | email SMTP | *Gửi mail transactional Mailkit* |
| **[minipower-backend-blobstoring-dotnet](src/backend/skills/minipower-backend-blobstoring-dotnet/README.md)** | MinIO / filesystem | *Upload chứng từ MinIO* |
| **[minipower-backend-realtime-dotnet](src/backend/skills/minipower-backend-realtime-dotnet/README.md)** | SignalR | *AddCoreRealtime + Redis backplane* |
| **[minipower-backend-review-dotnet](src/backend/skills/minipower-backend-review-dotnet/README.md)** | review PR C# | *Review diff trước khi mở MR* |

### Toolbox — [`toolbox/`](src/toolbox/) (chỉ repo minipower)

| Skill | Dùng khi | Cách dùng |
|-------|----------|-----------|
| **[minipower-toolbox-skill-author](src/toolbox/skills/minipower-toolbox-skill-author/README.md)** | viết/soát skill lá | *Tạo skill gửi email đúng chuẩn minipower* |

### Kênh MCP

| Skill | Mặt profile | Dùng khi | Cách dùng |
|-------|-------------|----------|-----------|
| **[minipower-docs-outline](src/docs/skills/minipower-docs-outline/README.md)** | `docs=outline` | wiki Outline, publish | L1 đọc · L3 publish/migrate một bảng |
| **[minipower-tasks-lark](src/tasks/skills/minipower-tasks-lark/README.md)** | `tasks=lark` | tasklist Lark | L1 list · L3 nếu MCP có tool ghi |
| **[minipower-chat-lark](src/chat/skills/minipower-chat-lark/README.md)** | `chat=lark` | tin nhóm, nhắc việc | L1 đọc · L3 gửi sau OK |
| **[minipower-vcs-gitlab](src/vcs/skills/minipower-vcs-gitlab/README.md)** | `code=gitlab` | MR, pipeline | L1 search · L3 MR/comment; commit sau preview |

`tasks=none` → `memory/tasks/`. `docs=local` → git `docs/`.

### Kho SOP `sdlc/skills/` (không đăng ký menu)

Đọc khi pack nghề trỏ tới, hoặc `@sdlc/skills/…`. QC công ty = `*-review` trong pack, không load `doc-review` như gate toàn repo.

| File | Vai |
|------|-----|
| [discovery](src/sdlc/skills/discovery/SKILL.md) · [requirements](src/sdlc/skills/requirements/SKILL.md) · [architecture](src/sdlc/skills/architecture/SKILL.md) · [planning](src/sdlc/skills/planning/SKILL.md) · [delivery](src/sdlc/skills/delivery/SKILL.md) · [change-control](src/sdlc/skills/change-control/SKILL.md) | SOP 6 phase (kho) |
| [deliberation](src/sdlc/skills/deliberation/SKILL.md) · [readiness-gate](src/sdlc/skills/readiness-gate/SKILL.md) | Gate mềm — lá `minipower-router-*` |
| [fan-out](src/sdlc/skills/fan-out/SKILL.md) | Playbook song song; spawn = harness |
| [as-built](src/sdlc/skills/as-built/SKILL.md) | Kho; nhà mới = `minipower-architecture-as-built` |
| [doc-review](src/sdlc/skills/doc-review/SKILL.md) | Kho 5 chiều |

---

## Cấu trúc thư mục

Repo tổ chức theo **module** (đơn vị cài, chứa skill — mỗi module tự khai `PACK.md`), **tầng nền** (luật chơi chung, đọc trực tiếp, không cần cài) và một **kho tạm** (nội dung cũ viết tạm, rút dần thành skill/template — chỉ rút, không nạp):

```text
minipower/
├── router/ · discovery/ · analyst/ · architecture/ · pm/ · support/ · qa/ · presales/
├── sdlc/                  # Kho neo: hook, skeleton, templates 19 DOC, plugin path
│   ├── SKILL.md           #   Dispatcher đăng ký minipower-router
│   ├── skills/            #   SOP phase (kho)
│   ├── hooks/ · templates/ · project-skeleton/ · install/
├── backend/ · ops/ · toolbox/
├── docs/ · tasks/ · chat/ · vcs/
├── contracts/ · ADRs/
└── staging/
```

Nguyên tắc tổ chức:

- **Tên hai tầng:** `minipower` là thương hiệu; module một-từ. Skill lá: `minipower-{module}-{capability}[-{stack}]`.
- **Mỗi thư mục một vai:** `SKILL.md` viết cho agent (quy tắc, workflow); `README.md` viết cho người (hướng dẫn, bảng tra). Module mới chỉ tạo khi đã có skill thật.
- **Nguồn chân lý duy nhất:** các bảng routing/phase trong tài liệu được **sinh tự động** từ [`src/sdlc/hooks/lib/rules.json`](src/sdlc/hooks/lib/rules.json) — sửa rules rồi chạy `npm run gen`, không sửa tay vùng generated.

---

## Liên kết nhanh

- [Danh mục skill & cách dùng](#danh-mục-skill--cách-dùng) · [Gọi chung](#gọi-chung--tự-chọn-skill) · [Chạy test](#chạy-test-repo-này) · [dispatcher SKILL](src/sdlc/SKILL.md) · [19 DOC](src/sdlc/templates/README.md)
- [router](src/router/README.md) · [discovery](src/discovery/README.md) · [analyst](src/analyst/README.md) · [architecture](src/architecture/README.md) · [pm](src/pm/README.md) · [support](src/support/README.md) · [qa](src/qa/README.md) · [presales](src/presales/README.md)
- [backend](src/backend/README.md) · [ops](src/ops/README.md) · [toolbox](src/toolbox/README.md)
- [docs](src/docs/README.md) · [tasks](src/tasks/README.md) · [chat](src/chat/README.md) · [vcs](src/vcs/README.md)
- [contracts](contracts/README.md) · [staging](staging/) · [interview](staging/interview/)
