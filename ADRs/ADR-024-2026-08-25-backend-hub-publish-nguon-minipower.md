# Hub `backend/` — nguồn publish dời về repo minipower, khớp định vị module

| | |
|---|---|
| **Ngày** | 2026-08-25 |
| **Trạng thái** | ⚪ **Todo** — phương án chốt, chờ chủ repo duyệt rồi thi hành. **Thi hành SAU khi đợt [ADR-023](ADR-023-2026-08-25-tach-module-ops-tu-backend-troubleshooting.md) commit** — `backend/README.md` đang nằm trong working tree dở của đợt đó, sửa chồng sẽ trộn hai đợt |
| **Phạm vi** | Một file: `backend/README.md` (hub module). **Không** đụng skill, không đụng cơ chế cài Cursor/OpenCode (đã đúng), không đụng nội dung kỹ thuật .NET |
| **Nối tiếp** | **Thi hành nốt** [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) QĐ-1 — đợt đổi tên đã tách "Jarvis = framework" khỏi "pack trong repo" ở *tên*, nhưng mục Publish của hub còn nguyên *cơ chế* thời skill sống trong repo Jarvis · **Tuân theo** [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-2 (hệ tên) |
| **Mục đích** | Hết mâu thuẫn nội bộ "source of truth là repo nào"; consumer sync skill từ đúng nguồn; hub theo khuôn module như `sdlc/README.md` |
| **Ảnh hưởng** | `backend/README.md` (một file, ~15 chỗ) · pipeline CI của repo product tương lai (đổi tên biến pin — QĐ-3, xem ghi chú breaking) |

---

## §0. Quyết định

| # | Nội dung |
|---|---|
| **QĐ-1** | **Source of truth của skill backend = repo `minipower`, thư mục `backend/skills/`** — một nguồn duy nhất. Xoá tàn dư *"thư mục `.opencode/` trong repo Jarvis framework (repo này)"* — câu đó viết khi file còn sống trong repo Jarvis, nay **mâu thuẫn thẳng** với dòng 7 của chính file. **Framework Jarvis (code .NET) vẫn là repo ngoài** — chỉ *skill dạy cách dùng nó* sống ở minipower; hai thứ không được lẫn (ADR-021 QĐ-1) |
| **QĐ-2** | **Cơ chế publish giữ nguyên hình, đổi nguồn.** Submodule / symlink / copy-rsync → `.opencode/skills/` của repo product **giữ y nguyên**; mọi tham chiếu nguồn đổi: `git submodule add <url-repo-minipower> vendor/minipower` · `rsync vendor/minipower/backend/skills/ .opencode/skills/` · "sửa skill = PR trên repo **minipower**" · PR product ghi `chore: sync minipower skills @ <tag>` · path ví dụ `Jarvis_2` → `/path/to/minipower` |
| **QĐ-3** | **Biến pin version: `JARVIS_SKILLS_REF` → `MINIPOWER_SKILLS_REF`** (tag trên repo minipower; tag semver skill `minipower-skills-vX.Y.Z` thay `skills-vX.Y.Z`). ⚠️ **Breaking cho consumer** nào đang dùng biến cũ trong pipeline — hiện consumer là nội bộ, đổi sớm rẻ hơn nuôi tên sai; nếu có pipeline thật đang chạy, giữ alias biến cũ một nhịp chuyển tiếp và ghi rõ trong PR |
| **QĐ-4** | **Hub theo khuôn module** (như `sdlc/README.md` sau [commit 3569ecc]): tiêu đề `# Code backend .NET (backend) — framework Jarvis` khớp nhãn ở README gốc; thêm đoạn "backend là gì" — *module của Minipower, N skill **lá-rời**: mô tả việc bằng lời là skill tự kích hoạt* (điểm bán chính, hiện không được nhắc); một câu quan hệ với Quy trình phát triển — *nhận DOC-08 / DOC-11 / DOC-12 tại H4* (đúng như `PACK.md` khai `consumes` + `handoff-in`); sửa mô tả link `../README.md` thành "bản đồ Minipower" (không phải "framework overview") |
| **QĐ-5** | **Không đổi:** mục Cài vào Cursor / PowerShell / OpenCode (đã chuẩn sau ADR-021) · bảng skill (đợt ADR-023 sở hữu, có test `backend-pack` canh khớp thư mục — số skill viết là **N động theo bảng**, không khai cứng trong hub) · Prompt nhanh · cấu trúc `.opencode/` phía consumer |

---

## §1. Bảng sửa — dòng cũ → dòng mới

Số dòng theo bản hiện hành; thi hành đối chiếu lại sau khi đợt ADR-023 commit.

| Dòng | Cũ | Mới |
|---|---|---|
| 1 | `# Minipower Backend — skill implementation .NET (framework Jarvis)` | `# Code backend .NET (backend) — framework Jarvis` |
| 3 | "Bản đồ skill **code-backend** của minipower…" | "Module `backend` của **Minipower** — N skill **lá-rời** dạy framework Jarvis .NET… + câu lá-rời tự kích hoạt + câu H4 (QĐ-4)" |
| 87 | "Framework overview: [README.md](../README.md) (repo gốc)" | "Bản đồ Minipower: [README.md](../README.md)" |
| 91 | "source of truth: `.opencode/` trong repo **Jarvis framework** (repo này)…" | "source of truth: `backend/skills/` trong repo **minipower** (repo này). Repo product không fork/sửa skill — chỉ sync." |
| 98 | "copy hoặc symlink từ Jarvis (file này)" | "…từ minipower" |
| 115 | "Submodule trỏ repo Jarvis; consumer chỉ mount/copy `.opencode`" | "Submodule trỏ repo minipower; consumer copy `backend/skills/` → `.opencode/skills/`" |
| 120, 161 | "sửa tại repo **Jarvis** rồi sync" · "PR trên repo **Jarvis**" | → repo **minipower** |
| 126–135 | `git submodule add <url-repo-jarvis> vendor/jarvis` + `rsync vendor/jarvis/.opencode/ .opencode/` | `git submodule add <url-repo-minipower> vendor/minipower` + `rsync vendor/minipower/backend/skills/ .opencode/skills/` (kèm copy `backend/README.md` → `.opencode/README.md`) |
| 141, 149 | `ln -snf /path/to/Jarvis_2/.opencode .opencode` · `JARVIS_ROOT=/path/to/Jarvis_2` | Path nguồn `/path/to/minipower/backend/skills` |
| 157 | `JARVIS_SKILLS_REF=v1.2.0` (tag trên repo Jarvis) | `MINIPOWER_SKILLS_REF=v1.2.0` (tag trên repo minipower) — QĐ-3 |
| 163–164 | "`chore: sync Jarvis skills @ <tag>`" · tag `skills-v1.3.0` | "`chore: sync minipower skills @ <tag>`" · tag `minipower-skills-v1.3.0` |
| 169 | "link hub **Jarvis**" | "link hub `backend` của minipower" |

**Giữ nguyên có chủ đích** (QĐ-1 ADR-021 — chữ chỉ framework/repo ngoài): tên "framework Jarvis" trong mô tả nội dung skill, package `Jarvis.*`, tên sản phẩm trong tiêu đề.

---

## §2. Việc phải làm

| # | Việc | Xong khi |
|---|---|---|
| 1 | Chờ đợt ADR-023 commit `backend/README.md` (đang dở trong working tree) | `git status` sạch phần backend |
| 2 | Áp bảng §1 + QĐ-4 lên hub | grep `repo Jarvis` · `Jarvis_2` · `JARVIS_SKILLS_REF` · `code-backend` trong file = 0; chữ "Jarvis" còn lại chỉ chỉ framework |
| 3 | Verify: `npm test` (backend-pack canh bảng skill) + `npm run link:check` 0 MỚI | Cả hai xanh |

---

*Liên quan:* [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) (tách tên Jarvis/pack — ADR này tách nốt *cơ chế*) · [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) (hệ tên, khuôn hub) · [ADR-023](ADR-023-2026-08-25-tach-module-ops-tu-backend-troubleshooting.md) (đợt đang dở cùng file) · [contracts/pack-manifest.md](../contracts/pack-manifest.md) (H4, consumes của backend)
