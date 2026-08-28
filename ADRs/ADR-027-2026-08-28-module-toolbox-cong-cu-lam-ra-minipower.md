# Mở module `toolbox/` — công cụ làm ra chính Minipower; `template-skill.md` thành skill

| | |
|---|---|
| **Ngày** | 2026-08-28 |
| **Trạng thái** | chốt 2026-08-28 (Q1–Q3 §6 duyệt hết); thi hành cùng ngày — còn **T1 smoke** chủ repo tự chạy |
| **Phạm vi** | Mở module thứ tư `toolbox/`; chuyển `fundamentals/template-skill.md` thành skill lá `minipower-toolbox-skill-author`, tổng quát hoá cho mọi module lá-rời |
| **Ngoài phạm vi** | Skill viết ADR, skill mở module tự động (ghi ở `toolbox/README.md` §Sẽ có, chưa viết) · luật viết skill trong `sdlc/` (router-gộp, `rules.json` — không đổi) · **chuẩn hoá các file `fundamentals/` còn lại thành skill** — định hướng chủ repo xác nhận tại §6 Q1, làm dần từng file, chưa mở đợt |
| **Nối tiếp** | [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) (QĐ-7 quy tắc 3 câu hỏi, QĐ-4 hệ tên, QĐ-8 PACK.md) · [ADR-023](ADR-023-2026-08-25-tach-module-ops-tu-backend-troubleshooting.md) (khuôn mở module + test canh) · [ADR-024](ADR-024-2026-08-25-backend-hub-publish-nguon-minipower.md) (nguồn vs đích publish) |
| **Mục đích** | Ghi lại vì sao có một module **không phục vụ dự án đích**, và vì sao khuôn viết skill phải là skill chứ không phải tài liệu |
| **Ảnh hưởng** | `toolbox/` (mới: `PACK.md` · `README.md` · `skills/minipower-toolbox-skill-author/`) · [fundamentals/](../staging/) (xoá `template-skill.md`) · [README.md](../README.md) §Minipower có gì + cây thư mục + nguyên tắc tổ chức · [AGENTS.md](../AGENTS.md) §0 nhiệm vụ + §SKILL.md cho agent + §Quy ước đặt tên · [contracts/pack-manifest.md](../contracts/pack-manifest.md) §1 (thêm giá trị `minipower` vào enum `repo:`) · `sdlc/hooks/test/toolbox-pack.test.js` (mới) + `test/pack-manifest.test.js` (`MODULES`) · [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) + [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) (**chỉ href** — QĐ-11 ADR-022) |

---

## §1. Bối cảnh

`fundamentals/template-skill.md` (375 dòng) là khuôn viết skill de-facto của repo: [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) §2 dẫn nó làm nguồn cho ràng buộc *"`name:` frontmatter trùng tên thư mục lá"*, ADR-021/022 khai nó trong mục **Ảnh hưởng**. Nói cách khác: nó **load-bearing**, nhưng sống ở tầng nền `fundamentals/` — nơi không được cài, không có `description`, không có test canh.

Cùng lúc, đợt 2026-08-28 đã chuyển `fundamentals/dotnet-coding-convention.md` → `backend/skills/minipower-backend-convention-dotnet/` với đúng lập luận đó: *tài liệu ở `fundamentals/` không bao giờ tới tay agent*.

Khác biệt: convention phục vụ **repo product**, nên đi theo module `backend`. Khuôn viết skill phục vụ **maintainer repo minipower** — không module chức năng nào hiện có nhận nó.

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Khuôn viết skill là **tài liệu**, chỉ có tác dụng khi có người nhớ mở | Skill mới viết theo trí nhớ; lệch chuẩn phát hiện lúc review, hoặc không bao giờ |
| P2 | Nội dung bó cứng .NET/Jarvis (`providers/`, `program-setup.cs`, quan hệ với `scaffold-dotnet`) | `ops/` cũng là lá-rời nhưng không có khuôn; module mới càng không |
| P3 | 6 link `.opencode/…` trong file đã chết, nằm trong `link-check.baseline.txt` như nợ | Khuôn chuẩn của repo lại là file gãy link nhiều nhất tầng nền |
| P4 | Có loại skill **không thuộc module chức năng nào**: công cụ để làm ra module khác | Không có chỗ đứng ⇒ hoặc nhét bừa vào `backend/` (sai người dùng), hoặc bỏ mặc ở `fundamentals/` |
| P5 | Lỗi đắt nhất khi viết skill lá-rời là `description` mơ hồ — skill không bao giờ được gọi | Không test nào bắt được; tài liệu tĩnh cũng không nhắc đúng lúc |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-7 không mở lại: 3 câu hỏi phân loại + luật *tên theo việc* + luật *chưa có skill thật thì chưa tạo thư mục* |
| C2 | Hệ tên hai tầng `minipower-{module}-{capability}[-{stack}]` (QĐ-4) giữ nguyên |
| C3 | "Cứng bằng máy, mềm bằng lời" — thứ mới phải kèm test/CI, không dựa vào kỷ luật con người |
| C4 | Không kéo repo về phía agent tự động hoá: skill này **soạn thảo**, người quyết nội dung |

