/**
 * Load config from environment variables and CLI overrides.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import https from "node:https";

export function loadConfig(overrides = {}) {
  const grafanaUrl = (
    overrides.grafanaUrl ??
    process.env.GRAFANA_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");

  const prometheusUrl = (
    overrides.prometheusUrl ??
    process.env.PROMETHEUS_URL ??
    "http://localhost:9090"
  ).replace(/\/$/, "");

  return {
    grafanaUrl,
    grafanaUser: overrides.grafanaUser ?? process.env.GRAFANA_USER ?? "admin",
    grafanaPassword:
      overrides.grafanaPassword ?? process.env.GRAFANA_PASSWORD ?? "",
    prometheusUrl,
    stepSeconds: overrides.stepSeconds ?? 300,
    hours: overrides.hours ?? 24,
  };
}

/**
 * Parse ISO8601 or Unix timestamp to Unix seconds.
 */
export function parseTimeInput(value) {
  if (value === undefined || value === null || value === "") {
    throw new Error("Time value is required");
  }

  const trimmed = String(value).trim();

  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    return n > 1e12 ? Math.floor(n / 1000) : n;
  }

  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid time: ${value}`);
  }

  return Math.floor(ms / 1000);
}

/**
 * Build time range from CLI args or env.
 *
 * Relative: --hours 24 (default)
 * Absolute: --start / --from + optional --end / --to
 */
export function parseTimeRange(args, { stepSeconds = 300, defaultHours = 24 } = {}) {
  const startArg = args.start ?? args.from ?? process.env.START;
  const endArg = args.end ?? args.to ?? process.env.END;

  if (startArg || endArg) {
    const end = endArg
      ? parseTimeInput(endArg)
      : Math.floor(Date.now() / 1000);

    if (!startArg) {
      throw new Error("--start (or --from) is required when using absolute time range");
    }

    const start = parseTimeInput(startArg);
    if (start >= end) {
      throw new Error(
        `Invalid time range: start must be before end (${unixToIso(start)} >= ${unixToIso(end)})`
      );
    }

    return { start, end, step: stepSeconds };
  }

  const hours = Number(
    args.hours ?? process.env.HOURS ?? defaultHours
  );

  if (!Number.isFinite(hours) || hours <= 0) {
    throw new Error("--hours must be a positive number");
  }

  return timeRange(hours, stepSeconds);
}

/**
 * CLI/env overrides for Grafana dashboard template variables.
 * Dùng --var <tên_biến_dashboard>=<value> — tên lấy từ list-dashboard-vars.js.
 */
export function buildVariableOverrides(args) {
  const overrides = {};
  applyVarOverrides(overrides, args);
  applyEnvVarOverrides(overrides);
  return overrides;
}

function applyEnvVarOverrides(overrides) {
  if (process.env.DASHBOARD_VARS) {
    for (const part of process.env.DASHBOARD_VARS.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) {
        throw new Error(
          `Invalid DASHBOARD_VARS entry (use name=value): ${trimmed}`
        );
      }
      overrides[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("DASHBOARD_VAR_") || !value) continue;
    overrides[key.slice("DASHBOARD_VAR_".length)] = value;
  }
}

function applyVarOverrides(overrides, args) {
  const vars = args.var;
  if (!vars) return;

  const list = Array.isArray(vars) ? vars : [vars];
  for (const entry of list) {
    const eq = entry.indexOf("=");
    if (eq <= 0) {
      throw new Error(`Invalid --var format (use name=value): ${entry}`);
    }
    overrides[entry.slice(0, eq)] = entry.slice(eq + 1);
  }
}

/**
 * Basic auth header for Grafana API.
 */
export function grafanaAuthHeader(user, password) {
  const token = Buffer.from(`${user}:${password}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

/**
 * Fetch JSON with error details (Node built-in http/https).
 */
export function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === "https:" ? https : http;

    const req = transport.request(
      parsed,
      {
        method: options.method ?? "GET",
        headers: options.headers ?? {},
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(
              new Error(
                `HTTP ${res.statusCode} for ${url}\n${body.slice(0, 500)}`
              )
            );
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(new Error(`Invalid JSON from ${url}: ${err.message}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.end();
  });
}

/**
 * Parse simple CLI flags: --uid foo --hours 24
 */
export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      if (args[key] !== undefined) {
        if (!Array.isArray(args[key])) {
          args[key] = [args[key]];
        }
        args[key].push(next);
      } else {
        args[key] = next;
      }
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

/**
 * Unix timestamp range for the last N hours.
 */
export function timeRange(hours, stepSeconds = 300) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - hours * 3600;
  return { start, end, step: stepSeconds };
}

/**
 * ISO 8601 from Unix seconds.
 */
export function unixToIso(unixSeconds) {
  return new Date(Number(unixSeconds) * 1000).toISOString();
}

const ARTIFACTS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../artifacts"
);

/**
 * Default artifacts folder for fetch-dashboard-metrics output.
 */
export function getArtifactsDir() {
  return ARTIFACTS_DIR;
}

/**
 * Resolve output file path. Default: artifacts/{uid}-{timestamp}.json
 */
export function resolveOutputPath(args) {
  if (args.output) {
    return path.resolve(args.output);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeUid = String(args.uid).replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(ARTIFACTS_DIR, `${safeUid}-${timestamp}.json`);
}
