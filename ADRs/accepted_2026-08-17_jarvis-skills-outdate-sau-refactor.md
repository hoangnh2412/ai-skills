# Jarvis skills — lệch backend sau refactor framework (30 ngày)

| | |
|---|---|
| **Ngày** | 2026-08-17 |
| **Trạng thái** | ✅ **Accepted** — Q1–Q4, Q6 đã chốt. Sóng 1 (P0+P1) đã sửa trong pack `jarvis/`. Phạm vi **chỉ backend** (`*-dotnet`). |
| **Phạm vi** | Skill **backend .NET** trong [`jarvis/`](../jarvis/): catalog, template scaffold/init, EF, foundation, blob, telemetry, auth Host, hub/publish. Đối chiếu repo **Jarvis** sau `3cf72f35` (2026-08-15). **Không** đổi Minipower / `rules.json`. |
| **Ngoài phạm vi** | Frontend — [ADR frontend](proposed_2026-08-17_jarvis-skills-frontend.md). Autotest — [ADR autotest](proposed_2026-08-17_jarvis-skills-autotest.md). `UseCoreSpa()`: tối đa **một dòng** Host trong `foundation-dotnet`; không dạy React/PrimeReact. |
| **Nối tiếp** | [ADR sóng 2 — 4 skill module](accepted_2026-08-17_jarvis-skills-backend-modules.md) · [ADR frontend](proposed_2026-08-17_jarvis-skills-frontend.md) · [ADR autotest](proposed_2026-08-17_jarvis-skills-autotest.md) · [COORDINATION.md](../COORDINATION.md) (H4/H6) |
| **Mục đích** | Ghi nhận skill **backend** outdate / thiếu / lệch SSOT sau refactor tháng 8/2026 — sóng 1 sửa catalog/template/Host cho khớp HEAD. |
| **Ảnh hưởng** (accepted) | `jarvis-dotnet` templates · `entityframework-dotnet` · `foundation-dotnet` · `blobstoring-dotnet` · `telemetry-dotnet` · `authentication-dotnet` (AddCurrentUser) · [jarvis/README.md](../jarvis/README.md) (hub + publish) · [COORDINATION.md](../COORDINATION.md) §4 · `code-review-dotnet` checklist Jarvis. **Không** tạo skill `*-web` / `test-*`. **Không** đụng `minipower/` trừ câu publish (Q1). |

---

Nội dung inventory, quyết định Q1–Q4/Q6, và phạm vi sóng 2 giữ nguyên như bản proposed cùng ngày. File này là bản accepted để bắt đầu sửa skill.

## Changelog PackageId (T1)

PackageId cũ **đã đổi tên** — skill không còn dạy `Jarvis.EntityFramework`; dùng `Jarvis.ORM.EntityFramework`.

## Sóng 1 — việc đã chốt (§8)

1. Catalog + csproj: `Jarvis.ORM.EntityFramework`; xóa ghost PostgreSql / FileSystem package / OTEL Redis instrumentation package.
2. `InfrastructureLayerExtension`, `AppDbContext`, `AppUnitOfWork`, `program-setup` — namespace + UoW 4 args + Multitenancy.EF khi dedicated DB.
3. `foundation-dotnet`: `AddCoreDomain` = no-op; Host `AddCurrentUser` + `AddCurrentTenant`; bỏ type đã xóa trên HEAD.
4. `blobstoring-dotnet`: `AddCoreBlobStoring` + provider AwsS3.
5. `telemetry-dotnet` + Host enrich: OTEL.DDD, không kế thừa type đã xóa.
6. Hub + publish README (Q1); observability + troubleshooting trên bảng hub.
7. `code-review-dotnet` (§3 P1.4).
8. `SKILLS.md` + `workflows/add.md`: hàng Multitenancy / Dapper / Realtime (chưa có skill — sóng 2).
