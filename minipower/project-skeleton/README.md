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
| [`memory/`](memory/) | Index context theo chủ đề (`memory.md` + `discovery/` … `change-control/`) |
| [`assets/`](assets/) | Giữ **bản gốc** khảo sát, checklist, biên bản — không sửa file gốc |
| [`brainstorm/`](brainstorm/) | Phân tích, trao đổi, decision log theo ngày; chốt → distill vào `docs/` |
| [`docs/`](docs/) | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |

**Tổng quan 30s:** [`docs/05-traceability/overview.md`](docs/05-traceability/overview.md) · **Context agent:** [`memory/memory.md`](memory/memory.md)

---

## Người mới join — cách đọc tài liệu

Dự án có nhiều file; **không cần đọc hết**. Đọc theo thứ tự — artifact chính thức trong `docs/`, working paper trong `brainstorm/` / `memory/`.

### Bước 1 — Tổng quan (~5 phút)

| # | File | Mục đích |
|---|------|----------|
| 1 | [`docs/05-traceability/overview.md`](docs/05-traceability/overview.md) | Phase, module, tiến độ, blocker, việc 2 tuần tới |
| 2 | [`docs/01-project/DOC-01-vision-business-case.md`](docs/01-project/DOC-01-vision-business-case.md) | Vì sao làm dự án |
| 3 | [`docs/01-project/DOC-02-stakeholder-analysis.md`](docs/01-project/DOC-02-stakeholder-analysis.md) | Ai liên quan, ai quyết định |
| 4 | [`docs/01-project/DOC-03-brd.md`](docs/01-project/DOC-03-brd.md) | **Scope**, danh sách module, in/out |
| 5 | [`memory/memory.md`](memory/memory.md) | Phase hiện tại + link context theo chủ đề |

### Bước 2 — Theo vai trò (~15–30 phút)

| Vai trò | Đọc thêm |
|---------|----------|
| **BA** | [`memory/requirements/`](memory/requirements/) · module được giao trong `overview.md` (cột Owner) |
| **SA** | [`docs/04-platform/`](docs/04-platform/) DOC-08 (nếu có) · [`memory/architecture/`](memory/architecture/) |
| **PM** | [`docs/00-governance/DOC-15-project-plan.md`](docs/00-governance/DOC-15-project-plan.md) · [`memory/planning/`](memory/planning/) |
| **Dev / QA** | Module mình implement → DOC-06, DOC-07 · API → DOC-12 (platform) |
| **Mọi người** | [`docs/05-traceability/trace-matrix.md`](docs/05-traceability/trace-matrix.md) — trace UC → FR → AC |

### Bước 3 — Đọc gì, tránh gì

| Đọc khi cần | Tránh đọc ngay từ đầu |
|-------------|------------------------|
| `docs/` — artifact đã distill | Toàn bộ `brainstorm/` — chỉ khi trace quyết định / blocker |
| `memory/{phase}/` — tóm tắt ngắn | `assets/` — trừ khi cần bản gốc khảo sát |
| `docs/02-baseline/` — **đã sign-off** (chỉ đọc) | Sửa trực tiếp file trong `02-baseline/` |

**Quy tắc:** Nội dung chốt nằm trong `docs/`. `brainstorm/` và `memory/` là bản nháp / index — nếu lệch nhau, **ưu tiên `docs/`** (hoặc `02-baseline/` nếu đã baseline).

**Dự án còn discovery:** Bước 1 dừng ở DOC-01–03 + `memory/discovery/`; chưa bắt buộc DOC-04–07.

**Đã full baseline:** Tra cứu đã ký → `docs/02-baseline/vX.Y/`; thay đổi sau ký → `docs/06-changes/CR-xxx/`.

### Đọc từng module — thứ tự chuẩn

Mỗi module nằm trong `docs/03-modules/{module-id}/`. Trước khi vào folder, kiểm tra module có trong [`DOC-03`](docs/01-project/DOC-03-brd.md) và dòng tương ứng trong [`overview.md`](docs/05-traceability/overview.md).

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

**Dev chỉ làm một module:** Bước 1 (overview + DOC-03) + thứ tự module trên + DOC-12 slice (nếu có).

### Checklist ngày đầu

- [ ] Đọc `overview.md` — biết phase, module mình, blocker
- [ ] Đọc DOC-01 → DOC-03
- [ ] Xác định module phụ trách (hỏi PM / xem `overview.md` cột Owner)
- [ ] Đọc module theo thứ tự DOC-04 → 07
- [ ] Hỏi owner module nếu DOC-06 còn nhiều TBD
- [ ] **Chưa** đọc hết `brainstorm/` — chỉ mở file được link từ `overview` / `memory`
