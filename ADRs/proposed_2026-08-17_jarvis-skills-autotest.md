# Jarvis skills — Autotest

| | |
|---|---|
| **Ngày** | 2026-08-17 |
| **Trạng thái** | 📝 **Proposed** — thiết kế trên giấy. **Chưa** tạo skill. Chờ chốt §7. |
| **Phạm vi** | Skill **autotest**: unit / integration .NET, contract API, (sau này) test UI. Pack đích: `ai-skills/jarvis/` và/hoặc pack `qa` (Q-TEST-a). |
| **Ngoài phạm vi** | Sync skill **backend .NET** (catalog, EF, auth, blob…) — [ADR backend](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md). Skill **frontend** (kit, SPA, `*-web`) — [ADR frontend](proposed_2026-08-17_jarvis-skills-frontend.md). Không sửa `minipower/hooks` / `rules.json`. Không chọn/cài Playwright hay Vitest trong ADR này. |
| **Nối tiếp** | [ADR backend](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md) (Q1 SSOT) · [COORDINATION.md](../COORDINATION.md) H5 pack `qa` · SOP `testing-overview` · `automation-test-api-insomnia` · Minipower DOC-16 |
| **Mục đích** | Chốt **cách tách skill test** — không một skill “autotest” khổng lồ — trước khi viết file. |
| **Ảnh hưởng** (khi accepted) | Skill `test-dotnet` (và sau này `test-api` / `test-web`) · vá phần **test project** trong `jarvis-dotnet/workflows/scaffold.md` · hub README. **Không** tạo `*-web`. **Không** đổi checklist `code-review-dotnet` thành skill sinh test. |

---

## §0. Vì sao ADR riêng

`code-review-dotnet` chỉ **flag thiếu test**. Autotest dạy **viết / chạy / bố trí** test. Đó không phải việc của ADR backend (P0 catalog) hay ADR frontend (sinh màn).

```text
ADR backend          ADR frontend           ADR này (test)
skill *-dotnet       skill *-web            skill test-*
độc lập              độc lập                độc lập
```

Chốt §7 ADR này **không** chờ Q-FE. `test-web` chỉ *sau* khi repo có runner — quyết định tool thuộc đây, không thuộc ADR FE.

---

## §1. Hiện trạng (HEAD)

| Lớp | Hiện có | Skill? |
|-----|---------|:------:|
| Framework Jarvis | `UnitTest/` — xunit + `WebApplicationFactory` / TestHost (Auth, Cache, Blob, EF, Querying, Realtime, OTEL…) | ❌ convention trong code, agent không được dạy |
| Product scaffold | `jarvis-dotnet` tạo `{Product}.Domain.Tests` + `.Application.Tests` — **project trống**, không template, không `Host.Tests` | ❌ |
| API contract | SOP Insomnia (`SOPs/automation-test-api-insomnia.md`) | ❌ không phải skill pack |
| FE unit / e2e | Sample/kit: không runner trong `package.json`; 0 file `*.spec` / `*.test` | ❌ |
| Review | `code-review-dotnet` flag thiếu test — không sinh test | một phần |
| Pipeline QA | Minipower DOC-16 · COORDINATION **H5** pack `qa` (khung, chưa có) | ❌ |

---

## §2. Nguyên tắc (không mega-skill)

**1 skill = 1 lớp test.** Không skill `autotest` ôm unit + API + UI. Không bịa tool (Playwright/Vitest) trước khi repo có script.

```text
T1  test-dotnet     xunit · TestHost / WebApplicationFactory · fake store
                    · test Domain / Application / (sau) Host product
                    · convention đọc UnitTest/ framework khi viết test Jarvis.*

T2  test-api        contract HTTP ↔ DOC-12 / OpenAPI
                    tái dùng SOP Insomnia — nâng skill khi chốt Q-TEST-c

T3  test-web        unit/component + e2e UI
                    chỉ sau khi Sample/kit có runner (Q-TEST-d)
```

---

## §3. Đề xuất skill

| Skill | Việc | Khi tạo |
|-------|------|---------|
| `test-dotnet` | Layer nào test gì; xunit; fake `ICurrentUserStore` / `ICurrentTenantStore`; `WebApplicationFactory` khi đụng Host; `dotnet test` | Sóng T-1 |
| `test-api` | Collection Insomnia / HTTP ↔ OpenAPI; không hard-code secret | Sau Q-TEST-c; SOP đã có nội dung |
| `test-web` | Vitest/RTL và/hoặc Playwright — **chưa chọn tool** | Sau Q-TEST-d (repo phải có runner trước) |

