# minipower

**Nền tảng công cụ AI của toàn công ty** — bộ **skill + tài liệu + hook** theo module, dùng với Cursor, OpenCode, Claude và các agent tương tự. Lõi là pipeline vòng đời phần mềm (`sdlc`), quanh nó là các module kỹ năng theo chức năng (`backend` hôm nay; `frontend` · `autotest` · `design` · `slide` khi có nội dung thật).

Hệ tên: **`minipower`** = thương hiệu (repo · tiền tố skill · plugin); **tên module** = chức năng một-từ; skill đăng ký dạng `minipower-{module}-{capability}[-{stack}]` — gõ "minipower" trong ô search là thấy toàn bộ.

> Thư mục repo hiện có thể còn mang tên cũ `ai-skills` — sẽ đổi thành `minipower` sau; tài liệu viết theo tên đích.

**License:** [MIT](LICENSE) · Copyright (c) 2026 Hoàng Nguyễn

---

## Module

| Module | Thư mục | Dùng khi | Hướng dẫn |
|--------|---------|----------|-----------|
| **sdlc** — lõi pipeline | [`sdlc/`](sdlc/) | Discovery → requirements → architecture → planning → delivery → change-control; router `minipower-sdlc` | [sdlc/README.md](sdlc/README.md) |
| **backend** — code .NET | [`backend/`](backend/) | Scaffold backend .NET (framework Jarvis), CQRS, EF, auth, cache, OTEL, health, review PR — 15 skill `minipower-backend-*-dotnet` | [backend/README.md](backend/README.md) |
| **contracts** — hợp đồng liên-pack | [`contracts/`](contracts/) | Trace spine · handoff H1–H6 · lingua franca · cross-repo bridge · schema `PACK.md` | [contracts/README.md](contracts/README.md) |
| **fundamentals** — kiến thức nền | [`fundamentals/`](fundamentals/) | Convention .NET/DDD/testing, template skill, bộ phỏng vấn kỹ thuật | [fundamentals/tutorial-index.md](fundamentals/tutorial-index.md) |

---

## Cài đặt

Repo này là **source of truth** — link hoặc copy vào workspace đang làm việc; repo product **sync** (submodule / rsync / symlink), không fork chỉnh tay.

| Module | Hướng dẫn cài |
|--------|----------------|
| **sdlc** | [sdlc/INSTALL.md](sdlc/INSTALL.md) — symlink một folder thành skill `minipower-sdlc`; hooks: `node sdlc/install/claude/install.mjs` (Claude) · [sdlc/install/](sdlc/install/) (Cursor/OpenCode) |
| **backend** | [backend/README.md#cài-vào-cursor](backend/README.md#cài-vào-cursor) — symlink từng skill lá hoặc tree `.opencode/skills/` |
| **fundamentals** | `@` thẳng file trong workspace (vd `@fundamentals/dotnet-structure.md`), không cần symlink |

---

## Ba chế độ dự án — dùng sdlc cho tình huống nào

Không dự án nào cũng cần đủ 19 tài liệu. `sdlc` có **`project_mode`**, chọn khi khởi tạo, quyết định *tài liệu nào cần điền* và *cảnh báo nào bật* — nhưng **dùng chung một cấu trúc thư mục**, nên đổi chế độ về sau không phải di trú gì.

| Chế độ | Khi nào chọn | Điền gì | Lên đời |
|--------|--------------|---------|---------|
| **`mvp`** | *"3 tuần nữa demo, làm chạy được trước"* | BRD + FR + AC + hướng dẫn triển khai rút gọn | Trả nợ theo `doc-debt.md` → chốt baseline → `standard` |
| **`standard`** | Outsource, sản phẩm mới, khách nghiệm thu theo tài liệu | Đủ 19 DOC, có baseline, sau baseline đổi gì cũng qua CR | Bàn giao / vận hành |
| **`maintain`** | Tiếp quản hệ chạy nhiều năm, tài liệu thất lạc | Khai quật cái **đang có**: business rule, kiến trúc, data model, runbook | As-built đủ → chốt baseline → `standard` |

Chỉ `standard` có cảnh báo **chặn** (và luôn mở được bằng `BYPASS`); hai chế độ kia chỉ nhắc. Ở mọi chế độ, **con người là người ra lệnh** — hệ cảnh báo, bạn xác nhận là chạy.

Chi tiết: [sdlc/SKILL.md § Chế độ dự án](sdlc/SKILL.md#chế-độ-dự-án-project_mode) · [ADR-020](ADRs/ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md)

---

## Nguyên tắc chung

| Nguyên tắc | Mô tả |
|------------|--------|
| **Source of truth** | Sửa skill tại repo `minipower`; repo product **sync** (submodule / rsync / symlink), không fork chỉnh tay |
| **SKILL.md cho agent** | Quy tắc, workflow, output bắt buộc |
| **README.md cho người** | Hướng dẫn sử dụng, bảng tra, prompt mẫu |
| **Một module — một hub** | `sdlc/README.md`, `backend/README.md`, `contracts/README.md` là điểm vào; README gốc (file này) là bản đồ toàn repo |
| **Sở hữu khuôn, không sở hữu đất sét** | minipower giữ quy trình/template/kỷ luật trace; tri thức nghiệp vụ, code, task sống ở hệ thống của chúng |

---

## Đóng góp

1. Thay đổi skill → PR trên repo `minipower`.
2. Repo consumer cập nhật symlink / `rsync` / submodule theo tag hoặc commit mới.
3. Skill backend mới: làm theo [fundamentals/template-skill.md](fundamentals/template-skill.md).
4. Module mới: quy tắc 3 câu hỏi + "chưa có skill thật chưa tạo folder" — xem [AGENTS.md](AGENTS.md) §Quy ước.

---

## Liên kết nhanh

- [sdlc hub](sdlc/README.md) · [sdlc router (SKILL.md)](sdlc/SKILL.md) · [19 DOC templates](sdlc/templates/README.md)
- [backend hub](backend/README.md)
- [contracts — hợp đồng liên-pack](contracts/README.md)
- [fundamentals — tutorial index](fundamentals/tutorial-index.md) · [interview](fundamentals/interview/)
