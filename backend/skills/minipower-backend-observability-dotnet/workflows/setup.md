# Setup — full pipeline metric .NET

Checklist end-to-end. Đánh dấu từng bước; không chuyển alert trước khi Grafana có data.

## Checklist

```text
- [ ] 1. App OTEL metric (workflows/otel-app.md)
- [ ] 2. Collector / scrape path (workflows/prometheus.md)
- [ ] 3. Prometheus target UP + Explore có series
- [ ] 4. Grafana dashboard + variables (workflows/grafana.md)
- [ ] 5. Baseline 7 ngày ghi nhận (workflows/operate.md)
- [ ] 6. Alert rules + Alertmanager route (workflows/alerts.md)
- [ ] 7. Test notify + runbook (workflows/operate.md)
```

## Thứ tự bắt buộc

1. **Metric xuất hiện trên Prometheus** — không tạo dashboard/alert khi Explore trống.
2. **Dashboard + baseline** — ngưỡng alert lấy từ số liệu thực, không copy ngưỡng mẫu.
3. **Alert** — bắt đầu `severity: warning`, `for:` đủ dài tránh flapping.
4. **Runbook** — mỗi `alertname` có 1 dòng “kiểm tra gì / làm gì”.

## Input cần từ user / repo

| Thông tin | Ví dụ placeholder |
|---|---|
| `{service_name}` | Tên OTEL service |
| Scrape pattern | Collector vs `/metrics` trực tiếp |
| `{memory_limit_bytes}` | Limit container/pod |
| Kênh notify | Slack, email, PagerDuty |
| Môi trường | staging trước production |

## Output

- Link hoặc path dashboard Grafana
- Path rule file Prometheus + Alertmanager
- Bảng metric ↔ panel ↔ alert (generic, không gắn tên app cụ thể)
