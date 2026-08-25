# Lingua franca — quy ước dùng chung (QUY ƯỚC)

**Trạng thái:** 🟡 Đang sống trong `sdlc/` (memory · decision-log · versioning · ownership); phần mở rộng prefix DEC theo vai (`DEC-BE-`…) **chưa áp dụng** — bật cùng pack code cắm vào spine.

Mọi pack — bất kể repo — "nói cùng ngôn ngữ". Đây là phần khiến agent ở pack A hiểu output của pack B mà không cần đọc lại từ đầu.

| Primitive | Nguồn (đã có) | Chuẩn chung |
|-----------|---------------|-------------|
| `memory/{role-or-phase}/` | `sdlc` | Đọc **đầu phiên**, ghi **cuối phiên**; index theo chủ đề, không nhồi `memory.md` gốc |
| `decision-log.md` | [schema](../sdlc/docs/decision-log.md) | Prefix ID mở rộng theo vai trò: `DEC-BE-`, `DEC-FE-`, `DEC-QA-`, `DEC-OPS-` (bên cạnh `DEC-DIS/REQ/ARC/PLN/DLV/CHG`) |
| Versioning | [doc-versioning](../sdlc/docs-skeleton/00-governance/doc-versioning.md) | `Version` chỉ sau sign-off; trước đó `—` + Draft — áp cho mọi artifact có baseline |
| Ownership | [parallel-work.md](../sdlc/docs/parallel-work.md) | Một module — một owner; một boundary — một producer |
| Anatomy skill | backend + sdlc | Mọi pack: `SKILL.md` (agent) + `README.md` (người) + `workflows/` + `templates/` |

## decision-log — schema chung

```text
### DEC-{ROLE|PHASE}-NNN — <tiêu đề> · [YYYY-MM-DD]
- Status: proposed | accepted | superseded-by DEC-xxx
- Context / Options / Decision / Why (loại B,C vì) / Consequences
- Trace: DOC-XX · {MOD}-FR-xxx · ADR-xxx · {MOD}-CMP-xxx
- Confidence: cao | vừa | thấp
```

Quyết định kiến trúc nặng → nâng lên ADR (DOC-09). Decision-log là bản nhẹ cho **mọi** pack.

---

*Liên quan:* [trace-spine.md](trace-spine.md) (ID) · [pack-manifest.md](pack-manifest.md) (khai `memory:` namespace)
