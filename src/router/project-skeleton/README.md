# {Tên dự án}

Dự án quản lý theo **Minipower** — BA + Solution Architect + TPM.

| Mục | Giá trị |
|-----|---------|
| **Khách hàng** | *(điền)* |
| **Phase hiện tại** | *(discovery / requirements / …)* |
| **Baseline** | — *(draft)* |

## Cấu trúc

| Thư mục | Vai trò |
|---------|---------|
| [`memory/`](memory/) | Entry agent cá nhân (`memory.md`) + DEC / open-questions / doc-debt (đội) + SQLite |
| [`assets/`](assets/) | Giữ **bản gốc** khảo sát, checklist, biên bản — không sửa file gốc |
| [`brainstorm/`](brainstorm/) | Phân tích, trao đổi theo ngày; chốt → distill vào `docs/` |
| [`docs/`](docs/) | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |
| [`FAQ.md`](FAQ.md) | FAQ hướng dẫn thiết lập sẵn — hỏi AI khi không biết làm gì tiếp |

`backend/`, `frontend/`, `mobile/`, `autotest/` chỉ có khi init chọn bề mặt đó. Mỗi folder một README; init không sinh framework hay solution.

**Đầu phiên agent:** [`memory/memory.md`](memory/memory.md) (copy từ [`memory/memory.md.example`](memory/memory.md.example) nếu chưa có).

---

## Người mới join — cách đọc tài liệu

Dự án có nhiều file; **không cần đọc hết**. Artifact chính thức trong `docs/`; working paper trong `brainstorm/`; sổ cá nhân / đội trong `memory/`.

### Bước 1 — Tổng quan (~5 phút)

| # | File | Mục đích |
|---|------|----------|
| 1 | [`memory/memory.md`](memory/memory.md) | Hiện trạng *của bạn* + nhắc việc + link DEC/open-Q |
| 2 | [`docs/01-project/DOC-01-vision-business-case.md`](docs/01-project/DOC-01-vision-business-case.md) | Vì sao làm dự án |
| 3 | [`docs/01-project/DOC-02-stakeholder-analysis.md`](docs/01-project/DOC-02-stakeholder-analysis.md) | Ai liên quan, ai quyết định |
| 4 | [`docs/01-project/DOC-03-brd.md`](docs/01-project/DOC-03-brd.md) | **Scope**, danh sách module, in/out |
| 5 | [`docs/05-traceability/doc-registry.md`](docs/05-traceability/doc-registry.md) · [`trace-matrix.md`](docs/05-traceability/trace-matrix.md) | Registry DOC + trace |

### Bước 2 — Theo vai trò (~15–30 phút)

| Vai trò | Đọc thêm |
|---------|----------|
| **BA** | Module được giao trong DOC-03 · `docs/03-modules/{id}/` · [`memory/open-questions.md`](memory/open-questions.md) |
| **SA** | [`docs/04-platform/`](docs/04-platform/) DOC-08 · [`memory/decision-log.md`](memory/decision-log.md) (DEC-ARC) |
| **PM** | [`docs/00-governance/DOC-15-project-plan.md`](docs/00-governance/DOC-15-project-plan.md) · [`memory/doc-debt.md`](memory/doc-debt.md) |
| **Dev / QA** | Module mình → DOC-06, DOC-07 · API → DOC-12 |
| **Mọi người** | [`trace-matrix.md`](docs/05-traceability/trace-matrix.md) — UC → FR → AC |

### Bước 3 — Đọc gì, tránh gì

| Đọc khi cần | Tránh đọc ngay từ đầu |
|-------------|------------------------|
| `docs/` — artifact đã distill | Toàn bộ `brainstorm/` — chỉ khi trace quyết định / blocker |
| `memory/decision-log.md` · `open-questions.md` | `assets/` — trừ khi cần bản gốc khảo sát |
| `docs/02-baseline/` — **đã sign-off** (chỉ đọc) | Sửa trực tiếp file trong `02-baseline/` |

**Quy tắc:** Nội dung chốt nằm trong `docs/`. `brainstorm/` là nháp; `memory.md` là sổ **cá nhân** — nếu lệch, **ưu tiên `docs/`**.

**Dự án còn discovery:** Bước 1 dừng ở DOC-01–03; chưa bắt buộc DOC-04–07.

**Đã full baseline:** Tra cứu đã ký → `docs/02-baseline/vX.Y/`; thay đổi sau ký → `docs/06-changes/CR-xxx/`.

### Đọc từng module — thứ tự chuẩn

Mỗi module nằm trong `docs/03-modules/{module-id}/`. Trước khi vào folder, kiểm tra module có trong [`DOC-03`](docs/01-project/DOC-03-brd.md).

```text
DOC-03 (dòng module)  →  README module  →  DOC-04 BR  →  DOC-05 UC  →  DOC-06 FR  →  DOC-07 AC
                                                              ↓
                                              trace-matrix (dòng module)  →  DOC-16 test (nếu có)
                                                              ↓
                                              04-platform: DOC-10/12 (phần liên quan module)
```

| # | File | Đọc để biết |
|---|------|-------------|
| 0 | [`docs/01-project/DOC-03-brd.md`](docs/01-project/DOC-03-brd.md) | Module in scope, priority, MOD prefix |
| 1 | `docs/03-modules/{module-id}/README.md` | Owner, MOD prefix, danh sách file |
| 2 | `DOC-04-business-rules.md` | Rule nghiệp vụ, ràng buộc |
| 3 | `DOC-05-use-cases.md` | Luồng người dùng, actor |
| 4 | `DOC-06-srs.md` | Functional requirement (FR Must trước) |
| 5 | `DOC-07-acceptance-criteria.md` | Điều kiện nghiệm thu (Gherkin) |
| 6 | [`docs/05-traceability/trace-matrix.md`](docs/05-traceability/trace-matrix.md) | Trace UC → FR → AC → test |
| 7 | `DOC-16-test-strategy.md` (trong module) | Chiến lược test module |
| 8 | [`docs/04-platform/`](docs/04-platform/) DOC-08/10/12 | Kiến trúc, tích hợp, API **ảnh hưởng module** |

**Module gọi module khác:** DOC-05/06 module mình → DOC-10 hoặc sequence trong `04-platform/` / `brainstorm/` → DOC-06 module đối tác (chỉ FR/API liên quan) → `trace-matrix` dòng cross-module.

**Dev chỉ làm một module:** Bước 1 (memory + DOC-03) + thứ tự module trên + DOC-12 slice (nếu có).

### Checklist ngày đầu

- [ ] Có `memory/memory.md` (copy từ `.example` nếu thiếu) — phase, module, nhắc việc
- [ ] Đọc DOC-01 → DOC-03
- [ ] Xác định module phụ trách (hỏi PM / DOC-03)
- [ ] Đọc module theo thứ tự DOC-04 → 07
- [ ] Hỏi owner module nếu DOC-06 còn nhiều TBD
- [ ] **Chưa** đọc hết `brainstorm/` — chỉ mở file được link từ memory / DEC
