# Cài đặt Minipower

Hướng dẫn cài Minipower vào IDE. Xem giới thiệu & cách dùng: [README.md](README.md).

Có **2 phần độc lập**:

1. **Đăng ký skill** — để gõ `/minipower` / `@minipower` (bắt buộc).
2. **Rules + hooks** — token guard, auto-route, scope prompt (khuyến nghị, cài riêng).

---

## 1. Đăng ký skill

### Cursor

Cursor chỉ nhận skill tại **`.cursor/skills/{tên}/SKILL.md`**. Tạo **symbolic link** từ folder `minipower/` trong repo `ai-skills` sang `.cursor/skills/minipower` của workspace.

Chạy lệnh **từ root workspace** đang mở trong Cursor. Nếu `ai-skills` nằm ngoài workspace, thay path nguồn bằng **đường dẫn tuyệt đối** tới `…/ai-skills/minipower`.

**macOS / Linux**

```bash
mkdir -p .cursor/skills
ln -snf "$(pwd)/ai-skills/minipower" .cursor/skills/minipower

# Kiểm tra
ls -la .cursor/skills/minipower
test -f .cursor/skills/minipower/SKILL.md && echo "OK"
```

> macOS: không dùng `ln` thiếu `-s` — không hard link được thư mục (`Is a directory`). Cờ `-n` tránh follow link cũ; `-f` ghi đè nếu đã tồn tại.

**Windows — PowerShell**

```powershell
New-Item -ItemType Directory -Force -Path .cursor\skills
$source = Join-Path (Get-Location) "ai-skills\minipower"
New-Item -ItemType SymbolicLink -Force -Path .cursor\skills\minipower -Target $source

# Hoặc path tuyệt đối:
# New-Item -ItemType SymbolicLink -Force -Path .cursor\skills\minipower -Target "C:\path\to\ai-skills\minipower"

# Kiểm tra
Test-Path .cursor\skills\minipower\SKILL.md
```

**Windows — CMD**

```cmd
mkdir .cursor\skills
mklink /J "%CD%\.cursor\skills\minipower" "%CD%\ai-skills\minipower"
```

Sau khi link: trong chat gõ `/minipower` hoặc `@minipower`, kèm `Phase: discovery` (hoặc requirements, architecture, …).

> Skill con trong `skills/` **không** xuất hiện trong menu `/` — đó là hành vi bình thường của Cursor (chỉ nhận skill một cấp), không phải lỗi. Gọi phase con bằng `Phase:` hoặc `@skills/{phase}/SKILL.md`.

### Claude Code / OpenCode

Xem hướng dẫn riêng theo IDE ở bảng **Rules + hooks** bên dưới — mỗi adapter có script cài skill + rules cùng lúc.

---

## 2. Rules + hooks

Symlink skill **không** kéo rules/hooks. Cài riêng **từ root workspace project** (repo chứa `docs/` của dự án).

| IDE | Nội dung | Hướng dẫn |
|-----|----------|-----------|
| **Cursor** | Rules `.mdc` + hooks (token guard, scope prompt) | [install/cursor/README.md](install/cursor/README.md) |
| **Claude Code** | Rules `.md` + permissions (tuỳ chọn) | [install/claude/README.md](install/claude/README.md) |
| **OpenCode** | Instructions `.md` + plugins TS (token guard, auto-route) | [install/opencode/README.md](install/opencode/README.md) |

Guardrails agent (nguồn chung): [agents/README.md](agents/README.md) · Token guard: [docs/token-guard.md](docs/token-guard.md)

---

## 3. Khởi tạo dự án mới

Sau khi đăng ký skill, tạo khung thư mục cho một dự án:

```bash
PROJECT=my-project
MINIPOWER=/path/to/ai-skills/minipower
mkdir -p "$PROJECT"
cp -R "$MINIPOWER/project-skeleton/"* "$PROJECT/"
cp -R "$MINIPOWER/docs-skeleton" "$PROJECT/docs"
```

Hoặc gõ `/minipower` + `Init project` để agent tự tạo. Cấu trúc sinh ra: `memory/` · `assets/` · `brainstorm/` · `docs/` (DOC-01–18). Chi tiết: [SKILL.md](SKILL.md#khởi-tạo-cấu-trúc-dự-án-mặc-định).
