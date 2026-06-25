/**
 * Loki query_range via Grafana datasource proxy.
 */
import { fetchJson, grafanaAuthHeader } from "./config.js";

/**
 * GET /api/datasources/proxy/uid/{uid}/loki/api/v1/query_range
 */
export async function queryRange(
  config,
  { query, start, end, datasourceUid, limit, direction }
) {
  const uid = datasourceUid || config.lokiDatasourceUid;
  if (!uid) {
    throw new Error(
      "Loki datasource UID is required (--datasource-uid or LOKI_DATASOURCE_UID)"
    );
  }

  if (!query?.trim()) {
    throw new Error("LogQL query is required");
  }

  const params = new URLSearchParams({
    query: query.trim(),
    start: String(Number(start) * 1_000_000_000),
    end: String(Number(end) * 1_000_000_000),
    limit: String(limit ?? config.limit ?? 5000),
    direction: direction ?? config.direction ?? "backward",
  });

  const url = `${config.grafanaUrl}/api/datasources/proxy/uid/${encodeURIComponent(uid)}/loki/api/v1/query_range?${params}`;

  return fetchJson(url, {
    headers: {
      Accept: "application/json",
      ...grafanaAuthHeader(config.grafanaUser, config.grafanaPassword),
    },
  });
}

/**
 * GET /api/datasources/uid/{uid} — verify datasource exists (optional helper).
 */
export async function fetchDatasource(config, datasourceUid) {
  const uid = datasourceUid || config.lokiDatasourceUid;
  const url = `${config.grafanaUrl}/api/datasources/uid/${encodeURIComponent(uid)}`;
  return fetchJson(url, {
    headers: {
      Accept: "application/json",
      ...grafanaAuthHeader(config.grafanaUser, config.grafanaPassword),
    },
  });
}

/**
 * Normalize Loki streams response for downstream analysis.
 */
export function normalizeLokiResponse(raw, meta = {}) {
  const result = raw?.data?.result ?? [];
  const streams = [];

  for (const item of result) {
    const labels = item.stream ?? {};
    const entries = (item.values ?? []).map(([ts, line]) => ({
      timestamp: nsToIso(ts),
      line,
    }));

    streams.push({ labels, entries });
  }

  const totalEntries = streams.reduce((n, s) => n + s.entries.length, 0);

  return {
    ...meta,
    status: raw?.status ?? "unknown",
    resultType: raw?.data?.resultType,
    streams,
    summary: {
      streamCount: streams.length,
      totalEntries,
    },
    stats: raw?.data?.stats,
  };
}

function nsToIso(ns) {
  const ms = Math.floor(Number(ns) / 1_000_000);
  return new Date(ms).toISOString();
}
