# troubleshooting-dotnet

Skill AI hỗ trợ **troubleshooting service .NET** bằng metrics từ Grafana/Prometheus.

Agent đọc [SKILL.md](./SKILL.md) khi thực thi.

## Khi nào dùng

| Tình huống | Hành động |
|---|---|
| Sự cố production, cần số liệu thực từ dashboard | Chạy tool [tools/fetch-dashboard-metrics.js](./tools/fetch-dashboard-metrics.js) |
| Thiết lập pipeline observability OTEL → Grafana → alert | [observability-dotnet](../observability-dotnet/README.md) |
| Panel trống, query lỗi | `--dry-run` kiểm tra PromQL + biến dashboard |

## Cách gọi

Gọi skill bằng `@jarvis/skills/troubleshooting-dotnet/SKILL.md`, kèm **ngữ cảnh đủ để agent tự chạy tool** (Grafana/Prometheus URL, dashboard, biến, khung thời gian).

### Prompt mẫu — dashboard `.Net Leak memory`

Tương đương lệnh terminal:

```bash
cd jarvis/skills/troubleshooting-dotnet/tools

GRAFANA_URL=http://localhost:3000 \
GRAFANA_USER=admin \
GRAFANA_PASSWORD=Admin@123 \
PROMETHEUS_URL=http://localhost:9090 \
DASHBOARD_VAR_exported_job=Sample \
DASHBOARD_VAR_exported_instance=All \
node fetch-dashboard-metrics.js --uid dfoxo2zt2lkaof
```

**Prompt gợi ý (copy vào chat):**

```text
@jarvis/skills/troubleshooting-dotnet/SKILL.md

Troubleshoot service .NET — lấy metrics 24h từ Grafana:

- Grafana: http://localhost:3000 (admin / Admin@123)
- Prometheus: http://localhost:9090
- Dashboard UID: dfoxo2zt2lkaof (.Net Leak memory)
- Biến dashboard:
  - exported_job = Sample
  - exported_instance = All

Chạy fetch-dashboard-metrics, đọc file JSON trong artifacts/, phân tích RAM/GC/latency/RPS và gợi ý bước tiếp theo.
```

Agent sẽ:
1. `list-dashboard-vars.js --uid dfoxo2zt2lkaof` — xác nhận tên biến (`exported_job`, `exported_instance`)
2. Chạy `fetch-dashboard-metrics.js` với `--var` hoặc `DASHBOARD_VAR_*`
3. Đọc `artifacts/dfoxo2zt2lkaof-*.json` mới nhất → phân tích

### Prompt mẫu — dashboard khác (biến động)

Khi chưa biết UID hoặc tên biến:

```text
@jarvis/skills/troubleshooting-dotnet/SKILL.md

Grafana localhost:3000, Prometheus :9090.
Tìm dashboard "Dotnet Runtime Metrics", lấy metrics 6h gần nhất.
Filter job=my-service, instance=host1.
Phân tích GC và thread pool.
```

Agent: `list-dashboards.js` → `list-dashboard-vars.js --uid <uid>` → `--var job=my-service --var instance=host1 --hours 6`.

### Các thông tin nên có trong prompt

| Thông tin | Ví dụ | Bắt buộc? |
|---|---|---|
| Grafana URL + auth | `localhost:3000`, user/password | Có (hoặc đã có trong `.env`) |
| Prometheus URL | `localhost:9090` | Có |
| Dashboard | UID `dfoxo2zt2lkaof` hoặc tên `.Net Leak memory` | Có |
| Biến dashboard | `exported_job=Sample`, `exported_instance=All` | Có nếu dashboard có templating |
| Khung thời gian | `24h` (mặc định), `--hours 6`, hoặc `--start`/`--end` | Tùy chọn |
| Mục tiêu phân tích | RAM leak, spike latency, Gen2 GC… | Khuyến nghị |

**Truyền biến dashboard** — hai cách tương đương:

```bash
# Cách 1: env (tiện khi copy từ terminal)
DASHBOARD_VAR_exported_job=Sample \
DASHBOARD_VAR_exported_instance=All \
node fetch-dashboard-metrics.js --uid dfoxo2zt2lkaof

# Cách 2: CLI --var (tên lấy từ list-dashboard-vars.js)
node fetch-dashboard-metrics.js \
  --uid dfoxo2zt2lkaof \
  --var exported_job=Sample \
  --var exported_instance=All
```

Output mặc định: `artifacts/{uid}-{timestamp}.json` — agent đọc file này để phân tích, không cần user paste JSON vào chat.

## Tool Node.js

```bash
cd jarvis/skills/troubleshooting-dotnet/tools

# Liệt kê dashboard
node list-dashboards.js

# Xem tên biến của dashboard (dùng cho --var / DASHBOARD_VAR_*)
node list-dashboard-vars.js --uid <uid>

# Lấy metrics
node fetch-dashboard-metrics.js \
  --uid <uid> \
  --var <name>=<value> \
  --hours 6
# Output mặc định: ../artifacts/{uid}-{timestamp}.json
```

Cấu hình mặc định test: xem [tools/.env.example](./tools/.env.example).

## Cấu trúc

```text
troubleshooting-dotnet/
├── SKILL.md
├── README.md
├── artifacts/                       # Output JSON mặc định (gitignore *.json)
└── tools/
    ├── fetch-dashboard-metrics.js   # CLI chính
    ├── list-dashboards.js
    ├── list-dashboard-vars.js       # Liệt kê biến templating theo uid
    ├── lib/
    │   ├── grafana.js               # Bước 1–3
    │   ├── templating.js            # Thay $variable
    │   ├── prometheus.js            # Bước 4
    │   └── normalize.js             # Bước 5
    ├── grafana/README.md
    └── prometheus/README.md
```
