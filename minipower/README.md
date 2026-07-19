# Minipower — Trợ lý BA + Solution Architect + PM

Version 2.5.0

## Minipower là gì?

Minipower là **một bộ skill** giúp bạn (và AI trong Cursor / Claude Code / OpenCode) làm việc như một **team BA + Solution Architect + PM** — đi từ *painpoint của khách hàng* đến *SRS, kiến trúc, kế hoạch và tài liệu bàn giao* theo một pipeline chuẩn.

Thay vì viết tài liệu tuỳ hứng, Minipower dẫn bạn qua **6 giai đoạn (phase)**, sinh ra **18 loại tài liệu (DOC)** đã chuẩn hoá theo các chuẩn nghề (IEEE 830, ISO/IEC/IEEE 29148, BABOK, PMBOK, ADR, OpenAPI…), và **giữ mọi thứ trace được với nhau** (Use Case → FR → Acceptance Criteria → Test).

**Điểm mạnh:**

- **Không nhảy giải pháp sớm** — luôn làm rõ bài toán, phạm vi, giả định trước khi thiết kế.
- **Chi phí tương xứng** — việc nhỏ (sửa typo) không phải qua đủ quy trình; việc lớn (module mới, đụng baseline) mới bật đầy đủ gate.
- **Chống ảo tưởng hoàn thành** — có gate QC đối kháng (`doc-review`) và bước tư duy phản biện (`deliberation`) trước khi chốt.
- **Làm việc nhóm song song** — nhiều BA / SA / PM cùng chạy trên các module khác nhau mà không giẫm chân.

> Cài đặt: xem [INSTALL.md](INSTALL.md). Router kỹ thuật đầy đủ: [SKILL.md](SKILL.md).

---

## 6 phase & 18 DOC

```text
Business Goal → Stakeholder → Process → Requirement → Solution
```

| Phase | Skill | Làm gì | DOC |
|-------|-------|--------|-----|
| **Discovery** | [discovery](skills/discovery/SKILL.md) | Khám phá bài toán, stakeholder, scope | 01–03 |
| **Requirements** | [requirements](skills/requirements/SKILL.md) | Use Case, Business Rule, FR/SRS, NFR, Acceptance Criteria | 04–07, 13 |
| **Architecture** | [architecture](skills/architecture/SKILL.md) | SAD, ADR, Integration, Data Model, API | 08–12 |
| **Planning** | [planning](skills/planning/SKILL.md) | Complexity, WBS, estimate, roadmap | 14–15 |
| **Delivery** | [delivery](skills/delivery/SKILL.md) | Test strategy, deployment, go-live | 16–17 |
| **Change control** | [change-control](skills/change-control/SKILL.md) | Change Request sau baseline | 18 |

**3 skill dùng chung (chạy xuyên phase):**

| Skill | Khi nào | Vai trò |
|-------|---------|---------|
| [deliberation](skills/deliberation/SKILL.md) | **Trước** khi vào phase, hoặc trước quyết định lớn | Premise Check ("có đáng làm không") + nghị luận đa góc nhìn |
| [doc-review](skills/doc-review/SKILL.md) | Cuối mỗi phase, trước baseline, sau CR | QC đối kháng — soi trace đứt, mâu thuẫn, requirement không testable |
| decision-log | Khi chốt quyết định có phương án bị loại | Lưu "tại sao" — [schema](docs/decision-log.md) |

---

## Minipower giúp được gì? (use case)

