# Minipower — Proposal skills (chỉ mục & quyết định chung)

| | |
|---|---|
| **Ngày** | 2026-07-25 |
| **Trạng thái** | 🗂️ **Đã gộp (merged)** → [proposal-suite](proposed_2026-07-25_minipower-proposal-suite.md). Giữ làm lịch sử — không cập nhật tiếp. |
| **Phạm vi** | `minipower/` — 3 skill cross-phase + `proposal-scope.json` + tool ULNL |
| **Nối tiếp** | [ADR 2026-07-20 định hướng](superseded_2026-07-20_dinh-huong-minipower-ai-ho-tro-ra-quyet-dinh.md) (§0, N5) · [ADR gated-fanout](paused_2026-07-20_minipower-gated-fanout-execution.md) |
| **Mục đích** | ADR **cha** — quyết định bất biến chung; chi tiết từng skill → ADR con bên dưới |

> 🗂️ **File này đã được gộp vào [proposed_2026-07-25_minipower-proposal-suite.md](proposed_2026-07-25_minipower-proposal-suite.md)** (2026-07-26). Nội dung dưới giữ nguyên làm bản lịch sử; mọi cập nhật mới thực hiện ở file hợp nhất.

---

## §0. Chỉ mục ADR con (trao đổi & implement theo từng phần)

| Skill | ADR | SOP / nguồn | Deliverable chính |
|-------|-----|-------------|-------------------|
| `proposal-technical` | [merged_2026-07-25_proposal-technical.md](merged_2026-07-25_proposal-technical.md) | [`GiaiPhapKyThuat-KHUNG.md`](../SOPs/GiaiPhapKyThuat-KHUNG.md) | `assets/public/DX-GPKT-vX.Y.md` |
| `proposal-quotation` | [merged_2026-07-25_proposal-quotation.md](merged_2026-07-25_proposal-quotation.md) | [`ULNL.md`](../SOPs/ULNL.md) | `quotation-vX.Y.json` + `DX-BaoGia-vX.Y.md` |
| `proposal-timeline` | [merged_2026-07-25_proposal-timeline.md](merged_2026-07-25_proposal-timeline.md) | DOC-14/15 (+ GPKT III.3) | `DX-Timeline-vX.Y.md` + mermaid gantt |

> Làm việc từng phần: mở ADR con tương ứng — mỗi file có workflow, output, lộ trình R*, câu hỏi mở riêng.

---

## §1. Tóm tắt quyết định chung

Gói chào khách hàng gồm **ba deliverable** tùy dự án — không phải gate bắt buộc DOC-01→18:

1. Đề xuất Giải pháp Kỹ thuật (GPKT)
2. Báo giá (ULNL)
3. Kế hoạch triển khai (timeline)

| # | Quyết định | Áp dụng |
|---|------------|---------|
| **P1** | **Ba skill phẳng** — `proposal-technical`, `proposal-quotation`, `proposal-timeline`; cross-phase như `fan-out` / `doc-review`; **không** skill cha discoverable | Cả bộ |
| **P2** | **Không** DOC-20; export = **TPL phụ trợ** (N5), không baseline / trace-matrix bắt buộc | Cả bộ |
| **P3** | **`proposal-scope.json`** tại `{project}/assets/internal/` — SSOT functions / NFR / milestones cho cả ba skill | Cả bộ |
| **P4** | **Code trước, LLM sau** — mức độ khác nhau từng skill (chi tiết ADR con) | Cả bộ |
| **P5** | Catalog ULNL: default + override; **đơn giá tiền** không commit repo | Chủ yếu quotation |
| **P6** | **Không** phase thứ 7; proposal skill chỉ **distill**, không thay `planning` / `architecture` | Cả bộ |

### Phương án đã loại

| Phương án | Lý do loại |
|-----------|------------|
| Một skill LLM generate cả 3 file | Hallucination; lệch số GPKT ↔ báo giá |
| Skill cha `proposal` + 3 con | Lệch convention router `/minipower` |
| Gộp vào `architecture` / `planning` | Nhầm produce DOC vs export KH |

---

## §2. Kiến trúc chung

```text
                    ┌── DOC-01…17 (SSOT trong docs/) ──┐
                    │  discovery → requirements →       │
                    │  architecture → planning → …      │
                    └──────────────┬────────────────────┘
                                   │ distill / assemble
                    ┌──────────────▼────────────────────┐
                    │  proposal-scope.json (internal)    │
                    └──┬────────────┬────────────┬──────┘
              proposal-technical  proposal-quotation  proposal-timeline
                    │              │                    │
                    ▼              ▼                    ▼
              DX-GPKT-vX.Y    DX-BaoGia-vX.Y      DX-Timeline-vX.Y
              (public)        + quotation.json    (public)
                              (internal)
```

| Thư mục | Vai trò |
|---------|---------|
| `docs/` | SSOT kỹ thuật — **sửa tại đây**, không sửa export |
| `assets/internal/` | `proposal-scope.json`, `quotation-*.json`, catalog/rates |
| `assets/public/` | File sắp gửi / đã share KH |

