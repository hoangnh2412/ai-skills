# Cài đặt Minipower

Hướng dẫn cài Minipower vào IDE. Xem giới thiệu & cách dùng: [README.md](README.md).

Có **2 phần độc lập**:

1. **Đăng ký skill** — để gõ `/minipower-sdlc` / `@minipower-sdlc` (bắt buộc).
2. **Rules + hooks** — token guard, auto-route, scope prompt (khuyến nghị, cài riêng).

---

## 1. Đăng ký skill

### Cursor

Cursor chỉ nhận skill tại **`.cursor/skills/{tên}/SKILL.md`**. Tạo **symbolic link** từ folder `sdlc/` trong repo `minipower` sang `.cursor/skills/minipower-sdlc` của workspace.

Chạy lệnh **từ root workspace** đang mở trong Cursor. Nếu `minipower` nằm ngoài workspace, thay path nguồn bằng **đường dẫn tuyệt đối** tới `…/minipower/sdlc`.

**macOS / Linux**

```bash
mkdir -p .cursor/skills
ln -snf "$(pwd)/minipower/sdlc" .cursor/skills/minipower-sdlc

# Kiểm tra
ls -la .cursor/skills/minipower-sdlc
test -f .cursor/skills/minipower-sdlc/SKILL.md && echo "OK"
```

> macOS: không dùng `ln` thiếu `-s` — không hard link được thư mục (`Is a directory`). Cờ `-n` tránh follow link cũ; `-f` ghi đè nếu đã tồn tại.

**Windows — PowerShell**

```powershell
New-Item -ItemType Directory -Force -Path .cursor\skills
$source = Join-Path (Get-Location) "minipower\sdlc"
New-Item -ItemType SymbolicLink -Force -Path .cursor\skills\minipower-sdlc -Target $source

# Hoặc path tuyệt đối:
# New-Item -ItemType SymbolicLink -Force -Path .cursor\skills\minipower-sdlc -Target "C:\path\to\minipower\sdlc"

# Kiểm tra
Test-Path .cursor\skills\minipower-sdlc\SKILL.md
```

**Windows — CMD**

```cmd
mkdir .cursor\skills
mklink /J "%CD%\.cursor\skills\minipower-sdlc" "%CD%\minipower\sdlc"
```

Sau khi link: trong chat gõ `/minipower-sdlc` hoặc `@minipower-sdlc`, kèm `Phase: discovery` (hoặc requirements, architecture, …).

> Skill con trong `skills/` **không** xuất hiện trong menu `/` — đó là hành vi bình thường của Cursor (chỉ nhận skill một cấp), không phải lỗi. Gọi phase con bằng `Phase:` hoặc `@skills/{phase}/SKILL.md`.

### Claude Code

Claude Code nhận skill tại **`.claude/skills/{tên}/SKILL.md`**. Symlink cả pack `sdlc/` vào — `SKILL.md` ở gốc pack là router.

```bash
MP=/path/to/minipower/sdlc
mkdir -p .claude/skills
ln -snf "$MP" .claude/skills/minipower-sdlc
test -f .claude/skills/minipower-sdlc/SKILL.md && echo "OK"
```

Sau khi link: gõ `/minipower-sdlc` kèm `Phase: discovery` (hoặc requirements, architecture, …). Rules + hooks (permissions, token guard) cài riêng — xem [install/claude/README.md](install/claude/README.md).

### OpenCode

Xem [install/opencode/README.md](install/opencode/README.md) — adapter riêng cài instructions + plugins TS.

---

## 2. Rules + hooks

Symlink skill **không** kéo rules/hooks. Cài riêng **từ root workspace project** (repo chứa `docs/` của dự án).

| IDE | Nội dung | Hướng dẫn |
|-----|----------|-----------|
| **Cursor** | Rules `.mdc` + hooks (token guard, profile guard, scope prompt) | [install/cursor/README.md](install/cursor/README.md) |
| **Claude Code** | Rules `.md` + permissions (tuỳ chọn) | [install/claude/README.md](install/claude/README.md) |
| **OpenCode** | Instructions `.md` + plugins TS (token guard, auto-route, profile guard) | [install/opencode/README.md](install/opencode/README.md) |

Guardrails agent (nguồn chung): [agents/README.md](agents/README.md) · Token guard: [docs/token-guard.md](docs/token-guard.md) · Profile guard: [agents/profile-guard.md](agents/profile-guard.md)

**Xong mục 1 + 2 → sang [mục 3](#3-sau-khi-cài--tạo-khung-dự-án-bằng-prompt)** để tạo khung dự án bằng `Init project`.

---

## 3. Sau khi cài — tạo khung dự án bằng prompt

> **Bước tiếp theo bắt buộc** nếu bạn mới bắt đầu một dự án Minipower: mở workspace (hoặc folder dự án mới) đã cài skill + hooks ở mục 1–2, rồi chạy **`Init project`** trong chat agent — **không** cần copy tay thư mục trước.

### Prompt khởi tạo

Trong Cursor / Claude Code / OpenCode, gõ:

```text
/minipower-sdlc
Init project {tên-dự-án}
```

Ví dụ:

```text
/minipower-sdlc
Init project billing-demo
```

Agent sẽ:

1. **Hỏi trọn gói 5 câu** (bắt buộc — trả lời một lượt):

   | # | Câu hỏi |
   |---|---------|
   | 1 | Tên bạn? (và xưng **anh** hay **chị**?) |
   | 2 | Vị trí trong dự án? (chọn nhiều: BA, PM, SA, DEV, QC, DevOps, Support) |
   | 3 | Dự án làm về gì? |
   | 4 | Giai đoạn hiện tại? (discovery → change-control) |
   | 5 | Đã từng dùng minipower chưa? (có / chưa) |

2. **Tạo khung dự án** tại `{tên-dự-án}/` (hoặc root workspace nếu bạn chỉ định vậy):

   ```text
   {project}/
   ├── AGENTS.md / CLAUDE.md   ← persona agent (tự sinh)
   ├── memory/profile.json     ← SSOT cá nhân hoá (hook profile-guard kiểm tra)
   ├── memory/                 ← context theo phase
   ├── assets/                 ← tài liệu gốc từ khách
   ├── brainstorm/             ← trao đổi theo ngày
   └── docs/                   ← DOC-01–18
   ```

3. **Điền** `README.md`, `memory/memory.md`, `memory/{phase}/` theo câu trả lời.

Sau init, mọi prompt làm việc minipower (Phase, DOC, `@docs/`, …) cần `memory/profile.json` hợp lệ — hook **profile-guard** chặn nếu thiếu. Cập nhật sau: `Reconfigure agent` / `Hoàn tất profile`.

Chi tiết đầy đủ: [SKILL.md — Khởi tạo](SKILL.md#khởi-tạo-cấu-trúc-dự-án-mặc-định) · Template persona: [templates/TPL-agent-profile.md](templates/TPL-agent-profile.md)

### Cách thủ công (tuỳ chọn)

Chỉ dùng khi không có agent hoặc CI/script:

```bash
PROJECT=my-project
MINIPOWER=/path/to/minipower/sdlc
mkdir -p "$PROJECT"
cp -R "$MINIPOWER/project-skeleton/"* "$PROJECT/"
cp -R "$MINIPOWER/docs-skeleton" "$PROJECT/docs"
```

Sau copy tay vẫn cần **hoàn tất profile** — gõ `Hoàn tất profile` và trả lời 5 câu để có `memory/profile.json` + `AGENTS.md` / `CLAUDE.md`; nếu không, profile-guard sẽ chặn prompt minipower.
