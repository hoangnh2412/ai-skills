# Rubric Complexity — 5 chiều × 0–4 → 0–20

Chấm **5 chiều**, mỗi chiều **0–4**, cộng lại **0–20** rồi tra bucket. Mục tiêu: điểm **tái lập được** giữa hai session/hai người — không "cảm tính". Luôn ghi điểm từng chiều + 1 câu lý do vào DOC-14.

## 5 chiều

| # | Chiều | 0 | 2 | 4 |
|---|-------|---|---|---|
| 1 | **Phạm vi** (module/feature/story) | 1 module, vài story | 2–3 module, hoặc 1 module nhiều luồng | ≥4 module, hoặc quy mô cả nền tảng |
| 2 | **Tích hợp** (hệ thống ngoài, API, đồng bộ) | Không tích hợp | 1–2 hệ thống ngoài, API sẵn có | Nhiều hệ thống, realtime/đồng bộ 2 chiều, API phải xây |
| 3 | **Dữ liệu** (entity, migration, chất lượng nguồn) | Ít entity, không migrate | Migrate vừa, dữ liệu nguồn khá sạch | Mô hình lớn, migrate nặng, dữ liệu nguồn bẩn/nhiều nguồn |
| 4 | **Bên liên quan & quy trình** | 1 bên, quy trình thẳng | Vài bên, có phê duyệt | Nhiều bên xung đột lợi ích, quy trình nhiều nhánh/ngoại lệ |
| 5 | **Phi chức năng & rủi ro** (NFR, bảo mật, compliance, tải, độ mới CN) | NFR nhẹ, công nghệ quen | Có NFR rõ (hiệu năng/bảo mật), 1 điểm mới | Compliance ngặt, tải lớn, công nghệ mới chưa kiểm chứng |

> Chiều giữa (1, 3) chấm điểm lẻ (1, 3) khi rơi giữa hai mốc. Nếu một chiều "không biết đủ để chấm" → đó là tín hiệu **thiếu discovery/SRS**, ghi vào Assumptions, không đoán bừa.

## Bucket

| Tổng | Cỡ | Hàm ý |
|------|-----|-------|
| **0–5** | **Small** | 1 người, vài ngày–1 tuần. WBS phẳng, bỏ qua phần lớn ceremony. |
| **6–10** | **Medium** | 1 nhóm nhỏ, vài tuần. Cần WBS 2 tầng + milestone. |
| **11–15** | **Large** | Nhiều nhóm, nhiều sprint. Cần roadmap, phân rã Epic→Feature→Story, quản trị rủi ro. |
| **16–20** | **Enterprise** | Chương trình đa nhóm/đa quý. Cần governance, phụ thuộc chéo, kế hoạch tích hợp & release. |

## Ví dụ

- "Thêm nút export CSV cho 1 màn hình" → PV 0, TH 0, DL 0, BL 0, PCN 1 = **1 → Small**.
- "Module billing mới, tích hợp cổng thanh toán, có compliance PCI" → PV 2, TH 4, DL 2, BL 3, PCN 4 = **15 → Large** (sát Enterprise — soi lại NFR/rủi ro trước khi chốt).
