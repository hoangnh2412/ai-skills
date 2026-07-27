# Proposal — skill `proposal-technical` (Đề xuất GPKT)

| | |
|---|---|
| **Ngày** | 2026-07-25 |
| **Trạng thái** | 🗂️ **Đã gộp (merged)** → [proposal-suite §4](proposed_2026-07-25_minipower-proposal-suite.md). Giữ làm lịch sử — không cập nhật tiếp. |
| **ADR cha** | [merged_2026-07-25_minipower-proposal-skills.md](merged_2026-07-25_minipower-proposal-skills.md) |
| **SOP** | [`SOPs/GiaiPhapKyThuat-KHUNG.md`](../SOPs/GiaiPhapKyThuat-KHUNG.md) |
| **Skill (dự kiến)** | `minipower/skills/proposal-technical/SKILL.md` |
| **Mục đích** | Distill/assemble **Đề xuất Giải pháp Kỹ thuật** từ DOC đã có — hybrid code + LLM prose |

> 🗂️ **Đã gộp vào [proposed_2026-07-25_minipower-proposal-suite.md](proposed_2026-07-25_minipower-proposal-suite.md) §4** (2026-07-26). Bản lịch sử.

---

## §0. Quyết định riêng skill này

| # | Chốt |
|---|------|
| **T1** | Khung output = SOP `GiaiPhapKyThuat-KHUNG.md` → pack: `templates/TPL-technical-solution-proposal.md` |
| **T2** | **Hybrid:** bảng/cây STT/ stack / integration → **tool assemble**; hiện trạng, luồng tiêu biểu, tóm tắt → **LLM distill** (có ID nguồn, thiếu → `TBD`) |
| **T3** | **Không** generate nguyên file 600+ dòng bằng LLM |
| **T4** | Điền **dần** theo phần: I sau discovery; II khi có requirements; III khi có architecture/planning |
| **T5** | QC **II ↔ III** — mỗi mục III phải trace về II (slice doc-review) |

---

## §1. Bối cảnh & khoảng trống

`minipower/README.md` mục 3 gộp “đề xuất giải pháp” ≈ DOC-08 SAD + DOC-09 ADR. Thực tế chào thầu cần **format KH** Phần I–III với bảng ánh xạ DOC (đã có trong SOP khung).

Skill này **không** thay `architecture` — chỉ **đóng gói** artifact đã có theo layout GPKT.

---

## §2. Input / output

### Input

| Phạm vi GPKT | DOC / nguồn tối thiểu |
|--------------|------------------------|
| Meta, Phần I | DOC-01–03 · `README` dự án |
| Phần II | DOC-03–07, 13 · `proposal-scope.json` → `functions[]`, `nfr[]` |
| Phần III | DOC-08–12, 14–17 · mockup/UI pack nếu có |

**Tiền đề routing:** DOC-03 (`requires: ["03"]`); từng phần có thể thiếu — ghi `TBD` + `memory/{phase}/open-questions.md`.

### Output

| File | Vị trí |
|------|--------|
| `DX-GPKT-vX.Y.md` | `{project}/assets/public/` |

Cấu trúc: đúng Phần I–III + checklist cuối khung SOP.

---

## §3. Workflow skill (dự kiến)

```text
1. Chọn phạm vi: I only | II | III | full | cập nhật 1 section
2. Đọc proposal-scope.json + DOC theo bảng ánh xạ SOP
3. Chạy assembler (bảng II.2, III.2 stack, integration, glossary…) — khi có tool
4. LLM distill prose (I.1 pain point, III.1.4 luồng tiêu biểu…) — trích ID, không bịa
5. Gap list một lượt (readiness-style) cho mục còn TBD
6. QC slice II↔III
7. Ghi DX-GPKT + version trong memory
```

### Code vs LLM

| Loại nội dung | Cơ chế |
|---------------|--------|
| Bảng II.2 (cây STT), II.4 tích hợp, III.2.2 stack, in/out | Parser DOC + `proposal-scope.json` + template inject |
| I.1 hiện trạng, III.1.4 luồng, kết luận | LLM distill + nguồn DOC-01 / UC |
| Sơ đồ kiến trúc | Link/đính kèm từ DOC-08 hoặc placeholder `[Đính kèm]` |

### Assembler (R5)

| Thành phần | Vị trí đề xuất |
|------------|----------------|
| `gpkt-assemble.js` | `minipower/tools/proposal/` |
| Template | `minipower/templates/TPL-technical-solution-proposal.md` |

**Q3 (chưa chốt):** `tools/` vs `hooks/` — ưu tiên `tools/` (không cần hook IDE).

---

## §4. Liên kết `proposal-scope.json`

| Field scope | Dùng trong GPKT |
|-------------|-----------------|
| `functions[]` | Phần II.2 — cây chức năng; đồng bộ với báo giá |
| `nfr[]` | II.3–II.8 tóm tắt |
| `milestones[]` | III.3 — **inject** từ SSOT timeline (không viết lịch riêng nếu Q1 chốt gói 1 file) |

---

## §5. Lộ trình (R5)

| Bước | Deliverable | Xác minh |
|------|-------------|----------|
| R5.1 | `TPL-technical-solution-proposal.md` sync từ SOP | Diff với `SOPs/GiaiPhapKyThuat-KHUNG.md` |
| R5.2 | `gpkt-assemble.js` v1 — bảng II.2 từ fixture | Output ổn định `node --test` |
| R5.3 | `skills/proposal-technical/SKILL.md` + README | Workflow §3 |
| R5.4 | Mở rộng assembler: III.2 stack, II.4 | Fixture DOC-08/10 |

**Phụ thuộc:** `proposal-scope.json` schema (R4 timeline hoặc định nghĩa sớm ở ADR cha §3).

---

## §6. Việc KHÔNG làm (skill này)

| ❌ | Vì sao |
|---|--------|
| Sửa FR/SRS trong GPKT thay vì DOC-06 | Phá trace |
| Chốt kiến trúc mới chỉ trong GPKT | SSOT = DOC-08/09 |
| Zero-LLM cho cả file | I.1 / luồng nghiệp vụ cần distill |
| Bỏ QC II↔III | Rule cốt lõi khung SOP |

---

## §7. Rủi ro

| Rủi ro | Giảm thiểu |
|--------|------------|
| Parser DOC-06 không ổn định | Convention bảng template; fallback + gap list |
| Lệch II.2 vs bảng báo giá | Cùng `proposal-scope.functions[]` |
| File quá dài một lần assemble | Chế độ phần (I / II / III) |

---

## §8. Câu hỏi mở

| # | Câu hỏi |
|---|---------|
| **T-Q1** | Gói 1 GPKT + phụ lục vs file timeline/giá tách? (xem Q1 ADR cha) |
| **T-Q2** | `T-SHIRT.md` — GPKT tham chiếu nhưng chưa có trong repo |
| **T-Q3** | Assembler đặt `tools/` hay `hooks/`? |

---

## §9. Tham chiếu

- [ADR cha — proposal skills](merged_2026-07-25_minipower-proposal-skills.md)
- [proposal-quotation](merged_2026-07-25_proposal-quotation.md) · [proposal-timeline](merged_2026-07-25_proposal-timeline.md)
- [`SOPs/GiaiPhapKyThuat-KHUNG.md`](../SOPs/GiaiPhapKyThuat-KHUNG.md)
- [`minipower/skills/architecture/SKILL.md`](../minipower/skills/architecture/SKILL.md) — produce DOC-08 (upstream)
