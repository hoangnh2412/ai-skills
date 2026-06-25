---
name: troubleshooting-memail
description: Troubleshoot mEmail services bằng log Loki và trace Tempo/Grafana — parse Explore URL, query LogQL/TraceQL, lấy log theo correlation-id, trace theo ID hoặc tags. Dùng khi debug mEmailConsumer production, distributed tracing, hoặc correlate log ↔ trace.
metadata:
  audience: hoangnh
  workflow: github
---

# Troubleshooting mEmail — Loki logs & Tempo traces

Skill hỗ trợ **thu thập log (Loki)** và **trace (Tempo)** qua Grafana proxy — troubleshooting mEmail (consumer, worker, email pipeline).

Hướng dẫn người dùng: [README.md](README.md).

## Luồng Loki

```text
1. Parse Explore URL (optional)  → LogQL + datasource UID + time range
2. Query Loki                    → GET .../loki/api/v1/query_range
3. Ghi file                      → artifacts/loki-{timestamp}.json
```

Chi tiết: [tools/loki/README.md](tools/loki/README.md).

## Luồng Tempo

```text
1. Parse Explore URL (optional)  → traceId / TraceQL / tags + datasource UID
2a. GET .../api/traces/{id}      → full spans (mode traceId)
2b. GET .../api/search           → danh sách trace (tags hoặc TraceQL)
3. (optional) --fetch-traces     → lấy spans cho từng trace từ search
4. Ghi file                      → artifacts/tempo-{timestamp}.json
```

Chi tiết: [tools/tempo/README.md](tools/tempo/README.md).

## Quy tắc quan trọng — agent KHÔNG đọc nội dung log/trace

**Người dùng tự chạy tool và phân tích file output.** Agent:

- ✅ Hướng dẫn lệnh CLI, parse Explore URL, giải thích LogQL / TraceQL
- ✅ In metadata stdout (`summary`, `output` path, `timeRange`)
- ❌ **Không đọc** file `artifacts/*.json` chứa log lines hoặc spans
- ❌ **Không đọc** response body từ API Loki/Tempo
- ❌ **Không gọi** fetch tools để lấy dữ liệu production rồi phân tích nội dung

## Tool Node.js

Thư mục: [tools/](tools/)

### Loki

```bash
cd jarvis/skills/troubleshooting-memail/tools

node parse-explore-url.js --url '<grafana-explore-url>'
node fetch-loki-logs.js --explore-url '<loki-explore-url>'
node fetch-loki-logs.js \
  --query '{job="Minvoice.mEmailConsumer.Production"} |= `correlation-id` | json' \
  --minutes 30
```

### Tempo

```bash
# Trace theo ID (từ log trace_id hoặc Grafana)
node fetch-tempo-traces.js --trace-id <trace-id>

# Search theo tags
node fetch-tempo-traces.js \
  --tag service.name=Minvoice.mEmailConsumer.Production \
  --tag correlation.id=<uuid> \
  --minutes 30

# TraceQL + lấy full spans
node fetch-tempo-traces.js \
  --traceql '{ resource.service.name = "Minvoice.mEmailConsumer.Production" }' \
  --fetch-traces

# Từ Explore URL
node fetch-tempo-traces.js --explore-url '<tempo-explore-url>'

# Dry-run
node fetch-tempo-traces.js --trace-id '...' --dry-run
```

**Yêu cầu:** Node.js ≥ 14 (không cần `npm install`).

## Query thường gặp

### LogQL (Loki)

| Mục đích | LogQL mẫu |
|---|---|
| Log theo correlation ID | `{job="Minvoice.mEmailConsumer.Production"} \|= \`<id>\` \| json` |
| Lọc Error | `... \| json \| level="Error"` |

### Tempo

| Mục đích | Cách query |
|---|---|
| Trace theo ID | `--trace-id <id>` |
| Search theo service | `--tag service.name=Minvoice.mEmailConsumer.Production` |
| Search TraceQL | `--traceql '{ resource.service.name = "..." }'` |
| Correlate từ log | Lấy `trace_id` trong log → `--trace-id` |

## Correlate Loki ↔ Tempo

```text
1. fetch-loki-logs.js  → tìm trace_id / correlation-id trong log JSON
2. fetch-tempo-traces.js --trace-id <id>  → xem span timeline
```

Hoặc search Tempo trực tiếp theo tag `correlation.id` nếu app instrument OTEL attribute.

## Quy tắc khi hỗ trợ troubleshooting

- Explore URL Loki → `fetch-loki-logs.js`; Tempo → `fetch-tempo-traces.js`
- `parse-explore-url.js` tự nhận `datasourceType` (loki/tempo)
- Không có kết quả → mở rộng time range, kiểm tra tag/label names
- Query lỗi → `--dry-run`, kiểm tra datasource UID và auth Grafana
