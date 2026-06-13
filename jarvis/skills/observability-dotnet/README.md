# observability-dotnet

Skill AI hướng dẫn **thiết lập observability (metric pipeline)** cho service .NET: OpenTelemetry → Prometheus → Grafana → Alert → vận hành.

Agent đọc [SKILL.md](./SKILL.md) khi thực thi.

## Khi nào dùng

| Tình huống | Workflow |
|---|---|
| Service .NET mới cần metric production | [workflows/setup.md](workflows/setup.md) |
| Chỉ bật OTEL metric trên app | [workflows/otel-app.md](workflows/otel-app.md) |
| Prometheus chưa scrape được metric | [workflows/prometheus.md](workflows/prometheus.md) |
| Tạo / cập nhật dashboard Grafana | [workflows/grafana.md](workflows/grafana.md) |
| Gắn alert RAM, latency, GC, thread pool | [workflows/alerts.md](workflows/alerts.md) |
| Baseline, verify sau deploy, runbook | [workflows/operate.md](workflows/operate.md) |

## Cách gọi

```text
@jarvis/skills/observability-dotnet/SKILL.md

Thiết lập observability cho API .NET {Product}:
- OTEL export qua collector
- Prometheus scrape + Grafana dashboard (HTTP, memory, GC, thread pool)
- Alert cơ bản + route Alertmanager
```

```text
@jarvis/skills/observability-dotnet/workflows/grafana.md

Tạo dashboard Grafana với biến service_name / job / instance cho service backend mới.
```

## Phân biệt với skill khác

| Skill | Phạm vi |
|---|---|
| **observability-dotnet** (skill này) | Pipeline hạ tầng + dashboard + alert + vận hành |
| [telemetry-dotnet](../telemetry-dotnet/README.md) | Code Jarvis.OpenTelemetry trong Host |
| [troubleshooting-dotnet](../troubleshooting-dotnet/README.md) | Lấy & phân tích metric khi sự cố |

## Cấu trúc

```text
observability-dotnet/
├── SKILL.md
├── README.md
├── workflows/
│   ├── setup.md
│   ├── otel-app.md
│   ├── prometheus.md
│   ├── grafana.md
│   ├── alerts.md
│   └── operate.md
├── reference/
│   ├── pipeline.md
│   └── metric-families.md
└── templates/
    ├── prometheus-scrape.yaml
    ├── prometheus-rules.yaml
    ├── alertmanager-route.yaml
    └── grafana-variables.md
```
