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
| **Interview** | [`interview/`](interview/) | Phỏng vấn C#/.NET và React/Frontend | [interview/README.md](interview/README.md) |

---

## Cài vào Cursor

Cursor nhận skill tại **`.cursor/skills/{tên}/SKILL.md`**. Repo này là **source of truth** — cần link hoặc copy vào workspace đang làm việc.

| Pack | Hướng dẫn cài |
|------|----------------|
| **Minipower** | [minipower/README.md#cài-vào-cursor](minipower/README.md#cài-vào-cursor) — symlink một folder; rules/hooks: [minipower/README.md#cài-rules--hooks](minipower/README.md#cài-rules--hooks) |
| **Jarvis .NET** | [jarvis/README.md#cài-vào-cursor](jarvis/README.md#cài-vào-cursor) — symlink từng skill hoặc tree `.opencode/skills/` |
| **Interview** | [interview/README.md](interview/README.md) — `@` file track, không cần symlink |
| **Convention** | `@skills/dotnet-structure.md` (hoặc file tương ứng trong workspace) |

---

## Nguyên tắc chung

| Nguyên tắc | Mô tả |
|------------|--------|
| **Source of truth** | Sửa skill tại repo `ai-skills`; repo product **sync** (submodule / rsync / symlink), không fork chỉnh tay |
| **SKILL.md cho agent** | Quy tắc, workflow, output bắt buộc |
| **README.md cho người** | Hướng dẫn sử dụng, bảng tra, prompt mẫu |
| **Một pack — một hub** | `jarvis/README.md`, `minipower/README.md`, `interview/README.md` là điểm vào; README gốc (file này) là bản đồ toàn repo |

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
- [Interview hub](interview/README.md)
