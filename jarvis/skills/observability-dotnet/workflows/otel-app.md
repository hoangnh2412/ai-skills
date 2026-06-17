# OTEL metric — ứng dụng ASP.NET Core

## Mục tiêu

App export metric OTLP (hoặc Prometheus exporter) với resource attribute ổn định.

## Jarvis Host

Dùng [telemetry-dotnet](../telemetry-dotnet/SKILL.md):

- `ConfigureMetric()` + instrumentation ASP.NET Core, HttpClient, Process, Runtime
- `OTEL_SERVICE_NAME` hoặc `OTEL:Resource:ServiceName` = `{service_name}`
- Endpoint OTLP qua env — không commit secret

## Metric tối thiểu production

| Instrumentation | Package / API |
|---|---|
| ASP.NET Core | `AddAspNetCoreInstrumentation` |
| HttpClient | `AddHttpClientInstrumentation` |
| Process | `AddProcessInstrumentation` |
| .NET Runtime | `AddRuntimeInstrumentation` |

## Resource attributes

```text
service.name     = {service_name}   # bắt buộc — filter dashboard
deployment.environment = staging|production
service.version  = {version}       # tùy chọn — correlate deploy
```

## Verify app

1. Chạy app staging; gửi vài request HTTP.
2. Collector/backend nhận OTLP (log exporter debug hoặc metrics endpoint).
3. Prometheus query: metric HTTP + process có label `service_name` (hoặc label tương đương cluster).

## Custom metric

Chỉ thêm khi họ metric chuẩn không đủ — qua `IMetricInstrumentation` (telemetry-dotnet). Giữ cardinality thấp.

## Không làm

- Không gắn alert trước bước verify Prometheus
- Không dùng tag request-id / user-id trên counter/gauge
