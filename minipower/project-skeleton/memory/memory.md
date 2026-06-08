# Memory — {Tên dự án}

> **Index gốc** — chỉ giữ thông tin chung & link tới memory theo chủ đề. **Không** gom toàn bộ context vào file này.

---

## Dự án

| Mục | Giá trị |
|-----|---------|
| **Tên** | *(điền)* |
| **Khách hàng** | *(điền)* |
| **Phase hiện tại** | *(điền)* |
| **Baseline** | — *(draft)* |

## Memory theo chủ đề

| Chủ đề | Index | DOC |
|--------|-------|-----|
| Discovery | [discovery/](discovery/README.md) | 01–03 |
| Requirements | [requirements/](requirements/README.md) | 04–07, 13 |
| Architecture | [architecture/](architecture/README.md) | 08–12 |
| Planning | [planning/](planning/README.md) | 14–15 |
| Delivery | [delivery/](delivery/README.md) | 16–17 |
| Change control | [change-control/](change-control/README.md) | 18 |

## Liên kết nhanh

| Folder / file | Vai trò |
|---------------|---------|
| [**`docs/05-traceability/overview.md`**](../docs/05-traceability/overview.md) | **Tổng quan 30s** — phase, module, pipeline, blocker, 2 tuần tới |
| [`../brainstorm/`](../brainstorm/) | Trao đổi chi tiết theo ngày |
| [`../assets/`](../assets/) | Tài liệu gốc |
| [`../docs/`](../docs/) | Artifact baseline |

## Ghi chú agent

1. Cần **nắm tổng thể dự án** → đọc [`docs/05-traceability/overview.md`](../docs/05-traceability/overview.md) trước.
2. Đọc **file này** → mở **memory/{phase}/** tương ứng phase đang làm.
3. Cập nhật memory **đúng chủ đề** — không append dài vào `memory.md` gốc.
4. Sau sync / cuối phiên: rollup số liệu vào `overview.md` (PM hoặc owner module).
5. Trao đổi chi tiết → `brainstorm/` · chốt → `docs/`.
