#!/usr/bin/env node

/**
 * List template variables for a Grafana dashboard.
 * Use output `name` with fetch-dashboard-metrics.js --var name=value
 *
 * Usage:
 *   node list-dashboard-vars.js --uid <dashboard-uid>
 */

import { loadConfig, parseArgs } from "./lib/config.js";
import { describeTemplateVariables, fetchDashboard } from "./lib/grafana.js";

const args = parseArgs(process.argv.slice(2));

if (!args.uid) {
  console.error(`Usage: node list-dashboard-vars.js --uid <dashboard-uid>

Lists templating variables from dashboard JSON. Pass values with:
  node fetch-dashboard-metrics.js --uid <uid> --var <name>=<value>

Environment: GRAFANA_URL, GRAFANA_USER, GRAFANA_PASSWORD
`);
  process.exit(1);
}

const config = loadConfig({
  grafanaUrl: args["grafana-url"],
});

async function main() {
  const response = await fetchDashboard(config, args.uid);
  const dashboard = response.dashboard;
  const variables = describeTemplateVariables(dashboard);

  const result = {
    uid: args.uid,
    title: response.meta?.title ?? dashboard.title,
    variables,
    examples: variables.map(
      (v) => `--var ${v.name}=<${v.label ?? v.name}>`
    ),
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
