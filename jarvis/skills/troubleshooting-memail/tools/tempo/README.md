# Tempo API — lấy trace qua Grafana proxy

Bước trong luồng troubleshooting mEmail distributed tracing.

## Endpoints

Grafana proxy tới Tempo:

```http
# Lấy trace theo ID
GET /api/datasources/proxy/uid/{tempo-datasource-uid}/api/traces/{traceId}
Authorization: Basic <base64(user:password)>

# Search traces (tags logfmt)
GET /api/datasources/proxy/uid/{uid}/api/search
  ?tags=service.name="Minvoice.mEmailConsumer.Production" correlation.id=uuid
  &start=<unix-seconds>
  &end=<unix-seconds>
  &limit=20

# Search bằng TraceQL
GET .../api/search?q={ resource.service.name = "..." }
```

Module: [lib/tempo.js](../lib/tempo.js)

## CLI

```bash
# Trace theo ID (copy từ Grafana Tempo / log trace_id)
node fetch-tempo-traces.js --trace-id abc123def4567890...

# Search theo tags
node fetch-tempo-traces.js \
  --tag service.name=Minvoice.mEmailConsumer.Production \
  --tag correlation.id=5ba60d5c-f0c4-4a4a-adff-f761630f56c1 \
  --minutes 30

# Search TraceQL + lấy full spans
node fetch-tempo-traces.js \
  --traceql '{ resource.service.name = "Minvoice.mEmailConsumer.Production" }' \
  --hours 1 \
  --fetch-traces

# Từ Explore URL
node fetch-tempo-traces.js --explore-url '<grafana-tempo-explore-url>'

# Dry-run
node fetch-tempo-traces.js --trace-id '...' --dry-run
```

## Output chuẩn

**Search** (`artifacts/tempo-{timestamp}.json`):

```json
{
  "mode": "search",
  "traces": [
    {
      "traceId": "...",
      "rootServiceName": "...",
      "rootTraceName": "...",
      "startTime": "...",
      "durationMs": 123
    }
  ],
  "summary": { "traceCount": 1 }
}
```

**Trace by ID** hoặc `--fetch-traces`:

```json
{
  "mode": "trace",
  "trace": {
    "traceId": "...",
    "spans": [
      {
        "spanId": "...",
        "name": "...",
        "service": "...",
        "durationMs": 45,
        "attributes": { "http.status_code": 200 }
      }
    ],
    "summary": { "spanCount": 12, "services": ["..."], "durationMs": 340 }
  }
}
```

## Cấu hình

| Biến | Mô tả |
|---|---|
| `TEMPO_DATASOURCE_UID` | UID datasource Tempo trong Grafana |
| `TEMPO_LIMIT` | Số trace tối đa khi search (20) |
| `TEMPO_TRACEQL` / `TEMPO_TAGS` | Query mặc định |

Xem [`.env.example`](../.env.example).

## Correlate Loki ↔ Tempo

1. Loki log có `trace_id` / `TraceId` trong JSON → `fetch-tempo-traces.js --trace-id <id>`
2. Hoặc search Tempo theo `correlation.id` / `message.id` tag nếu app gắn OTEL attribute
