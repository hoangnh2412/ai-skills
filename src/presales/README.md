# presales — ước lượng & báo giá trước ký

Hai skill lá (ADR-030). LLM **không** cộng MH. Đơn giá không commit.

Manifest: [PACK.md](PACK.md).

## Skill

| Skill | Tài liệu | Việc |
|---|---|---|
| **minipower-presales-estimation-ulnl** | [skills/minipower-presales-estimation-ulnl/README.md](./skills/minipower-presales-estimation-ulnl/README.md) | Gán mã ULNL + Σ MH (`classify`/`lineMH` là code) |
| **minipower-presales-quotation** | [skills/minipower-presales-quotation/README.md](./skills/minipower-presales-quotation/README.md) | MH→MD→buffer→ROM; tiền từ `quotation-rates.json` local |

## Sẽ có — chỉ chữ, không folder

| Tên | Việc |
|---|---|
| survey | hoãn — dùng `discovery/` |
| proposal / GPKT | ADR-008 R5 |
| slide | ADR-008 |

## Liên quan

- Khảo sát: [`discovery/`](../discovery/README.md) · SOP kho: [`sdlc/skills/discovery/SKILL.md`](../sdlc/skills/discovery/SKILL.md)
- Giải pháp bán: [`minipower-architecture-solution-lite`](../architecture/skills/minipower-architecture-solution-lite/SKILL.md)
