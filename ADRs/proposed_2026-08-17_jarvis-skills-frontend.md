# Jarvis skills — Frontend

| | |
|---|---|
| **Ngày** | 2026-08-17 |
| **Trạng thái** | 📝 **Proposed** — thiết kế trên giấy. **Chưa** tạo skill. Chờ chốt §7. |
| **Phạm vi** | Skill **frontend**: `@jarvis/core`, SPA Sample, wiring Vite/PrimeReact. Pack đích: `ai-skills/jarvis/` và/hoặc pack `frontend-react` (Q-FE-a). |
| **Ngoài phạm vi** | Sync skill **backend .NET** — [ADR backend](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md). Skill **autotest** (xunit, API, UI test) — [ADR autotest](proposed_2026-08-17_jarvis-skills-autotest.md). Không sửa `minipower/hooks` / `rules.json`. Không fork UI UX Pro Max / shadcn. |
| **Nối tiếp** | [ADR backend](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md) (Q1 SSOT = `ai-skills/jarvis/`) · [COORDINATION.md](../COORDINATION.md) §5.4 pack `frontend-react` |
| **Mục đích** | Chốt **cách tách skill FE** — không một skill “frontend” khổng lồ — trước khi viết file. |
| **Ảnh hưởng** (khi accepted) | Skill `jarvis-web` + `*-web` và/hoặc pack `frontend-react` · hub README · SOP Tabler: ghi chú không dùng cho Sample Jarvis. **Không** đụng `*-dotnet` trừ một dòng `UseCoreSpa` trên Host (ADR backend). **Không** tạo `test-*`. |

---

## §0. Vì sao ADR riêng

Skill FE không phụ thuộc sóng P0 backend (catalog EF/auth). Host `UseCoreSpa()` đã có trên HEAD. Gộp với backend làm trễ P0; gộp với autotest trộn **sinh UI** với **kiểm UI** — hai concern, hai quyết định.

```text
ADR backend          ADR này (FE)           ADR autotest
skill *-dotnet       skill *-web            skill test-*
độc lập              độc lập                độc lập
```

Cùng SSOT mặc định `ai-skills/jarvis/` (Q1 backend) trừ khi Q-FE-a chọn pack mới. Chốt §7 ADR này **không** chờ §7 autotest.

---

## §1. Hiện trạng (HEAD)

| Thành phần | Vị trí | Skill? |
|------------|--------|:------:|
| UI-kit `@jarvis/core` (PrimeReact 11) | repo Jarvis `frameworks/frontend` | ❌ |
| Feature kit | `account` · `tenant` · `role` · `dashboard` · `craftPdf` · `queryBuilder` · `fileManager` · `import` | ❌ |
| Module FE vệ tinh | `@jarvis/setting` · `@jarvis/notifications` | ❌ |
| Sample SPA | `Sample/clients/web` (Vite) | ❌ |
| Host serve SPA | `Jarvis.Mvc` · `UseCoreSpa()` | một dòng Host = ADR backend |
| Convention Tabler | `SOPs/tabler-uikit-skill.md` · `fundamentals/` | ⚠️ generic — **lệch** Sample (PrimeReact) |

Kit và Sample: **0** file test — runner/test UI thuộc [ADR autotest](proposed_2026-08-17_jarvis-skills-autotest.md), không chặn skill `jarvis-web`.

---

## §2. Nguyên tắc (không mega-skill)

**1 skill = 1 concern.** Orchestrator chỉ bảng route. Không copy API PrimeReact / kit vào `SKILL.md` — trỏ `frameworks/frontend/src/features/{x}` + README kit.

### 2.1 Học từ repo ngoài — cơ chế, không fork

