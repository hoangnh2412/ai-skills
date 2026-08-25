# Project skeleton — Hướng dẫn maintainer

Khung khởi tạo dự án mặc định. Agent/user copy vào `{project}/` theo [SKILL.md](../SKILL.md).

## Lệnh khởi tạo

```bash
PROJECT=my-project
MINIPOWER=/path/to/minipower/sdlc

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
| `FAQ.md` | FAQ hướng dẫn thiết lập sẵn (làm gì / làm thế nào / thiếu gì) |

## Nội dung skeleton (ngoài `docs/`)

| Path | Mô tả |
|------|--------|
| `README.md` | Entry dự án |
| `FAQ.md` | FAQ hướng dẫn thiết lập sẵn (làm gì / làm thế nào / thiếu gì) |
| `memory/profile.json` | *(tạo lúc init)* — SSOT cá nhân hoá |
| `memory/memory.md` | Index gốc (meta chung) |
| `memory/{phase}/README.md` | Memory theo discovery, requirements, … |
| `memory/{phase}/decision-log.md` | Quyết định + phương án bị loại (schema: pack `docs/decision-log.md`) |
| `memory/doc-debt.md` | **Sổ nợ tài liệu** — cái gì thiếu & vì sao chấp nhận thiếu; điều kiện lên `standard` |
| `assets/public/`, `internal/` | Tài liệu thô |
| `assets/archive/` | **Tài liệu cũ, rời rạc** — nguồn tham chiếu, *không* phải artifact; README có cột độ tin cậy |
| `brainstorm/` | File trao đổi theo ngày — **không** chia folder con |

`docs/` — copy từ [`docs-skeleton/`](../docs-skeleton/).

## Copy đủ khung ở MỌI chế độ

Init copy **nguyên** skeleton bất kể `project_mode` là `mvp`, `standard` hay `maintain`. **Không** cắt folder theo chế độ.

Lý do: `mvp`/`maintain` rồi sẽ phải bổ sung tài liệu. Cắt folder hôm nay là tạo việc di trú ngày mai — dời file, sửa mọi đường dẫn trong tài liệu cũ. Giữ nguyên khung thì lên `standard` chỉ là **điền tiếp**.

Hệ quả: ở `mvp`/`maintain` sẽ có folder rỗng. Đó là **có chủ đích**, và phải nói ra bằng README — folder rỗng không lời giải thích trông như lỗi cài đặt.

### README chuẩn cho folder chưa dùng

Agent đặt file `README.md` với nội dung sau vào **mỗi** folder `docs/` nằm ngoài `docs_focus` của chế độ hiện tại:

```markdown
# (chưa điền)

Folder này **cố ý để trống** vì dự án đang ở chế độ **`{mode}`** — `docs_focus` của chế độ
này chưa gồm {DOC-NN…}.

Không phải lỗi cài đặt, và **không** xoá folder: khung giữ nguyên để khi lên `standard`
chỉ cần điền tiếp, không phải di trú cấu trúc.

Món nợ tương ứng ghi ở [`memory/doc-debt.md`](../../memory/doc-debt.md).
```

Thay `{mode}` và `{DOC-NN…}` bằng giá trị thật. Bảng `docs_focus` từng chế độ: [SKILL.md § Chế độ dự án](../SKILL.md#chế-độ-dự-án-project_mode) (vùng generated từ `rules.json`).