| Bạn đang cần… | Minipower hỗ trợ |
|---------------|-------------------|
| Phân tích painpoint khách hàng, soạn **bộ câu hỏi khảo sát** | Discovery + Deliberation |
| Từ yêu cầu thô, **bóc tách module / feature** và đánh giá độ khó để **chào giá** | Requirements + Planning (complexity) |
| Viết **đề xuất giải pháp / solution proposal** để chào khách | Architecture (SAD, ADR) |
| Chốt giá xong, viết **SRS** đầy đủ và trace được | Requirements (đủ 6 bước) |
| Lập **WBS, ước lượng effort, roadmap** | Planning |
| Soạn **chiến lược test, kế hoạch triển khai / go-live** | Delivery |
| Xử lý **thay đổi sau khi đã ký baseline** (Change Request) | Change control |
| **QC tài liệu** trước khi ký / bàn giao | Doc-review |
| Nhiều **BA / SA / PM làm song song** trên dự án lớn | [parallel-work](docs/parallel-work.md) |
| Cần **khung thư mục dự án chuẩn** (memory, assets, brainstorm, docs) | Init project — [SKILL.md](SKILL.md#khởi-tạo-cấu-trúc-dự-án-mặc-định) |

---

## Dùng skill nào theo từng giai đoạn dự án? (Q&A)

Cách gọi chung: gõ **`/minipower`** rồi ghi rõ **`Phase: <tên phase>`**, đính kèm file bằng **`@`**. Ví dụ:

```text
/minipower
Phase: requirements — bóc tách FR cho module billing từ @assets/public/yeu-cau.md
```

---

### 1. Đang tiếp cận khách hàng — có file painpoint tổng quan, cần đặt câu hỏi khảo sát

> *"Tôi nhận được file mô tả painpoint tổng quan của khách hàng `@painpoint.md`, cần phân tích sơ bộ để đặt ra các câu hỏi khảo sát gửi khách. Tôi nên dùng skill nào?"*

**→ Dùng `discovery` (Minipower tự chạy `deliberation` trước).**

1. Đặt file khách gửi vào `assets/public/`.
2. Gọi:
   ```text
   /minipower
   Phase: discovery — phân tích sơ bộ @assets/public/painpoint.md, đề xuất bộ câu hỏi khảo sát
   ```
3. Minipower sẽ:
   - Chạy **Premise Check** (deliberation): đây là vấn đề gốc hay triệu chứng? ai đau, đo được không? — cho verdict PROCEED / RESHAPE / STOP.
   - Vào **Brainstorm mode** của discovery: sinh **tối đa 10 câu hỏi khảo sát** quanh *phạm vi · chi phí · kiến trúc*, phân loại **Đã rõ / Chưa rõ / Chưa đề cập** và gắn `Assumption`.

**Đầu ra:** Problem statement sơ bộ + bộ câu hỏi khảo sát để gửi khách. Chưa cần viết DOC chính thức — kết quả ghi vào `brainstorm/YYYY-MM-DD.md`.

---

### 2. Đang chào giá — đã khảo sát, có file yêu cầu kỹ thuật, cần bóc tách module & ước lượng

> *"Tôi có file yêu cầu kỹ thuật `@yeu-cau-ky-thuat.md`, cần phân tích, bóc tách thành module / feature và đánh giá độ khó để ước lượng chi phí. Tôi nên dùng skill nào?"*

**→ Dùng `requirements` (bóc tách) rồi `planning` (đánh giá độ khó + estimate).**

1. `discovery` nhẹ để **chốt danh sách module & in/out scope** (DOC-03):
   ```text
   /minipower
   Phase: discovery — từ @assets/public/yeu-cau-ky-thuat.md, chốt scope + liệt kê module
   ```
2. `requirements` để **bóc FR / feature theo từng module**:
   ```text
   /minipower
   Phase: requirements — bóc tách FR Must/Should cho từng module đã liệt kê
   ```
3. `planning` để **chấm độ phức tạp & ước lượng**:
   ```text
   /minipower
   Phase: planning — chấm complexity (rubric 5 chiều) từng module, WBS + estimate sơ bộ để chào giá
   ```

**Đầu ra:** Danh sách module/feature + bảng **complexity 0–20 × 5 chiều → Small…Enterprise** ([rubric](skills/planning/complexity-rubric.md)) + WBS/estimate (DOC-14) → cơ sở lập giá. Ở giai đoạn chào giá, đây là bản *sơ bộ* (light tier), làm chi tiết đầy đủ sau khi chốt.

---

### 3. Đang chào giải pháp — có file yêu cầu kỹ thuật, cần làm file đề xuất giải pháp

> *"Tôi đã có file yêu cầu kỹ thuật `@yeu-cau-ky-thuat.md`, cần làm gì và dùng skill nào để ra file đề xuất giải pháp?"*

**→ Dùng `architecture` (kèm `deliberation` cho các lựa chọn công nghệ lớn).**

1. Đọc nhanh yêu cầu kỹ thuật, nắm **FR Must** chính (một lượt `requirements` nếu chưa có).
2. Nếu có ≥2 phương án kiến trúc/công nghệ → chạy `deliberation` để nghị luận đa góc nhìn (business, security, ops, cost…) trước khi chốt.
3. `architecture` để dựng đề xuất giải pháp:
   ```text
   /minipower
   Phase: architecture — từ @assets/public/yeu-cau-ky-thuat.md, dựng SAD + ADR các lựa chọn chính, sơ đồ tích hợp
   ```

**Đầu ra:** File đề xuất giải pháp dựa trên **DOC-08 SAD** (4+1 views: context, component, integration) + **DOC-09 ADR** (giải thích tại sao chọn công nghệ/phương án này) + sơ đồ tích hợp (DOC-10) nếu cần. Đây chính là "solution proposal" để trình khách.

---

### 4. Đã chốt giá — cần tạo SRS từ yêu cầu kỹ thuật + đề xuất giải pháp + danh sách chức năng

> *"Từ file yêu cầu kỹ thuật `@yeu-cau.md`, đề xuất giải pháp `@giai-phap.md` và danh sách chức năng `@chuc-nang.md`, tôi cần làm gì và dùng skill nào để tạo SRS?"*

**→ Dùng `requirements` (đây là bước sản xuất SRS chính — DOC-06).**

1. Nếu chưa có khung dự án → **Init project** trước (`/minipower` + `Init project`), rồi bỏ 3 file input vào `assets/public/`.
2. `discovery` chốt **scope baseline** (DOC-03) — SRS cần scope làm mốc.
3. `requirements` chạy **đủ 6 bước** để ra SRS:
   ```text
   /minipower
   Phase: requirements — từ @assets/public/yeu-cau.md + @assets/public/giai-phap.md + @assets/public/chuc-nang.md,
   dựng SRS đầy đủ cho từng module
   ```
   Trình tự: **Actor & Use Case (DOC-05)** → **Business Rules (DOC-04)** → **FR / SRS (DOC-06)** → **NFR (DOC-13)** → **Acceptance Criteria — Gherkin (DOC-07)**, và **trace UC → FR → AC** trong `05-traceability/trace-matrix.md`.
4. Trước khi baseline SRS → chạy `doc-review` (QC đối kháng) làm gate, phải **PASS (0 Blocker)** mới ký.

**Đầu ra:** Bộ SRS đầy đủ (DOC-04, 05, 06, 07, 13) + trace matrix. Đây là **full tier** — làm kỹ vì là tài liệu ký kết.

---

### 5. Đã có SRS — tiếp theo cần làm gì?

**→ `architecture` → `planning` → `delivery`, với `doc-review` làm gate ở mỗi mốc.**

| Tiếp theo | Skill | Đầu ra |
|-----------|-------|--------|
| Thiết kế kỹ thuật chi tiết theo SRS (nếu đề xuất giải pháp mới ở mức khái quát) | `architecture` | SAD, ADR, Data Model (DOC-11), API/OpenAPI (DOC-12) |
| Ước lượng chi tiết, lập kế hoạch triển khai | `planning` | WBS + estimate (DOC-14), roadmap/plan (DOC-15) |
| Chiến lược test & kế hoạch go-live | `delivery` | Test strategy (DOC-16), deployment guide (DOC-17) |
| QC tài liệu trước ký / trước go-live | `doc-review` | Verdict PASS/BLOCK |
| Có thay đổi sau khi baseline | `change-control` | Change Request (DOC-18), re-baseline vX.Y |

Nguyên tắc: **doc-review** cuối mỗi phase và **bắt buộc trước baseline/go-live**; sau khi đã baseline, mọi sửa đổi phải đi qua **change-control** (không sửa trực tiếp `docs/02-baseline/`).

---

### 6. Team có 3 BA, 1 SA, 1 PM — dùng Minipower thế nào cho hiệu quả?

**→ Chia theo module + vai trò, đồng bộ qua trace-matrix + memory.** Chi tiết: [docs/parallel-work.md](docs/parallel-work.md).

| Vai | Phase chính | Sở hữu folder | Việc |
|-----|-------------|---------------|------|
| **BA1** | requirements | `docs/03-modules/{module-a}/` | Elicit & phân tích module A |
| **BA2** | requirements | `docs/03-modules/{module-b}/` | Elicit & phân tích module B |
| **BA3** | requirements | `docs/03-modules/{module-c}/` | Elicit & phân tích module C |
| **SA** | architecture | `docs/04-platform/` | SAD, ERD, API, integration — phần dùng chung |
| **PM** | discovery, planning | `docs/00-governance/`, `memory/planning/` | Scope, WBS, timeline, milestone |

**Quy tắc vàng:**

1. **Một module = một owner** — chỉ owner sửa DOC-04–07 trong folder module đó.
2. **SA không sửa FR/UC của BA** — thiếu thì ghi `TBD` + note, yêu cầu BA bổ sung. SA có thể làm song song core base, shared data model, integration contract **không cần chờ** BA xong hết.
3. **PM không chờ SRS hoàn chỉnh** — WBS khung từ DOC-03 + FR Must đã có; plan là living document tới trước baseline.
4. **File dùng chung tránh sửa cùng lúc:** DOC-03, `overview.md`, `trace-matrix.md`, `doc-registry.md` — mỗi người thêm dòng của mình, sync cuối ngày.
5. **Sync ngắn ~15 phút:** module nào đã có FR Must? Module mới trong DOC-03? SA có assumption cần BA xác nhận? Ai cập nhật trace matrix hôm nay?

**Ví dụ prompt song song:**

```text
/minipower
Phase: requirements — module {module-a}, cập nhật DOC-05/06, owner BA1
```
```text
/minipower
Phase: architecture — shared data model + API contract giữa {module-a} và {module-b};
đọc FR Must hiện có, phần chưa rõ ghi TBD trong memory/architecture/
```

---

## Tài liệu tham khảo

| Bạn cần | File |
|---------|------|
| Cài đặt (skill + rules/hooks) | [INSTALL.md](INSTALL.md) |
| Router kỹ thuật đầy đủ, init project, phân tầng micro/light/full | [SKILL.md](SKILL.md) |
| Pipeline, nguyên tắc, luồng artifact | [docs/pipeline.md](docs/pipeline.md) |
| Làm việc song song (multi-BA / SA / PM) | [docs/parallel-work.md](docs/parallel-work.md) |
| Template 18 DOC | [templates/README.md](templates/README.md) |
| Khung folder `docs/` của dự án | [docs-skeleton/README.md](docs-skeleton/README.md) |
| DOC versioning (Version sau sign-off) | [docs-skeleton/00-governance/doc-versioning.md](docs-skeleton/00-governance/doc-versioning.md) |
| Token guard (scope, hooks) | [docs/token-guard.md](docs/token-guard.md) |
| Người mới join **dự án** — đọc tài liệu | [project-skeleton/README.md](project-skeleton/README.md) |

---

## Cấu trúc pack

```text
minipower/
├── README.md          ← File này — giới thiệu & Q&A theo giai đoạn
├── INSTALL.md         ← Hướng dẫn cài đặt
├── SKILL.md           ← Router kỹ thuật (menu / của Cursor)
├── skills/            ← 6 phase + 3 skill dùng chung
├── agents/            ← Guardrails agent (token, sửa DOC)
├── install/           ← Adapter cài rules/hooks (cursor / claude / opencode)
├── docs/              ← Tài liệu framework (pipeline, parallel-work, token-guard)
├── templates/         ← Khung 18 DOC
├── project-skeleton/  ← Khung dự án: memory, assets, brainstorm
└── docs-skeleton/     ← Khung folder docs/ (artifact dự án)
```
