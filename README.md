# ai-skills

Bộ **skill và tài liệu hướng dẫn AI** dùng với Cursor, OpenCode, Claude và các agent tương tự — tập trung vào phát triển **.NET / Jarvis**, quy trình **BA & kiến trúc doanh nghiệp (Minipower)**, và bộ **phỏng vấn kỹ thuật**.

**License:** [MIT](LICENSE) · Copyright (c) 2026 Hoàng Nguyễn

---

## Bộ skill chính

| Pack | Thư mục | Dùng khi | Hướng dẫn |
|------|---------|----------|-----------|
| **Jarvis .NET** | [`jarvis/`](jarvis/) | Scaffold backend .NET, CQRS, EF, auth, cache, OTEL, health, review PR | [jarvis/README.md](jarvis/README.md) |
| **Minipower** | [`minipower/`](minipower/) | Discovery → requirements → architecture → planning → delivery → change-control | [minipower/README.md](minipower/README.md) |
| **Convention** | [`skills/`](skills/) | Clean Architecture, DDD, coding convention, code review, UI kit | Xem [danh sách bên dưới](#skills-convention-chung) |
| **Interview** | [`interview/`](interview/) | Phỏng vấn C#/.NET và React/Frontend | [interview-dotnet](interview/interview-dotnet/README.md) · [interview-reactjs](interview/interview-reactjs/README.md) |

---

## Cài vào Cursor

Cursor chỉ nhận skill tại **`.cursor/skills/{tên}/SKILL.md`**. Repo này là **source of truth** — cần link hoặc copy vào workspace đang làm việc.

### Minipower

Tạo **symbolic link** từ folder `minipower/` trong repo này sang `.cursor/skills/minipower` của workspace.

Chạy lệnh **từ root workspace** đang mở trong Cursor. Nếu `ai-skills` nằm ngoài workspace, thay path nguồn bằng **đường dẫn tuyệt đối** tới `…/ai-skills/minipower`.

#### macOS

```bash
mkdir -p .cursor/skills
ln -snf "$(pwd)/ai-skills/minipower" .cursor/skills/minipower

# Kiểm tra
ls -la .cursor/skills/minipower
test -f .cursor/skills/minipower/SKILL.md && echo "OK"
```

> Không dùng `ln` không có `-s` — macOS không cho hard link tới thư mục (`Is a directory`).

#### Linux

```bash
mkdir -p .cursor/skills
ln -snf "$(pwd)/ai-skills/minipower" .cursor/skills/minipower

# Kiểm tra
ls -la .cursor/skills/minipower
test -f .cursor/skills/minipower/SKILL.md && echo "OK"
```

> Cờ `-n` tránh follow link cũ; `-f` ghi đè nếu đã tồn tại.

#### Windows

**PowerShell** (khuyên dùng):

```powershell
New-Item -ItemType Directory -Force -Path .cursor\skills
$source = Join-Path (Get-Location) "ai-skills\minipower"
New-Item -ItemType SymbolicLink -Force -Path .cursor\skills\minipower -Target $source

# Hoặc path tuyệt đối:
# New-Item -ItemType SymbolicLink -Force -Path .cursor\skills\minipower -Target "C:\path\to\ai-skills\minipower"

# Kiểm tra
Test-Path .cursor\skills\minipower\SKILL.md
```

**CMD** (cần quyền tạo symlink; target phải là path tuyệt đối):

```cmd
mkdir .cursor\skills
mklink /D .cursor\skills\minipower "C:\path\to\ai-skills\minipower"
```

**Git Bash** — dùng lệnh giống macOS/Linux ở trên.

> Trên Windows, bật **Developer Mode** (Settings → For developers) hoặc chạy terminal **Run as administrator** nếu `New-Item` / `mklink` báo thiếu quyền tạo symlink.

Trong chat: `/minipower` hoặc `@minipower`, kèm `Phase: discovery` (hoặc requirements, architecture, …).

### Jarvis .NET

```bash
mkdir -p .cursor/skills
for d in /path/to/ai-skills/jarvis/skills/*/; do
  name=$(basename "$d")
  ln -snf "$d" ".cursor/skills/$name"
done
```

Hoặc symlink cả tree (nếu dùng path `.opencode/skills/` trong prompt):

```bash
ln -snf /path/to/ai-skills/jarvis/skills .opencode/skills
```

Chi tiết publish sang repo product: [jarvis/README.md](jarvis/README.md).

---

## Jarvis — skill con

| Skill | Mô tả |
|-------|--------|
| [jarvis-dotnet](jarvis/skills/jarvis-dotnet/) | Scaffold / init / add solution Jarvis |
| [foundation-dotnet](jarvis/skills/foundation-dotnet/) | Json, CORS, WebApi, ApiResponseWrapper |
| [application-dotnet](jarvis/skills/application-dotnet/) | CQRS Application layer |
| [authentication-dotnet](jarvis/skills/authentication-dotnet/) | JWT, API Key, Cognito |
| [notification-dotnet](jarvis/skills/notification-dotnet/) | Email SMTP Mailkit |
| [caching-dotnet](jarvis/skills/caching-dotnet/) | Memory + Redis cache |
| [entityframework-dotnet](jarvis/skills/entityframework-dotnet/) | EF multitenancy |
| [swashbuckle-dotnet](jarvis/skills/swashbuckle-dotnet/) | Swagger / OpenAPI |
| [healthcheck-dotnet](jarvis/skills/healthcheck-dotnet/) | Health endpoints |
| [telemetry-dotnet](jarvis/skills/telemetry-dotnet/) | OpenTelemetry |
| [analyze-metric-dotnet](jarvis/skills/analyze-metric-dotnet/) | Đọc Grafana .NET Runtime Metrics |
| [blobstoring-dotnet](jarvis/skills/blobstoring-dotnet/) | FileSystem / MinIO blob |
| [code-review-dotnet](jarvis/skills/code-review-dotnet/) | Review PR C#/.NET |

**Prompt mẫu:**

```text
@jarvis/skills/jarvis-dotnet/workflows/scaffold.md
Scaffold backend .NET 9: Product=Acme, product=acme
```

---

## Minipower — pipeline & phase

```text
Business Goal → Stakeholder → Process → Requirement → Solution
```

| Phase | Skill con | DOC |
|-------|-----------|-----|
| Discovery | `skills/discovery/` | 01–03 |
| Requirements | `skills/requirements/` | 04–07, 13 |
| Architecture | `skills/architecture/` | 08–12 |
| Planning | `skills/planning/` | 14–15 |
| Delivery | `skills/delivery/` | 16–17 |
| Change control | `skills/change-control/` | 18 |

**Khởi tạo dự án mới:**

```bash
PROJECT=my-project
MINIPOWER=/path/to/ai-skills/minipower
mkdir -p "$PROJECT"
cp -R "$MINIPOWER/project-skeleton/"* "$PROJECT/"
cp -R "$MINIPOWER/docs-skeleton" "$PROJECT/docs"
```

Cấu trúc: `memory/` · `assets/` · `brainstorm/` · `docs/` (DOC-01–18). Chi tiết: [minipower/SKILL.md](minipower/SKILL.md).

**Prompt mẫu:**

```text
/minipower
Phase: discovery — phân tích scope dự án X, output DOC-01–03 draft
```

---

## Skills — convention chung

| File | Nội dung |
|------|----------|
| [dotnet-structure.md](skills/dotnet-structure.md) | Cấu trúc solution .NET phân lớp |
| [dotnet-clean-architecture.md](skills/dotnet-clean-architecture.md) | Clean Architecture |
| [dotnet-ddd.md](skills/dotnet-ddd.md) | Domain-Driven Design |
| [dotnet-coding-convention.md](skills/dotnet-coding-convention.md) | Quy ước code C# |
| [code_review.md](skills/code_review.md) | Hướng dẫn review code (generic) |
| [tabler-uikit-skill.md](skills/tabler-uikit-skill.md) | Tabler UI kit |
| [template-skill.md](skills/template-skill.md) | Template tạo skill Jarvis mới |
| [tutorial-index.md](skills/tutorial-index.md) | Index hướng dẫn Jarvis (tham chiếu) |
| [cursorignore.md](skills/cursorignore.md) | Gợi ý `.cursorignore` |

Dùng bằng `@skills/dotnet-structure.md` (hoặc path tương đối trong workspace).

---

## Interview

Bộ câu hỏi phỏng vấn có tiêu chí, form chấm điểm, live code và hướng dẫn HR.

| Track | README | Band |
|-------|--------|------|
| **C# / .NET** | [interview/interview-dotnet/](interview/interview-dotnet/README.md) | Junior → Senior |
| **React / Frontend** | [interview/interview-reactjs/](interview/interview-reactjs/README.md) | Junior → Senior |

Lịch sử brainstorming: [interview/brainstoming.md](interview/brainstoming.md)

---

## Nguyên tắc chung

| Nguyên tắc | Mô tả |
|------------|--------|
| **Source of truth** | Sửa skill tại repo `ai-skills`; repo product **sync** (submodule / rsync / symlink), không fork chỉnh tay |
| **SKILL.md cho agent** | Quy tắc, workflow, output bắt buộc |
| **README.md cho người** | Hướng dẫn sử dụng, bảng tra, prompt mẫu |
| **Một pack — một hub** | `jarvis/README.md`, `minipower/README.md` là điểm vào; README gốc (file này) là bản đồ toàn repo |

---

## Đóng góp

1. Thay đổi skill → PR trên repo `ai-skills`.
2. Repo consumer cập nhật symlink / `rsync` / submodule theo tag hoặc commit mới.
3. Skill Jarvis mới: làm theo [skills/template-skill.md](skills/template-skill.md).

---

## Liên kết nhanh

- [Jarvis skill hub](jarvis/README.md)
- [Minipower skill hub](minipower/README.md)
- [Minipower router (SKILL.md)](minipower/SKILL.md)
- [18 DOC templates](minipower/templates/README.md)
- [Interview .NET](interview/interview-dotnet/README.md)
- [Interview React](interview/interview-reactjs/README.md)
