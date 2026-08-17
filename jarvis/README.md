# OpenCode skills — Jarvis .NET

Bản đồ skill AI cho repo Jarvis framework. Mỗi skill có **README** (người dùng) và **SKILL.md** (agent).

## Cài vào Cursor

Cursor nhận skill tại **`.cursor/skills/{tên-skill}/SKILL.md`**. Repo `ai-skills` là **source of truth** — link hoặc copy vào workspace đang làm việc.

Chạy lệnh **từ root workspace**. Thay `/path/to/ai-skills` bằng path thực tế (tương đối hoặc tuyệt đối).

### macOS / Linux — từng skill

```bash
mkdir -p .cursor/skills
JARVIS=/path/to/ai-skills/jarvis
for d in "$JARVIS"/skills/*/; do
  name=$(basename "$d")
  ln -snf "$d" ".cursor/skills/$name"
done

# Kiểm tra
test -f .cursor/skills/jarvis-dotnet/SKILL.md && echo "OK"
```

### Windows — PowerShell

```powershell
New-Item -ItemType Directory -Force -Path .cursor\skills
$jarvis = Join-Path (Get-Location) "ai-skills\jarvis\skills"
Get-ChildItem -Directory $jarvis | ForEach-Object {
  New-Item -ItemType SymbolicLink -Force `
    -Path (Join-Path ".cursor\skills" $_.Name) -Target $_.FullName
}

# Kiểm tra
Test-Path .cursor\skills\jarvis-dotnet\SKILL.md
```

### OpenCode — symlink cả tree

Nếu prompt dùng path `.opencode/skills/`:

```bash
ln -snf /path/to/ai-skills/jarvis/skills .opencode/skills
```

Chi tiết publish sang repo product: [Publish skill sang repo consumer](#publish-skill-sang-repo-consumer) (bên dưới).

---

## Skills

| Skill | README | Mô tả |
|-------|--------|--------|
| **jarvis-dotnet** | [skills/jarvis-dotnet/README.md](./skills/jarvis-dotnet/README.md) | Scaffold / init / add solution Jarvis |
| **foundation-dotnet** | [skills/foundation-dotnet/README.md](./skills/foundation-dotnet/README.md) | Json, CORS, WebApi, CurrentUser/Tenant |
| **application-dotnet** | [skills/application-dotnet/README.md](./skills/application-dotnet/README.md) | CQRS Application layer |
| **authentication-dotnet** | [skills/authentication-dotnet/README.md](./skills/authentication-dotnet/README.md) | JWT, API Key, Cognito |
| **notification-dotnet** | [skills/notification-dotnet/README.md](./skills/notification-dotnet/README.md) | Email SMTP Mailkit |
| **notifications-module-dotnet** | [skills/notifications-module-dotnet/README.md](./skills/notifications-module-dotnet/README.md) | Inbox in-app (không SMTP) |
| **caching-dotnet** | [skills/caching-dotnet/README.md](./skills/caching-dotnet/README.md) | Memory + Redis cache |
| **multitenancy-dotnet** | [skills/multitenancy-dotnet/README.md](./skills/multitenancy-dotnet/README.md) | Tenant + EF mặc định (UoW, dedicated DB) |
| **setting-dotnet** | [skills/setting-dotnet/README.md](./skills/setting-dotnet/README.md) | Setting Group/Key + HTTP |
| **realtime-dotnet** | [skills/realtime-dotnet/README.md](./skills/realtime-dotnet/README.md) | SignalR transport (không inbox) |
| **swashbuckle-dotnet** | [skills/swashbuckle-dotnet/README.md](./skills/swashbuckle-dotnet/README.md) | Swagger / OpenAPI |
| **healthcheck-dotnet** | [skills/healthcheck-dotnet/README.md](./skills/healthcheck-dotnet/README.md) | Health endpoints |
| **telemetry-dotnet** | [skills/telemetry-dotnet/README.md](./skills/telemetry-dotnet/README.md) | OpenTelemetry |
| **observability-dotnet** | [skills/observability-dotnet/README.md](./skills/observability-dotnet/README.md) | Thiết lập observability .NET — OTEL, Prometheus, Grafana, alert |
| **blobstoring-dotnet** | [skills/blobstoring-dotnet/README.md](./skills/blobstoring-dotnet/README.md) | FileSystem / MinIO / AwsS3 blob |
| **troubleshooting-dotnet** | [skills/troubleshooting-dotnet/README.md](./skills/troubleshooting-dotnet/README.md) | Troubleshoot metric / dashboard |
| **code-review-dotnet** | [skills/code-review-dotnet/README.md](./skills/code-review-dotnet/README.md) | Review PR C#/.NET |

## Prompt nhanh

```text
@.opencode/skills/jarvis-dotnet/workflows/scaffold.md
Scaffold backend .NET 9: Product=Acme, product=acme
```

```text
@.opencode/skills/multitenancy-dotnet/workflows/init.md
Init tenant + EF single DB cho MyApp
```

```text
@.opencode/skills/observability-dotnet/workflows/setup.md
Thiết lập observability OTEL → Prometheus → Grafana → alert cho service {Product}
```

Framework overview: [README.md](../README.md) (repo gốc).

## Publish skill sang repo consumer

**Nguồn chính (source of truth):** pack **`ai-skills/jarvis/`** (repo `ai-skills`). Repo Jarvis framework **không** chứa `.opencode/`. Repo product **không** fork/sửa skill — symlink hoặc copy từ đây.

### Cấu trúc trên consumer

Cursor:

```text
{product}-backend/
└── .cursor/skills/{tên-skill}/   → ai-skills/jarvis/skills/{tên-skill}/
```

OpenCode (prompt `@.opencode/skills/...` vẫn hợp lệ nếu symlink):

```text
{product}-backend/
└── .opencode/skills/   → ai-skills/jarvis/skills/
```

### Cách đưa skill vào repo product

| Cách | Khi nào dùng | Ghi chú |
|------|----------------|---------|
| **Symlink** | Dev local | Xem lệnh ở đầu file này |
| **Git submodule** | Nhiều team, pin version | Submodule trỏ **repo `ai-skills`**; mount `jarvis/skills` |
| **Copy (script/CI)** | Pin release | `rsync` `ai-skills/jarvis/skills/` — **khuyến nghị cho CI** |

**Không** commit nội dung skill đã chỉnh tay trong repo product — sửa tại `ai-skills` rồi sync lại.

### Submodule (khuyến nghị team)

```bash
# Trong repo {product}-backend (root)
git submodule add <url-repo-ai-skills> vendor/ai-skills
git submodule update --init --recursive

