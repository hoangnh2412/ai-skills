# Minipower Backend — skill implementation .NET (framework Jarvis)

Bản đồ skill code-backend của minipower — nội dung dạy framework Jarvis .NET. Mỗi skill có **README** (người dùng) và **SKILL.md** (agent).

## Cài vào Cursor

Cursor nhận skill tại **`.cursor/skills/{tên-skill}/SKILL.md`**. Repo `minipower` là **source of truth** — link hoặc copy vào workspace đang làm việc.

Chạy lệnh **từ root workspace**. Thay `/path/to/minipower` bằng path thực tế (tương đối hoặc tuyệt đối).

### macOS / Linux — từng skill

```bash
mkdir -p .cursor/skills
BACKEND=/path/to/minipower/backend
for d in "$BACKEND"/skills/*/; do
  name=$(basename "$d")
  ln -snf "$d" ".cursor/skills/$name"
done

# Kiểm tra
test -f .cursor/skills/minipower-backend-scaffold-dotnet/SKILL.md && echo "OK"
```

### Windows — PowerShell

```powershell
New-Item -ItemType Directory -Force -Path .cursor\skills
$backendSkills = Join-Path (Get-Location) "minipower\backend\skills"
Get-ChildItem -Directory $backendSkills | ForEach-Object {
  New-Item -ItemType SymbolicLink -Force `
    -Path (Join-Path ".cursor\skills" $_.Name) -Target $_.FullName
}

# Kiểm tra
Test-Path .cursor\skills\minipower-backend-scaffold-dotnet\SKILL.md
```

### OpenCode — symlink cả tree

Nếu prompt dùng path `.opencode/skills/`:

```bash
ln -snf /path/to/minipower/backend/skills .opencode/skills
```

Chi tiết publish sang repo product: [Publish skill sang repo consumer](#publish-skill-sang-repo-consumer) (bên dưới).

---

## Skills

| Skill | README | Mô tả |
|-------|--------|--------|
| **minipower-backend-scaffold-dotnet** | [skills/minipower-backend-scaffold-dotnet/README.md](./skills/minipower-backend-scaffold-dotnet/README.md) | Scaffold / init / add solution Jarvis |
| **minipower-backend-foundation-dotnet** | [skills/minipower-backend-foundation-dotnet/README.md](./skills/minipower-backend-foundation-dotnet/README.md) | Json, CORS, WebApi, ApiResponseWrapper |
| **minipower-backend-application-dotnet** | [skills/minipower-backend-application-dotnet/README.md](./skills/minipower-backend-application-dotnet/README.md) | CQRS Application layer |
| **minipower-backend-authentication-dotnet** | [skills/minipower-backend-authentication-dotnet/README.md](./skills/minipower-backend-authentication-dotnet/README.md) | JWT, API Key, Cognito |
| **minipower-backend-notification-dotnet** | [skills/minipower-backend-notification-dotnet/README.md](./skills/minipower-backend-notification-dotnet/README.md) | Email SMTP Mailkit |
| **minipower-backend-caching-dotnet** | [skills/minipower-backend-caching-dotnet/README.md](./skills/minipower-backend-caching-dotnet/README.md) | Memory + Redis cache |
| **minipower-backend-entityframework-dotnet** | [skills/minipower-backend-entityframework-dotnet/README.md](./skills/minipower-backend-entityframework-dotnet/README.md) | EF multitenancy |
| **minipower-backend-swashbuckle-dotnet** | [skills/minipower-backend-swashbuckle-dotnet/README.md](./skills/minipower-backend-swashbuckle-dotnet/README.md) | Swagger / OpenAPI |
| **minipower-backend-healthcheck-dotnet** | [skills/minipower-backend-healthcheck-dotnet/README.md](./skills/minipower-backend-healthcheck-dotnet/README.md) | Health endpoints |
| **minipower-backend-telemetry-dotnet** | [skills/minipower-backend-telemetry-dotnet/README.md](./skills/minipower-backend-telemetry-dotnet/README.md) | OpenTelemetry |
| **minipower-backend-observability-dotnet** | [skills/minipower-backend-observability-dotnet/README.md](./skills/minipower-backend-observability-dotnet/README.md) | Thiết lập observability .NET — OTEL, Prometheus, Grafana, alert |
| **minipower-backend-blobstoring-dotnet** | [skills/minipower-backend-blobstoring-dotnet/README.md](./skills/minipower-backend-blobstoring-dotnet/README.md) | FileSystem / MinIO blob |
| **minipower-backend-realtime-dotnet** | [skills/minipower-backend-realtime-dotnet/README.md](./skills/minipower-backend-realtime-dotnet/README.md) | Jarvis.Realtime + SignalR, Redis backplane |
| **minipower-backend-review-dotnet** | [skills/minipower-backend-review-dotnet/README.md](./skills/minipower-backend-review-dotnet/README.md) | Review PR C#/.NET |

## Prompt nhanh

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/scaffold.md
Scaffold backend .NET 9: Product=Acme, product=acme
```

