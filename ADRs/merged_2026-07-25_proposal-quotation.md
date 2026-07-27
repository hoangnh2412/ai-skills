# Proposal — skill `proposal-quotation` (Báo giá ULNL)

| | |
|---|---|
| **Ngày** | 2026-07-25 |
| **Trạng thái** | 🗂️ **Đã gộp (merged)** → [proposal-suite §3](proposed_2026-07-25_minipower-proposal-suite.md). Giữ làm lịch sử — không cập nhật tiếp. |
| **ADR cha** | [merged_2026-07-25_minipower-proposal-skills.md](merged_2026-07-25_minipower-proposal-skills.md) |
| **SOP** | [`SOPs/ULNL.md`](../SOPs/ULNL.md) |
| **Skill (dự kiến)** | `minipower/skills/proposal-quotation/SKILL.md` |
| **Mục đích** | Báo giá có căn cứ MH/MD — **tool deterministic** + AI gán mã loại |

> 🗂️ **Đã gộp vào [proposed_2026-07-25_minipower-proposal-suite.md](proposed_2026-07-25_minipower-proposal-suite.md) §3** (2026-07-26). Bản lịch sử; giữ schema JSON đầy đủ §4 để tra cứu.

---

## §0. Quyết định riêng skill này

| # | Chốt |
|---|------|
| **Q0** | Công thức & catalog MH = **ULNL SOP**; implement **rules-as-data** (`catalog-default.json`) |
| **Q1** | **Tool** `quotation-calc.js` tính Σ MH, MD, tiền, ROM — **LLM không được tự cộng** |
| **Q2** | Hỏi **một lượt:** dùng CSDL mặc định? / catalog riêng? / override từng mã? |
| **Q3** | `rate_md`, margin, VAT → **người cung cấp**; không commit repo |
| **Q4** | AI: gán **mã loại** §6 ULNL; liệt kê dòng chức năng; flag dòng `*4` + câu hỏi làm rõ |

---

## §1. Bối cảnh

Chào giá cần bảng chứng minh MH theo chức năng (ULNL lần 1). `planning` skill produce DOC-14 WBS nội bộ — **khác** format báo giá thương mại §11 ULNL.

Skill này **không** thay `planning` — distill/ước lượng commercial từ danh sách chức năng + NFR.

**Upstream:** `requirements` (FR list) · `discovery` (scope DOC-03). ROM có thể chạy khi chỉ có list chức năng sơ bộ.

---

## §2. Tool `quotation-calc`

### Vị trí & SSOT

| File | Vai trò |
|------|---------|
| `minipower/tools/proposal/catalog-default.json` | CSDL §7–8 ULNL (mặc định pack) |
| `minipower/tools/proposal/catalog-template.json` | User copy → project khi không dùng default |
| `minipower/tools/proposal/bin/quotation-calc.js` | Engine tính |
| `{project}/assets/internal/quotation-catalog.json` | Catalog override project (optional) |
| `{project}/assets/internal/quotation-rates.json` | Đơn giá MD — **local / gitignore** |

### Công thức (không đổi SOP)

```text
MH_dòng = (GP + PT + KT) × (1 − reuse_pct) × (1 + adjust_pct)   # |adjust_pct| ≤ 0.10
Tổng_MD = Tổng_MH / mh_per_md    # mặc định 7.5
Chi_phí = Tổng_MD × rate_md      # + contingency, VAT (policy ngoài repo)
```

### Hỏi trọn gói khi chạy skill

1. Dùng `catalog-default.json`?
2. Nếu không — path `quotation-catalog.json` (từ template)?
3. Override mã cụ thể? (merge partial vào catalog)
4. `mh_per_md`, `rate_md`, `contingency_pct`?
5. ROM: ±10% cố định hay mở rộng khi nhiều dòng `*4`? (**Q-Q4**)

---

## §3. Workflow skill (dự kiến)

```text
1. Đọc proposal-scope.json → functions[], nfr[] (hoặc distill từ DOC-06 / list chức năng)
2. Hỏi catalog + rates (một lượt)
3. AI gán type_code từng dòng (§6 ULNL); mơ hồ → *4 + open_question
4. Ghi quotation-vX.Y.json (functional_lines, nfr_lines)
5. node quotation-calc.js quotation-vX.Y.json [--catalog …]
6. Render DX-BaoGia-vX.Y.md từ JSON + summary
7. Người duyệt trước gửi KH
```