mkdir -p .opencode
ln -snf ../vendor/ai-skills/jarvis/skills .opencode/skills
# Cursor: symlink từng thư mục skills/* → .cursor/skills/
```

Pin version: checkout tag/commit cố định trong `vendor/ai-skills`, commit SHA submodule.

### Copy một lần / release script

```bash
AI_SKILLS=/path/to/ai-skills
PRODUCT_ROOT=/path/to/acme-backend

rsync -a --delete \
  "$AI_SKILLS/jarvis/skills/" \
  "$PRODUCT_ROOT/.opencode/skills/"
```

Chạy trong pipeline khi bump `JARVIS_SKILLS_REF` (tag trên repo **ai-skills**).

### Quy ước cập nhật

1. Thay đổi skill → PR trên **repo `ai-skills`** (pack `jarvis/`).
2. Repo product: `git submodule update` hoặc `rsync` theo tag mới.
3. PR product ghi dòng: `chore: sync Jarvis skills @ <tag hoặc commit short>` — không trộn thay đổi skill với feature app.

### Checklist publish (maintainer)

```text
- [ ] Tag hoặc commit trên ai-skills ổn định
- [ ] rsync/submodule update trên ít nhất một repo product thử
- [ ] Smoke: @jarvis-dotnet scaffold, @authentication-dotnet jwt, @code-review-dotnet
- [ ] Ghi tag/release note nếu breaking
```

