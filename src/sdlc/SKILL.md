---
description: >-
  [KHO] Bảng project_mode, phân tầng, init. Không đăng ký skill.
  Dispatcher là minipower-router. Hook ở src/sdlc/hooks (ADR-032 QĐ-8);
  chuyển router/hooks là nợ ADR-033 Đợt E.
---

# Minipower — kho `sdlc/` (neo plugin và hook)

File này không có `name:`. Skill làm việc là [`minipower-router`](../router/skills/minipower-router/SKILL.md). Symlink cài vẫn tên folder `.cursor/skills/minipower-sdlc` vì hook nằm trong pack này.

Skill lá: [`minipower-router`](../router/skills/minipower-router/SKILL.md) · [`minipower-router-init`](../router/skills/minipower-router-init/SKILL.md).

## Cách dùng trong Cursor

**Menu `/`:** skill dispatcher. Pack nghề/kênh là lá-rời.

| Cách | Thao tác |
|------|----------|
| **A — intent** | Mô tả việc / Agent / `/minipower-router` → [bảng pack](../router/skills/minipower-router/SKILL.md) → **một** pack. **Thông báo** `Sẽ chạy {skill} để xử lý {việc}` rồi mới đọc SOP |
| **B — `@` pack** | `@discovery/skills/…` / `@analyst/skills/…` |
| **C — overview** | Không rõ pack → dispatcher hỏi/gợi ý |
| **D — khởi tạo** | CLI `minipower init` — [minipower-router-init](../router/skills/minipower-router-init/SKILL.md) chỉ nhắc lệnh |

Chi tiết + ví dụ prompt: [README.md](README.md)

### Routing — agent bắt buộc

