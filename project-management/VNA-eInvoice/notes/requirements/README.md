# Requirements — Notes

Phase: **Requirements** · Skill: [minipower requirements](../../../.cursor/skills/minipower/skills/requirements/SKILL.md) · DOC đích: **04–07, 13**

**Tiên quyết:** Discovery exit — DOC-03 scope đã review.

## Trạng thái

| Mục | Giá trị |
|-----|---------|
| Phase | **Chưa bắt đầu** — chờ discovery sign-off |
| Baseline FR | — |
| Module folder | `docs/03-modules/{module-id}/` *(chưa tạo)* |

## Module dự kiến (từ discovery)

| Module ID | MOD | DOC trong module |
|-----------|-----|------------------|
| receipt | RCP | 04–07, 16 |
| cargo | CRG | 04–07, 16 |
| online | ONL | 04–07, 16 |
| agent | AGT | 04–07, 16 |
| gas | GAS | 04–07, 16 |
| sis | SIS | 04–07, 16 |
| reconcile | REC | 04–07, 16 |
| tax-rpt | TAX | 04–07, 16 |

NFR chung → `docs/04-platform/DOC-13-nfr.md`

## Quy trình (bước 3–8)

| Bước | Nội dung | Artifact |
|------|----------|----------|
| 3 | Actor | DOC-05 |
| 4 | Use Case | DOC-05 |
| 5 | Business Rules | DOC-04 |
| 6 | FR (SRS) | DOC-06 |
| 7 | NFR | DOC-13 |
| 8 | Acceptance Criteria (Gherkin) | DOC-07 |

**ID quy ước:** `{MOD}-UC-001`, `{MOD}-FR-001`, `{MOD}-BR-001`

## Exit criteria

- [ ] FR baseline theo module
- [ ] AC trace FR
- [ ] `docs/05-traceability/trace-matrix.md` cập nhật

## Danh sách note

| Ngày | File | Nội dung |
|------|------|----------|
| — | *(chưa có)* | |

## Việc tiếp theo

- [ ] Hoàn thành discovery → DOC-03 scope sign-off
- [ ] Copy `docs/03-modules/_template/` → từng `{module-id}/`
- [ ] Ưu tiên module **reconcile** (scope mới) và **receipt** (volume lớn)

## Tham chiếu discovery

- [`../discovery/README.md`](../discovery/README.md)
- [`../discovery/2025-06-05-03-phan-tich-qa-khao-sat-v1.md`](../discovery/2025-06-05-03-phan-tich-qa-khao-sat-v1.md)
