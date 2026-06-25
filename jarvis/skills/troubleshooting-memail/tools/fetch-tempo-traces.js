#!/usr/bin/env node

/**
 * Fetch Tempo traces via Grafana datasource proxy.
 *
 * Usage:
 *   node fetch-tempo-traces.js --trace-id <id>
 *   node fetch-tempo-traces.js --traceql '{ resource.service.name = "mEmailConsumer" }'
 *   node fetch-tempo-traces.js --tag service.name=mEmailConsumer --tag correlation.id=uuid
 *   node fetch-tempo-traces.js --explore-url '<grafana-explore-url>'
 *
 * Environment:
 *   GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD, TEMPO_DATASOURCE_UID
 */

import fs from "node:fs/promises";
import path from "node:path";
import {
  loadConfig,
  parseArgs,
  parseTimeRange,
  resolveOutputPath,
  unixToIso,
} from "./lib/config.js";
import {
  describeExploreInput,
  parseExploreInput,
} from "./lib/grafana-explore-url.js";
import {
  buildTagsLogfmt,
  getTraceById,
  normalizeSearchResponse,
  normalizeTraceResponse,
  searchTraces,
} from "./lib/tempo.js";

const args = parseArgs(process.argv.slice(2));

const hasDirectQuery =
  args["trace-id"] ||
  args.traceql ||
  args.tags ||
  args.tag ||
  args["explore-url"] ||
  process.env.TEMPO_TRACEQL ||
  process.env.TEMPO_TAGS;

if (!hasDirectQuery) {
  console.error(`Usage: node fetch-tempo-traces.js [options]

Modes (chọn một):
  --trace-id <id>             Lấy trace đầy đủ theo trace ID
  --traceql <query>           Search bằng TraceQL
  --tags <logfmt>             Search bằng tags logfmt: service.name="foo" key=value
  --tag <key=value>           Search tag (lặp được, ghép thành logfmt)
  --explore-url <url>         Parse Grafana Explore URL (Tempo)

Options:
  --datasource-uid <uid>      Tempo datasource UID (default: TEMPO_DATASOURCE_UID)
  --minutes <n>               Khung thời gian search (default: 30)
  --hours <n>                 Khung thời gian search: N giờ gần nhất
  --start <iso|unix|now-30m>  Bắt đầu (search)
  --end <iso|unix|now>        Kết thúc (default: now)
  --from / --to               Alias của --start / --end
  --limit <n>                 Max traces khi search (default: 20)
  --min-duration <duration>   VD: 100ms, 1s
  --max-duration <duration>
  --fetch-traces              Sau search, lấy full span cho từng trace ID
  --grafana-url <url>         Override GRAFANA_URL
  --output <file>             Ghi JSON (default: ../artifacts/tempo-{timestamp}.json)
  --slug <name>               Tiền tố tên file output
  --dry-run                   In request metadata, không gọi API

Environment:
  GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD
  TEMPO_DATASOURCE_UID, TEMPO_TRACEQL, TEMPO_TAGS, TEMPO_LIMIT, MINUTES, START, END

Examples:
  node fetch-tempo-traces.js --trace-id abc123def456...

  node fetch-tempo-traces.js \\
    --traceql '{ resource.service.name = "Minvoice.mEmailConsumer.Production" }' \\
    --minutes 60 --fetch-traces

  node fetch-tempo-traces.js \\
    --tag service.name=Minvoice.mEmailConsumer.Production \\
    --tag correlation.id=5ba60d5c-f0c4-4a4a-adff-f761630f56c1 \\
    --minutes 30
`);
  process.exit(1);
}

const config = loadConfig({
  grafanaUrl: args["grafana-url"],
  tempoDatasourceUid: args["datasource-uid"],
  tempoLimit: args.limit ? Number(args.limit) : undefined,
  minutes: args.minutes ? Number(args.minutes) : undefined,
});

let mode;
let traceId = args["trace-id"];
let traceql = args.traceql ?? process.env.TEMPO_TRACEQL;
let tags = args.tags ?? process.env.TEMPO_TAGS;
let datasourceUid = config.tempoDatasourceUid;
let range;
let exploreMeta;
const fetchTraces = !!args["fetch-traces"];

if (args.tag) {
  const tagList = Array.isArray(args.tag) ? args.tag : [args.tag];
  tags = buildTagsLogfmt(tagList);
}

