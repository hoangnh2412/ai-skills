# Gộp `foundation-dotnet` + `application-dotnet` thành một skill kiến trúc DDD cho module `backend`

| | |
|---|---|
| **Ngày** | 2026-08-28 |
| **Trạng thái** | đề xuất, chờ Confirm §6 |
| **Phạm vi** | `backend/skills/` — xoá 2 skill lá, mở 1 skill lá mới `minipower-backend-architecture-dotnet`; thêm template architecture test vào `minipower-backend-scaffold-dotnet` |
| **Ngoài phạm vi** | Không đụng `sdlc/` · không đụng `rules.json` (skill lá-rời không qua router — [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-5) · không mở module mới · không đổi 12 skill lá còn lại |
| **Nối tiếp** | [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) (đặt tên 15 lá) · [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-4/QĐ-5/QĐ-7 (hệ tên, lá-rời, quy tắc 3 câu hỏi) · [ADR-020](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) QĐ-3 ("cứng bằng máy, mềm bằng lời") |
| **Mục đích** | Ghi lại vì sao hai skill lá bị xoá và vì sao thứ thay thế chúng là *một* skill kiến trúc có cổng cứng, không phải hai skill wiring |
| **Ảnh hưởng** | `backend/skills/minipower-backend-foundation-dotnet/` (xoá) · `backend/skills/minipower-backend-application-dotnet/` (xoá) · `backend/skills/minipower-backend-architecture-dotnet/` (mới) · `backend/skills/minipower-backend-scaffold-dotnet/{SKILL.md,README.md,workflows/add.md,templates/SKILLS.md,templates/docs-Architecture.md,templates/layers/appsettings.json,templates/tests/}` · `backend/skills/minipower-backend-review-dotnet/SKILL.md` · `backend/README.md` · `backend/PACK.md` · `ADRs/ADR-021…md` (gỡ href, giữ chữ) |

---

## §1. Bối cảnh

Module `backend` hiện có **15 skill lá** ([ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md)). Ba trong số đó chồng lấn nhau ở vùng "dựng bộ khung": `scaffold` (cấp solution), `foundation` (cấp Host), `application` (cấp Application layer).

Đối chiếu file thật ngày **2026-08-28**:

| Tài sản của `foundation-dotnet` | Đối chiếu |
|---|---|
| `workflows/init.md` — `AddCoreJson → AddCoreCors → AddCoreDomain → AddCoreWebApi`, pipeline `UseCoreCors → UseCoreMiddleware<ApiResponseWrapperMiddleware> → MapControllers` | Trùng nguyên văn `scaffold/templates/layers/HostLayerExtension.cs` |
| `templates/appsettings-foundation.json` | **Tập con** của `scaffold/templates/layers/appsettings.json` — `Json` và `Middlewares` giống hệt, chỉ thiếu `"Cors": {}` ở bản scaffold |
| `templates/program-setup.cs` | **Tập con** của `scaffold/templates/program-setup.cs` — `diff` chỉ có dòng thêm, không có dòng sửa |
| Ca brownfield "solution có sẵn" | `scaffold/workflows/init.md` đã lo: *"Nếu chưa có `HostLayerExtension`, copy từ `templates/layers/HostLayerExtension.cs`"* |
| `workflows/add.md` — đổi CORS / `Includes` / `IgnoreNull` | Thực chất là sửa 3 dòng `appsettings` |

| Tài sản của `application-dotnet` | Đối chiếu |
|---|---|
| `workflows/init.md` | Trùng `scaffold/templates/layers/ApplicationLayerExtension.cs` — nội dung thật là 3 dòng (`AddCoreApplication()`) |
| `workflows/add.md` + `templates/command-handler.cs` | **Không trùng ở đâu.** Đây là thứ duy nhất còn sống — và là bề mặt kích hoạt **tần suất cao nhất** của cả module: mỗi tính năng mới đều thêm command/query |

Cùng lúc, README framework Jarvis (`hoangnh2412/jarvis`, đọc 2026-08-28) khai kiến trúc là **hai trục bổ sung** — Clean Architecture theo chiều dọc (5 layer, *"phụ thuộc một chiều"*) và Atomic Module theo chiều ngang (`Jarvis.Caching`, `Jarvis.BlobStoring`, … đăng ký bằng extension). Repo `minipower` hiện chỉ có skill cho **trục ngang** (12 lá module) — trục dọc, tức *code mới đặt ở layer nào và được phép nhìn thấy layer nào*, **không có skill nào giữ**.

Đó là lỗ hổng đúng chỗ agent hay sai nhất khi viết tính năng mới ("vibe code"): handler viết thẳng vào `Host`, `DbContext` inject vào controller, entity kéo theo `Microsoft.EntityFrameworkCore` vào `Domain`.

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | `foundation-dotnet` trùng ~90% với template scaffold; sau khi scaffold chạy, tần suất kích hoạt thật ≈ 0 | Ba nguồn cho cùng một đoạn wiring Host — sửa một chỗ, hai chỗ kia lệch âm thầm; đã lệch sẵn (`"Cors": {}` có ở foundation, thiếu ở scaffold) |
| P2 | `application-dotnet` mang tên và `description` của việc *khởi tạo* (`"Thiết lập Jarvis.DDD.Application"`), trong khi giá trị thật nằm ở việc *thêm handler* | Lá-rời sống nhờ `description` ([ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-5b). `description` mô tả việc chỉ chạy một lần ⇒ skill không được gọi vào đúng lúc cần nhất |
| P3 | Không skill nào giữ **trục dọc**: quy tắc phụ thuộc giữa 5 layer, chỗ đặt Entity/Repository/Handler/Adapter | Agent vibe code tính năng mới không có nguồn tra; sai kiến trúc chỉ lộ ra ở review PR — muộn và đắt |
| P4 | Nhu cầu *"agent phải LUÔN tuân thủ kiến trúc"* không có cơ chế thi hành | Viết chữ "bắt buộc" vào markdown không FAIL được bằng máy ⇒ vi phạm chính phép thử của [ADR-020](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) QĐ-3 |
| P5 | `foundation` giữ 2 anti-pattern có giá trị thật (`UseCoreMiddleware` đặt sau `MapControllers`; bỏ `AddCoreDomain` khi app dùng `IWorkContext`) + note `Jarvis.Mvc` kéo transitive `Common`/`Domain.Shared`/`OpenTelemetry` | Xoá thẳng là mất tri thức |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | Hệ tên giữ nguyên: `minipower-backend-{capability}[-{stack}]`, kebab, ≤64, `name` ≡ tên thư mục ([ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-4; có `backend-pack.test.js` canh) |
| C2 | Skill lá-rời **không** đăng ký vào `rules.json` / router — sống nhờ `description` ([ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-5) |
| C3 | "Cứng bằng máy, mềm bằng lời" ([ADR-020](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) QĐ-3): chỉ viết "bắt buộc" cho thứ FAIL được bằng máy. Không mở lại trong ADR này |
| C4 | Không mở module mới ([ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-7 luật 2); skill mới nằm trong `backend/` |
| C5 | "Co lại trước khi mở rộng" ([AGENTS.md](../AGENTS.md)): tổng số lá **không được tăng** sau đợt này |
| C6 | Framework Jarvis là repo ngoài — ADR này **không** đề xuất sửa gì trong `hoangnh2412/jarvis`, chỉ mô tả lại kiến trúc của nó |

## §4. Phương án

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | Giữ nguyên 3 skill | Không phải sửa gì | P1–P5 còn nguyên; 3 nguồn cho một đoạn wiring | ❌ |
| O2 | Xoá `foundation`, giữ `application` thu hẹp về "thêm handler" | Rẻ nhất; đúng tần suất kích hoạt | P3/P4 chưa giải: vẫn không ai giữ trục dọc; skill "thêm handler" chỉ phủ 1 trong 5 layer, mà một tính năng thật chạm cả 5 | ❌ |
| O3 | Xoá cả hai; mở `minipower-backend-architecture-dotnet` — kiến trúc DDD 5 layer + **lát cắt dọc** thêm tính năng, kèm architecture test làm cổng cứng | Giải P1–P5; số lá 15 → **14** (giảm, đúng C5); khớp đúng khuôn `convention-dotnet` (hai tầng cứng/mềm) đã chứng minh hoạt động | Phải viết mới template architecture test + chọn thư viện; đụng 9 file có ref | ✅ chọn |
| O4 | Như O3 nhưng skill kiến trúc chỉ là văn bản, không có architecture test | Rẻ hơn O3 | Rơi thẳng vào P4 — "luôn tuân thủ" viết bằng lời thì không phải cổng, chỉ là advisory dài hơn | ❌ |

**Vì sao O3 chứ không O2 — chỗ này là lõi của quyết định.** Một tính năng backend thật không phải "một handler": nó là **lát cắt dọc** xuyên 5 layer — Entity/Repository interface ở `Domain`, Command + Handler + DTO ở `Application`, implement repository ở `Infrastructure`, Controller ở `Host`. Skill chỉ dạy tầng Application thì đúng 1/5 việc, và **không** trả lời được câu agent hay hỏi sai nhất: *"đặt cái này ở đâu, được reference cái gì"*. Trục dọc mới là đơn vị công việc, không phải một layer.

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **Xoá `minipower-backend-foundation-dotnet`** | Trùng lặp (P1). Không deprecate, không alias — xoá thư mục |
| **QĐ-2** | **Xoá `minipower-backend-application-dotnet`** | Nửa `init` thừa (P1); nửa `add` chuyển vào skill kiến trúc cùng `templates/command-handler.cs` (P2) |
| **QĐ-3** | **Mở `minipower-backend-architecture-dotnet`** — kiến trúc DDD/Clean của Jarvis | 39 ký tự, đạt C1. Nội dung: (a) 5 layer + **luật phụ thuộc một chiều**; (b) chỗ đặt từng loại tạo tác DDD (Aggregate · Entity · Value Object · Repository interface · Domain Service · Domain Event ở `Domain`; Command/Query/Handler/DTO ở `Application`; adapter EF/cache/blob ở `Infrastructure`; Controller/middleware/composition root ở `Host`); (c) **Layer Extension pattern** — `Program.cs` chỉ `AddHostLayer()`/`UseHostLayer()`; (d) trục ngang Atomic Module → trỏ sang 12 skill module, **không** nhân đôi |
| **QĐ-4** | Workflow chính của skill mới là **lát cắt dọc**, không phải "thêm handler" | `workflows/add-feature.md`: Domain → Application → Infrastructure → Host, mỗi bước nêu chỗ đặt + reference được phép + anti-pattern. `workflows/add-handler.md` kế thừa từ `application-dotnet/workflows/add.md` làm bước con |
| **QĐ-5** | **Cổng cứng = architecture test, không phải chữ trong markdown** | Skill mang `templates/ArchitectureTests/` → đặt vào `tests/{Product}.ArchitectureTests` của dự án đích. Luật kiểm bằng máy tối thiểu: `Domain` không reference `Application`/`Infrastructure`/`Host`/`Microsoft.EntityFrameworkCore` · `Application` không reference `Host`/`Infrastructure` · Controller không inject `DbContext` · Handler nằm trong assembly `*.Application`. Sai ⇒ `dotnet test` **đỏ**. Đây là câu trả lời cho P4: *"luôn tuân thủ"* nghĩa là **build/test đỏ khi làm sai**, không phải một dòng chữ |
| **QĐ-6** | Skill mới theo **khuôn hai tầng của `convention-dotnet`** | Bảng "Cứng — `dotnet test`/`dotnet build` FAIL được" vs "Mềm — advisory, người quyết". Rule máy kiểm được thì **đừng nhắc bằng lời**; rule máy không kiểm được thì **đừng viết "bắt buộc"** |
| **QĐ-7** | Ranh giới với `convention-dotnet` — **không** chồng lấn | `architecture` lo *chỗ đặt code + hướng phụ thuộc* (cấp file/project); `convention` lo *cách viết dòng code* (cấp dòng). Skill mới **trỏ sang** convention ở mục "Output bắt buộc", không chép lại quy ước nào. Cặp cổng cứng bổ sung nhau: `dotnet format` + analyzer (convention) · `dotnet test` architecture test (architecture) |
| **QĐ-8** | Tri thức của `foundation` **tán, không xoá** (P5) | 2 anti-pattern + note transitive `Jarvis.Mvc` → `review-dotnet/SKILL.md` (đã có sẵn 1 mục check `Includes`, đặt cạnh) · `"Cors": {}` → bổ sung vào `scaffold/templates/layers/appsettings.json` (vá luôn chỗ lệch đã phát hiện ở P1) · thứ tự pipeline → comment trong `HostLayerExtension.cs` |
| **QĐ-9** | ADR cũ: **chữ giữ nguyên, gỡ href** | [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) liệt kê 15 lá như bản ghi lịch sử. Hai tên bị xoá đổi từ link sang code span để `link:check` sạch mà câu chữ không đổi — biến thể của [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-11 cho ca file biến mất |

### Số lá: 15 → 14

```text
xoá   minipower-backend-foundation-dotnet     (−1)
xoá   minipower-backend-application-dotnet    (−1)
mới   minipower-backend-architecture-dotnet   (+1)
                                              ───
                                              14   ✓ C5 (không tăng)
```

`backend-pack.test.js` khẳng định `skillDirs.length >= 14` — 14 vẫn qua, **không nới ngưỡng**.

### Bản đồ 5 layer (nội dung lõi của skill mới)

```text
Host              composition root · Controller · middleware · AddHostLayer/UseHostLayer
  ↑
Infrastructure    EF · cache · blob · adapter ngoài · implement Repository
  ↑
Application       Command · Query · Handler · DTO · ICommandDispatcher/IQueryDispatcher
  ↑
Domain            Aggregate · Entity · Value Object · Repository interface · Domain Service · Domain Event
  ↑
Domain.Shared     enum · const · kiểu dùng chung — không phụ thuộc gì
```

Mũi tên đọc là *"được phép biết"*. Ngược chiều mũi tên là vi phạm, và là thứ QĐ-5 bắt bằng `dotnet test`.

## §6. Confirm *(bắt buộc trước khi thi hành)*

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…QĐ-9? | |
| Q2 | Tên skill: **`minipower-backend-architecture-dotnet`** (đề xuất — "kiến trúc" phủ cả Clean + DDD + Atomic Module) hay `minipower-backend-ddd-dotnet` (hẹp hơn, bỏ sót trục ngang)? | |
| Q3 | Thư viện architecture test: **`NetArchTest.Rules`** (đề xuất — một package, fluent, không kéo dependency) hay `ArchUnitNET` (mạnh hơn, nặng hơn, cú pháp dài)? Hay để dạng test thuần `System.Reflection`, không thêm package? | |
| Q4 | Architecture test vào scaffold **mặc định cho mọi dự án**, hay chỉ thêm khi người dùng yêu cầu (tránh phạt dự án `mvp` ngắn ngày)? Đề xuất: **mặc định có**, vì giá trị nằm đúng ở giai đoạn code nhanh | |
| Q5 | Xác nhận QĐ-8 — tán tri thức `foundation` về `review-dotnet` + `scaffold`, không giữ chỗ trú nào khác? | |

Chốt xong: ghi ngày vào **Trạng thái** + cập nhật ghi chú [index](README.md).

## §7. Việc triển khai

| Bước | Việc | Done khi | Phụ thuộc |
|---|---|---|---|
| 1 | Dựng `backend/skills/minipower-backend-architecture-dotnet/` — `SKILL.md` (frontmatter `name`/`description` theo C1) + `README.md` | `backend-pack.test.js` xanh | Q1, Q2 |
| 2 | Viết `workflows/add-feature.md` (lát cắt dọc) + `workflows/add-handler.md` (kế thừa `application/workflows/add.md`) | Cả hai có checklist + anti-pattern | Bước 1 |
| 3 | Chuyển `application/templates/command-handler.cs` → skill mới; thêm `templates/ArchitectureTests/` | Test biên dịch được trên solution scaffold | Q3 |
| 4 | Thêm `tests/{Product}.ArchitectureTests` vào `scaffold/templates/solution-tree.txt` + `workflows/scaffold.md` + `templates/SKILLS.md` | `dotnet test` xanh trên solution mới scaffold | Q4, Bước 3 |
| 5 | QĐ-8: `"Cors": {}` vào `scaffold/templates/layers/appsettings.json` · 2 anti-pattern + note transitive vào `review-dotnet/SKILL.md` · comment thứ tự pipeline vào `HostLayerExtension.cs` | Grep thấy đủ 3 chỗ | Q5 |
| 6 | Xoá 2 thư mục skill; sửa **9 file** đang ref: `backend/README.md` (bảng 15→14) · `backend/PACK.md` (comment "15 lá") · `scaffold/{SKILL.md,README.md,workflows/add.md,workflows/scaffold.md,templates/SKILLS.md,templates/docs-Architecture.md}` · `review-dotnet/SKILL.md` | `grep -r "foundation-dotnet\|application-dotnet"` = 0 hit ngoài ADR | Bước 1–5 |
| 7 | QĐ-9: gỡ href 2 tên trong [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md), giữ nguyên câu chữ | `diff` chỉ đổi cú pháp link | Bước 6 |
| 8 | Cập nhật [ADRs/README.md](README.md): trạng thái ADR-029 | Index khớp thực tế | Bước 7 |

## §8. Xác minh (định nghĩa xong)

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | Scaffold solution mới từ `workflows/scaffold.md`, chạy `dotnet test` | Architecture test chạy và **xanh** | 🔴 |
| T2 | Smoke | Cố tình thêm `ProjectReference` từ `{Product}.Domain` → `{Product}.Infrastructure`, chạy `dotnet test` | **Đỏ**, message nêu đúng luật bị vi phạm — đây là bằng chứng cho QĐ-5 | 🔴 |
| T3 | Smoke | Trong Cursor thật: prompt *"thêm API tạo đơn hàng cho backend"* (không gõ tên skill) | `minipower-backend-architecture-dotnet` tự kích hoạt — **chủ repo tự chạy** | 🔴 |
| T4 | Regression | `npm test` + `npm run gen:check` | Xanh; `backend-pack.test.js` không cần nới ngưỡng | 🔴 |
| T5 | Regression | `npm run link:check` | 0 gãy **mới** ngoài baseline | 🔴 |
| T6 | Regression | `grep -rn "foundation-dotnet\|application-dotnet" --include="*.md"` | 0 hit ngoài `ADRs/` | 🔴 |
| T7 | Regression | `diff` [ADR-021](ADR-021-2026-08-24-doi-ten-pack-jarvis-thanh-backend.md) trước/sau bước 7 | Chỉ đổi cú pháp link, **không đổi một chữ nào** | 🔴 |

Icon: 🟢 xong · 🟡 có sẵn, cần giữ xanh · 🔴 chưa có. **Không 🟢 Done khi còn T đỏ.**

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| **Tốt** | Một nguồn cho wiring Host (hết P1 và hết chỗ lệch `Cors`) · trục dọc lần đầu có người giữ (P3) · *"luôn tuân thủ kiến trúc"* thành **cổng cứng thật** thay vì chữ (P4) · `description` khớp bề mặt kích hoạt tần suất cao — thêm tính năng, không phải khởi tạo (P2) · số lá **giảm** 15→14 |
| **Xấu / chi phí** | Xoá 2 skill là **breaking** với prompt/bookmark đang trỏ tên cũ — nội bộ, chưa publish rộng, đổi sớm rẻ (khuôn [ADR-024](ADR-024-2026-08-25-backend-hub-publish-nguon-minipower.md) QĐ-3) · thêm 1 test project vào mọi solution scaffold (~1 package, thời gian build tăng không đáng kể) · architecture test là tài sản phải bảo trì khi kiến trúc Jarvis đổi |
| **Trung lập** | Framework Jarvis không đổi (C6) · `rules.json`/router không đụng (C2) · architecture test chỉ canh **hướng phụ thuộc**, không canh chất lượng thiết kế bên trong layer — phần đó vẫn là việc của `review-dotnet` |
