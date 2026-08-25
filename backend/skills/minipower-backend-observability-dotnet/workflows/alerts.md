# Alert — Prometheus rules & Alertmanager

## Mục tiêu

Cảnh báo sớm RAM, GC, latency, thread pool — ngưỡng dựa trên **baseline thực**, không copy số cố định.

## Pipeline

```text
Prometheus (evaluate rules) → Alertmanager (route) → Slack / Email / PagerDuty
```

Grafana Alerting có thể dùng song song; runbook này ưu tiên **Prometheus rule files + Alertmanager**.

## Chuẩn bị

1. Prometheus đã scrape metric — filter `{service_name="<name>"}` (hoặc label tương đương).
2. Ghi baseline 7 ngày từ Grafana: P99, Gen2 rate, RAM idle.
3. Có `{memory_limit_bytes}` container/pod hoặc query kube-state-metrics.
4. Alertmanager endpoint + receiver (webhook placeholder → thay production).

## Alert khuyến nghị (generic)

| Alert | Ý tưởng query | Gợi ý `for` | Gắn hành động |
|---|---|---|---|
| High RAM | `process_memory_usage_bytes / limit` | 15m | Restart pod nếu bền; heap dump |
| Committed growth | `delta(gc_committed[6h]) / offset` | 30m | Phân tích GC / leak managed |
| Thread pool | `thread_pool_queue_length > N` | 5m | Giảm concurrency; sync-over-async |
| High P99 | `histogram_quantile(0.99, ...)` vs baseline | 10m | Trace slow span |
| Gen2 pressure | `rate(gc_collections gen2)` vs baseline | 15m | Review allocation burst |

Template YAML: [templates/prometheus-rules.yaml](../templates/prometheus-rules.yaml).

## Labels rule

```yaml
labels:
  severity: warning
  service: "{service_name}"
  team: ops | dev
annotations:
  summary: "..."
  description: "..."
  runbook_url: "<link runbook>"
```

## Alertmanager routing

Template: [templates/alertmanager-route.yaml](../templates/alertmanager-route.yaml).

- `group_by`: alertname, service, instance
- Route theo `service`, `team`
- `inhibit_rules` tùy cluster (ví dụ RAM cao suppress warning cùng instance)

## Verify end-to-end

| Bước | Kỳ vọng |
|---|---|
| Prometheus → Rules | Nhóm rule hiển thị, state evaluate |
| Prometheus → Alerts | Inactive khi bình thường |
| Alertmanager target | UP |
| Test notify | Staging: hạ ngưỡng tạm hoặc `amtool alert add` |

## Query thử trước khi gắn rule

Chạy từng expr trên Explore; xác nhận không empty và không fire liên tục ở idle.
