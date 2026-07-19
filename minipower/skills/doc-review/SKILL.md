---
name: doc-review
description: >-
  [minipower] QC đối kháng cho DOC — soi lỗ hổng traceability, mâu thuẫn chéo,
  requirement không testable, thiếu negative case. Gate cross-phase, chạy bằng
  subagent context sạch, một slice. Dùng khi review DOC, kiểm tra chéo, QC, soi
  tài liệu, trước baseline / sign-off.
---

# Doc Review — QC đối kháng

**Pack:** minipower · **Loại:** skill dùng chung (cross-phase) · **Vai chính:** QC/Reviewer.

**Tư thế đối kháng:** giả định DOC **có lỗi**, chủ động tìm cách phá. **Không** tự sửa DOC — chỉ báo lỗi cho **owner** (giữ quy tắc *một module = một owner*).

**Scope:** **một slice** mỗi lần — 1 DOC hoặc 1 module (tôn trọng [token-guard](../../docs/token-guard.md)). Không quét cả `docs/`.

**Chạy khi:** kết thúc mỗi phase (self-check) · trước sign-off/baseline (gate) · sau CR (regression tài liệu).

> **Theo tầng** ([SKILL.md](../../SKILL.md#phân-tầng-công-việc-micro--light--full)): **bắt buộc ở Full** và trước baseline. **Khuyến nghị ở light** (đổi nội dung trong DOC đã có). **Bỏ ở micro** (typo/format).

---

## 5 chiều đối kháng

| # | Chiều | Săn lỗi gì |
|---|-------|-----------|
| 1 | **Traceability** | FR không có UC/BR · AC không trace FR · UC thiếu actor · test không trace AC · NFR không map vào architecture |
| 2 | **Mâu thuẫn chéo** | DOC-03 scope "out" nhưng DOC-06 có FR · goal DOC-01 ≠ feature DOC-06 · 2 DOC định nghĩa entity/thuật ngữ khác nhau · API (DOC-12) lệch FR |
| 3 | **Testable / mơ hồ** | Requirement không đo được · từ mơ hồ ("nhanh", "thân thiện", "v.v.") · NFR thiếu ngưỡng · **thiếu negative AC** |
| 4 | **Đầy đủ** | Thiếu nhóm NFR (security/audit/HA-DR) · thiếu edge/error case · assumption chưa được giải · happy-path-only |
| 5 | **Nhất quán ID / version** | Sai quy ước ID (`{MOD}-FR-001`) · Version gán trước sign-off · Draft lẫn baseline |

## Mức nghiêm trọng

| Mức | Nghĩa | Hành động |
|-----|-------|-----------|
| 🔴 **Blocker** | Chặn baseline/go-live (trace đứt, mâu thuẫn nghiệp vụ) | Owner sửa trước khi tiếp |
| 🟡 **Major** | Rủi ro cao (mơ hồ, thiếu negative case) | Sửa trong phase, ghi vào backlog |
| ⚪ **Minor** | Hình thức, nhất quán nhỏ | Gộp sửa cuối phase |

## Cơ chế subagent

1. **Dispatch** subagent **context sạch** — chỉ đưa 1 DOC/module đích + trace-matrix liên quan (không đưa cả lịch sử chat).
2. **Fan-out** (dự án lớn): một subagent / chiều **hoặc** một subagent / module → agent chính **dedup** finding trùng theo `{DOC}#{section/ID}`.
3. **Không** subagent → chạy **một pass đối kháng** tập trung, tự đặt lại tư thế "tìm lỗi".
4. Mỗi finding **độc lập** với finding khác — tránh sửa chồng (kiểu ASI: sửa 1 lỗi → re-check đúng file đó → xếp lại phần còn lại).

## Format finding (mỗi lỗi)

```text
[Mức] Chiều — {DOC-ID} §section / {MOD}-FR-xxx
Bằng chứng: <trích dẫn / mô tả cụ thể>
Vì sao lỗi: <hệ quả downstream — dev hiểu sai / test không viết được / khách reject>
Đề xuất: <sửa gì, ai owner>
```

## Format phản hồi

1. **Scope đã soi** — DOC/module + phiên bản
2. **Bảng finding** — sắp Blocker → Minor
3. **Trace gaps** — bảng UC→FR→AC chỗ đứt
4. **Verdict gate** — ✅ PASS / ⛔ BLOCK baseline (kèm số Blocker)
5. **Ghi lại** — Blocker/Major → `memory/{phase}/` + liên kết [decision-log](../../docs/decision-log.md) nếu là lựa chọn có chủ đích, **không** phải lỗi

## Exit criteria

- [ ] Đã soi đủ 5 chiều trên slice đích
- [ ] Mỗi finding có bằng chứng + hệ quả + đề xuất (không "cảm giác")
- [ ] Verdict PASS/BLOCK rõ ràng cho sign-off
- [ ] Không tự sửa DOC — chỉ báo owner

## Anti-patterns

- Tự sửa DOC của owner khác · soi cả `docs/` một lần (vỡ token-guard)
- Finding không bằng chứng · bỏ qua negative case · chỉ soi hình thức bỏ traceability
- Coi Minor = Blocker (làm tê liệt tiến độ)

**Liên quan:** [delivery](../delivery/SKILL.md) (test trace) · [change-control](../change-control/SKILL.md) (regression) · [deliberation](../deliberation/SKILL.md) (nếu lỗi là do vấn đề khung sai)
