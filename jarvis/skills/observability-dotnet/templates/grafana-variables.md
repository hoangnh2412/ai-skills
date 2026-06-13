# Grafana dashboard variables — mẫu

Thay `{service_key}`, `{service_name}`, selector metric theo label **thực tế** trên Prometheus.

## Variables

| Name | Type | Definition |
|---|---|---|
| `service_name` | Custom | `{service_name}` |
| `job` | Query | `label_values(process_memory_usage_bytes{<service_key>="$service_name"}, job)` |
| `instance` | Query | `label_values(process_memory_usage_bytes{<service_key>="$service_name", job=~"$job"}, instance)` |

- Bật **Include All** cho `instance` khi nhiều replica.
- Nếu cluster dùng `exported_job` thay `service_name` — đổi tên variable và selector cho khớp.

## Filter panel

```promql
{<service_key>="$service_name", job=~"$job", instance=~"$instance"}
```

## Panel PromQL (placeholder `{filter}` = filter trên)

| Panel | Query |
|---|---|
| RPS inbound | `sum(rate(http_server_request_duration_seconds_count{filter}[5m]))` |
| Latency avg | `sum(rate(http_server_request_duration_seconds_sum{filter}[5m])) / sum(rate(http_server_request_duration_seconds_count{filter}[5m]))` |
| P99 | `histogram_quantile(0.99, sum(rate(http_server_request_duration_seconds_bucket{filter}[5m])) by (le))` |
| RPS outbound | `sum(rate(http_client_request_duration_seconds_count{filter}[5m]))` |
| RAM | `process_memory_usage_bytes{filter}` |
| GC committed | `process_runtime_dotnet_gc_committed_memory_size_bytes{filter}` |
| Alloc rate | `rate(process_runtime_dotnet_gc_allocations_size_bytes_total{filter}[5m])` |
| Gen2 rate | `sum(rate(process_runtime_dotnet_gc_collections_count_total{generation="2", filter}[5m]))` |
| Thread pool queue | `process_runtime_dotnet_thread_pool_queue_length{filter}` |

## Layout

```text
Row HTTP    → RPS in | Latency avg | P99 | RPS out
Row Memory  → RAM | GC committed | Alloc rate | Gen2
Row Runtime → Thread pool queue
```
