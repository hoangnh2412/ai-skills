# Thiết lập dự án & cấu trúc ban đầu

**Ngày:** 2025-06-05  
**Phase:** Discovery (khởi tạo dự án)  
**Người tham gia:** User, Agent (Cursor + Minipower)

---

## Bối cảnh trao đổi

User yêu cầu thiết lập dự án **triển khai hoá đơn điện tử cho VNA (Vietnam Airlines)** dùng skill **Minipower**. File `memory.md` dùng để tóm tắt ngữ cảnh cho các cuộc hội thoại mới.

## Quyết định

| ID | Quyết định | Lý do |
|----|------------|-------|
| D1 | Dùng **Minipower** làm phương pháp quản lý dự án (BA + SA + TPM) | User chỉ định; pipeline 12 bước, 18 DOC |
| D2 | Tài liệu **từ khách hàng** → folder `assets/` | Tách bản gốc khỏi artifact sinh ra |
| D3 | Artifact dự án → folder `docs/` theo **docs-skeleton** Minipower | Chuẩn hóa DOC-01–18, traceability, baseline |
| D4 | `memory.md` ở root — đọc đầu tiên khi session mới | Nắm context nhanh |

## Cấu trúc đã tạo

```text
VNA-eInvoice/
├── memory.md
├── assets/
└── docs/          ← copy từ minipower/docs-skeleton
    ├── 00-governance/
    ├── 01-project/
    ├── 02-baseline/
    ├── 03-modules/
    ├── 04-platform/
    ├── 05-traceability/
    └── 06-changes/
```

## Trạng thái lúc đó

- Phase: chưa bắt đầu discovery — chờ tài liệu khách hàng
- Chưa có file trong `assets/`
- DOC-01–03 trong `docs/01-project/` vẫn là skeleton placeholder

## Ghi chú agent

- Không nhảy sang giải pháp/kiến trúc trước khi discovery & requirements có nền tảng
- Cập nhật `memory.md` sau mỗi phiên quan trọng

---

*Nguồn: trao đổi session 2025-06-05 (thiết lập dự án)*