| Repo | Hình dạng | Học | Không học |
|------|-----------|-----|-----------|
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Orchestrator + vệ tinh + CSV/`search.py` (một slice) + persist `MASTER.md` | Tách chiều; không nạp cả catalog | 192 palette / 22 stack ≠ contract `@jarvis/core` |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 1 skill = 1 việc (`react-best-practices`, `web-design-guidelines`, …) | Tách loại việc, không skill “frontend” | Next.js-centric |
| [shadcn/ui skill](https://ui.shadcn.com/docs/skills) · [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Skill mỏng: query source; thẩm mỹ = skill riêng | Trỏ README / `src/features/` | shadcn ≠ PrimeReact; Tabler ≠ Sample |

### 2.2 Ba lớp — đừng gộp

```text
A  Design intelligence     → convention / third-party (UUPM, frontend-design)
   (style, palette, a11y)     SOP Tabler giữ convention; không dùng cho Sample Jarvis

B  Kit + host SPA          → orchestrator mỏng `jarvis-web`
   (Vite, PrimeReact,         scaffold / init / theme / layout
    @jarvis/core wiring)      UseCoreSpa: một dòng — ADR backend

C  Feature màn hình        → skill `*-web` atomic (1 feature kit = 1 skill)
   (account, tenant, …)       giống providers/ của authentication-dotnet
```

---

## §3. Đề xuất skill

| Skill | Việc | Khi tạo |
|-------|------|---------|
| `jarvis-web` | Scaffold/init SPA: Vite, peer deps, `PrimeReactProvider`, Tailwind, link `@jarvis/core`, bảng route feature | Sóng FE-1 |
| `account-web` | Login / AuthShell / token — khớp Sample | FE-1 **hoặc** FE-2 (Q-FE-b) |
| `tenant-web` | Màn tenant kit | Khi product cần |
| `setting-web` · `notifications-web` | Module FE vệ tinh | Cùng / sau skill backend module tương ứng |
| `dashboard-web` · `craftpdf-web` · `querybuilder-web` · `filemanager-web` · `role-web` | Feature kit còn lại | **Không** đẻ giấy — khi có nhu cầu |

---

## §4. Ranh giới an toàn

| ❌ | Vì sao |
|---|---|
| Một skill `jarvis-frontend` ôm 8 feature | Trái atomic + token-guard |
| Fork UUPM / 192 palette vào pack Jarvis | Generic; kit đã chốt PrimeReact |
| Gộp inbox FE vào `notification-dotnet` (SMTP) | Cùng lỗi tên với backend |
| Làm skill FE trong sóng 1 ADR backend | Phá phạm vi; trì hoãn P0 API |
| Viết `test-web` / chọn Playwright trong ADR này | Thuộc [ADR autotest](proposed_2026-08-17_jarvis-skills-autotest.md) |

---

## §5. Thứ tự (sau khi chốt §7)

```text
Độc lập ADR backend sóng 1.
        │
        ├─ FE-1   jarvis-web (+ 1 feature nếu Q-FE-b)
        └─ FE-2   feature *-web khi có nhu cầu
```

Không chờ autotest. Không chờ backend P2.

---

## §6. Success criteria (sóng FE-1)

| # | Tiêu chí | Đo được |
|---|----------|---------|
| F1 | Có `jarvis-web` (SKILL + README + workflow scaffold/init) — không nhét 8 feature | Cây thư mục |
| F2 | Đúng 0 hoặc 1 skill `*-web` feature ở FE-1 (Q-FE-b) | Đếm skill |
| F3 | Hub: Sample = PrimeReact; Tabler ≠ Jarvis SPA | README |

---

## §7. Quyết định MỞ

| # | Câu hỏi | Đề xuất | Vì sao cần bạn |
|---|---------|---------|----------------|
| **Q-FE-a** | Skill `-web` để đâu? | **A:** pack `jarvis/` lúc FE-1. Chuyển pack `frontend-react` ([COORDINATION](../COORDINATION.md) §5.4) khi ≥3 skill FE ổn định | A gần Sample; B đúng vai trò nhưng thêm hub |
| **Q-FE-b** | Feature đầu? | `account-web` (login/shell Sample) | Tenant / Setting chờ nhu cầu product |
| **Q-FE-c** | Design intelligence? | **Không** vào pack Jarvis. UUPM / `frontend-design` = optional convention. SOP Tabler giữ, ghi “không cho Sample Jarvis” | Tránh agent skin Tabler lên PrimeReact |

---

## §8. Nếu accepted — việc sẽ làm (chưa làm bây giờ)

1. Ghi Q-FE-* vào decision-log (hoặc amend §7).
2. Sóng FE-1: `jarvis-web` + (nếu Q-FE-b) một feature; cập nhật hub; chú thích Tabler.
3. `UseCoreSpa`: một dòng `foundation-dotnet` do **ADR backend**.
4. Không tạo skill test.

---

## §9. Tham chiếu

| Tài liệu | Vai trò |
|----------|---------|
| [ADR backend](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md) | Sync `*-dotnet`; Q1 SSOT |
| [ADR autotest](proposed_2026-08-17_jarvis-skills-autotest.md) | Test — độc lập, không chặn FE-1 |
| repo Jarvis `frameworks/frontend` · `Sample/clients/web` | Kit + SPA |
| [COORDINATION.md](../COORDINATION.md) §5.4 | Pack `frontend-react` tương lai |
| UUPM · Vercel agent-skills · shadcn · frontend-design | Cơ chế tách skill |

---

*Chỉ inventory + thiết kế. Không tạo skill cho đến khi bạn chốt §7.*
