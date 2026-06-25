# troubleshooting-memail

Skill AI hỗ trợ **troubleshooting mEmail** bằng log Loki và trace Tempo/Grafana.

Agent đọc [SKILL.md](./SKILL.md) khi thực thi.

## Khi nào dùng

| Tình huống | Hành động |
|---|---|
| Trace email theo correlation / message ID (log) | [fetch-loki-logs.js](./tools/fetch-loki-logs.js) |
| Xem distributed trace theo trace ID | [fetch-tempo-traces.js](./tools/fetch-tempo-traces.js) `--trace-id` |
| Tìm trace theo service / correlation tag | `fetch-tempo-traces.js` `--tag` hoặc `--traceql` |
| Đã có link Grafana Explore | `--explore-url` hoặc `parse-explore-url.js` |
| Kiểm tra query trước khi gọi API | `--dry-run` |

## Cách gọi

Gọi skill bằng `@jarvis/skills/troubleshooting-memail/SKILL.md`, kèm **Explore URL hoặc query + Grafana auth**.

### Prompt mẫu — log theo correlation ID

```bash
cd jarvis/skills/troubleshooting-memail/tools

GRAFANA_URL=https://monitor-mpetro.minvoice.com.vn \
GRAFANA_USER=admin \
GRAFANA_PASSWORD='***' \
node fetch-loki-logs.js \
  --query '{job="Minvoice.mEmailConsumer.Production"} |= `5ba60d5c-f0c4-4a4a-adff-f761630f56c1` | json' \
  --minutes 30
```

### Prompt mẫu — Tempo trace theo ID

```bash
node fetch-tempo-traces.js \
  --trace-id <trace-id-from-log> \
  --datasource-uid <tempo-uid>
```

### Prompt mẫu — search Tempo + lấy spans

```bash
node fetch-tempo-traces.js \
  --tag service.name=Minvoice.mEmailConsumer.Production \
  --tag correlation.id=5ba60d5c-f0c4-4a4a-adff-f761630f56c1 \
  --minutes 60 \
  --fetch-traces
```

**Prompt gợi ý:**

```text
@jarvis/skills/troubleshooting-memail/SKILL.md

Debug mEmail — correlation ID: 5ba60d5c-f0c4-4a4a-adff-f761630f56c1
- Lấy log Loki 30 phút
- Search Tempo theo correlation tag, fetch full trace nếu có

Cho lệnh CLI. Tôi tự chạy và đọc artifacts/.
```

## Tool Node.js

```bash
cd jarvis/skills/troubleshooting-memail/tools

# Parse Explore URL (Loki hoặc Tempo)
node parse-explore-url.js --url '<grafana-explore-url>'

# Loki
node fetch-loki-logs.js --explore-url '<loki-url>'
node fetch-loki-logs.js --query '...' --minutes 30

# Tempo
node fetch-tempo-traces.js --trace-id '<id>'
node fetch-tempo-traces.js --tag service.name=... --tag correlation.id=... --minutes 30
node fetch-tempo-traces.js --traceql '{ ... }' --fetch-traces
node fetch-tempo-traces.js --explore-url '<tempo-url>'

# Dry-run
node fetch-tempo-traces.js --trace-id '...' --dry-run
```

Cấu hình: [tools/.env.example](./tools/.env.example).

Output: `artifacts/loki-*.json` / `artifacts/tempo-*.json` — **người dùng tự đọc**; agent không đọc nội dung.

## Cấu trúc

```text
troubleshooting-memail/
├── SKILL.md
├── README.md
├── artifacts/
└── tools/
    ├── fetch-loki-logs.js
    ├── fetch-tempo-traces.js      # CLI Tempo
    ├── parse-explore-url.js
    ├── lib/
    │   ├── config.js
    │   ├── loki.js
    │   ├── tempo.js
    │   └── grafana-explore-url.js
    ├── loki/README.md
    ├── tempo/README.md
    └── .env.example
```
