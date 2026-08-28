# PACK — toolbox

Manifest máy-đọc của module (schema: [contracts/pack-manifest.md](../contracts/pack-manifest.md)). Consumer: installer `--with` · bảng router sinh tự động · trace liên-pack · Skill Registry tương lai.

```yaml
pack: toolbox
version: 0.1.0
owner: hoangnh
roles: [minipower-maintainer]  # vai khai bằng metadata, không vào tên skill (ADR-023 QĐ-4)
stage: cross-cutting
repo: minipower                # tác động lên chính repo công cụ, KHÔNG lên repo dự án đích
consumes: [AGENTS.md, "ADRs/*", "contracts/*", "{module}/PACK.md", "{module}/README.md"]
produces: ["skill lá mới (SKILL.md + README.md + workflows/)", "module mới (PACK.md + README.md + test canh)"]
handoff-in:  []                # không nằm trên spine H1–H6 của dự án đích
handoff-out: []
memory: —                      # không ghi memory dự án đích
mcp: []                        # không cần tool ngoài
```

**Vì sao nhiều trường rỗng:** `toolbox` là module **meta** — nó làm ra chính minipower, không tham gia vòng đời dự án đích. Trường vẫn khai đủ để một schema, một test, không có ngoại lệ ngầm (ADR-027 QĐ-3).
