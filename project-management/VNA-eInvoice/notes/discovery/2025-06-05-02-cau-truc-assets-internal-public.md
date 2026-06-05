# Cấu trúc assets — internal vs public

**Ngày:** 2025-06-05  
**Phase:** Discovery (chuẩn bị thu thập tài liệu)

---

## Yêu cầu user

Trong folder `assets/`, tạo thêm 2 folder con:

1. **`internal/`** — biên bản họp, tài liệu nội bộ, **không gửi khách hàng**
2. **`public/`** — tài liệu, biên bản họp **với khách hàng VNA**

*(User gõ "pubilc" — đã dùng tên đúng `public/`)*

## Quyết định

| ID | Quyết định | Lý do |
|----|------------|-------|
| D5 | Phân loại `assets/public/` vs `assets/internal/` | Tách tài liệu share với VNA vs nội bộ M-invoice |
| D6 | Giữ nguyên bản gốc trong `assets/`; phân tích → `docs/` | Traceability, không sửa file khách hàng |
| D7 | Đặt tên gợi ý: `YYYY-MM-DD_<loại>_<chủ-đề>.<ext>` | Dễ tìm theo thời gian |

## Quy tắc phân loại

| Vào `public/` | Vào `internal/` |
|---------------|-----------------|
| Có VNA tham gia / đã share cho VNA | Chỉ team M-invoice |
| Email, spec, MoM đã gửi khách | Biên bản họp nội bộ, draft chưa gửi |
| Checklist Q&A đã share | Checklist nội bộ (bản đầy đủ hơn) |

## Cấu trúc sau cập nhật

```text
assets/
├── README.md
├── public/       ← VNA
└── internal/     ← nội bộ
```

## Hệ quả sau này

- Checklist Q&A **nội bộ** (`internal/noi-bo_*.csv`) có **nhiều câu hơn** bản gửi khách (`public/khach-hang_*.csv`) — cần gộp master trước vòng 2 khảo sát.

---

*Nguồn: trao đổi session 2025-06-05 (cấu trúc assets)*