---

## §4. Khung output

### Machine — `assets/internal/quotation-vX.Y.json`

```json
{
  "meta": {
    "version": "0.1",
    "catalog_id": "ulnl-default-v1",
    "catalog_overrides": {},
    "mh_per_md": 7.5,
    "rate_md": null,
    "currency": "VND",
    "status": "draft"
  },
  "scope": { "in": [], "out": [] },
  "functional_lines": [
    {
      "id": "L001",
      "subsystem": "…",
      "group": "…",
      "name": "…",
      "trace": ["BILL-FR-012"],
      "type_code": "DS2",
      "reuse_pct": 0,
      "adjust_pct": 0,
      "mh": { "gp": 3, "pt": 6, "kt": 3, "total": 12 }
    }
  ],
  "nfr_lines": [
    { "id": "N001", "code": "TP", "name": "Test hiệu năng", "mh": 40, "included": true }
  ],
  "summary": {
    "mh_functional": 0,
    "mh_nfr": 0,
    "mh_total": 0,
    "md_total": 0,
    "amount_subtotal": null,
    "rom_low": null,
    "rom_high": null
  },
  "warnings": []
}
```

### Human (KH) — `assets/public/DX-BaoGia-vX.Y.md`

1. Phạm vi In/Out  
2. Tóm tắt MH theo nhóm (có thể ẩn GP/PT/KT)  
3. Phi chức năng / NFR  
4. Tổng MD + thành tiền + ROM  
5. Assumption  
6. Điều khoản ULNL lần 1  

### Nội bộ (tùy chọn) — `PL-ChiTiet-MH-vX.Y.md`

Bảng đầy đủ §9 ULNL (GP/PT/KT, % tái sử dụng).

### Golden test (R2)

Ví dụ §12 ULNL — ba chức năng + TP → **77 MH**, **≈10.3 MD**.

---

## §5. Liên kết `proposal-scope.json`

| Scope field | Quotation field |
|-------------|-----------------|
| `functions[].id/name/trace` | `functional_lines[]` |
| `functions[].type_code` | Gán bởi skill nếu chưa có |
| `nfr[]` | `nfr_lines[]` |

Cập nhật `type_code` trên scope → tái chạy calc + regenerate báo giá.

---

## §6. Lộ trình (R2–R3)

| Phase | Deliverable | Xác minh |
|-------|-------------|----------|
| **R2** | `catalog-default.json` + `quotation-calc.js` + test §12 | `node --test` |
| **R3** | `skills/proposal-quotation/SKILL.md` + render markdown | JSON → summary ±0 |

**Ưu tiên implement đầu tiên** trong bộ proposal (ROI cao, test được).

---

## §7. Việc KHÔNG làm (skill này)

| ❌ | Vì sao |
|---|--------|
| LLM tự cộng MH/MD/tiền | Không test; lệch ULNL |
| Invent mã loại mới không phê duyệt | ULNL §5 bước 3 |
| Điều chỉnh dòng > ±10% không ghi lý do | ULNL §5 |
| Commit `rate_md` vào repo | Nhạy cảm |
| Thay DOC-14 WBS baseline | Khác mục đích |

---

## §8. Rủi ro

| Rủi ro | Giảm thiểu |
|--------|------------|
| Gán mã sai (CN_WEB vs DS) | Rubric §6.8 trong SKILL; human review |
| Nhiều dòng `*4` + báo giá cứng | ROM rộng + assumption |
| Catalog drift giữa dự án | `catalog_id` + version trong meta |

---

## §9. Câu hỏi mở

| # | Câu hỏi |
|---|---------|
| **Q-Q4** | ROM ±10% cố định hay scale theo số dòng `*4`? |
| **Q-Q5** | Có cần `TPL-quotation.md` riêng hay render thuần từ JSON schema? |
| **Q-Q6** | Tách đơn giá theo role (GP/PT/KT) hay một `rate_md`? (ULNL §10.1) |

---

## §10. Tham chiếu

- [ADR cha](merged_2026-07-25_minipower-proposal-skills.md)
- [proposal-technical](merged_2026-07-25_proposal-technical.md) · [proposal-timeline](merged_2026-07-25_proposal-timeline.md)
- [`SOPs/ULNL.md`](../SOPs/ULNL.md)
- [`minipower/skills/planning/SKILL.md`](../minipower/skills/planning/SKILL.md) — upstream DOC-14
