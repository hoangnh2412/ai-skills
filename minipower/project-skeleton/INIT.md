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
| `notes/` | Phân tích, trao đổi, decision log; chốt → distill vào `docs/` |
| `docs/` | Tài liệu baseline (Vision, BRD, kiến trúc, traceability, CR…) |
| `memory/` | Tóm tắt ngữ cảnh, module draft, stakeholder, trạng thái công việc |

## Nội dung skeleton (ngoài `docs/`)

| Path | Mô tả |
|------|--------|
| `README.md` | Entry dự án |
| `memory/memory.md` | Index context |
| `assets/public/`, `internal/` | Tài liệu thô |
| `notes/{phase}/` | Working papers 6 phase |

`docs/` — copy từ [`docs-skeleton/`](../docs-skeleton/).
