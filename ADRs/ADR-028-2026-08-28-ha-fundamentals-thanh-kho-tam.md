# Hạ `fundamentals/` thành **kho tạm** và đổi tên `staging/` — chỉ rút, không nạp

| | |
|---|---|
| **Ngày** | 2026-08-28 |
| **Trạng thái** | chốt 2026-08-28 (Q1–Q4 §6 duyệt hết; QĐ-2 lật ngược đề xuất ban đầu — không đặt cổng cứng); thi hành trong ngày |
| **Phạm vi** | Định vị `fundamentals/` trong bản đồ repo · **đổi tên thư mục → `staging/`** · luật "chỉ rút, không nạp" và **quyết định không cưỡng chế nó bằng máy** · bảng đích cho từng file trong kho |
| **Ngoài phạm vi** | Thực thi việc chuyển từng file (mỗi file một đợt Full riêng — QĐ-4) · mở module `autotest/` / `frontend/` / skill proposal (ADR riêng — ADR-022 QĐ-7 luật 2) · nội dung chuyên môn bên trong từng tài liệu |
| **Nối tiếp** | [ADR-027](ADR-027-2026-08-28-module-toolbox-cong-cu-lam-ra-minipower.md) §6 Q1 (nơi chủ repo xác nhận định hướng này) · [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) — **ADR này điều chỉnh QĐ-8** (giữ tên `fundamentals/`) và **QĐ-6** (`frontend/` chờ mở → không còn là điều kiện của `tabler-uikit-skill.md`) · [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-7 + §4 (đích `autotest/`) · [ADR-008](ADR-008-2026-07-25-minipower-proposal-suite.md) (đích của UCP · ULNL · GPKT) · [ADR-024](ADR-024-2026-08-25-backend-hub-publish-nguon-minipower.md) (`.opencode/` thôi làm nguồn — lý do 44 link chết) |
| **Mục đích** | Ghi lại vì sao một thư mục đổi hẳn vai — từ "tầng nền ngang `contracts/`" thành "kho tạm đang rút dần" — và vì sao luật giữ nó **cố ý không có cổng máy** (QĐ-2), để người sau không đi tìm cái test không tồn tại |
| **Ảnh hưởng** | Thư mục `fundamentals/` → `staging/` · [README.md](../README.md) (bảng §Minipower có gì · cây thư mục · §Liên kết nhanh) · [AGENTS.md](../AGENTS.md) (§0 · §Quy ước đặt tên & thư mục — cụm "Tầng nền") · [toolbox/README.md](../toolbox/README.md) + [toolbox skill README](../toolbox/skills/minipower-toolbox-skill-author/README.md) (2 chỗ trỏ `fundamentals/`) · [backend/skills/minipower-backend-convention-dotnet/README.md](../backend/skills/minipower-backend-convention-dotnet/README.md) (dòng *"Không dùng cho"*) · `sdlc/hooks/link-check.baseline.txt` (5 path còn lại) · [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) (thêm mục *Điều chỉnh 2026-08-28*) · ADR cũ (**chỉ href** — ADR-022 QĐ-11) |

---

## §1. Bối cảnh

### §1a. Hiện trạng khi mở ADR

`fundamentals/` có **15 file `.md` ở gốc = 5.518 dòng**, cộng bộ `interview/` **35 file**. README.md và AGENTS.md xếp nó là **"tầng nền"** — ngang hàng `contracts/`.

Số liệu đọc 2026-08-28:

| Quan sát | Số |
|---|---|
| Nợ link gãy toàn repo (`link-check.baseline.txt`) | 67 mục |
| Trong đó thuộc `fundamentals/` | **50 (75%)** |
| Trong đó thuộc riêng `tutorial-index.md` | **44** — tất cả trỏ `.opencode/…` |
| File tự xưng *"Skill …"* ngay ở tiêu đề | 3 (`dotnet-clean-architecture` · `dotnet-ddd` · `dotnet-structure`) |
| File đã có sẵn frontmatter `name:` + `description:` | 1 (`tabler-uikit-skill.md`) |
| Cặp trùng vai với thứ đang sống trong pipeline | 2 (xem P5) |

### §1b. Ba dữ kiện quyết định

1. **Cửa vào của "tầng nền" tự khai đã chết.** [README.md](../README.md) trỏ `fundamentals/tutorial-index.md` làm ô *"Bắt đầu"* và lặp lại ở §Liên kết nhanh. Nhưng dòng 3 của chính file đó viết *"Đã chuyển… giữ làm tham chiếu lịch sử"*, và 44 link trong nó trỏ `.opencode/` — path đã thôi làm nguồn từ [ADR-024](ADR-024-2026-08-25-backend-hub-publish-nguon-minipower.md). Người mới đọc theo README vào đúng chỗ chết đầu tiên.
2. **Ba file .NET trỏ `skills/architechture-dotnet.md`** — path không tồn tại (sai chính tả sẵn trong nguồn). Chúng được viết như skill, chưa bao giờ thành skill.
3. **Kho đã tự rút.** Cùng ngày, hai file rời `fundamentals/` thành skill: `dotnet-coding-convention.md` → [`minipower-backend-convention-dotnet`](../backend/skills/minipower-backend-convention-dotnet/README.md) · `template-skill.md` → [`minipower-toolbox-skill-author`](../toolbox/skills/minipower-toolbox-skill-author/SKILL.md). Chủ repo xác nhận tại [ADR-027 §6 Q1](ADR-027-2026-08-28-module-toolbox-cong-cu-lam-ra-minipower.md): *"các file trong fundamentals chỉ là nội dung cũ ngày trước viết tạm, bây giờ cần chuẩn hoá thành skill"*.

Cái đang thiếu không phải ý định — mà là **định vị đúng trong bản đồ**: một cái tên nói đúng vai, và một dòng luật cho biết kho này đi về đâu.

### §1c. Đã thi hành trước (2026-08-28, theo chỉ thị trực tiếp của chủ repo)

| Việc | Kết quả |
|---|---|
| Xoá `tutorial-index.md` (466 dòng) | Gỡ 44 nợ link |
| Xoá `tabler-uikit-skill.md` (170 dòng) | Gỡ 1 nợ link; **không** chờ module `frontend/` nữa (QĐ-7) |
| Sửa 2 chỗ README trỏ `tutorial-index.md`; gỡ href chết trong ADR-021 (chữ giữ, bỏ link) | `link:check` 0 gãy mới |
| Cập nhật `link-check.baseline.txt` | Nợ toàn repo **67 → 22** · riêng `fundamentals/` **50 → 5** |

Còn **13 file `.md` ở gốc** + `interview/`. Việc này làm **trước** phần còn lại có tác dụng phụ quan trọng: chi phí đổi tên thư mục (O3) rơi từ *50 link phải soát* xuống *5* — xem §4.

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Một chữ "tầng nền" gọi hai loại vật khác hẳn: `contracts/` là hợp đồng **load-bearing, có test canh**; `fundamentals/` là tài liệu rời **không ai kiểm** | Agent và người đọc bản đồ tưởng hai thứ cùng độ tin cậy; trích `fundamentals/` như trích `contracts/` |
| P2 | Tên **`fundamentals`** (nền tảng) nói **ngược hẳn** vai thật (nội dung cũ viết tạm) | Tên là thứ đọc trước nội dung; tên sai thì mọi chú thích phía sau phải đi sửa chữa nhận thức |
| P3 | 75% nợ link gãy của repo nằm ở đây, và **không có cơ chế nào làm nó giảm** | `link:check` chỉ chặn gãy **mới**; nợ cũ nằm yên vĩnh viễn |
| P4 | Không luật nào cấm nạp thêm file — mà chữ "tầng nền" nghe **hợp lệ** để đặt tài liệu mới | Kho phình; mỗi file mới là một nguồn cạnh tranh với skill |
| P5 | Trùng vai đã xảy ra: `incident-template.md` (446 dòng) ↔ [`sdlc/templates/TPL-incident-report.md`](../sdlc/templates/TPL-incident-report.md) (34 dòng, đang trong pipeline) · `code_review.md` (110 dòng) ↔ [`minipower-backend-review-dotnet`](../backend/skills/minipower-backend-review-dotnet/README.md) | Hai nguồn cho một việc — thứ mà `contracts/` và `rules.json` tồn tại để tránh |
| P6 | Ba file .NET viết như skill nhưng không là skill | Nội dung sẵn sàng, chỉ thiếu chỗ đứng — nằm đó thì không bao giờ được agent gọi |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-7 luật 2 — chưa có skill thật thì chưa tạo thư mục module ⇒ **không** mở `autotest/`, `frontend/`, `qa/` trong ADR này |
| C2 | Không xoá tài liệu chỉ vì chưa có đích. UCP · ULNL · GPKT là **đầu vào của [ADR-008](ADR-008-2026-07-25-minipower-proposal-suite.md)** đang ⚪ Todo |
| C3 | "Cứng bằng máy, mềm bằng lời" — luật nào **không** có cổng máy phía sau thì **không được viết là "bắt buộc"**. Viết là *quy ước*, nêu lý do, người giữ (AGENTS.md §phép thử) |
| C4 | Không kéo repo về phía tự động hoá: rút file là việc **người quyết từng đợt**, không có agent tự dọn kho |
| C5 | Đổi tên thư mục phải **kiểm được**: `link:check` 0 gãy mới + `grep "fundamentals/"` = 0 ngoài chữ trong ADR cũ (khuôn verify [ADR-021 §6](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md)) |

> **Ràng buộc đã gỡ:** [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) **QĐ-8** chốt *"`fundamentals/` giữ tên"*. Chủ repo quyết đổi tên 2026-08-28 ⇒ ADR này **điều chỉnh QĐ-8**; ADR-021 nhận mục *Điều chỉnh 2026-08-28* trỏ về đây (cơ chế của [TEMPLATE.md](TEMPLATE.md): ADR đã chốt không rewrite, đổi hướng thì ghi mục Điều chỉnh). Tương tự **QĐ-6** ADR-021 (`frontend/` chưa tạo) thôi là điều kiện của `tabler-uikit-skill.md` — file đã xoá (QĐ-7).

## §4. Phương án

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | Giữ "tầng nền", chỉ đi sửa link chết | Rẻ, không đụng bản đồ | Không giải P1/P2/P4/P5 — sửa xong vẫn là kho không có luật, và 44 link kia sửa để trỏ vào đâu? | ❌ |
| O2 | Xoá sạch, đưa hết vào skill ngay một đợt | Dứt điểm | Vi phạm C1 (phải mở 3 module chưa đủ điều kiện) và C2; 5.518 dòng không có đích thật ⇒ mất nội dung | ❌ |
| O3 | **Đổi tên `staging/` · hạ vai · bảng đích từng file** | Tên tự nói vai — không cần chú thích chống lại chính cái tên (giải P2 tận gốc) | Đụng ref liên-file; **nhưng** sau §1c chi phí thật chỉ còn **5 link nội bộ + 6 ref ngoài + baseline path**, không phải 50 | ✅ chọn |
| O4 | Giữ tên `fundamentals/`, chỉ hạ vai bằng chữ | Không đụng ref nào | Tên vẫn nói "nền tảng"; mọi tài liệu phải mang theo một câu đính chính. Chi phí tránh được (O3) đã không còn lớn | ❌ |

**Vì sao O3 thắng bây giờ mà không thắng lúc [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md):** lúc đó đổi tên kéo theo 50 link gãy phải soát để đổi lấy đúng một chữ — không đáng. Sau khi xoá `tutorial-index.md` (§1c), 44 trong số đó biến mất. Cùng một quyết định, chi phí khác hẳn.

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **`fundamentals/` thôi là "tầng nền" và đổi tên thành `staging/`.** Vai mới: **kho tạm — chỉ rút, không nạp** | Nội dung cũ viết tạm, chờ chuẩn hoá thành skill/template. `contracts/` và `ADRs/` **vẫn là** tầng nền thật. Ghi chú: *"staging"* trong ngành thường hiểu là **môi trường triển khai** — repo này không có môi trường nào tên vậy nên không đụng nhau, nhưng README phải nói rõ một câu để không ai hiểu nhầm |
| **QĐ-2** | **KHÔNG đặt cổng cứng cho luật "chỉ rút, không nạp".** Nó là **quy ước mềm — người giữ**, không phải điều kiện máy kiểm | Chủ repo chốt 2026-08-28. Phương án đã cân nhắc và **bỏ**: một *ratchet test* đếm số file `.md` ở gốc so với hằng số trong test, vượt trần thì `npm test` đỏ. Lý do bỏ: người duy nhất nạp vào kho là chính chủ repo, và cái giá phải trả là một hằng số phải nhớ hạ **mỗi lần rút file** — chi phí bảo trì lớn hơn rủi ro thật. Hệ quả theo C3: mọi chỗ mô tả luật này (README · AGENTS · ADR) viết là **quy ước / khuyến nghị**, **không** được viết "bắt buộc" — chữ bắt buộc không có cổng phía sau làm mòn mọi chữ bắt buộc khác trong repo. Dấu hiệu mở lại: kho **tăng** file trong vài tháng tới |
| **QĐ-3** | **Mỗi file có đúng một đích**, khai ở bảng §5a; bốn loại kết cục: → **skill** (module nào) · → **template** trong `sdlc/` · → **giữ** (đúng là tài liệu đọc-để-hiểu, đã có chủ) · → **xoá** (trùng vai, đã có nguồn sống khác) | Cấm ô *"chưa biết"*: file không có đích tên tuổi thì không ai rút, và kho không bao giờ cạn. Bảng không phải việc phải làm ngay — nó là **cam kết ghi sẵn** để mỗi đợt sau biết phải làm gì mà không họp lại. Chủ repo duyệt 2026-08-28: **giữ bảng, thi hành sau** |
| **QĐ-4** | **Rút từng file, không mở đợt lớn.** Mỗi file = một thay đổi **Full** độc lập: dựng đích → xoá bản cũ → sửa href → hạ hằng số ratchet → `npm test` + `link:check` | Bài học [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) QĐ-5: thay đổi phải kiểm được. Gom 13 file một commit thì không ai soát nổi diff |
| **QĐ-5** | **`tutorial-index.md` xoá, KHÔNG thay thế** bằng README nào | Chủ repo chốt 2026-08-28. Vai kho tạm do **tên thư mục** (`staging/`) + [README.md](../README.md) gốc nói, không cần thêm một hub nữa — thêm hub là tái lập đúng thứ vừa xoá |
| **QĐ-6** | **Không mở module mới trong ADR này.** File có đích là module chưa tồn tại **ở lại kho** cho tới khi module đó được mở bằng ADR riêng | Giữ C1. Trong bảng §5a chúng ghi *"chờ ADR mở `{module}`"* — **kế hoạch**, không phải nợ vô chủ |
| **QĐ-7** | **`tabler-uikit-skill.md` xoá, không chờ `frontend/`** | Chủ repo chốt 2026-08-28. Nội dung là skill Tabler cho repo app, không phải tri thức minipower; giữ lại chỉ để chờ một module chưa có kế hoạch mở là giữ nợ. Cần thì lấy lại từ lịch sử Git |

### §5a. Bảng đích — 13 file ở gốc + `interview/`

| # | File | Dòng | Kết cục | Đích | Chờ gì |
|---|---|---|---|---|---|
| 1 | `code_review.md` | 110 | **Xoá** | [`minipower-backend-review-dotnet`](../backend/skills/minipower-backend-review-dotnet/README.md) đã phủ | — (soát ý còn thiếu, bơm vào skill trước khi xoá) |
| 2 | `incident-template.md` | 446 | **Gộp** | [`sdlc/templates/TPL-incident-report.md`](../sdlc/templates/TPL-incident-report.md) (bản lõi 34 dòng) | — (chọn phần thật sự dùng, không bê nguyên 446 dòng) |
| 3 | `dotnet-clean-architecture.md` | 54 | **→ skill** | `backend/` — skill kiến trúc layer (mới) | — (module có sẵn) |
| 4 | `dotnet-ddd.md` | 121 | **→ skill** | cùng #3, hoặc `reference/` của nó | — |
| 5 | `dotnet-structure.md` | 295 | **→ skill** | gộp vào [`minipower-backend-scaffold-dotnet`](../backend/skills/minipower-backend-scaffold-dotnet/README.md) | — (kiểm trùng với scaffold hiện có trước) |
| 6 | `cursorignore.md` | 227 | **→ template** | `sdlc/project-skeleton/` — nội dung là file config `.cursorignore`, không phải tài liệu đọc | — |
| 7 | `testing-overview.md` | 773 | **→ skill** | module `autotest/` | **Chờ ADR mở `autotest/`** ([ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) §4) |
| 8 | `testing-types.md` | 260 | **→ skill** | cùng #7 | chờ `autotest/` |
| 9 | `automation-test-api-insomnia.md` | 866 | **→ skill** | cùng #7 | chờ `autotest/` |
| 10 | `UCP.md` | 397 | **→ skill** | proposal suite | **Chờ [ADR-008](ADR-008-2026-07-25-minipower-proposal-suite.md)** (R2 catalog + `quotation-calc.js`) |
| 11 | `ULNL.md` | 364 | **→ skill** | cùng #10 | chờ ADR-008 |
| 12 | `GiaiPhapKyThuat-KHUNG.md` | 662 | **→ template/skill** | TPL trong `sdlc/templates/` hoặc `proposal-technical` | chờ ADR-008 (R5 TPL GPKT) |
| 13 | `FundamentalClaudeCode.md` | 307 | **Giữ** | tài liệu cá nhân, ở lại `staging/` — không lên bản đồ repo | — (Q3 chốt 2026-08-28) |
| 14 | `interview/` | 35 file | **Giữ tạm — có chủ** | ứng viên module riêng (người dùng khác hẳn: người tuyển dụng — ADR-022 QĐ-7 câu 2) | chờ có skill thật, không chỉ tài liệu |
| ~~—~~ | ~~`tutorial-index.md`~~ | ~~466~~ | **Đã xoá** 2026-08-28 | — | — (QĐ-5) |
| ~~—~~ | ~~`tabler-uikit-skill.md`~~ | ~~170~~ | **Đã xoá** 2026-08-28 | — | — (QĐ-7) |

Đọc theo cột *Chờ gì*: **6 file rút được ngay** (#1–#6) · **6 file chờ ADR khác** (#7–#12) · **2 mục ở lại** (#13, #14).

## §6. Confirm

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…7? | **Duyệt cả 7 — chủ repo chốt 2026-08-28.** QĐ-1 kèm **đổi tên `staging/`** · QĐ-2 **lật ngược đề xuất ban đầu**: không đặt cổng cứng, quy ước mềm người giữ · QĐ-3 giữ bảng đích làm cam kết, **thi hành sau** · QĐ-7 mới (bỏ luôn `tabler-uikit-skill.md`) |
| Q2 | Ratchet đếm số file hay số dòng? | **Không áp dụng** — chủ repo bỏ cổng cứng (QĐ-2), không có test nào để cấu hình |
| Q3 | `FundamentalClaudeCode.md` (307 dòng, ghi chú Claude Code v2.1.x) — xoá hẳn, hay giữ như tài liệu cá nhân? | **Giữ như tài liệu cá nhân, nằm lại trong kho** — chủ repo 2026-08-28 |
| Q4 | Thứ tự sau `tutorial-index.md`: dọn trùng vai trước hay dựng skill .NET trước? | **Bỏ luôn `tutorial-index.md`** — chủ repo 2026-08-28 (đã thi hành, §1c). Thứ tự các file còn lại chưa chốt |

Chốt xong QĐ-2 · QĐ-3 · Q2: ghi ngày vào **Trạng thái** + cập nhật ghi chú [index](README.md).

## §7. Việc triển khai

**Đã xong** (§1c): xoá `tutorial-index.md` + `tabler-uikit-skill.md` · sửa 2 ref README · gỡ href chết ADR-021 · baseline 67 → 22.

**Đợt 0 — đổi tên + hạ vai · 🟢 xong 2026-08-28:**

| Bước | Việc | Done khi | Trạng thái |
|---|---|---|---|
| 1 🟢 | Đổi tên `fundamentals/` → `staging/`; sửa mọi ref: README ×3 · AGENTS ×1 · `toolbox/README.md` ×1 · toolbox skill README ×1 · `convention-dotnet/README.md` ×1 · 5 path trong `link-check.baseline.txt` · href ADR cũ (chữ giữ — ADR-022 QĐ-11) | `link:check` 0 gãy mới · `grep "fundamentals/"` = 0 ngoài chữ trong ADR (C5) | 🟢 |
| 2 🟢 | README + AGENTS: `staging/` khai là **Kho tạm (đang rút)**, không phải "Tầng nền"; `contracts/` + `ADRs/` giữ vai tầng nền; thêm một câu tránh nhầm với môi trường staging | Đọc lại nhất quán | 🟢 |
| 3 🟢 | [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md): thêm mục *Điều chỉnh 2026-08-28* — QĐ-8 (giữ tên) và QĐ-6 (`frontend/` gác `tabler`) bị ADR-028 điều chỉnh | ADR-021 tự khai, không sửa chữ cũ | 🟢 |

**Đợt 1..n** — mỗi file một thay đổi Full riêng (QĐ-4), thứ tự chưa chốt (Q4 mới trả lời phần `tutorial-index`).

**Không thuộc đợt nào ở đây:** #7–#12 nằm chờ ADR mở `autotest/` · thi hành ADR-008. Hai ADR đó mở khi có việc thật, không phải để dọn kho.

## §8. Xác minh (định nghĩa xong)

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | Sau bước 1: `staging/` tồn tại · `fundamentals/` không còn · [README.md](../README.md) trỏ kho tạm đi được | Vào được, không 404 | 🟢 |
| T2 | Regression | `npm test` + `npm run gen:check` | Xanh, không hồi quy | 🟢 441/441 · gen đồng bộ |
| T3 | Regression | `npm run link:check` | 0 gãy MỚI; nợ baseline **67 → 22** | 🟢 |
| T4 | Regression | `grep -rn "fundamentals" . --include="*.md"` | 0 match là **path đang sống**; còn lại chỉ là **chữ** trong ADR cũ (ADR-022 QĐ-11) + 3 ghi chú lịch sử *"trước 2026-08-28 nằm ở…"* trong README skill | 🟢 |
| T5 | Regression | `grep -n "Tầng nền" README.md AGENTS.md` | Chỉ còn `contracts/` và `ADRs/`; `staging/` khai là **Kho tạm** | 🟢 |

**Không có test canh luật "chỉ rút, không nạp"** — đó là hệ quả có chủ ý của QĐ-2, không phải thiếu sót.

Icon: 🟢 xong · 🟡 có sẵn, cần giữ xanh · 🔴 chưa có. **Không 🟢 Done khi còn T đỏ.**

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| Tốt | Tên thư mục tự nói vai — không còn tài liệu nào phải mang câu đính chính chống lại chính cái tên · bản đồ repo thôi gọi hai loại vật bằng một chữ (`contracts/` load-bearing tách khỏi kho tạm) · nợ link toàn repo đã giảm **67 → 22** ngay tại §1c · 6 file có đích rõ ràng, thi hành được ngay không cần ADR nào khác · không thêm test nào phải bảo trì (QĐ-2) |
| Xấu / chi phí | Đổi tên đụng ref liên-file + baseline + href ADR (dù nay rẻ hơn 10 lần so với lúc ADR-021) · kho vẫn tồn tại dài — 6/14 mục chờ ADR khác, có mục chờ ADR-008 ⚪ Todo từ 2026-07-25 · **luật "chỉ rút, không nạp" không có gì cưỡng chế** (QĐ-2): kho phình lại được, và chỉ phát hiện khi có người để ý — rủi ro chấp nhận có chủ ý, dấu hiệu mở lại là số file **tăng** · `tabler-uikit-skill.md` mất khỏi cây làm việc, muốn lấy lại phải lục lịch sử Git |
| Trung lập | `interview/` sống bình thường cho tới khi có skill thật · `FundamentalClaudeCode.md` ở lại vĩnh viễn ⇒ **kho không có mục tiêu về 0** · nội dung chuyên môn không bị đánh giá lại trong ADR này — chỉ đổi chỗ đứng |
