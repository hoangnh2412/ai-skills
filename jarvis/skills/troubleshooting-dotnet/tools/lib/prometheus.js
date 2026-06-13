import { fetchJson } from "./config.js";

/**
 * GET /api/v1/query_range
 */
export async function queryRange(config, query, { start, end, step }) {
  const params = new URLSearchParams({
    query,
    start: String(start),
    end: String(end),
    step: String(step),
  });

  const url = `${config.prometheusUrl}/api/v1/query_range?${params}`;
  const body = await fetchJson(url, {
    headers: { Accept: "application/json" },
  });

  if (body.status !== "success") {
    throw new Error(
      `Prometheus query failed: ${body.error ?? body.status ?? "unknown error"}`
    );
  }

  return body.data;
}

/**
 * GET /api/v1/query — instant query (optional).
 */
export async function queryInstant(config, query, time) {
  const params = new URLSearchParams({ query });
  if (time !== undefined) params.set("time", String(time));

  const url = `${config.prometheusUrl}/api/v1/query?${params}`;
  const body = await fetchJson(url, {
    headers: { Accept: "application/json" },
  });

  if (body.status !== "success") {
    throw new Error(
      `Prometheus instant query failed: ${body.error ?? body.status ?? "unknown error"}`
    );
  }

  return body.data;
}

/**
 * Check Prometheus is reachable.
 */
export async function healthCheck(config) {
  const url = `${config.prometheusUrl}/-/healthy`;
  try {
    await fetchJson(url);
    return true;
  } catch {
    return false;
  }
}