## §4. Phương án

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | Giữ nguyên ở `fundamentals/`, chỉ sửa 6 link chết | Rẻ nhất, 0 cấu trúc mới | Không giải P1/P2/P5 — vẫn là tài liệu phải nhớ mở | ❌ |
| O2 | Vào `backend/skills/minipower-backend-skill-author-dotnet/` | Đồng nhất với đợt `convention-dotnet` vừa làm | Sai người dùng: `backend/` **rsync sang repo product**, nơi không ai tạo skill minipower ([ADR-024](ADR-024-2026-08-25-backend-hub-publish-nguon-minipower.md)) | ❌ |
| O3 | Skill core `sdlc/skills/skill-author/` theo QĐ-7 câu 1 | Đúng chữ *"tác động lên tài liệu minipower sở hữu"* | `sdlc` là router-gộp cài vào **workspace dự án đích**; khuôn viết skill lẫn vào bộ skill phase là nhiễu | ❌ |
| O4 | **Module mới `toolbox/`** — nhóm công cụ làm ra chính minipower | Đúng QĐ-7 câu 2 (*người dùng khác hẳn*); có chỗ cho `toolbox-adr`, `toolbox-module` sau này; không đụng module nào đang chạy | Mở module cho đúng 1 skill; tên là danh từ chứa đồ ⇒ rủi ro thành sọt rác (giảm thiểu bằng QĐ-5) | ✅ chọn |

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **Mở module `toolbox/`** — nhóm skill *công cụ làm ra chính minipower* | Lọc qua QĐ-7 câu 2: người dùng là **maintainer repo minipower**, khác hẳn người làm dự án đích. Khuôn y `ops/`: `PACK.md` + `README.md` + `skills/` lá-rời + test canh |
| **QĐ-2** | `fundamentals/template-skill.md` → **`toolbox/skills/minipower-toolbox-skill-author/`**, xoá bản cũ | Không giữ hai nguồn. Nội dung **tổng quát hoá** cho mọi module lá-rời (`backend` · `ops` · `toolbox` · module mới); phần .NET/Jarvis xuống ví dụ trong `reference/anatomy.md`. Tách: `SKILL.md` (mục lục) · `workflows/new-skill.md` · `workflows/extend-skill.md` · `templates/*.tpl` ×5 · `reference/anatomy.md` |
| **QĐ-3** | `toolbox/PACK.md` khai **đủ trường** schema như mọi module; trường không áp dụng để rỗng **kèm chú thích** | Một schema, một test (`pack-manifest.test.js`), không ngoại lệ ngầm. Kéo theo: thêm giá trị `minipower` vào enum `repo:` của [contracts/pack-manifest.md](../contracts/pack-manifest.md) — `any` sẽ là lời nói dối (toolbox không tác động repo product) |
| **QĐ-4** | `toolbox/` **không publish** sang repo product | Chỉ symlink trong workspace repo minipower. `rsync` publish của [ADR-024](ADR-024-2026-08-25-backend-hub-publish-nguon-minipower.md) chỉ đụng `backend/skills/` — không mở rộng |
| **QĐ-5** | **Phép thử chống-sọt-rác**, viết ngay vào `toolbox/README.md` | *"Skill này có được cài vào workspace dự án khách hàng không? Có → không thuộc `toolbox`."* Tên `toolbox` không tự nêu ranh giới (nhược điểm O4) nên ranh giới phải viết ra và nằm ở chỗ người đọc gặp đầu tiên |
| **QĐ-6** | Templates trong skill đặt đuôi **`.tpl`**, không `.md` | `link:check` quét mọi `.md` trong repo; template chứa link placeholder (`providers/<name>/SKILL.md`) sẽ báo gãy. Đây là lý do kỹ thuật, ghi lại để lần sau không ai "sửa lại cho đúng chuẩn" |

