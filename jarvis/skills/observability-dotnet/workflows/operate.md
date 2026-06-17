# Vận hành — baseline, verify, runbook

## Baseline (trước alert & sau deploy lớn)

Ghi snapshot (cùng `{service_name}`, cùng time range 24h):

| Metric | Ghi nhận |
|---|---|
| `process_memory_usage_bytes` | Min / max / trend |
| GC committed | Plateau hay monotonic |
| Thread pool queue | Idle ≈ 0? |
| RPS inbound | Peak vs idle |
| P99 latency | Baseline cho alert |

Lưu vào runbook hoặc dashboard annotation — dùng thay placeholder `$BASELINE_*` trong rule.

## Quy trình verify sau deploy fix

1. **T+0:** snapshot baseline (bảng trên).
2. **T+24h:** committed memory — tăng monotonic → điều tra GC / leak.
3. **Load test có chủ đích:** correlate RPS, P99, thread pool, alloc rate, RAM.
4. **Post-fix:** lặp bước 1–3; so sánh trước/sau.

## Runbook khi alert firing (mẫu)

| Alert (pattern) | Kiểm tra ngay | Hành động |
|---|---|---|
| High RAM | Dashboard Memory; `kubectl top pod` | Restart nếu > limit bền; heap dump |
| Committed growth | GC panels | Phân tích allocation; dev escalate |
| Thread pool | Queue + P99 HTTP | Giảm concurrency; async audit |
| High P99 | Trace OTEL | Slow dependency / DB |
| Gen2 pressure | Correlation với traffic burst | Review large object / export |

## Silence & maintenance

- Alertmanager **Silence** khi load test / deploy có kế hoạch — ghi `comment`, matcher `service=...`, thời hạn rõ.
- Không silence vô hạn production alert.

## Tooling bổ sung (ngoài metric liên tục)

`dotnet-counters`, `dotnet-gcdump` — dùng **khi metric chỉ anomaly**, không thay pipeline OTEL.

## Handoff troubleshooting

Khi cần số liệu chi tiết từ dashboard cho AI phân tích → [troubleshooting-dotnet](../../troubleshooting-dotnet/SKILL.md).
