/**
 * Load config from environment variables and CLI overrides.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import https from "node:https";

const TOOLS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

/**
 * Load tools/.env into process.env (không ghi đè biến shell đã có).
 * Node không tự đọc .env — cần gọi trước khi đọc process.env.
 */
export function loadDotEnv(envPath = path.join(TOOLS_DIR, ".env")) {
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const withoutExport = trimmed.startsWith("export ")
      ? trimmed.slice(7).trim()
      : trimmed;

    const eq = withoutExport.indexOf("=");
    if (eq <= 0) continue;

    const key = withoutExport.slice(0, eq).trim();
    let value = withoutExport.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

export function loadConfig(overrides = {}) {
  const grafanaUrl = (
    overrides.grafanaUrl ??
    process.env.GRAFANA_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return {
    grafanaUrl,
    grafanaUser: overrides.grafanaUser ?? process.env.GRAFANA_USER ?? "admin",
    grafanaPassword:
      overrides.grafanaPassword ?? process.env.GRAFANA_PASSWORD ?? "",
    lokiDatasourceUid:
      overrides.lokiDatasourceUid ??
      process.env.LOKI_DATASOURCE_UID ??
      "",
    tempoDatasourceUid:
      overrides.tempoDatasourceUid ??
      process.env.TEMPO_DATASOURCE_UID ??
      "",
    limit: overrides.limit ?? Number(process.env.LOKI_LIMIT ?? 5000),
    tempoLimit: overrides.tempoLimit ?? Number(process.env.TEMPO_LIMIT ?? 20),
    direction: overrides.direction ?? process.env.LOKI_DIRECTION ?? "backward",
    minutes: overrides.minutes ?? Number(process.env.MINUTES ?? 30),
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
 * Parse Grafana relative time: now, now-30m, now-1h, now-7d, now-2w.
 */
export function parseRelativeTime(value, nowMs = Date.now()) {
  if (value === undefined || value === null || value === "") {
    throw new Error("Relative time value is required");
  }

  const trimmed = String(value).trim();
  if (trimmed === "now") {
    return Math.floor(nowMs / 1000);
  }

  const match = /^now-(\d+)([smhdwMy])$/.exec(trimmed);
  if (!match) {
    return parseTimeInput(trimmed);
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const unitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  }[unit];

  if (!unitMs) {
    throw new Error(`Unsupported relative time unit: ${unit}`);
  }

  return Math.floor((nowMs - amount * unitMs) / 1000);
}

/**
 * Build time range from CLI args or env.
 *
 * Relative: --minutes 30 (default) or --hours 1
 * Absolute: --start / --from + optional --end / --to
 * Grafana: --from now-30m --to now
 */
export function parseTimeRange(args, { defaultMinutes = 30 } = {}) {
  const startArg = args.start ?? args.from ?? process.env.START;
  const endArg = args.end ?? args.to ?? process.env.END;

  if (startArg || endArg) {
    const isRelative = (v) =>
      typeof v === "string" && (v === "now" || v.startsWith("now-"));

    const end = endArg
      ? isRelative(endArg)
        ? parseRelativeTime(endArg)
        : parseTimeInput(endArg)
      : Math.floor(Date.now() / 1000);

    if (!startArg) {
      throw new Error("--start (or --from) is required when using absolute time range");
    }

    const start = isRelative(startArg)
      ? parseRelativeTime(startArg)
      : parseTimeInput(startArg);

    if (start >= end) {
      throw new Error(
        `Invalid time range: start must be before end (${unixToIso(start)} >= ${unixToIso(end)})`
      );
    }

    return { start, end };
  }

  const minutes = Number(
    args.minutes ?? process.env.MINUTES ?? defaultMinutes
  );
  const hours = args.hours ? Number(args.hours) : undefined;

  if (hours !== undefined) {
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error("--hours must be a positive number");
    }
    const end = Math.floor(Date.now() / 1000);
    return { start: end - hours * 3600, end };
  }

  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error("--minutes must be a positive number");
  }

  const end = Math.floor(Date.now() / 1000);
  return { start: end - minutes * 60, end };
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
 * Parse simple CLI flags: --query foo --minutes 30
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
 * ISO 8601 from Unix seconds.
 */
export function unixToIso(unixSeconds) {
  return new Date(Number(unixSeconds) * 1000).toISOString();
}

const ARTIFACTS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../artifacts"
);

export function getArtifactsDir() {
  return ARTIFACTS_DIR;
}

/**
 * Resolve output file path. Default: artifacts/loki-{timestamp}.json
 */
export function resolveOutputPath(args, prefix = "loki") {
  if (args.output) {
    return path.resolve(args.output);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = args.slug
    ? String(args.slug).replace(/[^a-zA-Z0-9_-]/g, "_")
    : prefix;
  return path.join(ARTIFACTS_DIR, `${slug}-${timestamp}.json`);
}
