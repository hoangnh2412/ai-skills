#!/usr/bin/env node

/**
 * Fetch Loki logs via Grafana datasource proxy (query_range).
 *
 * Usage:
 *   node fetch-loki-logs.js --query '{job="..."} |= \`id\` | json' --minutes 30
 *   node fetch-loki-logs.js --explore-url '<grafana-explore-url>'
 *
 * Environment:
 *   GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD, LOKI_DATASOURCE_UID
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
import { normalizeLokiResponse, queryRange } from "./lib/loki.js";

const args = parseArgs(process.argv.slice(2));

if (!args.query && !args.expr && !args["explore-url"] && !process.env.LOGQL) {
  console.error(`Usage: node fetch-loki-logs.js [options]

Options:
  --query <logql>             LogQL query (alias: --expr)
  --explore-url <url>         Grafana Explore URL (parse left= → query + range)
  --datasource-uid <uid>      Loki datasource UID (default: LOKI_DATASOURCE_UID)
  --minutes <n>               Khung thời gian tương đối: N phút gần nhất (default: 30)
  --hours <n>                 Khung thời gian tương đối: N giờ gần nhất
  --start <iso|unix|now-30m>  Khung thời gian tuyệt đối / Grafana relative
  --end <iso|unix|now>        Kết thúc (default: now)
  --from <...>                Alias của --start
  --to <...>                  Alias của --end
  --limit <n>                 Max log lines (default: 5000)
  --direction <forward|backward>  Thứ tự log (default: backward)
  --grafana-url <url>         Override GRAFANA_URL
  --output <file>             Ghi JSON ra file (default: ../artifacts/loki-{timestamp}.json)
  --slug <name>               Tiền tố tên file output
  --dry-run                   In request metadata, không gọi API

Environment:
  GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD
  LOKI_DATASOURCE_UID, LOGQL, MINUTES, START, END, LOKI_LIMIT, LOKI_DIRECTION

Examples:
  node fetch-loki-logs.js \\
    --query '{job="Minvoice.mEmailConsumer.Production"} |= \`5ba60d5c-f0c4-4a4a-adff-f761630f56c1\` | json' \\
    --minutes 30

  node fetch-loki-logs.js --explore-url 'https://monitor.../explore?orgId=1&left=...'
`);
  process.exit(1);
}

const config = loadConfig({
  grafanaUrl: args["grafana-url"],
  lokiDatasourceUid: args["datasource-uid"],
  limit: args.limit ? Number(args.limit) : undefined,
  direction: args.direction,
  minutes: args.minutes ? Number(args.minutes) : undefined,
});

let query = args.query ?? args.expr ?? process.env.LOGQL;
let datasourceUid = config.lokiDatasourceUid;
let range;
let exploreMeta;

if (args["explore-url"]) {
  try {
    const parsed = parseExploreInput(args["explore-url"]);
    if (parsed.datasourceType !== "loki") {
      console.error(
        `Error: Explore URL is for ${parsed.datasourceType}, not loki. Use fetch-tempo-traces.js for Tempo.`
      );
      process.exit(1);
    }
    exploreMeta = describeExploreInput(parsed);
    query = query ?? parsed.primaryQuery;
    datasourceUid = datasourceUid || parsed.datasourceUid;
    range = {
      start: parsed.timeRange.start,
      end: parsed.timeRange.end,
    };
  } catch (err) {
    console.error(`Error parsing explore URL: ${err.message}`);
    process.exit(1);
  }
}

if (!range) {
  try {
    range = parseTimeRange(args, { defaultMinutes: config.minutes });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (!query?.trim()) {
  console.error("Error: LogQL query is required (--query, --expr, LOGQL, or --explore-url)");
  process.exit(1);
}

const requestMeta = {
  grafanaUrl: config.grafanaUrl,
  datasourceUid,
  query: query.trim(),
  timeRange: {
    start: unixToIso(range.start),
    end: unixToIso(range.end),
    startUnix: range.start,
    endUnix: range.end,
  },
  limit: config.limit,
  direction: config.direction,
  explore: exploreMeta,
};

if (args["dry-run"]) {
  console.log(JSON.stringify({ dryRun: true, request: requestMeta }, null, 2));
  process.exit(0);
}

async function main() {
  console.error(`Querying Loki via ${config.grafanaUrl}...`);
  console.error(`Datasource UID: ${datasourceUid}`);
  console.error(`LogQL: ${query.trim()}`);
  console.error(
    `Time range: ${requestMeta.timeRange.start} → ${requestMeta.timeRange.end}`
  );
  console.error(`Limit: ${config.limit}, direction: ${config.direction}`);

  const raw = await queryRange(config, {
    query,
    start: range.start,
    end: range.end,
    datasourceUid,
    limit: config.limit,
    direction: config.direction,
  });

  const report = normalizeLokiResponse(raw, { request: requestMeta });
  const outputPath = resolveOutputPath(args);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");

  console.error(`Wrote ${report.summary.totalEntries} entries (${report.summary.streamCount} streams) → ${outputPath}`);

  // Metadata only on stdout — user/agent reads summary, not full log lines here
  console.log(
    JSON.stringify(
      {
        output: outputPath,
        summary: report.summary,
        timeRange: report.request.timeRange,
        query: report.request.query,
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