## §6. Confirm

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…6? | **Duyệt cả 6 — chủ repo chốt 2026-08-28.** Kèm ba làm rõ: (a) QĐ-1 — người dùng module này là **người phát triển minipower**; (b) QĐ-2 — **SSOT duy nhất là skill**; các file còn lại trong `fundamentals/` là *nội dung cũ viết tạm*, sẽ chuẩn hoá dần thành skill (định hướng, không thuộc phạm vi ADR này — xem **Ngoài phạm vi**); (c) QĐ-5 — `toolbox` **không** cài vào workspace khách, chỉ dùng để phát triển minipower |
| Q2 | Tên `toolbox` là danh từ chứa đồ, không nêu ranh giới — chấp nhận rủi ro sọt rác, đổi lấy dễ hiểu? | **Có** — chủ repo chọn 2026-08-28 sau khi cân với `meta` / `forge` / `authoring`; giảm thiểu bằng QĐ-5 |
| Q3 | Phạm vi skill: tổng quát cho mọi lá-rời hay giữ .NET/Jarvis? | **Tổng quát** — chủ repo chọn 2026-08-28 |

## §7. Việc triển khai

| Bước | Việc | Done khi | Phụ thuộc |
|---|---|---|---|
| 1 | `toolbox/PACK.md` + `toolbox/README.md` | Đủ trường schema; hub có bảng skill + ranh giới QĐ-5 | Q2 |
| 2 | `toolbox/skills/minipower-toolbox-skill-author/` — SKILL.md · README.md · 2 workflow · 5 template · reference | `name` ≡ thư mục, có `description` | Q3 |
| 3 | `sdlc/hooks/test/toolbox-pack.test.js` (khuôn `ops-pack.test.js`) + `toolbox` vào `MODULES` của `pack-manifest.test.js` | Test đỏ khi cố tình phá invariant | 2 |
| 4 | Xoá `fundamentals/template-skill.md`; sửa **href** trong ADR-021 (×4) + ADR-022 (×1) | `link:check` 0 gãy mới | 2 |
| 5 | `README.md` root: bảng module (2→4 module), cây thư mục, nguyên tắc tổ chức, bỏ "template viết skill" khỏi dòng `fundamentals/` | Đọc lại nhất quán | 1 |
| 6 | `AGENTS.md`: §0 nhiệm vụ · §SKILL.md-cho-agent (thêm `toolbox-pack.test.js` + link skill) · §Quy ước đặt tên | Đọc lại nhất quán | 1 |
| 7 | `contracts/pack-manifest.md` §1 — thêm `minipower` vào enum `repo:` | Schema mô tả đúng thực tế | 1 |
| 8 | Cập nhật `link-check.baseline.txt` (6 nợ của file đã xoá) sau khi soát diff | `link:check` không còn nhắc "nợ đã lành" | 4 |

## §8. Xác minh (định nghĩa xong)

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | Mô tả việc *"tạo skill mới cho …"* trong workspace repo minipower | `minipower-toolbox-skill-author` được chọn qua `description` | 🔴 chủ repo tự chạy (interactive) |
| T2 | Mới | `toolbox-pack.test.js` — `name` ≡ thư mục · kebab ≤64 tiền tố `minipower-toolbox-` · có `description` · bảng hub khớp · `PACK.md` tồn tại | 5 test xanh | 🟢 |
| T3 | Mới | `pack-manifest.test.js` phủ thêm `ops` + `toolbox` | 4 test xanh | 🟢 |
| T4 | Regression | `npm test` + `npm run gen:check` | 441/441 xanh; gen không lệch | 🟢 |
| T5 | Regression | `npm run link:check` | **0 gãy MỚI** | 🟢 |
| T6 | Regression | `grep -r "](../fundamentals/template-skill.md)" .` — không còn **link** nào trỏ file đã xoá | 0 match | 🟢 |
| T7 | Regression | `grep -rc "fundamentals/template-skill" ADRs/` — **chữ** trong ADR-021/022 giữ nguyên (QĐ-11 ADR-022: chỉ sửa href) | còn nguyên, không sửa | 🟢 |

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| Tốt | Khuôn viết skill **tự kích hoạt** đúng lúc đang viết skill, thay vì nằm chờ được nhớ tới · phần kiểm được (name · description tồn tại · bảng hub · link) đã có test canh cho **cả bốn** module · có chỗ đứng hợp lệ cho `toolbox-adr` / `toolbox-module` sau này · `pack-manifest.test.js` phủ 4/4 module thay vì 2/4 |
| Xấu / chi phí | Thêm một module = thêm một hub, một `PACK.md`, một test phải bảo trì · tên `toolbox` không tự nêu ranh giới, phải gác bằng chữ (QĐ-5) và bằng review · enum `repo:` có thêm một giá trị chỉ dùng bởi đúng một module |
| Trung lập | `fundamentals/` co lại còn kiến thức nền thuần đọc-để-hiểu — đúng vai tầng nền · ADR-021/022 giữ nguyên chữ, chỉ đổi href (QĐ-11 ADR-022) |
