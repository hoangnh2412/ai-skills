# Thiết lập folder notes theo phase

**Ngày:** 2025-06-05  
**Phase:** Discovery (meta — cấu trúc dự án)

---

## Câu hỏi user

> Trong bộ tài liệu chưa có nơi lưu trữ các nội dung trao đổi của từng phần discovery, requirements, architecture, ... phải không?

## Phân tích

**Đúng** — trước đó chỉ có:

| Vị trí | Vai trò | Hạn chế |
|--------|---------|---------|
| `memory.md` | Context nhanh toàn dự án | Không tách phase; dễ phình |
| `assets/` | Tài liệu gốc khách hàng | Theo nguồn, không theo phase |
| `docs/` | DOC-01–18 chính thức | Kết quả đã chốt, không phải working notes |

Minipower **docs-skeleton** không định nghĩa folder session log / phase notes.

Dự án ERP-law có pattern ad-hoc (`discovery/`, `brainstom.md`) nhưng VNA-eInvoice chưa có.

## Quyết định

| ID | Quyết định | Lý do |
|----|------------|-------|
| D8 | Tạo folder **`notes/`** theo 6 phase Minipower | Lưu trao đổi, phân tích, decision log tách khỏi DOC chính thức |
| D9 | `memory.md` giữ vai trò **index + trạng thái** | Không thay thế log chi tiết từng phase |
| D10 | Khi chốt → **distill** vào `docs/` | Luồng: notes (draft) → docs (artifact) → baseline |

## Cấu trúc đã tạo

```text
notes/
├── README.md
├── discovery/          ← phiên này
├── requirements/
├── architecture/
├── planning/
├── delivery/
└── change-control/
```

## Quy ước ghi note

- Đặt tên: `YYYY-MM-DD-<stt>-<mo-ta>.md`
- Nội dung: tóm tắt trao đổi, quyết định + lý do — **không** transcript word-by-word
- Mỗi phase có `README.md` làm index

## Hành động user yêu cầu tiếp theo

> Tạo thêm folder notes và ghi **tất cả** trao đổi Discovery vào `notes/discovery/`

→ Đã tạo 4 file note + README index (note 01–04).

---

*Nguồn: trao đổi session 2025-06-05 (thiết lập notes)*
