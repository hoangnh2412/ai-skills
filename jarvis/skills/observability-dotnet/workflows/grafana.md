# Grafana — dashboard & biến

## Mục tiêu

Dashboard time series phục vụ vận hành và troubleshooting; biến templating khớp label Prometheus.

## Bước 1: Datasource

Grafana → **Connections** → **Data sources** → Prometheus trỏ backend scrape OTEL.

## Bước 2: Variables

Chạy Explore trước — lấy **tên label thực** (có thể là `service_name`, `exported_job`, …).

| Variable | Type | Gợi ý definition |
|---|---|---|
| `{service_key}` | Custom hoặc constant | Giá trị service cố định hoặc dropdown |
| `job` | Query | `label_values(<selector>, job)` |
| `instance` | Query | `label_values(<selector>, instance)` — **Include All** nếu multi-replica |

Template chi tiết: [templates/grafana-variables.md](../templates/grafana-variables.md).

Filter chung mọi panel:

```promql
{<service_key>="$service_name", job=~"$job", instance=~"$instance"}
```

## Bước 3: Nhóm panel khuyến nghị

| Row | Panels | Unit |
|---|---|---|
| HTTP | RPS inbound, latency avg, P99, RPS outbound | reqps, s |
| Memory | RAM process, GC committed, alloc rate, Gen2 rate | bytes, Bps, ops |
| Runtime | Thread pool queue | short |

PromQL mẫu theo họ metric: [reference/metric-families.md](../reference/metric-families.md).

## Bước 4: Cấu hình dashboard

- Refresh: 30s–1m
- Time range mặc định: Last 24 hours
- Folder: Ops / `{Product}` — tách staging vs production

## Annotation (tùy chọn)

Đánh dấu deploy, load test, incident — correlate spike trên row HTTP + Memory.

## Verify

- Mỗi panel có series (không “No data”)
- Đổi variable `instance` → series thay đổi đúng replica

## Liên quan troubleshooting

Sau khi dashboard ổn định, agent có thể dùng [troubleshooting-dotnet](../../troubleshooting-dotnet/SKILL.md) để export JSON metrics theo UID dashboard.