**Phân tầng:** mặc định **light**; **full** + deliberation khi chốt phương án kiến trúc lớn (technical Phần III).

**Gate pipeline:** không thêm approval-gate; **người duyệt** trước khi gửi KH (đặc biệt báo giá).

---

## §3. `proposal-scope.json` (hợp đồng giữa 3 skill)

Schema tối thiểu — chi tiết field bổ sung trong từng ADR con khi implement:

```json
{
  "meta": { "version": "0.1", "project": "…" },
  "functions": [
    {
      "id": "F001",
      "subsystem": "…",
      "group": "…",
      "name": "…",
      "trace": ["{MOD}-FR-NNN"],
      "type_code": "DS2"
    }
  ],
  "nfr": [{ "code": "TP", "name": "…", "trace": ["DOC-13#…"], "included": true }],
  "milestones": [
    { "id": "M1", "title": "Kickoff", "outcome": "…", "start": "2026-08-01", "duration_days": 5 }
  ]
}
```

| Field | Consumer chính |
|-------|----------------|
| `functions[]` | technical II.2 · quotation `functional_lines` |
| `nfr[]` | technical II.3–II.8 · quotation `nfr_lines` |
| `milestones[]` | timeline · GPKT III.3 (inject, không viết hai nơi) |

**Luật:** cập nhật scope → regenerate export; không chỉnh tay DX-* khi DOC đã đổi.

---

## §4. Lộ trình tổng (R1→R6)

| Phase | Nội dung | ADR / owner |
|-------|----------|-------------|
| **R1** | Bộ ADR (cha + 3 con) | File này |
| **R2–R3** | Tool ULNL + skill `proposal-quotation` | [proposal-quotation](merged_2026-07-25_proposal-quotation.md) |
| **R4** | Skill `proposal-timeline` + milestone → mermaid | [proposal-timeline](merged_2026-07-25_proposal-timeline.md) |
| **R5** | TPL GPKT + assembler + skill `proposal-technical` | [proposal-technical](merged_2026-07-25_proposal-technical.md) |
| **R6** | Router `SKILL.md` + `prereq_by_intent` + README/FAQ | File này §5 |

**Thứ tự ưu tiên implement:** R2 → R3 → R4 → R5 → R6.

---

## §5. Routing chung (R6 — chưa wire)

Thêm vào `minipower/SKILL.md` và `rules.json` → `prereq_by_intent` khi đủ skill:

| Intent id | Skill file | Keywords (gợi ý) | requires |
|-----------|------------|------------------|----------|
| `proposal-technical` | `skills/proposal-technical/SKILL.md` | de xuat giai phap, gpkt, technical proposal | `03` |
| `proposal-quotation` | `skills/proposal-quotation/SKILL.md` | bao gia, ulnl, quotation | `03`; `06` khuyến nghị |
| `proposal-timeline` | `skills/proposal-timeline/SKILL.md` | timeline, milestone, gantt, ke hoach trien khai | `03`; `15` khuyến nghị |

`name` frontmatter: `proposal-*` (không prefix `minipower-`).

---

## §6. Việc KHÔNG làm (cả bộ)

| ❌ | Vì sao |
|---|--------|
| DOC-20 trong baseline | Duplicate FR; phá SSOT DOC-06 |
| LLM tự cộng MH/MD/tiền | Xem [proposal-quotation](merged_2026-07-25_proposal-quotation.md) |
| Commit đơn giá / margin | Nhạy cảm thương mại |
| Skill cha `proposal` discoverable | Thêm lớp routing không cần |
| Thay `planning` / `architecture` | Proposal chỉ distill |
| Auto-gửi KH / auto-chốt giá | Trái §0 ADR định hướng |
| Generate nguyên GPKT 600+ dòng bằng LLM | Xem [proposal-technical](merged_2026-07-25_proposal-technical.md) |

---

## §7. Rủi ro chéo skill

| Rủi ro | Giảm thiểu |
|--------|------------|
| Lệch số GPKT vs báo giá | Bắt buộc `proposal-scope.json` |
| Timeline vs GPKT III.3 khác nhau | Một SSOT `milestones[]` |
| README mục 3 (SAD = proposal) | R6: tách SSOT vs export KH |

---

## §8. Câu hỏi mở chung

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| **Q1** | Gói KH: 3 file tách hay 1 GPKT + phụ lục? | Ảnh hưởng cả technical + quotation + timeline |

Câu hỏi riêng từng skill → ADR con tương ứng.

---

## §9. Tham chiếu

- [proposal-technical](merged_2026-07-25_proposal-technical.md)
- [proposal-quotation](merged_2026-07-25_proposal-quotation.md)
- [proposal-timeline](merged_2026-07-25_proposal-timeline.md)
- [`minipower/SKILL.md`](../minipower/SKILL.md) · [`minipower/docs/pipeline.md`](../minipower/docs/pipeline.md)