Phân tầng **trước** ([micro/light/full](#phân-tầng-công-việc-micro--light--full)). Init: [khởi tạo](#khởi-tạo-cấu-trúc-dự-án-mặc-định). Mode: [project_mode](#chế-độ-dự-án-project_mode). Kết thúc phiên → cập nhật `memory/memory.md` (cá nhân) + DEC/open-Q nếu cần. **Không** spawn pack khác.

| Intent | Đọc |
|--------|-----|
| init, khởi tạo dự án | [minipower-router-init](../router/skills/minipower-router-init/SKILL.md) |
| deliberation, có nên làm | [minipower-router-deliberation](../router/skills/minipower-router-deliberation/SKILL.md) |
| readiness-gate, thực thi | [minipower-router-readiness](../router/skills/minipower-router-readiness/SKILL.md) |
| QC DOC | `*-review` **trong pack nghề** — không skill QC công ty |
| khảo sát DOC-01…03 | [discovery](../discovery/README.md) |
| UC/FR/SRS/AC | [analyst](../analyst/README.md) |
| SAD/ADR/SOL | [architecture](../architecture/README.md) |
| kế hoạch/WBS | [pm](../pm/README.md) |
| registry/publish | [support](../support/README.md) |
| TEST/DOC-16 | [qa](../qa/README.md) |
| DOC-17/incident | [ops](../ops/README.md) |
| báo giá ULNL | [presales](../presales/README.md) |
| kênh MCP | [docs](../docs/README.md) · [tasks](../tasks/README.md) · [chat](../chat/README.md) · [vcs](../vcs/README.md) |
| .NET | [backend](../backend/README.md) |
| fan-out song song | harness client; playbook [contracts](../../contracts/README.md) — không skill spawn |
| as-built | [minipower-architecture-as-built](../architecture/skills/minipower-architecture-as-built/SKILL.md) · kho [skills/as-built/SKILL.md](skills/as-built/SKILL.md) |

Kho SOP phase (chưa chuyển hết chữ): [`skills/`](skills/).

## Phân tầng công việc (micro / light / full)

**Chi phí tương xứng:** không phải việc nào cũng qua đủ gate. Trước khi áp workflow, tự phân tầng — **hook token-guard đã hạ cảnh báo cho micro rõ ràng và có thể tiêm gợi ý "[Minipower tier]"; nhưng verdict cuối là của bạn** (hook chỉ đoán bề mặt).

**Phép thử:** *việc này có đổi nội dung/quyết định, hay ảnh hưởng DOC khác không?* Không → micro. Đổi nội dung trong DOC đã có → light. Cấu trúc/quyết định mới, hoặc đụng baseline → full.

| Gate | Micro | Light | Full |
|------|:---:|:---:|:---:|
| Ví dụ | typo, format, đổi version, thêm 1 dòng đã soạn | sửa/thêm 1 FR, cập nhật 1 section | module/DOC mới, đổi kiến trúc, trước baseline |
| Khai `Phase:` | không cần | ✅ | ✅ |
| Token-guard scope (Phase+Module+DOC) | bỏ qua | ✅ | ✅ |
| [Deliberation](skills/deliberation/SKILL.md) Premise Check | ❌ | ❌ | ✅ |
| `*-review` trong pack nghề | ❌ | ⚠ khuyến nghị | ✅ (người ký) |
| `decision-log.md` | ❌ | chỉ khi có quyết định thật | ✅ |
| Verdict gate (PROCEED/PASS) | ❌ | ❌ | ✅ |

**Ràng buộc cứng — không tầng nào phá được:**
- `discovery` (scope dự án mới) và `change-control` (CR sau baseline) **luôn Full**.
- Đụng `docs/02-baseline/` → **luôn Full**; baseline-guard chặn baseline ở **mọi** tầng và **mọi** chế độ.
- Không chắc micro hay light → chọn **light** (an toàn hơn: micro sai bỏ mất gate).

## Chế độ dự án (`project_mode`)

**Chiều thứ hai, độc lập với phân tầng.** Tầng (micro/light/full) hỏi *"việc này to hay nhỏ"*; chế độ hỏi *"dự án này cần bao nhiêu tài liệu"*. Chế độ sống ở `memory/profile.json`, hỏi khi init (câu 6), đổi được nhưng phải kèm DEC.

<!-- BEGIN generated: project-modes (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->

| Chế độ | Tình huống | DOC cần điền (`docs_focus`) | prereq | `02-baseline` | `_legacy` |
|--------|------------|------------------------------|:------:|:-------------:|:---------:|
| **Chuẩn chỉnh** (`standard`) | Sản phẩm mới / outsource; hoặc MVP lên đời | **tất cả 19 DOC** | block | deny | deny |
| **MVP** (`mvp`) | Chỉ cần chạy được, tài liệu cơ bản | DOC-01, 03, 06–07, 09, 17 | warn | deny | deny |
| **Maintain legacy** (`maintain`) | Hệ chạy nhiều năm, tài liệu cũ rời rạc | DOC-04, 08–12, 17–18 | warn | deny | allow |

<!-- END generated: project-modes -->

**Một cấu trúc folder cho cả 3 chế độ.** Init luôn copy **đủ** 7 folder `docs/` + 6 folder `memory/` ở **mọi** chế độ; folder chưa dùng thì để rỗng kèm README nêu lý do. Chế độ chỉ đổi *điền gì trước*, **không** cắt khung — nhờ vậy `mvp`/`maintain` lên `standard` **không có bước di trú cấu trúc**, chỉ điền tiếp.

**Chế độ × tầng:**

| | `mvp` | `standard` | `maintain` |
|---|---|---|---|
| Tầng mặc định | light | full | light (theo vùng chạm) |
| Trần tầng | full khi đụng baseline | — | full khi đụng baseline |
| `prereq-gate` thiếu DOC | nhắc, vẫn chạy | **chặn** — gõ `BYPASS` để đi tiếp | nhắc, vẫn chạy |
| doc-review | rút chiều | đủ 5 chiều, ≥3 góc nhìn | chỉ vùng chạm |
| Nợ tài liệu | ghi `memory/doc-debt.md` | — | điền dần theo vùng chạm |

**ID ổn định (`{MOD}-FR-`, `DEC-`, `ADR-`) dùng từ ngày đầu ở CẢ 3 chế độ** — rẻ lúc viết, và là thứ khiến bước lên `standard` khả thi.

> Chế độ **không** nới hai thứ: `docs/02-baseline/` luôn deny, và `token-guard` luôn chặn `@` cả thư mục.

## Agent guardrails

Trước khi đọc/sửa trên repo `docs/`: tuân theo [agents/token-guard.md](agents/token-guard.md). Khi sửa DOC: thêm [agents/doc-editing.md](agents/doc-editing.md). Khi `@` file DOC: [agents/auto-routing.md](agents/auto-routing.md). Prompt thiếu module/DOC/@ → trả checklist scope, không search repo.

**Trước khi thực thi** (viết code/artifact cuối): qua [skills/readiness-gate/SKILL.md](skills/readiness-gate/SKILL.md) — soát tiền đề, đủ mới làm. Biết giai đoạn dự án + vai trò: [agents/project-state.md](agents/project-state.md) → [roles/](roles/README.md) (lăng kính hỗ trợ **con người**, không phải agent tự chạy). Khi đủ tiền đề: nạp ngữ cảnh theo [agents/context-load.md](agents/context-load.md).

## Khởi tạo cấu trúc dự án mặc định

Khi user yêu cầu **khởi tạo / init dự án** mới → agent **bắt buộc** tạo đúng cấu trúc dưới `{project}/` (root dự án, không phải folder skill pack).

### Cấu trúc mặc định

```text
{project}/
├── AGENTS.md              ← Persona agent (Cursor) — sinh từ profile
├── CLAUDE.md              ← Persona agent (Claude Code) — cùng nội dung + @import pack
├── README.md              ← Entry dự án
├── FAQ.md                  ← FAQ hướng dẫn thiết lập sẵn (làm gì / làm thế nào / thiếu gì)
├── memory/                ← Entry cá nhân + sổ đội phẳng + SQLite (ADR-035)
│   ├── profile.json       ← v3 dự án: project_mode + 4 provider (hook profile-guard)
│   ├── profile.user.json  ← gitignore — tên/xưng hô máy này
│   ├── profile.user.json.example
│   ├── memory.md.example  ← khuôn entry agent (commit)
│   ├── memory.md          ← gitignore — hiện trạng tôi + tiến độ + nhắc việc
│   ├── decision-log.md    ← DEC đội (một file, không theo phase)
│   ├── open-questions.md  ← câu hỏi / nợ tiền đề đội
│   ├── doc-debt.md        ← sổ nợ tài liệu — điều kiện lên `standard`
│   ├── trace.sql          ← khuôn SQLite (DB `trace.db` gitignore)
│   └── trace.db           ← index + việc đội khi tasks=none
├── assets/                ← Tài liệu thô từ khách hàng / họp nội bộ
│   ├── public/            ← Đã share với khách hàng
│   ├── internal/          ← Nội bộ — không gửi khách
│   └── archive/           ← Tài liệu cũ, rời rạc — nguồn tham chiếu, CHƯA phải artifact
├── brainstorm/            ← Trao đổi & phân tích — file theo ngày (không chia folder con)
└── docs/                  ← Artifact chính thức Minipower (DOC-01–18)
    ├── 00-governance/     ← Kế hoạch, CR register, lịch sử baseline (DOC-15, 18)
    ├── 01-project/        ← Vision, stakeholder, BRD (DOC-01–03)
    ├── 02-baseline/       ← Snapshot đã ký — chỉ đọc
    ├── 03-modules/        ← UC, FR, SRS, test theo module (DOC-04–07, 16)
    ├── 04-platform/       ← SAD, tích hợp, NFR, triển khai (DOC-08–14, 17)
    ├── 05-traceability/   ← Ma trận trace, doc registry (không còn overview)
    └── 06-changes/        ← CR và delta thay đổi (DOC-18)
        └── incident/      ← Báo cáo sự cố + postmortem (hệ đang vận hành)
```

### Quy ước folder

| Thư mục | Vai trò |
|---------|---------|
| [`assets/`](assets/) | Giữ **bản gốc** khảo sát, checklist, biên bản — **không sửa file gốc** |
| [`brainstorm/`](brainstorm/) | Phân tích, trao đổi theo ngày; chốt → **distill** vào `docs/` |
| [`docs/`](docs/) | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |
| [`memory/`](memory/) | Entry cá nhân (`memory.md`) + DEC / open-Q / doc-debt + SQLite |
| [`FAQ.md`](project-skeleton/FAQ.md) | FAQ hướng dẫn thiết lập sẵn — user hỏi meta / bước tiếp → agent đọc đây |

**Bổ sung:**

| Thư mục | Quy tắc |
|---------|---------|
| `assets/public/` | Đã share / nhận từ khách hàng |
| `assets/internal/` | Họp nội bộ — không gửi khách |
| `assets/archive/` | Tài liệu cũ từ trước khi dùng minipower. **Không** copy thẳng sang `docs/` — phải có người xác nhận. README ghi **độ tin cậy** từng nguồn (còn đúng / nghi ngờ / đã lỗi thời) |
| `memory/doc-debt.md` | Nợ tài liệu của `mvp`/`maintain`. Ghi khi `prereq-gate` nhắc mà vẫn quyết làm tiếp |
| `memory/decision-log.md` | DEC đội — một file ([schema](docs/decision-log.md)); ID vẫn `DEC-{PHASE}-` |
| `memory/open-questions.md` | Câu hỏi / nợ tiền đề đội |
| `memory/memory.md` | Entry agent **đầu session** (gitignore; copy từ `.example`) — hiện trạng + nhắc việc + link |
| `memory/trace.db` | SQLite: index trace + **việc đội** khi `tasks_provider=none` (không còn `memory/tasks/`) |
| `brainstorm/` | File: `YYYY-MM-DD.md` hoặc `YYYY-MM-DD-<mo-ta>.md` — **không** tạo folder con |
| `docs/03-modules/` | Copy `_template/` → `{module-id}/` khi mở module |
| `memory/profile.json` | Cấu hình **dự án** (v3) — mode + 4 provider; schema: [TPL-agent-profile](templates/TPL-agent-profile.md) |
| `memory/profile.user.json` | Identity máy này — **gitignore**; thiếu/`os_username` lệch → hook chặn |
| `FAQ.md` | FAQ cố định do maintainer thiết lập — **không** ghi Q&A dự án hay open-questions |

**Luồng:** `assets/` → `brainstorm/` → `docs/` → `02-baseline/` · sau baseline → `06-changes/CR-xxx/`

### Cá nhân hoá agent (bắt buộc)

Trước khi làm bất kỳ việc minipower nào (DOC, phase, sync), agent **bắt buộc** có `memory/profile.json` **v3** hợp lệ **và** identity local (`profile.user.json`).
Hook [profile-guard](agents/profile-guard.md) **chặn cứng** prompt làm việc nếu thiếu — không chỉ dựa vào prompt mềm.

**Khởi tạo = CLI**, không phỏng vấn LLM ([ADR-031](../../ADRs/doing/ADR-031-2026-09-01-cli-install-init-thay-llm-thi-hanh.md) QĐ-9):

```text
node <factory>/cli/minipower.mjs init
# sau install:  node .minipower/bin/minipower init
```

CLI hỏi từng bước (số + Enter), ghi `profile.json` v3 + `profile.user.json`, copy skeleton. Agent gặp `Init project` / *khởi tạo dự án* → in lệnh trên rồi dừng.

Đổi cấu hình sau: chạy lại `minipower init` (idempotent) hoặc sửa JSON rồi `init --check`.

**Đổi `project_mode` không phải việc sửa một trường.** Nó là sự kiện có nghi thức, đi qua [change-control](skills/change-control/SKILL.md) và **phải kèm DEC**. Đổi provider: migrate (ADR-033 QĐ-10), không im lặng.

### Thao tác khi init

Agent **không** `cp -R` và **không** hỏi 7 câu. Người chạy CLI (cwd = thư mục dự án):

```bash
node <factory>/cli/minipower.mjs init
# hoặc
node .minipower/bin/minipower init
```

Skeleton: [project-skeleton/INIT.md](project-skeleton/INIT.md). **Init vào repo đã có sẵn:** cùng lệnh, CLI không đè file đã tồn tại.

### Exit init

- [ ] `memory/profile.json` hợp lệ (**v3**: `project_mode` + `docs_provider` + `tasks_provider` + `chat_provider` + `code_provider`) + `memory/profile.user.json` (local) + `AGENTS.md` / `CLAUDE.md` **không** nhúng tên người
- [ ] Đủ 4 nhánh: `memory/` (phẳng ADR-035), `assets/`, `brainstorm/`, `docs/` (7 folder) + `FAQ.md` — **đủ ở mọi chế độ**, folder docs chưa dùng thì rỗng kèm README
- [ ] `mvp`/`maintain`: có `memory/doc-debt.md` ghi nợ so với `docs_focus`
- [ ] `memory/memory.md.example` + copy `memory.md` · `decision-log.md` · `open-questions.md` · `trace.sql` (không `{phase}/`, không `tasks/`)
- [ ] `brainstorm/README.md` — **không** folder con trong `brainstorm/`

## Pipeline

```text
Business Goal → Stakeholder → Process → Requirement → Solution
```

**Nguyên tắc:** Không nhảy giải pháp sớm · Assumption · Tìm req thiếu · Rủi ro.

## Skill con

| Skill | Path | Bước | DOC |
|-------|------|------|-----|
| Discovery | [skills/discovery/SKILL.md](skills/discovery/SKILL.md) | 1–2 | 01–03 |
| Requirements | [skills/requirements/SKILL.md](skills/requirements/SKILL.md) | 3–9 | 04–07, 13, 19 |
| Architecture | [skills/architecture/SKILL.md](skills/architecture/SKILL.md) | 9 | 08–12 |
| Planning | [skills/planning/SKILL.md](skills/planning/SKILL.md) | 10–12 | 14–15 |
| Delivery | [skills/delivery/SKILL.md](skills/delivery/SKILL.md) | — | 16–17 |
| Change control | [skills/change-control/SKILL.md](skills/change-control/SKILL.md) | — | 18 |

## Tài nguyên dùng chung

| Resource | Path |
|----------|------|
| **Project skeleton** | [project-skeleton/](project-skeleton/) |
| **DOC versioning** | [docs-skeleton/00-governance/doc-versioning.md](docs-skeleton/00-governance/doc-versioning.md) |
| Template 19 DOC | [templates/README.md](templates/README.md) |
| Skeleton `docs/` | [docs-skeleton/README.md](docs-skeleton/README.md) |

## 19 DOC & trace (tóm tắt)

```text
01–03 → 05 → 06 → 07 → 16 │ 06/10/12 → 08/09/11 │ 18 → revise → vX.Y
```

Chi tiết folder `docs/` → [docs-skeleton](docs-skeleton/README.md).

## Go-live exit

- [ ] DOC-01–07 baseline · 08–12 reviewed · 13↔test · 14–15↔SRS · 16↔07 · 17 dry-run · 18 register
