# Prometheus API — query_range

Bước 4–5 trong luồng troubleshooting metrics.

## Bước 4: Query dữ liệu

```http
GET /api/v1/query_range?query=<promql>&start=<unix>&end=<unix>&step=300
```

- `step=300` → mỗi điểm cách 5 phút
- Mặc định lấy **24 giờ** gần nhất (`--hours 24`)

Module: [lib/prometheus.js](../lib/prometheus.js) → `queryRange(config, query, { start, end, step })`

```javascript
const data = await queryRange(config, promql, {
  start: 1718113600,
  end: 1718200000,
  step: 300,
});
// data.result[] → { metric, values: [[unix, "value"], ...] }
```

## Bước 5: Chuẩn hóa cho AI

Module: [lib/normalize.js](../lib/normalize.js)

Prometheus trả:

```json
{
  "metric": { "instance": "server01" },
  "values": [[1718200000, "23.4"], [1718200300, "24.1"]]
}
```

Chuyển thành:

```json
{
  "panel": "CPU Usage",
  "unit": "percent",
  "series": [
    {
      "instance": "server01",
      "points": [
        { "time": "2026-06-13T00:00:00Z", "value": 23.4 },
        { "time": "2026-06-13T00:05:00Z", "value": 24.1 }
      ]
    }
  ],
  "summary": { "min": 23.4, "max": 24.1, "avg": 23.75, "latest": 24.1 }
}
```

## CLI

```bash
node fetch-dashboard-metrics.js --uid <uid> --hours 24 --step 300
# Mặc định ghi: jarvis/skills/troubleshooting-dotnet/artifacts/{uid}-{timestamp}.json

# Override biến dashboard (tên lấy từ list-dashboard-vars.js)
node fetch-dashboard-metrics.js \
  --uid <uid> \
  --var <name>=<value>

# Khung thời gian tuyệt đối
node fetch-dashboard-metrics.js \
  --uid dfoxo2zt2lkaof \
  --start 2026-06-12T18:00:00Z \
  --end 2026-06-13T00:00:00Z
```

## Cấu hình

| Biến | Mặc định test |
|---|---|
| `PROMETHEUS_URL` | `http://localhost:9090` |

## Instant query (tùy chọn)

```javascript
import { queryInstant } from "./lib/prometheus.js";

const data = await queryInstant(config, "up", Math.floor(Date.now() / 1000));
```
