# Prometheus — scrape & lưu trữ

## Mục tiêu

Prometheus scrape được metric OTEL với label nhất quán.

## Bước 1: Xác định target

| Pattern | Scrape target |
|---|---|
| OTEL Collector | Port exporter Prometheus trên collector (ví dụ `:8889`) |
| App trực tiếp | `{host}:{port}/metrics` |

Template job: [templates/prometheus-scrape.yaml](../templates/prometheus-scrape.yaml).

## Bước 2: Relabel (nếu cần)

- Gắn `job` mô tả role (ví dụ `otel-collector`, `{service_name}-api`)
- Giữ `instance` = target scrape
- Không drop label `service_name` / `service.name` từ OTEL

## Bước 3: Verify

```text
Prometheus UI → Status → Targets     → state UP
Prometheus UI → Explore              → process_memory_usage_bytes{service_name="<name>"}
```

Ghi lại label thực tế (`job`, `instance`, key service) — dùng cho Grafana variables.

## Rule files

- Đặt rule trong `rule_files` hoặc `PrometheusRule` CR (Operator)
- Reload: lifecycle API hoặc `kubectl apply`
- Chi tiết alert: [workflows/alerts.md](alerts.md)

## Retention & capacity

- Retention phù hợp baseline 7 ngày + incident review
- Cardinality cao → review label trước khi tăng scrape frequency
