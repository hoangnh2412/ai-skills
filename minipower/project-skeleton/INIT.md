# Project skeleton — Hướng dẫn maintainer

Khung khởi tạo dự án mặc định. Agent/user copy vào `{project}/` theo [SKILL.md](../SKILL.md).

## Lệnh khởi tạo

```bash
PROJECT=my-project
MINIPOWER=/path/to/ai-skills/minipower

mkdir -p "$PROJECT"
cp -R "$MINIPOWER/project-skeleton/"* "$PROJECT/"
cp -R "$MINIPOWER/docs-skeleton" "$PROJECT/docs"
```

## Vai trò từng thư mục

| Thư mục | Vai trò |
|---------|---------|
| `assets/` | Giữ **bản gốc** khảo sát, checklist, biên bản — không sửa file gốc |
| `brainstorm/` | Phân tích, trao đổi, decision log theo ngày; chốt → distill vào `docs/` |
| `docs/` | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |
| `memory/` | Index context theo chủ đề — `memory.md` + 6 folder phase |

## Nội dung skeleton (ngoài `docs/`)

| Path | Mô tả |
|------|--------|
| `README.md` | Entry dự án |
| `memory/memory.md` | Index gốc (meta chung) |
| `memory/{phase}/README.md` | Memory theo discovery, requirements, … |
| `memory/{phase}/decision-log.md` | Quyết định + phương án bị loại (schema: pack `docs/decision-log.md`) |
| `assets/public/`, `internal/` | Tài liệu thô |
| `brainstorm/` | File trao đổi theo ngày — **không** chia folder con |

`docs/` — copy từ [`docs-skeleton/`](../docs-skeleton/).
