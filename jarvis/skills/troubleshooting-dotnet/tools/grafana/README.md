# Grafana API — lấy Dashboard JSON

Bước 1–3 trong luồng troubleshooting metrics.

## Bước 1: Lấy Dashboard JSON

```http
GET /api/dashboards/uid/{uid}
Authorization: Basic <base64(user:password)>
```

Response chứa `dashboard.panels[]` và `dashboard.templating.list[]`.

Module: [lib/grafana.js](../lib/grafana.js) → `fetchDashboard(config, uid)`

## Bước 2: Duyệt panel

Mỗi panel có `targets[]` với `expr` (PromQL). Panel kiểu `row` có `panels[]` lồng nhau — tool duyệt đệ quy.

```javascript
import { collectPanels } from "./lib/grafana.js";

const panels = collectPanels(dashboard.panels);
for (const panel of panels) {
  for (const target of panel.targets) {
    console.log(panel.title, target.expr);
  }
}
```

## Bước 3: Xử lý biến Dashboard

Mỗi dashboard đặt tên biến riêng trong `templating.list[].name`. **Không hardcode** — liệt kê trước:

```bash
node list-dashboard-vars.js --uid <dashboard-uid>
```

Output JSON gồm `variables[].name` — dùng làm key cho `--var`:

```bash
node fetch-dashboard-metrics.js \
  --uid <uid> \
  --var exported_job=<job> \
  --var exported_instance=<host>

# Dashboard khác
node fetch-dashboard-metrics.js \
  --uid <uid> \
  --var service_name=<service> \
  --var job=<job>
```

Thay `$variable` / `${variable}` trong PromQL trước khi query:

```javascript
import { substituteVariables } from "./lib/templating.js";

const resolved = substituteVariables(
  'rate(http_requests_total{instance="$instance"}[5m])',
  { instance: "server01" }
);
// → rate(http_requests_total{instance="server01"}[5m])
```

Hỗ trợ thêm: `$__interval`, `$__rate_interval`, `$__range`.

Khi `templating.list[].current` trống (dashboard chưa mở trên UI), tool **tự query Prometheus** qua `label_values(...)` trong [lib/variable-resolver.js](../lib/variable-resolver.js). Nếu biến có `includeAll: true` và không có giá trị, dùng `allValue` (thường `.*`).

## CLI helper

```bash
# Tìm UID dashboard
node list-dashboards.js --query runtime

# Xem tên biến templating (dùng cho --var)
node list-dashboard-vars.js --uid <uid>

# Xem PromQL đã resolve, không query Prometheus
node fetch-dashboard-metrics.js --uid <uid> --var job=<job> --dry-run
```

## Cấu hình

| Biến | Mặc định test |
|---|---|
| `GRAFANA_URL` | `http://10.10.12.17:3000` |
| `GRAFANA_USER` | `admin` |
| `GRAFANA_PASSWORD` | *(xem `.env.example`)* |
