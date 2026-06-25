# Loki API — lấy log qua Grafana proxy

Bước trong luồng troubleshooting mEmail logs.

## Endpoint

Grafana proxy tới Loki `query_range`:

```http
GET /api/datasources/proxy/uid/{loki-datasource-uid}/loki/api/v1/query_range
  ?query={job="Minvoice.mEmailConsumer.Production"} |= `correlation-id` | json
  &start=<nanoseconds>
  &end=<nanoseconds>
  &limit=5000
  &direction=backward
Authorization: Basic <base64(user:password)>
```

Module: [lib/loki.js](../lib/loki.js) → `queryRange(config, options)`

## Parse Grafana Explore URL

Explore URL chứa param `left` (JSON) với `queries[].expr`, `datasource`, `range`:

```bash
node parse-explore-url.js --url 'https://monitor.../explore?orgId=1&left=...'
```

Module: [lib/grafana-explore-url.js](../lib/grafana-explore-url.js)

Ví dụ LogQL từ Explore:

```logql
{job="Minvoice.mEmailConsumer.Production"} |= `5ba60d5c-f0c4-4a4a-adff-f761630f56c1` | json
```

Time range: `now-30m` → `now`

## CLI

```bash
# Từ Explore URL (copy từ Grafana)
node fetch-loki-logs.js --explore-url '<url>'

# Từ LogQL trực tiếp
node fetch-loki-logs.js \
  --query '{job="Minvoice.mEmailConsumer.Production"} |= `correlation-id` | json' \
  --minutes 30 \
  --datasource-uid b2e2e9f6-64bb-401c-8694-29ad093e15cc

# Chỉ xem metadata request (không gọi API)
node fetch-loki-logs.js --query '...' --dry-run
```

## Output chuẩn

File JSON trong `artifacts/`:

```json
{
  "request": {
    "query": "...",
    "datasourceUid": "...",
    "timeRange": { "start": "...", "end": "..." }
  },
  "streams": [
    {
      "labels": { "job": "...", "level": "..." },
      "entries": [{ "timestamp": "...", "line": "..." }]
    }
  ],
  "summary": { "streamCount": 1, "totalEntries": 42 }
}
```

## Cấu hình

| Biến | Mô tả |
|---|---|
| `GRAFANA_URL` | Base URL Grafana |
| `GRAFANA_USER` / `GRAFANA_PASSWORD` | Basic auth |
| `LOKI_DATASOURCE_UID` | UID datasource Loki |
| `MINUTES` | Khung thời gian mặc định (30) |
| `LOKI_LIMIT` | Số dòng tối đa (5000) |
| `LOKI_DIRECTION` | `backward` (mới nhất trước) hoặc `forward` |

Xem [`.env.example`](../.env.example).
