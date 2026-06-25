/**
 * Parse Grafana Explore URL → Loki LogQL hoặc Tempo trace query.
 *
 * Loki:
 *   left={"datasource":"...","queries":[{"expr":"{job=...}","datasource":{"type":"loki"}}],...}
 *
 * Tempo:
 *   left={"queries":[{"queryType":"traceId","query":"<id>"}],...}
 */
import { parseRelativeTime } from "./config.js";
import { buildTagsLogfmt } from "./tempo.js";

/**
 * @param {string} input - Full Explore URL or raw `left` JSON string
 */
export function parseExploreInput(input) {
  const trimmed = String(input).trim();
  if (!trimmed) {
    throw new Error("Explore URL or left JSON is required");
  }

  const leftJson = extractLeftJson(trimmed);
  const left = JSON.parse(leftJson);

  const datasourceUid = resolveDatasourceUid(left);
  const datasourceType = detectDatasourceType(left);
  const timeRange = parseExploreTimeRange(left.range);

  if (datasourceType === "tempo") {
    return {
      datasourceType,
      datasourceUid,
      timeRange,
      tempo: parseTempoQueries(left.queries ?? []),
      raw: left,
    };
  }

  const loki = parseLokiQueries(left.queries ?? []);
  if (!loki.primaryQuery) {
    throw new Error("No LogQL expr found in Explore URL queries[]");
  }

  return {
    datasourceType: "loki",
    datasourceUid,
    timeRange,
    queries: loki.queries,
    primaryQuery: loki.primaryQuery,
    raw: left,
  };
}

function resolveDatasourceUid(left) {
  const uid =
    left.datasource?.uid ??
    left.datasource ??
    left.queries?.[0]?.datasource?.uid;

  if (!uid) {
    throw new Error("Could not find datasource UID in Explore URL");
  }

  return String(uid);
}

function detectDatasourceType(left) {
  const q = left.queries?.[0];
  const type = q?.datasource?.type ?? left.datasource?.type;

  if (type === "tempo") return "tempo";
  if (type === "loki") return "loki";

  if (
    q?.queryType === "traceId" ||
    q?.queryType === "traceql" ||
    q?.queryType === "search" ||
    q?.queryType === "nativeSearch"
  ) {
    return "tempo";
  }

  if (typeof q?.expr === "string" && q.expr.trim()) {
    return "loki";
  }

  throw new Error(
    "Unknown datasource type in Explore URL (expected loki or tempo)"
  );
}

function parseExploreTimeRange(range = {}) {
  const from = range.from ?? "now-30m";
  const to = range.to ?? "now";

  return {
    from,
    to,
    start: parseRelativeTime(from),
    end: parseRelativeTime(to),
  };
}

function parseLokiQueries(queries) {
  const parsed = queries
    .map((q) => ({
      refId: q.refId,
      expr: q.expr ?? q.query,
      queryType: q.queryType,
      datasource: q.datasource,
    }))
    .filter((q) => typeof q.expr === "string" && q.expr.trim());

  return {
    queries: parsed,
    primaryQuery: parsed[0]?.expr?.trim(),
  };
}

function parseTempoQueries(queries) {
  const q = queries[0] ?? {};
  const queryType = q.queryType ?? "search";

  if (queryType === "traceId") {
    const traceId = String(q.query ?? q.traceId ?? "").trim();
    if (!traceId) {
      throw new Error("Tempo traceId query is empty in Explore URL");
    }
    return { mode: "traceId", traceId, queryType, queries };
  }

  if (queryType === "traceql") {
    const traceql = String(q.query ?? q.expr ?? "").trim();
    if (!traceql) {
      throw new Error("Tempo TraceQL query is empty in Explore URL");
    }
    return { mode: "traceql", traceql, queryType, queries };
  }

  // search / nativeSearch — filters[] hoặc query string
  const filters = q.filters ?? [];
  const tagEntries = filters
    .filter((f) => f.tag && f.value !== undefined && f.value !== "")
    .map((f) => `${f.tag}=${f.value}`);

  if (tagEntries.length > 0) {
    return {
      mode: "search",
      tags: buildTagsLogfmt(tagEntries),
      filters,
      queryType,
      queries,
    };
  }

  const tags = String(q.query ?? "").trim();
  if (tags) {
    return { mode: "search", tags, queryType, queries };
  }

  throw new Error(
    "No Tempo search criteria found in Explore URL (traceId, traceql, or filters)"
  );
}

function extractLeftJson(input) {
  if (input.startsWith("{")) {
    return input;
  }

  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid Explore URL");
  }

  const left = url.searchParams.get("left");
  if (!left) {
    throw new Error('Explore URL missing "left" query parameter');
  }

  return decodeURIComponent(left);
}

/**
 * Human-readable summary (safe to print — no trace/log content).
 */
export function describeExploreInput(parsed) {
  const timeRange = {
    from: parsed.timeRange.from,
    to: parsed.timeRange.to,
    start: new Date(parsed.timeRange.start * 1000).toISOString(),
    end: new Date(parsed.timeRange.end * 1000).toISOString(),
  };

  if (parsed.datasourceType === "tempo") {
    const tempo = parsed.tempo;
    return {
      datasourceType: "tempo",
      datasourceUid: parsed.datasourceUid,
      mode: tempo.mode,
      traceId: tempo.traceId,
      traceql: tempo.traceql,
      tags: tempo.tags,
      queryType: tempo.queryType,
      timeRange,
    };
  }

  return {
    datasourceType: "loki",
    datasourceUid: parsed.datasourceUid,
    query: parsed.primaryQuery,
    queries: parsed.queries.map((q) => ({
      refId: q.refId,
      expr: q.expr,
    })),
    timeRange,
  };
}
