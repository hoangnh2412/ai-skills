# Memory — VNA eInvoice

> **Mục đích:** Tóm tắt ngữ cảnh dự án để đọc nhanh khi bắt đầu cuộc hội thoại mới. Cập nhật sau mỗi phiên làm việc quan trọng.

---

## Dự án

| Mục | Giá trị |
|-----|---------|
| **Tên** | Triển khai hoá đơn điện tử cho VNA (Vietnam Airlines) |
| **Khách hàng** | VNA |
| **Phương pháp** | [Minipower](../../../.cursor/skills/minipower/SKILL.md) — BA + Solution Architect + TPM |
| **Root** | `project-management/VNA-eInvoice/` |
| **Phase hiện tại** | **Discovery** — đã có Q&A khảo sát v1 + biên bản họp nội bộ 04/06/2026 |
| **Baseline** | — *(draft)* |

## Cấu trúc folder

```text
VNA-eInvoice/
├── memory.md          ← file này (context hội thoại)
├── assets/            ← Tài liệu thô (không phải artifact minipower)
│   ├── public/        ← Tài liệu & biên bản họp với khách hàng VNA
│   └── internal/      ← Biên bản họp nội bộ, tài liệu không gửi khách
├── notes/             ← Trao đổi & working papers theo phase
│   ├── discovery/         ← đang thực hiện
│   ├── requirements/
│   ├── architecture/
│   ├── planning/
│   ├── delivery/
│   └── change-control/    ← index: notes/README.md
└── docs/              ← Artifact minipower (DOC-01–18, theo docs-skeleton)
    ├── 00-governance/
    ├── 01-project/        DOC-01–03 (discovery)
    ├── 02-baseline/
    ├── 03-modules/        DOC-04–07, 16 (theo module)
    ├── 04-platform/       DOC-08–14, 17
    ├── 05-traceability/
    └── 06-changes/
```

**Quy ước quan trọng:**
- **`assets/public/`** — tài liệu & biên bản họp với VNA; giữ bản gốc, không sửa.
- **`assets/internal/`** — họp nội bộ, ghi chú team; không gửi khách hàng.
- **`notes/{phase}/`** — trao đổi, phân tích, decision log; chốt → distill vào `docs/`.
- **`docs/`** — artifact sinh ra từ workflow minipower; trace về nguồn trong `assets/` khi cần.

## Minipower — routing nhanh

| Phase / intent | Skill con | DOC |
|----------------|-----------|-----|
| discovery, scope, brainstorm | `skills/discovery/SKILL.md` | 01–03 |
| requirements, UC, FR, SRS | `skills/requirements/SKILL.md` | 04–07, 13 |
| architecture, SAD, ADR, API | `skills/architecture/SKILL.md` | 08–12 |
| planning, WBS, estimate | `skills/planning/SKILL.md` | 14–15 |
| delivery, test, deploy | `skills/delivery/SKILL.md` | 16–17 |
| change-control, CR | `skills/change-control/SKILL.md` | 18 |

**Cách gọi trong Cursor:** `/minipower` + `Phase: discovery` (hoặc phase tương ứng).

## Trạng thái hiện tại

- [x] Thiết lập cấu trúc folder (`assets/`, `docs/` skeleton)
- [x] Nhận Q&A khảo sát + đầu mối VNA (`assets/public/`, `assets/internal/`)
- [ ] Hoàn thiện discovery — bổ sung câu hỏi kỹ thuật, họp Buổi 1 (chị Nga)
- [ ] Phase: discovery — DOC-01 Vision, DOC-02 Stakeholder, DOC-03 BRD
- [ ] Xác định module / bounded context (đăng ký trong DOC-03)
- [ ] Baseline v1.0

## Module (draft từ Q&A)

