#!/usr/bin/env node

/**
 * Parse Grafana Explore URL → LogQL + datasource + time range (no API call).
 *
 * Usage:
 *   node parse-explore-url.js --url '<grafana-explore-url>'
 *   node parse-explore-url.js --left '<left-json>'
 */

import {
  describeExploreInput,
  parseExploreInput,
} from "./lib/grafana-explore-url.js";
import { parseArgs } from "./lib/config.js";

const args = parseArgs(process.argv.slice(2));
const input = args.url ?? args.left ?? args.u;

if (!input) {
  console.error(`Usage: node parse-explore-url.js --url <grafana-explore-url>

Options:
  --url <url>     Full Grafana Explore URL (có param left=...)
  --left <json>   Raw JSON từ param left (không cần URL đầy đủ)

Output: JSON mô tả datasource type (loki/tempo), query, time range — không gọi API.
`);
  process.exit(1);
}

try {
  const parsed = parseExploreInput(input);
  console.log(JSON.stringify(describeExploreInput(parsed), null, 2));
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
