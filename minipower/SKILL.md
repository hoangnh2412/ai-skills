---
name: minipower
description: >-
  Minipower — bộ skill BA + Solution Architect + TPM (6 phase con). Pipeline 13
  bước, 19 DOC, enterprise systems. Khởi tạo dự án: init project. Gõ /minipower
  hoặc @minipower. Phase: discovery | requirements | architecture | planning |
  delivery | change-control. Skill cross-phase: deliberation (premise check, có
  nên làm, nghị luận đa góc nhìn) · doc-review (QC đối kháng, kiểm tra chéo,
  trace, trước baseline) · readiness-gate (soát tiền đề trước khi thực thi) ·
  fan-out (sinh BR/Prototype/SRS song song theo module giữa hai cổng) ·
  decision-log (lưu quyết định + phương án bị loại).
---

# Minipower — Skill pack (BA + SA + TPM)

**Một bộ skill** gồm router (file này) + **6 skill con** trong [`skills/`](skills/). Template, skeleton dự án & skeleton `docs/` nằm cùng pack.

## Cách dùng trong Cursor

**Menu `/`:** chỉ có **`minipower`** (skill cha). Skill con **không** có lệnh `/` riêng.

| Cách | Thao tác |
|------|----------|
| **A — `/` + phase** | `/minipower` rồi ghi `Phase: requirements` (hoặc discovery / architecture / planning / delivery / change-control) → agent **đọc file skill con** tương ứng trước khi trả lời |
| **B — `@` file con** | `@skills/requirements/SKILL.md` (path đầy đủ trong `.cursor/skills/minipower/…`) |
| **C — overview** | `/minipower` không chỉ phase → router hỏi/đề xuất bước |
| **D — khởi tạo dự án** | `/minipower` + `Init project` / `Khởi tạo dự án` → agent thực hiện [Khởi tạo cấu trúc dự án](#khởi-tạo-cấu-trúc-dự-án-mặc-định) |

Chi tiết + ví dụ prompt: [README.md](README.md)

### Routing — agent bắt buộc

Khi user ghi `Phase: …` hoặc intent rõ (vd. "phân tích yêu cầu", "thiết kế kiến trúc") → **[phân tầng](#phân-tầng-công-việc-micro--light--full) trước** → **đọc** `memory/{phase}/` (gồm `decision-log.md` nếu có) + skill con tương ứng, rồi áp dụng workflow **theo đúng tầng**. Kết thúc phiên → cập nhật `memory/{phase}/` + ghi quyết định có phương án bị loại vào `memory/{phase}/decision-log.md` ([schema](docs/decision-log.md)), **không** append dài vào `memory/memory.md`.

| Phase / intent | Đọc file |
|----------------|----------|
| deliberation, có nên làm, premise, nghị luận, đánh giá lại | [skills/deliberation/SKILL.md](skills/deliberation/SKILL.md) — **chạy trước** khi vào phase |
| doc-review, review DOC, QC, soi tài liệu, kiểm tra chéo, trước baseline | [skills/doc-review/SKILL.md](skills/doc-review/SKILL.md) — QC đối kháng, một slice |
| readiness-gate, thực thi, viết code, thiết kế module, kiểm thử, triển khai | [skills/readiness-gate/SKILL.md](skills/readiness-gate/SKILL.md) — soát tiền đề **trước khi thực thi**; đủ rồi → [context-load](agents/context-load.md) |
| fan-out, sinh song song, viết BR/Prototype/SRS cho các module, sinh hàng loạt theo module | [skills/fan-out/SKILL.md](skills/fan-out/SKILL.md) — điều phối per-module **giữa hai cổng**; kiểm [approval-gate](agents/approval-gate.md) trước |
| discovery, scope, brainstorm | [skills/discovery/SKILL.md](skills/discovery/SKILL.md) |
| requirements, UC, FR, SRS, AC | [skills/requirements/SKILL.md](skills/requirements/SKILL.md) |
| architecture, SAD, ADR, API | [skills/architecture/SKILL.md](skills/architecture/SKILL.md) |
| planning, WBS, estimate, roadmap | [skills/planning/SKILL.md](skills/planning/SKILL.md) |
| delivery, test, deploy, go-live | [skills/delivery/SKILL.md](skills/delivery/SKILL.md) |
| change-control, CR, baseline | [skills/change-control/SKILL.md](skills/change-control/SKILL.md) |
| init project, khởi tạo dự án, tạo folder dự án | Section [Khởi tạo](#khởi-tạo-cấu-trúc-dự-án-mặc-định) **trong file này** |
| làm gì tiếp, làm thế nào, hướng dẫn, không biết, cần cung cấp gì | [`FAQ.md`](project-skeleton/FAQ.md) ở root dự án — FAQ thiết lập sẵn |

## Phân tầng công việc (micro / light / full)

**Chi phí tương xứng:** không phải việc nào cũng qua đủ gate. Trước khi áp workflow, tự phân tầng — **hook token-guard đã hạ cảnh báo cho micro rõ ràng và có thể tiêm gợi ý "[Minipower tier]"; nhưng verdict cuối là của bạn** (hook chỉ đoán bề mặt).

**Phép thử:** *việc này có đổi nội dung/quyết định, hay ảnh hưởng DOC khác không?* Không → micro. Đổi nội dung trong DOC đã có → light. Cấu trúc/quyết định mới, hoặc đụng baseline → full.

| Gate | Micro | Light | Full |
|------|:---:|:---:|:---:|
| Ví dụ | typo, format, đổi version, thêm 1 dòng đã soạn | sửa/thêm 1 FR, cập nhật 1 section | module/DOC mới, đổi kiến trúc, trước baseline |
| Khai `Phase:` | không cần | ✅ | ✅ |
| Token-guard scope (Phase+Module+DOC) | bỏ qua | ✅ | ✅ |
| [Deliberation](skills/deliberation/SKILL.md) Premise Check | ❌ | ❌ | ✅ |
| [doc-review](skills/doc-review/SKILL.md) đối kháng | ❌ | ⚠ khuyến nghị | ✅ bắt buộc |
| `decision-log.md` | ❌ | chỉ khi có quyết định thật | ✅ |
| Verdict gate (PROCEED/PASS) | ❌ | ❌ | ✅ |

**Ràng buộc cứng — không tầng nào phá được:**
- `discovery` (scope dự án mới) và `change-control` (CR sau baseline) **luôn Full**.
- Đụng `docs/02-baseline/` → **luôn Full**; read-guard chặn baseline ở **mọi** tầng.
- Không chắc micro hay light → chọn **light** (an toàn hơn: micro sai bỏ mất gate).

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
├── memory/                ← Context nhanh — index theo chủ đề (đọc trước khi làm việc)
│   ├── profile.json       ← SSOT cá nhân hoá (hook profile-guard validate)
│   ├── memory.md          ← Index gốc (chung) — link 6 chủ đề bên dưới
│   ├── discovery/         ← Phạm vi, stakeholder, khảo sát (→ DOC-01–03)
│   ├── requirements/      ← UC, FR, SRS theo module (→ DOC-04–07, 13)
│   ├── architecture/      ← SAD, ADR, tích hợp, API (→ DOC-08–12)
│   ├── planning/          ← WBS, ước lượng, kế hoạch (→ DOC-14–15)
│   ├── delivery/          ← Chiến lược test, triển khai (→ DOC-16–17)
│   └── change-control/    ← CR, delta baseline sau ký (→ DOC-18)
├── assets/                ← Tài liệu thô từ khách hàng / họp nội bộ
│   ├── public/            ← Đã share với khách hàng
│   └── internal/          ← Nội bộ — không gửi khách
├── brainstorm/            ← Trao đổi & phân tích — file theo ngày (không chia folder con)
└── docs/                  ← Artifact chính thức Minipower (DOC-01–18)
    ├── 00-governance/     ← Kế hoạch, CR register, lịch sử baseline (DOC-15, 18)
    ├── 01-project/        ← Vision, stakeholder, BRD (DOC-01–03)
    ├── 02-baseline/       ← Snapshot đã ký — chỉ đọc
    ├── 03-modules/        ← UC, FR, SRS, test theo module (DOC-04–07, 16)
    ├── 04-platform/       ← SAD, tích hợp, NFR, triển khai (DOC-08–14, 17)
    ├── 05-traceability/   ← Overview, ma trận trace, doc registry
    └── 06-changes/        ← CR và delta thay đổi (DOC-18)
```

### Quy ước folder

| Thư mục | Vai trò |
|---------|---------|
| [`assets/`](assets/) | Giữ **bản gốc** khảo sát, checklist, biên bản — **không sửa file gốc** |
| [`brainstorm/`](brainstorm/) | Phân tích, trao đổi, decision log theo ngày; chốt → **distill** vào `docs/` |
| [`docs/`](docs/) | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |
| [`memory/`](memory/) | Index context theo chủ đề — `memory.md` gốc + `memory/{phase}/` |
| [`FAQ.md`](project-skeleton/FAQ.md) | FAQ hướng dẫn thiết lập sẵn — user hỏi meta / bước tiếp → agent đọc đây |

**Bổ sung:**

| Thư mục | Quy tắc |
|---------|---------|
| `assets/public/` | Đã share / nhận từ khách hàng |
| `assets/internal/` | Họp nội bộ — không gửi khách |
| `brainstorm/` | File: `YYYY-MM-DD.md` hoặc `YYYY-MM-DD-<mo-ta>.md` — **không** tạo folder con |
| `docs/03-modules/` | Copy `_template/` → `{module-id}/` khi mở module |
| `memory/memory.md` | Index gốc — đọc **đầu session**, rồi mở `memory/{phase}/` |
| `memory/profile.json` | Cá nhân hoá agent — **bắt buộc** trước việc minipower; schema: [TPL-agent-profile](templates/TPL-agent-profile.md) |
| `memory/{phase}/` | Ghi memory **theo chủ đề** — tránh nhồi hết vào `memory.md` |
| `memory/{phase}/decision-log.md` | Quyết định có phương án bị loại — lưu "tại sao" ([schema](docs/decision-log.md)) |
| `FAQ.md` | FAQ cố định do maintainer thiết lập — **không** ghi Q&A dự án hay open-questions |

**Luồng:** `assets/` → `brainstorm/` → `docs/` → `02-baseline/` · sau baseline → `06-changes/CR-xxx/`

### Cá nhân hoá agent (bắt buộc)

Trước khi làm bất kỳ việc minipower nào (DOC, phase, sync), agent **bắt buộc** có `memory/profile.json` hợp lệ.
Hook [profile-guard](agents/profile-guard.md) **chặn cứng** prompt làm việc nếu thiếu — không chỉ dựa vào prompt mềm.

**Khi `Init project {name}` — hỏi trọn gói một lượt** (không hỏi nhỏ giọt, **không** copy skeleton trước khi có đủ câu trả lời):

| # | Câu hỏi | Ghi vào |
|---|----------|---------|
| 1 | Tên bạn là gì? (và xưng **anh** hay **chị**?) | `user_name`, `honorific` |
| 2 | Bạn làm vị trí gì? (chọn nhiều) | `roles[]` — BA, PM, SA, DEV, QC, DevOps, Support |
| 3 | Dự án làm về gì? | `project_summary` |
| 4 | Dự án đang ở giai đoạn nào? | `current_phase` — discovery … change-control |
| 5 | Đã từng dùng minipower chưa? | `minipower_experience` — `new` \| `returning` |

Sau khi user trả lời:

1. Ghi `memory/profile.json` (schema v1 — [TPL-agent-profile](templates/TPL-agent-profile.md)).
2. Sinh **`AGENTS.md`** và **`CLAUDE.md`** từ template (cùng persona; `CLAUDE.md` thêm `@import` pack).
3. Copy skeleton + docs (bước dưới), điền `README.md`, `memory/memory.md`, `memory/{current_phase}/`.
4. Nếu `new` → mỗi lần vào phase mới: nhắc skill + DOC + readiness-gate trọn gói.

Lệnh cập nhật sau: `Reconfigure agent` / `Hoàn tất profile` / `Cập nhật profile` — hỏi lại 5 câu, ghi đè profile + markdown.

### Thao tác agent khi init

1. Xác nhận `{project}/` path (hoặc tạo folder mới theo tên user cung cấp).
2. **Cá nhân hoá** — hỏi 5 câu trên; chờ đủ trả lời.
3. Copy [`project-skeleton/`](project-skeleton/) → `{project}/` (README, memory, assets, brainstorm).
4. Copy [`docs-skeleton/`](docs-skeleton/) → `{project}/docs/`.
5. Ghi `memory/profile.json`, `AGENTS.md`, `CLAUDE.md` từ [TPL-agent-profile](templates/TPL-agent-profile.md).
6. Điền `README.md`, `memory/memory.md` (chỉ meta chung), `memory/{current_phase}/` (bắt đầu phase).
7. **Không** gom context dài vào `memory/memory.md` — cập nhật đúng `memory/{phase}/`.
8. **Không** tạo thêm cấu trúc lệch chuẩn trừ khi user yêu cầu rõ.

```bash
# Tham chiếu — chạy từ thư mục cha của dự án
PROJECT={tên-dự-án}
MINIPOWER={path-tới-minipower-skill-pack}

mkdir -p "$PROJECT"
cp -R "$MINIPOWER/project-skeleton/"* "$PROJECT/"
cp -R "$MINIPOWER/docs-skeleton" "$PROJECT/docs"
```

Nguồn skeleton: [project-skeleton/INIT.md](project-skeleton/INIT.md)

### Exit init

- [ ] `memory/profile.json` hợp lệ (v1) + `AGENTS.md` + `CLAUDE.md`
- [ ] Đủ 4 nhánh: `memory/` (6 chủ đề), `assets/`, `brainstorm/`, `docs/` (7 folder) + `FAQ.md`
- [ ] `memory/memory.md` + 6 folder `memory/{phase}/` (README.md + decision-log.md)
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
