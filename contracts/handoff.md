# Handoff boundaries — điểm bàn giao H1–H6 (GIAO THỨC)

**Trạng thái:** 🟢 Nguyên tắc **per-module đã sống** ([ADR-020](../ADRs/ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) QĐ-13/14 — `prereq-gate` kiểm tiền đề theo module, `fan-out` = pipeline theo module). Hai điểm liên-repo **H4/H6** chờ mô hình 2 repo — xem [cross-repo-bridge.md](cross-repo-bridge.md).

Tổng quát bảng *"Mức tối thiểu để dev bắt đầu"* của [parallel-work.md](../sdlc/docs/parallel-work.md) thành boundary có tên. Mỗi boundary = một hợp đồng: **producer đóng gói input tối thiểu → consumer bắt đầu**.

| ID | Từ → đến | Input tối thiểu | Liên repo |
|----|----------|-----------------|:---------:|
| **H1** | Discovery → Requirements | DOC-03 scope đã review; module đăng ký trong BRD | — |
| **H2** | Requirements → Architecture | DOC-06 + DOC-13 draft (theo module thiết kế) | — |
| **H3** | Requirements → Planning | DOC-06 Must-have (từng module) | — |
| **H4** | Architecture → **Implementation** | DOC-08 + DOC-11 + DOC-12 API slice (theo module) | **✅ docs→code** |
| **H5** | Requirements/Delivery → **QA** | DOC-07 AC + DOC-16 test strategy | tùy |
| **H6** | Implementation → **Delivery/Ops** | build artifact + DOC-17 deployment guide | **✅ code→ops** |

**H4** và **H6** là hai điểm nối liên repo — chỗ repo docs bắt tay repo code (Jarvis). Xem [cross-repo-bridge.md](cross-repo-bridge.md).

## 1. Handoff là **per-module**, không phải per-project

Sau [ADR-020](../ADRs/ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) QĐ-14, mỗi boundary xảy ra **cho từng module một**, theo nhịp riêng của module đó:

> `ORD` qua **H4** sang code trong khi `INV` còn chưa qua **H2**. Đó là trạng thái **đúng**, không phải lệch pha cần đồng bộ.

| | |
|---|---|
| **Đơn vị bàn giao** | Một module, không phải cả dự án. "Input tối thiểu" ở bảng trên đọc là *"tối thiểu **cho module đang bàn giao**"* |
| **Ai mở cổng** | **Người**. Không hook nào phán module đã đủ để qua boundary — `prereq-gate` chỉ nhắc khi thiếu DOC tiền đề *của đúng module đó* (QĐ-13), và ở `standard` nó chặn với lối thoát `BYPASS` |
| **Không có vạch đích chung** | Không boundary nào chờ "mọi module xong". Tổng hợp (trace-matrix, BRD đầy đủ) là **bước riêng** do lead làm khi cần |
| **Chế độ dự án** | `mvp`/`maintain` hạ *input tối thiểu* theo `prereq_overrides`, **không** bỏ boundary. Cái hụt ghi `memory/doc-debt.md` |

**Hệ quả cho repo consumer (Jarvis):** nhận bàn giao theo module, không chờ trọn bộ docs. Thiếu gì thì nêu tên module + DOC cụ thể, đừng trả lại cả lô.

## 2. Quy tắc boundary

| # | Quy tắc |
|---|---------|
| 1 | **Một boundary — một producer owner.** Chỉ owner đóng băng artifact bàn giao. |
| 2 | **Input tối thiểu là hợp đồng, không phải "toàn bộ".** Consumer bắt đầu khi đủ mức tối thiểu; phần thiếu → producer ghi `TBD`/assumption. |
| 3 | **Thiếu thì TBD, không bịa.** |
| 4 | **Đổi artifact đã bàn giao qua baseline → CR.** Không sửa trực tiếp snapshot đã ký. |

## 3. Vòng đời end-to-end (ví dụ một module)

```text
BA:   BILL-FR-021, BILL-AC-005        (repo docs, H2→)
SA:   DOC-08 §billing, DOC-12 /billing/retry, ADR-005   (H4 freeze + pin)
BE:   BILL-CMP-003 (RetryHandler) — PR nhắc BILL-FR-021 (repo code, H4→)
QA:   BILL-TEST-004 → BILL-AC-005     (H5)
Ops:  BILL-DEPLOY-001 theo DOC-17     (H6, back-ref về trace-matrix)
```

Mọi mắt xích trace ngược về `BILL-FR-021`/`BILL-AC-005` → khép kín [trace-spine.md](trace-spine.md).

---

*Liên quan:* [trace-spine.md](trace-spine.md) · [cross-repo-bridge.md](cross-repo-bridge.md) (H4/H6 liên repo) · [parallel-work](../sdlc/docs/parallel-work.md)
