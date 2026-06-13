# Họ metric khuyến nghị — .NET API

Dùng khi thiết kế dashboard và alert. Tên metric có thể khác nhẹ theo exporter (OTEL semantic convention vs legacy); verify trên Prometheus **Explore** trước khi gắn panel.

## HTTP (ASP.NET Core instrumentation)

| Metric | Loại | Panel / alert gợi ý |
|---|---|---|
| `http_server_request_duration_seconds_count` | Counter | RPS inbound — `rate(...[5m])` |
| `http_server_request_duration_seconds_sum` | Counter | Latency trung bình — `rate(sum)/rate(count)` |
| `http_server_request_duration_seconds_bucket` | Histogram | P50/P95/P99 — `histogram_quantile` |
| `http_client_request_duration_seconds_count` | Counter | RPS outbound / dependency |

## Process & runtime

| Metric | Loại | Panel / alert gợi ý |
|---|---|---|
| `process_memory_usage_bytes` | Gauge | RAM process; alert % limit container |
| `process_runtime_dotnet_gc_committed_memory_size_bytes` | Gauge | Managed heap committed; trend leak |
| `process_runtime_dotnet_gc_allocations_size_bytes_total` | Counter | Alloc rate — `rate(...[5m])` |
| `process_runtime_dotnet_gc_collections_count_total{generation="2"}` | Counter | Gen2 pressure — `rate(...[15m])` |
| `process_runtime_dotnet_thread_pool_queue_length` | Gauge | Thread pool starvation |

## Dotnet built-in (.NET 9+)

Một số môi trường có thêm prefix `dotnet_*` song song `process_runtime_dotnet_*`. Dashboard có thể dùng regex `{__name__=~"dotnet_gc_.*|process_runtime_dotnet_gc_.*"}` khi cần tương thích.

## Filter PromQL chung

```promql
{service_name="$service_name", job=~"$job", instance=~"$instance"}
```

Thay label key nếu cluster dùng `exported_job` / `exported_instance` — **lấy label thực từ Prometheus**, không đoán.

## Metric chưa có

Ghi rõ gap (ví dụ queue depth nội bộ, cache hit rate) → đề xuất custom `IMetricInstrumentation` qua [telemetry-dotnet](../telemetry-dotnet/SKILL.md) — không giả vờ có series trên dashboard.