```text
@.opencode/skills/minipower-backend-entityframework-dotnet/workflows/init.md
Init Jarvis EF + single DB cho MyApp
```

```text
@.opencode/skills/minipower-backend-observability-dotnet/workflows/setup.md
Thiết lập observability OTEL → Prometheus → Grafana → alert cho service {Product}
```

Framework overview: [README.md](../README.md) (repo gốc).

## Publish skill sang repo consumer

**Nguồn chính (source of truth):** thư mục `.opencode/` trong repo **Jarvis framework** (repo này). Repo product (`{product}-backend`) **không** fork/sửa skill — chỉ nhận bản cập nhật từ Jarvis hoặc PR upstream.

### Cấu trúc bắt buộc trên consumer

```text
{product}-backend/
└── .opencode/
    ├── README.md          # copy hoặc symlink từ Jarvis (file này)
    └── skills/
        ├── minipower-backend-scaffold-dotnet/
        ├── minipower-backend-caching-dotnet/
        └── ...
```

Agent/Cursor gọi skill bằng path **tương đối repo product**:

```text
@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/scaffold.md
```

### Cách đưa `.opencode/` vào repo product

| Cách | Khi nào dùng | Ghi chú |
|------|----------------|---------|
| **Git submodule** | Nhiều team, cần pin version skill | Submodule trỏ repo Jarvis; consumer chỉ mount/copy `.opencode` (xem script dưới) |
| **Symlink** | Dev local, Jarvis clone cạnh product repo | `ln -s ../../Jarvis/.opencode .opencode` — không commit symlink lên Windows CI |
| **Copy (script/CI)** | Pin release, không phụ thuộc submodule path | Script copy tree `.opencode/` từ tag Jarvis — **khuyến nghị cho CI** |
| **Monorepo** | Product và Jarvis cùng workspace | Một `.opencode/` ở root monorepo hoặc symlink như trên |

**Không** commit nội dung skill đã chỉnh tay trong repo product — sửa tại repo Jarvis rồi sync lại.

### Submodule (khuyến nghị team)

```bash
# Trong repo {product}-backend (root)
git submodule add <url-repo-jarvis> vendor/jarvis
git submodule update --init --recursive

# Đồng bộ .opencode từ submodule (chạy sau mỗi lần update submodule)
rsync -a --delete vendor/jarvis/.opencode/ .opencode/
```

Hoặc chỉ submodule thư mục skills (sparse) nếu host Git hỗ trợ — mặc định submodule cả repo Jarvis rồi `rsync` `.opencode/`.

Pin version: checkout tag/commit cố định trong `vendor/jarvis`, commit SHA submodule, chạy lại `rsync`.

### Symlink (dev local)

```bash
cd /path/to/acme-backend
ln -snf /path/to/Jarvis_2/.opencode .opencode
```

Thêm `.opencode` vào `.gitignore` nếu symlink chỉ dùng local; CI dùng copy/submodule.

### Copy một lần / release script

```bash
JARVIS_ROOT=/path/to/Jarvis_2
PRODUCT_ROOT=/path/to/acme-backend

rsync -a --delete \
  "$JARVIS_ROOT/.opencode/" \
  "$PRODUCT_ROOT/.opencode/"
```

Chạy trong pipeline khi bump `JARVIS_SKILLS_REF=v1.2.0` (tag trên repo Jarvis).

### Quy ước cập nhật

1. Thay đổi skill → PR trên **repo Jarvis** (review + merge `develop` / tag release).
2. Repo product: `git submodule update` hoặc chạy script `rsync` theo tag mới.
3. PR product ghi dòng: `chore: sync Jarvis skills @ <tag hoặc commit short>` — không trộn thay đổi skill với feature app.
4. Breaking skill (đổi workflow, package version bắt buộc): ghi trong PR Jarvis + tag semver skill (`skills-v1.3.0`) — consumer bump có chủ đích.

### Product repo sau khi có `.opencode/`

- README product: một dòng link `Skill AI: [.opencode/README.md](.opencode/README.md)`.
- Không duplicate bảng skill — link hub Jarvis hoặc copy README hub khi `rsync` (file này đi kèm).
- Scaffold mới: luôn dùng `@.opencode/skills/minipower-backend-scaffold-dotnet/workflows/scaffold.md`.

### Checklist publish (maintainer Jarvis)

```text
- [ ] Tag hoặc commit trên develop ổn định
- [ ] rsync/submodule update trên ít nhất một repo product thử
- [ ] Smoke: @minipower-backend-scaffold-dotnet scaffold, @minipower-backend-authentication-dotnet jwt, @minipower-backend-review-dotnet
- [ ] Ghi tag/release note nếu breaking
```

Chi tiết changelog skill: mục roadmap repo gốc [README.md](../README.md) (Việc cần làm tiếp theo).