if (args["explore-url"]) {
  try {
    const parsed = parseExploreInput(args["explore-url"]);
    if (parsed.datasourceType !== "tempo") {
      console.error(
        `Error: Explore URL is for ${parsed.datasourceType}, not tempo. Use fetch-loki-logs.js for Loki.`
      );
      process.exit(1);
    }

    exploreMeta = describeExploreInput(parsed);
    datasourceUid = datasourceUid || parsed.datasourceUid;
    range = {
      start: parsed.timeRange.start,
      end: parsed.timeRange.end,
    };

    const tempo = parsed.tempo;
    if (tempo.mode === "traceId") {
      mode = "traceId";
      traceId = traceId ?? tempo.traceId;
    } else if (tempo.mode === "traceql") {
      mode = "search";
      traceql = traceql ?? tempo.traceql;
    } else {
      mode = "search";
      tags = tags ?? tempo.tags;
    }
  } catch (err) {
    console.error(`Error parsing explore URL: ${err.message}`);
    process.exit(1);
  }
}

if (traceId) {
  mode = "traceId";
} else if (!mode) {
  mode = "search";
}

if (!range && mode === "search") {
  try {
    range = parseTimeRange(args, { defaultMinutes: config.minutes });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (mode === "search" && !traceql?.trim() && !tags?.trim()) {
  console.error(
    "Error: search requires --traceql, --tags, --tag, TEMPO_TRACEQL, TEMPO_TAGS, or --explore-url"
  );
  process.exit(1);
}

if (mode === "traceId" && !traceId?.trim()) {
  console.error("Error: --trace-id is required for trace lookup");
  process.exit(1);
}

const requestMeta = {
  grafanaUrl: config.grafanaUrl,
  datasourceUid,
  mode,
  traceId: traceId?.trim(),
  traceql: traceql?.trim(),
  tags: tags?.trim(),
  timeRange: range
    ? {
        start: unixToIso(range.start),
        end: unixToIso(range.end),
        startUnix: range.start,
        endUnix: range.end,
      }
    : undefined,
  limit: config.tempoLimit,
  minDuration: args["min-duration"],
  maxDuration: args["max-duration"],
  fetchTraces,
  explore: exploreMeta,
};

if (args["dry-run"]) {
  console.log(JSON.stringify({ dryRun: true, request: requestMeta }, null, 2));
  process.exit(0);
}

async function main() {
  let report;

  if (mode === "traceId") {
    console.error(`Fetching trace ${traceId.trim()} via ${config.grafanaUrl}...`);
    console.error(`Datasource UID: ${datasourceUid}`);

    const raw = await getTraceById(config, {
      traceId,
      datasourceUid,
    });

    report = normalizeTraceResponse(raw, { request: requestMeta });
    report = { ...report, summary: report.trace.summary };
  } else {
    console.error(`Searching Tempo via ${config.grafanaUrl}...`);
    console.error(`Datasource UID: ${datasourceUid}`);
    if (traceql) console.error(`TraceQL: ${traceql.trim()}`);
    if (tags) console.error(`Tags: ${tags.trim()}`);
    console.error(
      `Time range: ${requestMeta.timeRange.start} → ${requestMeta.timeRange.end}`
    );
    console.error(`Limit: ${config.tempoLimit}`);

    const raw = await searchTraces(config, {
      traceql,
      tags,
      start: range.start,
      end: range.end,
      limit: config.tempoLimit,
      minDuration: args["min-duration"],
      maxDuration: args["max-duration"],
      datasourceUid,
    });

    report = normalizeSearchResponse(raw, { request: requestMeta });

    if (fetchTraces && report.traces.length > 0) {
      console.error(`Fetching ${report.traces.length} trace(s)...`);
      const details = [];

      for (const t of report.traces) {
        const rawTrace = await getTraceById(config, {
          traceId: t.traceId,
          datasourceUid,
        });
        details.push(
          normalizeTraceResponse(rawTrace, {
            request: { ...requestMeta, traceId: t.traceId },
          }).trace
        );
      }

      report = {
        ...report,
        mode: "search+traces",
        traceDetails: details,
        summary: {
          ...report.summary,
          fetchedTraceCount: details.length,
          totalSpans: details.reduce((n, t) => n + (t.summary?.spanCount ?? 0), 0),
        },
      };
    }
  }

  const outputPath = resolveOutputPath(args, "tempo");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");

  console.error(`Wrote → ${outputPath}`);
  console.log(
    JSON.stringify(
      {
        output: outputPath,
        mode: report.mode,
        summary: report.summary,
        request: {
          mode: requestMeta.mode,
          traceId: requestMeta.traceId,
          traceql: requestMeta.traceql,
          tags: requestMeta.tags,
          timeRange: requestMeta.timeRange,
        },
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
