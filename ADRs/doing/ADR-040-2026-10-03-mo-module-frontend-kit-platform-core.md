# Mở module `frontend/` — 9 skill React theo kit `@platform/core`

| | |
|---|---|
| **Ngày** | 2026-10-03 |
| **Trạng thái** | Chốt 2026-10-03 — chủ repo chọn Q1–Q4 §6 trong phiên; thi hành §7 cùng ngày. **Điều chỉnh 2026-10-03** (mock là nhánh tạm — cuối file). Còn T4 (smoke trên module ERP thật) — chủ repo tự chạy |
| **Phạm vi** | Module mới `src/frontend/` (`PACK.md` · `README.md` · 9 lá `minipower-frontend-*-react`) + điểm đăng ký: catalog, test canh, intent, bảng pack của router, README gốc, AGENTS.md, skeleton bề mặt `frontend/` |
| **Ngoài phạm vi** | Sửa kit `@platform/core` (repo khác) · skill riêng cho module demo/mock của kit (planner, timesheet, form động, craft PDF/DOCX, file manager, import) — chỉ là dòng bảng trong `scaffold/workflows/add.md` · route guard / phiên đăng nhập · dòng gợi ý `frontend/src/` trong prompt AGENTS của CLI `init` |
| **Nối tiếp** | [ADR-022](../done/ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-4 (hệ tên) · QĐ-7 (3 câu hỏi — đã giữ chỗ `frontend/ ⏳`) · QĐ-8 (PACK.md) · [ADR-029](ADR-029-2026-08-28-skill-architecture-dotnet-thay-foundation-application.md) (cặp luật cắt ngang convention + architecture có test canh) · khuôn mở module [ADR-023](../done/ADR-023-2026-08-25-tach-module-ops-tu-backend-troubleshooting.md) · [ADR-030](ADR-030-2026-08-29-mo-module-presales-skill-uoc-luong-ulnl.md) |
| **Mục đích** | Ghi lại vì sao mở module, vết cắt 9 lá, chỗ đặt ranh giới máy / lời (ESLint + `tsc`), và nguồn chân lý của nội dung skill |
| **Ảnh hưởng** | `src/frontend/**` · [`skill-catalog.js`](../../src/router/hooks/lib/skill-catalog.js) (`SKILL_PACKS`) · [`module-registry.json`](../../src/router/hooks/lib/module-registry.json) (generated) · [`frontend-pack.test.js`](../../src/router/hooks/test/frontend-pack.test.js) (mới) · `pack-manifest.test.js` · `minipower-catalog.test.js` (43→52 lá) · [`intent-dispatch.js`](../../src/router/lib/intent-dispatch.js) + test · [bảng pack router](../../src/router/skills/minipower-router/SKILL.md) · [README.md](../../README.md) · [AGENTS.md](../../AGENTS.md) · [skeleton `frontend/`](../../src/router/surface-skeleton/frontend/README.md) |

---

## §1. Bối cảnh

Kit UI chuẩn công ty `@platform/core` (React 19 · PrimeReact 11 · Tailwind v4 · Zod + react-hook-form · axios; build tsup) đã có chuẩn feature module (13 folder, `call*`, `handleAction`, `configure*Navigate`, slot `content`, `callback`, controlled) và hai mẫu CRUD thật (`tenant` theo route, `role` theo dialog). Module ERP đang triển khai (HRM) **không** theo chuẩn đó: input / table viết thô, HTTP client riêng, không Zod, không `handleAction` — mỗi module tự chế. Backend đã có 14 lá Jarvis; frontend chưa có gì.

Trong phiên làm ADR này, kit được merge thêm (`develop` 33a023f): seed `mocks/*.json` mỗi feature, picker ngày giờ, `SearchableMultiSelect`, 4 feature mới; tài liệu `SAD-fe-module-structure.md` bị xoá, `docs/integration-and-usage.md` còn dấu xung đột merge chưa giải.

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Không có skill — AI viết frontend theo hiểu biết chung | Code lệch chuẩn kit (như HRM), không dùng primitive của kit |
| P2 | PrimeReact 11 là API compound, khác hẳn v10 | Mô hình hay sinh `<Column>`, `visible`/`onHide` — không chạy |
| P3 | Tài liệu kit đổi nhanh, có lúc lệch code (vd. `RoleListPage` được mô tả có `callback.list` nhưng code không có) | Tài liệu không đủ làm nguồn duy nhất |
| P4 | Kit không có lint — luật "feature không import router", "service không import UI" chỉ là lời | Vi phạm trôi qua PR |
| P5 | Link kit kiểu `file:` mang `node_modules` riêng | *Invalid hook call*, lỗi kiểu *Two different types with this name exist* |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | ADR-022 QĐ-7 luật 2 — mở module khi có skill thật |
| C2 | Skill **tự đứng**: code mẫu trong `templates/`, không trỏ đường dẫn repo kit / ERP (yêu cầu chủ repo) |
| C3 | Không fork / không sửa kit — chỉ dùng qua hợp đồng nó mở |
| C4 | "Cứng bằng máy, mềm bằng lời" — chữ *bắt buộc* chỉ khi có cổng máy |

## §4. Phương án

| # | Phương án | | Lý do |
|---|---|---|---|
| O1 | 9 lá tách nhỏ như backend | ✅ | Mỗi lá một bề mặt kích hoạt riêng (form ≠ CRUD ≠ điều hướng ≠ tuỳ biến page kit) |
| O2 | 6 lá lõi, gộp form vào CRUD | ❌ | Form dùng cả ngoài CRUD; description gộp mất từ khoá |
| O3 | Cổng máy: ESLint (typescript-eslint + react-hooks + `no-restricted-imports`) + `tsc` strict | ✅ | Một công cụ phủ cả convention lẫn kiến trúc, như analyzer + ArchUnit bên backend |
| O4 | Chỉ `tsc` | ❌ | Luật kiến trúc mãi là lời |
| O5 | ESLint + dependency-cruiser | ❌ | Thêm một tool cho việc `no-restricted-imports` (regex) đã làm được |
| O6 | Template cho app / module package import `@platform/core` | ✅ | Đúng chỗ code nghiệp vụ ERP nằm; ghi chú cách đổi khi viết trong kit |
| O7 | Skill theming riêng | ❌ | Kit tô màu bằng class Tailwind cứng (teal) — đổi preset Aura không đổi màu component kit; skill sẽ hứa điều kit chưa làm |

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **Mở module `frontend/`** — `roles: [frontend-react]`, `stage: implementation`, `repo: code`, nhận H4 (DOC-12, DOC-19, UC/FR/AC), giao H6 | Lọc QĐ-7: câu 1 không, câu 2 **có** (framework có vòng đời riêng) |
| **QĐ-2** | **9 lá `minipower-frontend-{capability}-react`**: `scaffold` · `architecture` · `convention` · `api` · `form` · `crud` (patterns `route-pages` / `dialog`) · `navigation` · `customization` · `review` | Hậu tố `-react` = stack, như `-dotnet` |
| **QĐ-3** | **Hai luật cắt ngang** `convention` + `architecture` — `frontend-pack.test.js` canh mọi lá trỏ tới cả hai | Khuôn ADR-029 |
| **QĐ-4** | **Cổng máy**: `tsconfig` (`strict` · `verbatimModuleSyntax` · `erasableSyntaxOnly` · `paths` chống trùng bản) + ESLint (typescript-eslint · `rules-of-hooks` · `exhaustive-deps` · luật R1–R7 bằng regex `caseSensitive`). **Không** bật preset `recommended-latest` của react-hooks v7 | Rule React Compiler (`set-state-in-effect`, `refs`) đánh đỏ mẫu nạp dữ liệu chuẩn của kit — bật là team tắt lint |
| **QĐ-5** | **Template viết cho app / module package**, import `@platform/core`; bộ placeholder khai **một chỗ** (architecture § Placeholder), test canh tên file template | Chủ repo chọn Q3 |
| **QĐ-6** | **Module có sẵn của kit = dòng bảng** trong `scaffold/workflows/add.md`, không skill riêng | Phần lớn còn mock / demo; chưa có nhu cầu tuỳ biến sâu — QĐ-7 luật 2 |
| **QĐ-7** | **Giới hạn đã biết của page kit** ghi ở `customization/reference/page-contract.md` § 4 kèm commit kit đã đối chiếu (33a023f) | Kit đổi nhanh (P3) — làm mới bảng khi nâng kit |
| **QĐ-8** | **TypeScript `~6.0`** trong mọi template | `typescript-eslint` 8.x chỉ hỗ trợ `<6.1` |
| **QĐ-9** | **Nội dung skill rút từ code kit, xác minh bằng chạy thật** — không chép tài liệu kit khi lệch code | Trả lời P3 |

## §6. Confirm

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Catalog đợt đầu? | 9 lá (2026-10-03) |
| Q2 | Lớp kiểm bằng máy? | ESLint template + `tsc` |
| Q3 | Template viết cho bối cảnh nào? | App / module package import `@platform/core` |
| Q4 | Phạm vi đăng ký? | Đủ bộ module mới (ADR này) |

## §7. Việc triển khai

| Bước | Việc | Done khi |
|---|---|---|
| 1 | `src/frontend/PACK.md` + `README.md` (hub, ranh giới, cài) | `pack-manifest.test.js` xanh |
| 2 | 9 lá: `SKILL.md` + `README.md` + `workflows/` + `templates/` + `reference/` + 2 pattern | `frontend-pack.test.js` xanh |
| 3 | Dựng app thử từ template trên kit thật (2 feature: route + dialog, host, 6 ví dụ tuỳ biến, đoạn mẫu control) | T1, T2 |
| 4 | Đăng ký: `SKILL_PACKS` · `MODULES` · đếm lá 52 · intent · bảng pack router · README gốc · AGENTS.md · skeleton `frontend/` | `npm test` xanh |
| 5 | `npm run gen` → `npm test` → `gen:check` → `link:check` | T3 |

## §8. Xác minh

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | App dựng từ template trên kit `develop` 33a023f: `tsc --noEmit` · `eslint .` · `vite build`; chạy trình duyệt: danh sách → tạo → sửa (nạp + reset) → dialog tạo → xoá qua xác nhận | xanh, không lỗi console | 🟢 |
| T2 | Mới | Cố tình vi phạm R1–R7 (router, axios, deep-import kit, ruột feature khác, services→UI, components→services, lá→hooks) + import hợp lệ làm đối chứng | đỏ đúng luật, đối chứng không bắt oan | 🟢 |
| T3 | Regression | `npm test` (613/613) · `gen:check` · `link:check` (0 gãy mới — 385 file · 2458 link · 21 nợ baseline) | xanh | 🟢 |
| T4 | Smoke | Dùng skill dựng / sửa một module ERP thật (vd. HRM) theo `architecture › add-feature` | chạy được, lint xanh | 🔴 chủ repo tự chạy |

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| Tốt | Module ERP có khuôn chạy được ngay, đúng chuẩn kit; luật kiến trúc FE lần đầu thành cổng máy; bẫy link `file:` và PrimeReact 11 được ghi thành template |
| Xấu / chi phí | Template phải theo kịp kit đổi nhanh — bảng giới hạn (QĐ-7) và catalog module (QĐ-6) cần làm mới mỗi lần nâng kit; repo đích thêm 5 devDependency lint |
| Trung lập | Phát hiện phía kit (báo chủ repo kit, không sửa ở đây): kit một bundle + `sideEffects` cả `dist` ⇒ app luôn ~3 MB · `TenantListPage` mặc định bật QueryBuilder gọi API thử nghiệm · tài liệu kit còn xung đột merge và link tới SAD đã xoá |

---

## Điều chỉnh 2026-10-03 — mock là nhánh tạm, không phải prototype

**Bối cảnh.** Chủ repo hỏi vì sao skill frontend chở dữ liệu giả, có phải để làm prototype. Soát lại: dữ liệu giả nằm trong luồng mặc định của skill `api` (template `services/` export sẵn `mock*`, `add-feature` gợi ý mock khi chưa có endpoint), và `add-mock.md` cho mock cả khi **DOC-12 chưa chốt** — tức là cho viết UI trước tiền đề, ngược triết lý "AI chỉ thực thi khi tài liệu tiền đề đủ rõ". Chủ repo chọn phương án B.

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-10** | **Mock không phải prototype** | Prototype / wireframe là DOC-19 của `analyst` (phase requirements, trước SRS). Mock là chỗ đứng tạm cho code thật — ghi ở hub, `api` SKILL / README, `add-mock`, `add-feature` |
| **QĐ-11** | **Điều kiện vào nhánh mock**: DOC-12 **đã có** contract + backend chưa chạy được + người duyệt hoãn, ghi nợ (`memory/doc-debt.md`) | DOC-12 chưa có ⇒ **dừng** ở cổng readiness. Thay điều kiện cũ "DOC-12 chưa chốt" |
| **QĐ-12** | **Mock ra khỏi luồng mặc định** | Template mock tách sang `api/templates/mock/`; `add-feature` chỉ dùng `call*`; `services/index.ts` mặc định không export `mock*`. Test canh mới: template ngoài `templates/mock/` không chở mock / dữ liệu giả |
| **QĐ-13** | **Luật M1**: `pages/` import `mock*` ⇒ **cảnh báo** trên máy dev, **lỗi khi `CI=true`** | `no-restricted-syntax` (tách khỏi `no-restricted-imports` của R1–R7), mức độ đọc `process.env.CI` — "gỡ mock trước merge" thành cổng máy mà không chặn lúc đang dựng |

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T5 | Mới | App thử trên kit 33a023f: feature theo luồng mặc định không có file mock; feature đi nhánh mock ⇒ `eslint .` 5 cảnh báo M1, thoát 0; `CI=true eslint .` 5 lỗi M1, thoát 1; `tsc` sạch cả hai nhánh | đúng như expect | 🟢 |
| T6 | Mới | `frontend-pack.test.js`: đặt file mock vào luồng mặc định ⇒ đỏ, gỡ ra ⇒ xanh · `npm test` 614/614 · `gen:check` · `link:check` 0 MỚI | xanh | 🟢 |
