# Pipeline metric .NET

## Luồng dữ liệu

```text
┌─────────────────┐     OTLP      ┌──────────────────┐    scrape     ┌─────────────┐
│  ASP.NET Core   │ ────────────► │ OTEL Collector   │ ────────────► │ Prometheus  │
│  (SDK + export) │               │ (optional relay) │               │ (TSDB)      │
└─────────────────┘               └──────────────────┘               └──────┬──────┘
                                                                              │
                    ┌─────────────────────────────────────────────────────────┤
                    ▼                         ▼                                 ▼
              ┌──────────┐           ┌──────────────┐                  ┌─────────────┐
              │ Grafana  │           │ Rule eval    │                  │ Recording   │
              │ panels   │           │ (alerting)   │                  │ rules (opt) │
              └──────────┘           └──────┬───────┘                  └─────────────┘
                                            ▼
                                     ┌──────────────┐
                                     │ Alertmanager │
                                     │ route/notify │
                                     └──────────────┘
```

## Trách nhiệm từng tầng

| Tầng | Trách nhiệm | Verify |
|---|---|---|
| App | Instrumentation, resource attributes, OTLP endpoint | Metric xuất hiện ở collector hoặc `/metrics` |
| Collector | Nhận OTLP, relabel, expose Prometheus scrape | Target `up` + sample query có series |
| Prometheus | Scrape interval, retention, rule_files | **Targets** UP; Explore có `{service_name=...}` |
| Grafana | Datasource Prometheus, variables, panels | Panel có data; variables resolve |
| Alert | Recording/alerting rules, for/duration | **Alerts** Inactive khi bình thường; test notify |
| Vận hành | Baseline, silence, runbook | Post-deploy verify § operate workflow |

## Label convention (khuyến nghị)

| Label | Nguồn | Dùng cho |
|---|---|---|
| `service.name` / `service_name` | OTEL resource | Filter chính mọi query |
| `job` | Prometheus scrape config | Variable dashboard |
| `instance` | Scrape target (host:port / pod) | Drill-down theo replica |

Thống nhất **một** tên service giữa OTEL resource, scrape relabel và Grafana variable.

## Hai pattern scrape phổ biến

1. **OTLP → Collector → Prometheus scrape collector** — khuyến nghị khi nhiều service, cần relabel tập trung.
2. **App expose `/metrics` (Prometheus exporter)** — đơn giản hơn; vẫn cần cùng label convention.

Chọn một pattern cho toàn cluster; không trộn label khác nhau giữa service cùng loại.
