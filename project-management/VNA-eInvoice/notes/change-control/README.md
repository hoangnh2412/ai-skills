# Change Control — Notes

Phase: **Change control** · Skill: [minipower change-control](../../../.cursor/skills/minipower/skills/change-control/SKILL.md) · DOC đích: **18**

**Tiên quyết:** Baseline DOC-01–07 (v1.0+).

## Trạng thái

| Mục | Giá trị |
|-----|---------|
| Phase | **Chưa áp dụng** — chưa có baseline |
| Baseline hiện tại | — *(draft)* |
| CR đang mở | — |

## Quy tắc

- Sau baseline → mọi thay đổi scope/requirement qua **CR**
- **Không** sửa trực tiếp `docs/02-baseline/` (READ ONLY)
- Luồng: `06-changes/CR-xxx/` → impact → deltas → merge → regression → approve → vX.Y

## DOC & folder

| Artifact | Path |
|----------|------|
| CR Register | `docs/00-governance/DOC-18-change-request-register.md` |
| CR instance | `docs/06-changes/CR-{NNN}/` |
| Baseline history | `docs/00-governance/baseline-history.md` |
| Ví dụ skeleton | `docs/06-changes/CR-000-example/` |

## CR template (khi có)

```text
06-changes/CR-xxx/
├── CR-xxx.md          ← mô tả, lý do, approve
├── impact.yaml        ← module/DOC/FR bị ảnh hưởng
└── deltas/            ← patch hoặc file thay thế
```

## Danh sách note

| Ngày | File | Nội dung |
|------|------|----------|
| — | *(chưa có)* | |

## Việc tiếp theo

- [ ] Baseline v1.0 sau discovery + requirements sign-off
- [ ] Đăng ký CR đầu tiên khi VNA thay đổi scope post-kickoff

## Tham chiếu

- [`../../docs/06-changes/CR-000-example/`](../../docs/06-changes/CR-000-example/)
- [`../discovery/README.md`](../discovery/README.md)
