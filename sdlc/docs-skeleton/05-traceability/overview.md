# Overview — {Tên dự án}

> **Đọc trong ~30 giây** — rollup tiến độ dự án. Chi tiết requirement → [`trace-matrix.md`](trace-matrix.md) · từng DOC → [`doc-registry.md`](doc-registry.md).

| Meta | Giá trị |
|------|---------|
| **Cập nhật** | YYYY-MM-DD |
| **Người rollup** | PM / *(điền)* |
| **Nguồn sync** | DOC-03 · DOC-15 · trace-matrix · doc-registry · `memory/{phase}/` |

---

## Snapshot

| Chỉ số | Giá trị |
|--------|---------|
| **Phase hiện tại** | *(discovery / requirements / architecture / planning / delivery)* |
| **Baseline** | *(chưa / DOC-01–03 / module BL / full BL)* |
| **Module (in scope)** | 0 |
| **FR Must (tổng)** | 0 |
| **FR đã baseline** | 0 |
| **FR đang phân tích** | 0 |
| **FR chưa mở** | 0 |
| **Blocker mở** | 0 |

---

## Module × pipeline

Tiến độ theo pipeline Minipower. Ký hiệu: `—` chưa · `◐` đang · `✓` xong · `BL` đã baseline.

| Module | Owner | Discovery | Req (04–07) | Arch slice | Plan | Delivery | Sign-off | Ghi chú |
|--------|-------|-----------|-------------|------------|------|----------|----------|---------|
| *(module-id)* | BA | — | — | — | — | — | — | |

**Đạt từng cột khi:**

| Cột | Điều kiện |
|-----|-----------|
| Discovery | Có trong [`DOC-03`](../01-project/DOC-03-brd.md), in scope |
| Req | DOC-04–07 có FR Must + AC tương ứng |
| Arch slice | DOC-08/10/12 có phần liên quan module |
| Plan | FR Must đã vào DOC-14 |
| Delivery | DOC-16/17 có test cho module |
| Sign-off | `doc-registry` = Baseline hoặc có trong `02-baseline/` manifest |

---

## Công việc & milestone

### Milestones (tóm tắt)

| ID | Milestone | Deliverable | Target | Trạng thái |
|----|-----------|-------------|--------|------------|
| M1 | | | | *(planned / in progress / done)* |

→ Chi tiết: [`DOC-15`](../00-governance/DOC-15-project-plan.md) · WBS: [`DOC-14`](../04-platform/)

### Việc 1–2 tuần tới

| Việc | Owner | Module | Due | Trạng thái |
|------|-------|--------|-----|------------|
| | | | | |

---

## Blocker / TBD

| ID | Module / FR | Vấn đề | Owner | ETA | Tham chiếu |
|----|-------------|--------|-------|-----|------------|
| BLK-001 | | | | | `brainstorm/` hoặc `memory/requirements/` |

---

## Quy tắc cập nhật

| Ai | Cập nhật phần | Khi nào |
|----|---------------|---------|
| **PM** | Snapshot, milestones, 2 tuần tới | Sync định kỳ (~15 phút) |
| **BA (owner module)** | Dòng pipeline module mình, blocker | Cuối phiên requirements |
| **SA** | Cột Arch, TBD platform | Khi có slice API / integration |
| **Bất kỳ** | Đếm FR từ trace-matrix | Sau distill vào `docs/` |

**Không** ghi chi tiết FR, transcript, SRS dài vào file này — dùng `trace-matrix`, `03-modules/`, `brainstorm/`.
