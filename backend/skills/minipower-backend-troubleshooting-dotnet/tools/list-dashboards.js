#!/usr/bin/env node

/**
 * List Grafana dashboards (helper to find dashboard UID).
 *
 * Usage:
 *   node list-dashboards.js [--query dotnet]
 */

import { loadConfig, parseArgs } from "./lib/config.js";
import { searchDashboards } from "./lib/grafana.js";

const args = parseArgs(process.argv.slice(2));
const config = loadConfig({
  grafanaUrl: args["grafana-url"],
});

async function main() {
  const dashboards = await searchDashboards(config, args.query ?? "");

  if (dashboards.length === 0) {
    console.log("No dashboards found.");
    return;
  }

  console.log("UID\tTitle\tFolder");
  for (const d of dashboards) {
    console.log(`${d.uid}\t${d.title}\t${d.folderTitle ?? ""}`);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
