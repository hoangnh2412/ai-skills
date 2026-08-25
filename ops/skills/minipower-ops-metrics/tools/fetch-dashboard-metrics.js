#!/usr/bin/env node

/**
 * Fetch metrics from all Grafana dashboard panels via Prometheus query_range.
 *
 * Usage:
 *   node fetch-dashboard-metrics.js --uid <dashboard-uid> [--hours 24] [--step 300]
 *
 * Environment:
 *   GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD, PROMETHEUS_URL
 */

import path from "node:path";
import { buildVariableOverrides, loadConfig, parseArgs, parseTimeRange, resolveOutputPath } from "./lib/config.js";
import {
  collectPanels,
  fetchDashboard,
} from "./lib/grafana.js";
import { buildReport, normalizePanelMetrics } from "./lib/normalize.js";
import { queryRange } from "./lib/prometheus.js";
import {
  findUnresolvedVariables,
  substituteVariables,
} from "./lib/templating.js";
import { resolveTemplateVariables } from "./lib/variable-resolver.js";

const args = parseArgs(process.argv.slice(2));

if (!args.uid) {
  console.error(`Usage: node fetch-dashboard-metrics.js --uid <dashboard-uid> [options]

Options:
  --uid <uid>                 Grafana dashboard UID (required)
  --var <name=value>          Override biến dashboard (lặp được; tên lấy từ list-dashboard-vars.js)
  --hours <n>                 Khung thời gian tương đối: N giờ gần nhất (default: 24)
  --start <iso|unix>          Khung thời gian tuyệt đối: bắt đầu
  --end <iso|unix>            Khung thời gian tuyệt đối: kết thúc (default: now)
  --from <iso|unix>           Alias của --start
  --to <iso|unix>             Alias của --end
  --step <seconds>            Prometheus step (default: 300 = 5 min)
  --grafana-url <url>         Override GRAFANA_URL
  --prometheus-url <url>      Override PROMETHEUS_URL
  --output <file>             Ghi JSON ra file (default: ../artifacts/{uid}-{timestamp}.json)
  --panel <title>             Filter panels by title (substring match)
  --dry-run                   Print resolved queries without querying Prometheus

Environment:
  GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD, PROMETHEUS_URL
  DASHBOARD_VARS (job=foo,instance=bar), DASHBOARD_VAR_<name>, HOURS, START, END
`);
  process.exit(1);
}

const config = loadConfig({
  grafanaUrl: args["grafana-url"],
  prometheusUrl: args["prometheus-url"],
  stepSeconds: args.step ? Number(args.step) : undefined,
});

let range;
try {
  range = parseTimeRange(args, { stepSeconds: config.stepSeconds });
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

const variableOverrides = buildVariableOverrides(args);
const panelFilter = args.panel?.toLowerCase();

async function main() {
  console.error(
    `Fetching dashboard uid=${args.uid} from ${config.grafanaUrl}...`
  );
  console.error(
    `Time range: ${new Date(range.start * 1000).toISOString()} → ${new Date(range.end * 1000).toISOString()} (step ${range.step}s)`
  );
  if (Object.keys(variableOverrides).length) {
    console.error(`Variable overrides: ${JSON.stringify(variableOverrides)}`);
  }

  const response = await fetchDashboard(config, args.uid);
  const dashboard = response.dashboard;
  const meta = response.meta;

  const variables = await resolveTemplateVariables(
    config,
    dashboard,
    range,
    variableOverrides
  );
  const allPanels = collectPanels(dashboard.panels);

  const panelsWithTargets = allPanels.filter((p) => p.targets.length > 0);
  const filteredPanels = panelFilter
    ? panelsWithTargets.filter((p) =>
        p.title.toLowerCase().includes(panelFilter)
      )
    : panelsWithTargets;

  console.error(
    `Found ${filteredPanels.length} panel(s) with PromQL targets (${Object.keys(variables).length} template variables)`
  );

  if (args["dry-run"]) {
    for (const panel of filteredPanels) {
      console.log(`\n# ${panel.title}`);
      for (const target of panel.targets) {
        const resolved = substituteVariables(target.expr, variables, {
          stepSeconds: config.stepSeconds,
          start: range.start,
          end: range.end,
        });
        const unresolved = findUnresolvedVariables(resolved);
        console.log(`  [${target.refId ?? "?"}] ${resolved}`);
        if (unresolved.length) {
          console.log(`    WARNING unresolved: ${unresolved.join(", ")}`);
        }
      }
    }
    return;
  }

  const panelResults = [];

  for (const panel of filteredPanels) {
    for (const target of panel.targets) {
      const resolvedExpr = substituteVariables(target.expr, variables, {
        stepSeconds: config.stepSeconds,
        start: range.start,
        end: range.end,
      });

      const unresolved = findUnresolvedVariables(resolvedExpr);
      if (unresolved.length) {
        panelResults.push({
          panel: panel.title,
          panelId: panel.id,
          expr: resolvedExpr,
          refId: target.refId,
          error: `Unresolved variables: ${unresolved.join(", ")}`,
        });
        continue;
      }

      try {
        console.error(`  Querying: ${panel.title} [${target.refId ?? "?"}]`);
        const data = await queryRange(config, resolvedExpr, range);
        panelResults.push(
          normalizePanelMetrics(panel, data, {
            expr: resolvedExpr,
            refId: target.refId,
          })
        );
      } catch (err) {
        panelResults.push({
          panel: panel.title,
          panelId: panel.id,
          expr: resolvedExpr,
          refId: target.refId,
          error: err.message,
        });
      }
    }
  }

  const report = buildReport({
    dashboardUid: args.uid,
    dashboardTitle: meta?.title ?? dashboard.title,
    timeRange: range,
    variables,
    panels: panelResults,
  });

  const json = JSON.stringify(report, null, 2);

  const { mkdir, writeFile } = await import("node:fs/promises");
  const outputPath = resolveOutputPath(args);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, json, "utf8");
  console.error(`Written to ${outputPath}`);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