Sóng T-1 **vá** `jarvis-dotnet/workflows/scaffold.md`: 2 project xunit không còn rỗng — một test mẫu Domain + một test Application (dispatcher). `Host.Tests` chỉ khi Q-TEST-b = có.

`code-review-dotnet` giữ checklist “thiếu test” (ADR backend). Skill này dạy *cách viết*. Không gộp.

---

## §4. Ranh giới an toàn

| ❌ | Vì sao |
|---|---|
| Một skill `autotest` ôm T1+T2+T3 | Trái atomic + token-guard |
| Viết `test-web` / chọn Playwright trước khi Sample có script test | Bịa tool; skill giấy |
| Biến `code-review-dotnet` thành nơi sinh test | Review ≠ generate |
| Làm skill test trong sóng 1 ADR backend | Phá phạm vi P0 catalog |
| Pack QA tự chạy / tự bàn giao | Trái §0 `AGENTS.md` |
| Chờ ADR frontend xong mới làm `test-dotnet` | T1 không phụ thuộc `*-web` |

---

## §5. Thứ tự (sau khi chốt §7)

```text
Độc lập ADR backend sóng 1.
        │
        ├─ T-1    test-dotnet + vá scaffold xunit
        ├─ T-2    test-api (nếu Q-TEST-c = skill)
        └─ T-3    test-web sau khi repo có runner
```

T-1 không chờ FE-1. T-3 có thể cần SPA đã có (thực tế repo), không cần ADR FE accepted.

---

## §6. Success criteria (sóng T-1)

| # | Tiêu chí | Đo được |
|---|----------|---------|
| T1 | `test-dotnet` có template + quy tắc layer | File skill |
| T2 | Scaffold product: ≥1 test Domain + ≥1 test Application **chạy được** (`dotnet test`) | Lệnh |
| T3 | Chưa có `test-web` trừ khi Q-TEST-d đã chốt **và** Sample/kit có runner | Grep |

---

## §7. Quyết định MỞ

| # | Câu hỏi | Đề xuất | Vì sao cần bạn |
|---|---------|---------|----------------|
| **Q-TEST-a** | `test-dotnet` để đâu? | Pack `jarvis/` (cạnh scaffold). Pack `qa` (H5) **sau** khi có `test-api` + `test-web` | Tránh pack QA rỗng |
| **Q-TEST-b** | T-1 có `Host.Tests` + `WebApplicationFactory`? | **Chưa** — Domain + Application trước | Host test đắt, dễ giòn |
| **Q-TEST-c** | SOP Insomnia → skill `test-api`? | **Hoãn** — link SOP từ `test-dotnet` / hub đến khi DOC-12 + collection ổn | SOP đã đủ cho Light |
| **Q-TEST-d** | Runner FE? | **Chưa chọn.** Chốt khi thêm test vào Sample/kit (Vitest vs Playwright = quyết định *tool repo*, rồi mới skill) | Skill trước tool = bịa |

---

## §8. Nếu accepted — việc sẽ làm (chưa làm bây giờ)

1. Ghi Q-TEST-* vào decision-log (hoặc amend §7).
2. Sóng T-1: `test-dotnet` + vá scaffold (test mẫu, không chỉ `dotnet new xunit`).
3. Không tạo `test-web` / không cài Playwright trong ADR này.
4. Không tạo skill `*-web`.

---

## §9. Tham chiếu

| Tài liệu | Vai trò |
|----------|---------|
| [ADR backend](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md) | Q1 SSOT; `code-review-dotnet` chỉ flag |
| [ADR frontend](proposed_2026-08-17_jarvis-skills-frontend.md) | SPA/kit — độc lập; T-3 có thể cần runner trên SPA |
| repo Jarvis `UnitTest/` | Mẫu xunit / TestHost |
| `jarvis-dotnet/workflows/scaffold.md` | 2 project test rỗng |
| [COORDINATION.md](../COORDINATION.md) H5 | Pack `qa` tương lai |
| SOP testing + Insomnia | API autotest (chưa skill) |
| Minipower DOC-16 | Test strategy tài liệu — không thay skill chạy test |

---

*Chỉ inventory + thiết kế. Không tạo skill cho đến khi bạn chốt §7.*