| Module ID | MOD | Hệ nguồn | Volume (ước) |
|-----------|-----|----------|--------------|
| receipt | RCP | Amadeus 1A, PRA/REV, Back office | Realtime phòng vé + API |
| cargo | CRG | Cargospot, CRA | ~50 HĐ/ngày |
| online | ONL | TMĐT + 1A | Batch T+1→T+5/T+6 |
| agent | AGT | Amadeus HOST, GDS, HOT→REV | ~22–23k GD/ngày; HĐ 4 lần/tháng |
| gas | GAS | GAS (vendor) | ~250 HĐ/tháng |
| sis | SIS | PRA, SISM, CRA → IATA SIS | Theo Advice Day / kỳ ICH |
| reconcile | REC | PRA, CRA, SIS → **mới** | Chưa có hệ thống |
| tax-rpt | TAX | Cross-module | Mục tiêu hệ thống mới |

## Stakeholder (từ đầu mối VNA)

| Vai trò | Người | Phạm vi |
|---------|-------|---------|
| Đầu mối tổng / HK | Nguyễn T.Hồng Nga | Receipt, Online, ĐL |
| HK | Phạm Thu Hằng, Đỗ Thúy Hồng | Nghiệp vụ vé |
| HH | Hoàng Tuấn Việt, Lê Thu Hằng | Cargo |
| GAS | Nguyễn Tuyết Liên, Hồ Xuân Tam | Thu khác |
| ITL/SIS | Nguyễn Huyền Linh, Phạm Thu Hà | Interline |
| Kế toán/REV | Ngô Kim Lan | Đối soát, hạch toán |
| Nghiệp vụ tổng (dự kiến) | Chị Hà | RACI nghiệp vụ |
| Sponsor timeline | Anh Hoàng, anh Hòa | 3 tháng → **không khả thi** |

## Giả định & phát hiện discovery

- **ITL** = Interline (IATA SIS), **không** phải Indo Trans Logistics.
- **6 luồng xuất HĐ** + hệ kế toán REV + PM HĐ hiện tại (CT) + nguồn 1A/Cargospot.
- **Đối soát HĐ ↔ sổ kế toán** = chức năng **mới hoàn toàn** (Ngô Kim Lan) — scope lớn nhất.
- Timeline 3 tháng nội bộ đánh giá **không khả thi**; chờ xác nhận sponsor.
- Deadline bổ sung câu hỏi Q&A: **12/06/2026**; kick-off sau khảo sát.

## Quyết định / ADR

*(Chưa có)*

## Rủi ro & assumption

*(Chưa có — xem `docs/00-governance/` khi có)*

## Lịch sử trao đổi

### 2025-06-05 — Thiết lập dự án

- Dùng skill **Minipower** để quản lý dự án triển khai HĐĐT cho VNA.
- **`assets/`** = tài liệu gốc từ khách hàng.
- **`docs/`** = artifact theo chuẩn minipower (copy từ `docs-skeleton`).
- Chưa có tài liệu khách hàng; chưa bắt đầu discovery.

### 2025-06-05 — Cấu trúc assets

- **`assets/public/`** — tài liệu & biên bản họp với khách hàng VNA.
- **`assets/internal/`** — biên bản họp nội bộ, tài liệu không gửi khách.

### 2025-06-05 — Discovery Q&A v1

- Phân tích checklist khảo sát (public + internal) và đầu mối ứng dụng VNA.
- Receipt/Online/ĐL/SIS trả lời tốt; Cargo/GAS/SIS còn ~30+ câu chưa trả lời.
- Cần bổ sung block kỹ thuật (API, REV, CT hiện tại, mẫu HĐ, volume peak).
- Chi tiết → [`notes/discovery/`](notes/discovery/README.md)

### 2025-06-05 — Folder notes (đủ 6 phase)

- Bổ sung README + khung cho `requirements/`, `architecture/`, `planning/`, `delivery/`, `change-control/`.

---

## Ghi chú cho agent (cuộc hội thoại mới)

1. **Đọc file này trước** để nắm context.
2. Phase hiện tại → đọc **`notes/{phase}/README.md`** cho trao đổi chi tiết.
3. Kiểm tra **`assets/public/`** và **`assets/internal/`** xem có tài liệu mới chưa.
4. Xác định **phase** hiện tại → đọc skill con minipower tương ứng.
5. Không nhảy sang giải pháp/kiến trúc trước khi discovery & requirements có nền tảng.
6. Sau phiên làm việc quan trọng → cập nhật **`notes/{phase}/`** + tóm tắt vào file này.
