# Jarvis skills — bốn skill backend module (sóng 2)

| | |
|---|---|
| **Ngày** | 2026-08-17 |
| **Trạng thái** | ✅ **Accepted** — Q-P2-a…d đã chốt. Bốn skill đã tạo; `entityframework-dotnet` = stub redirect. |
| **Phạm vi** | `multitenancy-dotnet` (ôm EF, mặc định ORM.EF) · `realtime-dotnet` · `notifications-module-dotnet` · `setting-dotnet`. Hub + orchestrator. **Không** đổi Minipower / `rules.json`. |
| **Ngoài phạm vi** | Frontend kit — [ADR frontend](proposed_2026-08-17_jarvis-skills-frontend.md). Autotest. Dapper / Querying / CRUD / FV / `Jarvis.Tenants` / `Setting.Abstractions` (SPI chưa code). |
| **Nối tiếp** | [ADR backend sóng 1](accepted_2026-08-17_jarvis-skills-outdate-sau-refactor.md) |
| **Mục đích** | Skill cho capability HEAD đã wire trên Sample. |
| **Ảnh hưởng** | `jarvis/skills/{multitenancy,realtime,notifications-module,setting}-dotnet/` · `entityframework-dotnet` còn **stub redirect** · hub · `SKILLS.md` · `workflows/add.md` · `code-review-dotnet`. |

## Quyết định đã chốt

| # | Quyết định |
|---|---------|
| **Q-P2-a** | Thứ tự: Setting → Multitenancy → Realtime → Inbox |
| **Q-P2-b** | **Không giữ skill EF riêng.** `multitenancy-dotnet` = persistence mặc định **EF** (shared DB + UoW + dedicated/hybrid). `entityframework-dotnet` = redirect. |
| **Q-P2-c** | Làm `setting-dotnet` trên API HEAD; Abstractions bổ sung sau |
| **Q-P2-d** | `AddNotificationAppServiceWithRealtime` thuộc skill inbox |

Persistence mặc định: `AddJarvisCaching` → `AddEntityFramework` → `AddCoreDbContext<T>`. Dedicated DB = opt-in cùng skill (`AddMultitenancyEntityFramework`). Ambient: `AddCurrentTenant` + store (cùng skill + foundation).
